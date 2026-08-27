# VITBMUN IPL MEGA AUCTION
## Frontend → Supabase Backend Integration Handoff

**DOCUMENT STATUS**: FINAL FRONTEND CONTRACT  
**Version**: 1.0  
**Purpose**: Backend integration reference  
**Target Audience**: Supabase / Backend / Database / Realtime Engineers  
**Frontend Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS  

---

## 1. Document Purpose

This document provides the authoritative, complete specification of what the finalized Next.js frontend expects from the **Supabase backend**.

The frontend UI, styling, and route structure are **strictly FINAL**. This document enables a backend or full-stack engineer who has not worked on the frontend codebase to immediately understand:
* Application architecture and route boundaries
* Exact data models and contracts for auction, team, and player states
* Atomic bidding transaction flows and concurrency safety guarantees
* Admin gavel operations and manual proxy bidding workflows
* Realtime synchronization and event subscription contracts
* Integer-Lakh financial arithmetic rules and timer deadline calculations
* Error handling conventions and edge-case reconnect behavior

> [!IMPORTANT]
> The backend team will implement the Supabase database schema, RPC functions, and realtime channels **underneath the existing frontend data abstraction layer** (`src/lib/repository/`) without redesigning or altering the approved frontend UI.

---

## 2. Final Product Structure

The application features **exactly three user-facing routes**:

```
/                → Public Landing Page & Event Catalogue
/auction         → Public Live Auction Hub (Dual-Mode: Common Board + Team Dossier)
/admin           → Private Auctioneer Operations Desk
```

> [!CAUTION]
> **Do NOT create separate public routes such as `/team`, `/judge`, or `/auction/team`.**  
> Team dossiers, squad compliance checks, and judge matrices are integrated in-place inside `/auction`.  
> There is **no public navigation link to `/admin`**. Direct URL access to `/admin` is guarded by an authentication gate.

---

## 3. Route Specifications

### `/` — Landing Page
* **Function**: Public marketing, event catalogue, tournament parameters, and primary entry gate.
* **Backend Requirement**: Static / low-frequency read. Does NOT participate in live bidding loops.
* **Content Communicated**:
  * **Event**: VITBMUN — The IPL Mega Auction
  * **Franchises**: 15 competing franchises
  * **Starting Purse**: ₹125 CR per franchise
  * **Player Pool**: 200+ real players
  * **Format**: Tactical bidding simulation against rival franchises
* **Call to Action**: Direct link to `/auction`.

### `/auction` — Public Live Auction Hub
* **Function**: Primary realtime stage for spectators, participants, and projector broadcasts.
* **Architecture**: Contains **TWO internal view modes** on the **SAME URL** (`/auction`):
  1. **Common Board**: High-visibility projector dashboard (active lot, countdown clock, leader swatch, live bid feed, previous lot outcome, and 15-franchise ledger).
  2. **Team Dossier**: In-place franchise telemetry view (financial balance, squad slot tracker, mandatory role compliance meter, tactical lot status, acquired roster, and franchise bidding history).
* **State Contract**: Both views consume the **exact same live auction state**. Switching views is an instant client-side render without page reloads or URL modification.

### `/admin` — Private Operations Desk
* **Function**: Authoritative auctioneer console for stage orchestration, clock control, lot queueing, gavel execution, and manual proxy bidding.
* **Access**: Restricted behind the Admin Security Gate (`/admin`).

---

## 4. Common Board Data Contract

The Common Board on `/auction` requires a realtime subscription delivering the following dataset:

| Section | Required Field | Type / Description |
| :--- | :--- | :--- |
| **Current Auction** | `status` | `"IDLE"` \| `"READY"` \| `"LIVE"` \| `"PAUSED"` \| `"SOLD"` \| `"UNSOLD"` |
| | `phase` | Current tournament phase (`"ROUND_1"`, `"BREAK"`, `"ROUND_2"`, etc.) |
| | `round` | `1` \| `2` |
| | `currentPlayerId` | String UUID or ID referencing active player |
| | `currentBid` | Integer Lakhs (e.g. `240` = ₹2.40 Cr) |
| | `leadingTeamId` | String ID referencing franchise holding highest bid |
| | `biddingEndsAt` | Absolute epoch timestamp (ms) representing the deadline |
| | `lotNumber` | Integer sequence counter for current lot |
| **Current Player** | `id`, `name` | Player identifier and display name |
| | `role` | `"BATTER"` \| `"BOWLER"` \| `"ALL_ROUNDER"` \| `"WICKETKEEPER"` |
| | `basePrice` | Integer Lakhs (e.g. `200` = ₹2.00 Cr) |
| | `nationality` | `"Indian"` \| `"Overseas"` |
| | `category` | `"MARQUEE"` \| `"BATTER"` \| `"BOWLER"` \| `"ALL_ROUNDER"` \| `"WICKETKEEPER"` \| `"UNCAPPED"` |
| | `statsSummary` | Key cricket metrics (matches, runs, wickets, strike rate, economy) |
| **Live Bidding** | `recentBids` | Array of recent bids ordered latest-first: `{ id, teamId, teamName, teamShortName, teamColor, amount, timestamp, sequence }` |
| **Previous Lot** | `previousLot` | `{ player, status: "SOLD" \| "UNSOLD", winningTeam?, finalPrice? }` |
| **Team Ledger** | `teams` | Array / Record of all 15 franchises with `id`, `shortName`, `startingPurse`, `spentPurse`, `remainingPurse`, `squad.length` |

