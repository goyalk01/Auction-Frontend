"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { CaptainHeader } from "../../components/team/CaptainHeader";
import { LiveBidActionPanel } from "../../components/team/LiveBidActionPanel";
import { SquadTracker } from "../../components/team/SquadTracker";
import { OpponentRadar } from "../../components/team/OpponentRadar";
import { Footer } from "../../components/layout/Footer";
import { useAuction } from "../../lib/store/useAuction";
import { useAuth } from "../../lib/auth/AuthContext";
import { TeamAuthModal } from "../../components/auth/TeamAuthModal";
import { Button } from "../../components/ui/Button";
import { ShieldCheck, Lock } from "lucide-react";

export default function TeamDashboardPage() {
  const { teamsList, teams } = useAuction();
  const { user, role, teamId } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("team-01");
  const [activeTab, setActiveTab] = useState<"squad" | "radar">("squad");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync selected team with authenticated team session
  useEffect(() => {
    if (role === "TEAM" && teamId) {
      setSelectedTeamId(teamId);
    }
  }, [role, teamId]);

  const currentTeamState = teams[selectedTeamId] || teamsList[0];

  if (!currentTeamState) {
    return (
      <main className="min-h-screen bg-void flex items-center justify-center font-mono text-xs text-silver">
        INITIALIZING CAPTAIN TERMINAL...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void flex flex-col bg-tech-grid">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 flex-1">
        {/* Authentication Notice Banner if Unauthenticated */}
        {role !== "TEAM" && role !== "ADMIN" && (
          <div className="p-4 bg-deep border border-gold/40 rounded-md flex items-center justify-between gap-4 font-mono text-xs select-none">
            <div className="flex items-center gap-2.5 text-gold">
              <Lock className="w-4 h-4 shrink-0" />
              <span>
                SPECTATOR MODE — Authenticate with your franchise credentials to submit live bids.
              </span>
            </div>
            <Button
              variant="gold"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
            >
              CAPTAIN LOGIN
            </Button>
          </div>
        )}

        {/* Top Status & Balance Bar */}
        <CaptainHeader
          teamState={currentTeamState}
          onSelectTeam={(tId) => setSelectedTeamId(tId)}
        />

        {/* Live Touch Bidding Action Panel */}
        <LiveBidActionPanel teamState={currentTeamState} />

        {/* Navigation Tabs (Editorial Monospace) */}
        <div className="flex border-b border-white/[0.08] font-mono text-xs">
          <button
            onClick={() => setActiveTab("squad")}
            className={`py-2.5 px-4 font-bold uppercase tracking-widest transition-colors relative ${
              activeTab === "squad"
                ? "text-gold"
                : "text-silver hover:text-silver-bright"
            }`}
          >
            01 {"//"} SQUAD ROSTER
            {activeTab === "squad" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("radar")}
            className={`py-2.5 px-4 font-bold uppercase tracking-widest transition-colors relative ${
              activeTab === "radar"
                ? "text-gold"
                : "text-silver hover:text-silver-bright"
            }`}
          >
            02 {"//"} OPPONENT RADAR
            {activeTab === "radar" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "squad" ? (
          <SquadTracker teamState={currentTeamState} />
        ) : (
          <OpponentRadar currentTeamId={selectedTeamId} />
        )}
      </div>

      <TeamAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <Footer />
    </main>
  );
}
