"use client";

import React, { useState } from "react";
import { Franchise, TeamState } from "../../types/auction";
import { formatLakhs } from "../../lib/formatting";
import { FranchiseSelectorModal } from "./FranchiseSelectorModal";
import { ChevronDown } from "lucide-react";
import { AUCTION_CONSTANTS } from "../../lib/constants";

interface CaptainHeaderProps {
  teamState: TeamState;
  onSelectTeam: (teamId: string) => void;
}

export function CaptainHeader({ teamState, onSelectTeam }: CaptainHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { franchise, remainingPurse, spentPurse, squad, roleCounts } = teamState;

  const hasWK = roleCounts.WICKETKEEPER >= AUCTION_CONSTANTS.MIN_WICKETKEEPERS;
  const hasBowlers = roleCounts.BOWLER >= AUCTION_CONSTANTS.MIN_BOWLERS;

  return (
    <>
      <div className="p-4 sm:p-5 bg-charcoal border border-white/[0.08] rounded-md space-y-4 select-none">
        {/* Top Franchise Header & Switcher */}
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-3 text-left group"
          >
            <span
              className="w-8 h-8 rounded-xs flex items-center justify-center font-mono font-bold text-xs text-white"
              style={{ backgroundColor: franchise.primaryColor }}
            >
              {franchise.shortName}
            </span>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-display font-bold text-silver-bright group-hover:text-gold uppercase tracking-wide">
                  {franchise.name}
                </h2>
                <ChevronDown className="w-3.5 h-3.5 text-silver-dark group-hover:text-gold" />
              </div>
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-wider block">
                CAPTAIN TERMINAL {"//"} SWITCH
              </span>
            </div>
          </button>

          <div className="text-right font-mono">
            <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
              ROSTER
            </span>
            <span className="text-sm font-bold text-silver-bright">
              {squad.length}/{AUCTION_CONSTANTS.MAX_SQUAD_SIZE}
            </span>
          </div>
        </div>

        {/* Financial Balances */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-deep border border-graphite rounded-sm font-mono">
          <div>
            <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
              AVAILABLE PURSE
            </span>
            <span className="text-xl font-display font-black text-gold tabular-nums block mt-0.5">
              {formatLakhs(remainingPurse)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
              SPENT
            </span>
            <span className="text-xl font-display font-black text-silver-light tabular-nums block mt-0.5">
              {formatLakhs(spentPurse)}
            </span>
          </div>
        </div>

        {/* Rule Status Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
          <span
            className={`px-2 py-0.5 border rounded-xs uppercase tracking-wider ${
              hasWK
                ? "bg-deep text-silver-bright border-graphite"
                : "bg-caution-muted text-caution border-caution/40"
            }`}
          >
            WK: {roleCounts.WICKETKEEPER} (MIN 1)
          </span>

          <span
            className={`px-2 py-0.5 border rounded-xs uppercase tracking-wider ${
              hasBowlers
                ? "bg-deep text-silver-bright border-graphite"
                : "bg-caution-muted text-caution border-caution/40"
            }`}
          >
            BOWL: {roleCounts.BOWLER} (MIN 3)
          </span>

          <span className="px-2 py-0.5 bg-deep text-silver-dark border border-graphite rounded-xs uppercase tracking-wider">
            SLOTS LEFT: {AUCTION_CONSTANTS.MAX_SQUAD_SIZE - squad.length}
          </span>
        </div>
      </div>

      <FranchiseSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedTeamId={franchise.id}
        onSelectTeam={onSelectTeam}
      />
    </>
  );
}
