import { AUCTION_CONSTANTS } from "./constants";
import { formatLakhs } from "./formatting";
import { TeamState } from "../types/auction";

/**
 * Calculates the exact increment for any given bid level
 * - Below ₹1 Cr ( < 100 L ): ₹10 L
 * - ₹1 Cr to ₹5 Cr ( 100 L to 500 L ): ₹20 L
 * - Above ₹5 Cr ( > 500 L ): ₹50 L
 */
export function getBidIncrement(currentBidLakhs: number): number {
  if (currentBidLakhs < AUCTION_CONSTANTS.INCREMENTS.TIER_1_THRESHOLD) {
    return AUCTION_CONSTANTS.INCREMENTS.TIER_1_INCREMENT; // 10 L
  }
  if (currentBidLakhs < AUCTION_CONSTANTS.INCREMENTS.TIER_2_THRESHOLD) {
    return AUCTION_CONSTANTS.INCREMENTS.TIER_2_INCREMENT; // 20 L
  }
  return AUCTION_CONSTANTS.INCREMENTS.TIER_3_INCREMENT; // 50 L
}

/**
 * Computes the next valid bid amount for the active player
 */
export function getNextBid(currentBidLakhs: number, basePriceLakhs: number): number {
  if (currentBidLakhs <= 0) {
    return basePriceLakhs;
  }
  return currentBidLakhs + getBidIncrement(currentBidLakhs);
}

/**
 * Validates whether a franchise can legally submit the next bid
 */
export function validateTeamBid(
  teamState: TeamState,
  nextBidAmount: number,
  isLeading: boolean,
  auctionStatus: string
): { canBid: boolean; reason?: string } {
  if (auctionStatus !== "LIVE") {
    return {
      canBid: false,
      reason: `Auction is currently ${auctionStatus.toLowerCase()}`,
    };
  }

  if (isLeading) {
    return {
      canBid: false,
      reason: "Your franchise holds the highest bid",
    };
  }

  if (teamState.squad.length >= AUCTION_CONSTANTS.MAX_SQUAD_SIZE) {
    return {
      canBid: false,
      reason: `Maximum squad limit (${AUCTION_CONSTANTS.MAX_SQUAD_SIZE} players) reached`,
    };
  }

  if (teamState.remainingPurse < nextBidAmount) {
    return {
      canBid: false,
      reason: `Insufficient purse. Required: ${formatLakhs(nextBidAmount)}, Available: ${formatLakhs(teamState.remainingPurse)}`,
    };
  }

  return { canBid: true };
}

/**
 * Evaluates squad composition against event rules
 */
export function evaluateSquadCompliance(teamState: TeamState) {
  const { squad, roleCounts } = teamState;
  const issues: string[] = [];
  
  if (squad.length < AUCTION_CONSTANTS.MIN_SQUAD_SIZE) {
    issues.push(`Squad size (${squad.length}) below minimum requirement of ${AUCTION_CONSTANTS.MIN_SQUAD_SIZE}`);
  }
  
  if (roleCounts.WICKETKEEPER < AUCTION_CONSTANTS.MIN_WICKETKEEPERS) {
    issues.push(`Requires at least ${AUCTION_CONSTANTS.MIN_WICKETKEEPERS} Wicketkeeper (Current: ${roleCounts.WICKETKEEPER})`);
  }
  
  if (roleCounts.BOWLER < AUCTION_CONSTANTS.MIN_BOWLERS) {
    issues.push(`Requires at least ${AUCTION_CONSTANTS.MIN_BOWLERS} Bowlers (Current: ${roleCounts.BOWLER})`);
  }

  const isCompliant = issues.length === 0;
  return {
    isCompliant,
    issues,
    squadCount: squad.length,
    maxSlots: AUCTION_CONSTANTS.MAX_SQUAD_SIZE,
    minSlots: AUCTION_CONSTANTS.MIN_SQUAD_SIZE,
  };
}
