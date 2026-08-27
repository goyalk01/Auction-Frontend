"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Maximize, Minimize, Volume2, VolumeX, ArrowLeft } from "lucide-react";
import { useAuction } from "../../lib/store/useAuction";
import { AuctionViewToggle } from "./AuctionViewToggle";

interface BroadcastHeaderProps {
  viewMode: "common" | "team";
  selectedTeamId: string | null;
  onSelectCommon: () => void;
  onSelectTeam: (teamId: string) => void;
}

export function BroadcastHeader({
  viewMode,
  selectedTeamId,
  onSelectCommon,
  onSelectTeam,
}: BroadcastHeaderProps) {
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
    <header className="h-14 px-4 sm:px-6 lg:px-8 bg-void hairline-b flex items-center justify-between shrink-0 select-none relative z-30">
      {/* Left: Brand & Home Link */}
      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          href="/"
          className="p-1.5 rounded-sm border border-graphite text-silver-dark hover:text-silver-bright hover:border-silver transition-colors"
          title="Return to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-2.5">
          <img
            src="/images/vitbmun-logo.png"
            alt="VITBMUN logo"
            className="h-7 w-auto object-contain shrink-0"
          />
          <span className="font-display font-black text-sm tracking-[0.18em] text-silver-bright uppercase">
            VITBMUN
          </span>
          <span className="text-[10px] font-mono text-gold uppercase tracking-widest hidden md:inline">
            {"//"} LIVE AUCTION
          </span>
        </div>
      </div>

      {/* Center: View Switcher (Common Board vs Franchise Dossier) */}
      <div className="flex items-center gap-3">
        <AuctionViewToggle
          viewMode={viewMode}
          selectedTeamId={selectedTeamId}
          onSelectCommon={onSelectCommon}
          onSelectTeam={onSelectTeam}
        />
      </div>

      {/* Right: Status & Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-deep border border-graphite rounded-sm font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              auction.status === "LIVE" ? "bg-info animate-pulse" : "bg-gold"
            }`}
          />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>
            ● {auction.status}
          </span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 text-silver-dark hover:text-silver-bright transition-colors"
          title={auction.soundEnabled ? "Audio On" : "Audio Off"}
          aria-label="Toggle Sound"
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
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
