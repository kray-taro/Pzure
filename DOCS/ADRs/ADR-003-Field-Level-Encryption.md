# ADR-003: Field-Level Encryption & Key Management

**Status:** Approved  
**Date:** 2026-05-22  
**Author(s):** Solutions Architect

## 1. Context and Problem Statement

The Kenya Data Protection Act requires strict safeguarding of personally identifiable information (PII) and protected health information (PHI). While Transparent Data Encryption (TDE) protects the database files at rest on the disk, it does not prevent a developer or DBA with database access from querying sensitive data in plaintext.

We need a strategy for field-level encryption that protects highly sensitive data from unauthorized direct database access, while balancing the MVP constraint of zero-budget infrastructure (avoiding expensive commercial KMS tools if possible).

## 2. Decision Drivers

- **Compliance:** Must comply with Kenya Data Protection Act and PPB guidelines.
- **Cost:** Avoid expensive managed Key Management Services (KMS) for the MVP phase.
- **Performance:** Encryption/decryption must not introduce noticeable latency to the EMR or POS workflows.
- **Searchability:** Encrypted fields are generally unsearchable. We must carefully choose which fields to encrypt to avoid breaking core application workflows (e.g., patient search).

## 3. Considered Options

1. **SQL Server Always Encrypted:** Native SQL Server feature. High security, but requires specific database drivers and can complicate the CI/CD pipeline and local development.
2. **Application-Layer Envelope Encryption:** NestJS handles encryption before data reaches the database. A Master Key Encrypting Key (KEK) protects Data Encrypting Keys (DEKs).
3. **Deterministic Application Encryption:** A simpler application-layer encryption using AES-256-GCM with a single environment-based master key.

## 4. Decision Outcome

**Chosen option:** Option 3 (Deterministic Application Encryption) for the MVP, with an architecture that allows migrating to Option 2 (Envelope Encryption) later.

For the MVP, we will use a single strong AES-256-GCM symmetric key injected via environment variables. NestJS will intercept specific entity fields (e.g., using TypeORM transformers or Prisma middlewares) to encrypt them on write and decrypt on read.

### Fields Designated for Encryption

- `patient.national_id`
- `patient.phone_primary` (if not used as the primary search index, or we hash a search-friendly version)
- `emr.clinical_notes.note_text`

### Positive Consequences

- **Zero Infrastructure Cost:** No dependency on Azure Key Vault or AWS KMS for the MVP.
- **Simple Implementation:** Easily managed via standard Node.js `crypto` library.
- **Data Security:** DB backups and direct SQL queries will not expose the most sensitive PHI.

### Negative Consequences

- **Key Rotation:** Rotating a single master key requires decrypting and re-encrypting the entire database. (This is acceptable for the MVP scale but must be upgraded to Envelope Encryption in Phase 3).
- **Searchability:** We cannot do `LIKE '%text%'` searches on encrypted fields. If we must search by an encrypted field for exact-match (equality) lookup, we store a deterministic **keyed HMAC-SHA256** hash of the value alongside the ciphertext (see §4.1).

### 4.1 Exact-match search hashes (amendment, ratified via #65)

Product confirmed that **national-ID lookup is a genuine MVP requirement**: reception and clinicians look patients up by national ID. For **minors without a national ID, the birth certificate number is the equivalent key**. We therefore authorize deterministic search hashes for `national_id` and `birth_cert_no`, in addition to the `phone_primary` hash already implied above.

A naive deterministic HMAC over a low-entropy identifier (a national ID or birth certificate number) is **offline-enumerable**: an attacker with read access to the hash column (the direct-DB / DBA threat of §1) can dictionary the identifier space and confirm whether a given person is a patient, defeating field encryption for equality. To mitigate this, every deterministic search hash MUST be a **keyed HMAC-SHA256 using a secret pepper held outside the database** (environment / Azure Key Vault per ADR-007). A DB-only attacker, lacking the pepper, cannot brute-force the hash.

This keyed-pepper requirement applies to **all** deterministic search hashes in the PII registry (`national_id`, `birth_cert_no`, `patient_number`, `phone_primary`, `dob`, `email`, `mpesa_receipt_number`); see ADR-007 §6. The corresponding `*_hash` columns are recorded in `Unified_ERD.md`, and the PII registry may re-enable `searchHash: true` for `national_id` (and `birth_cert_no`) on this basis.

## 5. Implementation Notes

- Implement a `CryptoService` in NestJS.
- Use deterministic encryption (or store the IV alongside the ciphertext) for fields that require exact-match querying.
- Ensure the master key is strictly managed via GitHub Secrets during CI/CD and is never committed to source control.
