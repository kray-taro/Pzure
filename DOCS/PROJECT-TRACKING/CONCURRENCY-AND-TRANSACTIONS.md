# Concurrency & Transaction-Boundary Policy

This policy is binding for all phases. Every shared mutable resource must state
its protection mechanism here or in the owning module's docs.

## 1. Optimistic locking

All mutable aggregate roots carry an integer `version`. Updates assert the
expected version (`WHERE id = ? AND version = ?`) and increment it. A version
mismatch raises a concurrency conflict that the caller must handle explicitly —
never a silent overwrite. This protects against lost updates across offline sync
(ADR-006), concurrent operators, and retried requests.

## 2. Transaction boundaries

| Operation class | Boundary | Rationale |
|-----------------|----------|-----------|
| Domain write + its outbox record | **Single atomic SQL transaction** | Outbox guarantee (ADR-005): a message is published only if its business change committed. |
| Cross-aggregate workflows | **Eventual consistency via outbox events** | Avoids distributed locks; each step is idempotent. |
| Stock movements / dispensing | Atomic per aggregate, optimistic version check | Prevents double-dispense and negative stock under races. |
| External calls (M-Pesa, eTIMS, SHA, SMS) | **Never inside a DB transaction** | External latency must not hold DB locks; invoked by outbox consumers. |

## 3. Idempotency

- Every write endpoint that can be retried (all offline-capable ones, ADR-006)
  accepts a client `Idempotency-Key`; the server returns the original result on
  replay.
- Every message consumer deduplicates on message id (at-least-once delivery,
  ADR-005).
- M-Pesa/eTIMS/SHA callbacks are idempotent on their provider reference.

## 4. Dead-letter queues

Every async consumer has a DLQ. Messages exceeding the retry budget
(exponential backoff) move to the DLQ for inspection, never lost or infinitely
retried.

## 5. Audit & PHI access

Every read or write of PHI/PII emits an **immutable** audit event (actor, action,
subject, branch, timestamp, authorizing PIN if applicable). Audit writes are
append-only and must not be skippable by business code — they are emitted from a
cross-cutting interceptor, not per-handler.
