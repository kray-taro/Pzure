# ADR-009: Conflict Resolution Strategy

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Gate 0 baseline. Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Companion to ADR-008.

## 1. Context and Problem Statement

Offline append-only writes can collide on sync. No blind automatic merge is acceptable for clinical, stock, or financial data.

## 3. Considered Options

1. Last-write-wins.
2. Automatic field merge.
3. Entity-level policies + manual resolution queue.

## 4. Decision Outcome

**Chosen (proposed):** Entity-level policies — server-wins for cached reference data; branch-local stock reservation + negative-stock block; prescription lock to prevent double-dispense; clinical notes use addendum/manual resolution; lab corrections create new versions; eTIMS offline invoices queue with accountant exception report.

## 5. Entity-level resolution policies

| Data class | Policy on conflict |
| --- | --- |
| Cached reference/catalogue | **Server-wins** (client discards stale local copy) |
| Stock quantities | Branch-local reservation + **negative-stock block**; reconcile via stock-adjustment event |
| Prescriptions | **Dispense lock** to prevent double-dispense; second writer rejected to manual queue |
| Clinical notes | **No merge** — addendum model; collisions go to manual resolution |
| Lab results | Corrections create a **new version**; prior versions retained |
| eTIMS invoices (offline) | Queue and submit on reconnect; mismatches surface on accountant **exception report** |
| Payments | Never auto-merged; suspense workflow (see ADR-011) |

## 6. Consequences

No blind/last-write-wins merge for clinical, stock or financial data. Unresolvable conflicts never silently drop data; they route to an **admin resolution queue** with full audit trail (actor, before/after, decision).

## 7. Implementation Notes

- Resolution queue UI with side-by-side diff; every resolution writes an audit event. Idempotency via `idempotency_key` from ADR-008 prevents duplicate replays.
