import { doc, writeBatch, getDoc } from "firebase/firestore";
import { getFirebaseFirestore } from "./client";
import { AUCTION_EVENT_ID } from "./config";
import { INITIAL_FRANCHISES } from "../../data/franchises";
import { INITIAL_PLAYERS } from "../../data/players";
import { AUCTION_CONSTANTS } from "../constants";

export async function seedEventDatabase(
  targetEventId: string = AUCTION_EVENT_ID,
  forceOverwrite: boolean = false
): Promise<{ success: boolean; message: string; count?: { teams: number; players: number } }> {
  const db = getFirebaseFirestore();
  if (!db) {
    return { success: false, message: "Firebase is not connected or initialized." };
  }

  try {
    const eventDocRef = doc(db, "events", targetEventId);
    const existingSnap = await getDoc(eventDocRef);

    if (existingSnap.exists() && !forceOverwrite) {
      return {
        success: false,
        message: `Event "${targetEventId}" already exists. Pass forceOverwrite=true to re-seed.`,
      };
    }

    const now = Date.now();
    const batch = writeBatch(db);

    // 1. Seed Event Document
    batch.set(eventDocRef, {
      id: targetEventId,
      name: "VITB-MUN IPL Mega Auction 2026",
      phase: "ROUND_1",
      round: 1,
      config: {
        startingPurse: AUCTION_CONSTANTS.STARTING_PURSE_LAKHS,
        minSquadSize: AUCTION_CONSTANTS.MIN_SQUAD_SIZE,
        maxSquadSize: AUCTION_CONSTANTS.MAX_SQUAD_SIZE,
        minWKs: AUCTION_CONSTANTS.MIN_WICKETKEEPERS,
        minBowlers: AUCTION_CONSTANTS.MIN_BOWLERS,
        initialTimerSeconds: AUCTION_CONSTANTS.INITIAL_TIMER_SECONDS,
        bidResetTimerSeconds: AUCTION_CONSTANTS.BID_RESET_TIMER_SECONDS,
      },
      createdAt: now,
      updatedAt: now,
    });

    // 2. Seed 15 Franchises
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

    // 3. Seed 120 Players
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

    // 4. Seed Initial Auction State
    const auctionStateDocRef = doc(db, "auctionState", targetEventId);
    batch.set(auctionStateDocRef, {
      eventId: targetEventId,
      phase: "ROUND_1",
      status: "IDLE",
      round: 1,
      currentPlayerId: INITIAL_PLAYERS[0]?.id || null,
      currentBid: 0,
      leadingTeamId: null,
      bidSequence: 0,
      biddingEndsAt: 0,
      isTimerRunning: false,
      startedAt: null,
      lastBidAt: null,
      recentBids: [],
      updatedAt: now,
    });

    // 5. Seed Initialization Audit Log
    const auditDocRef = doc(
      db,
      "events",
      targetEventId,
      "auditLogs",
      `log-init-${now}`
    );
    batch.set(auditDocRef, {
      id: auditDocRef.id,
      eventId: targetEventId,
      timestamp: now,
      action: "INITIAL_SEED",
      details: `Database seeded with 15 franchises and ${INITIAL_PLAYERS.length} players for event ${targetEventId}.`,
    });

    await batch.commit();

    return {
      success: true,
      message: `Successfully seeded event "${targetEventId}" with 15 franchises and ${INITIAL_PLAYERS.length} players.`,
      count: {
        teams: INITIAL_FRANCHISES.length,
        players: INITIAL_PLAYERS.length,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to seed event database.",
    };
  }
}
