/**
 * Tailwind preset test - proves ADR-026's central claim: "the Tailwind theme
 * consumes the token package" and contains no inline/hard-coded values.
 *
 * Strategy: every value the preset exposes must be traceable back to a token
 * module. We assert the preset's theme is assembled from the imported tokens
 * (colors, spacing, radii, ...) rather than literals. This converts the
 * previously-asserted MR checkbox into an enforced invariant.
 */
import { describe, it, expect } from 'vitest';
import preset from './tailwind-preset';
import { colors } from './colors';
import { radii } from './radii';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { touch } from './touch';
import { layout } from './layout';
import { breakpoints } from './breakpoints';

const theme = (preset as any).theme;
const extend = theme.extend;

describe('tailwind preset is built from tokens (ADR-026)', () => {
  it('colours come from the semantic token groups, not literals', () => {
    expect(extend.colors).toBe(colors);
  });

  it('border radius comes from the radii token', () => {
    expect(extend.borderRadius).toBe(radii);
  });

  it('box shadow comes from the shadows token', () => {
    expect(extend.boxShadow).toBe(shadows);
  });

  it('spacing merges the spacing, touch and layout tokens', () => {
    for (const k of Object.keys(spacing)) {
      expect(extend.spacing[k]).toBe((spacing as any)[k]);
    }
    for (const k of Object.keys(touch)) {
      expect(extend.spacing[k]).toBe((touch as any)[k]);
    }
    for (const k of Object.keys(layout)) {
      expect(extend.spacing[k]).toBe((layout as any)[k]);
    }
  });

  it('screens are derived from breakpoints (min-width form)', () => {
    for (const [k, v] of Object.entries(breakpoints)) {
      expect(theme.screens[k]).toEqual({ min: v });
    }
  });

  it('touch minimums are exposed for accessibility (>=48px / >=64px)', () => {
    expect(extend.minHeight['touch-targetMin']).toBe(touch.targetMin);
    expect(extend.minHeight['pos-button']).toBe(touch.posButtonHeight);
    expect(extend.minWidth['touch-targetMin']).toBe(touch.targetMin);
  });

  it('contains no raw hex anywhere in the serialised preset', () => {
    // colors resolve to hex via the palette, so exclude the colours subtree and
    // assert the rest of the preset carries no inline hex literal.
    const { colors: _omit, ...rest } = extend;
    const serialised = JSON.stringify({ screens: theme.screens, ...rest });
    expect(serialised).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });
});
