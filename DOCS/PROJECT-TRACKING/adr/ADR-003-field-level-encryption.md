# ADR-003: Field-level encryption for PHI/PII

- **Status:** Accepted
- **Deciders:** Solution Architect, Security
- **Related:** #1, #40, B-006 (#53), COMPLIANCE.md

## Context

Kenya DPA 2019 requires protection of personal and health data at rest. Full-disk
encryption alone is insufficient for high-sensitivity fields (patient identifiers,
diagnoses, contact details).

## Decision

Apply **application-level field encryption** to designated PHI/PII columns via an
`EncryptionService` abstraction (envelope encryption: a data-encryption key per
record/field, wrapped by a key-encryption key held in a KMS). The concrete KMS
binding is deferred to B-006 (#53); the abstraction is defined now so callers do
not change when the KMS is selected.

## Consequences

- Encrypted fields are not directly queryable; searchable attributes use
  deterministic encryption or a separate blind index where lookup is required.
- Key rotation must be supported by the KEK layer (B-006).
- All decryption of PHI emits an audit event (see CONCURRENCY/COMPLIANCE).
