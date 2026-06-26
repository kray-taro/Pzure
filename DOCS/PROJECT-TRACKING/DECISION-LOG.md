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

## Open decisions (to close in Sprint 0)

| ID | Topic | Options | Recommendation |
| --- | --- | --- | --- |
| D-001 | Queue technology | Azure Service Bus vs BullMQ/Redis | Follow ADR-005 (BullMQ/Redis) unless enterprise Azure policy mandates Service Bus |
| D-002 | SQL Server deployment | Azure SQL / Managed Instance / SQL VM | Confirm with client enterprise policy |
| D-003 | App hosting | App Service / Container Apps / AKS | Choose by internal DevOps capability |
| D-004 | eTIMS path | Direct API / VSCU / OSCU / middleware | Decide with KRA/eTIMS readiness |
| D-005 | Frontend framing | "ViteJS" (plan) vs "React + Vite" (ADRs) | Treat as React SPA built with Vite |
