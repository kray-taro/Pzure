# ADR-020: Patient Data Masking and Export Control

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Security / Privacy Lead

> Gate 0 baseline. Owning work item: [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55) Sprint 0B. Pairs with ADR-007 and ADR-019.

## 1. Context and Problem Statement
Sensitive patient data must be masked for unauthorised roles, and exports of sensitive reports must be controlled and logged.

## 4. Decision Outcome
**Chosen (Approved):**
- **Masking:** role/report-based masking of sensitive fields (national ID, full diagnosis, results) for roles without explicit view permission; masking applied at the read/report layer.
- **Export control:** sensitive-report export requires **permission + reason**, logged to the **data-access log**; **bulk export** triggers an approval workflow.
- **Break-glass:** emergency access to masked/restricted data raises a **critical audit event** and notifies the security owner.

## 5. Consequences
Strong privacy posture and traceability. Adds friction to legitimate bulk exports (approval step) and requires masking rules per role/report.

## 6. Implementation Notes
* Masking policy table keyed by role + field + report; data-access log is append-only (ADR-019).
* Export approval workflow with requester/approver/reason; exported files watermarked/branch-scoped where feasible.
* Aligns with Kenya Data Protection Act; complements field encryption (ADR-007).
