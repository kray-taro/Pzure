/** Elevation shadow tokens. */
export const shadows = {
  card: '0 1px 2px 0 rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.10)',
  modal: '0 10px 15px -3px rgba(15, 23, 42, 0.10), 0 4px 6px -4px rgba(15, 23, 42, 0.10)',
  drawer: '-8px 0 24px -4px rgba(15, 23, 42, 0.15)',
  focus: '0 0 0 3px rgba(37, 99, 235, 0.45)',
} as const;

export type Shadows = typeof shadows;
