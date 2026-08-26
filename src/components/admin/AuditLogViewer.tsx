"use client";

import React from "react";
import { useAuction } from "../../lib/store/useAuction";
import { formatTimestamp } from "../../lib/formatting";

export function AuditLogViewer() {
  const { auditLogs } = useAuction();

  return (
    <div className="p-5 bg-charcoal border border-white/[0.08] rounded-md space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <span className="text-[10px] font-mono font-bold text-silver-light uppercase tracking-[0.2em]">
          AUDIT TRAIL {"//"} SYSTEM ACTIVITY LOG
        </span>
        <span className="text-xs font-mono text-silver-dark">{auditLogs.length} EVENTS</span>
      </div>

      <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-1.5 font-mono text-xs pr-1">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className="p-2 rounded-sm bg-deep border border-graphite flex items-center justify-between gap-4 text-silver"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="text-[9px] font-bold text-gold px-1 py-0.2 border border-gold/40 rounded-xs uppercase shrink-0">
                {log.action}
              </span>
              <span className="text-silver-bright truncate text-[11px]">{log.details}</span>
            </div>

            <span className="text-[10px] text-silver-dark shrink-0">
              {formatTimestamp(log.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