---

## 5. Team Dossier Data Contract

When a user selects a franchise inside `/auction`, the frontend renders a dedicated franchise dossier requiring:

1. **Identity**: Franchise ID, full name, short code, and primary/accent branding hex colors.
2. **Financials**:
   * `startingPurse`: `12500` Lakhs (₹125.00 Cr)
   * `spentPurse`: Total sum spent on acquired players in Lakhs
   * `remainingPurse`: `startingPurse - spentPurse` in Lakhs
   * `amountAvailable`: Maximum legal bid possible considering minimum reserve rules
3. **Squad Roster**:
   * Acquired players array: `[{ id, name, role, soldPrice, nationality }]`
   * Squad slot counter: `currentCount / 11` (e.g. `4 / 11`)
4. **Role Distribution & Compliance**:
   * `roleCounts`: `{ BATTER: number, BOWLER: number, ALL_ROUNDER: number, WICKETKEEPER: number }`
   * **Mandatory Quotas**:
     * Minimum `1` Wicketkeeper (`WICKETKEEPER >= 1`)
     * Minimum `3` Bowlers (`BOWLER >= 3`)
     * Minimum `7` Squad Size (`squad.length >= 7`)
   * **Status Tag**: `"SQUAD COMPLIANT"` vs `"REQUIREMENT PENDING"`
5. **Current Lot Tactical Status**:
   * Read-only eligibility check: Is this franchise currently leading? Can this franchise afford the next bid increment? Is the squad already capped at 11?
6. **Franchise Bidding Record**:
   * Array of lots where this franchise submitted bids: `{ playerId, playerName, peakBid, outcome: "WON" | "LOST" | "IN_PROGRESS" }`.

---

## 6. Monetary Representation: Strict Integer Lakhs

> [!IMPORTANT]
> **ALL MONETARY VALUES MUST BE STORED AND TRANSMITTED AS INTEGER LAKHS.**  
> Floating-point currency values (e.g. `1.25` or `125.5`) are **strictly prohibited** in the database and API to eliminate floating-point rounding errors.

### Conversion Reference Table
| Standard INR Currency | Integer Lakhs (Database Value) | Frontend Display Format |
| :--- | :--- | :--- |
| **₹125 Crore** | `12500` | `₹125.00 Cr` (or `₹125 Cr`) |
| **₹100 Crore** | `10000` | `₹100.00 Cr` (or `₹100 Cr`) |
| **₹10 Crore** | `1000` | `₹10.00 Cr` |
| **₹5 Crore** | `500` | `₹5.00 Cr` |
| **₹2 Crore** | `200` | `₹2.00 Cr` |
| **₹1 Crore** | `100` | `₹1.00 Cr` |
| **₹50 Lakh** | `50` | `₹50 L` |
| **₹20 Lakh** | `20` | `₹20 L` |
| **₹10 Lakh** | `10` | `₹10 L` |

---

## 7. Bid Increment Tier Rules

The backend database function must independently compute and validate legal bid increments:

```typescript
// Legal Bid Calculation Formula
function getBidIncrement(currentBidLakhs: number): number {
  if (currentBidLakhs < 100) {
    return 10; // Below ₹1 Cr: +₹10 L
  } else if (currentBidLakhs < 500) {
    return 20; // ₹1 Cr to ₹5 Cr: +₹20 L
  } else {
    return 50; // Above ₹5 Cr: +₹50 L
  }
}

function getNextValidBid(currentBidLakhs: number, basePriceLakhs: number): number {
  if (currentBidLakhs === 0) return basePriceLakhs;
  return currentBidLakhs + getBidIncrement(currentBidLakhs);
}
```

