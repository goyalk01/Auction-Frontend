import React from "react";
import { TeamState } from "../../types/auction";
import { formatLakhs } from "../../lib/formatting";
import { RoleBadge } from "../ui/Badge";
import { AUCTION_CONSTANTS } from "../../lib/constants";

interface SquadTrackerProps {
  teamState: TeamState;
}

export function SquadTracker({ teamState }: SquadTrackerProps) {
  const { squad, roleCounts } = teamState;

  return (
    <div className="p-5 sm:p-6 bg-charcoal border border-white/[0.08] rounded-md space-y-5 select-none font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-silver-light">
          ROSTER {"//"} ACQUIRED SQUAD
        </span>
        <span className="text-xs text-silver-dark">
          {squad.length} / {AUCTION_CONSTANTS.MAX_SQUAD_SIZE} SLOTS
        </span>
      </div>

      {/* Role Counts Mini Strip */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded-sm bg-deep border border-graphite">
          <span className="text-[9px] text-silver-dark uppercase block">BAT</span>
          <span className="text-sm font-bold text-silver-bright">{roleCounts.BATTER}</span>
        </div>
        <div className="p-2 rounded-sm bg-deep border border-graphite">
          <span className="text-[9px] text-silver-dark uppercase block">BOWL</span>
          <span className="text-sm font-bold text-silver-bright">{roleCounts.BOWLER}</span>
        </div>
        <div className="p-2 rounded-sm bg-deep border border-graphite">
          <span className="text-[9px] text-silver-dark uppercase block">AR</span>
          <span className="text-sm font-bold text-silver-bright">{roleCounts.ALL_ROUNDER}</span>
        </div>
        <div className="p-2 rounded-sm bg-deep border border-graphite">
          <span className="text-[9px] text-silver-dark uppercase block">WK</span>
          <span className="text-sm font-bold text-silver-bright">{roleCounts.WICKETKEEPER}</span>
        </div>
      </div>

      {/* Clean Financial Roster Table */}
      <div className="border border-white/[0.07] rounded-sm overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[320px]">
          <thead>
            <tr className="bg-deep border-b border-white/[0.07] text-[10px] text-silver-dark uppercase">
              <th className="py-2.5 px-3">PLAYER</th>
              <th className="py-2.5 px-3">ROLE</th>
              <th className="py-2.5 px-3 text-right">PURCHASE PRICE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {squad.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-silver-dark text-xs">
                  NO PLAYERS SIGNED YET
                </td>
              </tr>
            ) : (
              squad.map((player) => (
                <tr key={player.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="text-silver-bright font-bold font-display text-sm uppercase">
                      {player.name}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <RoleBadge role={player.role} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-gold tabular-nums">
                    {formatLakhs(player.soldPrice || player.basePrice)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
