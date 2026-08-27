"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX, Menu, X, LogOut } from "lucide-react";
import { useAuction } from "../../lib/store/useAuction";
import { useAuth } from "../../lib/auth/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { auction, toggleSound, backendType, connectionStatus } = useAuction();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "LIVE AUCTION", href: "/auction", highlight: true },
  ];

  // Connection Indicator Styling
  let connectionLabel = "LIVE";
  let connectionDot = "bg-info animate-pulse";
  let connectionText = "text-info";

  if (backendType === "mock") {
    connectionLabel = "MOCK ENGINE";
    connectionDot = "bg-gold";
    connectionText = "text-gold";
  } else if (connectionStatus === "reconnecting") {
    connectionLabel = "RECONNECTING";
    connectionDot = "bg-caution animate-ping";
    connectionText = "text-caution";
  } else if (connectionStatus === "offline") {
    connectionLabel = "OFFLINE";
    connectionDot = "bg-danger";
    connectionText = "text-danger";
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-void/95 hairline-b select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Official VITBMUN Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/vitbmun-logo.png"
            alt="VITBMUN logo"
            className="h-9 w-auto object-contain shrink-0"
          />
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-lg sm:text-xl tracking-[0.18em] text-silver-bright uppercase">
              VITBMUN
            </span>
            <span className="text-[10px] font-mono text-gold tracking-widest uppercase hidden sm:inline">
              {"//"} MEGA AUCTION
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] font-mono font-bold tracking-[0.15em] uppercase transition-colors relative py-1 ${
                  isActive
                    ? "text-gold"
                    : item.highlight
                    ? "text-info hover:text-silver-bright"
                    : "text-silver hover:text-silver-bright"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Status & Controls */}
        <div className="flex items-center gap-3.5">
          {/* Backend Connection Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-deep border border-graphite">
            <span className={`w-1.5 h-1.5 rounded-full ${connectionDot}`} />
            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${connectionText}`}>
              {connectionLabel}
            </span>
          </div>

          {/* Authenticated User Status */}
          {user && (
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-sm bg-deep border border-gold/40 font-mono text-xs">
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                {user.displayName}
              </span>
              <button
                onClick={() => logout()}
                title="Sign out of session"
                className="p-0.5 text-silver-dark hover:text-danger transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={auction.soundEnabled ? "Mute audio" : "Unmute audio"}
            className="p-1.5 text-silver-dark hover:text-silver-bright transition-colors"
            title={auction.soundEnabled ? "Audio On" : "Audio Off"}
          >
            {auction.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-gold" />
            ) : (
              <VolumeX className="w-4 h-4 text-silver-dark" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-silver hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-deep hairline-b px-4 py-4 space-y-3 font-mono">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-xs font-bold tracking-widest py-2 px-2 rounded-sm ${
                  isActive ? "bg-charcoal text-gold" : "text-silver hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className={`text-[10px] font-bold ${connectionText}`}>
              ● {connectionLabel}
            </span>

            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-danger flex items-center gap-1 text-[11px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SIGN OUT ({user.displayName})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
