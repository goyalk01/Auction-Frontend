"use client";

import React, { useState, useMemo } from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhs } from "../../lib/formatting";
import { RoleBadge, StatusBadge } from "../ui/Badge";
import { Search } from "lucide-react";

export function PlayerPoolManager() {
  const { players, auction, selectPlayer, teams } = useAuction();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      if (selectedRole !== "ALL" && player.role !== selectedRole) return false;
      if (selectedStatus !== "ALL" && player.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          player.name.toLowerCase().includes(query) ||
          player.id.toLowerCase().includes(query) ||
          player.role.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [players, selectedRole, selectedStatus, searchQuery]);

  return (
    <div className="p-5 bg-charcoal border border-white/[0.08] rounded-md space-y-4 select-none">
      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-silver-light uppercase tracking-[0.2em] block">
            DATABASE {"//"} 120 PLAYER POOL
          </span>
          <span className="text-xs font-mono text-silver-dark">
            {players.filter((p) => p.status === "SOLD").length} SOLD •{" "}
            {players.filter((p) => p.status === "AVAILABLE").length} AVAILABLE •{" "}
            {players.filter((p) => p.status === "UNSOLD").length} UNSOLD
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 font-mono text-xs">
          <Search className="w-3.5 h-3.5 text-silver-dark absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH PLAYERS..."
            className="w-full pl-8 pr-3 py-1.5 rounded-sm bg-deep border border-graphite text-silver-bright placeholder:text-silver-dark focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
        <div className="flex items-center gap-1">
          {["ALL", "BATTER", "BOWLER", "ALL_ROUNDER", "WICKETKEEPER"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2 py-1 rounded-sm uppercase tracking-wider transition-colors ${
                selectedRole === role
                  ? "bg-deep border border-gold text-gold font-bold"
                  : "bg-deep/60 border border-graphite text-silver hover:text-white"
              }`}
            >
              {role === "ALL" ? "ALL ROLES" : role.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {["ALL", "AVAILABLE", "LIVE", "SOLD", "UNSOLD"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-2 py-1 rounded-sm uppercase tracking-wider transition-colors ${
                selectedStatus === status
                  ? "bg-deep border border-gold text-gold font-bold"
                  : "bg-deep/60 border border-graphite text-silver hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Players Table */}
      <div className="border border-white/[0.07] rounded-sm overflow-hidden font-mono text-xs max-h-96 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-deep border-b border-white/[0.07] text-[10px] text-silver-dark uppercase tracking-wider">
              <th className="py-2.5 px-3">LOT</th>
              <th className="py-2.5 px-3">NAME</th>
              <th className="py-2.5 px-3">ROLE</th>
              <th className="py-2.5 px-3">BASE PRICE</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filteredPlayers.map((player) => {
              const isCurrent = auction.currentPlayerId === player.id;
              const soldTeam = player.soldTo ? teams[player.soldTo] : undefined;

              return (
                <tr
                  key={player.id}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    isCurrent ? "bg-gold-muted/30" : ""
                  }`}
                >
                  <td className="py-2 px-3 text-silver-dark">
                    #{player.id.replace("p-", "")}
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-bold font-display uppercase tracking-wide text-silver-bright">
                      {player.name}
                    </span>
                    {player.nationality === "Overseas" && (
                      <span className="text-[10px] text-silver-dark ml-1.5">[OS]</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <RoleBadge role={player.role} size="sm" />
                  </td>
                  <td className="py-2 px-3 tabular-nums text-silver-light">
                    {formatLakhs(player.basePrice)}
                  </td>
                  <td className="py-2 px-3">
                    {player.status === "SOLD" && soldTeam ? (
                      <span className="text-gold font-bold">
                        SOLD ({formatLakhs(player.soldPrice || 0)}) → {soldTeam.franchise.shortName}
                      </span>
                    ) : (
                      <StatusBadge status={player.status} size="sm" />
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => selectPlayer(player.id)}
                      disabled={isCurrent}
                      className={`px-2 py-0.5 rounded-sm border uppercase text-[10px] font-bold tracking-wider transition-colors ${
                        isCurrent
                          ? "bg-gold text-void border-gold"
                          : "bg-deep border-graphite text-silver hover:text-silver-bright hover:border-silver"
                      }`}
                    >
                      {isCurrent ? "ON BLOCK" : "SET LOT"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
