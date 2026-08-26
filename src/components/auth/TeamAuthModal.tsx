"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { useAuth } from "../../lib/auth/AuthContext";
import { INITIAL_FRANCHISES } from "../../data/franchises";
import { Button } from "../ui/Button";
import { Lock, Check } from "lucide-react";

interface TeamAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TeamAuthModal({ isOpen, onClose, onSuccess }: TeamAuthModalProps) {
  const { loginAsTeam } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("team-01");
  const [passcode, setPasscode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedTeam = INITIAL_FRANCHISES.find((f) => f.id === selectedTeamId) || INITIAL_FRANCHISES[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAsTeam(selectedTeamId, passcode);
    setLoading(false);

    if (res.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(res.message || "Authentication failed.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CAPTAIN TERMINAL AUTHENTICATION"
      subtitle="Select your allocated franchise and enter team security credentials"
      maxWidth="lg"
    >
      <form onSubmit={handleLogin} className="space-y-5 font-mono text-xs select-none">
        {/* Select Team Grid */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-silver-dark block">
            SELECT FRANCHISE IDENTITY
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {INITIAL_FRANCHISES.map((team) => {
              const isSelected = selectedTeamId === team.id;
              return (
                <button
                  type="button"
                  key={team.id}
                  onClick={() => {
                    setSelectedTeamId(team.id);
                    setError(null);
                  }}
                  className={`p-2.5 rounded-sm border text-left flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-deep border-gold text-gold"
                      : "bg-deep/60 border-graphite text-silver hover:border-silver-dark"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className="w-5 h-5 rounded-xs flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                      style={{ backgroundColor: team.primaryColor }}
                    >
                      {team.shortName}
                    </span>
                    <span className="font-bold text-silver-bright truncate text-[11px]">
                      {team.shortName}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Passcode Entry */}
        <div className="p-4 bg-deep border border-graphite rounded-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-silver">
              Authenticating as: <strong className="text-silver-bright">{selectedTeam.name}</strong>
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-silver-dark uppercase tracking-wider block">
              Team Passcode (e.g. {selectedTeam.shortName.toLowerCase()}2026 or ipl2026):
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-silver-dark absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={`Enter ${selectedTeam.shortName} passcode...`}
                className="w-full pl-8 pr-3 py-2 rounded-sm bg-charcoal border border-graphite text-silver-bright placeholder:text-silver-dark focus:outline-none focus:border-gold font-mono text-xs"
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
            ACCESS TERMINAL
          </Button>
        </div>
      </form>
    </Modal>
  );
}
