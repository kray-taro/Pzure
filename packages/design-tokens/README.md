# @pzure/design-tokens

Design tokens as code for Pzure, per **ADR-026** and `DOCS/Modules/Module_10` (sections 5, 12).

## Rule

**Semantic tokens only. No raw hex in components.** Components and the Tailwind
theme must reference semantic tokens (for example `status.danger`,
`clinical.critical`, `finance.unpaid`) rather than literal colours. Raw palette
hex values live only in `colors.ts` (the primitive palette) and are mapped into
semantic tokens; components never import the palette directly.

## Files

| File | Contents |
| --- | --- |
| `src/tokens.json` | Canonical token source of truth (JSON) |
| `src/colors.ts` | Primitive palette + semantic colour groups |
| `src/typography.ts` | Font families, sizes, weights, line heights |
| `src/spacing.ts` | 4px/8px spacing scale |
| `src/radii.ts` | Border radii |
| `src/shadows.ts` | Elevation shadows |
| `src/breakpoints.ts` | Responsive + POS/kiosk breakpoints |
| `src/z-index.ts` | Stacking order |
| `src/motion.ts` | Durations and easings |
| `src/touch.ts` | Touch targets (min 48px, POS button/keypad 64px) |
| `src/layout.ts` | Shell layout dimensions |
| `src/tailwind-preset.ts` | Tailwind preset that consumes the tokens |

## Semantic colour groups

`status`, `clinical`, `finance`, `inventory`, `claims`, `sync`.

## Usage (Tailwind)

```ts
// tailwind.config.ts
import preset from '@pzure/design-tokens/tailwind';

export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
};
```

Then in components, use semantic classes only, e.g. `text-status-danger`,
`bg-finance-unpaid`, `ring-border-focus`, `min-h-touch-targetMin`.
