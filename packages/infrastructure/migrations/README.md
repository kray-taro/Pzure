# Migrations

Forward-only SQL Server migrations, applied in lexical order. `0001_baseline.sql`
establishes the cross-cutting outbox, dedup, idempotency, and immutable audit
tables that every module depends on.

Integration tests seed and tear down a disposable database per run — no shared
mutable state between runs (see CI `.gitlab-ci.yml`).
