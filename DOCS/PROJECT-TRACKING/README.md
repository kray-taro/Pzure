# Pzure — Project Tracking

This directory is the **single source of truth** for architecture decisions,
blockers, and cross-cutting engineering policy for Pzure, a clinic–pharmacy–retail
operating system for the Kenyan market.

When any two of the following conflict, the higher-priority source wins and the
conflict must be surfaced (not silently resolved):

1. Architecture Decision Records (`adr/`)
2. The issue tracker (#1–#53)
3. Ad-hoc instructions

## Contents

| File | Purpose |
|------|---------|
| `adr/` | Architecture Decision Records (ADR-001 … ADR-006) |
| `DECISION-LOG.md` | Chronological log of resolved decisions (D-NNN) |
| `ISSUES-AND-BLOCKERS.md` | Open/closed blockers register (B-NNN) |
| `CONCURRENCY-AND-TRANSACTIONS.md` | Concurrency guarantees & transaction-boundary policy |
| `COMPLIANCE.md` | Regulatory frame (Kenya DPA 2019 + PPB) and control mapping |

## Fixed technology stack

- **API:** NestJS (TypeScript)
- **Frontend:** React + Vite, offline-first PWA (ADR-006)
- **Database:** Microsoft SQL Server with a migration framework, branch-aware
  multi-tenancy (ADR-001)
- **Auth:** Keycloak (OIDC) + application-level pharmacist PIN override
  (ADR-002, ADR-004)
- **Messaging:** Transactional outbox over BullMQ/Redis, kept transport-agnostic
  (ADR-005, D-001)
- **Crypto:** Field-level encryption for PHI/PII (ADR-003)

## Compliance frame

Pzure operates in **Kenya**. The governing regime is the **Data Protection Act,
2019** and **Pharmacy & Poisons Board** regulations — **not** HIPAA/HITECH.
See `COMPLIANCE.md`.
