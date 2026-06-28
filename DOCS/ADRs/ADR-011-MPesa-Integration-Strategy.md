# ADR-011: M-Pesa (Daraja) Integration Strategy

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Tech Lead

> Gate 0 baseline. Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Uses the outbox/adapter pattern from ADR-005.

## 1. Context and Problem Statement
M-Pesa is a primary payment rail via Safaricom Daraja. Needs reliable STK/C2B handling, callbacks, idempotency, and reconciliation.

## 4. Decision Outcome
**Chosen (proposed):** Daraja STK push + C2B confirmation + transaction-status query + reversal-ready flow, all via outbox/adapter with callback security validation, duplicate-callback + timeout strategy, idempotency, suspense-payment workflow, and M-Pesa-vs-POS reconciliation. Manual reference fallback when API unavailable.

## 5. Consequences
Reliable mobile-money capture with idempotent callbacks; suspense workflow prevents mis-allocation. Adds reconciliation overhead and callback-security handling.

## 6. Implementation Notes
* **STK push** sequence: invoice -> prompt(invoice_id, amount) -> Daraja -> pending -> validated callback -> payment allocation -> receipt.
* **C2B** confirmation + validation URLs; **transaction-status query**; **reversal-ready** flow.
* **Callback security:** validate source, verify signature/shortcode, reject spoofed callbacks.
* **Reliability:** duplicate-callback dedupe via idempotency key; timeout/poll fallback; suspense-payment workflow for unmatched receipts; daily **M-Pesa-vs-POS reconciliation** report.
* **Fallback:** manual reference entry when Daraja unavailable, flagged for later auto-match.
* Daraja consumer key/secret/passkey in **Key Vault**; M-Pesa status chip in POS (Module 10).
