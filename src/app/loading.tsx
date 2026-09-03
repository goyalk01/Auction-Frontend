import React from "react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center p-6 bg-tech-grid font-mono relative select-none">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Pulsing Gold Hexagon Indicator */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping" />
          <div className="w-10 h-10 rounded-sm border-2 border-gold/60 bg-charcoal flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <div className="w-3 h-3 bg-gold rounded-xs animate-pulse" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] block">
            ESTABLISHING BROADCAST TELEMETRY
          </span>
          <p className="text-xs text-silver-dark font-sans">
            Synchronizing live state engine...
          </p>
        </div>
      </div>
    </div>
  );
}
