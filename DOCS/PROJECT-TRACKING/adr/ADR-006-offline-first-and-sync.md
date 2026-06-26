# ADR-006: Offline-first operation & sync

- **Status:** Accepted
- **Deciders:** Solution Architect
- **Related:** #1, #11, #39

## Context

Branches operate with intermittent connectivity. POS and dispensing must keep
working during outages and reconcile when connectivity returns, without creating
duplicate sales or stock movements.

## Decision

The React+Vite client is an **offline-first PWA**. Writes made offline are queued
locally with client-generated idempotency keys and replayed on reconnect. The
server treats replayed writes idempotently (same key → same result). Conflicts on
mutable aggregates are resolved via optimistic locking (version check); losers
are surfaced for explicit operator resolution, never silently dropped.

## Consequences

- All offline-capable write endpoints must accept and honor an idempotency key.
- Aggregate roots carry a version for optimistic concurrency.
- Sync status and unresolved conflicts must be visible in the UI.
