"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhsShort } from "../../lib/formatting";
import { AUCTION_CONSTANTS } from "../../lib/constants";
import { Shield, ChevronRight } from "lucide-react";

interface AllTeamsPurseTableProps {
  onSelectTeam?: (teamId: string) => void;
}

export function AllTeamsPurseTable({ onSelectTeam }: AllTeamsPurseTableProps) {
  const { teamsList, auction } = useAuction();

  // Sort teams alphabetically or by remaining purse
  const sortedTeams = [...teamsList].sort((a, b) => b.remainingPurse - a.remainingPurse);

  return (
    <div className="p-4 sm:p-5 bg-charcoal border border-white/[0.08] rounded-md font-mono select-none space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-silver-light uppercase tracking-[0.2em]">
            PURSE OVERVIEW {"//"} 15 FRANCHISES LEDGER
          </span>
        </div>
        <span className="text-[10px] text-silver-dark uppercase tracking-wider">
          LIVE BALANCE (₹125 CR CAP)
        </span>
      </div>

      {/* Grid of 15 Teams for widescreen / compact table for small screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
        {sortedTeams.map((teamState) => {
          const { franchise, remainingPurse, spentPurse, squad } = teamState;
          const isLeading = auction.leadingTeamId === franchise.id;

          return (
            <button
              key={franchise.id}
              onClick={() => onSelectTeam && onSelectTeam(franchise.id)}
              className={`p-2.5 rounded-sm border text-left flex flex-col justify-between gap-2 transition-all ${
                isLeading
                  ? "bg-deep border-info/50 shadow-xs ring-1 ring-info/30"
                  : "bg-deep/70 border-graphite hover:border-silver-dark hover:bg-deep"
              } ${onSelectTeam ? "cursor-pointer group" : "cursor-default"}`}
              title={onSelectTeam ? `Click to view ${franchise.name} dossier` : undefined}
            >
              {/* Top Row: Team Code + Name + Leading Flag */}
              <div className="flex items-center justify-between gap-1 overflow-hidden w-full">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className="w-5 h-5 rounded-xs flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: franchise.primaryColor }}
                  >
                    {franchise.shortName.slice(0, 3)}
                  </span>
                  <span className="text-xs font-display font-bold text-silver-bright truncate group-hover:text-gold transition-colors">
                    {franchise.name}
                  </span>
                </div>

                {isLeading && (
                  <span className="text-[8px] font-bold text-info border border-info/40 bg-info-muted/30 px-1 py-0.2 rounded-xs shrink-0">
                    BIDDING
                  </span>
                )}
              </div>

              {/* Bottom Row: Remaining Purse + Squad Slots */}
              <div className="flex items-end justify-between border-t border-white/[0.04] pt-1.5 w-full">
                <div>
                  <span className="text-[9px] text-silver-dark uppercase block leading-none">
                    PURSE
                  </span>
                  <span className="text-sm font-display font-black text-gold tabular-nums mt-0.5 block">
                    {formatLakhsShort(remainingPurse)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-silver-dark uppercase block leading-none">
                    SQUAD
                  </span>
                  <span className="text-xs font-bold text-silver-light mt-0.5 block">
                    {squad.length}/{AUCTION_CONSTANTS.MAX_SQUAD_SIZE}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
