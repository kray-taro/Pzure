/** Domain error hierarchy. Infrastructure must map these to transport errors. */
export abstract class DomainError extends Error {
  abstract readonly code: string;
}

/** Raised on optimistic-lock version mismatch (CONCURRENCY policy §1). */
export class ConcurrencyConflictError extends DomainError {
  readonly code = 'CONCURRENCY_CONFLICT';
  constructor(aggregate: string, id: string) {
    super(`Concurrency conflict on ${aggregate} ${id}`);
  }
}

/** Raised when a branch-scoped resource is accessed outside the allowed branches (ADR-001). */
export class BranchScopeViolationError extends DomainError {
  readonly code = 'BRANCH_SCOPE_VIOLATION';
  constructor(branchId: string) {
    super(`Access denied for branch ${branchId}`);
  }
}
