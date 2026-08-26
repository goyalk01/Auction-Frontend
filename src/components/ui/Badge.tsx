import React from "react";
import { PlayerRole, PlayerStatus } from "../../types/auction";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "silver" | "blue" | "red" | "yellow" | "charcoal" | "outline";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Badge({ children, variant = "charcoal", className = "", size = "md" }: BadgeProps) {
  const variantStyles = {
    gold: "bg-gold-muted text-gold border-gold/40",
    silver: "bg-surface text-silver-light border-graphite",
    blue: "bg-info-muted text-info border-info/40",
    red: "bg-danger-muted text-danger border-danger/40",
    yellow: "bg-caution-muted text-caution border-caution/40",
    charcoal: "bg-deep text-silver border-graphite",
    outline: "bg-transparent text-silver border-white/10",
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px] tracking-wider",
    md: "px-2 py-0.5 text-[11px] tracking-wider",
    lg: "px-2.5 py-1 text-xs tracking-widest",
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase rounded-sm border select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export function RoleBadge({ role, size = "md" }: { role: PlayerRole; size?: "sm" | "md" | "lg" }) {
  const roleConfig: Record<PlayerRole, { label: string; variant: "blue" | "red" | "gold" | "silver" }> = {
    BATTER: { label: "BATTER", variant: "silver" },
    BOWLER: { label: "BOWLER", variant: "red" },
    ALL_ROUNDER: { label: "ALL-ROUNDER", variant: "gold" },
    WICKETKEEPER: { label: "WICKETKEEPER", variant: "blue" },
  };

  const config = roleConfig[role] || { label: role, variant: "silver" as const };

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}

export function StatusBadge({ status, size = "sm" }: { status: PlayerStatus; size?: "sm" | "md" }) {
  const configMap: Record<PlayerStatus, { label: string; variant: "silver" | "blue" | "gold" | "red" }> = {
    AVAILABLE: { label: "AVAILABLE", variant: "silver" },
    LIVE: { label: "LIVE ON BLOCK", variant: "blue" },
    SOLD: { label: "SOLD", variant: "gold" },
    UNSOLD: { label: "UNSOLD (R2)", variant: "red" },
    RETURNED: { label: "RETURNED", variant: "silver" },
  };

  const config = configMap[status] || { label: status, variant: "silver" as const };

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
