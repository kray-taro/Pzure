# ADR-004: RBAC & pharmacist PIN override

- **Status:** Accepted
- **Deciders:** Solution Architect
- **Related:** #1, #49, ADR-002

## Context

Regulated actions (dispensing controlled medicines, overriding interaction
warnings, price/stock overrides) require a licensed pharmacist's authorization,
which may differ from the logged-in till operator.

## Decision

RBAC roles come from Keycloak claims. Regulated actions additionally require a
**step-up authorization**: a licensed pharmacist supplies a 4-digit PIN that is
verified server-side against a hashed credential. The PIN authorizes a single
bounded action and is recorded in the audit trail with the authorizing
pharmacist's identity.

## Consequences

- PIN verification is rate-limited and lockout-protected.
- Every PIN-authorized action is immutably audited (who authorized, what, when).
- The override is modeled as an explicit domain capability, not a bypass flag.
