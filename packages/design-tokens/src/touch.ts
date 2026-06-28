/**
 * Touch target tokens. Module 10 section 12 / ADR-018.
 * Minimum target 48px; POS payment buttons and keypad 64px.
 */
export const touch = {
  targetMin: '48px',
  posButtonHeight: '64px',
  posKeypadButton: '64px',
  productTile: '96px',
  cartRow: '48px',
} as const;

export type Touch = typeof touch;
