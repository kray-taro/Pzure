# web (React + Vite, offline-first PWA)

Phase 1 placeholder. ADR-006: writes made offline are queued locally with
client-generated idempotency keys and replayed on reconnect; the server honors
them idempotently. Optimistic-lock conflicts are surfaced for explicit operator
resolution, never silently dropped. Design system + shell arrive in Module 10
(#11).
