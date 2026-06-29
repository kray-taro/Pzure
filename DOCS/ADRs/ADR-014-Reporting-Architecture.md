# ADR-014: Reporting Architecture

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Gate 0 baseline. Owning work item: [#54](https://gitlab.com/cricketaustin-group/Pzure/-/issues/54) Sprint 0A.

## 1. Context and Problem Statement

Running reports on transactional tables degrades operations. Reporting must be separated from MVP.

## 4. Decision Outcome

**Chosen (proposed):** Separate reporting schema / read models from MVP (materialised views/snapshots), read replica later. Dashboards consume cached snapshots; large reports generated async.

## 5. Consequences

Operational (POS/clinical) performance is protected from heavy report queries. Reports read slightly stale snapshots; near-real-time analytics deferred to a read replica in a later phase.

## 6. Implementation Notes

- Separate **reporting schema / read models**: materialised views + scheduled snapshots; large reports generated **async** and downloaded.
- Aggregates: `ReportDefinition`, `ReportRun`, `Snapshot`, `Alert`.
- All exports honour **ADR-020** (role masking + export approval/logging). Branch-scoped per ADR-001.
- NFR target: dashboards from cached snapshots; heavy exports must not block transactional DB.
