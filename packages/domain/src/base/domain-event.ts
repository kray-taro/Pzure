/**
 * DomainEvent contract.
 *
 * Events are buffered on the aggregate and published via the transactional
 * outbox (ADR-005). `eventId` is the idempotency key consumers deduplicate on
 * (CONCURRENCY-AND-TRANSACTIONS.md §3).
 */
export interface DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly branchId: string;
}
