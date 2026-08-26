"use client";

import React from "react";
import { Navbar } from "../../components/layout/Navbar";
import { JudgeFranchiseGrid } from "../../components/judge/JudgeFranchiseGrid";
import { EvaluationRubricCard } from "../../components/judge/EvaluationRubricCard";
import { Footer } from "../../components/layout/Footer";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhs } from "../../lib/formatting";

export default function JudgeDashboardPage() {
  const { teamsList, players } = useAuction();

  const totalSpentAll = teamsList.reduce((acc, t) => acc + t.spentPurse, 0);
  const soldPlayersCount = players.filter((p) => p.status === "SOLD").length;

  return (
    <main className="min-h-screen bg-void flex flex-col bg-tech-grid">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1 font-mono">
        {/* Top Header Card */}
        <div className="p-5 sm:p-6 bg-charcoal border border-white/[0.08] rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 select-none">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.25em] block">
              JUDICIAL PORTAL {"//"} EXECUTIVE BOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-silver-bright uppercase tracking-tight">
              SQUAD REVIEW & EVALUATION MATRIX
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-8 text-left md:text-right">
            <div>
              <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
                TOTAL MARKET SPENT
              </span>
              <span className="text-xl font-display font-black text-gold tabular-nums block mt-0.5">
                {formatLakhs(totalSpentAll)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
                ACQUIRED PLAYERS
              </span>
              <span className="text-xl font-display font-black text-silver-bright tabular-nums block mt-0.5">
                {soldPlayersCount} / 120
              </span>
            </div>
          </div>
        </div>

        {/* 15 Franchises Review Matrix */}
        <JudgeFranchiseGrid />

        {/* Evaluation Rubrics */}
        <EvaluationRubricCard />
      </div>

      <Footer />
    </main>
  );
}
