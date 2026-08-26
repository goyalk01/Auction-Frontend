import React from "react";

export function EvaluationRubricCard() {
  const criteria = [
    {
      num: "01",
      title: "SQUAD BALANCE & ROLE MINIMUMS (30%)",
      description: "Batting depth, bowling variety (pace vs spin balance), and mandatory roster compliance (1+ WK, 3+ Bowlers, 7-11 total).",
    },
    {
      num: "02",
      title: "STRATEGIC CAPITAL EFFICIENCY (25%)",
      description: "Purse utilization prudence. Evaluation of whether marquee spending crippled bench strength or maintained optimal roster depth.",
    },
    {
      num: "03",
      title: "TACTICAL SYNERGY & MATCHUPS (25%)",
      description: "Powerplay stability, death-overs bowling capability, and real-world playing XI viability across T20 match situations.",
    },
    {
      num: "04",
      title: "ORAL DEFENSE SESSION (20%)",
      description: "Franchise captain's strategic defense, answers to EB questions, and auction rationale during Phase 6 (Squad Review).",
    },
  ];

  return (
    <div className="p-5 sm:p-6 bg-charcoal border border-white/[0.08] rounded-md space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <span className="text-[10px] font-mono font-bold text-silver-light uppercase tracking-[0.2em]">
          EXECUTIVE BOARD {"//"} EVALUATION RUBRICS
        </span>
        <span className="text-xs font-mono text-silver-dark">PHASE 06 MANDATE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {criteria.map((item) => (
          <div key={item.num} className="p-3.5 bg-deep border border-graphite rounded-sm space-y-1">
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
              RUBRIC {item.num} {"//"} {item.title}
            </span>
            <p className="text-silver text-[11px] leading-relaxed font-sans pt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
