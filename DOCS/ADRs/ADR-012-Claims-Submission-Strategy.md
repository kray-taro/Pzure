# ADR-012: Claims (SHA / Manual / API) Submission Strategy

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Stub created to close B-007 (Gate 0). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.

## 1. Context and Problem Statement
SHA processes claims via a Centralized Digital Platform, but credentialed API docs/sandbox must still be obtained. Private/employer payers differ.

## 4. Decision Outcome
**Chosen (proposed):** Generic configurable claims engine (payer/scheme/tariff) + manual/portal submission tracking + an adapter interface; plug SHA/private payer APIs when credentials confirmed. Do NOT make any payer API a hard MVP blocker. Claims are online-only.

## 6. Implementation Notes
* Eligibility, pre-auth, submission, status-query sequences; error/rejection code mapping; FHIR bundle assessment.
