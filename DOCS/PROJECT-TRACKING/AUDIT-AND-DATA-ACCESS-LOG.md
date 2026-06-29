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
  ip_address, user_agent, target_entity + id, outcome, reason (where
  applicable), occurred_at, request_id. Regulated actions add signed_by /
  signed_at / method. (`ip_address` + `user_agent` are required for KDPA / PPB
  attribution where `device_id` alone is insufficient, e.g. shared or
  unregistered terminals.)
- **Integrity (required):** write-once, no UPDATE/DELETE. Tamper-evidence is
  **mandatory**, not optional: a monotonic per-stream sequence number **and**
  periodic hash chaining (each record binds the prior record's hash), enforced
  at the storage layer (append-only / no-DELETE DB constraints or WORM). The
  chain head is checkpointed so any gap or rewrite is detectable on audit.

## 2. Patient data-access log (asynchronous pipeline)
- **Requirement:** viewing a sensitive patient record is logged **without
  slowing EMR/POS screens**.
- **Design:** read interceptor emits an access event → queue → audit worker →
  persistence → risk scoring (anomaly detection). Async so the read path is not
  blocked (ADR-005 outbox/queue pattern).
- **Delivery guarantee (required):** access events are persisted **at-least-once**
  via the transactional outbox (ADR-005), never best-effort fire-and-forget.
  The read may proceed once the event is durably enqueued in the same
  transaction as (or transactionally linked to) the read authorization; if the
  outbox write itself fails, the access is **denied** (fail-closed) so that no
  sensitive record is served without a guaranteed audit trail. Duplicate events
  are tolerated and de-duplicated downstream by `request_id`.
- **Captures:** who accessed which patient/record, when, from which branch/
  device, access reason where break-glass/masked-data is involved.
- **Retention:** governed solely by **ADR-019** (data retention & archival
  policy). ADR-019 is the single source of truth for concrete durations and the
  retention matrix; this document does not restate the figures so they cannot
  drift from the ADR.

## 3. Acceptance (mirrors #40)
- Sensitive-record view is logged.
- Bulk export requires approval + reason and is logged.
- Break-glass access creates a **critical** audit event and notifies the
  security owner.
- Unauthorized role is blocked and the denial is logged.
- Backup **restore test passes** (per ADR-016 RPO ≤ 15 min / RTO ≤ 4h; drill
  owned by [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40)) — the audit/access logs must survive and remain
  chain-verifiable after a restore.

## 4. Verification hook
- The PII/PHI encryption-scope contract test (`@pzure/security`, `develop`)
  guards the *confidentiality* invariant; this document defines the
  *accountability* invariant whose implementation is delivered under [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40).
