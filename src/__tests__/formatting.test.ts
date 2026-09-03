import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatLakhs,
  formatLakhsShort,
  formatTimer,
  formatTimestamp,
} from "../lib/formatting";

describe("Financial Currency Formatting", () => {
  it("should format zero Lakhs properly", () => {
    assert.equal(formatLakhs(0), "₹0 L");
    assert.equal(formatLakhsShort(0), "₹0");
  });

  it("should format amounts below 1 Crore in Lakhs", () => {
    assert.equal(formatLakhs(30), "₹30 L");
    assert.equal(formatLakhs(75), "₹75 L");
    assert.equal(formatLakhsShort(30), "₹30L");
    assert.equal(formatLakhsShort(75), "₹75L");
  });

  it("should format amounts at or above 1 Crore into Crores with two decimals", () => {
    assert.equal(formatLakhs(100), "₹1.00 Cr");
    assert.equal(formatLakhs(250), "₹2.50 Cr");
    assert.equal(formatLakhs(12500), "₹125.00 Cr");
  });

  it("should format compact short representation cleanly", () => {
    assert.equal(formatLakhsShort(100), "₹1 Cr");
    assert.equal(formatLakhsShort(250), "₹2.5 Cr");
    assert.equal(formatLakhsShort(12500), "₹125 Cr");
  });
});

describe("Timer and Timestamp Formatting", () => {
  it("should format seconds into mm:ss format", () => {
    assert.equal(formatTimer(0), "00:00");
    assert.equal(formatTimer(20), "00:20");
    assert.equal(formatTimer(60), "01:00");
    assert.equal(formatTimer(75), "01:15");
    assert.equal(formatTimer(-5), "00:00");
  });

  it("should format timestamps into a non-empty time string", () => {
    const formatted = formatTimestamp(Date.now());
    assert.ok(formatted.length > 0);
    assert.match(formatted, /\d/);
  });
});
