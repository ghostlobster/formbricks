import { describe, expect, it } from "vitest";
import { getContrastRatio, meetsWcagAA, meetsWcagAALarge } from "./contrast";

describe("getContrastRatio", () => {
  it("returns 21 for black on white (maximum contrast)", () => {
    const ratio = getContrastRatio("#000000", "#ffffff");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("returns 21 for white on black (symmetrical)", () => {
    const ratio = getContrastRatio("#ffffff", "#000000");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("returns 1 for identical colors (minimum contrast)", () => {
    const ratio = getContrastRatio("#ff0000", "#ff0000");
    expect(ratio).toBeCloseTo(1, 1);
  });

  it("returns null for invalid hex values", () => {
    expect(getContrastRatio("invalid", "#ffffff")).toBeNull();
    expect(getContrastRatio("#ffffff", "notahex")).toBeNull();
    expect(getContrastRatio("#fff", "#000")).toBeNull(); // 3-char hex not supported
  });

  it("returns a value between 1 and 21 for valid hex pair", () => {
    const ratio = getContrastRatio("#0066cc", "#ffffff");
    expect(ratio).not.toBeNull();
    expect(ratio!).toBeGreaterThanOrEqual(1);
    expect(ratio!).toBeLessThanOrEqual(21);
  });

  it("handles colors without '#' prefix", () => {
    const ratio = getContrastRatio("000000", "ffffff");
    expect(ratio).toBeCloseTo(21, 0);
  });
});

describe("meetsWcagAA", () => {
  it("returns true for black on white (21:1)", () => {
    expect(meetsWcagAA("#000000", "#ffffff")).toBe(true);
  });

  it("returns true for dark text on light background meeting 4.5:1", () => {
    // #595959 on #ffffff ≈ 7:1 — passes AA
    expect(meetsWcagAA("#595959", "#ffffff")).toBe(true);
  });

  it("returns false for light grey text that fails 4.5:1", () => {
    // #aaaaaa on #ffffff ≈ 2.3:1 — fails AA
    expect(meetsWcagAA("#aaaaaa", "#ffffff")).toBe(false);
  });

  it("returns false for invalid hex", () => {
    expect(meetsWcagAA("invalid", "#ffffff")).toBe(false);
  });
});

describe("meetsWcagAALarge", () => {
  it("returns true for colors meeting 3:1 threshold", () => {
    // #767676 on #ffffff ≈ 4.5:1 — passes large text AA
    expect(meetsWcagAALarge("#767676", "#ffffff")).toBe(true);
  });

  it("returns false for colors failing 3:1 threshold", () => {
    // Very light grey on white — fails both
    expect(meetsWcagAALarge("#dddddd", "#ffffff")).toBe(false);
  });
});
