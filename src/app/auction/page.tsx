"use client";

import React from "react";
import { BroadcastHeader } from "../../components/auction/BroadcastHeader";
import { PlayerBroadcastCard } from "../../components/auction/PlayerBroadcastCard";
import { LiveBiddingCenterpiece } from "../../components/auction/LiveBiddingCenterpiece";
import { LiveBidFeed } from "../../components/auction/LiveBidFeed";
import { FranchisePurseStrip } from "../../components/auction/FranchisePurseStrip";
import { SoldOverlay } from "../../components/auction/SoldOverlay";
import { UnsoldOverlay } from "../../components/auction/UnsoldOverlay";
import { useAuction } from "../../lib/store/useAuction";

export default function BigScreenAuctionPage() {
  const { currentPlayer } = useAuction();

  return (
    <main className="h-screen w-screen bg-void flex flex-col overflow-hidden select-none bg-tech-grid">
      {/* Broadcast Header Rail */}
      <BroadcastHeader />

      {/* Main Broadcast Control Arena */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* Left: Player Lot Presentation (5 Cols) */}
        <div className="lg:col-span-5 h-full">
          <PlayerBroadcastCard player={currentPlayer} />
        </div>

        {/* Center: Live Bidding & Clock Centerpiece (4 Cols) */}
        <div className="lg:col-span-4 h-full">
          <LiveBiddingCenterpiece />
        </div>

        {/* Right: Live Bid Order Log (3 Cols) */}
        <div className="lg:col-span-3 h-full">
          <LiveBidFeed />
        </div>
      </div>

      {/* Bottom Franchise Purse Rail */}
      <FranchisePurseStrip />

      {/* Cinematic Overlays */}
      <SoldOverlay />
      <UnsoldOverlay />
    </main>
  );
}
