"use client";

import React, { useState } from "react";
import { useAuction } from "../../lib/store/useAuction";
import { TeamState } from "../../types/auction";
import { formatLakhs } from "../../lib/formatting";
import { evaluateSquadCompliance } from "../../lib/bidding";
import { SquadInspectionModal } from "./SquadInspectionModal";

export function JudgeFranchiseGrid() {
  const { teamsList } = useAuction();
  const [selectedTeam, setSelectedTeam] = useState<TeamState | null>(null);

  return (
    <>
      <div className="p-5 bg-charcoal border border-white/[0.08] rounded-md space-y-4 select-none">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
          <span className="text-[10px] font-mono font-bold text-silver-light uppercase tracking-[0.2em]">
            JUDICIAL REVIEW MATRIX {"//"} 15 FRANCHISES
          </span>
          <span className="text-xs font-mono text-silver-dark">CLICK ROW TO INSPECT DOSSIER</span>
        </div>

        {/* Clean Monochrome Table Matrix */}
        <div className="border border-white/[0.07] rounded-sm overflow-hidden font-mono text-xs overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-deep border-b border-white/[0.07] text-[10px] text-silver-dark uppercase tracking-wider">
                <th className="py-2.5 px-3">FRANCHISE</th>
                <th className="py-2.5 px-3 text-center">PLAYERS</th>
                <th className="py-2.5 px-3">SPENT</th>
                <th className="py-2.5 px-3">REMAINING PURSE</th>
                <th className="py-2.5 px-3 text-center">BAT / BOWL / AR / WK</th>
                <th className="py-2.5 px-3 text-center">COMPLIANCE</th>
                <th className="py-2.5 px-3 text-right">DOSSIER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {teamsList.map((teamState) => {
                const { franchise, remainingPurse, spentPurse, squad, roleCounts } = teamState;
                const compliance = evaluateSquadCompliance(teamState);

                return (
                  <tr
                    key={franchise.id}
                    onClick={() => setSelectedTeam(teamState)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    {/* Franchise */}
                    <td className="py-3 px-3">
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

                    {/* Squad Count */}
                    <td className="py-3 px-3 text-center font-bold text-silver-light">
                      {squad.length}/11
                    </td>

                    {/* Spent */}
                    <td className="py-3 px-3 tabular-nums text-silver">
                      {formatLakhs(spentPurse)}
                    </td>

                    {/* Remaining Purse */}
                    <td className="py-3 px-3 tabular-nums font-bold text-gold">
                      {formatLakhs(remainingPurse)}
                    </td>

                    {/* Role Distribution */}
                    <td className="py-3 px-3 text-center text-silver text-[11px]">
                      {roleCounts.BATTER} / {roleCounts.BOWLER} / {roleCounts.ALL_ROUNDER} / {roleCounts.WICKETKEEPER}
                    </td>

                    {/* Compliance */}
                    <td className="py-3 px-3 text-center">
                      {compliance.isCompliant ? (
                        <span className="text-info font-bold">✓ VALID</span>
                      ) : (
                        <span className="text-caution font-bold">⚠ INCOMPLETE</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] text-silver-dark hover:text-gold uppercase tracking-wider font-bold">
                        INSPECT →
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SquadInspectionModal
        teamState={selectedTeam}
        isOpen={Boolean(selectedTeam)}
        onClose={() => setSelectedTeam(null)}
      />
    </>
  );
}
