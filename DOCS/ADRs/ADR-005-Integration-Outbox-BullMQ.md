# ADR-005: Integration Outbox & Message Queue Pattern

**Status:** Approved  
**Date:** 2026-05-22  
**Author(s):** Solutions Architect

## 1. Context and Problem Statement

Pzure must integrate with critical external systems: eTIMS (KRA) for tax invoices, SHA for claims, Daraja (M-Pesa) for payments, and Africa's Talking for SMS.

If we synchronously call the eTIMS API during the POS checkout flow and the eTIMS API is down, the sale fails, stopping retail operations. We need a robust asynchronous pattern to guarantee message delivery to external APIs without blocking internal transactions.

## 2. Decision Drivers

* **Resilience:** The POS and clinical workflows must remain available even if KRA/eTIMS or SHA APIs are offline.
* **Guaranteed Delivery:** Financial and tax data must never be lost. "At-least-once" delivery is required.
* **Infrastructure Constraints:** The MVP relies on open-source, free-tier-capable technologies.

## 3. Considered Options

1. **Synchronous HTTP Calls:** Block the database transaction until the external API responds. (Rejected due to brittleness).
2. **Direct Queue Push:** Push a job to Redis/BullMQ during the transaction. (Rejected because if the DB commits but Redis crashes before the push, the job is lost).
3. **Transactional Outbox Pattern with BullMQ:** Write an event to an `outbox` table in the same SQL Server transaction as the business entity. A background worker polls the outbox and moves jobs to BullMQ for processing.

## 4. Decision Outcome

**Chosen option:** Option 3 (Transactional Outbox Pattern with BullMQ).

By writing to an `audit.integration_outbox` table within the same SQL transaction that creates an invoice or claim, we achieve atomic consistency. If the DB commits, the outbox event is guaranteed to exist.

A NestJS cron job (or CDC tool in the future) will poll the `integration_outbox` table and enqueue the tasks into **BullMQ** (backed by Redis). BullMQ will handle the retries, exponential backoff, and dead-letter queuing for the external API calls (eTIMS, SHA, SMS).

### Positive Consequences

* **Zero Data Loss:** Database atomicity guarantees the event is recorded.
* **High Availability POS:** Checkout takes milliseconds because external API latency is moved to the background.
* **Cost-Effective:** Redis + BullMQ is open-source, highly performant, and native to the Node.js ecosystem.

### Negative Consequences

* **Eventual Consistency:** The UI won't immediately know the eTIMS invoice number. It will initially show "Pending" and must poll or use WebSockets for updates.
* **Operational Burden:** Requires managing a Redis instance alongside SQL Server.

## 5. Implementation Notes

* Create table `audit.integration_outbox` with columns: `id`, `aggregate_type` (e.g., 'Invoice'), `aggregate_id`, `payload` (JSON), `status` ('Pending', 'Processing', 'Completed', 'Failed'), `created_at`.
* BullMQ jobs must be **idempotent**. If BullMQ crashes and a job is processed twice, the external API adapter (e.g., eTIMS adapter) must recognize it has already submitted that invoice.
* Implement a DLQ (Dead Letter Queue) in BullMQ and an Admin UI dashboard to replay failed eTIMS submissions or SMS messages.
