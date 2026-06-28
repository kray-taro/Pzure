# ADR-007: Encryption and Key Management

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Security Lead

> Gate 0 baseline. Owning work item: [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55) Sprint 0B. Extends ADR-003; resolves B-006 ([#53](https://gitlab.com/cricketaustin-group/Pzure/-/issues/53)).

## 1. Context and Problem Statement

Health data is sensitive personal data (Data Protection Act). ADR-003 set field-level AES-256-GCM for MVP with an env-based key; Module_X requires a defined upgrade path to managed key storage and rotation (also tracked in B-006).

## 2. Decision Drivers

- Kenya Data Protection Act (PII/PHI confidentiality).
- Tamper-proof, auditable storage; key rotation without re-encrypting all data.
- Client-owned Azure tenant.

## 3. Considered Options

1. Env-based AES key (MVP only).
2. Envelope encryption with Azure Key Vault-managed KEK + per-record DEK.
3. SQL TDE only.

## 4. Decision Outcome

**Chosen (proposed):** TLS in transit + SQL TDE at rest + field-level AES-256-GCM for selected PII/PHI, with **envelope encryption keys in Azure Key Vault** and a defined rotation schedule. HMAC search hashes for encrypted-field lookup.

## 5. Consequences

- **Positive:** PII/PHI confidential at rest and in transit; rotation without bulk re-encryption; client retains key custody in their Key Vault.
- **Negative:** Envelope encryption adds a KEK-unwrap call path and key-cache complexity; encrypted fields need HMAC hashes for equality search and cannot be range-queried.

## 6. Implementation Notes

- **MVP:** TLS 1.2+ in transit; Azure SQL **TDE** at rest; field-level **AES-256-GCM** for the designated PII/PHI columns (names, national ID, phone, diagnosis, results). Encryption key referenced from Key Vault, not committed.
- **Phase 3 upgrade:** envelope encryption — **KEK in Azure Key Vault**, per-record **DEK** wrapped by the KEK; cache unwrapped DEKs in memory only.
- **Search:** store deterministic **HMAC-SHA256** hashes for encrypted fields that need lookup.
- **Rotation:** scheduled KEK rotation (e.g. annual) + on-incident rotation; Key Vault **soft delete + purge protection** on; managed identity for app->Key Vault.
- **Runbooks:** key-rotation runbook and key-compromise runbook required before production.

## 7. Compliance

Kenya Data Protection Act (data confidentiality, security safeguards). Pairs with ADR-019 (retention) and ADR-020 (masking/export).
