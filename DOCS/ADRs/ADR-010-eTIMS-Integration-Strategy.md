# ADR-010: eTIMS Integration Strategy

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Tech Lead

> Stub created to close B-007 (Gate 0). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Related blocker: B-003 (#50).

## 1. Context and Problem Statement
KRA requires electronic tax invoices. The implementation path (Direct API / VSCU / OSCU / certified middleware) is undecided (B-003).

## 4. Decision Outcome
**Chosen (proposed):** Outbox-driven eTIMS adapter (no direct call-and-assume): invoice → outbox → adapter worker → eTIMS API → status callback/poll → invoice state update. Offline invoice queue + retry/backoff + rejection workflow + accountant exception screen + idempotency keys. Final path pending B-003 / #50.

## 6. Implementation Notes
* Sandbox + prod credentials; invoice + credit-note payload mapping; integration test pack.
