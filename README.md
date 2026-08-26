# Auction-Frontend

**VIT Bhopal MUN Club — The IPL Mega Auction**

A production-grade, real-time fantasy IPL mega auction platform built for live in-person university bidding events (up to 60 concurrent participants across 15 franchises).

---

## 🌟 Key Features

- **Luxury Auction House Aesthetic**: Cinematic dark UI with gold accents, live purse tickers, glowing gavel overlays, and responsive trading terminals.
- **15 Franchises & 120 Players**: 10 official IPL franchises + 5 regional squads, 120 curated players with roles, stats, and base prices.
- **Strict Integer-Lakh Arithmetic**: Prevents floating-point financial bugs (₹100 Cr starting purse per team, tiered increment brackets).
- **Multi-Role Portals**:
  - `/` — Public Landing & Catalogue
  - `/auction` — Big Screen 1080p Broadcast / Projector View
  - `/team` — Franchise Captain Trading Terminal with Touch Bidding
  - `/admin` — Auctioneer Mission Control Desk & Emergency Controls
  - `/judge` — Judicial Evaluation Matrix & Compliance Dossiers
- **Hybrid Architecture (Firebase + Local Mock)**:
  - Firestore Atomic Transactions & Real-time Listeners for production live-event synchronization.
  - In-browser `BroadcastChannel` & `localStorage` mock engine for offline development and local dry-runs.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/goyalk01/Auction-Frontend.git
cd Auction-Frontend

# Install dependencies
npm install
```

### Running Locally (Mock Mode)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Open multiple tabs across `/auction`, `/team`, and `/admin` to test live cross-tab bidding!

### Connecting to Firebase (Production Mode)

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in your Firebase project credentials.
3. Deploy Firestore security rules using `firebase deploy --only firestore:rules`.
4. Seed the tournament database using `/api/seed` or the Admin portal.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Custom Design System
- **Real-Time Database & Auth**: Firebase Firestore & Firebase Auth
- **Audio Engine**: Web Audio API Synthesizer (Zero asset dependencies)
- **Animations**: Framer Motion & Canvas Confetti
