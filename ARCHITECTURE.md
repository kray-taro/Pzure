# Pzure — Architecture (Phase 1 scaffold)

Source of truth for decisions lives on the `DOCS` branch under
`DOCS/PROJECT-TRACKING/` (ADR-001…006, DECISION-LOG, CONCURRENCY policy,
COMPLIANCE). This file describes how the code is laid out to honor them.

## Layer boundaries (dependency rule)

Dependencies point inward only:

```
apps/{api,worker,web}  ->  application  ->  domain
         |                     |              ^
         +------> infrastructure ------------+ (implements domain/application ports)
```

- **`packages/domain`** — entities, aggregates, value objects, domain events,
  and the **ports** (interfaces) the domain owns. Depends on nothing.
- **`packages/application`** — use-case/service interfaces. One class per use
  case (Phase 2). Depends only on `domain`.
- **`packages/infrastructure`** — concrete adapters that implement ports
  (SQL Server repos, Keycloak, BullMQ bus, KMS encryption, audit sink). Depends
  on `domain`/`application` abstractions, never the reverse (DIP).
- **`packages/contracts`** — DTOs/shared types crossing the API boundary.
- **`apps/api`** — NestJS HTTP boundary; thin controllers (Phase 3).
- **`apps/worker`** — outbox relay + idempotent queue consumers (ADR-005).
- **`apps/web`** — React+Vite offline-first PWA (ADR-006).

Boundaries are enforced by Nx module-boundary lint rules (see
`.eslintrc.json` `@nx/enforce-module-boundaries`).

## Ports defined in Phase 1 (no implementations yet)

`Repository<T>`, `BranchScope`, `IdentityProvider`, `EncryptionService`,
`AuditLogger`, `MessageBus`, `Cache`, `SearchIndex`, `Clock`.

Concrete adapters arrive in Phase 2+. Open blockers (B-003 eTIMS, B-004 Azure,
B-005 SMS/WhatsApp, B-006 KMS) each resolve to a single adapter behind these
ports.
