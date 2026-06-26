# Pzure Backlog

Module-level epics and their primary scope. Each module should become a GitLab **Epic**; major workstreams become **Issues** linked to sprints in `ROADMAP.md`. Track created work items in `WORK-ITEMS.md`.

## Foundation epics (cross-cutting)

| Epic | Scope | ADR |
| --- | --- | --- |
| Branch-aware multi-tenancy | `organisation_id`/`branch_id` scoping, global query interceptors | ADR-001 |
| Authentication & RBAC | Keycloak OIDC, JWT branch claims, pharmacist PIN override | ADR-002, ADR-004 |
| Field-level encryption | AES-256-GCM for PII/PHI, CryptoService, HMAC search hashes | ADR-003 |
| Integration outbox & queue | Transactional outbox + BullMQ/Redis, DLQ, idempotency | ADR-005 |
| Offline & sync | Degraded offline mode, IndexedDB queue, conflict reconciliation | ADR-006 |
| Audit & data-access logging | Financial/clinical/pharmacy/claims action logs, access logs | - |
| DevSecOps & environments | CI/CD, Dev/Staging/UAT, monitoring, backup/DR | - |

## Module epics

| # | Module | Primary scope |
| --- | --- | --- |
| 1 | Organisation & Licensing | Business/PPB/KMPDC/KMLTTB licences, professionals, contracts, compliance blockers |
| 2 | POS, Billing, Invoicing & Payments | POS, cart, receipts, M-Pesa STK/C2B, shift close, eTIMS invoicing |
| 3 | Pharmacy Dispensing | Prescription intake, pharmacist approval, batch/label dispensing, controlled meds |
| 4 | Inventory, Procurement, Stock Control & Traceability | PO/GRN, stock ledger, transfers, counts, expiry/recall/cold-chain |
| 5 | Clinic EMR | Registration, queue, triage, notes, diagnosis, orders, referrals, certificates |
| 6 | Lab-lite | Test catalogue, orders, samples, results, verification, external send-outs |
| 7 | Claims & Insurance | Payers/schemes/tariffs, pre-auth, claim bundle, submission, denials, reconciliation |
| 8 | Reporting & Analytics | Operational reports, dashboards, scheduled reports, export controls |
| 9 | Patient Communication, Notifications, Payments & Loyalty | Consent, SMS/WhatsApp, reminders, payment prompts, loyalty |
| 10 | Frontend Framework & Design System | Component library, responsive layout, POS touch UX |

## Master-data workstream

Product, medicine, service, lab-test, supplier, staff, price list, payer/scheme, tariff, opening-stock templates + bulk import tools + validation + approval workflow (Sprint 6 onward).
