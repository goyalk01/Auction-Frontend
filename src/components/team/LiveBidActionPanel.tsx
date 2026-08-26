"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { TeamState } from "../../types/auction";
import { formatLakhs } from "../../lib/formatting";
import { getNextBid, validateTeamBid } from "../../lib/bidding";
import { RoleBadge } from "../ui/Badge";
import { PlayerAvatar } from "../ui/PlayerAvatar";
import { AUCTION_CONSTANTS } from "../../lib/constants";

interface LiveBidActionPanelProps {
  teamState: TeamState;
}

export function LiveBidActionPanel({ teamState }: LiveBidActionPanelProps) {
  const { auction, currentPlayer, leadingTeam, placeBid } = useAuction();

  const currentBid = auction.currentBid;
  const basePrice = currentPlayer ? currentPlayer.basePrice : 0;
  const nextBidAmount = getNextBid(currentBid, basePrice);
  const isLeading = auction.leadingTeamId === teamState.franchise.id;

  const validation = validateTeamBid(teamState, nextBidAmount, isLeading, auction.status);

  // Timer status
  const timer = auction.timer;
  let timerColor = "text-silver-bright";
  if (timer <= 5 && timer > 0) {
    timerColor = "text-danger animate-pulse";
  } else if (timer <= 10 && timer > 0) {
    timerColor = "text-caution";
  }

  const handleBid = () => {
    if (validation.canBid) {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(40);
      }
      placeBid(teamState.franchise.id);
    }
  };

  if (!currentPlayer) {
    return (
      <div className="p-8 bg-charcoal border border-white/[0.08] rounded-md text-center text-silver-dark font-mono text-xs">
        NO PLAYER CURRENTLY ON THE BLOCK.
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 bg-charcoal border border-white/[0.08] rounded-md space-y-6 select-none">
      {/* Header Label */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-silver-light uppercase">
          LOT #{currentPlayer.id.replace("p-", "")} {"//"} ON THE BLOCK
        </span>
        <span className="text-[10px] font-mono text-silver-dark uppercase">
          BASE: {formatLakhs(currentPlayer.basePrice)}
        </span>
      </div>

      {/* Player Showcase */}
      <div className="flex items-center gap-4">
        <PlayerAvatar name={currentPlayer.name} role={currentPlayer.role} size="lg" />
        <div className="space-y-1 overflow-hidden">
          <RoleBadge role={currentPlayer.role} size="sm" />
          <h3 className="text-xl sm:text-2xl font-display font-black text-silver-bright uppercase truncate">
            {currentPlayer.name}
          </h3>
          <span className="text-[11px] font-mono text-silver-dark block">
            {currentPlayer.nationality === "Indian" ? "🇮🇳 DOMESTIC // IND" : "✈️ OVERSEAS // INT"}
          </span>
        </div>
      </div>

      {/* Live Financial Quote & Timer Strip */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-deep border border-graphite rounded-sm font-mono">
        <div>
          <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
            CURRENT BID
          </span>
          <span className="text-2xl sm:text-3xl font-display font-black text-gold tabular-nums block mt-0.5">
            {currentBid > 0 ? formatLakhs(currentBid) : "₹0 L"}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
            COUNTDOWN
          </span>
          <span className={`text-2xl sm:text-3xl font-mono font-black tabular-nums block mt-0.5 ${timerColor}`}>
            00:{String(Math.max(0, timer)).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Leading Bid Status */}
      {isLeading ? (
        <div className="p-3 bg-gold-muted border border-gold/40 rounded-sm text-center font-mono text-xs font-bold text-gold uppercase tracking-wider">
          ★ YOUR FRANCHISE HOLDS THE HIGHEST BID
        </div>
      ) : leadingTeam ? (
        <div className="p-2.5 bg-deep border border-graphite rounded-sm flex items-center justify-between font-mono text-xs">
          <span className="text-silver-dark">LEADER:</span>
          <span className="font-bold text-silver-bright">
            {leadingTeam.franchise.name} ({leadingTeam.franchise.shortName})
          </span>
        </div>
      ) : (
        <div className="p-2.5 bg-deep border border-graphite rounded-sm text-center font-mono text-xs text-silver-dark">
          READY FOR OPENING OFFER
        </div>
      )}

      {/* Premium Gold Border Bidding Button */}
      <div className="space-y-2">
        <button
          onClick={handleBid}
          disabled={!validation.canBid}
          className={`w-full py-4 sm:py-5 px-6 rounded-md font-mono font-black text-lg sm:text-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-100 select-none ${
            validation.canBid
              ? "bg-deep hover:bg-gold/15 text-gold border-2 border-gold cursor-pointer active:bg-gold/30 shadow-sm"
              : isLeading
              ? "bg-deep text-silver-dark border border-graphite cursor-not-allowed opacity-60"
              : "bg-deep text-silver-dark border border-graphite cursor-not-allowed opacity-40"
          }`}
        >
          <span>[ BID {formatLakhs(nextBidAmount)} ]</span>
        </button>

        {!validation.canBid && validation.reason && (
          <p className="text-center font-mono text-[11px] text-danger pt-1 uppercase tracking-wide">
            ⚠ {validation.reason}
          </p>
        )}
      </div>
    </div>
  );
}
