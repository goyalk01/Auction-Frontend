import React from "react";
import Link from "next/link";
import { AUCTION_CONSTANTS } from "../../lib/constants";

export function Footer() {
  return (
    <footer className="hairline-t bg-void text-silver py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Mandate */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-base text-silver-bright tracking-[0.15em] uppercase">
              VITB—MUN
            </span>
            <span className="text-[11px] font-mono text-gold uppercase tracking-widest">
              / THE IPL MEGA AUCTION
            </span>
          </div>
          <p className="text-xs text-silver-dark max-w-md leading-relaxed font-sans">
            Official fantasy sports auction simulation and strategic decision platform for the VIT
            Bhopal Model United Nations Club. Real-time valuation, budget discipline, and judicial squad
            evaluation.
          </p>
        </div>

        {/* Portals */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-silver-light">
            TERMINALS
          </h4>
          <ul className="space-y-1.5 text-xs font-mono">
            <li>
              <Link href="/auction" className="text-silver hover:text-gold transition-colors">
                01. 1080P BROADCAST
              </Link>
            </li>
            <li>
              <Link href="/team" className="text-silver hover:text-gold transition-colors">
                02. CAPTAIN TERMINAL
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-silver hover:text-gold transition-colors">
                03. AUCTION CONTROL
              </Link>
            </li>
            <li>
              <Link href="/judge" className="text-silver hover:text-gold transition-colors">
                04. JUDGE MATRIX
              </Link>
            </li>
          </ul>
        </div>

        {/* Specifications */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-silver-light">
            EVENT PARAMETERS
          </h4>
          <ul className="space-y-1.5 text-xs font-mono text-silver-dark">
            <li className="flex justify-between border-b border-white/[0.05] pb-1">
              <span>Franchises</span>
              <span className="text-silver-bright">15 Total</span>
            </li>
            <li className="flex justify-between border-b border-white/[0.05] pb-1">
              <span>Purse</span>
              <span className="text-gold">₹100 Cr Each</span>
            </li>
            <li className="flex justify-between border-b border-white/[0.05] pb-1">
              <span>Squad Limit</span>
              <span className="text-silver-bright">7 – 11 Players</span>
            </li>
            <li className="flex justify-between">
              <span>Rounds</span>
              <span className="text-silver-bright">02 Stages</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 hairline-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-silver-dark">
        <span>© 2026 VITB—MUN CLUB. ALL RIGHTS RESERVED.</span>
        <span>STAGE 01 / REPOSITORY ARCHITECTURE VERIFIED</span>
      </div>
    </footer>
  );
}
