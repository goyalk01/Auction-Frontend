"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhs } from "../../lib/formatting";
import { evaluateSquadCompliance } from "../../lib/bidding";

export function TeamsOverviewTable() {
  const { teamsList, auction } = useAuction();

  return (
    <div className="p-5 bg-charcoal border border-white/[0.08] rounded-md space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <span className="text-[10px] font-mono font-bold text-silver-light uppercase tracking-[0.2em]">
          FINANCIAL & ROSTER LEDGER {"//"} 15 FRANCHISES
        </span>
        <span className="text-xs font-mono text-silver-dark">
          TOTAL SPENT:{" "}
          <strong className="text-gold">
            {formatLakhs(teamsList.reduce((acc, t) => acc + t.spentPurse, 0))}
          </strong>
        </span>
      </div>

      <div className="border border-white/[0.07] rounded-sm overflow-hidden font-mono text-xs overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-deep border-b border-white/[0.07] text-[10px] text-silver-dark uppercase tracking-wider">
              <th className="py-2.5 px-3">FRANCHISE</th>
              <th className="py-2.5 px-3">PURSE REMAINING</th>
              <th className="py-2.5 px-3">SPENT</th>
              <th className="py-2.5 px-3 text-center">ROSTER</th>
              <th className="py-2.5 px-3 text-center">BAT</th>
              <th className="py-2.5 px-3 text-center">BOWL</th>
              <th className="py-2.5 px-3 text-center">AR</th>
              <th className="py-2.5 px-3 text-center">WK</th>
              <th className="py-2.5 px-3 text-right">COMPLIANCE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {teamsList.map((teamState) => {
              const { franchise, remainingPurse, spentPurse, squad, roleCounts } = teamState;
              const compliance = evaluateSquadCompliance(teamState);
              const isLeading = auction.leadingTeamId === franchise.id;

              return (
                <tr
                  key={franchise.id}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    isLeading ? "bg-gold-muted/20" : ""
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-xs flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ backgroundColor: franchise.primaryColor }}
                      >
                        {franchise.shortName}
                      </span>
                      <span className="font-bold text-silver-bright">{franchise.name}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 font-bold text-gold tabular-nums">
                    {formatLakhs(remainingPurse)}
                  </td>

                  <td className="py-2.5 px-3 text-silver tabular-nums">
                    {formatLakhs(spentPurse)}
                  </td>

                  <td className="py-2.5 px-3 text-center font-bold text-silver-bright">
                    {squad.length}/11
                  </td>

                  <td className="py-2.5 px-3 text-center text-silver">
                    {roleCounts.BATTER}
                  </td>
                  <td className="py-2.5 px-3 text-center text-silver">
                    {roleCounts.BOWLER}
                  </td>
                  <td className="py-2.5 px-3 text-center text-silver">
                    {roleCounts.ALL_ROUNDER}
                  </td>
                  <td className="py-2.5 px-3 text-center text-silver">
                    {roleCounts.WICKETKEEPER}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    {compliance.isCompliant ? (
                      <span className="text-info font-bold uppercase tracking-wider">
                        ✓ VALID
                      </span>
                    ) : (
                      <span className="text-caution font-bold uppercase tracking-wider">
                        ⚠ INCOMPLETE
                      </span>
                    )}
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
