# Issues & Blockers

Log every blocker here and review weekly. Mirror the legacy `Module_X - Blockers Resolutions` doc here going forward. Status: 🔴 Open · 🟡 In review · 🟢 Resolved.

| ID | Title | Area | Severity | Status | Owner | Notes / Resolution |
| --- | --- | --- | --- | --- | --- | --- |
| B-001 | Stack discrepancy: Service Bus vs BullMQ/Redis | Architecture | High | 🔴 Open | Solution Architect | Tracked in [#48](https://gitlab.com/cricketaustin-group/Pzure/-/issues/48). Master Plan says Azure Service Bus; ADR-005 says BullMQ/Redis. Decide authoritative source. |
| B-002 | Stack discrepancy: generic RBAC vs Keycloak | Architecture | Medium | 🔴 Open | Solution Architect | Tracked in [#49](https://gitlab.com/cricketaustin-group/Pzure/-/issues/49). ADR-002 specifies Keycloak; confirm and align Master Plan. |
| B-003 | eTIMS implementation path undecided | Integration | High | 🔴 Open | Tech Lead | Tracked in [#50](https://gitlab.com/cricketaustin-group/Pzure/-/issues/50). Direct API / VSCU / OSCU / certified middleware to be confirmed in Sprint 0. |
| B-004 | Azure tenant/subscription ownership | Infrastructure | High | 🔴 Open | PM / Client | Tracked in [#51](https://gitlab.com/cricketaustin-group/Pzure/-/issues/51). Production must run in client-owned Azure tenant. |
| B-005 | SMS & WhatsApp providers not selected | Communication | Medium | 🔴 Open | BA | Tracked in [#52](https://gitlab.com/cricketaustin-group/Pzure/-/issues/52). Africa's Talking referenced in ADR-005; confirm + WhatsApp BSP. |
| B-006 | Key management upgrade path | Security | Medium | 🔴 Open | Security Lead | Tracked in [#53](https://gitlab.com/cricketaustin-group/Pzure/-/issues/53). MVP uses env-based AES key (ADR-003); plan envelope encryption / Key Vault for Phase 3. |

| B-007 | Missing Sprint 0A/0B/0C architecture sprints + Gate 0 | Architecture | High | 🔴 Open | Solution Architect | `Module_X - Blockers Resolutions` mandates pre-build architecture sprints and a **Gate 0 baseline approval** before any module build. Now tracked as [#54](https://gitlab.com/cricketaustin-group/Pzure/-/issues/54) (0A data/ERD/tenancy), [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55) (0B security/auth/encryption), [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) (0C offline/integration/NFR/deployment/DR), all under Foundation #1. ADR-007..020 stubbed in `DOCS/ADRs/` (Draft) — move to Approved as each sprint completes. No module lane starts until Gate 0 ADRs are approved. |

> Review the existing `DOCS/Modules/Module_X - Blockers Resolutions` document and migrate any open items here.

## Gate 0 (Architecture Baseline Approval) — from Module_X

Before module build (gates the parallel lanes), the following must be approved:
- ERD approved; tenancy ADR approved (shared DB, branch-scoped rows).
- Security ADRs approved (OIDC/auth/session/MFA, encryption + Key Vault, regulated-action PIN, audit + data-access logging).
- Offline scope + conflict policy approved.
- Integration sequence diagrams approved (eTIMS, M-Pesa, SHA, WhatsApp/SMS, external labs).
- NFRs approved (POS <2s checkout, API p95 <500ms, 150 concurrent users, 10→50 branches).
- Azure deployment design + backup/DR (RPO ≤15min, RTO ≤4h) + rollback plan approved.

The existing ADR-001..006 cover tenancy, auth, encryption, RBAC/PIN, outbox/queue and offline. Module_X additionally calls for ADR-007..020 (encryption/key mgmt, conflict resolution, eTIMS, M-Pesa, claims, comms, reporting, Azure topology, backup/DR, rollout/rollback, device support, retention, masking). Author the missing ADRs as part of closing B-007.
