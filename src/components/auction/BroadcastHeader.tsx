"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Maximize, Minimize, Volume2, VolumeX, ArrowLeft } from "lucide-react";
import { useAuction } from "../../lib/store/useAuction";

export function BroadcastHeader() {
  const { auction, toggleSound, currentPlayer } = useAuction();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const statusColor =
    auction.status === "LIVE"
      ? "text-info"
      : auction.status === "SOLD"
      ? "text-gold"
      : auction.status === "UNSOLD"
      ? "text-danger"
      : "text-silver-dark";

  return (
    <header className="h-14 px-6 sm:px-8 bg-void hairline-b flex items-center justify-between shrink-0 select-none">
      {/* Left: Brand & Lot */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="p-1.5 rounded-sm border border-graphite text-silver-dark hover:text-silver-bright hover:border-silver transition-colors"
          title="Return to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-3">
          <span className="font-display font-black text-sm tracking-[0.2em] text-silver-bright uppercase">
            VITB—MUN
          </span>
          <span className="text-[11px] font-mono text-silver-dark uppercase tracking-widest hidden sm:inline">
            {"//"} LIVE AUCTION SYSTEM
          </span>
        </div>
      </div>

      {/* Center: Stage & Lot Metadata */}
      <div className="flex items-center gap-4 font-mono text-xs">
        <span className="text-silver uppercase tracking-widest">
          ROUND 0{auction.round}
        </span>
        <span className="text-silver-dark">/</span>
        <span className="text-silver-bright font-bold tracking-wider">
          LOT {currentPlayer ? currentPlayer.id.replace("p-", "") : "---"}
        </span>
      </div>

      {/* Right: Status & Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2.5 py-1 bg-deep border border-graphite rounded-sm">
          <span
            className={`w-2 h-2 rounded-full ${
              auction.status === "LIVE" ? "bg-info animate-pulse" : "bg-gold"
            }`}
          />
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${statusColor}`}>
            ● {auction.status}
          </span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 text-silver-dark hover:text-silver-bright transition-colors"
          title={auction.soundEnabled ? "Audio On" : "Audio Off"}
        >
          {auction.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-gold" />
          ) : (
            <VolumeX className="w-4 h-4 text-silver-dark" />
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 text-silver-dark hover:text-silver-bright transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
