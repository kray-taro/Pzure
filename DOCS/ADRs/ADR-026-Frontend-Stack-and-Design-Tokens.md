# ADR-026: Frontend Stack & Design Tokens

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Frontend Lead / Design System

> Closes D-005. Owning umbrella: [#11](https://gitlab.com/cricketaustin-group/Pzure/-/issues/11) Module 10. Delivery work item: [#57](https://gitlab.com/cricketaustin-group/Pzure/-/issues/57) F1. Source of truth: `DOCS/Modules/Module_10` (sections 1-3, 5, 12, 21).

## 1. Context and Problem Statement

Pzure is a component-heavy, workflow-heavy, design-system-heavy clinic-pharmacy-retail platform spanning admin, POS, pharmacy, EMR, lab, claims, reporting and communication shells. The frontend stack, state/data layer, and the design-token foundation must be locked before full UI build so every shell shares one safety, speed, compliance and consistency layer. Vite is a build tool only; it does not define framework, routing, forms, state or design system, so a deliberate decision is required.

## 2. Decision Drivers

- Enterprise ecosystem for complex forms, data grids, offline/PWA and healthcare admin screens.
- A dedicated, touch-optimised POS shell distinct from admin CRUD.
- Semantic design tokens as code (not just Figma styles) so the Tailwind theme and components consume them with **no raw hex in components**.
- Long-term hiring, supportability and accessibility (WCAG AA).
- Shared tokens/components across shells, with workflow-specific layouts.

## 3. Considered Options

1. **Vite + React + TypeScript** with Tailwind + Radix + internal design system.
2. Vue - viable but smaller enterprise healthcare ecosystem; fewer mature headless component/data-grid combinations.
3. Svelte - excellent DX but higher hiring/support risk for a large internal enterprise team.
4. Framework-neutral Vite only - insufficient; defines no component/routing/forms/state/design-system architecture.
5. Pure MUI - valid accessible fallback, but Material Design as the base visual language reduces control for POS, labels and dense clinical screens.

## 4. Decision Outcome

**Chosen (Approved):** `Vite + React + TypeScript` with Tailwind + Radix and an internal healthcare design system. Full stack:

| Decision | Choice |
| --- | --- |
| Framework | React + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS (theme consumes design tokens) |
| Primitives | Radix UI |
| Component library | Internal health design system (shadcn-style patterns) |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query |
| Local/global state | Zustand or Redux Toolkit |
| Routing | React Router |
| Tables/grids | TanStack Table for custom tables; AG Grid only for advanced enterprise reporting |
| Charts | One approved charting library |
| PWA/offline | Vite-PWA / Workbox-style architecture (ties to ADR-006/008/009) |
| Storybook | Required |
| Testing | Vitest + Testing Library + Playwright (+ Axe a11y) |
| Design source | Figma + docs + **code tokens** |
| Layout | Dedicated touch-optimised POS shell; responsive app shells per workflow |

### Design tokens (as code)

Ship `packages/design-tokens` with: `tokens.json`, `colors.ts`, `typography.ts`, `spacing.ts`, `radii.ts`, `shadows.ts`, `breakpoints.ts`, `z-index.ts`, `motion.ts`.

**Rule:** semantic tokens only - components never use raw hex. Required semantic colour groups:

- `status` (success, warning, danger, info, neutral)
- `clinical` (critical, warning, normal, sensitive)
- `finance` (paid, unpaid, refunded, credit)
- `inventory` (available, low, expired, quarantined, recalled)
- `claims` (draft, ready, submitted, rejected, paid)
- `sync` (online, offline, queued, conflict)

Plus `touch` (`target.min` 48px, `posButton` 64px, `keypad` 64px) and `layout` (sidebar/header/cart dimensions). Statuses are represented as machine code + display label + semantic colour.

## 4a. Monorepo layout

The frontend is a monorepo:

- `apps/*` shells: `web-admin`, `web-pos`, `web-clinic`, `web-pharmacy`, `web-lab`, `web-claims`, `web-portal`.
- `packages/*`: `ui`, `design-tokens`, `icons`, `forms`, `data-grid`, `charts`, `auth-client`, `api-client`, `offline-client`, `feature-flags`.

Each shell owns its workflow-specific layout; shared behaviour lives in `packages/*` so it is defined once (DRY) and consumed everywhere. The POS shell (`web-pos`) is touch-first and never reuses the admin layout.

## 5. Consequences

One shared token/component layer enforces consistency and accessibility across shells while each shell keeps a workflow-specific, device-appropriate layout. POS stays touch- and keyboard-first and is not polluted by admin forms. Banning raw hex makes theming, dark mode and clinical/finance state colours centrally governed. Cost: discipline to keep tokens authoritative and to route all colour/spacing through tokens; AG Grid only where justified to limit bundle size.

## 6. Implementation Notes

- `packages/design-tokens` is the source of truth; the Tailwind theme (`theme.extend`) imports the token modules - no colours defined inline in `tailwind.config`.
- Lint/CI guard to reject raw hex in component source (semantic-tokens-only rule).
- Token consumers: `packages/ui`, all app shells; see Module 10 section 3 monorepo layout.
- Touch targets enforce 48px minimum (POS larger) per Module 10 section 12 and ADR-018.
- Offline/PWA token (`sync.*`, `z.offlineBanner`) aligns with ADR-006/008/009.
