# 1. Architecture decision

For this project, I recommend:

```text
Frontend build tool:
    Vite

Frontend framework:
    React + TypeScript

Styling:
    Tailwind CSS with formal design tokens

Component foundation:
    Radix UI primitives + internal component library

Application UI:
    Custom enterprise health design system

State/data:
    TanStack Query for server state
    Zustand or Redux Toolkit for local/global UI state
    React Hook Form + Zod for forms/validation

Tables/data grids:
    TanStack Table or AG Grid, depending reporting complexity

Design documentation:
    Storybook + Figma design system

POS layout:
    Dedicated touch-optimised POS shell, not reused admin layout
```

Vite is framework-flexible through its plugin model, but the project still needs a deliberate framework decision. React is a strong choice here because the application is component-heavy, workflow-heavy, and design-system-heavy, and React’s own documentation positions it as a UI library for composing components while leaving routing/data choices to the application architecture. Radix UI is suitable as a foundation because it provides unstyled, accessible React primitives for design systems, while Tailwind supports responsive utility variants and adaptive layouts. ([vitejs][1])

---

## 2. Why React over Vue or Svelte for this system

| Option                      | Recommendation                   | Reason                                                                                                                       |
| --------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| React                       | **Choose**                       | Best ecosystem for enterprise component libraries, complex forms, data grids, offline/PWA patterns, healthcare admin screens |
| Vue                         | Viable but not preferred         | Good productivity, but smaller enterprise healthcare ecosystem and fewer mature headless component/data-grid combinations    |
| Svelte                      | Not recommended for this project | Excellent DX, but higher risk for large internal enterprise team and long-term hiring/support                                |
| Framework-neutral Vite only | Insufficient                     | Vite is a build tool; it does not define component architecture, routing, forms, state, or design system                     |

Final decision:

```text
Vite + React + TypeScript
```

---

## 3. Frontend package strategy

Use a monorepo structure:

```text
apps/
  web-admin/
  web-pos/
  web-clinic/
  web-pharmacy/
  web-lab/
  web-claims/
  web-portal/

packages/
  ui/
  design-tokens/
  icons/
  forms/
  data-grid/
  charts/
  auth-client/
  api-client/
  offline-client/
  feature-flags/
```

For MVP, these can still compile into one application with different shells/routes. The package separation prevents POS-specific UX from being polluted by admin forms and reports.

Recommended approach:

```text
One frontend codebase
Multiple app shells
Shared UI library
Shared tokens
Shared auth/session
Shared API client
Feature-level route chunks
```

---

## 4. Design system deliverables

Create a formal document:

```text
/docs/design-system/DESIGN_SYSTEM.md
```

Minimum contents:

| Section                | Required content                                             |
| ---------------------- | ------------------------------------------------------------ |
| Design principles      | Fast, safe, clear, audit-aware, branch-aware                 |
| Brand                  | Logo, facility naming, branch identity                       |
| Colour tokens          | Semantic colours, not random hex values                      |
| Typography             | Font family, sizes, weights, line heights                    |
| Spacing                | 4px/8px scale                                                |
| Breakpoints            | Mobile, tablet, desktop, POS, wide dashboard                 |
| Component library      | Buttons, inputs, modals, tables, cards, tabs                 |
| Form patterns          | Required fields, validation, error states                    |
| Clinical safety states | Allergy, critical lab, controlled medicine, contraindication |
| Financial states       | Paid, unpaid, refunded, credit, eTIMS rejected               |
| Inventory states       | In stock, low stock, expired, quarantined, recalled          |
| Claims states          | Draft, ready, submitted, rejected, paid                      |
| Accessibility          | Keyboard, contrast, focus, screen-reader basics              |
| Touch targets          | POS/tablet-specific minimum sizes                            |
| Empty states           | No stock, no patient, no claim, no result                    |
| Loading states         | Skeletons, spinners, optimistic updates                      |
| Error states           | Retry, offline, validation, permission denied                |
| Offline states         | Queued, unsynced, conflict, stale catalogue                  |
| Data density           | Compact, comfortable, touch mode                             |
| Print layouts          | Receipt, label, lab report, prescription, visit summary      |
| Governance             | How components/tokens are approved and changed               |

---

