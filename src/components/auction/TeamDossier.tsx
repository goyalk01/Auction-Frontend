"use client";

import React, { useState } from "react";
import { Franchise, TeamState } from "../../types/auction";
import { formatLakhs } from "../../lib/formatting";
import { AUCTION_CONSTANTS } from "../../lib/constants";
import { RoleBadge } from "../ui/Badge";
import { TeamCurrentLotStatus } from "./TeamCurrentLotStatus";
import { TeamBidHistory } from "./TeamBidHistory";
import { SquadTracker } from "./SquadTracker";
import { ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";

interface TeamDossierProps {
  teamState: TeamState;
  onBackToCommon: () => void;
}

export function TeamDossier({ teamState, onBackToCommon }: TeamDossierProps) {
  const { franchise, remainingPurse, spentPurse, squad, roleCounts } = teamState;
  const [activeTab, setActiveTab] = useState<"squad" | "history">("squad");

  const hasWK = roleCounts.WICKETKEEPER >= AUCTION_CONSTANTS.MIN_WICKETKEEPERS;
  const hasBowlers = roleCounts.BOWLER >= AUCTION_CONSTANTS.MIN_BOWLERS;
  const hasMinSquad = squad.length >= AUCTION_CONSTANTS.MIN_SQUAD_SIZE;
  const isFullyCompliant = hasWK && hasBowlers && hasMinSquad;

  const slotsRemaining = AUCTION_CONSTANTS.MAX_SQUAD_SIZE - squad.length;

  return (
    <div className="space-y-6 select-none font-mono">
      {/* Top Banner / Franchise Identification Header */}
      <div className="p-5 sm:p-6 bg-charcoal border border-white/[0.08] rounded-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBackToCommon}
              className="p-1.5 rounded-sm bg-deep border border-graphite text-silver-dark hover:text-gold hover:border-gold/40 transition-colors"
              title="Return to Common Board"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span
              className="w-10 h-10 rounded-xs flex items-center justify-center font-display font-black text-base text-white shadow-md shrink-0"
              style={{ backgroundColor: franchise.primaryColor }}
            >
              {franchise.shortName}
            </span>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-black text-silver-bright uppercase tracking-wide">
                  {franchise.name}
                </h1>
                <span className="text-[10px] text-silver-dark uppercase hidden sm:inline">
                  [{franchise.shortName}]
                </span>
              </div>
              <span className="text-[10px] text-silver-dark uppercase tracking-widest block mt-0.5">
                FRANCHISE DOSSIER {"//"} READ-ONLY AUDIT
              </span>
            </div>
          </div>

          {/* Compliance Tag */}
          <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
            <span className="text-[10px] text-silver-dark uppercase tracking-widest">
              COMPLIANCE STATUS
            </span>
            {isFullyCompliant ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold-muted/30 border border-gold/40 rounded-xs text-gold text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                SQUAD COMPLIANT
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-caution-muted/30 border border-caution/40 rounded-xs text-caution text-[10px] font-bold uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                REQUIREMENT PENDING
              </span>
            )}
          </div>
        </div>

        {/* Financials & Squad Meter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-deep border border-graphite rounded-sm">
            <span className="text-[9px] text-silver-dark uppercase tracking-widest block">
              STARTING PURSE
            </span>
            <span className="text-lg font-display font-bold text-silver-light mt-0.5 block">
              {formatLakhs(franchise.startingPurse)}
            </span>
          </div>

          <div className="p-3.5 bg-deep border border-graphite rounded-sm">
            <span className="text-[9px] text-silver-dark uppercase tracking-widest block">
              SPENT PURSE
            </span>
            <span className="text-lg font-display font-bold text-silver-bright mt-0.5 block">
              {formatLakhs(spentPurse)}
            </span>
          </div>

          <div className="p-3.5 bg-deep border border-gold/30 rounded-sm">
            <span className="text-[9px] text-silver-dark uppercase tracking-widest block">
              REMAINING PURSE
            </span>
            <span className="text-xl font-display font-black text-gold tabular-nums mt-0.5 block">
              {formatLakhs(remainingPurse)}
            </span>
          </div>

          <div className="p-3.5 bg-deep border border-graphite rounded-sm">
            <span className="text-[9px] text-silver-dark uppercase tracking-widest block">
              ROSTER SLOTS
            </span>
            <span className="text-lg font-display font-bold text-silver-bright mt-0.5 block">
              {squad.length} / {AUCTION_CONSTANTS.MAX_SQUAD_SIZE}{" "}
              <span className="text-xs text-silver-dark font-sans font-normal">
                ({slotsRemaining} left)
              </span>
            </span>
          </div>
        </div>

        {/* Role Distribution Strip */}
        <div className="space-y-2 pt-1 border-t border-white/[0.05]">
          <span className="text-[9px] text-silver-dark uppercase tracking-widest block">
            ROLE DISTRIBUTION & MANDATES
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-deep border border-graphite rounded-xs">
              <span className="text-[9px] text-silver-dark uppercase block">BATTERS</span>
              <span className="font-bold text-silver-bright text-sm">{roleCounts.BATTER}</span>
            </div>

            <div className={`p-2 bg-deep border rounded-xs ${hasBowlers ? "border-graphite" : "border-caution/40"}`}>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[9px] text-silver-dark uppercase block">BOWLERS</span>
                <span className="text-[8px] text-silver-dark">(MIN 3)</span>
              </div>
              <span className={`font-bold text-sm ${hasBowlers ? "text-silver-bright" : "text-caution"}`}>
                {roleCounts.BOWLER} / 3
              </span>
            </div>

            <div className="p-2 bg-deep border border-graphite rounded-xs">
              <span className="text-[9px] text-silver-dark uppercase block">ALL-ROUNDERS</span>
              <span className="font-bold text-silver-bright text-sm">{roleCounts.ALL_ROUNDER}</span>
            </div>

            <div className={`p-2 bg-deep border rounded-xs ${hasWK ? "border-graphite" : "border-caution/40"}`}>
              <div className="flex items-center justify-center gap-1">
                <span className="text-[9px] text-silver-dark uppercase block">WICKETKEEPER</span>
                <span className="text-[8px] text-silver-dark">(MIN 1)</span>
              </div>
              <span className={`font-bold text-sm ${hasWK ? "text-silver-bright" : "text-caution"}`}>
                {roleCounts.WICKETKEEPER} / 1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Lot Status Card */}
      <TeamCurrentLotStatus teamState={teamState} />

      {/* Tab Navigation for Roster vs Bidding Record */}
      <div className="flex border-b border-white/[0.08] text-xs">
        <button
          onClick={() => setActiveTab("squad")}
          className={`py-2.5 px-4 font-bold uppercase tracking-widest transition-colors relative ${
            activeTab === "squad"
              ? "text-gold"
              : "text-silver hover:text-silver-bright"
          }`}
        >
          01 {"//"} ACQUIRED SQUAD LEDGER ({squad.length})
          {activeTab === "squad" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`py-2.5 px-4 font-bold uppercase tracking-widest transition-colors relative ${
            activeTab === "history"
              ? "text-gold"
              : "text-silver hover:text-silver-bright"
          }`}
        >
          02 {"//"} FRANCHISE BIDDING RECORD
          {activeTab === "history" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "squad" ? (
        <SquadTracker teamState={teamState} />
      ) : (
        <TeamBidHistory teamState={teamState} />
      )}
    </div>
  );
}
