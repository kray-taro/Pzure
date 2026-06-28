# ADR-007: Encryption and Key Management

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Security Lead

> Stub created to close B-007 (Gate 0). Owning work item: [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55) Sprint 0B. Supersedes/extends ADR-003.

## 1. Context and Problem Statement
Health data is sensitive personal data (Data Protection Act). ADR-003 set field-level AES-256-GCM for MVP with an env-based key; Module_X requires a defined upgrade path to managed key storage and rotation (also tracked in B-006).

## 2. Decision Drivers
* Kenya Data Protection Act (PII/PHI confidentiality).
* Tamper-proof, auditable storage; key rotation without re-encrypting all data.
* Client-owned Azure tenant.

## 3. Considered Options
1. Env-based AES key (MVP only).
2. Envelope encryption with Azure Key Vault-managed KEK + per-record DEK.
3. SQL TDE only.

## 4. Decision Outcome
**Chosen (proposed):** TLS in transit + SQL TDE at rest + field-level AES-256-GCM for selected PII/PHI, with **envelope encryption keys in Azure Key Vault** and a defined rotation schedule. HMAC search hashes for encrypted-field lookup.

## 6. Implementation Notes
* Migrate from env key (ADR-003) to Key Vault KEK before Phase 3.
* Define rotation cadence + incident-rotation runbook. Close B-006 here.
