# ADR-013: WhatsApp / SMS Communication Strategy

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Resolves B-005 ([#52](https://gitlab.com/cricketaustin-group/Pzure/-/issues/52)). Provider-specific decisions in **ADR-COMMS-001** (SMS) and **ADR-COMMS-002** (WhatsApp). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.

## 1. Context and Problem Statement
Patient messaging involves personal/health data, consent, and regulated health-product advertising.

## 4. Decision Outcome
**Chosen (Approved):** Adapter-based, consent-led messaging; provider choice is **never hard-coded**.
- **Adapters:** `SmsProviderAdapter`, `WhatsAppProviderAdapter`, `InboundMessageAdapter`, `DeliveryReceiptAdapter`, `OptOutProcessor`. Adapter contract: `sendMessage`, `sendTemplateMessage`, `sendOtp`, `queryMessageStatus`, `processDeliveryWebhook`, `processInboundWebhook`, `registerOptOut`.
- **Flow:** outbox → adapter → delivery webhook → event log (per ADR-005).
- **Consent** stored by patient, channel, message purpose, wording version, capture source, timestamp. SMS consent ≠ WhatsApp consent; marketing consent ≠ clinical-reminder consent. Mandatory STOP/opt-out and inbound-reply routing (urgent symptom → clinical escalation; result query → no result disclosure).
- **Templates** versioned and approval-controlled; block prescription-medicine promotion unless approved.
- **Credentials in Key Vault only;** webhook URLs are production HTTPS endpoints in the client Azure tenant.

## 6. Implementation Notes
* Template approval lifecycle; incoming message intent routing; sensitive-content suppression; required delivery-receipt fields (provider_message_id, status, error_code/message, cost_estimate, sent_at, delivered_at, raw_response_json).

## 6. Implementation Notes
* Template approval lifecycle; incoming message routing; sensitive-content suppression.
