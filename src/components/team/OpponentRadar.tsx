"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhsShort } from "../../lib/formatting";

interface OpponentRadarProps {
  currentTeamId: string;
}

export function OpponentRadar({ currentTeamId }: OpponentRadarProps) {
  const { teamsList, auction } = useAuction();
  const sortedTeams = [...teamsList].sort((a, b) => b.remainingPurse - a.remainingPurse);

  return (
    <div className="p-5 sm:p-6 bg-charcoal border border-white/[0.08] rounded-md space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-light">
          RADAR {"//"} 15 FRANCHISE PURSE BOOK
        </span>
        <span className="text-xs font-mono text-silver-dark">SORTED BY BALANCE</span>
      </div>

      <div className="border border-white/[0.07] rounded-sm overflow-hidden font-mono text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-deep border-b border-white/[0.07] text-[10px] text-silver-dark uppercase">
              <th className="py-2.5 px-3">TEAM</th>
              <th className="py-2.5 px-3">SLOTS</th>
              <th className="py-2.5 px-3 text-right">AVAILABLE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {sortedTeams.map((teamState) => {
              const { franchise, remainingPurse, squad } = teamState;
              const isCurrent = franchise.id === currentTeamId;
              const isLeading = auction.leadingTeamId === franchise.id;

              return (
                <tr
                  key={franchise.id}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    isCurrent ? "bg-gold-muted/30 text-gold" : ""
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-xs"
                        style={{ backgroundColor: franchise.primaryColor }}
                      />
                      <span className="font-bold text-silver-bright">{franchise.name}</span>
                      {isCurrent && (
                        <span className="text-[9px] font-bold text-gold px-1 border border-gold/40 rounded-xs">
                          YOU
                        </span>
                      )}
                      {isLeading && (
                        <span className="text-[9px] font-bold text-info px-1 border border-info/40 rounded-xs">
                          LEADER
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-silver">
                    {squad.length}/11
                  </td>

                  <td className="py-2.5 px-3 text-right font-bold text-gold tabular-nums">
                    {formatLakhsShort(remainingPurse)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
