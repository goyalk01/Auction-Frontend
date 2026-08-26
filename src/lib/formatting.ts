import { AUCTION_CONSTANTS } from "./constants";

/**
 * Formats Lakhs into standard Indian currency representation:
 * e.g., 10000 -> "₹100.00 Cr", 150 -> "₹1.50 Cr", 40 -> "₹40 L"
 */
export function formatLakhs(lakhs: number): string {
  if (lakhs === 0) return "₹0 L";
  
  if (lakhs >= AUCTION_CONSTANTS.CR_IN_LAKHS) {
    const crValue = lakhs / AUCTION_CONSTANTS.CR_IN_LAKHS;
    // If it's a clean integer like 100, format as 100.00 Cr
    return `₹${crValue.toFixed(2)} Cr`;
  }
  
  return `₹${lakhs} L`;
}

/**
 * Compact format for badges / compact tickers:
 * e.g. 10000 -> "₹100 Cr", 150 -> "₹1.5 Cr", 40 -> "₹40L"
 */
export function formatLakhsShort(lakhs: number): string {
  if (lakhs === 0) return "₹0";
  
  if (lakhs >= AUCTION_CONSTANTS.CR_IN_LAKHS) {
    const crValue = lakhs / AUCTION_CONSTANTS.CR_IN_LAKHS;
    const formatted = crValue % 1 === 0 ? crValue.toString() : crValue.toFixed(2).replace(/\.?0+$/, "");
    return `₹${formatted} Cr`;
  }
  
  return `₹${lakhs}L`;
}

/**
 * Formats remaining seconds to "00:XX"
 */
export function formatTimer(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Formats a timestamp into human-readable time (e.g., 10:45:22 AM)
 */
export function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
