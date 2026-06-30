/**
 * Token drift test - the DRY guarantee for the design system.
 *
 * tokens.json is the single source of truth (ADR-026). The .ts modules are a
 * typed projection of it. If the two ever disagree, the design system has two
 * sources of truth and consumers can silently drift. This test fails the build
 * the moment they diverge, so the invariant is enforced (DDIA: reliability via
 * automated checks), not merely asserted in an MR description.
 */
import { tokens } from './tokens.typed';
import { status, clinical, finance, inventory, claims, sync } from './colors';
import { touch } from './touch';
import { layout } from './layout';

// Resolve a {group.shade} alias in tokens.json against the primitive palette
// declared inline here, mirroring colors.ts. Kept deliberately small: if the
// palette grows, this map grows with it (single, obvious place to update).
const palette: Record<string, string> = {
  'white': '#ffffff',
  'black': '#000000',
  'slate.50': '#f8fafc',
  'slate.100': '#f1f5f9',
  'slate.200': '#e2e8f0',
  'slate.500': '#64748b',
  'slate.600': '#475569',
  'slate.900': '#0f172a',
  'green.600': '#16a34a',
  'green.700': '#15803d',
  'amber.600': '#d97706',
  'amber.700': '#b45309',
  'red.600': '#dc2626',
  'red.700': '#b91c1c',
  'red.800': '#991b1b',
  'blue.600': '#2563eb',
  'indigo.600': '#4f46e5',
  'purple.700': '#7e22ce',
};

function resolve(alias: string): string {
  const key = alias.replace(/^\{|\}$/g, '');
  const value = palette[key];
  if (!value) throw new Error(`tokens.json references unknown palette key: ${alias}`);
  return value;
}

function resolveGroup(group: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(group).map(([k, v]) => [k, resolve(v)]),
  );
}

const color = tokens.color;

describe('tokens.json <-> .ts module parity (DRY single source of truth)', () => {
  it('status group matches', () => {
    expect(resolveGroup(color.status)).toEqual(status);
  });
  it('clinical group matches', () => {
    expect(resolveGroup(color.clinical)).toEqual(clinical);
  });
  it('finance group matches', () => {
    expect(resolveGroup(color.finance)).toEqual(finance);
  });
  it('inventory group matches', () => {
    expect(resolveGroup(color.inventory)).toEqual(inventory);
  });
  it('claims group matches', () => {
    expect(resolveGroup(color.claims)).toEqual(claims);
  });
  it('sync group matches', () => {
    expect(resolveGroup(color.sync)).toEqual(sync);
  });
  it('touch tokens match', () => {
    expect(tokens.touch).toEqual(touch);
  });
  it('layout tokens match', () => {
    expect(tokens.layout).toEqual(layout);
  });
});
