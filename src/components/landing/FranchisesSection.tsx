"use client";

import React, { useState } from "react";
import { INITIAL_FRANCHISES } from "../../data/franchises";

export function FranchisesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-deep hairline-t hairline-b px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-gold uppercase">
              OFFICIAL CATALOGUE
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-silver-bright uppercase tracking-tight">
              15 COMPETING FRANCHISES
            </h2>
          </div>

          <span className="text-xs font-mono text-silver-dark">
            EQUAL PURSE: ₹125 CRORE (12,500 LAKHS) PER TEAM
          </span>
        </div>

        {/* Editorial Catalogue Table */}
        <div className="border-t border-b border-white/[0.08] divide-y divide-white/[0.06]">
          {INITIAL_FRANCHISES.map((team, idx) => {
            const isHovered = hoveredId === team.id;
            return (
              <div
                key={team.id}
                onMouseEnter={() => setHoveredId(team.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`py-3.5 px-3 flex items-center justify-between transition-colors relative ${
                  isHovered ? "bg-white/[0.03]" : ""
                }`}
              >
                {/* Thin Team Accent Line on Hover */}
                {isHovered && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: team.primaryColor }}
                  />
                )}

                <div className="flex items-center gap-4 sm:gap-8 overflow-hidden">
                  <span className="text-xs font-mono font-bold text-silver-dark w-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm border"
                    style={{
                      borderColor: `${team.primaryColor}55`,
                      color: team.primaryColor === "#EAB308" ? "#F5C542" : team.textColor,
                      backgroundColor: `${team.primaryColor}15`,
                    }}
                  >
                    {team.shortName}
                  </span>

                  <span className="text-sm sm:text-base font-display font-bold text-silver-bright uppercase tracking-wide truncate">
                    {team.name}
                  </span>
                </div>

                <div className="flex items-center gap-6 shrink-0 font-mono text-xs">
                  <span className="text-silver-dark hidden sm:inline">{team.city}</span>
                  <span className="font-bold text-gold">₹125 CR</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
