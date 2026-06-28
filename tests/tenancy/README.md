# Tenancy isolation enforcement (ADR-001 §6.4)

This directory is the **enforcement arm** of ADR-001's branch-aware multi-tenancy.
It turns §6 from documentation into machine-checked gates (DDIA reliability: no
invariant relies on developer discipline).

## What runs where

| Gate | File | Needs a DB? | CI job |
| --- | --- | --- | --- |
| Test 7 — migration guard | `../../scripts/check-tenancy-scoping.mjs` + `scoping-guard.test.ts` | No | `test` (always) |
| T1–T6 — live RLS isolation | `rls-isolation.test.ts` | Yes (SQL Server) | `integration-tenancy` |

## Source of truth

- `DOCS/tenancy-scoping.json` classifies every `Unified_ERD.md` table as
  `master`, `direct` (owns `branch_id`), or `inheritance` (reaches `branch_id`
  via an FK chain). The migration guard fails CI if a table is unclassified, a
  chain is broken, or — once migrations exist — a transactional table has no RLS
  policy.
- `scripts/lib/rls-sql.mjs` is the **single generator** for the RLS DDL. Both
  the production migration and the T1–T6 tests use it, so the tests verify the
  exact SQL that ships.

## Running the live tests locally

```sh
docker run -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='Your_strong_pass1' -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
DB_HOST=localhost MSSQL_SA_PASSWORD='Your_strong_pass1' npm run test:tenancy
```

Without `DB_HOST` + a password, T1–T6 **skip explicitly** (logged), so they are
never a silent pass.
