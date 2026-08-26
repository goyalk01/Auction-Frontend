"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { useAuth } from "../../lib/auth/AuthContext";
import { Button } from "../ui/Button";
import { Lock, ShieldAlert } from "lucide-react";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AdminAuthModal({ isOpen, onClose, onSuccess }: AdminAuthModalProps) {
  const { loginAsAdmin } = useAuth();
  const [passcode, setPasscode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAsAdmin(passcode);
    setLoading(false);

    if (res.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(res.message || "Invalid administrator credentials.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EXECUTIVE AUCTIONEER AUTHENTICATION"
      subtitle="Privileged control desk operations access"
      maxWidth="md"
    >
      <form onSubmit={handleLogin} className="space-y-5 font-mono text-xs select-none">
        <div className="p-4 bg-deep border border-graphite rounded-sm space-y-3">
          <div className="flex items-center gap-2 text-gold">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              RESTRICTED TOURNAMENT OFFICIALS ONLY
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-silver-dark uppercase tracking-wider block">
              Admin Security Key (e.g. admin2026 or vitb-ipl-admin):
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-silver-dark absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter administrator security key..."
                className="w-full pl-8 pr-3 py-2 rounded-sm bg-charcoal border border-graphite text-silver-bright placeholder:text-silver-dark focus:outline-none focus:border-gold font-mono text-xs"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-danger font-mono font-bold tracking-wide">
              ⚠ {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" size="md" onClick={onClose} type="button">
            CANCEL
          </Button>
          <Button variant="gold" size="md" isLoading={loading} type="submit">
            AUTHENTICATE DESK
          </Button>
        </div>
      </form>
    </Modal>
  );
}
