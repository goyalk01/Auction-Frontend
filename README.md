# Auction-Frontend

**VITBMUN Club — The IPL Mega Auction**

A production-grade, real-time fantasy IPL mega auction platform built for live in-person university bidding events (up to 60 concurrent participants across 15 franchises).

---

## 🌟 Key Features

- **Luxury Auction House Aesthetic**: Cinematic dark UI with gold accents, live purse tickers, glowing gavel overlays, and responsive trading terminals.
- **15 Franchises & 200+ Real Players**: 10 official IPL franchises + 5 regional squads, 200+ real players with roles, stats, and base prices.
- **Strict Integer-Lakh Arithmetic**: Prevents floating-point financial bugs (₹125 Cr starting purse per team, tiered increment brackets).
- **Core Routes**:
  - `/` — Public Landing & Catalogue
  - `/auction` — Live Auction Hub (Common Board + Team Dossier)
  - `/admin` — Auctioneer Mission Control Desk & Emergency Controls
- **Hybrid Architecture (Realtime + Local Mock Engine)**:
  - Atomic Transactions & Real-time Listeners for production live-event synchronization.
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

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Custom Design System
- **Audio Engine**: Web Audio API Synthesizer (Zero asset dependencies)
- **Animations**: Framer Motion & Canvas Confetti
