"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuction } from "../../lib/store/useAuction";

export function HeroSection() {
  const { auction } = useAuction();

  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-32 bg-stadium-hero">
      {/* Technical Grid Overlay sitting above stadium vignette and below text */}
      <div className="absolute inset-0 bg-tech-grid pointer-events-none z-[2] opacity-60" />

      {/* Editorial Watermark / Registration Marks */}
      <div className="absolute top-8 left-8 text-[10px] font-mono text-white/[0.12] select-none uppercase tracking-[0.3em] hidden sm:block z-10">
        REG {"//"} VITBMUN-2026
      </div>
      <div className="absolute top-8 right-8 text-[10px] font-mono text-white/[0.12] select-none uppercase tracking-[0.3em] hidden sm:block z-10">
        STAGE 01 {"//"} SYSTEM ACTIVE
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-9">
        {/* Top Institutional Branding Badge with Official Logo */}
        <div className="inline-flex items-center gap-3.5 px-4 py-1.5 bg-deep/95 border border-graphite rounded-sm backdrop-blur-sm shadow-md">
          <img
            src="/images/vitbmun-logo.png"
            alt="VITBMUN logo"
            className="h-7 w-auto object-contain shrink-0"
          />
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm sm:text-base tracking-[0.2em] text-silver-bright uppercase">
              VITBMUN
            </span>
            <span className="text-silver-dark text-xs font-mono">{"//"}</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.15em] text-gold uppercase">
              IPL MEGA AUCTION
            </span>
          </div>
        </div>

        {/* Cinematic Main Title with Localized Protective Backdrop */}
        <div className="space-y-4 max-w-4xl mx-auto hero-text-backdrop">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black text-silver-bright uppercase tracking-[-0.03em] leading-[0.95] drop-shadow-md">
            THE IPL <br />
            <span className="text-gold">MEGA AUCTION</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-mono tracking-[0.25em] text-silver uppercase pt-2 drop-shadow-sm">
            BUILD. BID. DOMINATE.
          </p>

          <p className="text-xs sm:text-sm text-silver-light max-w-xl mx-auto font-sans leading-relaxed pt-2">
            A high-stakes tactical simulation. Manage a virtual <strong className="text-white font-semibold">₹125 Crore</strong> purse,
            compete against rival franchises in real time, and defend your squad before the executive board.
          </p>
        </div>

        {/* Action Control */}
        <div className="flex items-center justify-center pt-1">
          <Link href="/auction">
            <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              ENTER LIVE AUCTION
            </Button>
          </Link>
        </div>

        {/* Thin Information Rail */}
        <div className="pt-12 max-w-4xl mx-auto">
          <div className="hairline-t pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center bg-deep/70 backdrop-blur-xs p-4 rounded-md border border-white/[0.05]">
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
                ₹125 CR
              </span>
            </div>

            <div className="sm:hairline-r sm:pr-4">
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
                03 / PLAYER POOL
              </span>
              <span className="text-2xl font-display font-black text-silver-bright mt-1 block">
                200+ REAL PLAYERS
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
                04 / COMPETITION
              </span>
              <span className="text-2xl font-display font-black text-silver-bright mt-1 block">
                RIVAL TEAMS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
