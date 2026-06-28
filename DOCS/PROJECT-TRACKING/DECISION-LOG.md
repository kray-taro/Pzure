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
| ADR-007 | Encryption & key management (TLS + SQL TDE + field AES-256-GCM + Key Vault envelope) | Draft |
| ADR-008 | Offline / sync scope (narrow per-entity, append-only, duration tiers) | Draft |
| ADR-009 | Conflict resolution strategy (entity-level policies, manual queue, no blind merge) | Draft |
| ADR-010 | eTIMS integration strategy (outbox adapter, queue/retry/rejection) | Draft |
| ADR-011 | M-Pesa Daraja integration strategy (STK/C2B, callbacks, idempotency, reconciliation) | Draft |
| ADR-012 | Claims SHA/manual/API submission strategy (generic engine, adapter interface) | Draft |
| ADR-013 | WhatsApp/SMS communication strategy (consent-led, Cloud API, templates) | Draft |
| ADR-014 | Reporting architecture (separate read models/snapshots from MVP) | Draft |
| ADR-015 | Azure deployment topology (client tenant, IaC, environments) | Draft |
| ADR-016 | Backup & DR (RPO ≤15min, RTO ≤4h, restore drills) | Draft |
| ADR-017 | Rollout & rollback (feature flags, blue-green, branch-wave canary) | Draft |
| ADR-018 | Device/printer/scanner support model (device registry, test matrix) | Draft |
| ADR-019 | Data retention & archival policy (health data ≥20yrs, retention matrix) | Draft |
| ADR-020 | Patient data masking & export control (role masking, export approval) | Draft |

> ADR-007..020 stubbed to close B-007 (Gate 0). Owned by Sprint 0A ([#54](https://gitlab.com/cricketaustin-group/Pzure/-/issues/54)), 0B ([#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55)), 0C ([#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56)); move to Approved as each architecture sprint completes.

## Open decisions (to close in Sprint 0)

| ID | Topic | Options | Recommendation |
| --- | --- | --- | --- |
| D-001 | Queue technology | Azure Service Bus vs BullMQ/Redis | Follow ADR-005 (BullMQ/Redis) unless enterprise Azure policy mandates Service Bus |
| D-002 | SQL Server deployment | Azure SQL / Managed Instance / SQL VM | Confirm with client enterprise policy |
| D-003 | App hosting | App Service / Container Apps / AKS | Choose by internal DevOps capability |
| D-004 | eTIMS path | Direct API / VSCU / OSCU / middleware | Decide with KRA/eTIMS readiness |
| D-005 | Frontend framing | "ViteJS" (plan) vs "React + Vite" (ADRs) | Treat as React SPA built with Vite |
