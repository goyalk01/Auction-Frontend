# VITB-MUN IPL Mega Auction — Frontend Handoff Specification

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
│   ├── landing/                      # Landing page sections (Hero, Stats, About, Timeline, Rules)
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
    └── players.ts                    # Initial 120+ player pool definitions
```

---

## 3. Existing Repository & Data Abstraction

All UI components are **completely decoupled from backend databases** (Supabase, Firebase, etc.). Components consume data and dispatch actions exclusively through the `useAuction()` hook, which interacts with the `AuctionRepository` interface:

```typescript
export interface AuctionRepository {
  // Synchronous State Snapshot
  getState(): FullTournamentState;
  
  // Realtime State Subscription
  subscribe(callback: (state: FullTournamentState) => void): () => void;

  // Auctioneer Gavel Operations
  selectPlayer(playerId: string): Promise<void>;
  startAuction(): Promise<void>;
  pauseAuction(): Promise<void>;
  resumeAuction(): Promise<void>;
  resetTimer(seconds?: number): Promise<void>;
  markSold(teamId?: string, price?: number): Promise<void>;
  markUnsold(): Promise<void>;
  nextPlayer(): Promise<void>;
  prevPlayer(): Promise<void>;
  reopenPlayer(playerId: string): Promise<void>;
  undoLastBid(): Promise<void>;
  setPhase(phase: AuctionPhase): Promise<void>;
  setRound(round: 1 | 2): Promise<void>;
  emergencyLock(): Promise<void>;

  // Bidding Operations
  placeBid(teamId: string, expectedAmount?: number): Promise<void>;
  placeManualBid(teamId: string, amount: number): Promise<void>;

  // Utilities
  resetTournament(eventId?: string): Promise<void>;
  toggleSound(): void;
  clearOverlays(): void;
}
```

---

## 4. Auction Domain Models (`src/types/auction.ts`)

### Financial Representation: Strict Integer Lakhs
To prevent floating-point precision errors during live transactions:
* **₹100 Crore** = `10000` Lakhs
* **₹2 Crore** = `200` Lakhs
* **₹50 Lakh** = `50` Lakhs

```typescript
export type PlayerRole = "BATTER" | "BOWLER" | "ALL_ROUNDER" | "WICKETKEEPER";
export type PlayerStatus = "AVAILABLE" | "LIVE" | "SOLD" | "UNSOLD" | "RETURNED";
export type PlayerCategory = "MARQUEE" | "BATTER" | "BOWLER" | "ALL_ROUNDER" | "WICKETKEEPER" | "UNCAPPED";

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  category: PlayerCategory;
  basePrice: number;       // in Lakhs (e.g., 200 = ₹2 Cr)
  nationality: "Indian" | "Overseas";
  battingStyle?: string;
  bowlingStyle?: string;
  status: PlayerStatus;
  soldTo?: string;         // teamId
  soldPrice?: number;      // in Lakhs
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
  primaryColor: string;    // Hex code
  secondaryColor: string;
  accentColor: string;
  bgGradient: string;
  textColor: string;
  startingPurse: number;   // 10000 Lakhs
  captainName?: string;
}

export interface TeamState {
  franchise: Franchise;
  remainingPurse: number;  // in Lakhs
  spentPurse: number;      // in Lakhs
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
  amount: number;          // in Lakhs
  timestamp: number;
  sequence: number;
}

export interface AuctionState {
  phase: AuctionPhase;
  status: "IDLE" | "READY" | "LIVE" | "PAUSED" | "SOLD" | "UNSOLD";
  round: 1 | 2;
  currentPlayerId: string | null;
  currentBid: number;      // in Lakhs
  leadingTeamId: string | null;
  timer: number;           // remaining seconds
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
```

---

## 5. Centralized Tournament Rules (`src/lib/constants.ts`)

The backend must enforce the exact business constants configured in the frontend:

```typescript
export const AUCTION_CONSTANTS = {
  STARTING_PURSE_LAKHS: 10000,     // ₹100 Crore
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

## 6. Required Backend / Realtime Requirements

1. **State Synchronization**:
   - Every connected client must receive updates to `AuctionState`, `players`, `teams`, and `auditLogs` with `< 500ms` latency.
2. **Server-Authoritative Timer**:
   - To prevent drift between devices, the backend should track `biddingEndsAt` (ISO timestamp or epoch millisecond). The client calculates `timer = Math.max(0, Math.ceil((biddingEndsAt - now) / 1000))`.
3. **Atomic Concurrency Protection**:
   - Bids must be validated and committed using atomic database transactions (e.g. Supabase RPC / Postgres functions) to reject stale bids or out-of-order race conditions.
4. **Purse & Quota Validation**:
   - Before accepting a bid, verify:
     - `team.remainingPurse >= bidAmount`
     - `team.squad.length < 11`
     - `auction.status === 'LIVE'`
     - `teamId !== auction.leadingTeamId`

---

## 7. Environment Variables Expected

Create a `.env.local` file with the relevant keys when connecting the backend:

```bash
# Supabase Configuration (When implemented by Backend Developer)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Mode toggle (defaults to 'mock' if Supabase is not configured)
NEXT_PUBLIC_BACKEND_MODE=mock # or 'supabase'
```

---

## 8. How to Run the Frontend

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

---

## 9. Known Assumptions & UI Boundaries

* **UI is Strictly Frozen**: No further layout, styling, or route changes should be made.
* **Read-Only Team View**: The Team Dossier on `/auction` is intentionally a read-only telemetry dashboard for audiences and captains. Bids can be placed either via the authoritative Admin proxy modal or connected captain terminals in future phases.
* **Sound Effects**: Uses the client-side Web Audio API (`src/lib/sound.ts`) and requires no backend assets.
* **Static Assets**: Stadium background is located at `public/images/stadium-bg.png`.
