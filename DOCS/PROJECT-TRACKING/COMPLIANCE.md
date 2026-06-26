# Compliance Frame

Pzure operates in **Kenya**. The governing data-protection regime is the
**Data Protection Act, 2019** (administered by the Office of the Data Protection
Commissioner) together with **Pharmacy & Poisons Board (PPB)** regulations for
regulated medicines. HIPAA/HITECH do **not** apply and must not be referenced in
code or documentation.

## Control mapping

| Requirement (DPA 2019 / PPB) | Control | Where |
|------------------------------|---------|-------|
| Protect personal/health data at rest | Field-level encryption | ADR-003 |
| Protect data in transit | TLS everywhere | Infra config |
| Accountability / access traceability | Immutable audit log on all PHI access | CONCURRENCY §5 |
| Access limited to authorized persons | RBAC + branch scoping | ADR-001, ADR-004 |
| Data minimization | Collect/retain only what a use case needs | Domain design rule |
| Control of regulated medicines | Pharmacist PIN step-up authorization | ADR-004 |
| Lawful processing / consent (comms) | Consent capture before SMS/WhatsApp | Module 9 (#36) |

## Standing rules

- No PHI/PII in logs, traces, error messages, or analytics events.
- No secrets in code; environment-based configuration only.
- Decryption of PHI is always audited.
