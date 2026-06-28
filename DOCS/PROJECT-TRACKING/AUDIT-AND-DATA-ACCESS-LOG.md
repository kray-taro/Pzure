# Audit & Patient Data-Access Logging — Requirement (Gate 0B)

**Owning issue:** [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55) · Implementation lane: [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40) · Pairs with ADR-004, ADR-019, ADR-020.
**Status:** Required (ratified at Gate 0B).

Kenya Data Protection Act and PPB controlled-medicine rules require that
sensitive actions and patient-record access are traceable. Two complementary,
**append-only** logs are mandatory before any feature touches patient/payment/
pharmacy/claim data.

## 1. Staff activity / security audit log (synchronous)
- **Table:** `audit_security_events` (append-only; no UPDATE/DELETE).
- **Captures:** authentication events, RBAC denials, every pharmacist-PIN
  attempt (success + failure), regulated-action signatures, break-glass access,
  export approvals, configuration/permission changes.
- **Fields (minimum):** event_type, actor_user_id, role, branch_id, device_id,
  target_entity + id, outcome, reason (where applicable), occurred_at,
  request_id. Regulated actions add signed_by / signed_at / method.
- **Integrity:** write-once; tamper-evident (sequence + periodic hash chaining
  recommended).

## 2. Patient data-access log (asynchronous pipeline)
- **Requirement:** viewing a sensitive patient record is logged **without
  slowing EMR/POS screens**.
- **Design:** read interceptor emits an access event → queue → audit worker →
  persistence → risk scoring (anomaly detection). Async so the read path is not
  blocked (ADR-005 outbox/queue pattern).
- **Captures:** who accessed which patient/record, when, from which branch/
  device, access reason where break-glass/masked-data is involved.
- **Retention:** per ADR-019 (health-data retention ≥ 20 years; access logs per
  the retention matrix).

## 3. Acceptance (mirrors #40)
- Sensitive-record view is logged.
- Bulk export requires approval + reason and is logged.
- Break-glass access creates a **critical** audit event and notifies the
  security owner.
- Unauthorized role is blocked and the denial is logged.

## 4. Verification hook
- The PII/PHI encryption-scope contract test (`@pzure/security`, `develop`)
  guards the *confidentiality* invariant; this document defines the
  *accountability* invariant whose implementation is delivered under [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40).
