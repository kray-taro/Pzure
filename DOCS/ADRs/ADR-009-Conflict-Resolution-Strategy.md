# ADR-009: Conflict Resolution Strategy

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Stub created to close B-007 (Gate 0). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.

## 1. Context and Problem Statement
Offline append-only writes can collide on sync. No blind automatic merge is acceptable for clinical, stock, or financial data.

## 3. Considered Options
1. Last-write-wins.
2. Automatic field merge.
3. Entity-level policies + manual resolution queue.

## 4. Decision Outcome
**Chosen (proposed):** Entity-level policies — server-wins for cached reference data; branch-local stock reservation + negative-stock block; prescription lock to prevent double-dispense; clinical notes use addendum/manual resolution; lab corrections create new versions; eTIMS offline invoices queue with accountant exception report.

## 6. Implementation Notes
* Conflicts route to an admin resolution queue with full audit.
