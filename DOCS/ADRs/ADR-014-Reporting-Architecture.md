# ADR-014: Reporting Architecture

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Stub created to close B-007 (Gate 0). Owning work item: [#54](https://gitlab.com/cricketaustin-group/Pzure/-/issues/54) Sprint 0A.

## 1. Context and Problem Statement
Running reports on transactional tables degrades operations. Reporting must be separated from MVP.

## 4. Decision Outcome
**Chosen (proposed):** Separate reporting schema / read models from MVP (materialised views/snapshots), read replica later. Dashboards consume cached snapshots; large reports generated async.

## 6. Implementation Notes
* ReportDefinition / ReportRun / Snapshot / Alert aggregates; export controls + data masking per role.
