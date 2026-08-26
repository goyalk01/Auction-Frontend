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

const STORAGE_KEY = "VITB_IPL_AUCTION_STATE_V1";
const BROADCAST_CHANNEL_NAME = "vitb_ipl_auction_channel";

function initializeDefaultState(): FullTournamentState {
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
  const firstPlayer = players[0];

  const auction: AuctionState = {
    phase: "ROUND_1",
    status: "IDLE",
    round: 1,
    currentPlayerId: firstPlayer ? firstPlayer.id : null,
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
    auditLogs: [
      {
        id: "log-init",
        timestamp: Date.now(),
        action: "INITIALIZATION",
        details: "Tournament initialized in Local Mock mode with 15 franchises and 120 players.",
      },
    ],
    backendType: "mock",
    connectionStatus: "connected",
  };
}

export class MockAuctionRepository implements AuctionRepository {
  private state: FullTournamentState;
  private listeners: Set<(state: FullTournamentState) => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private timerInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.state = this.loadState();
    if (typeof window !== "undefined") {
      this.initBroadcastChannel();
      this.startTimerLoop();

      window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            this.state = JSON.parse(e.newValue);
            this.notify();
          } catch {
            // Ignore parse errors
          }
        }
      });
    }
  }

  private initBroadcastChannel() {
    try {
      if (typeof BroadcastChannel !== "undefined") {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === "SYNC_STATE") {
            this.state = event.data.payload;
            this.notify();
          }
        };
      }
    } catch {
      // Storage fallback
    }
  }

  private loadState(): FullTournamentState {
    if (typeof window === "undefined") {
      return initializeDefaultState();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.backendType = "mock";
        parsed.connectionStatus = "connected";
        return parsed;
      }
    } catch {
      // Use default
    }

    const defaultState = initializeDefaultState();
    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: FullTournamentState) {
    this.state = state;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage full
      }
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: "SYNC_STATE",
          payload: state,
        });
      }
    }
    this.notify();
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
    this.listeners.forEach((listener) => listener(this.state));
  }

  private logAudit(action: string, details: string) {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      action,
      details,
    };
    this.state.auditLogs = [newLog, ...this.state.auditLogs.slice(0, 99)];
  }

  private startTimerLoop() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      const { auction } = this.state;
      if (auction.isTimerRunning && auction.status === "LIVE") {
        if (auction.timer > 0) {
          const nextTimer = auction.timer - 1;
          this.state.auction.timer = nextTimer;

          if (
            nextTimer <= AUCTION_CONSTANTS.WARNING_TIMER_SECONDS &&
            nextTimer > 0 &&
            auction.soundEnabled
          ) {
            playTimerWarningBeep();
          }

          this.saveState({ ...this.state });
        } else {
          this.state.auction.isTimerRunning = false;
          this.saveState({ ...this.state });
        }
      }
    }, 1000);
  }

  public async selectPlayer(playerId: string): Promise<void> {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player) return;

    this.state.auction = {
      ...this.state.auction,
      currentPlayerId: player.id,
      currentBid: 0,
      leadingTeamId: null,
      timer: AUCTION_CONSTANTS.INITIAL_TIMER_SECONDS,
      isTimerRunning: false,
      status: "READY",
      recentBids: [],
      soldPlayerOverlay: null,
      unsoldPlayerOverlay: null,
    };

    this.state.players = this.state.players.map((p) =>
      p.id === playerId ? { ...p, status: "LIVE" } : p
    );

    this.logAudit("SELECT_PLAYER", `Selected ${player.name} (${player.role}) for bidding.`);
    this.saveState({ ...this.state });
  }

  public async startAuction(): Promise<void> {
    if (!this.state.auction.currentPlayerId) return;
    this.state.auction.status = "LIVE";
    this.state.auction.isTimerRunning = true;
    this.logAudit(
      "START_AUCTION",
      `Auction started for player ID ${this.state.auction.currentPlayerId}`
    );
    this.saveState({ ...this.state });
  }

  public async pauseAuction(): Promise<void> {
    this.state.auction.status = "PAUSED";
    this.state.auction.isTimerRunning = false;
    this.logAudit("PAUSE_AUCTION", "Auction paused by admin");
    this.saveState({ ...this.state });
  }

  public async resumeAuction(): Promise<void> {
    this.state.auction.status = "LIVE";
    this.state.auction.isTimerRunning = true;
    this.logAudit("RESUME_AUCTION", "Auction resumed by admin");
    this.saveState({ ...this.state });
  }

  public async resetTimer(seconds: number = AUCTION_CONSTANTS.INITIAL_TIMER_SECONDS): Promise<void> {
    this.state.auction.timer = seconds;
    this.state.auction.isTimerRunning = true;
    this.saveState({ ...this.state });
  }

  public async placeBid(
    teamId: string,
    expectedAmount?: number
  ): Promise<{ success: boolean; message?: string }> {
    const { auction, teams, players } = this.state;
    const teamState = teams[teamId];
    const player = players.find((p) => p.id === auction.currentPlayerId);

    if (!teamState || !player) {
      return { success: false, message: "Invalid team or player" };
    }

    const isLeading = auction.leadingTeamId === teamId;
    const nextAmount = expectedAmount || getNextBid(auction.currentBid, player.basePrice);

    const validation = validateTeamBid(teamState, nextAmount, isLeading, auction.status);
    if (!validation.canBid) {
      return { success: false, message: validation.reason };
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      playerId: player.id,
      teamId: teamState.franchise.id,
      teamName: teamState.franchise.name,
      teamShortName: teamState.franchise.shortName,
      teamColor: teamState.franchise.primaryColor,
      amount: nextAmount,
      timestamp: Date.now(),
      sequence: auction.bidSequence + 1,
    };

    this.state.auction.currentBid = nextAmount;
    this.state.auction.leadingTeamId = teamId;
    this.state.auction.bidSequence += 1;
    this.state.auction.lastBidAt = Date.now();
    this.state.auction.recentBids = [newBid, ...auction.recentBids.slice(0, 19)];
    this.state.auction.timer = AUCTION_CONSTANTS.BID_RESET_TIMER_SECONDS;
    this.state.auction.isTimerRunning = true;

    if (this.state.auction.soundEnabled) {
      playBidChime();
    }

    this.logAudit(
      "PLACE_BID",
      `${teamState.franchise.shortName} bid ₹${(nextAmount / 100).toFixed(2)} Cr for ${player.name}`
    );

    this.saveState({ ...this.state });
    return { success: true };
  }

  public async placeManualBid(
    teamId: string,
    amountLakhs: number
  ): Promise<{ success: boolean; message?: string }> {
    const { auction, teams, players } = this.state;
    const teamState = teams[teamId];
    const player = players.find((p) => p.id === auction.currentPlayerId);

    if (!teamState || !player) {
      return { success: false, message: "Invalid team or player" };
    }

    const newBid: Bid = {
      id: `bid-manual-${Date.now()}`,
      playerId: player.id,
      teamId: teamState.franchise.id,
      teamName: teamState.franchise.name,
      teamShortName: teamState.franchise.shortName,
      teamColor: teamState.franchise.primaryColor,
      amount: amountLakhs,
      timestamp: Date.now(),
      sequence: auction.bidSequence + 1,
    };

    this.state.auction.currentBid = amountLakhs;
    this.state.auction.leadingTeamId = teamId;
    this.state.auction.bidSequence += 1;
    this.state.auction.lastBidAt = Date.now();
    this.state.auction.recentBids = [newBid, ...auction.recentBids.slice(0, 19)];
    this.state.auction.timer = AUCTION_CONSTANTS.BID_RESET_TIMER_SECONDS;
    this.state.auction.isTimerRunning = true;

    if (this.state.auction.soundEnabled) {
      playBidChime();
    }

    this.logAudit(
      "MANUAL_BID",
      `Admin placed proxy bid for ${teamState.franchise.shortName}: ₹${(amountLakhs / 100).toFixed(2)} Cr`
    );

    this.saveState({ ...this.state });
    return { success: true };
  }

  public async markSold(
    overrideTeamId?: string,
    overridePrice?: number
  ): Promise<{ success: boolean; message?: string }> {
    const { auction, teams, players } = this.state;
    const winningTeamId = overrideTeamId || auction.leadingTeamId;
    const winningPrice = overridePrice || auction.currentBid;
    const player = players.find((p) => p.id === auction.currentPlayerId);

    if (!player || !winningTeamId || winningPrice <= 0) {
      return { success: false, message: "No active bid or winning team to sell to" };
    }

    const teamState = teams[winningTeamId];
    if (!teamState) return { success: false, message: "Winning team not found" };

    const updatedPlayer: Player = {
      ...player,
      status: "SOLD",
      soldTo: winningTeamId,
      soldPrice: winningPrice,
    };

    this.state.players = this.state.players.map((p) =>
      p.id === player.id ? updatedPlayer : p
    );

    const newSquad = [...teamState.squad, updatedPlayer];
    const newRoleCounts = { ...teamState.roleCounts };
    newRoleCounts[player.role] = (newRoleCounts[player.role] || 0) + 1;

    this.state.teams[winningTeamId] = {
      ...teamState,
      remainingPurse: teamState.remainingPurse - winningPrice,
      spentPurse: teamState.spentPurse + winningPrice,
      squad: newSquad,
      roleCounts: newRoleCounts,
    };

    this.state.auction.status = "SOLD";
    this.state.auction.isTimerRunning = false;
    this.state.auction.soldPlayerOverlay = {
      player: updatedPlayer,
      team: teamState.franchise,
      price: winningPrice,
    };

    if (this.state.auction.soundEnabled) {
      playHammerChime();
    }

    this.logAudit(
      "HAMMER_SOLD",
      `SOLD! ${player.name} sold to ${teamState.franchise.name} for ₹${(winningPrice / 100).toFixed(2)} Cr`
    );

    this.saveState({ ...this.state });
    return { success: true };
  }

  public async markUnsold(): Promise<void> {
    const { auction, players } = this.state;
    const player = players.find((p) => p.id === auction.currentPlayerId);

    if (!player) return;

    const updatedPlayer: Player = {
      ...player,
      status: "UNSOLD",
      soldTo: undefined,
      soldPrice: undefined,
    };

    this.state.players = this.state.players.map((p) =>
      p.id === player.id ? updatedPlayer : p
    );

    this.state.auction.status = "UNSOLD";
    this.state.auction.isTimerRunning = false;
    this.state.auction.unsoldPlayerOverlay = updatedPlayer;

    if (this.state.auction.soundEnabled) {
      playUnsoldChime();
    }

    this.logAudit("MARK_UNSOLD", `${player.name} marked UNSOLD (eligible for Round 2).`);
    this.saveState({ ...this.state });
  }

  public async nextPlayer(): Promise<{ success: boolean; message?: string }> {
    const { auction, players } = this.state;
    const availablePlayers = players.filter(
      (p) => p.status === "AVAILABLE" || (auction.round === 2 && p.status === "UNSOLD")
    );

    if (availablePlayers.length === 0) {
      return { success: false, message: "No more available players in this round" };
    }

    const currentIndex = availablePlayers.findIndex((p) => p.id === auction.currentPlayerId);
    const nextP = availablePlayers[(currentIndex + 1) % availablePlayers.length];

    await this.selectPlayer(nextP.id);
    return { success: true };
  }

  public async prevPlayer(): Promise<void> {
    const { auction, players } = this.state;
    const availablePlayers = players.filter(
      (p) => p.status === "AVAILABLE" || (auction.round === 2 && p.status === "UNSOLD")
    );

    if (availablePlayers.length === 0) return;

    const currentIndex = availablePlayers.findIndex((p) => p.id === auction.currentPlayerId);
    const prevIndex = (currentIndex - 1 + availablePlayers.length) % availablePlayers.length;
    const prevP = availablePlayers[prevIndex];

    await this.selectPlayer(prevP.id);
  }

  public async undoLastBid(): Promise<void> {
    const { auction } = this.state;
    if (auction.recentBids.length === 0) return;

    const remainingBids = auction.recentBids.slice(1);
    const previousBid = remainingBids[0];

    this.state.auction.recentBids = remainingBids;
    if (previousBid) {
      this.state.auction.currentBid = previousBid.amount;
      this.state.auction.leadingTeamId = previousBid.teamId;
    } else {
      this.state.auction.currentBid = 0;
      this.state.auction.leadingTeamId = null;
    }

    this.logAudit("UNDO_BID", "Last bid was undone by admin");
    this.saveState({ ...this.state });
  }

  public async reopenPlayer(playerId: string): Promise<{ success: boolean; message?: string }> {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player) return { success: false, message: "Player not found" };

    // If player was sold, refund purse and remove from squad
    if (player.status === "SOLD" && player.soldTo && player.soldPrice) {
      const teamState = this.state.teams[player.soldTo];
      if (teamState) {
        const newSquad = teamState.squad.filter((p) => p.id !== player.id);
        const newRoleCounts = { ...teamState.roleCounts };
        newRoleCounts[player.role] = Math.max(0, (newRoleCounts[player.role] || 1) - 1);

        this.state.teams[player.soldTo] = {
          ...teamState,
          remainingPurse: teamState.remainingPurse + player.soldPrice,
          spentPurse: teamState.spentPurse - player.soldPrice,
          squad: newSquad,
          roleCounts: newRoleCounts,
        };
      }
    }

    this.state.players = this.state.players.map((p) =>
      p.id === playerId ? { ...p, status: "LIVE", soldTo: undefined, soldPrice: undefined } : p
    );

    this.state.auction = {
      ...this.state.auction,
      currentPlayerId: player.id,
      currentBid: 0,
      leadingTeamId: null,
      status: "READY",
      timer: AUCTION_CONSTANTS.INITIAL_TIMER_SECONDS,
      isTimerRunning: false,
      recentBids: [],
    };

    this.logAudit("REOPEN_PLAYER", `Player ${player.name} reopened by admin.`);
    this.saveState({ ...this.state });
    return { success: true };
  }

  public async setPhase(phase: AuctionPhase): Promise<void> {
    this.state.auction.phase = phase;
    if (phase === "ROUND_2") {
      this.state.auction.round = 2;
    } else if (phase === "ROUND_1") {
      this.state.auction.round = 1;
    }

    this.logAudit("SET_PHASE", `Tournament phase advanced to ${phase}`);
    this.saveState({ ...this.state });
  }

  public async setRound(round: 1 | 2): Promise<void> {
    this.state.auction.round = round;
    this.saveState({ ...this.state });
  }

  public async emergencyLock(): Promise<void> {
    this.state.auction.status = "PAUSED";
    this.state.auction.isTimerRunning = false;
    this.logAudit("EMERGENCY_LOCK", "EMERGENCY AUCTION LOCK ENGAGED BY ADMIN");
    this.saveState({ ...this.state });
  }

  public async resetTournament(): Promise<void> {
    const freshState = initializeDefaultState();
    this.saveState(freshState);
  }

  public toggleSound(): void {
    this.state.auction.soundEnabled = !this.state.auction.soundEnabled;
    this.saveState({ ...this.state });
  }

  public clearOverlays(): void {
    this.state.auction.soldPlayerOverlay = null;
    this.state.auction.unsoldPlayerOverlay = null;
    this.saveState({ ...this.state });
  }
}
