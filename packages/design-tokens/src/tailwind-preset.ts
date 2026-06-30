/**
 * Tailwind preset that consumes @pzure/design-tokens.
 *
 * The Tailwind theme is built ENTIRELY from the token modules - no colours or
 * dimensions are hard-coded here. App shells extend this preset so every
 * utility class maps to a semantic token (ADR-026: no raw hex in components).
 */
import { colors } from './colors.js';
import { typography } from './typography.js';
import { spacing } from './spacing.js';
import { radii } from './radii.js';
import { shadows } from './shadows.js';
import { breakpoints } from './breakpoints.js';
import { zIndex } from './z-index.js';
import { motion } from './motion.js';
import { touch } from './touch.js';
import { layout } from './layout.js';

const screens = Object.fromEntries(
  Object.entries(breakpoints).map(([k, v]) => [k, { min: v }]),
);

const zIndexStr = Object.fromEntries(
  Object.entries(zIndex).map(([k, v]) => [k, String(v)]),
);

const preset = {
  theme: {
    screens,
    extend: {
      colors,
      fontFamily: {
        sans: typography.fontFamily.sans.split(','),
        mono: typography.fontFamily.mono.split(','),
      },
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      spacing: { ...spacing, ...touch, ...layout },
      borderRadius: radii,
      boxShadow: shadows,
      zIndex: zIndexStr,
      transitionDuration: motion.duration,
      transitionTimingFunction: motion.easing,
      minHeight: { 'touch-targetMin': touch.targetMin, 'pos-button': touch.posButtonHeight },
      minWidth: { 'touch-targetMin': touch.targetMin },
    },
  },
} as const;

export default preset;