## 5. Design tokens

Tokens should be stored as code, not just Figma styles.

Recommended files:

```text
packages/design-tokens/
  tokens.json
  colors.ts
  typography.ts
  spacing.ts
  radii.ts
  shadows.ts
  breakpoints.ts
  z-index.ts
  motion.ts
```

## Token categories

| Token group | Examples                                                             |
| ----------- | -------------------------------------------------------------------- |
| Colour      | `color.bg.default`, `color.status.danger`, `color.clinical.critical` |
| Typography  | `font.size.sm`, `font.size.posTotal`, `font.weight.semibold`         |
| Spacing     | `space.1`, `space.2`, `space.4`, `space.8`                           |
| Radius      | `radius.sm`, `radius.md`, `radius.lg`                                |
| Shadow      | `shadow.card`, `shadow.modal`, `shadow.drawer`                       |
| Border      | `border.default`, `border.focus`, `border.danger`                    |
| Z-index     | `z.modal`, `z.toast`, `z.offlineBanner`                              |
| Motion      | `motion.fast`, `motion.normal`                                       |
| Layout      | `sidebar.width`, `pos.cart.width`, `header.height`                   |
| Touch       | `touch.target.min`, `touch.keypad.button`                            |

## Semantic colour tokens

Do not use colours directly in components. Use semantic tokens.

```text
status.success
status.warning
status.danger
status.info
status.neutral

clinical.critical
clinical.warning
clinical.normal
clinical.sensitive

finance.paid
finance.unpaid
finance.refunded
finance.credit

inventory.available
inventory.low
inventory.expired
inventory.quarantined
inventory.recalled

claims.ready
claims.submitted
claims.rejected
claims.paid

sync.online
sync.offline
sync.queued
sync.conflict
```

---

## 6. Responsive breakpoints

Use Tailwind-compatible breakpoints, but define your own product meanings.

Tailwind’s responsive design model applies utilities conditionally by breakpoint, making it suitable for adaptive layouts across screen sizes. ([Tailwind CSS][2])

## Recommended breakpoints

| Token   |   Width | Target                            |
| ------- | ------: | --------------------------------- |
| `xs`    |   360px | Small Android phones              |
| `sm`    |   640px | Large phones                      |
| `md`    |   768px | Tablets portrait                  |
| `lg`    |  1024px | Tablets landscape / small desktop |
| `xl`    |  1280px | Desktop                           |
| `2xl`   |  1536px | Wide desktop                      |
| `pos`   | 1024px+ | Dedicated POS terminal layout     |
| `kiosk` |  768px+ | Tablet/kiosk mode                 |

## Layout rules

| Screen type      | Layout                                          |
| ---------------- | ----------------------------------------------- |
| Phone            | Single-column, limited admin/portal workflows   |
| Tablet portrait  | Queue, triage, stock count, delivery, basic POS |
| Tablet landscape | Pharmacy, lab, compact EMR                      |
| Desktop          | Full admin, claims, reports, EMR                |
| POS terminal     | Dedicated touch layout                          |
| Wide dashboard   | Multi-panel analytics                           |

---

## 7. POS must have its own shell

Do **not** build POS as a normal admin CRUD screen.

## POS layout requirements

POS needs:

| Requirement                  | Reason                                          |
| ---------------------------- | ----------------------------------------------- |
| Touch-first layout           | Cashiers may use touchscreens                   |
| Keyboard-first shortcuts     | Fast checkout with barcode scanner              |
| Barcode focus lock           | Scanner input should always land in item search |
| Large cart area              | Avoid wrong sale lines                          |
| Large payment buttons        | Reduce cashier errors                           |
| Fast patient/customer lookup | Pharmacy/clinic linkage                         |
| Offline indicator            | Branch must know sync state                     |
| eTIMS status indicator       | Tax invoice visibility                          |
| M-Pesa status panel          | Payment confirmation                            |
| Shift status                 | Cashier must know open/closed shift             |
| Manager approval modal       | Discounts, refunds, voids                       |
| Receipt/label printer status | Operational readiness                           |
| Held bills                   | Common in pharmacy/clinic sales                 |
| Prescription blocker         | Restricted medicines cannot bypass pharmacist   |
| Stock warning inline         | Low/out/expired/recalled warning                |

