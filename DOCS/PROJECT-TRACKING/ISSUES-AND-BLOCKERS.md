# Issues & Blockers Register

| ID | Title | Severity | Status | Issue | Resolution |
|----|-------|----------|--------|-------|------------|
| B-001 | Queue technology: Azure Service Bus vs BullMQ/Redis | High | Resolved | #48 | D-001 — BullMQ/Redis behind `MessageBus` abstraction |
| B-002 | Auth: generic RBAC vs Keycloak | Medium | Resolved | #49 | D-005 — Keycloak OIDC + PIN |
| B-003 | eTIMS implementation path | High | **Open** | #50 | Scaffold against `EtimsClient` abstraction; binding deferred |
| B-004 | Azure tenant/subscription ownership | High | **Open** | #51 | Blocks environment provisioning |
| B-005 | SMS & WhatsApp providers | Medium | **Open** | #52 | Scaffold against `NotificationChannel` abstraction |
| B-006 | Key management upgrade path | High | **Open** | #53 | `EncryptionService` defined (ADR-003); KMS binding deferred |

## Scaffolding stance on open blockers

Open blockers (B-003, B-004, B-005, B-006) are isolated behind ports/abstractions
so Phase 1 can proceed. None of them is on the domain-model critical path; each
resolves to an infrastructure adapter chosen later. The reversal cost is one
adapter implementation per blocker, with no change to domain or application code.
