import {
  doc,
  collection,
  onSnapshot,
  runTransaction,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  writeBatch,
  Unsubscribe,
} from "firebase/firestore";
import { getFirebaseFirestore } from "../firebase/client";
import { AUCTION_EVENT_ID } from "../firebase/config";
import {
  Player,
  Franchise,
  TeamState,
  Bid,
  AuctionPhase,
  AuctionStatus,
  AuctionState,
  AuditLog,
} from "../../types/auction";
import { AuctionRepository, FullTournamentState } from "./AuctionRepository";
import { INITIAL_FRANCHISES } from "../../data/franchises";
import { INITIAL_PLAYERS } from "../../data/players";
import { AUCTION_CONSTANTS } from "../constants";
import { getNextBid, validateTeamBid } from "../bidding";
import { playBidChime, playHammerChime, playTimerWarningBeep, playUnsoldChime } from "../sound";
import {
  FirestoreAuctionStateDoc,
  FirestoreTeamDoc,
  FirestorePlayerDoc,
  FirestoreBidDoc,
  FirestoreAuditLogDoc,
} from "../firebase/firestore";

export class FirebaseAuctionRepository implements AuctionRepository {
  private eventId: string;
  private state: FullTournamentState;
  private listeners: Set<(state: FullTournamentState) => void> = new Set();
  private unsubscribers: Unsubscribe[] = [];
  private localTimerInterval: NodeJS.Timeout | null = null;
  private soundEnabled: boolean = true;
  private soldPlayerOverlay: { player: Player; team: Franchise; price: number } | null = null;
  private unsoldPlayerOverlay: Player | null = null;
  private biddingEndsAt: number = 0;

  constructor(eventId: string = AUCTION_EVENT_ID) {
    this.eventId = eventId;
    this.state = this.createInitialEmptyState();
    if (typeof window !== "undefined") {
      this.initFirestoreListeners();
      this.startLocalTimerTick();
    }
  }

  private createInitialEmptyState(): FullTournamentState {
    const teams: Record<string, TeamState> = {};
    INITIAL_FRANCHISES.forEach((franchise) => {
      teams[franchise.id] = {
        franchise,
        remainingPurse: franchise.startingPurse,
        spentPurse: 0,
        squad: [],
        roleCounts: {
          BATTER: 0,
          BOWLER: 0,
          ALL_ROUNDER: 0,
          WICKETKEEPER: 0,
        },
      };
    });

    const players = JSON.parse(JSON.stringify(INITIAL_PLAYERS)) as Player[];

    const auction: AuctionState = {
      phase: "ROUND_1",
      status: "IDLE",
      round: 1,
      currentPlayerId: players[0]?.id || null,
      currentBid: 0,
      leadingTeamId: null,
      timer: AUCTION_CONSTANTS.INITIAL_TIMER_SECONDS,
      isTimerRunning: false,
      bidSequence: 0,
      lastBidAt: null,
      recentBids: [],
      soundEnabled: true,
      soldPlayerOverlay: null,
      unsoldPlayerOverlay: null,
    };

    return {
      auction,
      players,
      teams,
      auditLogs: [],
      backendType: "firebase",
      connectionStatus: "connecting" as any,
    };
  }

  private initFirestoreListeners() {
    const db = getFirebaseFirestore();
    if (!db) {
      this.state.connectionStatus = "offline";
      this.notify();
      return;
    }

    try {
      // 1. Subscribe to Authoritative Auction State
      const auctionStateDocRef = doc(db, "auctionState", this.eventId);
      const unsubAuction = onSnapshot(
        auctionStateDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as FirestoreAuctionStateDoc;
            const now = Date.now();

            // Store authoritative deadline for local timer derivation
            this.biddingEndsAt = data.biddingEndsAt || 0;

            const remainingSeconds = this.biddingEndsAt > 0
              ? Math.max(0, Math.ceil((this.biddingEndsAt - now) / 1000))
              : AUCTION_CONSTANTS.INITIAL_TIMER_SECONDS;

            this.state.auction = {
              phase: data.phase || "ROUND_1",
              status: data.status || "IDLE",
              round: data.round || 1,
              currentPlayerId: data.currentPlayerId || null,
              currentBid: data.currentBid || 0,
              leadingTeamId: data.leadingTeamId || null,
              timer: remainingSeconds,
              isTimerRunning: data.status === "LIVE" && remainingSeconds > 0,
              bidSequence: data.bidSequence || 0,
              lastBidAt: data.lastBidAt || null,
              recentBids: data.recentBids || [],
              soundEnabled: this.soundEnabled,
              soldPlayerOverlay: this.soldPlayerOverlay,
              unsoldPlayerOverlay: this.unsoldPlayerOverlay,
            };

            this.state.connectionStatus = "connected";
            this.notify();
          }
        },
        (error) => {
          console.warn("Firestore auctionState subscription error:", error);
          this.state.connectionStatus = "reconnecting";
          this.notify();
        }
      );
      this.unsubscribers.push(unsubAuction);

