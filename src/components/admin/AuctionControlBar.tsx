"use client";

import React, { useState } from "react";
import { useAuction } from "../../lib/store/useAuction";
import { Button } from "../ui/Button";
import { ManualBidModal } from "./ManualBidModal";
import { formatLakhs } from "../../lib/formatting";

export function AuctionControlBar() {
  const {
    auction,
    currentPlayer,
    leadingTeam,
    startAuction,
    pauseAuction,
    resetTimer,
    markSold,
    markUnsold,
    nextPlayer,
    undoLastBid,
    exportState,
    importState,
  } = useAuction();

  const [manualBidOpen, setManualBidOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isLive = auction.status === "LIVE";
  const hasCurrentBid = auction.currentBid > 0 && auction.leadingTeamId !== null;

  const handleExportBackup = () => {
    try {
      const dataStr = exportState();
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vitbmun_auction_backup_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export tournament state.");
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      const confirmed = window.confirm(
        "RESTORE BACKUP:\n\nAre you sure you want to overwrite current live tournament data with this backup file?"
      );
      if (confirmed) {
        const res = await importState(content);
        if (res.success) {
          alert("Tournament state successfully restored from backup.");
        } else {
          alert(`Restore failed: ${res.message || "Invalid JSON structure."}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleHammerSold = () => {
    if (!currentPlayer || !hasCurrentBid) return;
    const teamName = leadingTeam ? leadingTeam.franchise.name : "Leading Team";
    const bidFormatted = formatLakhs(auction.currentBid);
    const confirmed = window.confirm(
      `CONFIRM HAMMER SOLD:\n\nSell Lot #${currentPlayer.id.replace("p-", "")} (${currentPlayer.name}) to ${teamName} for ${bidFormatted}?`
    );
    if (confirmed) {
      markSold();
    }
  };

  const handleMarkUnsold = () => {
    if (!currentPlayer) return;
    const confirmed = window.confirm(
      `CONFIRM UNSOLD:\n\nMark Lot #${currentPlayer.id.replace("p-", "")} (${currentPlayer.name}) as UNSOLD for this round?`
    );
    if (confirmed) {
      markUnsold();
    }
  };

  const handleUndoBid = () => {
    if (auction.recentBids.length === 0) return;
    const lastBid = auction.recentBids[0];
    const confirmed = window.confirm(
      `CONFIRM REVOKE BID:\n\nRevoke latest bid of ${formatLakhs(lastBid.amount)} from ${lastBid.teamName}?`
    );
    if (confirmed) {
      undoLastBid();
    }
  };

  return (
    <>
      <div className="p-5 bg-charcoal border border-white/[0.08] rounded-md space-y-4 select-none">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold text-silver-light uppercase tracking-[0.2em]">
              OPERATIONS {"//"} AUCTIONEER GAVEL DESK
            </span>
            <div className="flex items-center gap-2 sm:ml-4">
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-2 py-0.5 rounded-xs bg-black/40 border border-white/10 text-[10px] text-silver-light hover:text-gold hover:border-gold/30 font-mono transition-colors"
                title="Download full tournament JSON backup"
              >
                EXPORT BACKUP
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-0.5 rounded-xs bg-black/40 border border-white/10 text-[10px] text-silver-light hover:text-gold hover:border-gold/30 font-mono transition-colors"
                title="Restore tournament from JSON backup"
              >
                RESTORE BACKUP
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-silver-dark">
              CLOCK: <strong className="text-silver-bright">{auction.timer}S</strong>
            </span>
            <button
              onClick={() => resetTimer(20)}
              className="px-2 py-0.5 rounded-sm bg-deep border border-graphite text-silver hover:text-white text-[11px] font-bold"
            >
              RESET 20S
            </button>
          </div>
        </div>

        {/* Primary Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Start / Pause */}
          {isLive ? (
            <Button
              variant="secondary"
              size="md"
              onClick={pauseAuction}
            >
              PAUSE
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={startAuction}
              disabled={!currentPlayer}
            >
              START CLOCK
            </Button>
          )}

          {/* Mark SOLD with confirmation */}
          <Button
            variant="gold"
            size="md"
            onClick={handleHammerSold}
            disabled={!hasCurrentBid || !currentPlayer}
            title={hasCurrentBid ? `Sell to ${leadingTeam?.franchise.name}` : "Requires at least 1 bid"}
          >
            HAMMER SOLD
          </Button>

          {/* Mark UNSOLD with confirmation */}
          <Button
            variant="danger"
            size="md"
            onClick={handleMarkUnsold}
            disabled={!currentPlayer}
          >
            MARK UNSOLD
          </Button>

          {/* Proxy Bid */}
          <Button
            variant="secondary"
            size="md"
            onClick={() => setManualBidOpen(true)}
            disabled={!currentPlayer}
          >
            PROXY BID
          </Button>

          {/* Undo Bid with confirmation */}
          <Button
            variant="outline"
            size="md"
            onClick={handleUndoBid}
            disabled={auction.recentBids.length === 0}
          >
            UNDO BID
          </Button>

          {/* Next Lot */}
          <Button
            variant="secondary"
            size="md"
            onClick={nextPlayer}
          >
            NEXT LOT →
          </Button>
        </div>
      </div>

      <ManualBidModal
        isOpen={manualBidOpen}
        onClose={() => setManualBidOpen(false)}
      />
    </>
  );
}
