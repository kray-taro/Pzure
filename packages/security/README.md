# @pzure/security

Machine-verified tenancy invariants for ADR-001 (Branch-Aware Multi-Tenancy).

ADR-001 §6.4 requires that branch isolation is **enforced**, not asserted: no
invariant may rely on developer discipline. This package holds the parts of that
test plan that are buildable on the current `develop` line (which has no backend
or database yet), and scaffolds the rest against companion issue **#70**.

## What is here now

- **`scope-registry.ts`** - the single source of truth for the ADR-001 scoping
  classes. Every transactional/reference table in `DOCS/Unified_ERD.md` is
  declared as exactly one of:
  - `directly-scoped` - owns a `branch_id` column (RLS predicate on `branch_id`,
    except `core_branches` whose predicate is on `id`);
  - `inheritance-scoped` - reaches its branch through a documented FK chain that
    **terminates at a directly-scoped table's `branch_id`**;
  - `org-scoped` - carries `organisation_id` / is global reference data
    (`patient_patients` is org-scoped PHI with consent-gated, audited
    cross-branch read).
- **`resolve-chain.ts`** - pure resolver that walks an inheritance chain to its
  terminal and proves it lands on a directly-scoped `branch_id`. This is the
  invariant the SQL Server RLS / security-predicate functions implement.
- **`scope-registry.contract.test.ts`** - ADR-001 §6.4 **test 7** (migration
  guard): every ERD table is classified, chains terminate correctly, and the
  two list representations cannot drift.
- **`rls-enforcement.todo.test.ts`** - ADR-001 §6.4 **tests 1-6** (positive
  scope, negative read/write, forgotten-filter backstop, corporate bypass,
  master-vs-PHI) as `it.todo`, blocked on the DB layer delivered under #70.

## What is intentionally not here yet (tracked in #70)

SQL Server RLS policies, the NestJS `SESSION_CONTEXT('branch_id')` plumbing, and
the live-DB integration tests cannot be written until the backend/DB package
exists. The `it.todo` cases keep that plan visible in CI so it cannot be
forgotten. Gate 0A isolation is **enforced** only once those are green.
