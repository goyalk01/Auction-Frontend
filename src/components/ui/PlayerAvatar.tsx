import React from "react";
import { PlayerRole } from "../../types/auction";

interface PlayerAvatarProps {
  name: string;
  role: PlayerRole;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
}

export function PlayerAvatar({ name, role, size = "md", className = "" }: PlayerAvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeMap = {
    sm: "w-7 h-7 text-[11px] font-bold rounded-sm",
    md: "w-10 h-10 text-xs font-bold rounded-sm",
    lg: "w-16 h-16 text-lg font-black rounded-md",
    xl: "w-24 h-24 text-2xl font-black rounded-md",
    hero: "w-28 h-28 sm:w-36 sm:h-36 text-3xl sm:text-4xl font-black rounded-lg",
  };

  const roleAccentBorder: Record<PlayerRole, string> = {
    BATTER: "border-l-2 border-l-silver",
    BOWLER: "border-l-2 border-l-danger",
    ALL_ROUNDER: "border-l-2 border-l-gold",
    WICKETKEEPER: "border-l-2 border-l-info",
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 bg-charcoal text-silver-bright border border-white/[0.08] ${roleAccentBorder[role]} font-mono select-none ${sizeMap[size]} ${className}`}
    >
      <span className="tracking-wider">{initials}</span>
    </div>
  );
}
