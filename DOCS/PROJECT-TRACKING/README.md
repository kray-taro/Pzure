# Pzure Project Tracking

This folder is the single source of truth for **what is to be done, what is in progress, what is done, open issues/blockers, decisions, and risks** for the Pzure platform. It is derived from the documentation in `DOCS/` and is intended to kick off and steer delivery.

## What is Pzure?

A **10-branch enterprise-grade Kenya health retail platform** covering pharmacy, clinic (EMR), lab-lite, claims/insurance, POS/billing, inventory/procurement, online pharmacy/delivery, reporting/analytics, and patient communication. Greenfield, no legacy migration, quality-first wave rollout (2 → 3 → 5 branches).

## Tech stack (as documented)

| Layer | Master Plan | ADRs |
| --- | --- | --- |
| Backend | NestJS | NestJS |
| Frontend | ViteJS | React (SPA) + Vite |
| Database | SQL Server | SQL Server |
| Auth | RBAC | Keycloak (OIDC) + app-layer PIN |
| Encryption | - | AES-256-GCM field-level (ADR-003) |
| Integration | Queue/Service Bus | Transactional Outbox + BullMQ/Redis (ADR-005) |
| Offline | Offline sync engine | Degraded offline + IndexedDB (ADR-006) |
| Hosting | Azure / client-owned | - |

> **OPEN DECISION:** The Master Plan references Azure Service Bus while ADR-005 specifies BullMQ/Redis, and the Master Plan lists generic "RBAC" while ADR-002 specifies Keycloak. ADRs are more recent and detailed; treat ADRs as authoritative unless steering decides otherwise. See `DECISION-LOG.md`.

## Folder contents

| File | Purpose |
| --- | --- |
| `README.md` | This overview and how to use the folder |
| `ROADMAP.md` | Phase/sprint roadmap (37 sprints, 9 phases) with status |
| `BACKLOG.md` | Module + epic backlog mapped to GitLab work items |
| `TASK-BOARD.md` | To Do / In Progress / Done snapshot |
| `ISSUES-AND-BLOCKERS.md` | Open issues, blockers, and resolutions |
| `DECISION-LOG.md` | Architectural and delivery decisions (links to ADRs) |
| `RISK-REGISTER.md` | Risks, severity, and mitigations |
| `SPRINT-0-CHECKLIST.md` | Immediate mobilisation actions (next 30 days) |
| `WORK-ITEMS.md` | Index of created GitLab epics/issues |

## How to use this folder

1. **Plan** new work in `BACKLOG.md` and `ROADMAP.md`.
2. **Track** active work in `TASK-BOARD.md` (or GitLab boards once issues are created).
3. **Record** every cross-team decision in `DECISION-LOG.md`.
4. **Log** blockers in `ISSUES-AND-BLOCKERS.md` and review weekly.
5. **Review** `RISK-REGISTER.md` at every steering committee.

## Source documents

- `DOCS/Modules/Modul_Master - Implementation Plan.md` — full 37-sprint plan
- `DOCS/Modules/Module_1..10` — per-module specs
- `DOCS/ADRs/ADR-001..006` — architecture decisions
- `DOCS/Unified_ERD.md` — data model
