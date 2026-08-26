import {
  Player,
  Franchise,
  TeamState,
  Bid,
  AuctionPhase,
  AuctionStatus,
  AuctionState,
  AuditLog,
} from "./auction";

export interface FullTournamentState {
  auction: AuctionState;
  players: Player[];
  teams: Record<string, TeamState>;
  auditLogs: AuditLog[];
  backendType: "firebase" | "mock";
  connectionStatus: "connected" | "reconnecting" | "offline";
}

export interface AuctionRepository {
  /**
   * Subscribe to full tournament state updates.
   * Returns an unsubscribe function.
   */
  subscribe(callback: (state: FullTournamentState) => void): () => void;

  /**
   * Get the current snapshot of tournament state.
   */
  getState(): FullTournamentState;

  /**
   * Place an authoritative bid on behalf of a team.
   */
  placeBid(teamId: string, expectedAmount?: number): Promise<{ success: boolean; message?: string }>;

  /**
   * Place a manual admin proxy bid on behalf of a team.
   */
  placeManualBid(teamId: string, amountLakhs: number): Promise<{ success: boolean; message?: string }>;

  /**
   * Auctioneer Gavel Operations
   */
  startAuction(): Promise<void>;
  pauseAuction(): Promise<void>;
  resumeAuction(): Promise<void>;
  resetTimer(seconds?: number): Promise<void>;
  markSold(overrideTeamId?: string, overridePrice?: number): Promise<{ success: boolean; message?: string }>;
  markUnsold(): Promise<void>;
  nextPlayer(): Promise<{ success: boolean; message?: string }>;
  prevPlayer(): Promise<void>;
  selectPlayer(playerId: string): Promise<void>;
  undoLastBid(): Promise<void>;
  reopenPlayer(playerId: string): Promise<{ success: boolean; message?: string }>;

  /**
   * Tournament Flow Operations
   */
  setPhase(phase: AuctionPhase): Promise<void>;
  setRound(round: 1 | 2): Promise<void>;
  emergencyLock(): Promise<void>;
  resetTournament(eventId?: string): Promise<void>;

  /**
   * Local Client State Operations
   */
  toggleSound(): void;
  clearOverlays(): void;
}
