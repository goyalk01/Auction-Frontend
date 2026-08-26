"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { ArrowRight, X } from "lucide-react";
import { Button } from "../ui/Button";

export function UnsoldOverlay() {
  const { auction, clearOverlays, nextPlayer } = useAuction();
  const player = auction.unsoldPlayerOverlay;

  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/95 select-none">
      <div className="relative w-full max-w-lg p-8 sm:p-10 bg-charcoal border border-danger/60 rounded-md text-center space-y-6 shadow-2xl">
        {/* Top Dismiss Button */}
        <button
          onClick={clearOverlays}
          className="absolute top-4 right-4 p-1 rounded text-silver-dark hover:text-silver-bright"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-[1px] bg-danger mx-auto" />

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-danger uppercase tracking-[0.3em] block">
            LOT #{player.id.replace("p-", "")} {"//"} PASSED
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-danger tracking-tight uppercase">
            UNSOLD
          </h2>
        </div>

        <div className="text-xl sm:text-2xl font-display font-bold text-silver-bright uppercase">
          {player.name}
        </div>

        <p className="text-xs font-mono text-silver border-y border-white/[0.08] py-3">
          NO VALID BIDS LOGGED. LOT WILL RETURN IN ROUND 02.
        </p>

        <div className="w-16 h-[1px] bg-danger mx-auto" />

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              clearOverlays();
              nextPlayer();
            }}
          >
            NEXT LOT
          </Button>

          <Button variant="outline" size="md" onClick={clearOverlays}>
            DISMISS
          </Button>
        </div>
      </div>
    </div>
  );
}
