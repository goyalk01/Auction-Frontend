"use client";

import React, { useState } from "react";

export function HowItWorksSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

  const steps = [
    {
      num: "01",
      title: "GET YOUR FRANCHISE",
      subtitle: "IDENTITY & ALLOCATION",
      description:
        "Draw your official franchise from 15 competing entities and receive your starting ₹100 Crore purse.",
    },
    {
      num: "02",
      title: "PLAN YOUR STRATEGY",
      subtitle: "ROLE & PURSE MAPPING",
      description:
        "Map out priority targets across Batters, Bowlers, All-Rounders, and WKs within budget allocation brackets.",
    },
    {
      num: "03",
      title: "BID LIVE ON THE BLOCK",
      subtitle: "20S CLOCKS & INCREMENTS",
      description:
        "Participate in real-time bidding rounds. Each incoming bid resets the clock to 10 seconds under tiered increments.",
    },
    {
      num: "04",
      title: "BUILD COMPLIANT SQUAD",
      subtitle: "ROSTER MINIMUMS",
      description:
        "Assemble 7 to 11 players satisfying mandatory requirements (at least 1 Wicketkeeper and 3 Bowlers).",
    },
    {
      num: "05",
      title: "FACE THE JUDGES",
      subtitle: "EXECUTIVE EVALUATION",
      description:
        "Defend your squad's balance, depth, and tactical viability before the Executive Board in Phase 6.",
    },
  ];

  return (
    <section className="py-24 bg-deep hairline-t hairline-b px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-gold uppercase">
            OPERATING TIMELINE
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-silver-bright uppercase tracking-tight">
            5 STEPS FROM DRAFT TO VICTORY
          </h2>
        </div>

        {/* Minimal Numbered Editorial Timeline */}
        <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {steps.map((step, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={step.num}
                onMouseEnter={() => setHoveredIdx(idx)}
                className={`py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isHovered ? "bg-white/[0.02]" : ""
                }`}
              >
                {/* Step Num & Title */}
                <div className="flex items-start sm:items-center gap-6">
                  <span
                    className={`font-mono text-xl sm:text-2xl font-bold tracking-wider ${
                      isHovered ? "text-gold" : "text-silver-dark"
                    }`}
                  >
                    {step.num}
                  </span>

                  <div>
                    <h3
                      className={`text-lg sm:text-2xl font-display font-black uppercase tracking-tight ${
                        isHovered ? "text-silver-bright" : "text-silver"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block mt-0.5">
                      {step.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="md:max-w-md text-xs text-silver font-sans leading-relaxed md:text-right">
                  {step.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
