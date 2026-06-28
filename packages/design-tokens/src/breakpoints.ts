/**
 * Responsive breakpoints (Tailwind-compatible) with product-specific
 * POS and kiosk breakpoints. Module 10 section 6.
 */
export const breakpoints = {
  xs: '360px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  pos: '1024px',
  kiosk: '768px',
} as const;

export type Breakpoints = typeof breakpoints;
