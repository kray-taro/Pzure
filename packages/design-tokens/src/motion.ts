/** Motion tokens: durations and easings. */
export const duration = {
  fast: '120ms',
  normal: '200ms',
  slow: '320ms',
} as const;

export const easing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
} as const;

export const motion = { duration, easing } as const;
export type Motion = typeof motion;
