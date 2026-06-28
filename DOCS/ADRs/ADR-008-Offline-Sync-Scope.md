# ADR-008: Offline / Sync Scope

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Gate 0 baseline. Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Extends ADR-006; conflicts handled in ADR-009.

## 1. Context and Problem Statement

Branches face connectivity drops. Allowing arbitrary offline editing of clinical data is dangerous. Offline scope must be explicit and narrow.

## 2. Decision Drivers

- Patient safety; avoid unsafe merges.
- Branch operations must survive 0-4h outages.

## 3. Considered Options

1. Full offline for all modules.
2. No offline.
3. Narrow, per-entity offline scope (append-only) with degraded-mode tiers.

## 4. Decision Outcome
**Chosen (proposed):** Per-entity offline matrix — POS sales append-only; pharmacy dispense/stock movement limited append-only; clinical notes draft-only; lab results draft-only; claims and communication online-only; controlled meds strongly limited. Duration tiers: 0-4h normal, 4-24h restricted+alert, >24h critical-only, >48h escalation.

## 5. Per-entity offline matrix

| Domain | Offline capability |
| --- | --- |
| POS sales | Append-only capture; queue for sync; receipts marked provisional until synced |
| Pharmacy dispense / stock movement | Limited append-only against last-synced stock; negative-stock blocked |
| Controlled medicines | Strongly limited; pharmacist PIN still enforced; no offline override of registers |
| Clinical notes | **Draft-only** offline; finalisation requires sync |
| Lab results | **Draft-only** offline; verification/release online only |
| Claims | **Online-only** |
| Communication (SMS/WhatsApp) | **Online-only** (queued via outbox, sent when online) |
| Reference/catalogue data | Read-only cached snapshot |

## 6. Degraded-mode duration tiers

0-4h normal offline; 4-24h restricted + operator alert banner; >24h critical-only operations; >48h escalation to support and branch SOP.

## 7. Implementation Notes

- Append-only **sync event** model with `idempotency_key`, `branch_id`, `device_id`, `client_timestamp`, `server_timestamp`. IndexedDB queue per ADR-006. Conflicts resolved per **ADR-009**.
