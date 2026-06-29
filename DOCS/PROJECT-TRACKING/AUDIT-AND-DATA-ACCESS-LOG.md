# Audit & Patient Data-Access Logging — Requirement (Gate 0B)

**Owning issue:** [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55) · Implementation lane: [#40](https://gitlab.com/cricketaustin-group/Pzure/-/issues/40) · Pairs with ADR-004, ADR-019, ADR-020.
**Status:** Required (ratified at Gate 0B).

> **ADR values are indicative.** Any ADR parameter referenced below is for
> readability only; `DECISION-LOG.md` and the ADRs are the authoritative source
> of truth and override this document if they diverge.

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
- **Design:** read interceptor emits an access event into the transactional
  outbox, then an audit worker drains the outbox → persistence → risk scoring
  (anomaly detection). Two distinct phases (ADR-005 outbox/queue pattern):
  - **Enqueue is synchronous and transactional (fail-closed).** The access
    event is written to the outbox **in the same local DB transaction** as the
    read authorization, *before* the record is served. This phase is **not**
    fire-and-forget.
  - **Downstream processing is asynchronous.** Worker drain, persistence to the
    access-log store, and risk scoring run off the read path, so EMR/POS screens
    are **not** slowed by audit processing.
- **Delivery guarantee (required):** access events are persisted **at-least-once**
  via the transactional outbox (ADR-005), never best-effort fire-and-forget.
  The read may proceed only once the event is durably committed to the outbox in
  the same transaction as the read authorization; if that outbox write fails the
  access is **denied** (fail-closed) so no sensitive record is served without a
  guaranteed audit trail. Because the write shares the read's local DB
  transaction, it fails only when the database itself is unavailable (in which
  case the read fails regardless) — fail-closed without introducing a new
  availability single-point-of-failure beyond the database the read already
  depends on. Duplicate events are tolerated and de-duplicated downstream by the
  composite key `(request_id, target_entity, target_id)` (a single request may
  legitimately access multiple records, so `request_id` alone is insufficient).
- **Captures:** who accessed which patient/record, when, from which branch/
  device, access reason where break-glass/masked-data is involved.
- **Retention:** governed solely by **ADR-019** (data retention & archival
  policy). ADR-019 is the single source of truth for concrete durations and the
  retention matrix; this document does not restate the figures so they cannot
  drift from the ADR.

## 3. Acceptance (aligned with #40)

> This list is a **superset** of #40's acceptance criteria (it adds the
> break-glass/export items); it does not silently diverge — #40 remains the
> implementation-owning issue and should be kept in sync if either side changes.

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
