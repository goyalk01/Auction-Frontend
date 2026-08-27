"use client";

import React, { useState } from "react";

export function HowItWorksSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

  const steps = [
    {
      num: "01",
      title: "GET YOUR FRANCHISE (₹125 CR PURSE)",
    },
    {
      num: "02",
      title: "PLAN YOUR STRATEGY",
    },
    {
      num: "03",
      title: "BID LIVE ON THE BLOCK",
    },
    {
      num: "04",
      title: "BUILD COMPLIANT SQUAD",
    },
    {
      num: "05",
      title: "FACE THE JUDGES",
    },
  ];

  return (
    <section className="py-20 bg-deep hairline-t hairline-b px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
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
                className={`py-5 sm:py-6 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isHovered ? "bg-white/[0.02]" : ""
                }`}
              >
                {/* Step Num & Title */}
                <div className="flex items-center gap-6">
                  <span
                    className={`font-mono text-xl sm:text-2xl font-bold tracking-wider ${
                      isHovered ? "text-gold" : "text-silver-dark"
                    }`}
                  >
                    {step.num}
                  </span>

                  <h3
                    className={`text-base sm:text-xl font-display font-black uppercase tracking-tight transition-colors ${
                      isHovered ? "text-silver-bright" : "text-silver"
                    }`}
                  >
                    {step.title}
                  </h3>
                </div>

                <div className="hidden sm:block font-mono text-[10px] text-silver-dark tracking-widest uppercase">
                  PHASE {step.num}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
