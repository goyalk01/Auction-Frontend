import React from "react";
import Link from "next/link";
import { Compass, Home, Radio } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void text-silver-bright flex flex-col items-center justify-center p-6 bg-tech-grid font-mono relative select-none">
      <div className="max-w-md w-full bg-charcoal border border-gold/30 rounded-md p-6 sm:p-8 space-y-6 shadow-2xl relative z-10 text-center">
        <div className="w-12 h-12 rounded-sm bg-gold/10 border border-gold/40 text-gold flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.25em] block">
            404 // TERMINAL ROUTE NOT FOUND
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-silver-bright uppercase">
            SECTOR UNREACHABLE
          </h2>
          <p className="text-xs text-silver-muted font-sans pt-1">
            The requested operations page does not exist or has been relocated within the auction network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/auction" className="flex-1">
            <Button
              variant="gold"
              size="md"
              className="w-full flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 text-black" />
              LIVE AUCTION
            </Button>
          </Link>

          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              size="md"
              className="w-full flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              HOME
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
