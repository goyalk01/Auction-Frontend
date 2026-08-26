"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhs } from "../../lib/formatting";
import { ArrowRight, X } from "lucide-react";
import { Button } from "../ui/Button";

export function SoldOverlay() {
  const { auction, clearOverlays, nextPlayer } = useAuction();
  const overlay = auction.soldPlayerOverlay;

  if (!overlay) return null;

  const { player, team, price } = overlay;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/95 select-none">
      <div className="relative w-full max-w-xl p-8 sm:p-12 bg-charcoal border border-gold/60 rounded-md text-center space-y-6 shadow-2xl">
        {/* Top Dismiss Button */}
        <button
          onClick={clearOverlays}
          className="absolute top-4 right-4 p-1 rounded text-silver-dark hover:text-silver-bright"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Thin Gold Top Rule */}
        <div className="w-24 h-[1px] bg-gold mx-auto" />

        {/* SOLD Header */}
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-gold uppercase tracking-[0.3em] block">
            LOT #{player.id.replace("p-", "")} {"//"} HAMMER DOWN
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black text-gold tracking-tight uppercase">
            SOLD
          </h2>
        </div>

        {/* Player Name */}
        <div className="text-2xl sm:text-3xl font-display font-black text-silver-bright uppercase">
          {player.name}
        </div>

        {/* Price & Acquiring Franchise */}
        <div className="py-4 border-y border-white/[0.08] space-y-1">
          <div className="text-3xl sm:text-5xl font-display font-black text-silver-bright tabular-nums">
            {formatLakhs(price)}
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-silver-light uppercase tracking-wider">
            TO {team.name} ({team.shortName})
          </div>
        </div>

        {/* Thin Gold Bottom Rule */}
        <div className="w-24 h-[1px] bg-gold mx-auto" />

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="gold"
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
