export const AUCTION_CONSTANTS = {
  // Financial (all integer in Lakhs)
  STARTING_PURSE_LAKHS: 10000, // ₹100 Cr
  CR_IN_LAKHS: 100,

  // Squad Rules
  MIN_SQUAD_SIZE: 7,
  MAX_SQUAD_SIZE: 11,
  MIN_WICKETKEEPERS: 1,
  MIN_BOWLERS: 3,

  // Timer Configuration (Seconds)
  INITIAL_TIMER_SECONDS: 20,
  BID_RESET_TIMER_SECONDS: 10,
  WARNING_TIMER_SECONDS: 5,

  // Increment thresholds (in Lakhs)
  INCREMENTS: {
    TIER_1_THRESHOLD: 100, // Up to 1 Cr
    TIER_1_INCREMENT: 10,  // +10 L
    TIER_2_THRESHOLD: 500, // 1 Cr to 5 Cr
    TIER_2_INCREMENT: 20,  // +20 L
    TIER_3_INCREMENT: 50,  // Above 5 Cr -> +50 L
  },

  // Event Metadata
  EVENT_NAME: "The IPL Mega Auction",
  ORGANIZER: "VITB-MUN Club",
  VENUE: "VIT Bhopal University",
  TOTAL_FRANCHISES: 15,
  TOTAL_ROUNDS: 2,
  MAX_PARTICIPANTS: 60,
} as const;
