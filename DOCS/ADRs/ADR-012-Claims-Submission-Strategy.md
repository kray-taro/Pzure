# ADR-012: Claims (SHA / Manual / API) Submission Strategy

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Gate 0 baseline. Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.

## 1. Context and Problem Statement

SHA processes claims via a Centralized Digital Platform, but credentialed API docs/sandbox must still be obtained. Private/employer payers differ.

## 4. Decision Outcome

**Chosen (proposed):** Generic configurable claims engine (payer/scheme/tariff) + manual/portal submission tracking + an adapter interface; plug SHA/private payer APIs when credentials confirmed. Do NOT make any payer API a hard MVP blocker. Claims are online-only.

## 5. Consequences

MVP is not blocked on any single payer's API readiness. Manual/portal submission is always available; API adapters slot in when credentials/sandbox are confirmed. Claims remain **online-only** (no offline submission).

## 6. Implementation Notes

- Generic **payer / scheme / tariff** configuration; claim readiness checklist; attachments from EMR/lab/pharmacy.
- Sequences: eligibility -> pre-authorisation -> submission -> status query -> reconciliation.
- **Adapter interface** per payer (SHA Centralized Digital Platform, private/employer payers); manual/portal tracking adapter as default.
- Error/rejection **code mapping** + resubmission workflow; FHIR bundle assessment for SHA where applicable.
