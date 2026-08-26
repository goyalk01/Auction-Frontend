"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { TeamState, Bid } from "../../types/auction";
import { formatLakhs } from "../../lib/formatting";
import { History, Trophy, XCircle, Clock } from "lucide-react";

interface TeamBidHistoryProps {
  teamState: TeamState;
}

export function TeamBidHistory({ teamState }: TeamBidHistoryProps) {
  const { auction, players, teams } = useAuction();

  // Filter recent bids placed by this team
  const teamBids = auction.recentBids.filter((b) => b.teamId === teamState.franchise.id);

  // Group bids by playerId to show highest bid and outcome per player
  const playerBidsMap = new Map<string, { highestBid: number; latestTimestamp: number; bidCount: number }>();
  teamBids.forEach((b) => {
    const existing = playerBidsMap.get(b.playerId);
    if (!existing || b.amount > existing.highestBid) {
      playerBidsMap.set(b.playerId, {
        highestBid: b.amount,
        latestTimestamp: b.timestamp,
        bidCount: (existing?.bidCount || 0) + 1,
      });
    }
  });

  // Also include any players in squad (in case bids were cleared or before recentBids buffer)
  teamState.squad.forEach((player) => {
    if (!playerBidsMap.has(player.id)) {
      playerBidsMap.set(player.id, {
        highestBid: player.soldPrice || player.basePrice,
        latestTimestamp: Date.now(),
        bidCount: 1,
      });
    }
  });

  const playerEntries = Array.from(playerBidsMap.entries())
    .map(([playerId, data]) => {
      const player = players.find((p) => p.id === playerId);
      return {
        playerId,
        player,
        highestBid: data.highestBid,
        bidCount: data.bidCount,
        timestamp: data.latestTimestamp,
      };
    })
    .filter((entry) => entry.player !== undefined)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="p-5 sm:p-6 bg-charcoal border border-white/[0.08] rounded-md font-mono select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-silver-dark" />
          <span className="text-[10px] font-bold text-silver-light uppercase tracking-[0.2em]">
            AUCTION HISTORY {"//"} {teamState.franchise.shortName} BIDDING RECORD
          </span>
        </div>
        <span className="text-[10px] text-silver-dark uppercase">
          {playerEntries.length} TARGETS ENGAGED
        </span>
      </div>

      {playerEntries.length === 0 ? (
        <div className="py-8 text-center text-silver-dark text-xs">
          NO BIDDING ACTIVITY RECORDED FOR THIS FRANCHISE YET
        </div>
      ) : (
        <div className="border border-white/[0.07] rounded-sm overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-deep border-b border-white/[0.07] text-[10px] text-silver-dark uppercase">
                <th className="py-2.5 px-3">PLAYER</th>
                <th className="py-2.5 px-3 text-right">HIGHEST BID</th>
                <th className="py-2.5 px-3 text-right">OUTCOME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {playerEntries.map(({ player, highestBid, bidCount }) => {
                if (!player) return null;

                const isWon = player.status === "SOLD" && player.soldTo === teamState.franchise.id;
                const isLost = player.status === "SOLD" && player.soldTo !== teamState.franchise.id;
                const winningTeam = isLost && player.soldTo ? teams[player.soldTo] : null;
                const isLive = player.id === auction.currentPlayerId;

                return (
                  <tr key={player.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3">
                      <div>
                        <span className="font-bold font-display text-sm text-silver-bright uppercase block">
                          {player.name}
                        </span>
                        <span className="text-[10px] text-silver-dark uppercase">
                          {player.role} • {bidCount} {bidCount === 1 ? "bid" : "bids"} submitted
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-gold tabular-nums">
                      {formatLakhs(highestBid)}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      {isWon ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gold bg-gold-muted/40 px-2 py-0.5 rounded-xs border border-gold/40">
                          <Trophy className="w-3 h-3" /> WON
                        </span>
                      ) : isLost ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-silver-dark bg-deep px-2 py-0.5 rounded-xs border border-graphite">
                          <XCircle className="w-3 h-3 text-danger" />
                          LOST TO {winningTeam?.franchise.shortName || "RIVAL"}
                        </span>
                      ) : isLive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-info bg-info-muted/30 px-2 py-0.5 rounded-xs border border-info/40 animate-pulse">
                          <Clock className="w-3 h-3" /> IN PROGRESS
                        </span>
                      ) : (
                        <span className="text-[10px] text-silver-dark">PASSED</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