---

## POS screen anatomy

```text
┌──────────────────────────────────────────────────────────┐
│ Branch | Cashier | Shift | Online/Offline | eTIMS | M-Pesa│
├──────────────────────────────────────────────────────────┤
│ Barcode/Search input                                     │
├───────────────────────────────┬──────────────────────────┤
│ Product/service grid          │ Cart                     │
│ - Fast items                   │ - Lines                  │
│ - Categories                   │ - Qty +/-                │
│ - Search results              │ - Discount               │
│                               │ - Tax                    │
│                               │ - Total                  │
├───────────────────────────────┴──────────────────────────┤
│ Cash | M-Pesa STK | Card | Credit | Insurer | Split Pay   │
└──────────────────────────────────────────────────────────┘
```

---

## POS touch target rules

| Element               |        Minimum size |
| --------------------- | ------------------: |
| Primary action button |         56px height |
| Keypad button         |         64px × 64px |
| Product tile          | 96px × 96px minimum |
| Cart row              | 48px height minimum |
| Payment button        |         64px height |
| Modal action          |         56px height |
| Error/alert tap area  |         48px height |

---

## POS keyboard shortcuts

| Shortcut           | Action                                 |
| ------------------ | -------------------------------------- |
| `/`                | Focus search                           |
| `F2`               | Patient/customer lookup                |
| `F3`               | Hold bill                              |
| `F4`               | Retrieve held bill                     |
| `F6`               | Cash payment                           |
| `F7`               | M-Pesa STK                             |
| `F8`               | Card                                   |
| `F9`               | Split payment                          |
| `F10`              | Print/reprint                          |
| `Esc`              | Cancel modal                           |
| `Ctrl + Enter`     | Complete sale                          |
| `Ctrl + Backspace` | Clear search/cart line depending focus |

Scanner input should not require the cashier to click into the search box every time.

---

## 8. App shells

Use different app shells for different workflows.

| Shell               | Use                                                     |
| ------------------- | ------------------------------------------------------- |
| Admin shell         | Organisation, licensing, settings, users                |
| POS shell           | Sales, payments, shifts, receipts                       |
| Pharmacy shell      | Prescription queue, dispensing, labels, controlled meds |
| Clinic shell        | Queue, triage, consult, notes, orders                   |
| Lab shell           | Orders, samples, results, verification                  |
| Claims shell        | Claim workbench, denials, reconciliation                |
| Inventory shell     | PO, GRN, transfers, stock counts                        |
| Reporting shell     | Dashboards, reports, exports                            |
| Communication shell | Consent, templates, messages, campaigns                 |
| Mobile shell        | Stock count, delivery, queue support                    |

Each shell can share common tokens and components but should have workflow-specific navigation.

---

## 9. Component library

## Core components

| Component        | Required variants                                      |
| ---------------- | ------------------------------------------------------ |
| Button           | primary, secondary, danger, ghost, approval, POS large |
| Input            | text, numeric, currency, barcode, search               |
| Select           | single, multi, async                                   |
| Date/time picker | clinic, expiry, appointment, reporting                 |
| Badge            | status, risk, branch, claim, stock                     |
| Alert            | info, warning, high, critical                          |
| Modal            | confirmation, approval, blocking safety                |
| Drawer           | details, cart, patient panel                           |
| Tabs             | module sections                                        |
| Table            | simple, dense, selectable                              |
| Data grid        | reports, claims, inventory                             |
| Card             | dashboard, patient summary                             |
| Toast            | success/error/offline                                  |
| Breadcrumb       | admin workflows                                        |
| Stepper          | claims, pre-auth, PO, GRN                              |
| Timeline         | audit, visit, claim, communication                     |
| File uploader    | documents, prescription, lab attachment                |
| Barcode field    | scanner-aware                                          |
| QR display       | receipts, result verification                          |
| Print preview    | receipt, label, result, summary                        |

---

## Healthcare-specific components

