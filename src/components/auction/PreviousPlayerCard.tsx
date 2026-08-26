"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhs } from "../../lib/formatting";
import { RoleBadge } from "../ui/Badge";
import { CheckCircle2, XCircle } from "lucide-react";

export function PreviousPlayerCard() {
  const { players, teams, auction } = useAuction();

  // Find the last resolved player (SOLD or UNSOLD) that is not the current player
  const resolvedPlayers = players.filter(
    (p) => (p.status === "SOLD" || p.status === "UNSOLD") && p.id !== auction.currentPlayerId
  );

  // Take the most recently updated or last in list
  const previousPlayer = resolvedPlayers.length > 0 ? resolvedPlayers[resolvedPlayers.length - 1] : null;

  if (!previousPlayer) {
    return (
      <div className="p-3 bg-deep border border-graphite rounded-sm font-mono text-xs flex items-center justify-between text-silver-dark select-none">
        <span className="text-[10px] uppercase tracking-wider">PREVIOUS LOT</span>
        <span className="text-[10px]">AWAITING FIRST CONCLUSION</span>
      </div>
    );
  }

  const isSold = previousPlayer.status === "SOLD";
  const winningTeam = isSold && previousPlayer.soldTo ? teams[previousPlayer.soldTo] : null;

  return (
    <div className="p-3.5 bg-charcoal border border-white/[0.08] rounded-md font-mono select-none space-y-2">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
        <span className="text-[10px] font-bold text-silver-dark uppercase tracking-[0.2em] flex items-center gap-1.5">
          PREVIOUS LOT {"//"} #{previousPlayer.id.replace("p-", "")}
        </span>
        <div className="flex items-center gap-1">
          {isSold ? (
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1 bg-gold-muted/40 px-1.5 py-0.5 rounded-xs border border-gold/40">
              <CheckCircle2 className="w-3 h-3" />
              SOLD
            </span>
          ) : (
            <span className="text-[10px] font-bold text-danger uppercase tracking-wider flex items-center gap-1 bg-danger-muted/40 px-1.5 py-0.5 rounded-xs border border-danger/40">
              <XCircle className="w-3 h-3" />
              UNSOLD
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <RoleBadge role={previousPlayer.role} size="sm" />
          <span className="font-display font-black text-sm text-silver-bright uppercase truncate">
            {previousPlayer.name}
          </span>
        </div>

        {isSold && winningTeam ? (
          <div className="flex items-center gap-2 text-right shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-silver-dark block uppercase">ACQUIRED BY</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-xs"
                  style={{ backgroundColor: winningTeam.franchise.primaryColor }}
                />
                <span className="text-xs font-bold text-silver-bright">
                  {winningTeam.franchise.shortName}
                </span>
                <span className="text-xs font-bold text-gold tabular-nums">
                  ({formatLakhs(previousPlayer.soldPrice || previousPlayer.basePrice)})
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-right text-[11px] text-silver-dark shrink-0">
            PASSED AT {formatLakhs(previousPlayer.basePrice)}
          </div>
        )}
      </div>
    </div>
  );
}
