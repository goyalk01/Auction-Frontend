"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { useAuth } from "../../lib/auth/AuthContext";
import { Button } from "../ui/Button";
import { Lock, Scale } from "lucide-react";

interface JudgeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function JudgeAuthModal({ isOpen, onClose, onSuccess }: JudgeAuthModalProps) {
  const { loginAsJudge } = useAuth();
  const [passcode, setPasscode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAsJudge(passcode);
    setLoading(false);

    if (res.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(res.message || "Invalid judicial credentials.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EXECUTIVE BOARD JUDICIAL AUTHENTICATION"
      subtitle="Squad review, compliance verification, and evaluation matrix"
      maxWidth="md"
    >
      <form onSubmit={handleLogin} className="space-y-5 font-mono text-xs select-none">
        <div className="p-4 bg-deep border border-graphite rounded-sm space-y-3">
          <div className="flex items-center gap-2 text-info">
            <Scale className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              EXECUTIVE BOARD MODERATORS ONLY
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-silver-dark uppercase tracking-wider block">
              Judge Security Key (e.g. judge2026 or eb2026):
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-silver-dark absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter judicial access key..."
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
          <Button variant="info" size="md" isLoading={loading} type="submit">
            ACCESS MATRIX
          </Button>
        </div>
      </form>
    </Modal>
  );
}
