# Gate 0B — Security, Privacy & Identity Review (Ratification Record)

**Owning issue:** [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55) (Sprint 0B) · Parent: [#1](https://gitlab.com/cricketaustin-group/Pzure/-/issues/1) · Hardening lane: [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40)
**Reviewer role:** Security Analyst · **Date:** 2026-06-28 · **Status:** Ratified

Gate 0B confirms that no patient, payment, pharmacy or claim feature proceeds
without an approved security architecture. This record ratifies the security/
identity ADRs, registers the STRIDE threat model, and documents the audit /
data-access-log requirement.

## 1. ADRs ratified

| ADR | Decision | Ratification notes |
| --- | --- | --- |
| **ADR-002** | Keycloak OIDC; in-memory access token (~15 min), rotating refresh in HttpOnly/Secure/SameSite cookie; custom JWT branch claims (`active_branch_id`, `allowed_branches`); pharmacist PIN override | Confirmed. Branch claims drive ADR-001 tenant scoping. Access ≤15 min + rotating revocable refresh + idle/absolute session limits accepted. |
| **ADR-003** | Field-level **AES-256-GCM** for designated PII/PHI in the MVP (env/Key-Vault-referenced key); HMAC search hash for exact-match lookup | Confirmed as the **now** state. Single-key rotation cost accepted at MVP scale. |
| **ADR-007** | TLS in transit + SQL TDE at rest + field AES-256-GCM, upgrading to **Azure Key Vault envelope encryption (KEK/DEK)** with scheduled + on-incident **rotation** in **Phase 3** | Confirmed as the upgrade path. `CryptoService` abstraction must allow the KEK/DEK swap without schema rework. |
| **ADR-004** | Keycloak RBAC (role × branch × module × action) + application-layer 4-digit **pharmacist PIN** (bcrypt/Argon2) for regulated overrides; 5-attempt lockout → 15 min; every attempt audited | Confirmed. PIN is distinct from the password and tied to non-repudiation signature fields. |

All four ADRs are already `Approved` in `DECISION-LOG.md`; this Gate 0B review
formally signs them off as the security baseline.

## 2. Blockers confirmed closed

- **B-002** — auth: generic RBAC vs Keycloak — 🟢 Resolved ([#49](https://gitlab.com/cricketaustin-group/Pzure/-/issues/49), closed).
- **B-006** — key-management upgrade path — 🟢 Resolved ([#53](https://gitlab.com/cricketaustin-group/Pzure/-/issues/53), closed).

## 3. Verification loop (Gate 0B)

| Check | Where | Status |
| --- | --- | --- |
| STRIDE threat-model checklist | `THREAT-MODEL.md` (this MR) | Done |
| Secret-detection gate upgraded to **full SAST + dependency scanning** | `.gitlab-ci.yml` on `develop` (`feat/security-gate-sast`) | Done |
| Automated test asserting `patient_*` / `emr_clinical_notes` columns are flagged for field encryption | `packages/security` on `develop` (`feat/security-gate-sast`) | Done |
| Audit + patient data-access-log requirement documented | `AUDIT-AND-DATA-ACCESS-LOG.md` (this MR) | Done |

> The CI + automated-test items live on `develop` (where `.gitlab-ci.yml` and the
> test runner are); the documentation/ratification items live on `DOCS`. The two
> MRs together close the Gate 0B verification loop.

## 4. Exit decision

Gate 0B is **ratified**. Combined with Gate 0A (data/ERD/tenancy) and 0C
(offline/integration/NFR/DR), module lanes may proceed under the approved
security architecture. Residual hardening (MFA enforcement, break-glass UX,
anomaly alerting, restore drills) is carried by [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40).
