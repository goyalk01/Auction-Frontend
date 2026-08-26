import {
  collection,
  doc,
  DocumentReference,
  CollectionReference,
} from "firebase/firestore";
import { getFirebaseFirestore } from "./client";
import { AUCTION_EVENT_ID } from "./config";
import {
  Player,
  Franchise,
  TeamState,
  Bid,
  AuctionPhase,
  AuctionStatus,
  AuditLog,
} from "../../types/auction";
import { UserRole } from "../../types/auth";

export interface FirestoreEventDoc {
  id: string;
  name: string;
  phase: AuctionPhase;
  round: 1 | 2;
  config: {
    startingPurse: number;
    minSquadSize: number;
    maxSquadSize: number;
    minWKs: number;
    minBowlers: number;
    initialTimerSeconds: number;
    bidResetTimerSeconds: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface FirestoreAuctionStateDoc {
  eventId: string;
  phase: AuctionPhase;
  status: AuctionStatus;
  round: 1 | 2;
  currentPlayerId: string | null;
  currentBid: number; // in Lakhs
  leadingTeamId: string | null;
  bidSequence: number;
  biddingEndsAt: number; // Authoritative epoch ms
  isTimerRunning: boolean;
  startedAt: number | null;
  lastBidAt: number | null;
  recentBids: Bid[];
  isLocked?: boolean;
  updatedAt: number;
}

export interface FirestoreTeamDoc {
  id: string;
  franchise: Franchise;
  remainingPurse: number; // in Lakhs
  spentPurse: number; // in Lakhs
  squad: Player[];
  roleCounts: {
    BATTER: number;
    BOWLER: number;
    ALL_ROUNDER: number;
    WICKETKEEPER: number;
  };
  updatedAt: number;
}

export interface FirestorePlayerDoc extends Player {
  updatedAt: number;
}

export interface FirestoreBidDoc extends Bid {
  eventId: string;
  actorUserId?: string;
  source: "TEAM" | "ADMIN_PROXY";
}

export interface FirestoreAuditLogDoc extends AuditLog {
  eventId: string;
  actorUserId?: string;
  actorRole?: UserRole;
}

// Collection References
export function getEventsCollection() {
  const db = getFirebaseFirestore();
  return db ? collection(db, "events") : null;
}

export function getEventDocRef(eventId: string = AUCTION_EVENT_ID) {
  const db = getFirebaseFirestore();
  return db ? doc(db, "events", eventId) : null;
}

export function getAuctionStateDocRef(eventId: string = AUCTION_EVENT_ID) {
  const db = getFirebaseFirestore();
  return db ? doc(db, "auctionState", eventId) : null;
}

export function getTeamsCollection(eventId: string = AUCTION_EVENT_ID) {
  const db = getFirebaseFirestore();
  return db ? collection(db, "events", eventId, "teams") : null;
}

export function getTeamDocRef(teamId: string, eventId: string = AUCTION_EVENT_ID) {
  const db = getFirebaseFirestore();
  return db ? doc(db, "events", eventId, "teams", teamId) : null;
}

export function getPlayersCollection(eventId: string = AUCTION_EVENT_ID) {
  const db = getFirebaseFirestore();
  return db ? collection(db, "events", eventId, "players") : null;
}

export function getPlayerDocRef(playerId: string, eventId: string = AUCTION_EVENT_ID) {
  const db = getFirebaseFirestore();
  return db ? doc(db, "events", eventId, "players", playerId) : null;
}

export function getBidsCollection(eventId: string = AUCTION_EVENT_ID) {
  const db = getFirebaseFirestore();
  return db ? collection(db, "events", eventId, "bids") : null;
}

export function getAuditLogsCollection(eventId: string = AUCTION_EVENT_ID) {
  const db = getFirebaseFirestore();
  return db ? collection(db, "events", eventId, "auditLogs") : null;
}

export function getUsersCollection() {
  const db = getFirebaseFirestore();
  return db ? collection(db, "users") : null;
}
