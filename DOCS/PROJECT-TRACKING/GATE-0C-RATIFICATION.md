# Gate 0C Ratification - Offline, Integration, NFR, Deployment & DR

**Status:** Ratified for Gate 0C  
**Date:** 2026-06-28  
**Owning work item:** [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C (blocker B-007)  
**Method:** Reviewed per *Designing Data-Intensive Applications* (DDIA) - reliability, async/streaming integration, and per-entity consistency made explicit and testable.

This record ratifies the Sprint 0C platform ADRs and turns the NFRs into machine-checkable SLOs. The DR contradiction is resolved in ADR-016 Section 7 and enforced by `scripts/check-dr-consistency.sh`.

## 1. Integration: outbox + async building block (ADR-005, 010, 011, 012)

**Ratified.** Every external integration uses the single DDIA async/streaming pattern - never call-and-assume:

```text
business txn -> audit.integration_outbox (same SQL txn)
            -> poller -> queue -> adapter worker -> external API
            -> callback / status poll -> integration event log -> business state update
```

* **ADR-005 (outbox + BullMQ):** the outbox row is written in the *same* SQL transaction as the business entity, giving at-least-once delivery with zero loss; the queue absorbs external-API latency so POS checkout stays sub-2s. Adapters must be **idempotent** (idempotency key) so a redelivery never double-submits an invoice/payment.
* **BullMQ -> Azure Service Bus migration trigger (made explicit):** BullMQ/Redis is the MVP transport (D-001). The transport is abstracted behind the outbox adapter, so migration is a transport swap, not a rewrite. **Migrate to Azure Service Bus when any one of these triggers fires:**
  1. Enterprise/compliance policy mandates a managed broker with audited DLQ retention;
  2. Cross-region or multi-subscription delivery is required (Redis is single-region MVP);
  3. Sustained queue depth or redelivery rates exceed Redis/BullMQ operational headroom (e.g. backlog alert tripping repeatedly under the 10->50 branch growth);
  4. The client's Azure landing zone requires broker-level RBAC / private-endpoint isolation BullMQ cannot satisfy.
  Until a trigger fires, BullMQ remains authoritative (avoids premature cost/ops burden).
* **ADR-010 (eTIMS), ADR-011 (M-Pesa), ADR-012 (claims):** all ratified as outbox-adapter integrations with callbacks, idempotency, retry/backoff, DLQ, and reconciliation/exception screens. Claims remain **online-only** (ADR-012); eTIMS supports an offline invoice queue reconciled on reconnect.

## 2. Offline scope + conflict matrix - no blind last-write-wins (ADR-006, 008, 009)

**Ratified.** The offline model is the platform's bounded eventual-consistency zone (see also ADR-001 Section 6.3):

* **ADR-006 / ADR-008:** append-only event model in IndexedDB with `idempotency_key`, `branch_id`, `device_id`, `client_timestamp`, `server_timestamp`; narrow per-entity offline matrix (POS append-only; pharmacy dispense/stock movement limited append-only with negative-stock blocked; clinical notes and lab results draft-only; claims and communication online-only; controlled meds strongly limited). Duration tiers 0-4h / 4-24h / >24h / >48h.
* **ADR-009:** entity-level conflict policies with **no blind last-write-wins** - server-wins for cached reference data; negative-stock block + reconciliation for stock; dispense lock for prescriptions; addendum model for clinical notes; new-version for lab corrections; suspense workflow for payments. Unresolved conflicts route to an admin queue with full audit trail; `idempotency_key` makes replay safe.

## 3. Deployment & DR (ADR-015, 016)

**Ratified.** ADR-015 (client-owned tenant, Azure SQL DB private-endpoint, Container Apps, private-first landing zone, IaC) and ADR-016 (backup/DR) are approved. **DR contradiction resolved:** the single authoritative target is `RPO <= 15 min / RTO <= 4h` (ADR-016 Section 7), now identical across ADR-016, the Gate 0 checklist, and the B-004 row, and enforced by `scripts/check-dr-consistency.sh`. Restore-drill runbook checked in at `DR-RESTORE-RUNBOOK.md`.

## 4. NFRs as testable SLOs

Each NFR is restated as an SLO with a metric, target, and how it is verified. These are the acceptance gates for the platform; they are not aspirational.

| SLO | Metric | Target | Verification method |
| --- | --- | --- | --- |
| POS checkout | End-to-end checkout latency, **excluding** external eTIMS/M-Pesa response | **< 2 s** (p95) | Load test at 150 concurrent users; assert p95 in CI perf job |
| API latency | p95 latency for common reads/writes | **< 500 ms** | App Insights p95 dashboard + perf-test gate |
| POS scan/search | Cached-catalogue product lookup | < 500 ms (p95) | Perf test against cached catalogue |
| EMR visit open | Time to open a visit | < 3 s (p95) | Perf test |
| Claim validation | Outpatient claim validation | < 5 s (p95) | Perf test |
| Concurrency | Concurrent active users sustained without SLO breach | **>= 150** | Sustained-load soak test |
| Scale | Branches supported without re-architecture | **10 now, to 50** | Capacity model (ADR-001 partitioning) + load extrapolation |
| Uptime | Monthly availability | **99.5% MVP** (99.9% post-hardening) | Uptime monitor / error-budget report |
| RPO | Max data loss on DR | **<= 15 min** | DR restore drill (DR-RESTORE-RUNBOOK.md) |
| RTO | Max time to restore usable service | **<= 4 h** | DR restore drill (DR-RESTORE-RUNBOOK.md) |

> Boundary note: POS checkout and API SLOs exclude time spent awaiting external APIs precisely because ADR-005 moves that latency to the async outbox path. This is what makes the < 2 s / < 500 ms targets achievable and honest.

## 5. Verification loop - evidence

| Verification item | Status | Evidence |
| --- | --- | --- |
| DOCS CI green | Wired | `.gitlab-ci.yml` (DOCS workflow): dr-consistency + link-check + markdownlint |
| DR targets identical across ADR-016, Gate 0 checklist, B-004 | Done | `scripts/check-dr-consistency.sh` greps the canonical token in all three |
| Restore-drill runbook checked in | Done | `DOCS/PROJECT-TRACKING/DR-RESTORE-RUNBOOK.md` |
| Conflict matrix reviewed (no blind merge) | Done | Section 2 (ADR-006/008/009) |
| NFRs encoded as testable SLOs | Done | Section 4 |
| BullMQ -> Service Bus migration trigger explicit | Done | Section 1 |

## 6. Cross-references

* **ADR-005 / 010 / 011 / 012** - outbox + adapters (Section 1).
* **ADR-006 / 008 / 009** - offline scope + conflict policies (Section 2).
* **ADR-015 / 016** - deployment + DR (Section 3).
* **ADR-001 Section 6** - tenancy partitioning + consistency basis for the scale SLO (Gate 0A).
