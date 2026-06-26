import { Entity } from './entity.js';
import { DomainEvent } from './domain-event.js';

/**
 * Aggregate root with **optimistic-locking version**.
 *
 * Concurrency guarantee (CONCURRENCY-AND-TRANSACTIONS.md §1): every mutable
 * aggregate carries an integer `version`. Repositories persist with a
 * version assertion (WHERE id = ? AND version = ?) and increment it. A
 * mismatch is a ConcurrencyConflictError — never a silent overwrite. This is
 * what protects against lost updates from offline sync (ADR-006), concurrent
 * operators, and retried writes.
 *
 * Aggregates also buffer DomainEvents to be published via the transactional
 * outbox (ADR-005) within the same DB transaction as the state change.
 */
export abstract class AggregateRoot<TId = string> extends Entity<TId> {
  private _domainEvents: DomainEvent[] = [];

  protected constructor(
    id: TId,
    public readonly version: number = 0,
  ) {
    super(id);
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = this._domainEvents;
    this._domainEvents = [];
    return events;
  }
}
