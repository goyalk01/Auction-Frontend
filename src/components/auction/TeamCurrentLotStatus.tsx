"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { TeamState } from "../../types/auction";
import { formatLakhs } from "../../lib/formatting";
import { getNextBid, validateTeamBid } from "../../lib/bidding";
import { RoleBadge } from "../ui/Badge";
import { PlayerAvatar } from "../ui/PlayerAvatar";
import { ShieldAlert, ShieldCheck, Clock } from "lucide-react";

interface TeamCurrentLotStatusProps {
  teamState: TeamState;
}

export function TeamCurrentLotStatus({ teamState }: TeamCurrentLotStatusProps) {
  const { auction, currentPlayer, leadingTeam } = useAuction();

  if (!currentPlayer) {
    return (
      <div className="p-5 bg-charcoal border border-white/[0.08] rounded-md text-center font-mono select-none space-y-1">
        <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
          CURRENT LOT STATUS
        </span>
        <p className="text-xs text-silver-dark pt-1">
          NO PLAYER CURRENTLY ON THE AUCTION BLOCK
        </p>
      </div>
    );
  }

  const currentBid = auction.currentBid;
  const basePrice = currentPlayer.basePrice;
  const nextBidAmount = getNextBid(currentBid, basePrice);
  const isLeading = auction.leadingTeamId === teamState.franchise.id;
  const validation = validateTeamBid(teamState, nextBidAmount, isLeading, auction.status);

  const timer = auction.timer;
  let timerColor = "text-silver-bright";
  if (timer <= 5 && timer > 0) {
    timerColor = "text-danger animate-pulse";
  } else if (timer <= 10 && timer > 0) {
    timerColor = "text-caution";
  }

  return (
    <div className="p-5 sm:p-6 bg-charcoal border border-white/[0.08] rounded-md font-mono select-none space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <span className="text-[10px] font-bold text-silver-light uppercase tracking-[0.2em]">
          ACTIVE LOT {"//"} #{currentPlayer.id.replace("p-", "")}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-silver-dark uppercase">
            BASE: {formatLakhs(currentPlayer.basePrice)}
          </span>
          <span className="text-[10px] text-silver-dark">•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-silver-dark" />
            <span className={`text-xs font-bold tabular-nums ${timerColor}`}>
              {timer}s
            </span>
          </div>
        </div>
      </div>

      {/* Player Showcase */}
      <div className="flex items-center gap-4">
        <PlayerAvatar name={currentPlayer.name} role={currentPlayer.role} size="md" />
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <RoleBadge role={currentPlayer.role} size="sm" />
            <span className="text-[10px] text-silver-dark uppercase">
              {currentPlayer.nationality === "Indian" ? "🇮🇳 DOMESTIC" : "✈️ OVERSEAS"}
            </span>
          </div>
          <h3 className="text-xl font-display font-black text-silver-bright uppercase truncate">
            {currentPlayer.name}
          </h3>
        </div>
      </div>

      {/* Pricing Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-deep border border-graphite rounded-sm">
        <div>
          <span className="text-[9px] text-silver-dark uppercase tracking-widest block">
            CURRENT BID
          </span>
          <span className="text-lg sm:text-xl font-display font-black text-gold tabular-nums block mt-0.5">
            {currentBid > 0 ? formatLakhs(currentBid) : "OPENING"}
          </span>
        </div>

        <div>
          <span className="text-[9px] text-silver-dark uppercase tracking-widest block">
            LEADER
          </span>
          <span className="text-sm font-bold text-silver-bright block mt-0.5 truncate">
            {leadingTeam ? leadingTeam.franchise.shortName : "NONE"}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-2 sm:pt-0 sm:pl-3">
          <span className="text-[9px] text-silver-dark uppercase tracking-widest block">
            NEXT VALID BID
          </span>
          <span className="text-sm font-bold text-silver-light block mt-0.5">
            {formatLakhs(nextBidAmount)}
          </span>
        </div>
      </div>

      {/* Selected Team's Tactical Status Box */}
      <div className="pt-1">
        {isLeading ? (
          <div className="p-3 bg-gold-muted border border-gold/40 rounded-sm flex items-center gap-2.5 text-gold text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{teamState.franchise.name} CURRENTLY HOLDS THE HIGHEST BID</span>
          </div>
        ) : validation.canBid ? (
          <div className="p-3 bg-info-muted/30 border border-info/40 rounded-sm flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-info font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>ELIGIBLE TO BID ({formatLakhs(nextBidAmount)})</span>
            </div>
            <span className="text-[10px] text-silver-dark uppercase">
              PURSE SUFFICIENT
            </span>
          </div>
        ) : (
          <div className="p-3 bg-danger-muted/30 border border-danger/40 rounded-sm flex items-center gap-2 text-xs text-danger uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>CANNOT BID — {validation.reason}</span>
          </div>
        )}
      </div>
    </div>
  );
}
