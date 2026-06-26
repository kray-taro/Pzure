# ADR-005: Integration outbox & message queue

- **Status:** Accepted (confirmed via B-001 / D-001)
- **Deciders:** Solution Architect
- **Related:** #1, #13, #48, Module 2/7/9

## Context

External integrations (eTIMS/KRA, SHA claims, M-Pesa, SMS/WhatsApp) must not lose
messages and must not double-send on retry. The Master Plan named Azure Service
Bus; this ADR specifies the outbox pattern over BullMQ/Redis.

## Decision

Use the **transactional outbox** pattern: domain writes and the outbox record
commit in the same SQL Server transaction; a relay publishes from the outbox to
the queue. The queue transport for MVP is **BullMQ/Redis** (D-001), accessed
only through a `MessageBus` abstraction so it can be swapped for Azure Service
Bus later without changing producers/consumers.

Every consumer is **idempotent** (keyed on a message id) and backed by a
**dead-letter queue**.

## Consequences

- Adds Redis to operations.
- At-least-once delivery → consumers must deduplicate.
- The outbox guarantees no message is published unless its business transaction
  committed.
