# ADR-008: Offline / Sync Scope

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Stub created to close B-007 (Gate 0). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Extends ADR-006.

## 1. Context and Problem Statement
Branches face connectivity drops. Allowing arbitrary offline editing of clinical data is dangerous. Offline scope must be explicit and narrow.

## 2. Decision Drivers
* Patient safety; avoid unsafe merges.
* Branch operations must survive 0-4h outages.

## 3. Considered Options
1. Full offline for all modules.
2. No offline.
3. Narrow, per-entity offline scope (append-only) with degraded-mode tiers.

## 4. Decision Outcome
**Chosen (proposed):** Per-entity offline matrix — POS sales append-only; pharmacy dispense/stock movement limited append-only; clinical notes draft-only; lab results draft-only; claims and communication online-only; controlled meds strongly limited. Duration tiers: 0-4h normal, 4-24h restricted+alert, >24h critical-only, >48h escalation.

## 6. Implementation Notes
* Append-only sync event model with idempotency_key. See ADR-009 for conflicts.
