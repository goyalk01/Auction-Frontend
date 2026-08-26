import React from "react";
import { Player } from "../../types/auction";
import { formatLakhs } from "../../lib/formatting";
import { PlayerAvatar } from "../ui/PlayerAvatar";
import { RoleBadge } from "../ui/Badge";

interface PlayerBroadcastCardProps {
  player?: Player;
}

export function PlayerBroadcastCard({ player }: PlayerBroadcastCardProps) {
  if (!player) {
    return (
      <div className="h-full flex items-center justify-center p-12 bg-charcoal border border-white/[0.08] rounded-md text-center text-silver-dark font-mono text-xs">
        WAITING FOR NEXT LOT ALLOCATION...
      </div>
    );
  }

  const isMarquee = player.category === "MARQUEE";

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-8 bg-charcoal border border-white/[0.08] rounded-md select-none">
      {/* Top Header Rail */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold text-silver-dark uppercase tracking-widest">
            LOT #{player.id.replace("p-", "")}
          </span>
          {isMarquee && (
            <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest px-2 py-0.5 border border-gold/40 bg-gold-muted rounded-sm">
              MARQUEE SET
            </span>
          )}
        </div>

        <span className="text-xs font-mono text-silver uppercase tracking-wider">
          {player.nationality === "Indian" ? "DOMESTIC // IND" : "OVERSEAS // INT"}
        </span>
      </div>

      {/* Main Focus: Player Name & Traits */}
      <div className="py-8 space-y-6">
        <div className="flex items-start gap-6">
          <PlayerAvatar name={player.name} role={player.role} size="hero" />

          <div className="space-y-3">
            <RoleBadge role={player.role} size="md" />

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-silver-bright uppercase tracking-tight leading-[0.95]">
              {player.name}
            </h1>

            {/* Technical traits */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs text-silver">
              {player.battingStyle && (
                <span className="px-2 py-0.5 bg-deep border border-graphite rounded-sm">
                  {player.battingStyle}
                </span>
              )}
              {player.bowlingStyle && (
                <span className="px-2 py-0.5 bg-deep border border-graphite rounded-sm">
                  {player.bowlingStyle}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Financial & Statistical Metrics */}
      <div className="border-t border-white/[0.07] pt-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-deep p-3.5 rounded-sm border border-graphite">
          <div>
            <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
              BASE PRICE
            </span>
            <span className="text-lg sm:text-xl font-display font-black text-silver-bright tabular-nums mt-0.5 block">
              {formatLakhs(player.basePrice)}
            </span>
          </div>

          {player.statsSummary?.matches !== undefined && (
            <div>
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
                MATCHES
              </span>
              <span className="text-lg sm:text-xl font-display font-black text-silver-light tabular-nums mt-0.5 block">
                {player.statsSummary.matches}
              </span>
            </div>
          )}

          {player.statsSummary?.runs !== undefined && (
            <div>
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
                RUNS
              </span>
              <span className="text-lg sm:text-xl font-display font-black text-silver-bright tabular-nums mt-0.5 block">
                {player.statsSummary.runs}
              </span>
            </div>
          )}

          {player.statsSummary?.wickets !== undefined && (
            <div>
              <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
                WICKETS
              </span>
              <span className="text-lg sm:text-xl font-display font-black text-silver-bright tabular-nums mt-0.5 block">
                {player.statsSummary.wickets}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
