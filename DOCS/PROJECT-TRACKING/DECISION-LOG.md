# Decision Log

Approved architectural decisions live as ADRs in `DOCS/ADRs/`. This log indexes them and records delivery-level decisions.

## Architecture Decision Records

| ADR | Decision | Status |
| --- | --- | --- |
| ADR-001 | Branch-aware multi-tenancy via row-level `organisation_id`/`branch_id` (shared DB, shared schema) | Approved |
| ADR-002 | Authentication via Keycloak (OIDC); in-memory access token, rotating refresh token | Approved |
| ADR-003 | Field-level AES-256-GCM encryption for PII/PHI (MVP), migrate to envelope encryption later | Approved |
| ADR-004 | RBAC via Keycloak + application-layer 4-digit pharmacist PIN for regulated overrides | Approved |
| ADR-005 | Transactional Outbox + BullMQ/Redis for external integrations (eTIMS, SHA, M-Pesa, SMS) | Approved |
| ADR-006 | Degraded offline mode with append-only events + IndexedDB sync queue | Approved |
| ADR-007 | Encryption & key management (TLS + SQL TDE + field AES-256-GCM + Key Vault envelope) | Approved |
| ADR-008 | Offline / sync scope (narrow per-entity, append-only, duration tiers) | Approved |
| ADR-009 | Conflict resolution strategy (entity-level policies, manual queue, no blind merge) | Approved |
| ADR-010 | eTIMS integration strategy (software VSCU, outbox adapter, queue/retry/rejection) | Approved |
| ADR-011 | M-Pesa Daraja integration strategy (STK/C2B, callbacks, idempotency, reconciliation) | Approved |
| ADR-012 | Claims SHA/manual/API submission strategy (generic engine, adapter interface) | Approved |
| ADR-013 | WhatsApp/SMS communication strategy (consent-led, adapter-based, templates) | Approved |
| ADR-014 | Reporting architecture (separate read models/snapshots from MVP) | Approved |
| ADR-015 | Azure deployment topology (client tenant, Azure SQL DB, Container Apps, private-first) | Approved |
| ADR-016 | Backup & DR; **authoritative DR target `RPO <= 15 min / RTO <= 4h`** (35-day PITR, restore drills); **ratified Gate 0C**, contradiction with B-004 resolved, enforced by `scripts/check-dr-consistency.sh` | Approved (ratified) |
| ADR-017 | Rollout & rollback (feature flags, blue-green, branch-wave canary) | Approved |
| ADR-018 | Device/printer/scanner support model (device registry, test matrix) | Approved |
| ADR-019 | Data retention & archival policy (health data ≥20yrs, retention matrix) | Approved |
| ADR-020 | Patient data masking & export control (role masking, export approval) | Approved |
| ADR-026 | Frontend stack (Vite + React + TS + Tailwind + Radix + RHF/Zod + TanStack Query + Zustand/RTK + React Router + Storybook + Vitest/TL/Playwright) & design tokens as code | Approved |

> ADR-007..020 fleshed out and **Approved** as the Gate 0 architecture baseline. Owned by Sprint 0A ([#54](https://gitlab.com/cricketaustin-group/Pzure/-/issues/54)), 0B ([#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55)), 0C ([#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56)). Gate 0 baseline approval is satisfied; module lanes may begin once #14 lands.

## Closed decisions (resolved in Sprint 0)

| ID | Topic | Decision | Issue |
| --- | --- | --- | --- |
| D-001 | Queue technology | **Hybrid:** outbox + pluggable transport; BullMQ/Redis MVP, Service Bus later if policy requires | [#48](https://gitlab.com/cricketaustin-group/Pzure/-/issues/48) |
| D-002 | SQL Server deployment | **Azure SQL Database** (private endpoint, public access off, TDE, Entra auth, PITR; admin in Key Vault). Managed Instance only if later needs demand | [#51](https://gitlab.com/cricketaustin-group/Pzure/-/issues/51) |
| D-003 | App hosting | **Azure Container Apps** (API + workers + scheduler; private ingress; managed identity; Key Vault secrets). AKS deferred until DevOps capability exists | [#51](https://gitlab.com/cricketaustin-group/Pzure/-/issues/51) |
| D-004 | eTIMS path | **Software VSCU**; arbitrary credentials until KRA approval; outbox adapter | [#50](https://gitlab.com/cricketaustin-group/Pzure/-/issues/50) |
| D-005 | Frontend framing | **React SPA built with Vite** (+ TypeScript, Tailwind, Radix); see ADR-026 / Module 10 | [#11](https://gitlab.com/cricketaustin-group/Pzure/-/issues/11) |

## New ADRs to author (from Sprint 0 resolutions)

| ADR | Decision | Status |
| --- | --- | --- |
| ADR-COMMS-001 | SMS provider: Africa's Talking MVP default, adapter-based | Approved ([#52](https://gitlab.com/cricketaustin-group/Pzure/-/issues/52)) |
| ADR-COMMS-002 | WhatsApp provider: official BSP, adapter-based, approved templates | Approved ([#52](https://gitlab.com/cricketaustin-group/Pzure/-/issues/52)) |
| ADR-026 | Frontend stack: Vite + React + TS + Tailwind + Radix + design system | Approved ([#11](https://gitlab.com/cricketaustin-group/Pzure/-/issues/11)) |