---

## 8. Authoritative Bidding & Concurrency Flow

```
Team / Admin Client
       │
       ▼
1. User clicks BID (or Admin submits Manual Proxy Bid)
       │
       ▼
2. Frontend calls Supabase RPC: place_bid(p_event_id, p_team_id, p_expected_amount)
       │
       ▼
3. PostgreSQL Atomic Transaction Execution:
   ├── Lock auction_state row for UPDATE (FOR UPDATE)
   ├── Validate auction.status == 'LIVE'
   ├── Validate now() < auction.bidding_ends_at
   ├── Validate p_team_id != auction.leading_team_id
   ├── Validate team.squad.length < 11
   ├── Compute required_bid = get_next_bid(auction.current_bid, player.base_price)
   ├── Validate p_expected_amount == required_bid (Prevents stale-click race conditions)
   ├── Validate team.remaining_purse >= required_bid
   ├── UPDATE auction_state SET current_bid = required_bid, leading_team_id = p_team_id,
   │                            bidding_ends_at = now() + interval '10 seconds',
   │                            bid_sequence = bid_sequence + 1
   ├── INSERT INTO bids (event_id, player_id, team_id, amount, sequence, timestamp)
   └── INSERT INTO audit_logs (...)
       │
       ▼
4. Supabase Realtime emits change on 'auction_state' & 'bids' channels
       │
       ▼
5. ALL connected /auction & /admin clients update in < 500ms
```

### Concurrency Protection Guarantee
* When two teams submit bids simultaneously within milliseconds, PostgreSQL row locking (`SELECT ... FOR UPDATE`) serializes the transactions.
* **Winner**: The first transaction commits, updating `current_bid` and `leading_team_id`.
* **Loser**: The second transaction reads the updated `current_bid`, fails the `expected_amount` validation, and is cleanly rejected with error `CONFLICT_BID_SUPERSEDED`.

---

## 9. Server-Authoritative Timer & Deadline

* **Source of Truth**: `biddingEndsAt` (stored as an absolute UTC timestamp).
* **Initial Lot Opening**: Configured to `now() + 20 seconds`.
* **Subsequent Valid Bids**: Resets deadline to `now() + 10 seconds`.
* **Clock Expiration**: Bids received when `now() >= bidding_ends_at` are rejected with `BIDDING_WINDOW_CLOSED`.
* **Client Role**: The frontend visualizes the remaining seconds via `Math.max(0, Math.ceil((biddingEndsAt - Date.now()) / 1000))`.

---

## 10. Gavel Operations (Admin Settlement)

### A. Hammer SOLD Flow
Triggered by auctioneer via `mark_sold(p_event_id, p_player_id, p_team_id, p_price)`:
1. Lock `auction_state`, `players`, and `teams` rows.
2. Verify `auction.status == 'LIVE'` or `'PAUSED'`.
3. Verify `auction.leading_team_id` exists and `auction.current_bid > 0`.
4. Deduct `finalPrice` from winning team's `remainingPurse` and add to `spentPurse`.
5. Append `player` to winning team's `squad`.
6. Update player row: `status = 'SOLD'`, `soldTo = teamId`, `soldPrice = price`.
7. Update `previousLot` snapshot in `auction_state`.
8. Update `auction_state`: `status = 'SOLD'`, `isTimerRunning = false`.
9. Insert entry into `audit_logs`.
10. Broadcast atomic payload to all connected clients.

### B. Mark UNSOLD Flow
Triggered via `mark_unsold(p_event_id, p_player_id)`:
1. Update player row: `status = 'UNSOLD'`, `round = 2` (eligible for Round 2 recall).
2. Set `previousLot = { player, status: 'UNSOLD' }`.
3. Update `auction_state`: `status = 'UNSOLD'`, `currentBid = 0`, `leadingTeamId = null`.
4. Zero purse deduction; zero roster changes.
5. Insert audit log and broadcast.

### C. Undo Last Bid Flow
Triggered via `undo_bid(p_event_id)`:
1. Revert `auction_state.current_bid` and `leading_team_id` to the previous bid in `bids` history.
2. Delete or flag the invalidated bid in `bids`.
3. Reset deadline to `now() + 10 seconds`.
4. Insert audit record: `action = 'UNDO_BID'`.

---

## 11. Manual / Proxy Bidding Workflow

Auctioneers can submit bids on behalf of teams via the Admin manual bid modal:

