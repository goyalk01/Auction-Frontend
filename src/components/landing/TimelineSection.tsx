"use client";

import React, { useState } from "react";
import { EVENT_TIMELINE, TimelinePhase } from "../../data/timeline";

export function TimelineSection() {
  const [selectedPhase, setSelectedPhase] = useState<TimelinePhase>(EVENT_TIMELINE[2]); // Round 1 default

  return (
    <section className="py-24 bg-void px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-gold uppercase">
            EVENT SCHEDULE
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-silver-bright uppercase tracking-tight">
            8 COMMITTEE WORKFLOW PHASES
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Phase Selector Rail (Left) */}
          <div className="lg:col-span-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {EVENT_TIMELINE.map((phase) => {
              const isSelected = selectedPhase.id === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase)}
                  className={`w-full text-left py-4 px-3 flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-charcoal text-silver-bright border-l-2 border-l-gold pl-4"
                      : "text-silver hover:text-silver-bright hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-silver-dark">
                      0{phase.phaseNumber}
                    </span>
                    <span className="text-sm font-display font-bold uppercase tracking-wide">
                      {phase.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest shrink-0">
                    {phase.duration}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Phase Dossier (Right) */}
          <div className="lg:col-span-6 bg-charcoal border border-white/[0.08] rounded-md p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">
                PHASE 0{selectedPhase.phaseNumber} {"//"} {selectedPhase.type}
              </span>
              <span className="text-xs font-mono text-silver">
                DURATION: {selectedPhase.duration}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-black text-silver-bright uppercase tracking-tight">
                {selectedPhase.title}
              </h3>
              <p className="text-xs text-silver font-sans leading-relaxed">
                {selectedPhase.description}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-silver-dark">
                KEY DELIVERABLES
              </h4>
              <ul className="space-y-2 font-mono text-xs text-silver-light">
                {selectedPhase.bulletPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-gold font-bold">›</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