| Component                        | Used in                    |
| -------------------------------- | -------------------------- |
| Patient banner                   | EMR, pharmacy, lab, claims |
| Allergy banner                   | EMR, pharmacy              |
| Medication warning panel         | Pharmacy                   |
| Clinical note editor             | EMR                        |
| Vitals panel                     | EMR                        |
| Diagnosis picker                 | EMR                        |
| Drug picker                      | EMR/pharmacy               |
| Lab test picker                  | EMR/lab                    |
| Sample status badge              | Lab                        |
| Result value input               | Lab                        |
| Claim readiness checklist        | Claims                     |
| Tariff mapping row               | Claims                     |
| Consent status chip              | Communication              |
| Licence status chip              | Organisation               |
| Batch/expiry selector            | Pharmacy/inventory         |
| Controlled medicine register row | Pharmacy                   |
| Recalled batch alert             | Pharmacy/inventory         |
| eTIMS status chip                | POS/accounting             |
| M-Pesa status chip               | POS/billing                |
| Offline sync banner              | All branch shells          |

---

## 10. Component library choice

## Recommended stack

| Layer                     | Choice                                                                            |
| ------------------------- | --------------------------------------------------------------------------------- |
| Framework                 | React + TypeScript                                                                |
| Build                     | Vite                                                                              |
| Styling                   | Tailwind CSS                                                                      |
| Primitives                | Radix UI                                                                          |
| Design-system composition | Internal components, optionally shadcn-style patterns                             |
| Forms                     | React Hook Form + Zod                                                             |
| Server state              | TanStack Query                                                                    |
| Local state               | Zustand or Redux Toolkit                                                          |
| Tables                    | TanStack Table for custom tables; AG Grid if advanced enterprise reporting needed |
| Charts                    | Recharts, ECharts, or similar; choose one                                         |
| Icons                     | Lucide or similar consistent icon set                                             |
| Storybook                 | Required                                                                          |
| Testing                   | Vitest, Testing Library, Playwright                                               |

## Why not pure MUI?

MUI is mature and accessible, but for this product I would avoid making Material Design the base visual language unless the team wants to accept its look and override complexity. MUI can work, but Radix + Tailwind gives more control for POS, pharmacy labels, dense clinical screens, and custom Kenyan branch workflows. MUI does provide a customizable accessible React component library, so it remains a valid fallback if internal team speed is more important than custom design-system control. ([MUI][3])

---

## 11. Design-system repository docs

Add this folder:

```text
docs/
  design-system/
    DESIGN_SYSTEM.md
    UI_ARCHITECTURE.md
    TOKENS.md
    COMPONENT_LIBRARY.md
    RESPONSIVE_LAYOUT.md
    POS_TOUCH_LAYOUT.md
    ACCESSIBILITY.md
    FORMS_AND_VALIDATION.md
    TABLES_AND_GRIDS.md
    STATUS_AND_ALERTS.md
    PRINT_AND_LABELS.md
    UX_WRITING.md
```

---

## 12. Design tokens example

## `tokens.json`

```json
{
  "color": {
    "status": {
      "success": "{green.600}",
      "warning": "{amber.600}",
      "danger": "{red.600}",
      "info": "{blue.600}"
    },
    "clinical": {
      "critical": "{red.700}",
      "warning": "{amber.700}",
      "normal": "{green.700}",
      "sensitive": "{purple.700}"
    },
    "inventory": {
      "available": "{green.600}",
      "low": "{amber.600}",
      "expired": "{red.700}",
      "quarantined": "{purple.700}",
      "recalled": "{red.800}"
    },
    "claims": {
      "draft": "{slate.500}",
      "ready": "{blue.600}",
      "submitted": "{indigo.600}",
      "rejected": "{red.600}",
      "paid": "{green.600}"
    }
  },
  "space": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px"
  },
  "touch": {
    "targetMin": "48px",
    "posButtonHeight": "64px",
    "posKeypadButton": "64px"
  }
}
```

---

## 13. Responsive layout document

## Required rules

| Rule                    | Detail                                          |
| ----------------------- | ----------------------------------------------- |
| Mobile-first            | Base styles for small screens                   |
| POS-specific breakpoint | POS is not just desktop                         |
| Dense mode              | For claims/reports/inventory                    |
| Touch mode              | For POS/tablets/stock count                     |
| Sidebar collapse        | Desktop expanded, tablet compact, mobile hidden |
| Sticky patient banner   | EMR/pharmacy/lab                                |
| Sticky action bar       | Forms and POS                                   |
| Table fallback          | Mobile card view for non-report tables          |
| Large report screens    | Desktop-only export-heavy experience            |
| Offline banner          | Always visible when offline/stale               |

