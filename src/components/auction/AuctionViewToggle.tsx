"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutDashboard, Shield, Check } from "lucide-react";
import { useAuction } from "../../lib/store/useAuction";
import { Franchise } from "../../types/auction";

interface AuctionViewToggleProps {
  viewMode: "common" | "team";
  selectedTeamId: string | null;
  onSelectCommon: () => void;
  onSelectTeam: (teamId: string) => void;
}

export function AuctionViewToggle({
  viewMode,
  selectedTeamId,
  onSelectCommon,
  onSelectTeam,
}: AuctionViewToggleProps) {
  const { teamsList, teams } = useAuction();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTeamState = selectedTeamId ? teams[selectedTeamId] : null;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-1.5 p-1 bg-deep border border-graphite rounded-sm font-mono text-xs select-none">
      {/* Common Board Button */}
      <button
        onClick={() => {
          onSelectCommon();
          setDropdownOpen(false);
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs uppercase tracking-wider font-bold transition-colors ${
          viewMode === "common"
            ? "bg-charcoal text-gold border border-gold/40 shadow-xs"
            : "text-silver hover:text-silver-bright hover:bg-white/[0.03]"
        }`}
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        <span>COMMON BOARD</span>
      </button>

      {/* Franchise Dropdown Trigger */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xs uppercase tracking-wider font-bold transition-colors ${
            viewMode === "team"
              ? "bg-charcoal text-gold border border-gold/40 shadow-xs"
              : "text-silver hover:text-silver-bright hover:bg-white/[0.03]"
          }`}
        >
          {selectedTeamState ? (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: selectedTeamState.franchise.primaryColor }}
              />
              <span>{selectedTeamState.franchise.shortName} DOSSIER</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>SELECT FRANCHISE</span>
            </div>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-1.5 w-64 sm:w-72 bg-charcoal border border-white/[0.12] rounded-md shadow-2xl z-50 p-2 space-y-1 max-h-80 overflow-y-auto">
            <div className="px-2 py-1 border-b border-white/[0.06] text-[10px] text-silver-dark uppercase tracking-widest flex items-center justify-between">
              <span>15 FRANCHISES</span>
              <span>SELECT VIEW</span>
            </div>

            <div className="grid grid-cols-1 gap-1 pt-1">
              {teamsList.map((tState) => {
                const isCurrent = viewMode === "team" && selectedTeamId === tState.franchise.id;
                return (
                  <button
                    key={tState.franchise.id}
                    onClick={() => {
                      onSelectTeam(tState.franchise.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xs text-left flex items-center justify-between transition-colors ${
                      isCurrent
                        ? "bg-deep text-gold border border-gold/40"
                        : "text-silver hover:bg-deep hover:text-silver-bright border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span
                        className="w-4 h-4 rounded-xs flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ backgroundColor: tState.franchise.primaryColor }}
                      >
                        {tState.franchise.shortName.slice(0, 2)}
                      </span>
                      <span className="truncate text-xs font-sans font-medium">
                        {tState.franchise.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-silver-dark shrink-0">
                      <span>{tState.squad.length}/11</span>
                      {isCurrent && <Check className="w-3 h-3 text-gold" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
