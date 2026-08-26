"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhsShort } from "../../lib/formatting";

export function FranchisePurseStrip() {
  const { teamsList, auction } = useAuction();

  return (
    <div className="h-12 bg-deep hairline-t px-4 sm:px-6 flex items-center shrink-0 overflow-x-auto custom-scrollbar font-mono text-xs select-none">
      <div className="shrink-0 pr-4 text-[10px] font-bold text-silver-dark uppercase tracking-widest border-r border-white/[0.08] mr-3">
        PURSES {"//"}
      </div>

      <div className="flex items-center gap-4">
        {teamsList.map((teamState) => {
          const { franchise, remainingPurse, squad } = teamState;
          const isLeading = auction.leadingTeamId === franchise.id;

          return (
            <div
              key={franchise.id}
              className={`shrink-0 flex items-center gap-2 px-2.5 py-1 rounded-sm border transition-colors ${
                isLeading
                  ? "bg-charcoal border-gold text-gold"
                  : "bg-void border-graphite text-silver"
              }`}
            >
              <span
                className="w-2 h-2 rounded-xs shrink-0"
                style={{ backgroundColor: franchise.primaryColor }}
              />
              <span className="font-bold text-silver-bright">{franchise.shortName}</span>
              <span className="tabular-nums font-bold text-gold">
                {formatLakhsShort(remainingPurse)}
              </span>
              <span className="text-silver-dark text-[10px]">
                ({squad.length})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
