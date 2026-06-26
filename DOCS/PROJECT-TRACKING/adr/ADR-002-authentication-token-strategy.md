# ADR-002: Authentication & token strategy

- **Status:** Accepted (confirmed via B-002 / D-005)
- **Deciders:** Solution Architect
- **Related:** #1, #13, #49, ADR-001, ADR-004

## Context

The platform needs OIDC auth, branch-scoped claims, and a regulated-action
override for pharmacists. A custom JWT implementation was rejected as too risky;
a fully managed IdP (Entra ID B2C) was rejected on cost and limited
customisation for the branch-claim/PIN model.

## Decision

Adopt **Keycloak (self-hosted OIDC)**:

- In-memory access tokens, rotating refresh tokens.
- Custom JWT claims: `active_branch_id`, `allowed_branches`, roles.
- An application-level 4-digit **pharmacist PIN** layered on top for regulated
  overrides (ADR-004).

Auth is consumed through an `IdentityProvider` abstraction so Keycloak can be
swapped without touching the domain.

## Consequences

- Adds Keycloak + its PostgreSQL to operations.
- Branch scoping (ADR-001) depends on the JWT claim contract defined here.
- No licensing cost; full control over the claim and PIN model.
