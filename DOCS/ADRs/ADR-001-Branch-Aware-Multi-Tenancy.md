# ADR-001: Branch-Aware Multi-Tenancy

**Status:** Approved  
**Date:** 2026-05-22  
**Author(s):** Solutions Architect

## 1. Context and Problem Statement

Pzure will launch with 10 branches (starting with a 2-branch pilot) and aims to scale further. The system must support corporate-level reporting, cross-branch patient visits, branch-specific stock management, and strict data access controls per branch.

The key question is how to physically and logically isolate data between branches to ensure security, performance, and operational flexibility without introducing unnecessary maintenance overhead.

## 2. Decision Drivers

* **Consolidated Reporting:** Management needs real-time views across all branches without complex ETL pipelines.
* **Patient Mobility:** A patient registered at Branch A may visit Branch B. Their EMR must be accessible, subject to consent rules.
* **Low Operational Overhead:** The MVP must be built on free-tier/open-source tools; managing 10 separate databases is too costly and operationally complex for a greenfield startup.
* **Data Privacy:** Branch staff must only see data for the branch they are currently logged into, unless explicitly authorised otherwise.

## 3. Considered Options

1. **Database-per-branch:** Each branch has its own physical SQL Server database.
2. **Schema-per-branch:** All branches share a database, but each gets its own schema (e.g., `branch1.sales`, `branch2.sales`).
3. **Shared Database, Shared Schema (Row-Level Tenancy):** All branches share the same tables. Every operational table includes an `organisation_id` and `branch_id` column to scope the data.

## 4. Decision Outcome

**Chosen option:** Option 3 (Shared Database, Shared Schema with Row-Level Tenancy).

For a 10-branch health retail platform, row-level scoping using `organisation_id` and `branch_id` is the industry standard for multi-tenant SaaS and enterprise chains. It allows effortless cross-branch reporting, shared patient records, and shared master data (tariffs, products, ICD-10) while isolating transactional data (sales, stock, dispenses) at the query level.

### Positive Consequences

* **Simplified Master Data:** Product catalogues, KEML lists, and ICD-10 codes only need to be imported once.
* **Unified Patient Record:** A single `patient.patients` record exists, preventing dangerous duplicate clinical histories.
* **Ease of Deployment:** One set of database migrations. CI/CD pipelines remain simple.

### Negative Consequences

* **Query Risk:** Developers must never forget to append `WHERE branch_id = X` in queries. A forgotten filter could leak data across branches.
* **Blast Radius:** If the database goes down, all 10 branches go down simultaneously.

## 5. Implementation Notes

* **Scoping classes (not a blanket column rule):** Per `Unified_ERD.md`, branch scope is carried two ways and a table belongs to exactly one class (see §6.4 for the full classification and its RLS consequences):
  * **Directly-scoped** - the table owns a `branch_id (UNIQUEIDENTIFIER) NOT NULL` column (e.g. `core_branches`, `emr_visits`, `billing_sales`, `pharmacy_dispenses`, `inventory_stock_batches`, `inventory_purchase_orders`).
  * **Inheritance-scoped** - the table has no `branch_id` column and reaches its owning branch through a foreign-key chain (e.g. `inventory_stock_movements` via `batch_id`, `billing_invoices`/`billing_payments` via `sale_id`, `emr_*`/`pharmacy_prescriptions`/`claims_claims` via `visit_id`, the lab tables via the order/sample chain).
  * **Org-scoped (not branch-scoped)** - top-level master/reference and the unified patient record carry `organisation_id (UNIQUEIDENTIFIER)` and are scoped to the organisation, not a branch. This class includes the master data (`inventory_products`, `terminology_*`, `pharmacy_drug_ingredients`), the global reference table `claims_tariffs` (keyed by `payer_id`/`version_code`, no tenancy column at row level), and crucially **`patient_patients`** - a single unified patient record per §4. Cross-branch read of `patient_patients` is **consent-gated and audited** (ADR-020), not an open org-wide read.

  > The canonical membership of the directly-scoped class is the §6.4 RLS table; this list is illustrative. To avoid drift, the §6.4 table is the single source of truth and the migration-guard test (§6.4 test 7) enforces that every table is in exactly one class.
