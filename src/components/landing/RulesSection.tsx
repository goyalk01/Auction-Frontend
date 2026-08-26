"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { AUCTION_CONSTANTS } from "../../lib/constants";

export function RulesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sections = [
    {
      num: "01",
      title: "VIRTUAL PURSE & BIDDING INCREMENTS",
      summary: "₹100 Crore starting purse with tiered dynamic increments.",
      details: [
        "Starting Purse: Exactly ₹100 Crore (10,000 Lakhs) per franchise.",
        "Tier 1 (< ₹1.00 Cr): Increments advance by ₹10 Lakhs.",
        "Tier 2 (₹1.00 Cr – ₹5.00 Cr): Increments advance by ₹20 Lakhs.",
        "Tier 3 (> ₹5.00 Cr): Increments advance by ₹50 Lakhs.",
        "Strict integer units in Lakhs prevent floating-point calculation errors.",
      ],
    },
    {
      num: "02",
      title: "SQUAD ROSTER & MANDATORY COMPOSITION",
      summary: `Mandatory squad bounds of ${AUCTION_CONSTANTS.MIN_SQUAD_SIZE} to ${AUCTION_CONSTANTS.MAX_SQUAD_SIZE} players.`,
      details: [
        `Squad bounds: Minimum ${AUCTION_CONSTANTS.MIN_SQUAD_SIZE} players, Maximum ${AUCTION_CONSTANTS.MAX_SQUAD_SIZE} players.`,
        `Mandatory inclusion of at least ${AUCTION_CONSTANTS.MIN_WICKETKEEPERS} Wicketkeeper.`,
        `Mandatory inclusion of at least ${AUCTION_CONSTANTS.MIN_BOWLERS} Bowlers.`,
        "Roles categorized as: BATTER, BOWLER, ALL_ROUNDER, WICKETKEEPER.",
      ],
    },
    {
      num: "03",
      title: "AUCTION CLOCK & UNSOLD PLAYER ROUNDS",
      summary: "20-second countdowns with 10-second resets on every bid.",
      details: [
        `Opening timer: ${AUCTION_CONSTANTS.INITIAL_TIMER_SECONDS} seconds per lot.`,
        `Clock extension: Every valid bid resets the timer to ${AUCTION_CONSTANTS.BID_RESET_TIMER_SECONDS} seconds.`,
        "Unsold players in Round 1 return for accelerated bidding in Round 2.",
        "Deterministic single source of truth prevents double-bid concurrency conflicts.",
      ],
    },
    {
      num: "04",
      title: "EXECUTIVE JUDICIAL EVALUATION RUBRIC",
      summary: "Holistic evaluation based on balance, depth, and budget efficiency.",
      details: [
        "Squad Balance & Role Fulfillment: 30% weighting.",
        "Strategic Financial Management (Value for money): 25% weighting.",
        "Tactical Synergy & Real-world Matchup Viability: 25% weighting.",
        "Oral Defense Session during Phase 6 (Squad Review): 20% weighting.",
      ],
    },
  ];

  return (
    <section className="py-24 bg-void px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-gold uppercase">
            REGULATIONS MANUAL
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-silver-bright uppercase tracking-tight">
            TOURNAMENT RULES & SPECIFICATIONS
          </h2>
        </div>

        {/* Editorial Accordion */}
        <div className="border-t border-b border-white/[0.08] divide-y divide-white/[0.07]">
          {sections.map((section, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={section.num} className="py-4">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 py-2 group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-mono font-bold text-silver-dark group-hover:text-gold transition-colors">
                      {section.num}
                    </span>
                    <span className="text-sm sm:text-base font-display font-bold text-silver-bright group-hover:text-gold uppercase tracking-wide transition-colors">
                      {section.title}
                    </span>
                  </div>

                  <div className="p-1 rounded text-silver-dark group-hover:text-silver-bright">
                    {isOpen ? <Minus className="w-4 h-4 text-gold" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-4 pb-2 pl-12 pr-4 space-y-2.5">
                    <p className="text-xs text-silver font-sans leading-relaxed">{section.summary}</p>
                    <ul className="space-y-1.5 font-mono text-xs text-silver-light pt-2">
                      {section.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <span className="text-gold">›</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
