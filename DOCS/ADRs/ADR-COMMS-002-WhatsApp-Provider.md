# ADR-COMMS-002: WhatsApp Provider

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Solution Architect / BA

> Resolves B-005 ([#52](https://gitlab.com/cricketaustin-group/Pzure/-/issues/52)) WhatsApp aspect. Parent strategy: ADR-013. Owning work items: Sprint 27/28 ([#36](https://gitlab.com/cricketaustin-group/Pzure/-/issues/36), [#37](https://gitlab.com/cricketaustin-group/Pzure/-/issues/37)).

## 1. Context

WhatsApp is MVP-required and must use an official WhatsApp Business Platform BSP via the WhatsApp adapter (ADR-013).

## 4. Decision Outcome

**Chosen:** Use an **official WhatsApp Business Platform BSP**. Final vendor selected by client procurement.

- **Shortlist:** Africa's Talking (if commercially suitable), Infobip, Twilio, MessageBird/Bird, 360dialog, Vonage.
- **Selection criteria:** Kenya support, WABP onboarding, template approval support, delivery reports, inbound webhooks, pricing, support SLA, DPA, API docs.
- **Guidance:** one-vendor-for-both → evaluate Africa's Talking first; if WhatsApp reliability/templates/enterprise support dominate → Infobip or Twilio.

## 5. Templates
All business-initiated messages must use **approved templates**. Lifecycle: draft → internal review → DPO/privacy → clinical/pharmacy (if health) → legal/compliance (if promo) → submit to BSP/Meta → approved → active → retired.
MVP categories: appointment reminder (Utility), refill (Utility), lab result ready (Utility), payment prompt (Utility), receipt (Utility), OTP (Authentication), health education (Marketing/Utility per BSP), loyalty/offer (Marketing) — each with named approvers.

## 6. Consent, opt-out, inbound

WhatsApp consent is distinct from SMS consent. Support STOP / STOP ALL / unsubscribe option / human-inbox opt-out. Inbound intents routed per ADR-013 (result query → no result disclosure; urgent symptom → clinical escalation).

## 7. Required before implementation

BSP account + WABP onboarding; approved templates; delivery + inbound webhooks (production HTTPS in client Azure tenant); pricing/SLA/DPA; **credentials in Key Vault only**.
