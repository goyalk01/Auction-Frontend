"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { useAuction } from "../../lib/store/useAuction";
import { formatLakhs, formatLakhsShort } from "../../lib/formatting";
import { getNextBid } from "../../lib/bidding";
import { Button } from "../ui/Button";

interface ManualBidModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManualBidModal({ isOpen, onClose }: ManualBidModalProps) {
  const { teamsList, auction, currentPlayer, placeBid, placeManualBid } = useAuction();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teamsList[0]?.franchise.id || "team-01");
  const [customAmountStr, setCustomAmountStr] = useState<string>("");

  const currentBid = auction.currentBid;
  const basePrice = currentPlayer ? currentPlayer.basePrice : 0;
  const nextIncrementAmount = getNextBid(currentBid, basePrice);

  const handleStandardBid = () => {
    placeBid(selectedTeamId);
    onClose();
  };

  const handleCustomBid = () => {
    const parsedLakhs = parseInt(customAmountStr, 10);
    if (!isNaN(parsedLakhs) && parsedLakhs > currentBid) {
      placeManualBid(selectedTeamId, parsedLakhs);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ADMIN PROXY BID ENTRY"
      subtitle={`Lot #${currentPlayer?.id.replace("p-", "") || "---"} (${currentPlayer?.name})`}
      maxWidth="lg"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Select Franchise */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-silver-dark block">
            SELECT BIDDING FRANCHISE
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {teamsList.map((teamState) => {
              const { franchise, remainingPurse } = teamState;
              const isSelected = selectedTeamId === franchise.id;

              return (
                <button
                  key={franchise.id}
                  onClick={() => setSelectedTeamId(franchise.id)}
                  className={`p-2.5 rounded-sm border text-left flex items-center gap-2 transition-colors ${
                    isSelected
                      ? "bg-deep border-gold text-gold"
                      : "bg-deep/60 border-graphite text-silver hover:border-silver-dark"
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-xs flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                    style={{ backgroundColor: franchise.primaryColor }}
                  >
                    {franchise.shortName}
                  </span>
                  <div className="overflow-hidden">
                    <span className="font-bold text-silver-bright block truncate">
                      {franchise.shortName}
                    </span>
                    <span className="text-[10px] text-silver-dark">
                      {formatLakhsShort(remainingPurse)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Option 1: Standard Tier Bid */}
        <div className="p-3.5 bg-deep border border-graphite rounded-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-silver">Next Tier Bid Amount:</span>
            <span className="text-sm font-bold text-gold">
              {formatLakhs(nextIncrementAmount)}
            </span>
          </div>

          <Button
            variant="gold"
            size="md"
            className="w-full"
            onClick={handleStandardBid}
          >
            SUBMIT BID ({formatLakhs(nextIncrementAmount)})
          </Button>
        </div>

        {/* Option 2: Custom Amount */}
        <div className="p-3.5 bg-deep border border-graphite rounded-sm space-y-2.5">
          <label className="text-silver block">
            Custom Amount (In Lakhs, e.g. 600 for ₹6.00 Cr):
          </label>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={customAmountStr}
              onChange={(e) => setCustomAmountStr(e.target.value)}
              placeholder={`Min ${currentBid + 10} Lakhs`}
              className="flex-1 px-3 py-1.5 rounded-sm bg-charcoal border border-graphite text-silver-bright font-mono text-xs focus:outline-none focus:border-gold"
            />
            <Button
              variant="secondary"
              size="md"
              onClick={handleCustomBid}
              disabled={!customAmountStr || parseInt(customAmountStr, 10) <= currentBid}
            >
              SET BID
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
