# ADR-001: Branch-aware multi-tenancy

- **Status:** Accepted
- **Deciders:** Solution Architect
- **Related:** #1, #14, ADR-002

## Context

A single Pzure deployment runs multiple physical branches (a chemist, a clinic,
a clinic-with-pharmacy, a mini retail shop). Data must be isolated per branch,
but some users legitimately operate across several branches. Stock, dispensing,
claims, and EMR data are all branch-scoped.

## Decision

Use **row-level branch scoping** keyed on `branch_id`, enforced at the
repository/infrastructure layer, never left to individual queries. Every
branch-scoped aggregate root carries a non-null `branch_id`. The active branch
and the set of permitted branches are carried as JWT claims (`active_branch_id`,
`allowed_branches`) issued by Keycloak (ADR-002).

A single `BranchScope` abstraction is injected into repositories; business code
never reads the branch claim directly.

## Consequences

- Cross-branch reads require an explicit, audited capability — they are not the
  default.
- The scope is enforced in one place (DIP/SRP), so a query author cannot forget
  it.
- Reporting/analytics that aggregate across branches must go through a dedicated,
  separately-authorized read path.
