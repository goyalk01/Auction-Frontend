"use client";

import React, { useState } from "react";
import { useAuction } from "../../lib/store/useAuction";
import { Button } from "../ui/Button";
import { ManualBidModal } from "./ManualBidModal";

export function AuctionControlBar() {
  const {
    auction,
    currentPlayer,
    leadingTeam,
    startAuction,
    pauseAuction,
    resetTimer,
    markSold,
    markUnsold,
    nextPlayer,
    undoLastBid,
  } = useAuction();

  const [manualBidOpen, setManualBidOpen] = useState(false);
  const isLive = auction.status === "LIVE";
  const hasCurrentBid = auction.currentBid > 0 && auction.leadingTeamId !== null;

  return (
    <>
      <div className="p-5 bg-charcoal border border-white/[0.08] rounded-md space-y-4 select-none">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-silver-light uppercase tracking-[0.2em]">
              OPERATIONS {"//"} AUCTIONEER GAVEL DESK
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-silver-dark">
              CLOCK: <strong className="text-silver-bright">{auction.timer}S</strong>
            </span>
            <button
              onClick={() => resetTimer(20)}
              className="px-2 py-0.5 rounded-sm bg-deep border border-graphite text-silver hover:text-white text-[11px] font-bold"
            >
              RESET 20S
            </button>
          </div>
        </div>

        {/* Primary Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Start / Pause */}
          {isLive ? (
            <Button
              variant="secondary"
              size="md"
              onClick={pauseAuction}
            >
              PAUSE
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={startAuction}
              disabled={!currentPlayer}
            >
              START CLOCK
            </Button>
          )}

          {/* Mark SOLD */}
          <Button
            variant="gold"
            size="md"
            onClick={() => markSold()}
            disabled={!hasCurrentBid || !currentPlayer}
            title={hasCurrentBid ? `Sell to ${leadingTeam?.franchise.name}` : "Requires at least 1 bid"}
          >
            HAMMER SOLD
          </Button>

          {/* Mark UNSOLD */}
          <Button
            variant="danger"
            size="md"
            onClick={markUnsold}
            disabled={!currentPlayer}
          >
            MARK UNSOLD
          </Button>

          {/* Proxy Bid */}
          <Button
            variant="secondary"
            size="md"
            onClick={() => setManualBidOpen(true)}
            disabled={!currentPlayer}
          >
            PROXY BID
          </Button>

          {/* Undo Bid */}
          <Button
            variant="outline"
            size="md"
            onClick={undoLastBid}
            disabled={auction.recentBids.length === 0}
          >
            UNDO BID
          </Button>

          {/* Next Lot */}
          <Button
            variant="secondary"
            size="md"
            onClick={nextPlayer}
          >
            NEXT LOT →
          </Button>
        </div>
      </div>

      <ManualBidModal
        isOpen={manualBidOpen}
        onClose={() => setManualBidOpen(false)}
      />
    </>
  );
}
