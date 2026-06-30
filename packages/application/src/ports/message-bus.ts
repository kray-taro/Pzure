/**
 * MessageBus port (ADR-005, D-001). MVP transport is BullMQ/Redis; swappable to
 * Azure Service Bus by reimplementing this port. Producers publish via the
 * transactional outbox; consumers are idempotent and DLQ-backed
 * (CONCURRENCY §3–§4).
 */
export interface OutboundMessage {
  readonly messageId: string;
  readonly topic: string;
  readonly payload: unknown;
}

export interface MessageBus {
  publish(message: OutboundMessage): Promise<void>;
}

export interface MessageConsumer {
  readonly topic: string;
  /** MUST be idempotent on message.messageId (at-least-once delivery). */
  handle(message: OutboundMessage): Promise<void>;
}
