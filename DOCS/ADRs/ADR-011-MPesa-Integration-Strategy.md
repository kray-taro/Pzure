# ADR-011: M-Pesa (Daraja) Integration Strategy

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Tech Lead

> Stub created to close B-007 (Gate 0). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.

## 1. Context and Problem Statement
M-Pesa is a primary payment rail via Safaricom Daraja. Needs reliable STK/C2B handling, callbacks, idempotency, and reconciliation.

## 4. Decision Outcome
**Chosen (proposed):** Daraja STK push + C2B confirmation + transaction-status query + reversal-ready flow, all via outbox/adapter with callback security validation, duplicate-callback + timeout strategy, idempotency, suspense-payment workflow, and M-Pesa-vs-POS reconciliation. Manual reference fallback when API unavailable.

## 6. Implementation Notes
* STK sequence: invoice → prompt(invoice_id, amount) → Daraja → pending → validated callback → payment allocation → receipt.
