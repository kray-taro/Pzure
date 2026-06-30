/**
 * Transaction boundary helper (CONCURRENCY §2).
 *
 * The domain write and its outbox record MUST commit in the same SQL Server
 * transaction (ADR-005 outbox guarantee). External calls are NEVER performed
 * inside this boundary — they run in outbox consumers. Phase 1 defines the
 * contract; the SQL Server implementation arrives in Phase 2.
 */
export interface UnitOfWork {
  withTransaction<T>(work: () => Promise<T>): Promise<T>;
}
