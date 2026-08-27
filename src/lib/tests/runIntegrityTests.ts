import { getNextBid, getBidIncrement, validateTeamBid, evaluateSquadCompliance } from "../bidding";
import { formatLakhs, formatLakhsShort } from "../formatting";
import { AUCTION_CONSTANTS } from "../constants";
import { INITIAL_FRANCHISES } from "../../data/franchises";
import { INITIAL_PLAYERS } from "../../data/players";
import { TeamState } from "../../types/auction";

export function runAllAuctionIntegrityTests(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  let allPassed = true;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      results.push(`✔ PASS: ${testName}`);
    } else {
      results.push(`❌ FAIL: ${testName}`);
      allPassed = false;
    }
  }

  // 1. Integer Lakhs & Increments Tests
  assert(getBidIncrement(50) === 10, "Increment below 1 Cr is 10 Lakhs");
  assert(getBidIncrement(90) === 10, "Increment at 90 L is 10 Lakhs");
  assert(getBidIncrement(100) === 20, "Increment at 1 Cr is 20 Lakhs");
  assert(getBidIncrement(300) === 20, "Increment at 3 Cr is 20 Lakhs");
  assert(getBidIncrement(500) === 50, "Increment at 5 Cr is 50 Lakhs");
  assert(getBidIncrement(850) === 50, "Increment at 8.5 Cr is 50 Lakhs");

  // Next Bid Progression
  assert(getNextBid(0, 200) === 200, "Opening bid starts at Base Price (200 L)");
  assert(getNextBid(200, 200) === 220, "200 L -> 220 L (+20 L tier)");
  assert(getNextBid(480, 200) === 500, "480 L -> 500 L (+20 L tier)");
  assert(getNextBid(500, 200) === 550, "500 L -> 550 L (+50 L tier)");

  // 2. Financial Formatting Tests
  assert(formatLakhs(12500) === "₹125.00 Cr", "12,500 Lakhs formats to ₹125.00 Cr");
  assert(formatLakhs(850) === "₹8.50 Cr", "850 Lakhs formats to ₹8.50 Cr");
  assert(formatLakhs(50) === "₹50 L", "50 Lakhs formats to ₹50 L");
  assert(formatLakhsShort(12500) === "₹125 Cr", "12,500 Lakhs short formats to ₹125 Cr");
  assert(formatLakhsShort(850) === "₹8.5 Cr", "850 Lakhs short formats to ₹8.5 Cr");

  // 3. Squad & Purse Validation Tests
  const mockTeam: TeamState = {
    franchise: INITIAL_FRANCHISES[0],
    remainingPurse: 12500,
    spentPurse: 0,
    squad: [],
    roleCounts: { BATTER: 0, BOWLER: 0, ALL_ROUNDER: 0, WICKETKEEPER: 0 },
  };

  const val1 = validateTeamBid(mockTeam, 500, false, "LIVE");
  assert(val1.canBid === true, "Valid team with ₹125 Cr purse can bid ₹5 Cr");

  const val2 = validateTeamBid(mockTeam, 500, true, "LIVE");
  assert(val2.canBid === false, "Leading team cannot bid against itself");

  const brokeTeam: TeamState = { ...mockTeam, remainingPurse: 300 };
  const val3 = validateTeamBid(brokeTeam, 500, false, "LIVE");
  assert(val3.canBid === false, "Team with 300 L cannot bid 500 L");

  // 4. Squad Composition Compliance Tests
  const incompleteSquadTeam: TeamState = {
    ...mockTeam,
    squad: [INITIAL_PLAYERS[0], INITIAL_PLAYERS[1]],
    roleCounts: { BATTER: 2, BOWLER: 0, ALL_ROUNDER: 0, WICKETKEEPER: 0 },
  };
  const comp1 = evaluateSquadCompliance(incompleteSquadTeam);
  assert(comp1.isCompliant === false, "Squad with 2 players is incomplete (Min 7 required)");

  const validSquadTeam: TeamState = {
    ...mockTeam,
    squad: new Array(7).fill(INITIAL_PLAYERS[0]),
    roleCounts: { BATTER: 3, BOWLER: 3, ALL_ROUNDER: 0, WICKETKEEPER: 1 },
  };
  const comp2 = evaluateSquadCompliance(validSquadTeam);
  assert(comp2.isCompliant === true, "Squad of 7 with 1 WK and 3 Bowlers is fully compliant");

  // 5. Total Seed Datasets Invariants
  assert(INITIAL_FRANCHISES.length === 15, "Exactly 15 franchises initialized");
  assert(INITIAL_PLAYERS.length === 120, "120 starter players seeded across sets");

  return { passed: allPassed, results };
}
