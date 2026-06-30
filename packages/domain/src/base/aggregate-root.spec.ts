import { AggregateRoot } from './aggregate-root.js';
import { DomainEvent } from './domain-event.js';

class SampleEvent implements DomainEvent {
  readonly eventId = 'evt-1';
  readonly occurredAt = new Date(0);
  readonly eventType = 'sample.created';
  constructor(readonly aggregateId: string, readonly branchId: string) {}
}

class Sample extends AggregateRoot<string> {
  constructor(id: string, version = 0) {
    super(id, version);
  }
  raise(): void {
    this.addDomainEvent(new SampleEvent(this.id, 'branch-1'));
  }
}

describe('AggregateRoot', () => {
  it('starts at version 0 by default', () => {
    expect(new Sample('a').version).toBe(0);
  });

  it('buffers and pulls domain events exactly once', () => {
    const s = new Sample('a');
    s.raise();
    expect(s.domainEvents).toHaveLength(1);
    const pulled = s.pullDomainEvents();
    expect(pulled).toHaveLength(1);
    expect(s.domainEvents).toHaveLength(0);
  });

  it('uses identity equality', () => {
    expect(new Sample('a').equals(new Sample('a'))).toBe(true);
    expect(new Sample('a').equals(new Sample('b'))).toBe(false);
  });
});
