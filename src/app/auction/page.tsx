"use client";

import React, { useState } from "react";
import { BroadcastHeader } from "../../components/auction/BroadcastHeader";
import { CommonBoard } from "../../components/auction/CommonBoard";
import { TeamDossier } from "../../components/auction/TeamDossier";
import { SoldOverlay } from "../../components/auction/SoldOverlay";
import { UnsoldOverlay } from "../../components/auction/UnsoldOverlay";
import { useAuction } from "../../lib/store/useAuction";

export default function LiveAuctionPage() {
  const { teams, teamsList } = useAuction();
  const [viewMode, setViewMode] = useState<"common" | "team">("common");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const activeTeamState = selectedTeamId ? teams[selectedTeamId] : teamsList[0];

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setViewMode("team");
  };

  const handleSelectCommon = () => {
    setViewMode("common");
  };

  return (
    <main className="min-h-screen bg-stadium-auction flex flex-col select-none font-sans relative overflow-x-hidden">
      {/* Technical Grid Overlay sitting above subtle stadium atmosphere */}
      <div className="absolute inset-0 bg-tech-grid pointer-events-none z-[2] opacity-70" />

      {/* Dynamic Broadcast Header Rail */}
      <div className="relative z-30">
        <BroadcastHeader
          viewMode={viewMode}
          selectedTeamId={selectedTeamId}
          onSelectCommon={handleSelectCommon}
          onSelectTeam={handleSelectTeam}
        />
      </div>

      {/* Main Live Stage Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {viewMode === "common" ? (
          <CommonBoard onSelectTeam={handleSelectTeam} />
        ) : activeTeamState ? (
          <TeamDossier
            teamState={activeTeamState}
            onBackToCommon={handleSelectCommon}
          />
        ) : null}
      </div>

      {/* Cinematic Overlays */}
      <SoldOverlay />
      <UnsoldOverlay />
    </main>
  );
}
