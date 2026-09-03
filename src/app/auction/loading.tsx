import React from "react";

export default function AuctionLoading() {
  return (
    <div className="min-h-screen bg-void flex flex-col font-mono select-none relative overflow-hidden bg-tech-grid">
      {/* Broadcast Header Skeleton */}
      <header className="h-16 border-b border-white/[0.08] bg-panel/80 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-white/[0.05] animate-pulse" />
          <div className="h-5 w-48 bg-white/[0.05] rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-28 bg-white/[0.05] rounded animate-pulse" />
          <div className="h-8 w-32 bg-gold/10 rounded animate-pulse" />
        </div>
      </header>

      {/* Main Live Stage Skeleton */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Lot Card Skeleton */}
        <div className="h-64 sm:h-72 rounded-md border border-white/[0.08] bg-charcoal/50 p-6 flex flex-col md:flex-row gap-6 animate-pulse">
          <div className="w-36 h-36 rounded-md bg-white/[0.05] flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-4 w-28 bg-white/[0.05] rounded" />
            <div className="h-8 w-64 bg-white/[0.08] rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="h-12 bg-white/[0.03] rounded" />
              <div className="h-12 bg-white/[0.03] rounded" />
              <div className="h-12 bg-white/[0.03] rounded" />
              <div className="h-12 bg-white/[0.03] rounded" />
            </div>
          </div>
        </div>

        {/* Centerpiece & Bidding Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-md border border-white/[0.08] bg-charcoal/40 animate-pulse" />
          <div className="h-80 rounded-md border border-white/[0.08] bg-charcoal/40 animate-pulse" />
        </div>
      </main>
    </div>
  );
}
