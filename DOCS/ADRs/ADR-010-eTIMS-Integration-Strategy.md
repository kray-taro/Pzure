# ADR-010: eTIMS Integration Strategy

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Tech Lead

> Gate 0 baseline. Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Resolves B-003 ([#50](https://gitlab.com/cricketaustin-group/Pzure/-/issues/50)).

## 1. Context and Problem Statement
KRA requires electronic tax invoices. The implementation path (Direct API / VSCU / OSCU / certified middleware) is undecided (B-003).

## 4. Decision Outcome
**Chosen (Approved):** **Software VSCU** (Virtual Sales Control Unit) integrated via an **outbox-driven eTIMS adapter** (no direct call-and-assume).
- Path (B-003): software VSCU; use **arbitrary/sandbox credentials until KRA approval**, then swap to approved credentials from Key Vault.
- Flow: invoice -> outbox -> adapter worker -> VSCU/eTIMS API -> status callback/poll -> invoice state update.
- Offline invoice queue + retry/backoff + rejection workflow + accountant **exception screen** + **idempotency keys**.

## 5. Consequences
Decouples checkout from KRA latency/availability; invoices never silently lost. Requires reconciliation of queued offline invoices and an exception path for rejections.

## 6. Implementation Notes
* Sandbox + prod credentials in **Key Vault**; invoice + credit-note payload mapping; signing/QR on receipt; integration test pack; eTIMS status chip in POS (per Module 10).
* Before go-live: obtain approved VSCU credentials and run end-to-end signing test.
