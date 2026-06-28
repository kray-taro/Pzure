# Issues & Blockers

Log every blocker here and review weekly. Mirror the legacy `Module_X - Blockers Resolutions` doc here going forward. Status: 🔴 Open · 🟡 In review · 🟢 Resolved.

| ID | Title | Area | Severity | Status | Owner | Notes / Resolution |
| --- | --- | --- | --- | --- | --- | --- |
| B-001 | Stack discrepancy: Service Bus vs BullMQ/Redis | Architecture | High | 🟢 Resolved | Solution Architect | [#48](https://gitlab.com/cricketaustin-group/Pzure/-/issues/48). **Hybrid:** keep outbox; pluggable transport — BullMQ/Redis for MVP, swap to Service Bus later if enterprise policy requires. Aligns ADR-005. |
| B-002 | Stack discrepancy: generic RBAC vs Keycloak | Architecture | Medium | 🟢 Resolved | Solution Architect | [#49](https://gitlab.com/cricketaustin-group/Pzure/-/issues/49). **Keycloak** (ADR-002/004): self-hosted OIDC, branch claims in JWT, PIN override. Adds Keycloak + PostgreSQL to ops. |
| B-003 | eTIMS implementation path undecided | Integration | High | 🟢 Resolved | Tech Lead | [#50](https://gitlab.com/cricketaustin-group/Pzure/-/issues/50). **Software VSCU**; arbitrary credentials until KRA approval; integrate via outbox adapter (ADR-010). |
| B-004 | Azure tenant/subscription ownership | Infrastructure | High | 🟢 Resolved | PM / Client | [#51](https://gitlab.com/cricketaustin-group/Pzure/-/issues/51). **Client-owned tenant + prod subscription**; Azure SQL DB (private, TDE) + Container Apps; private-first landing zone; Key Vault + managed identity; backup/DR target `RPO <= 15 min / RTO <= 4h` (authoritative per ADR-016; supersedes the looser RPO 24h / RTO 8-24h figures discussed during triage), runbook before go-live. AKS/Managed Instance deferred. |
| B-005 | SMS & WhatsApp providers not selected | Communication | Medium | 🟢 Resolved | BA | [#52](https://gitlab.com/cricketaustin-group/Pzure/-/issues/52). **Adapter-based** (not hard-coded). SMS: **Africa's Talking** MVP default. WhatsApp: official **BSP** (shortlist AT/Infobip/Twilio), client procurement decides. Consent/STOP/templates/delivery reports mandatory; creds in Key Vault. New: ADR-COMMS-001/002. |
| B-006 | Key management upgrade path | Security | Medium | 🟢 Resolved | Security Lead | [#53](https://gitlab.com/cricketaustin-group/Pzure/-/issues/53). **MVP:** AES-256-GCM fields + SQL TDE + TLS, keys via Key Vault. **Phase 3:** envelope encryption (KEK in Key Vault, wrapped per-record DEKs, rotation). Promotes ADR-007. |

| B-007 | Missing Sprint 0A/0B/0C architecture sprints + Gate 0 | Architecture | High | 🔴 Open | Solution Architect | `Module_X - Blockers Resolutions` mandates pre-build architecture sprints and a **Gate 0 baseline approval** before any module build. Now tracked as [#54](https://gitlab.com/cricketaustin-group/Pzure/-/issues/54) (0A data/ERD/tenancy), [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55) (0B security/auth/encryption), [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) (0C offline/integration/NFR/deployment/DR), all under Foundation #1. ADR-007..020 stubbed in `DOCS/ADRs/` (Draft) — move to Approved as each sprint completes. No module lane starts until Gate 0 ADRs are approved. |

> Review the existing `DOCS/Modules/Module_X - Blockers Resolutions` document and migrate any open items here.

## Gate 0 (Architecture Baseline Approval) — from Module_X

Before module build (gates the parallel lanes), the following must be approved:

- ERD approved; tenancy ADR approved (shared DB, branch-scoped rows).
- Security ADRs approved (OIDC/auth/session/MFA, encryption + Key Vault, regulated-action PIN, audit + data-access logging).
- Offline scope + conflict policy approved.
- Integration sequence diagrams approved (eTIMS, M-Pesa, SHA, WhatsApp/SMS, external labs).
- NFRs approved (POS <2s checkout, API p95 <500ms, 150 concurrent users, 10→50 branches).
- Azure deployment design + backup/DR target `RPO <= 15 min / RTO <= 4h` (authoritative per ADR-016) + rollback plan approved.

The existing ADR-001..006 cover tenancy, auth, encryption, RBAC/PIN, outbox/queue and offline. Module_X additionally calls for ADR-007..020 (encryption/key mgmt, conflict resolution, eTIMS, M-Pesa, claims, comms, reporting, Azure topology, backup/DR, rollout/rollback, device support, retention, masking). Author the missing ADRs as part of closing B-007.