---

## 14. Accessibility requirements

Healthcare systems must be usable under stress.

| Requirement          | Detail                                                   |
| -------------------- | -------------------------------------------------------- |
| Keyboard navigation  | POS, forms, modals, tables                               |
| Focus states         | Clear visible focus                                      |
| Contrast             | Meet WCAG AA target                                      |
| Screen-reader labels | Especially forms/modals                                  |
| Error text           | Not colour-only                                          |
| Required fields      | Clearly marked                                           |
| Touch targets        | 48px minimum, POS larger                                 |
| Modal focus trap     | Required                                                 |
| Toasts               | Important errors must persist or be logged               |
| Alerts               | Critical clinical/stock alerts cannot disappear silently |
| Language             | Prepare for English/Kiswahili labels where needed        |

---

## 15. Form design standards

Forms are central to this system.

## Form rules

| Rule                | Behaviour                                                 |
| ------------------- | --------------------------------------------------------- |
| Required fields     | Clear marker and validation                               |
| Inline validation   | Show before submit where possible                         |
| Server validation   | Always enforced                                           |
| Save draft          | EMR notes, claims, PO, lab results                        |
| Dirty-state warning | Prevent accidental loss                                   |
| Audit reason        | Required for edits after approval/signing                 |
| Approval modal      | PIN/reason where required                                 |
| Field help          | Show examples for licence/tariff/code fields              |
| Masking             | ID/phone/payment fields where appropriate                 |
| Optimistic updates  | Only where safe; not for payments/claims/lab verification |

---

## 16. Status language

All modules should use consistent status terms.

## Examples

| Domain        | Statuses                                                                    |
| ------------- | --------------------------------------------------------------------------- |
| Invoice       | draft, queued, submitted, accepted, rejected, credit-noted                  |
| Payment       | pending, confirmed, failed, reversed, unmatched                             |
| Stock         | available, low, out, expired, quarantined, recalled                         |
| Prescription  | draft, pending review, approved, rejected, dispensed, partially dispensed   |
| Lab           | ordered, collected, rejected, resulted, verified, released                  |
| Claim         | draft, missing info, ready, submitted, rejected, approved, paid, reconciled |
| Communication | scheduled, sent, delivered, failed, opted out                               |
| Sync          | online, offline, queued, syncing, conflict, stale                           |

Statuses should be represented as both:

```text
machine code: accepted
display label: Accepted
semantic colour: status.success
```

---

## 17. Print and label design

The design system must include printable templates, not just screens.

| Print template                      | Required        |
| ----------------------------------- | --------------- |
| 58mm receipt                        | POS             |
| 80mm receipt                        | POS             |
| Pharmacy medicine label             | Dispensing      |
| Lab sample label                    | Lab             |
| Lab result report                   | Lab             |
| Visit summary                       | EMR             |
| Referral letter                     | EMR             |
| Certificate                         | EMR             |
| Claim bundle cover page             | Claims          |
| Controlled medicine register export | Pharmacy        |
| Stock count sheet                   | Inventory       |
| Delivery label                      | Online pharmacy |

Print templates should be versioned and tested on real devices.

---

## 18. UX writing standards

Use clear, safe, non-technical language.

## Examples

Bad:

```text
Error 409: entity conflict
```

Good:

```text
This record was changed on another device. Review the latest version before saving.
```

Bad:

```text
DDI detected
```

Good:

```text
Possible medicine interaction. Pharmacist review is required before dispensing.
```

Bad:

```text
ETIMS failed
```

Good:

```text
Invoice was not accepted by eTIMS. Open the invoice status report for the reason and retry.
```

---

## 19. Storybook requirement

Storybook should be mandatory.

## Storybook structure

```text
stories/
  tokens/
  components/
  forms/
  pos/
  pharmacy/
  emr/
  lab/
  claims/
  reports/
  communication/
  print/
```

Each component story should include:

