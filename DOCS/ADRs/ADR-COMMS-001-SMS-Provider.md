# ADR-COMMS-001: SMS Provider

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Solution Architect / BA

> Resolves B-005 ([#52](https://gitlab.com/cricketaustin-group/Pzure/-/issues/52)) SMS aspect. Parent strategy: ADR-013. Owning work items: Sprint 27/28 ([#36](https://gitlab.com/cricketaustin-group/Pzure/-/issues/36), [#37](https://gitlab.com/cricketaustin-group/Pzure/-/issues/37)).

## 1. Context
SMS is MVP-required. Provider must be swappable via the SMS adapter (ADR-013), not hard-coded.

## 4. Decision Outcome
**Chosen:** **Africa's Talking** as the default MVP SMS provider, unless client procurement rejects it.
- **Reason:** Kenya presence, SMS API, sender ID support, delivery callbacks, two-way SMS.
- **Alternatives (adapter-swappable):** Twilio, Infobip, Celcom, Advanta, local telco aggregator.

## 5. Required before implementation
- Client account created; sender ID requested/approved; SMS pricing confirmed.
- Delivery-report callback confirmed; inbound SMS / STOP support confirmed; webhook URLs confirmed.
- DPA / data-processing terms reviewed; **production API credentials stored in Key Vault**.

## 6. MVP features
Appointment reminders, refill reminders, lab-result-ready notices, payment prompts, receipts/links, STOP opt-out, delivery status, incoming replies, failure handling.

## 7. STOP handling
`STOP` → opt out of triggering category; `STOP ALL` → opt out of all non-essential SMS; `START` → re-consent/preference flow; `HELP` → route to human inbox.
