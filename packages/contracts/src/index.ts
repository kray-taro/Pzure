// Shared DTOs/types that cross the API boundary. Populated per module in later phases.
export interface IdempotentRequestHeaders {
  /** Required on offline-capable write endpoints (ADR-006, CONCURRENCY §3). */
  'idempotency-key': string;
}
