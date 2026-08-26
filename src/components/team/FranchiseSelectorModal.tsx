"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhsShort } from "../../lib/formatting";
import { Check } from "lucide-react";

interface FranchiseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeamId: string;
  onSelectTeam: (teamId: string) => void;
}

export function FranchiseSelectorModal({
  isOpen,
  onClose,
  selectedTeamId,
  onSelectTeam,
}: FranchiseSelectorModalProps) {
  const { teamsList } = useAuction();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SELECT FRANCHISE IDENTITY"
      subtitle="Switch active captain terminal to your allocated team"
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono">
        {teamsList.map((teamState) => {
          const { franchise, remainingPurse, squad } = teamState;
          const isSelected = selectedTeamId === franchise.id;

          return (
            <button
              key={franchise.id}
              onClick={() => {
                onSelectTeam(franchise.id);
                onClose();
              }}
              className={`p-3 rounded-sm border text-left flex items-center justify-between transition-colors ${
                isSelected
                  ? "bg-deep border-gold text-gold"
                  : "bg-deep/60 border-graphite text-silver hover:border-silver-dark hover:text-silver-bright"
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span
                  className="w-6 h-6 rounded-xs flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: franchise.primaryColor }}
                >
                  {franchise.shortName}
                </span>

                <div className="overflow-hidden">
                  <span className="text-xs font-bold font-display uppercase tracking-wide block truncate">
                    {franchise.name}
                  </span>
                  <div className="text-[10px] text-silver-dark flex items-center gap-1.5 mt-0.5">
                    <span className="text-gold font-bold">{formatLakhsShort(remainingPurse)}</span>
                    <span>• {squad.length}/11</span>
                  </div>
                </div>
              </div>

              {isSelected && <Check className="w-4 h-4 text-gold shrink-0 ml-2" />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
