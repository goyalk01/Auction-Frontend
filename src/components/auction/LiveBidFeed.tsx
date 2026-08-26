"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhs, formatTimestamp } from "../../lib/formatting";

export function LiveBidFeed() {
  const { auction } = useAuction();
  const bids = auction.recentBids;

  return (
    <div className="h-full flex flex-col p-5 bg-charcoal border border-white/[0.08] rounded-md select-none">
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-light">
          ORDER LOG {"//"} BIDS
        </span>
        <span className="text-[10px] font-mono text-silver-dark">
          {bids.length} LOGGED
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1 font-mono text-xs">
        {bids.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-silver-dark text-[11px]">
            AWAITING BIDS...
          </div>
        ) : (
          bids.map((bid, index) => {
            const isLatest = index === 0;
            return (
              <div
                key={bid.id}
                className={`p-2.5 rounded-sm border flex items-center justify-between transition-colors ${
                  isLatest
                    ? "bg-deep border-gold/40 text-silver-bright"
                    : "bg-deep/60 border-graphite text-silver"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-xs flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: bid.teamColor }}
                  >
                    {bid.teamShortName}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold block leading-tight">
                      {bid.teamShortName}
                    </span>
                    <span className="text-[9px] text-silver-dark">
                      {formatTimestamp(bid.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-bold tabular-nums ${
                      isLatest ? "text-gold" : "text-silver-light"
                    }`}
                  >
                    {formatLakhs(bid.amount)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
