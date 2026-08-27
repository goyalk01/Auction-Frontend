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
            DATABASE {"//"} 200+ REAL PLAYERS POOL
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

      {/* Role & Status Filter Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "BATTER", "BOWLER", "ALL_ROUNDER", "WICKETKEEPER"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase transition-colors ${
                selectedRole === role
                  ? "bg-silver-bright text-void"
                  : "bg-deep text-silver border border-graphite hover:text-white"
              }`}
            >
              {role.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {["ALL", "AVAILABLE", "SOLD", "UNSOLD"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase transition-colors ${
                selectedStatus === status
                  ? "bg-gold text-void"
                  : "bg-deep text-silver border border-graphite hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Player Table */}
      <div className="border border-white/[0.07] rounded-sm overflow-hidden font-mono text-xs max-h-[420px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-deep border-b border-white/[0.07] text-[10px] text-silver-dark uppercase tracking-wider z-10">
            <tr>
              <th className="py-2.5 px-3">PLAYER</th>
              <th className="py-2.5 px-3">ROLE</th>
              <th className="py-2.5 px-3">BASE PRICE</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">BUYER / PRICE</th>
              <th className="py-2.5 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filteredPlayers.map((player) => {
              const isCurrent = auction.currentPlayerId === player.id;
              const buyerTeam = player.soldTo ? teams[player.soldTo] : null;

              return (
                <tr
                  key={player.id}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    isCurrent ? "bg-gold-muted/20" : ""
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-silver-dark w-10">{player.id}</span>
                      <span className="font-bold text-silver-bright">{player.name}</span>
                      {player.nationality === "Overseas" && (
                        <span className="text-[9px] text-info border border-info/40 bg-info-muted/20 px-1 rounded-xs">
                          ✈ OS
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <RoleBadge role={player.role} size="sm" />
                  </td>

                  <td className="py-2.5 px-3 text-silver-light font-bold tabular-nums">
                    {formatLakhs(player.basePrice)}
                  </td>

                  <td className="py-2.5 px-3">
                    <StatusBadge status={player.status} size="sm" />
                  </td>

                  <td className="py-2.5 px-3 text-xs">
                    {player.status === "SOLD" && buyerTeam ? (
                      <span className="text-gold font-bold">
                        {buyerTeam.franchise.shortName} ({formatLakhs(player.soldPrice || 0)})
                      </span>
                    ) : player.status === "UNSOLD" ? (
                      <span className="text-danger-light">PASSED</span>
                    ) : (
                      <span className="text-silver-dark">—</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    {isCurrent ? (
                      <span className="text-[10px] font-bold text-gold border border-gold/40 bg-gold-muted/30 px-2 py-0.5 rounded-xs uppercase">
                        ON BLOCK
                      </span>
                    ) : (
                      <button
                        onClick={() => selectPlayer(player.id)}
                        className="text-[10px] font-bold text-silver-light hover:text-gold border border-graphite hover:border-gold/40 px-2 py-0.5 rounded-xs transition-colors uppercase"
                      >
                        QUEUE LOT
                      </button>
                    )}
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
