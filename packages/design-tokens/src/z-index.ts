/** Stacking order tokens. Offline banner sits above all other layers. */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  drawer: 1200,
  modal: 1300,
  toast: 1400,
  offlineBanner: 1500,
} as const;

export type ZIndex = typeof zIndex;
