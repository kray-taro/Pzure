# ADR-019: Data Retention and Archival Policy

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Security / Privacy Lead

> Gate 0 baseline. Owning work item: [#54](https://gitlab.com/cricketaustin-group/Pzure/-/issues/54) Sprint 0A. Pairs with ADR-007 and ADR-020.

## 1. Context and Problem Statement
Health data has long retention expectations (Digital Health regs reference ≥20 years) that differ from operational/audit logs.

## 4. Decision Outcome
**Chosen (Approved):** Retention matrix by data class.

| Data class | Retention |
| --- | --- |
| Clinical / health records | Long-retention, **>= 20 years** (Digital Health regs) |
| Financial / tax (invoices, eTIMS, payments) | Per **KRA** requirements |
| Audit & data-access logs | Append-only, backup-protected; retained per compliance |
| Operational / application logs | Shorter operational window (e.g. 30-90 days hot, then archive) |
| Backups | Per ADR-016 (PITR >= 35 days) |

## 5. Consequences
Storage grows with long clinical retention; cold/archival tiering controls cost. Deletion is constrained by retention and legal hold.

## 6. Implementation Notes
* **Archival tier** for cold data (Storage cool/archive); restore path documented.
* Document-status **`legal_hold`** suppresses deletion/archival.
* Retention enforced by scheduled jobs; every purge/archival writes an audit event.
