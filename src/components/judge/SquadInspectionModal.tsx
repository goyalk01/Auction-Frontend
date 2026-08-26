"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { TeamState } from "../../types/auction";
import { formatLakhs } from "../../lib/formatting";
import { RoleBadge } from "../ui/Badge";
import { PlayerAvatar } from "../ui/PlayerAvatar";
import { evaluateSquadCompliance } from "../../lib/bidding";
import { AUCTION_CONSTANTS } from "../../lib/constants";

interface SquadInspectionModalProps {
  teamState: TeamState | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SquadInspectionModal({ teamState, isOpen, onClose }: SquadInspectionModalProps) {
  if (!teamState) return null;

  const { franchise, remainingPurse, spentPurse, squad, roleCounts } = teamState;
  const compliance = evaluateSquadCompliance(teamState);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${franchise.name} // SQUAD DOSSIER`}
      subtitle="Judicial compliance and roster inspection"
      maxWidth="2xl"
    >
      <div className="space-y-5 font-mono text-xs select-none">
        {/* Balances Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-deep border border-graphite rounded-sm">
          <div>
            <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
              REMAINING PURSE
            </span>
            <span className="text-base font-bold text-gold tabular-nums block mt-0.5">
              {formatLakhs(remainingPurse)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
              TOTAL SPENT
            </span>
            <span className="text-base font-bold text-silver-light tabular-nums block mt-0.5">
              {formatLakhs(spentPurse)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
              ROSTER COUNT
            </span>
            <span className="text-base font-bold text-silver-bright block mt-0.5">
              {squad.length}/{AUCTION_CONSTANTS.MAX_SQUAD_SIZE}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
              COMPLIANCE
            </span>
            <span
              className={`text-xs font-bold block mt-0.5 uppercase ${
                compliance.isCompliant ? "text-info" : "text-caution"
              }`}
            >
              {compliance.isCompliant ? "✓ VALID" : "⚠ INCOMPLETE"}
            </span>
          </div>
        </div>

        {/* Role Breakdown */}
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

        {/* Squad Players Table */}
        <div className="border border-white/[0.07] rounded-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-deep border-b border-white/[0.07] text-[10px] text-silver-dark uppercase">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">PLAYER</th>
                <th className="py-2 px-3">ROLE</th>
                <th className="py-2 px-3 text-right">PURCHASE PRICE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {squad.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-silver-dark">
                    NO PLAYERS ACQUIRED
                  </td>
                </tr>
              ) : (
                squad.map((player, idx) => (
                  <tr key={player.id} className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 text-silver-dark">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold font-display uppercase text-silver-bright">
                      {player.name}
                    </td>
                    <td className="py-2 px-3">
                      <RoleBadge role={player.role} size="sm" />
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-gold tabular-nums">
                      {formatLakhs(player.soldPrice || player.basePrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
