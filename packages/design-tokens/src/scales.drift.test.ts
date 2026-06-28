/**
 * Scale drift tests - extends the DRY single-source-of-truth guarantee from
 * colours (tokens.drift.test.ts) to every remaining token scale.
 *
 * tokens.json is canonical; the .ts modules are a typed projection. If any
 * scale diverges, consumers can silently drift. These tests fail the build the
 * moment json and ts disagree (DDIA: reliability via automated checks).
 *
 * Note: tokens.json stores all values as strings (DTCG format). z-index.ts
 * uses numbers, so that scale is compared with string coercion.
 */
import { describe, it, expect } from 'vitest';
import tokens from './tokens.json';
import { typography } from './typography';
import { spacing } from './spacing';
import { radii } from './radii';
import { shadows } from './shadows';
import { breakpoints } from './breakpoints';
import { zIndex } from './z-index';
import { motion } from './motion';

const t = tokens as any;

describe('tokens.json <-> .ts scale parity (DRY)', () => {
  it('typography (font family/size/weight/lineHeight) matches', () => {
    expect(t.font.family).toEqual(typography.fontFamily);
    expect(t.font.size).toEqual(typography.fontSize);
    expect(t.font.weight).toEqual(typography.fontWeight);
    expect(t.font.lineHeight).toEqual(typography.lineHeight);
  });

  it('spacing scale matches', () => {
    expect(t.space).toEqual(spacing);
  });

  it('radius scale matches', () => {
    expect(t.radius).toEqual(radii);
  });

  it('shadow scale matches', () => {
    expect(t.shadow).toEqual(shadows);
  });

  it('breakpoint scale matches', () => {
    expect(t.breakpoint).toEqual(breakpoints);
  });

  it('z-index scale matches (json strings vs ts numbers)', () => {
    const zAsString = Object.fromEntries(
      Object.entries(zIndex).map(([k, v]) => [k, String(v)]),
    );
    expect(t.z).toEqual(zAsString);
  });

  it('motion (duration/easing) matches', () => {
    expect(t.motion.duration).toEqual(motion.duration);
    expect(t.motion.easing).toEqual(motion.easing);
  });
});
