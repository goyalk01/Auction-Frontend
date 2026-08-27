import { AuctionPhase } from "../types/auction";

export interface TimelinePhase {
  id: AuctionPhase;
  phaseNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  type: "CEREMONY" | "STRATEGY" | "AUCTION" | "BREAK" | "EVALUATION" | "RESULTS";
  bulletPoints: string[];
}

export const EVENT_TIMELINE: TimelinePhase[] = [
  {
    id: "BRIEFING",
    phaseNumber: 1,
    title: "Opening Ceremony & Committee Briefing",
    shortTitle: "Briefing",
    description: "Introduction to rules, bidding mechanics, code of conduct, and virtual purse setup.",
    duration: "20 Mins",
    type: "CEREMONY",
    bulletPoints: [
      "Welcome address by Executive Board & MUN Secretariat",
      "Announcement of auction rules, bid tiers & squad limits",
      "Live test run of mobile captain dashboards",
    ],
  },
  {
    id: "STRATEGY",
    phaseNumber: 2,
    title: "Franchise Allocation & Strategy Planning",
    shortTitle: "Strategy",
    description: "Teams receive their franchise identities and formulate budget & target player matrix.",
    duration: "25 Mins",
    type: "STRATEGY",
    bulletPoints: [
      "Draw for 15 franchise allocations",
      "Purse verification (₹125 Cr starting balance)",
      "Team internal strategy and target role allocation",
    ],
  },
  {
    id: "ROUND_1",
    phaseNumber: 3,
    title: "IPL Mega Auction — Round 1",
    shortTitle: "Round 1",
    description: "The primary bidding session featuring Marquee, Capped Batters, All-Rounders, Bowlers & WKs.",
    duration: "90 Mins",
    type: "AUCTION",
    bulletPoints: [
      "One-by-one presentation of marquee and elite players",
      "Live 20-second countdown per lot with 10-second bid extensions",
      "Immediate budget deduction and roster addition upon hammer down",
    ],
  },
  {
    id: "BREAK",
    phaseNumber: 4,
    title: "Short Break & Strategy Re-alignment",
    shortTitle: "Break",
    description: "Mid-auction interval to reassess team balances, remaining purse, and shortlist unsold talents.",
    duration: "15 Mins",
    type: "BREAK",
    bulletPoints: [
      "Publication of interim squad compositions and remaining purse radar",
      "Franchise strategy re-calibration for squad requirements",
      "Submission of preferred unsold lot requests for Round 2",
    ],
  },
  {
    id: "ROUND_2",
    phaseNumber: 5,
    title: "IPL Mega Auction — Round 2",
    shortTitle: "Round 2",
    description: "Accelerated bidding for unsold players and remaining squad slots to fulfill roster minimums.",
    duration: "45 Mins",
    type: "AUCTION",
    bulletPoints: [
      "Unsold players returned to the block",
      "Intense bidding to fulfill mandatory 7-11 squad sizes",
      "Enforcement of minimum 1 WK and 3 Bowler composition constraints",
    ],
  },
  {
    id: "SQUAD_REVIEW",
    phaseNumber: 6,
    title: "Squad Review & Evaluation",
    shortTitle: "Review",
    description: "Executive Board and Judges review all 15 finalized team sheets against scoring rubrics.",
    duration: "30 Mins",
    type: "EVALUATION",
    bulletPoints: [
      "Judges verify all squads meet compliance minimums (7-11 players, 1 WK, 3 Bowlers)",
      "Evaluation of squad balance, bench depth, and tactical versatility",
      "Purse efficiency rating and value-for-money analysis",
    ],
  },
  {
    id: "RESULTS",
    phaseNumber: 7,
    title: "Results & Champion Announcement",
    shortTitle: "Results",
    description: "Official presentation of the winning franchise, runner-ups, and special tactical accolades.",
    duration: "15 Mins",
    type: "RESULTS",
    bulletPoints: [
      "Declaration of Champion Franchise based on squad score and budget efficiency",
      "Best Mastermind / Strategist Award",
      "Certificate and trophy distribution",
    ],
  },
  {
    id: "CLOSING",
    phaseNumber: 8,
    title: "Feedback & Closing Ceremony",
    shortTitle: "Closing",
    description: "Closing remarks, delegate feedback, and conclusion of the VITBMUN IPL Mega Auction.",
    duration: "15 Mins",
    type: "CEREMONY",
    bulletPoints: [
      "Address by the Chairperson and Organizing Committee",
      "Delegate feedback collection",
      "Official closing of the committee",
    ],
  },
];
