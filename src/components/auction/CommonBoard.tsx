"use client";

import React from "react";
import { PlayerBroadcastCard } from "./PlayerBroadcastCard";
import { LiveBiddingCenterpiece } from "./LiveBiddingCenterpiece";
import { LiveBidFeed } from "./LiveBidFeed";
import { PreviousPlayerCard } from "./PreviousPlayerCard";
import { AllTeamsPurseTable } from "./AllTeamsPurseTable";
import { useAuction } from "../../lib/store/useAuction";

interface CommonBoardProps {
  onSelectTeam: (teamId: string) => void;
}

export function CommonBoard({ onSelectTeam }: CommonBoardProps) {
  const { currentPlayer } = useAuction();

  return (
    <div className="space-y-6">
      {/* Main Broadcast Control Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Player Lot Presentation (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <PlayerBroadcastCard player={currentPlayer} />
        </div>

        {/* Center: Live Bidding & Clock Centerpiece + Previous Lot (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <LiveBiddingCenterpiece />
          <PreviousPlayerCard />
        </div>

        {/* Right: Live Bid Order Log (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col min-h-[400px] lg:min-h-0">
          <LiveBidFeed />
        </div>
      </div>

      {/* Bottom 15-Franchise Purse Ledger */}
      <div>
        <AllTeamsPurseTable onSelectTeam={onSelectTeam} />
      </div>
    </div>
  );
}
