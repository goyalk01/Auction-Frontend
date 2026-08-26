"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { AuctionControlBar } from "../../components/admin/AuctionControlBar";
import { PhaseManager } from "../../components/admin/PhaseManager";
import { PlayerPoolManager } from "../../components/admin/PlayerPoolManager";
import { TeamsOverviewTable } from "../../components/admin/TeamsOverviewTable";
import { AuditLogViewer } from "../../components/admin/AuditLogViewer";
import { Footer } from "../../components/layout/Footer";
import { useAuction } from "../../lib/store/useAuction";
import { useAuth } from "../../lib/auth/AuthContext";
import { AdminAuthModal } from "../../components/auth/AdminAuthModal";
import { formatLakhs } from "../../lib/formatting";
import { RoleBadge } from "../../components/ui/Badge";
import { PlayerAvatar } from "../../components/ui/PlayerAvatar";
import { Button } from "../../components/ui/Button";
import { Lock, ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
  const { currentPlayer, auction, leadingTeam, emergencyLock } = useAuction();
  const { user, role } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // If not authenticated as ADMIN, display secure terminal gate
  if (role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-void flex flex-col bg-tech-grid">
        <Navbar />

        <div className="max-w-xl mx-auto w-full px-4 py-16 sm:py-24 my-auto space-y-6 text-center select-none font-mono">
          <div className="p-8 bg-charcoal border border-white/[0.08] rounded-md space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-sm bg-deep border border-gold/40 text-gold flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.25em] block">
                SECURITY GATE // RESTRICTED ACCESS
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-silver-bright uppercase tracking-tight">
                AUCTIONEER CONTROL DESK
              </h1>
              <p className="text-xs text-silver-dark font-sans max-w-sm mx-auto pt-2">
                This operations terminal is restricted to authorized Executive Board auctioneers and moderators.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={() => setAuthModalOpen(true)}
              >
                AUTHENTICATE AS ADMIN
              </Button>
            </div>
          </div>
        </div>

        <AdminAuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void flex flex-col bg-tech-grid">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
        {/* Active Lot Quick Glance Banner */}
        {currentPlayer && (
          <div className="p-4 sm:p-5 bg-charcoal border border-gold/40 rounded-md flex flex-col md:flex-row items-center justify-between gap-4 font-mono select-none">
            <div className="flex items-center gap-4">
              <PlayerAvatar name={currentPlayer.name} role={currentPlayer.role} size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest">
                    LOT #{currentPlayer.id.replace("p-", "")} {"//"} ACTIVE
                  </span>
                  <RoleBadge role={currentPlayer.role} size="sm" />
                </div>
                <h2 className="text-xl font-display font-black text-silver-bright uppercase mt-0.5">
                  {currentPlayer.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-6 text-center md:text-right">
              <div>
                <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
                  CURRENT BID
                </span>
                <span className="text-2xl font-display font-black text-gold tabular-nums">
                  {auction.currentBid > 0 ? formatLakhs(auction.currentBid) : "OPENING"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
                  LEADER
                </span>
                <span className="text-sm font-bold text-silver-bright block">
                  {leadingTeam ? leadingTeam.franchise.name : "NONE"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-silver-dark uppercase tracking-widest block">
                  CLOCK
                </span>
                <span className="text-2xl font-mono font-black text-silver-bright tabular-nums">
                  {auction.timer}s
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Primary Controls */}
        <AuctionControlBar />

        {/* Workflow Phase Manager */}
        <PhaseManager />

        {/* Player Pool Navigator */}
        <PlayerPoolManager />

        {/* 15 Franchises Ledger */}
        <TeamsOverviewTable />

        {/* Real-time Audit Trail */}
        <AuditLogViewer />
      </div>

      <Footer />
    </main>
  );
}