* **ORM/Query Builder Enforcement:** The backend (NestJS) must use global query scopes or interceptors to automatically inject the user's current `branch_id` from their JWT token into all read and write queries.
* **Cross-Branch Operations:** For inter-branch transfers or corporate reporting, a specific `Corporate` role or system service account will bypass the branch scope.

---

## 6. Ratification Addendum (Gate 0A) - Tenancy ratified against Unified_ERD

**Ratification status:** **Design-ratified for Gate 0A; isolation enforcement pending [#70](https://gitlab.com/cricketaustin-group/Pzure/-/issues/70).** The tenancy *design* (partitioning, per-entity consistency, RLS strategy) is ratified here; the *enforcement* backstop (database RLS policies + the §6.4 CI test suite) is delivered under [#70](https://gitlab.com/cricketaustin-group/Pzure/-/issues/70) and Gate 0A isolation is only "enforced" once #70 is green on `develop`.  
**Ratification date:** 2026-06-28  
**Owning work item:** [#54](https://gitlab.com/cricketaustin-group/Pzure/-/issues/54) Sprint 0A (blocker B-007)  
**Reviewed against:** `DOCS/Unified_ERD.md`  
**Method:** Reviewed per *Designing Data-Intensive Applications* (DDIA) - partitioning, replication, and consistency made explicit per entity rather than assumed.

This addendum ratifies the Section 4 decision (shared DB, shared schema, row-level `organisation_id` / `branch_id`) by binding it to the concrete tables defined in `Unified_ERD.md`. It closes the gap DDIA warns about: a tenancy model is incomplete until its partition key, replication topology, and per-entity consistency level are stated and testable.

### 6.1 Partitioning (DDIA Ch. 6)

**Partition / shard key:** `branch_id` is the partition key for all high-volume transactional tables. Cross-branch master data (`inventory_products`, `terminology_diagnosis_codes`, `pharmacy_drug_ingredients`) is **not** branch-partitioned; it is replicated reference data scoped by `organisation_id`.

The MVP runs a single Azure SQL Database (per ADR-015 / D-002), so partitioning is initially **logical**: `branch_id` is the leading column of the clustered or covering indexes and the mandatory predicate on every transactional query. The model below is forward-compatible with physical partitioning (SQL Server partitioned tables, or branch-range sharding) once a single instance is outgrown, without an application rewrite.

Partition key per hot table (from `Unified_ERD.md`):

| Hot table | Partition / shard key | Secondary distribution key | Rationale |
| --- | --- | --- | --- |
| `billing_sales` | `branch_id` | `sale_date` (range, for archival) | Sales volume is branch-local and time-skewed |
| `inventory_stock_batches` | `branch_id` | `product_id` | Stock is physically held at one branch; decrement is branch-local |
| `pharmacy_dispenses` | `branch_id` | `prescription_id` | Dispensing happens at the dispensing branch |
| `emr_visits` | `branch_id` | `patient_id` | A visit occurs at one branch; patient may roam across branches |

Derived/child tables are **inheritance-scoped**: they hold no `branch_id` column and reach the owning branch through the FK chain shown below (column names verified against `Unified_ERD.md`). They partition with, and must join through, their parent:

| Inheritance-scoped table | FK column | Resolves branch via |
| --- | --- | --- |
| `billing_invoices` | `sale_id` | `billing_sales.branch_id` |
| `billing_payments` | `sale_id` | `billing_sales.branch_id` |
| `inventory_stock_movements` | `batch_id` | `inventory_stock_batches.branch_id` |
| `emr_clinical_notes` | `visit_id` | `emr_visits.branch_id` |
| `emr_diagnoses` | `visit_id` | `emr_visits.branch_id` |
| `pharmacy_prescriptions` | `visit_id` | `emr_visits.branch_id` |
| `claims_claims` | `visit_id` | `emr_visits.branch_id` |
| `lab_orders` | `visit_id` | `emr_visits.branch_id` |
| `lab_samples` | `order_id` | `lab_orders` -> `emr_visits.branch_id` |
| `lab_results` | `sample_id` | `lab_samples` -> `lab_orders` -> `emr_visits.branch_id` |

**Hot-branch detection:** A branch becomes "hot" when its share of write throughput or row count materially exceeds an even split (alert threshold: a single `branch_id` exceeding 2x the mean branch write rate over a rolling 24h window, or p95 transactional latency for that branch breaching the NFR of API p95 < 500 ms). Detection inputs: per-`branch_id` write counters and query latency emitted to the monitoring stack; periodic row-count-by-`branch_id` snapshot job (reuses the ADR-014 snapshot scheduler so it does not load the transactional path).

**Rebalancing plan:** Because the partition key is `branch_id` (not a hash), rebalancing is *operational*, not a re-keying exercise:

1. **Vertical first (MVP):** scale up the single Azure SQL Database tier; logical partitioning keeps a hot branch from degrading others at the index level.
2. **Read offload:** move that branch's reporting/analytics reads to the read replica (Section 6.2) so writes are not contended by reads.
3. **Physical partitioning:** promote the logical scheme to SQL Server partitioned tables keyed on `branch_id` ranges; hot branches get their own filegroup/partition.
4. **Branch-range sharding (future):** relocate a hot branch (or set of branches) to a dedicated database. Cross-branch reporting then runs over the read models (ADR-014), not live joins, so the corporate view survives the split. No `branch_id` value changes; only its physical home does, which is the key benefit of branch-keyed partitioning over hash sharding.

### 6.2 Replication and consistency (DDIA Ch. 5, 7, 9)

Consistency level is set **per entity**, by safety impact, not globally.

**Strong consistency (required - no exceptions):**

* **Stock decrement** (`inventory_stock_batches.quantity_on_hand`, `inventory_stock_movements`): decrement and the sale/dispense must occur in a **single serializable transaction on the primary**, with a guard that blocks `quantity_on_hand` from going negative online. This is the **no-oversell** invariant. Concurrent decrements on the same batch are linearised by the primary; reads that drive a decrement decision must be from the primary, never a replica.
* **Dispensing** (`pharmacy_dispenses`, and the `pharmacy_prescriptions` dispense lock): a prescription may be dispensed exactly once. The dispense lock (ADR-009) is enforced on the primary; a second writer is rejected to the manual queue. No replica read may authorise a dispense.
* **Payments** (`billing_payments`): never eventually-merged; reconciled on the primary (suspense workflow, ADR-011).

**Eventual consistency / read-replica acceptable:**

* **Reporting and analytics:** dashboards and exports read **materialised views / scheduled snapshots** and, later, a **read replica** - per **ADR-014**. Stale-by-snapshot reads are explicitly acceptable here and must never run against the transactional tables. This is the boundary that protects POS/clinical latency.
* **`claims_*` analytics** (derived aggregates / read models over claims data for reporting): eventual consistency acceptable for analytical/aggregate reads only. **Disambiguation:** the transactional `claims_claims` row itself is **primary-only** - claim submission and adjudication are online-only and transactional (ADR-008/012) and must never be read from a replica. Only the **derived claims aggregates / read models** (ADR-014), not the live `claims_claims` row, are replica-eligible.
* **Cached reference/catalogue data** at the branch (products, price lists, ICD-10): read-mostly; on conflict, **server-wins** (ADR-009).

**Replication topology:** single-primary; the MVP reporting path uses scheduled snapshots only (ADR-014). Asynchronous read replica(s) are a later-phase addition, not present at MVP. All writes and all consistency-critical reads (stock, dispense, payment) target the primary. Only the reporting/analytics read path is allowed to read replicas/snapshots. This matches DDIA's principle that read-your-writes is required for operational paths, not for reporting.

### 6.3 Offline append-only eventual-consistency boundary (ADR-006 / 008 / 009)

The offline model is the platform's deliberate eventual-consistency zone, and its boundary is drawn exactly at the strong-consistency entities above:

* Offline writes are **append-only events** queued in IndexedDB and pushed to the server (ADR-006), carrying `idempotency_key`, `branch_id`, `device_id`, `client_timestamp`, `server_timestamp` (ADR-008).
* The **per-entity offline matrix** (ADR-008) keeps consistency-critical actions narrow: POS sales are append-only and provisional until synced; pharmacy dispense/stock movement is *limited* append-only against last-synced stock with **negative-stock blocked**; clinical notes and lab results are **draft-only**; claims and communication are **online-only**.
* On sync, conflicts resolve by **entity-level policy** with **no blind last-write-wins** (ADR-009): stock uses negative-stock block + reconciliation event; prescriptions use the dispense lock; clinical notes use the addendum model; unresolved cases route to an admin resolution queue with a full audit trail.
* **Convergence guarantee:** `idempotency_key` makes replay safe (no double-processing); the resolution queue guarantees no silent data loss. Eventual consistency is therefore bounded to operations the offline matrix permits, and never weakens the online no-oversell / no-double-dispense invariants.

### 6.4 Row-Level Security (RLS) enforcement test plan

The Section 5 ORM/query-scope enforcement is necessary but not sufficient; tenancy isolation must be **machine-verified** (DDIA reliability: no invariant relies on developer discipline). Enforcement is defence-in-depth: application-layer global query scope (injects `branch_id` from JWT) **plus** database RLS policies on every branch-scoped table as a backstop.

**RLS strategy by scoping class.** SQL Server RLS predicates evaluate over columns of the row being accessed, so the two scoping classes from Section 5 need different policies. This is a hard design constraint, not a detail - a single "`branch_id` predicate" cannot be applied to a table that has no `branch_id` column:

| Scoping class | Tables | RLS approach |
| --- | --- | --- |
| Directly-scoped | `emr_visits`, `pharmacy_dispenses`, `billing_sales`, `inventory_stock_batches`, `inventory_purchase_orders` | Filter predicate `branch_id = CONVERT(UNIQUEIDENTIFIER, SESSION_CONTEXT(N'branch_id'))`, plus a matching block predicate so cross-branch INSERT/UPDATE is rejected at the DB. |
| Directly-scoped (self) | `core_branches` | Special case: `core_branches` **is** the branch, so the predicate is on its own primary key - `id = CONVERT(UNIQUEIDENTIFIER, SESSION_CONTEXT(N'branch_id'))` - not on a `branch_id` column. Implementers must not write a `branch_id = ...` predicate here (it would be unsatisfiable). |
| Inheritance-scoped | the §6.1 FK-chain tables (incl. `lab_orders` / `lab_samples` / `lab_results`) | Each such table must EITHER (a) **denormalise a `branch_id` column** populated at write time (preferred: keeps the predicate simple and indexable and makes the no-oversell joins cheaper), OR (b) use a **join-based table-valued security predicate function** that resolves the branch through the FK chain. The companion implementation issue ([#70](https://gitlab.com/cricketaustin-group/Pzure/-/issues/70)) records the per-table choice in the migration. |
| Org-scoped | `patient_patients` (PHI), `inventory_products`, `terminology_*`, `pharmacy_drug_ingredients`, `claims_tariffs` | Filter predicate on `organisation_id = SESSION_CONTEXT(N'organisation_id')` (tables that carry it); pure global reference (`claims_tariffs`, terminology) is org-visible reference data. **`patient_patients` cross-branch read is consent-gated + audited** (ADR-020); it is org-scoped, not branch-scoped, by the unified-patient-record decision in §4. |

Test plan (each item is an automated, CI-runnable test; all must pass before Gate 0A sign-off and must stay green thereafter). Implementation is tracked in [#67](https://gitlab.com/cricketaustin-group/Pzure/-/issues/67):

1. **Positive scope:** a user authenticated for Branch A reading `billing_sales` / `emr_visits` / `inventory_stock_batches` / `pharmacy_dispenses` returns **only** rows where `branch_id = A`.
2. **Negative cross-branch read:** the same Branch A user querying a Branch B row id returns **zero rows** (not an authorization error that leaks existence).
3. **Negative cross-branch write:** a write that would place a row under Branch B while the session is scoped to A is **rejected** by the DB RLS block predicate even if the application scope is bypassed. For directly-scoped tables this is an `INSERT/UPDATE` with `branch_id = B`; for inheritance-scoped tables it is a child row whose parent resolves to Branch B (e.g. a `billing_payments` row against a Branch B `sale_id`).
4. **Forgotten-filter backstop:** a deliberately unscoped query (simulating a developer omitting `WHERE branch_id = X`) returns only the session-branch rows because the RLS policy is active - proving the backstop catches the Negative Consequence called out in Section 4.
5. **Corporate bypass is explicit:** the `Corporate` role / service account can read across branches **only** through the designated cross-branch path, and every such access writes an audit event (ties ADR-020 export control + audit).
6. **Master vs transactional vs org-scoped PHI:** `organisation_id`-scoped master/reference data (`inventory_products`, terminology, `claims_tariffs`) is visible across the org's branches; branch-transactional tables are not - asserting the two-tier scope. Additionally, **org-scoped PHI (`patient_patients`) cross-branch read is consent-gated and audited**, not open org-wide read.
7. **Migration guard:** a schema test asserts every transactional table in `Unified_ERD.md` is in exactly one known scoping class - **directly-scoped** (owns `branch_id`), **inheritance-scoped** (a documented FK chain in the §6.1 table that **terminates at a directly-scoped table's `branch_id`**, e.g. `emr_visits.branch_id`, `billing_sales.branch_id`, or `inventory_stock_batches.branch_id`, including multi-hop chains such as `lab_results -> lab_samples -> lab_orders -> emr_visits.branch_id`), or **org-scoped** (explicitly carries `organisation_id` / is declared global reference) - **and** has an RLS policy attached implementing that class. A new table in none of these classes, or with no RLS policy, fails CI. The terminal is defined as "any directly-scoped table's `branch_id`" rather than a fixed list, so the guard stays correct as new chains are added. This is what makes the scope claim enforceable rather than asserted.

### 6.5 ADR review checklist (Gate 0A) - all evidenced

| Checklist item | Status | Evidence (this ADR) |
| --- | --- | --- |
| Partition key per hot table | Done | Section 6.1 table: `branch_id` for `billing_sales`, `inventory_stock_batches`, `pharmacy_dispenses`, `emr_visits` |
| Hot-branch detection | Done | Section 6.1 (thresholds + snapshot-based detection) |
| Rebalancing plan | Done | Section 6.1 (vertical -> read offload -> physical partition -> branch-range shard) |
| Per-entity consistency level | Done | Section 6.2 (strong: stock/dispense/payments; eventual: reporting, `claims_*` analytics) |
| Offline eventual-consistency boundary | Done | Section 6.3 (ADR-006/008/009 bound to the strong-consistency entities) |
| Row-level-security enforcement test plan | Planned (companion issue [#70](https://gitlab.com/cricketaustin-group/Pzure/-/issues/70)) | Section 6.4 specifies the 7 automated tests + the per-class RLS approach and migration guard; **implementation is tracked in [#70](https://gitlab.com/cricketaustin-group/Pzure/-/issues/70)**. Gate 0A isolation is *designed* here, and is *enforced* only once #70 is green on `develop`. |
| Ratified against Unified_ERD.md | Done | All table names cross-checked against `DOCS/Unified_ERD.md` |

### 6.6 Cross-references

* **ADR-014** - Reporting architecture (read models / snapshots / read replica) - consumes the eventual-consistency reporting path in Section 6.2.
* **ADR-006 / ADR-008 / ADR-009** - Offline scope, per-entity offline matrix, conflict resolution - define the Section 6.3 boundary.
* **ADR-011** - M-Pesa reconciliation - payments suspense workflow referenced in Section 6.2.
* **ADR-020** - Masking & export control - audited corporate bypass in Section 6.4.
* **ADR-015** / **D-002** - Azure SQL Database topology - basis for single-primary + read replica.
