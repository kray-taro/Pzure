# Pzure Threat Model (STRIDE) — Gate 0B

**Scope:** authentication/identity, authorization, PII/PHI confidentiality, audit
integrity, regulated-action non-repudiation. **Owning issue:** [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55).
**Method:** STRIDE per trust boundary. **Status:** Approved (Gate 0B).

**Legend:** `[x]` = control **implemented and verified**; `[ ]` = control
**designed/ratified but not yet implemented** (implementation tracked in the
referenced issue, typically [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40)). Checkmarks therefore reflect *current* posture,
not intent.

## Trust boundaries
1. Browser SPA ↔ API (NestJS) — public internet, TLS.
2. API ↔ Keycloak (OIDC) — token issuance/validation.
3. API ↔ Azure SQL (private endpoint, TDE).
4. API ↔ Azure Key Vault (managed identity) — encryption keys.
5. API ↔ outbox/queue ↔ external integrations (eTIMS, M-Pesa, SHA, SMS/WhatsApp).

## STRIDE checklist

### Spoofing (identity)
- [x] OIDC via Keycloak; no hand-rolled auth (ADR-002).
- [x] Access token in memory only (never `localStorage`); refresh token HttpOnly/Secure/SameSite cookie.
- [ ] MFA required for privileged roles (admin, pharmacist) — **designed, not yet enforced**; rollout tracked in [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40).
- [x] Pharmacist PIN (bcrypt/Argon2) distinct from password; 5-attempt lockout → 15 min (ADR-004).

### Tampering (integrity)
- [x] TLS 1.2+ in transit; SQL TDE at rest; field AES-256-GCM for PII/PHI (ADR-003/007).
- [x] Append-only audit + data-access logs (no in-place update/delete).
- [x] JWT signature validated server-side; branch claim not trusted from client input.
- [x] Input validation pipes + idempotency keys on state-changing endpoints.

### Repudiation (non-repudiation)
- [x] Regulated actions record signed_by / signed_at / method, device_id, branch_id (ADR-004).
- [x] Every PIN attempt (success + failure) emits `audit_security_events`.
- [x] Append-only logs make staff actions attributable even on shared terminals.

### Information disclosure (confidentiality)
- [x] Field-level encryption for `patient_*` + `emr_clinical_notes` (ADR-003/007); enforced by the `@pzure/security` contract test.
- [x] HMAC-SHA256 search hashes instead of plaintext for searchable encrypted fields.
- [x] Role/report-based masking; bulk export needs approval + reason; break-glass raises a critical audit event (ADR-020).
- [x] CORS allowlist; least-privilege DB and Key Vault (managed identity) access.
- [ ] Global query interceptor enforces row-level `organisation_id`/`branch_id`
  scoping on **every** transactional read/write; a missing `branch_id` filter is
  the platform's primary **cross-tenant data-leak** risk (ADR-001). Verified by
  integration tests — implementation tracked in [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40).

### Denial of service (availability)
- [x] API rate limits + request validation.
- [x] Outbox/queue decouples external-integration failures from user requests (ADR-005).
- [x] Backup/DR targets per ADR-016 (RPO ≤15 min, RTO ≤4h); restore drills in [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40).

### Elevation of privilege (authorization)
- [x] RBAC: role × branch × module × action; `@RequireRole` guards (ADR-004).
- [x] Branch scoping from JWT `active_branch_id` / `allowed_branches` (ADR-001); server re-checks membership.
- [x] Cashier cannot bypass clinical warnings (PIN override is pharmacist-bound).
- [x] CI: full SAST + dependency scanning + secret detection block vulnerable code/deps from merging.
- [ ] Corporate/cross-branch roles that legitimately bypass single-branch
  scoping are an elevation-of-privilege surface; such access is least-privilege,
  time-bounded where possible, and **every use is logged** to
  `audit_security_events` (ADR-001) — enforcement tracked in [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40).

## Residual risks / follow-ups (→ #40)
- 4-digit PIN brute-force surface (mitigated by lockout + audit; consider rate-limit per device).
- MFA enforcement rollout and break-glass UX not yet implemented.
- Data-access anomaly scoring (queue → audit worker → risk scoring) is designed; implementation in the hardening lane.
