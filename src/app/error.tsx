"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception for debugging
    console.error("Application Render Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-void text-silver-bright flex flex-col items-center justify-center p-6 bg-tech-grid font-mono relative select-none">
      <div className="max-w-md w-full bg-charcoal border border-red/40 rounded-md p-6 sm:p-8 space-y-6 shadow-2xl relative z-10 text-center">
        <div className="w-12 h-12 rounded-sm bg-red/10 border border-red/40 text-red flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-red uppercase tracking-[0.25em] block">
            SYSTEM EXCEPTION // RUNTIME ERROR
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-silver-bright uppercase">
            TEMPORARY FAULT DETECTED
          </h2>
          <p className="text-xs text-silver-muted font-sans pt-1">
            The broadcast terminal encountered an unexpected execution state. No auction data was corrupted.
          </p>
        </div>

        <div className="p-3 bg-black/50 border border-white/[0.06] rounded text-left overflow-hidden">
          <p className="text-[11px] text-red/90 truncate">
            {error.message || "An unexpected error occurred during rendering."}
          </p>
          {error.digest && (
            <p className="text-[10px] text-silver-dark mt-1">
              DIGEST ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="gold"
            size="md"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => reset()}
          >
            <RefreshCw className="w-4 h-4" />
            RELOAD STAGE
          </Button>

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
