/**
 * Colour tokens.
 *
 * `palette` holds the only raw hex values in the system (the primitive scale).
 * Components MUST NOT import `palette` directly. Use the semantic groups
 * (status, clinical, finance, inventory, claims, sync) or the role tokens
 * (bg, text, border) below. ADR-026: semantic tokens only, no raw hex in components.
 */

export const palette = {
  white: '#ffffff',
  black: '#000000',
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    500: '#64748b',
    600: '#475569',
    900: '#0f172a',
  },
  green: { 600: '#16a34a', 700: '#15803d' },
  amber: { 600: '#d97706', 700: '#b45309' },
  red: { 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b' },
  blue: { 600: '#2563eb' },
  indigo: { 600: '#4f46e5' },
  purple: { 700: '#7e22ce' },
} as const;

export const bg = {
  default: palette.slate[50],
  surface: palette.white,
  muted: palette.slate[100],
  inverse: palette.slate[900],
} as const;

export const text = {
  default: palette.slate[900],
  muted: palette.slate[600],
  inverse: palette.white,
} as const;

export const border = {
  default: palette.slate[200],
  focus: palette.blue[600],
  danger: palette.red[600],
} as const;

export const status = {
  success: palette.green[600],
  warning: palette.amber[600],
  danger: palette.red[600],
  info: palette.blue[600],
  neutral: palette.slate[500],
} as const;

export const clinical = {
  critical: palette.red[700],
  warning: palette.amber[700],
  normal: palette.green[700],
  sensitive: palette.purple[700],
} as const;

export const finance = {
  paid: palette.green[600],
  unpaid: palette.amber[600],
  refunded: palette.blue[600],
  credit: palette.indigo[600],
} as const;

export const inventory = {
  available: palette.green[600],
  low: palette.amber[600],
  expired: palette.red[700],
  quarantined: palette.purple[700],
  recalled: palette.red[800],
} as const;

export const claims = {
  draft: palette.slate[500],
  ready: palette.blue[600],
  submitted: palette.indigo[600],
  rejected: palette.red[600],
  paid: palette.green[600],
} as const;

export const sync = {
  online: palette.green[600],
  offline: palette.slate[500],
  queued: palette.amber[600],
  conflict: palette.red[600],
} as const;

export const colors = {
  bg,
  text,
  border,
  status,
  clinical,
  finance,
  inventory,
  claims,
  sync,
} as const;

export type Colors = typeof colors;
