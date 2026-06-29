# ADR-026: Frontend Framework & Design System

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Frontend Lead

> Closes D-005 and seeds Module 10 ([#11](https://gitlab.com/cricketaustin-group/Pzure/-/issues/11)). Detailed scope in `DOCS/Modules/Module_10 - Frontend Framework ...md`.

## 1. Context

The system is component-, workflow-, and design-system-heavy across POS, pharmacy, EMR, lab, claims, reporting and communication. "ViteJS" in the Master Plan vs "React + Vite" in ADRs needed reconciling.

## 4. Decision Outcome

**Chosen:** React SPA built with Vite.

| Layer | Choice |
| --- | --- |
| Build | Vite |
| Framework | React + TypeScript |
| Styling | Tailwind CSS with formal design tokens |
| Primitives | Radix UI |
| Component library | Internal healthcare design system |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query |
| Local state | Zustand or Redux Toolkit |
| Routing | React Router |
| Tables | TanStack Table (AG Grid if advanced reporting needed) |
| Charts | One approved charting library |
| PWA/offline | Workbox / Vite PWA |
| Docs | Storybook + Figma |
| Testing | Vitest, Testing Library, Playwright |

## 5. Structure & rules

- Monorepo: `apps/*` shells (web-admin, web-pos, web-clinic, web-pharmacy, web-lab, web-claims, web-portal) + `packages/*` (ui, design-tokens, icons, forms, data-grid, charts, auth-client, api-client, offline-client, feature-flags).
- Semantic tokens only (no raw hex); **POS gets its own touch-first shell**, not the admin layout.
- Accessibility (WCAG AA), responsive breakpoints incl. POS/kiosk, print/label templates, and status language are part of the design system.

## 6. Consequences

Frontend squad runs continuously from Sprint 3; backlog tracked as Frontend F1–F6 child issues under Module 10.
