/**
 * Clock port. Inject time so domain logic is deterministic and testable
 * (no direct `new Date()` / `Date.now()` in domain code).
 */
export interface Clock {
  now(): Date;
}