```
Admin clicks MANUAL BID
       │
       ▼
Admin selects franchise (e.g. "Chennai Super Kings")
       │
       ▼
Admin enters custom or incremented amount (e.g. ₹4.20 Cr = 420 Lakhs)
       │
       ▼
Admin clicks SUBMIT PROXY BID
       │
       ▼
Calls RPC: place_manual_bid(p_event_id, p_team_id, p_amount)
       │
       ▼
Validates purse, roster slot (<11), and auction state
       │
       ▼
Commits with audit_logs.actor = 'ADMIN'
       │
       ▼
Realtime broadcast updates all screens instantly
```

---

## 12. Recommended Supabase Schema

```sql
-- 1. Events Table
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phase TEXT NOT NULL DEFAULT 'ROUND_1',
  round INT NOT NULL DEFAULT 1,
  starting_purse_lakhs INT NOT NULL DEFAULT 12500,
  min_squad_size INT NOT NULL DEFAULT 7,
  max_squad_size INT NOT NULL DEFAULT 11,
  min_wks INT NOT NULL DEFAULT 1,
  min_bowlers INT NOT NULL DEFAULT 3,
  initial_timer_seconds INT NOT NULL DEFAULT 20,
  bid_reset_timer_seconds INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Franchises / Teams Table
CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  city TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  starting_purse_lakhs INT NOT NULL DEFAULT 12500,
  remaining_purse_lakhs INT NOT NULL DEFAULT 12500,
  spent_purse_lakhs INT NOT NULL DEFAULT 0,
  captain_name TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Players Table
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('BATTER', 'BOWLER', 'ALL_ROUNDER', 'WICKETKEEPER')),
  category TEXT NOT NULL CHECK (category IN ('MARQUEE', 'BATTER', 'BOWLER', 'ALL_ROUNDER', 'WICKETKEEPER', 'UNCAPPED')),
  base_price_lakhs INT NOT NULL,
  nationality TEXT NOT NULL DEFAULT 'Indian',
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'LIVE', 'SOLD', 'UNSOLD', 'RETURNED')),
  sold_to TEXT REFERENCES teams(id),
  sold_price_lakhs INT,
  round INT NOT NULL DEFAULT 1,
  stats_summary JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Authoritative Auction State Table (Single Row Per Event)
CREATE TABLE auction_state (
  event_id TEXT PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'IDLE' CHECK (status IN ('IDLE', 'READY', 'LIVE', 'PAUSED', 'SOLD', 'UNSOLD')),
  phase TEXT NOT NULL DEFAULT 'ROUND_1',
  round INT NOT NULL DEFAULT 1,
  current_player_id TEXT REFERENCES players(id),
  current_bid_lakhs INT NOT NULL DEFAULT 0,
  leading_team_id TEXT REFERENCES teams(id),
  bidding_ends_at TIMESTAMPTZ,
  is_timer_running BOOLEAN NOT NULL DEFAULT false,
  bid_sequence INT NOT NULL DEFAULT 0,
  last_bid_at TIMESTAMPTZ,
  previous_lot JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Bids History Table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL REFERENCES players(id),
  team_id TEXT NOT NULL REFERENCES teams(id),
  amount_lakhs INT NOT NULL,
  sequence INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  actor TEXT NOT NULL CHECK (actor IN ('ADMIN', 'SYSTEM', 'CAPTAIN')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 13. Frontend Service Interface Contract

The Supabase repository implementation (`src/lib/repository/SupabaseAuctionRepository.ts`) will implement this exact TypeScript interface:

```typescript
export interface AuctionRepository {
  // Synchronous State Snapshot
  getState(): FullTournamentState;
  
  // Realtime State Listener
  subscribe(callback: (state: FullTournamentState) => void): () => void;

  // Auctioneer Gavel Controls
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

