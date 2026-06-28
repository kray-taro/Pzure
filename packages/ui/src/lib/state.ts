/**
 * The canonical set of UI states every Pzure component must be able to render.
 * Mirrors the required Storybook story matrix so stories and components cannot
 * drift apart (Module_10 story states).
 */
export const UI_STATES = [
  'default',
  'loading',
  'empty',
  'error',
  'disabled',
  'permission-denied',
  'offline',
  'high-risk',
  'touch',
  'keyboard',
] as const;

export type UiState = (typeof UI_STATES)[number];
