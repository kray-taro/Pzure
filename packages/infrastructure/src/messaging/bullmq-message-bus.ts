import type { MessageBus, OutboundMessage } from '@pzure/application';

/**
 * BullMQ/Redis adapter for the MessageBus port (ADR-005, D-001).
 *
 * Phase 1: shell only — establishes the seam. The real implementation enqueues
 * to a named BullMQ queue with: idempotency on messageId, exponential-backoff
 * retries, and a dead-letter queue (CONCURRENCY §3–§4). Swapping to Azure
 * Service Bus means replacing this class only.
 */
export class BullMqMessageBus implements MessageBus {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async publish(_message: OutboundMessage): Promise<void> {
    throw new Error('Not implemented in Phase 1 (scaffold only).');
  }
}
