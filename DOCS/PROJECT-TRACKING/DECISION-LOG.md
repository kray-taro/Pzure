# Decision Log

Chronological record of resolved decisions. Each entry is immutable once closed;
reversals are recorded as new entries.

| ID | Date | Decision | Status | Refs |
|----|------|----------|--------|------|
| D-001 | 2026-06-26 | Queue transport for MVP is **BullMQ/Redis** behind a `MessageBus` abstraction, using the transactional outbox pattern (ADR-005). Azure Service Bus deferred; reversible by reimplementing the `MessageBus` port. | Closed | B-001 (#48), ADR-005 |
| D-005 | 2026-06-26 | Authentication is **Keycloak (OIDC)** with branch claims + pharmacist PIN override (ADR-002, ADR-004), consumed via an `IdentityProvider` abstraction. | Closed | B-002 (#49), ADR-002, ADR-004 |
| D-006 | 2026-06-26 | Compliance frame corrected to **Kenya DPA 2019 + Pharmacy & Poisons Board** (not HIPAA/HITECH). Controls (encryption, PHI audit, RBAC, minimization) retained. | Closed | COMPLIANCE.md |

## Notes

- D-001 and D-005 follow the ADR-aligned recommendations in B-001/B-002 and are
  implemented **behind abstractions** so the unresolved enterprise-policy
  question can be revisited at low cost.