| Story               |
| ------------------- |
| Default             |
| Loading             |
| Empty               |
| Error               |
| Disabled            |
| Permission denied   |
| Offline             |
| High-risk/critical  |
| Touch mode          |
| Keyboard navigation |

---

## 20. Frontend testing strategy

| Test type         | Tool                              | Scope                           |
| ----------------- | --------------------------------- | ------------------------------- |
| Unit/component    | Vitest + Testing Library          | Components and hooks            |
| Visual regression | Storybook snapshots/tooling       | Design-system stability         |
| E2E               | Playwright                        | POS, EMR, pharmacy, lab, claims |
| Accessibility     | Axe checks                        | Key screens                     |
| Responsive        | Playwright viewports              | Phone/tablet/desktop/POS        |
| Offline/PWA       | Playwright + service worker tests | Queue and sync states           |
| Printer tests     | Manual + device test pack         | Receipts/labels                 |

---

## 21. Frontend ADR content

## ADR-026 should decide

| Decision          | Recommendation                      |
| ----------------- | ----------------------------------- |
| Framework         | React + TypeScript                  |
| Build             | Vite                                |
| Styling           | Tailwind CSS                        |
| Primitives        | Radix UI                            |
| Component library | Internal health design system       |
| Forms             | React Hook Form + Zod               |
| Server state      | TanStack Query                      |
| Local state       | Zustand or Redux Toolkit            |
| Routing           | React Router                        |
| Tables            | TanStack Table / AG Grid decision   |
| Charts            | One approved charting library       |
| PWA/offline       | Workbox/Vite PWA-style architecture |
| Storybook         | Required                            |
| Testing           | Vitest, Testing Library, Playwright |
| Design source     | Figma + docs + code tokens          |

---

## 22. Sprint addition

Add a sprint before full UI build.

## New Sprint: Design System and Frontend Architecture Foundation

### Scope

| Workstream             | Deliverable                             |
| ---------------------- | --------------------------------------- |
| ADR-026                | Framework and design-system decision    |
| Figma foundation       | Tokens, typography, spacing, components |
| Token package          | `packages/design-tokens`                |
| UI package             | `packages/ui`                           |
| Storybook              | Component documentation                 |
| App shells             | Admin, POS, Pharmacy, EMR, Lab, Claims  |
| POS layout prototype   | Touch and keyboard layout               |
| Responsive rules       | Breakpoints and layout docs             |
| Form standards         | Validation, errors, required fields     |
| Status system          | Shared status chips/badges              |
| Print templates        | Receipt/label proof of concept          |
| Accessibility baseline | Focus, contrast, keyboard rules         |
| Testing setup          | Component and E2E baseline              |

### Acceptance criteria

| Test                | Expected result                          |
| ------------------- | ---------------------------------------- |
| ADR-026 approved    | React/Vite/design-system stack confirmed |
| Tokens implemented  | Tailwind/theme uses tokens               |
| Storybook running   | Core components documented               |
| POS prototype       | Touch and keyboard flows demonstrated    |
| Responsive demo     | Mobile/tablet/desktop/POS layouts shown  |
| Form component      | Validation and error states work         |
| Status badge        | Same status style reused across modules  |
| Print proof         | Receipt or label prints correctly        |
| Accessibility check | Keyboard/focus basics pass               |
| UI package imported | App shell uses shared components         |

---

## 23. Final recommendation

Implement the frontend as:

```text
Vite + React + TypeScript
Tailwind CSS with formal tokens
Radix UI primitives
Internal healthcare design system
Storybook documentation
Dedicated POS shell
Responsive app shells per workflow
Touch-optimised POS and tablet layouts
Keyboard-first cashier and data-entry flows
Strict accessibility and status-language standards
```

The key rule is:

**The design system is not decoration; it is a safety, speed, compliance, and consistency layer. POS, pharmacy, EMR, lab, claims, reporting, and communication must share tokens and components, but each must have a workflow-specific layout optimized for its users and devices.**

[1]: https://vite.dev/guide/?utm_source=chatgpt.com "Getting Started | Vite"
[2]: https://tailwindcss.com/docs/responsive-design?utm_source=chatgpt.com "Responsive design - Core concepts - Tailwind CSS"
[3]: https://mui.com/?utm_source=chatgpt.com "MUI: The React component library you always wanted"
