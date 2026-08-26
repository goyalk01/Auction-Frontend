import React from "react";

export function StatsSection() {
  const stats = [
    {
      num: "01",
      label: "FRANCHISES",
      value: "15",
      detail: "10 REAL IPL + 5 REGIONAL",
    },
    {
      num: "02",
      label: "VIRTUAL PURSE",
      value: "₹100 CR",
      detail: "INTEGER LAKHS ENGINE",
    },
    {
      num: "03",
      label: "PLAYER POOL",
      value: "120+",
      detail: "4 SPECIALIST ROLES",
    },
    {
      num: "04",
      label: "AUCTION STAGES",
      value: "02",
      detail: "MAIN LOT + UNSOLD RECALL",
    },
  ];

  return (
    <section className="hairline-t hairline-b bg-deep py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`space-y-1.5 ${
              idx < stats.length - 1 ? "lg:border-r lg:border-white/[0.07] lg:pr-8" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-silver-dark tracking-widest uppercase">
                {stat.num} {"//"} {stat.label}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-display font-black text-silver-bright tracking-tight">
              {stat.value}
            </div>

            <p className="text-[11px] font-mono text-silver tracking-wider">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