  // Tournament Utilities
  resetTournament(eventId?: string): Promise<void>;
  toggleSound(): void;
  clearOverlays(): void;
}
```

---

## 14. Error Code Conventions

When an RPC function encounters an error, return standardized error codes:

| Error Code | Trigger Condition | Frontend Behavior |
| :--- | :--- | :--- |
| `AUCTION_NOT_LIVE` | Bid submitted when auction is `PAUSED` or `IDLE` | Toast: "Auction is not currently live" |
| `BIDDING_WINDOW_CLOSED` | Bid submitted after `biddingEndsAt` | Toast: "Bidding window has closed" |
| `CONFLICT_BID_SUPERSEDED` | Concurrent bid arrived first; expected amount mismatch | Toast: "Bid superseded by another franchise" |
| `INSUFFICIENT_PURSE` | Bid amount exceeds team's remaining purse | Toast: "Insufficient purse balance" |
| `SQUAD_FULL` | Franchise already has 11 acquired players | Toast: "Squad limit reached (11 players)" |
| `ALREADY_LEADING` | Leading franchise attempts to bid against itself | Toast: "Your franchise is already holding highest bid" |
| `PLAYER_NOT_AVAILABLE` | Attempt to queue sold or invalid player | Toast: "Player is not available for auction" |
| `UNAUTHORIZED` | Non-admin attempts gavel or manual bid | Toast: "Administrative authentication required" |

---

## 15. Authentication & Security Boundaries

1. **Public Viewers (Spectators / Big Screens)**:
   * Read-only access to `events`, `teams`, `players`, `auction_state`, `bids`.
   * Row Level Security (RLS) allows `SELECT` for `anon` role.
2. **Team Captain Terminals**:
   * Authenticated via Supabase Auth with custom user metadata (`teamId`).
   * RLS allows `place_bid` RPC only for their assigned `teamId`.
3. **Auctioneer / Administrator**:
   * Authenticated via Supabase Auth with `role = 'admin'` claim.
   * Authorized to execute gavel RPCs and `place_manual_bid`.
4. **Credential Security**:
   * `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for client-side bundle.
   * `SUPABASE_SERVICE_ROLE_KEY` **MUST NEVER BE EXPOSED TO THE FRONTEND BUNDLE**.

---

## 16. Integration Verification Checklist

Before deploying the live event, verify every item below:

```markdown
- [ ] Supabase project provisioned and database tables created
- [ ] Row Level Security (RLS) policies configured and tested
- [ ] Realtime enabled on 'auction_state', 'bids', 'teams', and 'players'
- [ ] Seed data loaded: Exactly 15 franchises initialized
- [ ] Seed data loaded: Exactly 200+ real players initialized
- [ ] Starting purse verified: ₹125 CR (12,500 Lakhs) per team
- [ ] Tiered bid increments verified (<1Cr: +10L, 1-5Cr: +20L, >5Cr: +50L)
- [ ] Concurrent bid race condition test executed (Only 1 winner per increment)
- [ ] Late bid rejection test executed (now() > biddingEndsAt rejected)
- [ ] Hammer SOLD settlement test executed (atomic purse deduction & roster append)
- [ ] Mark UNSOLD test executed (player moved to Round 2 pool, zero purse deduction)
- [ ] Admin manual proxy bid tested across all 15 franchises
- [ ] Client disconnect & reconnect test executed (state automatically resyncs)
- [ ] Production build succeeds without errors (`npm run build`)
- [ ] 1920x1080 big-screen projector view verified
```

---

## 17. Practical Test Scenarios

### Test 1: Simultaneous Bidding Race Condition
* **Action**: CSK and MI both click "BID ₹2.60 Cr" at the exact same millisecond.
* **Expected Result**: Exactly one bid succeeds (e.g. CSK at ₹2.60 Cr). MI receives `CONFLICT_BID_SUPERSEDED`, and their UI instantly shows next available bid as ₹2.80 Cr.

### Test 2: Late Bid Rejection
* **Action**: Team submits bid at `t = 20.1s` when `biddingEndsAt` was `t = 20.0s`.
* **Expected Result**: Database transaction rejects bid with `BIDDING_WINDOW_CLOSED`.

### Test 3: Roster Cap Enforcement
* **Action**: Franchise with 11 players attempts to place bid on 12th player.
* **Expected Result**: Rejected with `SQUAD_FULL`.

### Test 4: Hammer SOLD Settlement
* **Action**: Admin hammers SOLD on Rohit Sharma for ₹18.50 Cr (1850 Lakhs) to RCB.
* **Expected Result**: In a single atomic transaction:
  * RCB `remainingPurse` decreases by `1850` Lakhs.
  * Rohit Sharma `status` becomes `SOLD` with `soldTo = 'RCB'`.
  * `previousLot` updates to Rohit Sharma (SOLD, ₹18.50 Cr, RCB).
  * Realtime broadcast delivers updated balances to all 60+ connected devices in < 500ms.

---

## 18. Final Handoff Principle

> "The frontend is visually and structurally **FINAL**. Supabase integration should connect to the existing repository/data layer without changing the approved UI or route architecture. Any required frontend modification should be limited to genuine backend contract incompatibilities and must not alter the approved user experience."
