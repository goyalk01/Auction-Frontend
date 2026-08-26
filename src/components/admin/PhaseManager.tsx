"use client";

import React, { useState } from "react";
import { useAuction } from "../../lib/store/useAuction";
import { EVENT_TIMELINE } from "../../data/timeline";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export function PhaseManager() {
  const { auction, setPhase, resetTournament } = useAuction();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const currentPhase = auction.phase;

  const handleReset = () => {
    resetTournament();
    setResetModalOpen(false);
  };

  return (
    <>
      <div className="p-5 bg-charcoal border border-white/[0.08] rounded-md space-y-4 select-none">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
          <span className="text-[10px] font-mono font-bold text-silver-light uppercase tracking-[0.2em]">
            WORKFLOW {"//"} 8 COMMITTEE PHASES
          </span>

          <button
            onClick={() => setResetModalOpen(true)}
            className="px-2.5 py-1 bg-deep border border-danger/40 text-danger hover:border-danger text-[10px] font-mono font-bold tracking-wider uppercase rounded-sm"
          >
            RESET TOURNAMENT
          </button>
        </div>

        {/* Phase Stepper Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-xs">
          {EVENT_TIMELINE.map((item) => {
            const isActive = currentPhase === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPhase(item.id)}
                className={`p-2.5 rounded-sm border text-left flex flex-col justify-between min-h-[75px] transition-colors ${
                  isActive
                    ? "bg-deep border-gold text-gold font-bold"
                    : "bg-deep/60 border-graphite text-silver hover:border-silver-dark hover:text-silver-bright"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-silver-dark">0{item.phaseNumber}</span>
                  {isActive && <span className="text-[10px] text-gold">●</span>}
                </div>

                <div>
                  <span className="text-[11px] block leading-tight uppercase font-display">
                    {item.shortTitle}
                  </span>
                  <span className="text-[9px] text-silver-dark block mt-0.5">{item.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="CONFIRM TOURNAMENT RESET"
        subtitle="This action will restore all 15 franchises to ₹100 Cr and wipe all active rosters."
        maxWidth="sm"
      >
        <div className="space-y-4 font-mono text-xs text-silver">
          <p>
            WARNING: All logged bids, sold records, and squad allocations will be reset to initial
            state.
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setResetModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" onClick={handleReset}>
              EXECUTE RESET
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
