import React from "react";

export function AboutSection() {
  const pillars = [
    {
      num: "01",
      title: "TACTICAL SQUAD COMPOSITION",
      description:
        "Every franchise must assemble 7 to 11 players including at least 1 Wicketkeeper and 3 Bowlers. High spenders without squad balance face immediate judicial penalty.",
    },
    {
      num: "02",
      title: "CAPITAL VALUATION & PURSE DISCIPLINE",
      description:
        "Starting with ₹100 Crore, bidding on marquee players must be weighed against bench depth. Incremental bid tiers ensure realistic high-pressure bidding dynamics.",
    },
    {
      num: "03",
      title: "REAL-TIME MARKET CONCURRENCY",
      description:
        "Lots open with a 20-second countdown; each valid bid resets the timer to 10 seconds. Communication, timing, and split-second decisions dictate winning franchises.",
    },
    {
      num: "04",
      title: "EXECUTIVE JUDICIAL EVALUATION",
      description:
        "Squads are evaluated by the Executive Board across batting stability, bowling variety, and purse efficiency rather than automated score sums.",
    },
  ];

  return (
    <section className="py-24 bg-void px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Asymmetric Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end hairline-b pb-10">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-gold uppercase">
              ABOUT THE SIMULATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-silver-bright uppercase tracking-tight">
              CRICKET STRATEGY MEETS <br />
              <span className="text-silver">FINANCIAL MARKET PRESSURE</span>
            </h2>
          </div>

          <div className="lg:col-span-4 text-xs text-silver-dark font-sans leading-relaxed">
            Organized by the VIT Bhopal Model United Nations Club. Designed to test real-world
            negotiation, portfolio management, and strategic team construction under strict constraints.
          </div>
        </div>

        {/* 4 Pillars in Editorial Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {pillars.map((pillar) => (
            <div key={pillar.num} className="space-y-2 border-l border-white/[0.08] pl-5">
              <span className="text-[10px] font-mono font-bold text-silver-dark uppercase tracking-widest">
                STAGE {"//"} {pillar.num}
              </span>
              <h3 className="text-base font-display font-bold text-silver-bright tracking-wide uppercase">
                {pillar.title}
              </h3>
              <p className="text-xs text-silver leading-relaxed font-sans">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
