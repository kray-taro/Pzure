/**
 * ADR-001 §6.4 - tests 1-6 (DB-enforced RLS), tracked in #70.
 *
 * These require SQL Server RLS policies, the NestJS SESSION_CONTEXT('branch_id')
 * plumbing, and a live test database - none of which exist on the current
 * `develop` line. They are declared here as `it.todo` so the full enforcement
 * plan is visible in CI and cannot be quietly dropped. Gate 0A isolation is
 * "enforced" only when these are implemented and green (ADR-001 §6.5, #70).
 */
import { describe, it } from 'vitest';

describe('ADR-001 §6.4 RLS enforcement (DB-bound, #70)', () => {
  it.todo('test 1: Branch-A read of directly-scoped tables returns only branch_id = A');
  it.todo('test 2: Branch-A read of a Branch-B row id returns zero rows (no existence leak)');
  it.todo('test 3: cross-branch write is rejected by the DB block predicate even if app scope is bypassed');
  it.todo('test 4: forgotten-filter query still returns only session-branch rows (RLS backstop)');
  it.todo('test 5: Corporate bypass reads cross-branch only via the designated path, and every access is audited');
  it.todo('test 6: org-scoped master is org-visible; transactional is not; patient_patients cross-branch read is consent-gated + audited');
});
