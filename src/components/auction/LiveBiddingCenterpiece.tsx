"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhs } from "../../lib/formatting";
import { getNextBid, getBidIncrement } from "../../lib/bidding";

export function LiveBiddingCenterpiece() {
  const { auction, currentPlayer, leadingTeam } = useAuction();

  const currentBid = auction.currentBid;
  const basePrice = currentPlayer ? currentPlayer.basePrice : 0;
  const nextBid = getNextBid(currentBid, basePrice);
  const currentIncrement = currentBid > 0 ? getBidIncrement(currentBid) : 0;

  // Timer Color State
  const timer = auction.timer;
  let timerTextColor = "text-silver-bright";
  let timerBorderColor = "border-graphite";

  if (timer <= 5 && timer > 0) {
    timerTextColor = "text-danger animate-pulse";
    timerBorderColor = "border-danger";
  } else if (timer <= 10 && timer > 0) {
    timerTextColor = "text-caution";
    timerBorderColor = "border-caution";
  } else if (auction.status === "LIVE") {
    timerTextColor = "text-info";
    timerBorderColor = "border-info/40";
  }

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-8 bg-charcoal border border-white/[0.08] rounded-md select-none space-y-6">
      {/* Top Header Rail: Next Increment & Countdown Clock */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-silver-dark uppercase tracking-widest block">
            NEXT MINIMUM BID
          </span>
          <span className="text-xs font-mono font-bold text-silver-bright mt-0.5 block">
            {nextBid > 0 ? `${formatLakhs(nextBid)} (+${formatLakhs(currentIncrement || 10)})` : "OPEN AT BASE"}
          </span>
        </div>

        {/* Minimal Financial Countdown Clock */}
        <div className="text-right">
          <span className="text-[10px] font-mono font-bold text-silver-dark uppercase tracking-widest block">
            LOT TIMER
          </span>
          <span className={`text-2xl font-mono font-black tabular-nums ${timerTextColor}`}>
            00:{String(Math.max(0, timer)).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Main Focus: Gold Current Highest Bid */}
      <div className="py-8 text-center space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-silver-dark block">
          CURRENT HIGHEST BID
        </span>

        <div className="text-6xl sm:text-7xl lg:text-8xl font-display font-black text-gold tracking-tight tabular-nums">
          {currentBid > 0 ? formatLakhs(currentBid) : formatLakhs(basePrice)}
        </div>

        {currentBid === 0 && (
          <span className="inline-block text-[11px] font-mono text-silver-dark uppercase tracking-widest">
            Awaiting opening bid at base price
          </span>
        )}
      </div>

      {/* Leading Franchise Bar */}
      <div className="border-t border-white/[0.07] pt-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-silver-dark block mb-2">
          HOLDING FRANCHISE
        </span>

        {leadingTeam ? (
          <div className="p-3.5 rounded-sm bg-deep border border-graphite flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-sm flex items-center justify-center font-mono font-bold text-xs text-white"
                style={{ backgroundColor: leadingTeam.franchise.primaryColor }}
              >
                {leadingTeam.franchise.shortName}
              </span>
              <div>
                <h4 className="text-sm font-display font-bold text-silver-bright uppercase tracking-wide">
                  {leadingTeam.franchise.name}
                </h4>
                <span className="text-[11px] font-mono text-silver-dark">
                  Purse Available: {formatLakhs(leadingTeam.remainingPurse)}
                </span>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-silver">
              {leadingTeam.squad.length}/11
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-sm bg-deep border border-graphite text-center text-xs font-mono text-silver-dark">
            NO ACTIVE BIDS ON THE FLOOR
          </div>
        )}
      </div>
    </div>
  );
}
