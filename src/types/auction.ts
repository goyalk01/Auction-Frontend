export type PlayerRole = "BATTER" | "BOWLER" | "ALL_ROUNDER" | "WICKETKEEPER";

export type PlayerStatus = "AVAILABLE" | "LIVE" | "SOLD" | "UNSOLD" | "RETURNED";

export type PlayerCategory = 
  | "MARQUEE" 
  | "BATTER" 
  | "BOWLER" 
  | "ALL_ROUNDER" 
  | "WICKETKEEPER" 
  | "UNCAPPED";

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  category: PlayerCategory;
  basePrice: number; // in Lakhs (e.g., 200 = ₹2 Cr, 50 = ₹50 L)
  nationality: "Indian" | "Overseas";
  battingStyle?: string;
  bowlingStyle?: string;
  status: PlayerStatus;
  soldTo?: string; // teamId
  soldPrice?: number; // in Lakhs
  round: 1 | 2;
  statsSummary?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    strikeRate?: number;
    economy?: number;
    fifties?: number;
  };
}

export interface Franchise {
  id: string;
  name: string;
  shortName: string;
  city: string;
  primaryColor: string; // Hex
  secondaryColor: string; // Hex
  accentColor: string; // Hex
  bgGradient: string;
  textColor: string;
  startingPurse: number; // in Lakhs (12500 = ₹125 Cr)
  captainName?: string;
}

export interface TeamState {
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
}

export interface Bid {
  id: string;
  playerId: string;
  teamId: string;
  teamName: string;
  teamShortName: string;
  teamColor: string;
  amount: number; // in Lakhs
  timestamp: number;
  sequence: number;
}

export type AuctionPhase =
  | "BRIEFING"
  | "STRATEGY"
  | "ROUND_1"
  | "BREAK"
  | "ROUND_2"
  | "SQUAD_REVIEW"
  | "RESULTS"
  | "CLOSING";

export type AuctionStatus = "IDLE" | "READY" | "LIVE" | "PAUSED" | "SOLD" | "UNSOLD";

export interface AuctionState {
  phase: AuctionPhase;
  status: AuctionStatus;
  round: 1 | 2;
  currentPlayerId: string | null;
  currentBid: number; // in Lakhs
  leadingTeamId: string | null;
  timer: number; // seconds
  isTimerRunning: boolean;
  bidSequence: number;
  lastBidAt: number | null;
  recentBids: Bid[];
  soundEnabled: boolean;
  soldPlayerOverlay: {
    player: Player;
    team: Franchise;
    price: number;
  } | null;
  unsoldPlayerOverlay: Player | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  actor?: "ADMIN" | "SYSTEM" | "CAPTAIN";
}

export type AuditLog = AuditLogEntry;
