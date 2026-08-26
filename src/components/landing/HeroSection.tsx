"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuction } from "../../lib/store/useAuction";

export function HeroSection() {
  const { auction } = useAuction();

  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-36 bg-void bg-tech-grid">
      {/* Editorial Watermark / Registration Marks */}
      <div className="absolute top-8 left-8 text-[10px] font-mono text-white/[0.06] select-none uppercase tracking-[0.3em] hidden sm:block">
        REG {"//"} VITB-MUN-2026
      </div>
      <div className="absolute top-8 right-8 text-[10px] font-mono text-white/[0.06] select-none uppercase tracking-[0.3em] hidden sm:block">
        STAGE 01 {"//"} SYSTEM ACTIVE
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        {/* Top Micro-Header */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-deep border border-graphite rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-silver-light uppercase">
            VIT BHOPAL MUN CLUB PRESENTS
          </span>
        </div>

        {/* Cinematic Main Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black text-silver-bright uppercase tracking-[-0.03em] leading-[0.95]">
            THE IPL <br />
            <span className="text-gold">MEGA AUCTION</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-mono tracking-[0.25em] text-silver uppercase pt-2">
            BUILD. BID. DOMINATE.
          </p>

          <p className="text-xs sm:text-sm text-silver-dark max-w-xl mx-auto font-sans leading-relaxed pt-2">
            A high-stakes tactical simulation. Manage a virtual <strong className="text-silver-bright font-semibold">₹100 Crore</strong> purse,
            compete against 14 rival franchises in real time, and defend your squad before the executive board.
          </p>
        </div>

        {/* Action Control */}
        <div className="flex items-center justify-center pt-4">
          <Link href="/auction">
            <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              ENTER LIVE AUCTION
            </Button>
          </Link>
        </div>

        {/* Thin Information Rail */}
        <div className="pt-16 max-w-4xl mx-auto">
          <div className="hairline-t pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
            <div className="sm:hairline-r sm:pr-4">
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
                01 / FRANCHISES
              </span>
              <span className="text-2xl font-display font-black text-silver-bright mt-1 block">
                15 TEAMS
              </span>
            </div>

            <div className="sm:hairline-r sm:pr-4">
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
                02 / STARTING PURSE
              </span>
              <span className="text-2xl font-display font-black text-gold mt-1 block">
                ₹100 CR
              </span>
            </div>

            <div className="sm:hairline-r sm:pr-4">
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
                03 / PLAYER POOL
              </span>
              <span className="text-2xl font-display font-black text-silver-bright mt-1 block">
                120+ STARS
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
                04 / AUCTION ROUNDS
              </span>
              <span className="text-2xl font-display font-black text-silver-bright mt-1 block">
                02 STAGES
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
