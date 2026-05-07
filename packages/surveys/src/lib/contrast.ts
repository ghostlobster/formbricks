/** WCAG 2.1 relative luminance and contrast ratio utilities. */

function toLinear(channel: number): number {
  const sRGB = channel / 255;
  return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/**
 * Returns the WCAG contrast ratio between two hex colors (1–21).
 * Returns null if either hex value is invalid.
 */
export function getContrastRatio(hex1: string, hex2: string): number | null {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  if (!c1 || !c2) return null;
  const L1 = getRelativeLuminance(c1.r, c1.g, c1.b);
  const L2 = getRelativeLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Returns true if the two colors meet WCAG AA for normal text (contrast ≥ 4.5:1). */
export function meetsWcagAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= 4.5;
}

/** Returns true if the two colors meet WCAG AA for large text / UI components (contrast ≥ 3:1). */
export function meetsWcagAALarge(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= 3;
}
