# VITBMUN IPL Mega Auction — Frontend Handoff Specification

**Document Status**: FINAL UI FREEZE  
**Target Audience**: Backend Engineers (Supabase / Database / Realtime Developers)  
**Framework**: Next.js 14 (App Router) + TypeScript + Tailwind CSS  

---

## 1. Route Structure

The frontend consists of **exactly three user-facing routes**:

```
/                → Public Landing Page & Event Catalogue
/auction         → Public Live Auction Hub (Dual-Mode: Common Board + Team Dossier)
/admin           → Private Auctioneer Desk (Gavel, Timers, Player Pool & Manual Proxy Bidding)
```

> [!IMPORTANT]
> **No public `/team` or `/judge` routes exist.** Team-specific dossiers and squad compliance matrices are integrated directly into `/auction` via internal state switching (`viewMode = "common" | "team"`). The URL remains `/auction` at all times.
> **No public navigation links to `/admin` exist.** Direct URL access to `/admin` is guarded by an authentication gate.

---

## 2. Component Structure & Architecture

```
src/
├── app/
│   ├── page.tsx                      # Landing page with stadium atmosphere and single CTA
│   ├── auction/page.tsx              # Live auction hub with internal Common/Team state switcher
│   ├── admin/page.tsx                # Admin desk with security gate and gavel controls
│   ├── globals.css                   # Theme tokens, font definitions, and stadium overlays
│   └── layout.tsx                    # Root HTML wrapper with AuthProvider
├── components/
│   ├── auction/
│   │   ├── BroadcastHeader.tsx       # Live status rail, mode switcher, sound toggle, fullscreen
│   │   ├── AuctionViewToggle.tsx     # Selector for Common Board vs 15 Franchise Dossiers
│   │   ├── CommonBoard.tsx           # Audience & projector view (active lot, bid feed, ledger)
│   │   ├── PlayerBroadcastCard.tsx   # Prominent active lot player showcase
│   │   ├── LiveBiddingCenterpiece.tsx# Countdown clock, current high bid, and leader swatch
│   │   ├── LiveBidFeed.tsx           # Chronological incoming bid stream with timestamps
│   │   ├── PreviousPlayerCard.tsx    # Resolution status of the previous lot (Sold/Unsold)
│   │   ├── AllTeamsPurseTable.tsx    # Live 15-franchise purse balances & squad slot ledger
│   │   ├── TeamDossier.tsx           # Franchise financial breakdown, compliance & roster
│   │   ├── TeamCurrentLotStatus.tsx  # Read-only tactical evaluation from team perspective
│   │   ├── TeamBidHistory.tsx        # Historical record of targets engaged & outcomes
│   │   ├── SoldOverlay.tsx           # Cinematic hammer sold overlay
│   │   └── UnsoldOverlay.tsx         # Cinematic unsold notification overlay
│   ├── admin/
│   │   ├── AuctionControlBar.tsx     # Gavel controls with confirmation modals (Sold, Unsold, Undo)
│   │   ├── ManualBidModal.tsx        # Authoritative proxy bidding dialog with team selector
│   │   ├── PhaseManager.tsx          # Tournament stage transitions (Round 1, Round 2, Review)
│   │   ├── PlayerPoolManager.tsx     # Searchable player pool and lot queue manager
│   │   ├── TeamsOverviewTable.tsx    # Tabular financial and squad overview for all teams
│   │   └── AuditLogViewer.tsx        # Chronological administrator activity audit trail
│   ├── layout/
│   │   ├── Navbar.tsx                # Clean public navigation (HOME + LIVE AUCTION only)
│   │   └── Footer.tsx                # Minimalist footer with event parameters
│   ├── landing/                      # Landing page sections (Hero, Operating Timeline, Franchises)
│   ├── auth/                         # Modals for Admin and Team credential authentication
│   └── ui/                           # Atoms (Button, Badge, Modal, PlayerAvatar)
├── lib/
│   ├── constants.ts                  # Centralized tournament rules, purse limits, and bid tiers
│   ├── formatting.ts                 # Currency and number formatters (Integer Lakhs to Cr/L)
│   ├── bidding.ts                    # Incremental pricing tier calculator and eligibility validators
│   ├── sound.ts                      # Web Audio synthesizers for gavel, bid, and buzzer events
│   ├── repository/                   # Abstract AuctionRepository and FullTournamentState contracts
│   └── store/useAuction.ts           # React state hook consumed by all UI components
├── types/
│   ├── auction.ts                    # TypeScript domain interfaces (Player, TeamState, Bid, etc.)
│   ├── auth.ts                       # User session roles (ADMIN, TEAM, SPECTATOR)
│   └── repository.ts                 # AuctionRepository interface specification
└── data/
    ├── franchises.ts                 # Initial 15 franchise definitions and branding colors
    └── players.ts                    # Initial player pool definitions
```

---

## 3. Centralized Tournament Rules (`src/lib/constants.ts`)

The backend must enforce the exact business constants configured in the frontend:

```typescript
export const AUCTION_CONSTANTS = {
  STARTING_PURSE_LAKHS: 12500,     // ₹125 Crore (12,500 Lakhs)
  MIN_SQUAD_SIZE: 7,               // Minimum players required
  MAX_SQUAD_SIZE: 11,              // Maximum roster slots
  MIN_WICKETKEEPERS: 1,            // Mandatory WK quota
  MIN_BOWLERS: 3,                  // Mandatory Bowler quota
  INITIAL_TIMER_SECONDS: 20,       // New lot opening timer
  BID_RESET_TIMER_SECONDS: 10,     // Timer reset on each new bid
  INCREMENTS: {
    TIER_1_THRESHOLD: 100,         // Below ₹1 Cr
    TIER_1_INCREMENT: 10,          // + ₹10 L
    TIER_2_THRESHOLD: 500,         // ₹1 Cr to ₹5 Cr
    TIER_2_INCREMENT: 20,          // + ₹20 L
    TIER_3_INCREMENT: 50,          // Above ₹5 Cr (+ ₹50 L)
  },
};
```

---

## 4. How to Run the Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run full TypeScript verification
npx tsc --noEmit

# Run production build
npm run build

# Start production server
npm start
```
