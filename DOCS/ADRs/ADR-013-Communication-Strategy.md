# ADR-013: WhatsApp / SMS Communication Strategy

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Solution Architect

> Stub created to close B-007 (Gate 0). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Related blocker: B-005 (#52).

## 1. Context and Problem Statement
Patient messaging involves personal/health data, consent, and regulated health-product advertising. Providers not yet selected (B-005).

## 4. Decision Outcome
**Chosen (proposed):** Consent-led outbound via SMS adapter + WhatsApp Cloud API (templates, webhook verification, token mgmt), all through outbox → adapter → delivery webhook → event log. Per-type+channel consent, easy opt-out, health-data minimisation, block prescription-medicine promotion unless approved. Provider selection pending B-005 / #52.

## 6. Implementation Notes
* Template approval lifecycle; incoming message routing; sensitive-content suppression.