      // 2. Subscribe to Teams Collection
      const teamsColRef = collection(db, "events", this.eventId, "teams");
      const unsubTeams = onSnapshot(
        teamsColRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const updatedTeams: Record<string, TeamState> = { ...this.state.teams };
            snapshot.docs.forEach((docSnap) => {
              const teamData = docSnap.data() as FirestoreTeamDoc;
              if (teamData.franchise) {
                updatedTeams[teamData.franchise.id] = {
                  franchise: teamData.franchise,
                  remainingPurse: teamData.remainingPurse,
                  spentPurse: teamData.spentPurse,
                  squad: teamData.squad || [],
                  roleCounts: teamData.roleCounts || {
                    BATTER: 0,
                    BOWLER: 0,
                    ALL_ROUNDER: 0,
                    WICKETKEEPER: 0,
                  },
                };
              }
            });
            this.state.teams = updatedTeams;
            this.notify();
          }
        },
        (error) => {
          console.warn("Firestore teams subscription error:", error);
        }
      );
      this.unsubscribers.push(unsubTeams);

      // 3. Subscribe to Players Collection
      const playersColRef = collection(db, "events", this.eventId, "players");
      const unsubPlayers = onSnapshot(
        playersColRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const playerList: Player[] = [];
            snapshot.docs.forEach((docSnap) => {
              playerList.push(docSnap.data() as Player);
            });
            playerList.sort((a, b) => {
              const idA = parseInt(a.id.replace("p-", ""), 10) || 0;
              const idB = parseInt(b.id.replace("p-", ""), 10) || 0;
              return idA - idB;
            });
            this.state.players = playerList;
            this.notify();
          }
        },
        (error) => {
          console.warn("Firestore players subscription error:", error);
        }
      );
      this.unsubscribers.push(unsubPlayers);

      // 4. Subscribe to Audit Logs (Limit to 50 latest)
      const auditColRef = collection(db, "events", this.eventId, "auditLogs");
      const auditQuery = query(auditColRef, orderBy("timestamp", "desc"), limit(50));
      const unsubAudit = onSnapshot(
        auditQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const logs: AuditLog[] = [];
            snapshot.docs.forEach((docSnap) => {
              logs.push(docSnap.data() as AuditLog);
            });
            this.state.auditLogs = logs;
            this.notify();
          }
        },
        (error) => {
          console.warn("Firestore auditLogs subscription error:", error);
        }
      );
      this.unsubscribers.push(unsubAudit);
    } catch (e) {
      console.warn("Error initializing Firestore listeners:", e);
      this.state.connectionStatus = "offline";
      this.notify();
    }
  }

  // Pure Client-side Clock Tick — always re-derives from authoritative biddingEndsAt
  private startLocalTimerTick() {
    if (this.localTimerInterval) clearInterval(this.localTimerInterval);

    this.localTimerInterval = setInterval(() => {
      const { auction } = this.state;
      if (auction.status === "LIVE" && this.biddingEndsAt > 0) {
        const now = Date.now();
        const remainingSeconds = Math.max(0, Math.ceil((this.biddingEndsAt - now) / 1000));
        const prevTimer = this.state.auction.timer;

        this.state.auction.timer = remainingSeconds;
        this.state.auction.isTimerRunning = remainingSeconds > 0;

        // Play warning beep when crossing the threshold downward
        if (
          remainingSeconds <= AUCTION_CONSTANTS.WARNING_TIMER_SECONDS &&
          remainingSeconds > 0 &&
          remainingSeconds !== prevTimer &&
          this.soundEnabled
        ) {
          playTimerWarningBeep();
        }

        this.notify();
      }
    }, 1000);
  }

  public getState(): FullTournamentState {
    return this.state;
  }

  public subscribe(listener: (state: FullTournamentState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  // ==========================================
  // AUTHORITATIVE ATOMIC BIDDING TRANSACTION
  // ==========================================
  public async placeBid(
    teamId: string,
    expectedAmount?: number
  ): Promise<{ success: boolean; message?: string }> {
    const db = getFirebaseFirestore();
    if (!db) {
      return { success: false, message: "Database connection unavailable." };
    }

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    const teamDocRef = doc(db, "events", this.eventId, "teams", teamId);

    try {
      await runTransaction(db, async (transaction) => {
        const auctionSnap = await transaction.get(auctionDocRef);
        const teamSnap = await transaction.get(teamDocRef);

        if (!auctionSnap.exists() || !teamSnap.exists()) {
          throw new Error("Auction or team document not found.");
        }

        const auctionData = auctionSnap.data() as FirestoreAuctionStateDoc;
        const teamData = teamSnap.data() as FirestoreTeamDoc;

        if (auctionData.status !== "LIVE") {
          throw new Error("Auction is not currently LIVE.");
        }

        // Authoritative deadline enforcement — reject bids after timer expires
        const now = Date.now();
        if (auctionData.biddingEndsAt > 0 && now > auctionData.biddingEndsAt) {
          throw new Error("Bidding window has closed. Timer expired.");
        }

        if (auctionData.leadingTeamId === teamId) {
          throw new Error("Your team already holds the highest bid.");
        }

        if (!auctionData.currentPlayerId) {
          throw new Error("No player is currently on the auction block.");
        }

        const playerDocRef = doc(db, "events", this.eventId, "players", auctionData.currentPlayerId);
        const playerSnap = await transaction.get(playerDocRef);
        if (!playerSnap.exists()) {
          throw new Error("Active player document not found.");
        }
        const playerData = playerSnap.data() as FirestorePlayerDoc;

        const nextValidBid = getNextBid(auctionData.currentBid, playerData.basePrice);

        if (expectedAmount && expectedAmount !== nextValidBid) {
          throw new Error("Bid amount changed. Please submit the latest price.");
        }

        if (teamData.remainingPurse < nextValidBid) {
          throw new Error("Insufficient purse balance for this bid.");
        }

        if (teamData.squad && teamData.squad.length >= AUCTION_CONSTANTS.MAX_SQUAD_SIZE) {
          throw new Error("Squad limit reached (Maximum 11 players).");
        }

        // Compute 10-second countdown reset from now
        const nextBiddingEndsAt = now + AUCTION_CONSTANTS.BID_RESET_TIMER_SECONDS * 1000;

        const newBid: Bid = {
          id: `bid-${now}-${Math.random().toString(36).substring(2, 6)}`,
          playerId: playerData.id,
          teamId: teamData.franchise.id,
          teamName: teamData.franchise.name,
          teamShortName: teamData.franchise.shortName,
          teamColor: teamData.franchise.primaryColor,
          amount: nextValidBid,
          timestamp: now,
          sequence: (auctionData.bidSequence || 0) + 1,
        };

        const updatedRecentBids = [newBid, ...(auctionData.recentBids || []).slice(0, 19)];

        // 1. Update Auction State
        transaction.update(auctionDocRef, {
          currentBid: nextValidBid,
          leadingTeamId: teamId,
          bidSequence: (auctionData.bidSequence || 0) + 1,
          lastBidAt: now,
          biddingEndsAt: nextBiddingEndsAt,
          recentBids: updatedRecentBids,
          updatedAt: now,
        });

        // 2. Append to Bids Collection
        const newBidDocRef = doc(db, "events", this.eventId, "bids", newBid.id);
        transaction.set(newBidDocRef, {
          ...newBid,
          eventId: this.eventId,
          source: "TEAM",
        });

        // 3. Append to Audit Log
        const auditDocRef = doc(
          db,
          "events",
          this.eventId,
          "auditLogs",
          `log-${now}-${Math.random().toString(36).substring(2, 6)}`
        );
        transaction.set(auditDocRef, {
          id: auditDocRef.id,
          eventId: this.eventId,
          timestamp: now,
          action: "PLACE_BID",
          details: `${teamData.franchise.shortName} placed bid ₹${(nextValidBid / 100).toFixed(2)} Cr for ${playerData.name}`,
        });
      });

      if (this.soundEnabled) {
        playBidChime();
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to place bid." };
    }
  }

  // ==========================================
  // AUTHORITATIVE ADMIN PROXY BID
  // ==========================================
  public async placeManualBid(
    teamId: string,
    amountLakhs: number
  ): Promise<{ success: boolean; message?: string }> {
    const db = getFirebaseFirestore();
    if (!db) return { success: false, message: "Database connection unavailable." };

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    const teamDocRef = doc(db, "events", this.eventId, "teams", teamId);

    try {
      await runTransaction(db, async (transaction) => {
        const auctionSnap = await transaction.get(auctionDocRef);
        const teamSnap = await transaction.get(teamDocRef);

        if (!auctionSnap.exists() || !teamSnap.exists()) {
          throw new Error("Auction or team document not found.");
        }

        const auctionData = auctionSnap.data() as FirestoreAuctionStateDoc;
        const teamData = teamSnap.data() as FirestoreTeamDoc;

        // Admin safety rails
        if (amountLakhs <= auctionData.currentBid) {
          throw new Error(`Proxy bid (₹${amountLakhs}L) must exceed current bid (₹${auctionData.currentBid}L).`);
        }

        if (teamData.remainingPurse < amountLakhs) {
          throw new Error(`${teamData.franchise.shortName} has insufficient purse (₹${teamData.remainingPurse}L) for ₹${amountLakhs}L bid.`);
        }

        if (!auctionData.currentPlayerId) {
          throw new Error("No player is currently on the auction block.");
        }

        const playerDocRef = doc(db, "events", this.eventId, "players", auctionData.currentPlayerId);
        const playerSnap = await transaction.get(playerDocRef);
        if (!playerSnap.exists()) {
          throw new Error("Active player document not found.");
        }
        const playerData = playerSnap.data() as FirestorePlayerDoc;

        const now = Date.now();
        const nextBiddingEndsAt = now + AUCTION_CONSTANTS.BID_RESET_TIMER_SECONDS * 1000;

        const newBid: Bid = {
          id: `bid-manual-${now}`,
          playerId: playerData.id,
          teamId: teamData.franchise.id,
          teamName: teamData.franchise.name,
          teamShortName: teamData.franchise.shortName,
          teamColor: teamData.franchise.primaryColor,
          amount: amountLakhs,
          timestamp: now,
          sequence: (auctionData.bidSequence || 0) + 1,
        };

        transaction.update(auctionDocRef, {
          currentBid: amountLakhs,
          leadingTeamId: teamId,
          bidSequence: (auctionData.bidSequence || 0) + 1,
          lastBidAt: now,
          biddingEndsAt: nextBiddingEndsAt,
          recentBids: [newBid, ...(auctionData.recentBids || []).slice(0, 19)],
          updatedAt: now,
        });

        const newBidDocRef = doc(db, "events", this.eventId, "bids", newBid.id);
        transaction.set(newBidDocRef, {
          ...newBid,
          eventId: this.eventId,
          source: "ADMIN_PROXY",
        });

        const auditDocRef = doc(
          db,
          "events",
          this.eventId,
          "auditLogs",
          `log-${now}-${Math.random().toString(36).substring(2, 6)}`
        );
        transaction.set(auditDocRef, {
          id: auditDocRef.id,
          eventId: this.eventId,
          timestamp: now,
          action: "MANUAL_BID",
          details: `Admin proxy bid for ${teamData.franchise.shortName}: ₹${(amountLakhs / 100).toFixed(2)} Cr`,
        });
      });

      if (this.soundEnabled) {
        playBidChime();
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to place proxy bid." };
    }
  }

  // ==========================================
  // AUTHORITATIVE HAMMER SOLD TRANSACTION
  // ==========================================
  public async markSold(
    overrideTeamId?: string,
    overridePrice?: number
  ): Promise<{ success: boolean; message?: string }> {
    const db = getFirebaseFirestore();
    if (!db) return { success: false, message: "Database connection unavailable." };

    const auctionDocRef = doc(db, "auctionState", this.eventId);

    try {
      let finalSoldOverlayData: any = null;

      await runTransaction(db, async (transaction) => {
        const auctionSnap = await transaction.get(auctionDocRef);
        if (!auctionSnap.exists()) throw new Error("Auction state document not found.");

        const auctionData = auctionSnap.data() as FirestoreAuctionStateDoc;
        const winningTeamId = overrideTeamId || auctionData.leadingTeamId;
        const winningPrice = overridePrice || auctionData.currentBid;

        if (!auctionData.currentPlayerId || !winningTeamId || winningPrice <= 0) {
          throw new Error("No active player or valid leading bid to sell to.");
        }

        const teamDocRef = doc(db, "events", this.eventId, "teams", winningTeamId);
        const playerDocRef = doc(db, "events", this.eventId, "players", auctionData.currentPlayerId);

        const teamSnap = await transaction.get(teamDocRef);
        const playerSnap = await transaction.get(playerDocRef);

        if (!teamSnap.exists() || !playerSnap.exists()) {
          throw new Error("Winning team or player record not found.");
        }

        const teamData = teamSnap.data() as FirestoreTeamDoc;
        const playerData = playerSnap.data() as FirestorePlayerDoc;

        if (winningPrice < playerData.basePrice) {
          throw new Error(`Winning price (₹${winningPrice}L) cannot be below base price (₹${playerData.basePrice}L).`);
        }

        const now = Date.now();

        // 1. Update Player Doc
        const updatedPlayer: Player = {
          ...playerData,
          status: "SOLD",
          soldTo: winningTeamId,
          soldPrice: winningPrice,
        };
        transaction.update(playerDocRef, {
          status: "SOLD",
          soldTo: winningTeamId,
          soldPrice: winningPrice,
          updatedAt: now,
        });

        // 2. Update Team Doc
        const newSquad = [...(teamData.squad || []), updatedPlayer];
        const newRoleCounts = { ...(teamData.roleCounts || { BATTER: 0, BOWLER: 0, ALL_ROUNDER: 0, WICKETKEEPER: 0 }) };
        newRoleCounts[playerData.role] = (newRoleCounts[playerData.role] || 0) + 1;

        transaction.update(teamDocRef, {
          remainingPurse: teamData.remainingPurse - winningPrice,
          spentPurse: teamData.spentPurse + winningPrice,
          squad: newSquad,
          roleCounts: newRoleCounts,
          updatedAt: now,
        });

        // 3. Update Auction State
        transaction.update(auctionDocRef, {
          status: "SOLD",
          biddingEndsAt: 0,
          updatedAt: now,
        });

        // 4. Audit Log
        const auditDocRef = doc(
          db,
          "events",
          this.eventId,
          "auditLogs",
          `log-${now}-${Math.random().toString(36).substring(2, 6)}`
        );
        transaction.set(auditDocRef, {
          id: auditDocRef.id,
          eventId: this.eventId,
          timestamp: now,
          action: "HAMMER_SOLD",
          details: `SOLD! ${playerData.name} sold to ${teamData.franchise.name} for ₹${(winningPrice / 100).toFixed(2)} Cr`,
        });

        finalSoldOverlayData = {
          player: updatedPlayer,
          team: teamData.franchise,
          price: winningPrice,
        };
      });

      this.soldPlayerOverlay = finalSoldOverlayData;
      this.state.auction.soldPlayerOverlay = finalSoldOverlayData;
      this.state.auction.status = "SOLD";

      if (this.soundEnabled) {
        playHammerChime();
      }

      this.notify();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to mark player SOLD." };
    }
  }

  // ==========================================
  // AUTHORITATIVE MARK UNSOLD
  // ==========================================
  public async markUnsold(): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);

    try {
      let unsoldPlayer: Player | null = null;

      await runTransaction(db, async (transaction) => {
        const auctionSnap = await transaction.get(auctionDocRef);
        if (!auctionSnap.exists()) return;

        const auctionData = auctionSnap.data() as FirestoreAuctionStateDoc;
        if (!auctionData.currentPlayerId) return;

        const playerDocRef = doc(db, "events", this.eventId, "players", auctionData.currentPlayerId);
        const playerSnap = await transaction.get(playerDocRef);
        if (!playerSnap.exists()) return;

        const playerData = playerSnap.data() as FirestorePlayerDoc;
        const now = Date.now();

        transaction.update(playerDocRef, {
          status: "UNSOLD",
          soldTo: null,
          soldPrice: null,
          updatedAt: now,
        });

        transaction.update(auctionDocRef, {
          status: "UNSOLD",
          biddingEndsAt: 0,
          updatedAt: now,
        });

        const auditDocRef = doc(
          db,
          "events",
          this.eventId,
          "auditLogs",
          `log-${now}-${Math.random().toString(36).substring(2, 6)}`
        );
        transaction.set(auditDocRef, {
          id: auditDocRef.id,
          eventId: this.eventId,
          timestamp: now,
          action: "MARK_UNSOLD",
          details: `${playerData.name} marked UNSOLD (eligible for Round 2).`,
        });

        unsoldPlayer = {
          ...playerData,
          status: "UNSOLD",
          soldTo: undefined,
          soldPrice: undefined,
        };
      });

      this.unsoldPlayerOverlay = unsoldPlayer;
      this.state.auction.unsoldPlayerOverlay = unsoldPlayer;
      this.state.auction.status = "UNSOLD";

      if (this.soundEnabled) {
        playUnsoldChime();
      }

      this.notify();
    } catch (e) {
      console.error("Failed to mark UNSOLD:", e);
    }
  }

  // ==========================================
  // SELECT PLAYER / NEXT / PREV / REOPEN
  // ==========================================
  public async selectPlayer(playerId: string): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    const playerDocRef = doc(db, "events", this.eventId, "players", playerId);

    try {
      const now = Date.now();
      const playerSnap = await getDoc(playerDocRef);
      if (!playerSnap.exists()) return;

      const playerData = playerSnap.data() as FirestorePlayerDoc;

      await setDoc(
        auctionDocRef,
        {
          currentPlayerId: playerId,
          currentBid: 0,
          leadingTeamId: null,
          status: "READY",
          biddingEndsAt: 0,
          recentBids: [],
          updatedAt: now,
        },
        { merge: true }
      );

      this.clearOverlays();
    } catch (e) {
      console.error("Failed to select player:", e);
    }
  }

  public async startAuction(): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    const now = Date.now();
    const biddingEndsAt = now + AUCTION_CONSTANTS.INITIAL_TIMER_SECONDS * 1000;

    try {
      await setDoc(
        auctionDocRef,
        {
          status: "LIVE",
          startedAt: now,
          biddingEndsAt,
          updatedAt: now,
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Failed to start auction:", e);
    }
  }

  public async pauseAuction(): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    const now = Date.now();

    try {
      await setDoc(
        auctionDocRef,
        {
          status: "PAUSED",
          biddingEndsAt: 0,
          updatedAt: now,
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Failed to pause auction:", e);
    }
  }

  public async resumeAuction(): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    const now = Date.now();
    const biddingEndsAt = now + AUCTION_CONSTANTS.BID_RESET_TIMER_SECONDS * 1000;

    try {
      await setDoc(
        auctionDocRef,
        {
          status: "LIVE",
          biddingEndsAt,
          updatedAt: now,
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Failed to resume auction:", e);
    }
  }

  public async resetTimer(seconds: number = AUCTION_CONSTANTS.INITIAL_TIMER_SECONDS): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    const now = Date.now();
    const biddingEndsAt = now + seconds * 1000;

    try {
      await setDoc(
        auctionDocRef,
        {
          biddingEndsAt,
          updatedAt: now,
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Failed to reset timer:", e);
    }
  }

  public async nextPlayer(): Promise<{ success: boolean; message?: string }> {
    const availablePlayers = this.state.players.filter(
      (p) => p.status === "AVAILABLE" || (this.state.auction.round === 2 && p.status === "UNSOLD")
    );

    if (availablePlayers.length === 0) {
      return { success: false, message: "No more available players in this round." };
    }

    const currentIndex = availablePlayers.findIndex(
      (p) => p.id === this.state.auction.currentPlayerId
    );
    const nextP = availablePlayers[(currentIndex + 1) % availablePlayers.length];

    await this.selectPlayer(nextP.id);
    return { success: true };
  }

  public async prevPlayer(): Promise<void> {
    const availablePlayers = this.state.players.filter(
      (p) => p.status === "AVAILABLE" || (this.state.auction.round === 2 && p.status === "UNSOLD")
    );

    if (availablePlayers.length === 0) return;

    const currentIndex = availablePlayers.findIndex(
      (p) => p.id === this.state.auction.currentPlayerId
    );
    const prevIndex = (currentIndex - 1 + availablePlayers.length) % availablePlayers.length;
    const prevP = availablePlayers[prevIndex];

    await this.selectPlayer(prevP.id);
  }

  public async undoLastBid(): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);

    try {
      await runTransaction(db, async (transaction) => {
        const auctionSnap = await transaction.get(auctionDocRef);
        if (!auctionSnap.exists()) return;

        const auctionData = auctionSnap.data() as FirestoreAuctionStateDoc;
        const recentBids = auctionData.recentBids || [];

        if (recentBids.length === 0) return;

        const remainingBids = recentBids.slice(1);
        const previousBid = remainingBids[0];
        const now = Date.now();

        transaction.update(auctionDocRef, {
          recentBids: remainingBids,
          currentBid: previousBid ? previousBid.amount : 0,
          leadingTeamId: previousBid ? previousBid.teamId : null,
          updatedAt: now,
        });

        const auditDocRef = doc(
          db,
          "events",
          this.eventId,
          "auditLogs",
          `log-${now}-${Math.random().toString(36).substring(2, 6)}`
        );
        transaction.set(auditDocRef, {
          id: auditDocRef.id,
          eventId: this.eventId,
          timestamp: now,
          action: "UNDO_BID",
          details: "Last bid undone by admin.",
        });
      });
    } catch (e) {
      console.error("Failed to undo bid:", e);
    }
  }

  public async reopenPlayer(playerId: string): Promise<{ success: boolean; message?: string }> {
    const db = getFirebaseFirestore();
    if (!db) return { success: false, message: "Database unavailable." };

    try {
      await runTransaction(db, async (transaction) => {
        const playerDocRef = doc(db, "events", this.eventId, "players", playerId);
        const auctionDocRef = doc(db, "auctionState", this.eventId);

        const playerSnap = await transaction.get(playerDocRef);
        if (!playerSnap.exists()) throw new Error("Player record not found.");

        const playerData = playerSnap.data() as FirestorePlayerDoc;
        const now = Date.now();

        // If player was sold, restore team purse & remove from squad
        if (playerData.status === "SOLD" && playerData.soldTo && playerData.soldPrice) {
          const teamDocRef = doc(db, "events", this.eventId, "teams", playerData.soldTo);
          const teamSnap = await transaction.get(teamDocRef);
          if (teamSnap.exists()) {
            const teamData = teamSnap.data() as FirestoreTeamDoc;
            const updatedSquad = (teamData.squad || []).filter((p) => p.id !== playerId);
            const updatedRoleCounts = { ...(teamData.roleCounts || { BATTER: 0, BOWLER: 0, ALL_ROUNDER: 0, WICKETKEEPER: 0 }) };
            updatedRoleCounts[playerData.role] = Math.max(0, (updatedRoleCounts[playerData.role] || 1) - 1);

            transaction.update(teamDocRef, {
              remainingPurse: teamData.remainingPurse + playerData.soldPrice,
              spentPurse: teamData.spentPurse - playerData.soldPrice,
              squad: updatedSquad,
              roleCounts: updatedRoleCounts,
              updatedAt: now,
            });
          }
        }

        // Reset player status
        transaction.update(playerDocRef, {
          status: "LIVE",
          soldTo: null,
          soldPrice: null,
          updatedAt: now,
        });

        // Set as active lot
        transaction.update(auctionDocRef, {
          currentPlayerId: playerId,
          currentBid: 0,
          leadingTeamId: null,
          status: "READY",
          biddingEndsAt: 0,
          recentBids: [],
          updatedAt: now,
        });

        const auditDocRef = doc(
          db,
          "events",
          this.eventId,
          "auditLogs",
          `log-${now}-${Math.random().toString(36).substring(2, 6)}`
        );
        transaction.set(auditDocRef, {
          id: auditDocRef.id,
          eventId: this.eventId,
          timestamp: now,
          action: "REOPEN_PLAYER",
          details: `Admin reopened player ${playerData.name}.`,
        });
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to reopen player." };
    }
  }

  public async setPhase(phase: AuctionPhase): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    const now = Date.now();
    const round = phase === "ROUND_2" ? 2 : 1;

    try {
      await setDoc(
        auctionDocRef,
        {
          phase,
          round,
          updatedAt: now,
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Failed to set phase:", e);
    }
  }

  public async setRound(round: 1 | 2): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    try {
      await setDoc(auctionDocRef, { round, updatedAt: Date.now() }, { merge: true });
    } catch (e) {
      console.error("Failed to set round:", e);
    }
  }

  public async emergencyLock(): Promise<void> {
    const db = getFirebaseFirestore();
    if (!db) return;

    const auctionDocRef = doc(db, "auctionState", this.eventId);
    const now = Date.now();

    try {
      await setDoc(
        auctionDocRef,
        {
          status: "PAUSED",
          isLocked: true,
          biddingEndsAt: 0,
          updatedAt: now,
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Failed to engage emergency lock:", e);
    }
  }

  public async resetTournament(eventId?: string): Promise<void> {
    const targetEventId = eventId || this.eventId;
    const db = getFirebaseFirestore();
    if (!db) return;

    try {
      const batch = writeBatch(db);
      const now = Date.now();

      // Reset Teams
      INITIAL_FRANCHISES.forEach((franchise) => {
        const teamDocRef = doc(db, "events", targetEventId, "teams", franchise.id);
        batch.set(teamDocRef, {
          id: franchise.id,
          franchise,
          remainingPurse: franchise.startingPurse,
          spentPurse: 0,
          squad: [],
          roleCounts: {
            BATTER: 0,
            BOWLER: 0,
            ALL_ROUNDER: 0,
            WICKETKEEPER: 0,
          },
          updatedAt: now,
        });
      });

      // Reset Players
      INITIAL_PLAYERS.forEach((player) => {
        const playerDocRef = doc(db, "events", targetEventId, "players", player.id);
        batch.set(playerDocRef, {
          ...player,
          status: "AVAILABLE",
          soldTo: null,
          soldPrice: null,
          updatedAt: now,
        });
      });

      // Reset Auction State
      const auctionDocRef = doc(db, "auctionState", targetEventId);
      batch.set(auctionDocRef, {
        eventId: targetEventId,
        phase: "ROUND_1",
        status: "IDLE",
        round: 1,
        currentPlayerId: INITIAL_PLAYERS[0]?.id || null,
        currentBid: 0,
        leadingTeamId: null,
        bidSequence: 0,
        biddingEndsAt: 0,
        startedAt: null,
        lastBidAt: null,
        recentBids: [],
        updatedAt: now,
      });

      await batch.commit();
      this.clearOverlays();
    } catch (e) {
      console.error("Failed to reset tournament:", e);
    }
  }

  public toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
    this.state.auction.soundEnabled = this.soundEnabled;
    this.notify();
  }

  public clearOverlays(): void {
    this.soldPlayerOverlay = null;
    this.unsoldPlayerOverlay = null;
    this.state.auction.soldPlayerOverlay = null;
    this.state.auction.unsoldPlayerOverlay = null;
    this.notify();
  }

  public exportState(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public async importState(jsonString: string): Promise<{ success: boolean; message?: string }> {
    try {
      const parsed = JSON.parse(jsonString) as FullTournamentState;
      if (!parsed.auction || !parsed.players || !parsed.teams) {
        return { success: false, message: "Invalid backup format: missing essential tournament data." };
      }
      this.state = parsed;
      this.notify();
      return { success: true, message: "State imported into client session." };
    } catch {
      return { success: false, message: "Failed to parse backup JSON file." };
    }
  }
}
