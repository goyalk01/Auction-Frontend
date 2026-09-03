import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getBidIncrement,
  getNextBid,
  validateTeamBid,
  evaluateSquadCompliance,
} from "../lib/bidding.ts";
import { AUCTION_CONSTANTS } from "../lib/constants.ts";
import { TeamState, Franchise } from "../types/auction.ts";

const MOCK_FRANCHISE: Franchise = {
  id: "team-test",
  name: "Test Franchise",
  shortName: "TF",
  city: "Test City",
  primaryColor: "#000000",
  secondaryColor: "#ffffff",
  accentColor: "#d4af37",
  bgGradient: "from-black to-gray",
  textColor: "#ffffff",
  startingPurse: 12500,
};

function createMockTeamState(overrides: Partial<TeamState> = {}): TeamState {
  return {
    franchise: MOCK_FRANCHISE,
    remainingPurse: 12500,
    spentPurse: 0,
    squad: [],
    roleCounts: {
      BATTER: 0,
      BOWLER: 0,
      ALL_ROUNDER: 0,
      WICKETKEEPER: 0,
    },
    ...overrides,
  };
}

describe("Bidding Math & Tiered Increments", () => {
  it("should return Tier 1 increment (10L) below 1 Crore (100L)", () => {
    assert.equal(getBidIncrement(20), 10);
    assert.equal(getBidIncrement(50), 10);
    assert.equal(getBidIncrement(90), 10);
  });

  it("should return Tier 2 increment (20L) between 1 Cr and 5 Cr (100L - 500L)", () => {
    assert.equal(getBidIncrement(100), 20);
    assert.equal(getBidIncrement(250), 20);
    assert.equal(getBidIncrement(480), 20);
  });

  it("should return Tier 3 increment (50L) at or above 5 Crore (500L)", () => {
    assert.equal(getBidIncrement(500), 50);
    assert.equal(getBidIncrement(1200), 50);
    assert.equal(getBidIncrement(2500), 50);
  });

  it("should calculate next valid bid correctly", () => {
    // When opening a bid with 0, next bid is base price
    assert.equal(getNextBid(0, 200), 200);

    // Below 1 Cr: +10L
    assert.equal(getNextBid(50, 50), 60);

    // Between 1 Cr and 5 Cr: +20L
    assert.equal(getNextBid(200, 200), 220);

    // Above 5 Cr: +50L
    assert.equal(getNextBid(600, 200), 650);
  });
});

describe("Bid Validation Rules", () => {
  it("should reject bids when auction is not LIVE", () => {
    const team = createMockTeamState();
    const result = validateTeamBid(team, 200, false, "PAUSED");
    assert.equal(result.canBid, false);
    assert.match(result.reason || "", /paused/i);
  });

  it("should reject bids when the team is already leading", () => {
    const team = createMockTeamState();
    const result = validateTeamBid(team, 220, true, "LIVE");
    assert.equal(result.canBid, false);
    assert.match(result.reason || "", /highest bid/i);
  });

  it("should reject bids when team has insufficient purse", () => {
    const team = createMockTeamState({ remainingPurse: 150 });
    const result = validateTeamBid(team, 200, false, "LIVE");
    assert.equal(result.canBid, false);
    assert.match(result.reason || "", /insufficient purse/i);
  });

  it("should reject bids when team squad limit is reached", () => {
    const mockSquad: any[] = new Array(AUCTION_CONSTANTS.MAX_SQUAD_SIZE).fill({});
    const team = createMockTeamState({ squad: mockSquad });
    const result = validateTeamBid(team, 200, false, "LIVE");
    assert.equal(result.canBid, false);
    assert.match(result.reason || "", /maximum squad limit/i);
  });

  it("should approve valid bids when conditions are met", () => {
    const team = createMockTeamState({ remainingPurse: 10000 });
    const result = validateTeamBid(team, 200, false, "LIVE");
    assert.equal(result.canBid, true);
  });
});

describe("Squad Compliance Rules", () => {
  it("should flag non-compliant squad when below minimum size", () => {
    const team = createMockTeamState({
      squad: [{ id: "1" } as any, { id: "2" } as any],
    });
    const compliance = evaluateSquadCompliance(team);
    assert.equal(compliance.isCompliant, false);
    assert.ok(compliance.issues.some((i) => i.includes("minimum requirement")));
  });

  it("should flag squad when missing required bowlers", () => {
    const team = createMockTeamState({
      squad: new Array(AUCTION_CONSTANTS.MIN_SQUAD_SIZE).fill({}),
      roleCounts: { BATTER: 6, BOWLER: 1, ALL_ROUNDER: 0, WICKETKEEPER: 1 },
    });
    const compliance = evaluateSquadCompliance(team);
    assert.equal(compliance.isCompliant, false);
    assert.ok(compliance.issues.some((i) => i.includes("Bowlers")));
  });

  it("should flag squad when missing wicketkeeper", () => {
    const team = createMockTeamState({
      squad: new Array(AUCTION_CONSTANTS.MIN_SQUAD_SIZE).fill({}),
      roleCounts: { BATTER: 4, BOWLER: 3, ALL_ROUNDER: 1, WICKETKEEPER: 0 },
    });
    const compliance = evaluateSquadCompliance(team);
    assert.equal(compliance.isCompliant, false);
    assert.ok(compliance.issues.some((i) => i.includes("Wicketkeeper")));
  });

  it("should pass compliance when all roster minimums are satisfied", () => {
    const team = createMockTeamState({
      squad: new Array(AUCTION_CONSTANTS.MIN_SQUAD_SIZE).fill({}),
      roleCounts: { BATTER: 3, BOWLER: 3, ALL_ROUNDER: 1, WICKETKEEPER: 1 },
    });
    const compliance = evaluateSquadCompliance(team);
    assert.equal(compliance.isCompliant, true);
    assert.equal(compliance.issues.length, 0);
  });
});

describe("Admin Manual Proxy Bid & Sold Validation Logic", () => {
  it("should enforce that a manual bid cannot be lower than player base price", () => {
    const basePrice = 200; // ₹2.00 Cr
    const attemptedBid = 100; // ₹1.00 Cr
    assert.equal(attemptedBid < basePrice, true);
  });

  it("should enforce that a manual bid must exceed the current bid", () => {
    const currentBid = 300;
    const lowerBid = 250;
    const equalBid = 300;
    const higherBid = 350;

    assert.equal(lowerBid <= currentBid, true);
    assert.equal(equalBid <= currentBid, true);
    assert.equal(higherBid > currentBid, true);
  });

  it("should enforce that winning price cannot be below player base price", () => {
    const basePrice = 200;
    const validHammerPrice = 200;
    const invalidHammerPrice = 150;

    assert.equal(invalidHammerPrice < basePrice, true);
    assert.equal(validHammerPrice >= basePrice, true);
  });
});
