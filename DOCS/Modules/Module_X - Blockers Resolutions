# Architecture remediation summary

| Area                    | Status                      | Decision                                                                                   |
| ----------------------- | --------------------------- | ------------------------------------------------------------------------------------------ |
| Data architecture       | Critical gap confirmed      | Create ERD, aggregate map, SQL Server physical model, branch tenancy decision              |
| Security architecture   | Critical gap confirmed      | Define OIDC/auth/session/MFA/encryption/key management/API security                        |
| Offline/sync            | Critical gap confirmed      | Reduce offline scope, define sync units, conflict policy, offline duration                 |
| Performance/scalability | High gap confirmed          | Define NFRs, load model, indexes, caching, reporting replica                               |
| Integrations            | High/critical gap confirmed | Create adapter specs and sequence diagrams for eTIMS, M-Pesa, SHA, WhatsApp, external labs |
| Deployment/operations   | Critical gap confirmed      | Define Azure topology, IaC, monitoring, backup, DR, rollout/rollback                       |

Also, a few integration assumptions should now be updated. KRA states that eTIMS system-to-system integration is available via API for businesses with invoicing systems, Safaricom’s Daraja portal is the official M-Pesa API platform, Meta has official WhatsApp Cloud API documentation, and SHA has a public provider API landing page showing EDI API versioning and pre-authorisation/claims processing language. These should be treated as **integration discovery starting points**, not as sufficient implementation specifications. ([Kenya Revenue Authority][1])

---

# 1. New mandatory pre-build phase

## Sprint 0A: Data architecture and tenancy baseline

| Item                  | Decision / deliverable                                                           |
| --------------------- | -------------------------------------------------------------------------------- |
| Tenancy model         | **Single shared database, shared schema, branch-scoped rows**                    |
| Database              | SQL Server                                                                       |
| Branch isolation      | `organisation_id`, `branch_id`, RBAC branch scope, filtered queries              |
| Data model            | Logical ERD, physical ERD, aggregate map                                         |
| Schema organisation   | SQL Server schemas by domain                                                     |
| Master data           | Product, service, patient, supplier, staff, tariff, ICD, lab catalogue seed plan |
| Referential integrity | Foreign keys for transactional integrity, not application-only relationships     |
| Reporting             | Separate reporting schema/read models from MVP                                   |
| Audit storage         | Separate append-only audit schema                                                |
| Retention             | Define retention matrix by data class                                            |
| Sizing                | 2-year and 5-year database growth estimate                                       |
| Indexing              | Index strategy per high-volume table                                             |
| Partitioning          | Plan for invoice, stock movement, audit, communication, claim, and clinical logs |

### Recommended tenancy decision

For 10 branches, I recommend:

```text
One production database
One organisation tenant
Shared domain schemas
Branch-scoped rows
Central reporting schema
Strict RBAC and branch filters
```

Not separate databases per branch.

### Why

| Option                                  | Verdict        | Reason                                                                             |
| --------------------------------------- | -------------- | ---------------------------------------------------------------------------------- |
| Separate DB per branch                  | Reject for MVP | Hard reporting, hard inter-branch transfer, hard patient continuity                |
| Separate schema per branch              | Reject         | Operationally complex, repetitive migrations                                       |
| Shared DB, branch-scoped rows           | Recommended    | Best for 10 branches, chain reporting, inter-branch stock, claims, patient history |
| Multi-tenant shared DB for many clients | Future-ready   | Add `tenant_id`/`organisation_id` now even if only one organisation                |

### Required ERD domains

| Domain        | Core aggregates                                                                  |
| ------------- | -------------------------------------------------------------------------------- |
| Core          | Organisation, Branch, User, Role, Permission, Device, Setting                    |
| Patient       | Patient, Consent, Allergy, Identifier, Contact                                   |
| Product       | Product, ProductVariant, Barcode, PriceList, Service                             |
| Billing       | Sale, Invoice, Payment, CreditNote, Shift                                        |
| Inventory     | Supplier, PO, GRN, StockBatch, StockMovement, StockCount, Transfer, Quarantine   |
| Pharmacy      | Prescription, Dispense, DispenseLine, ControlledRegister, RefillPlan             |
| EMR           | Visit, QueueEvent, Vitals, ClinicalNote, Diagnosis, Order, Referral, Certificate |
| Lab           | LabTest, LabOrder, Sample, Result, ResultComponent, ExternalSendout              |
| Claims        | Payer, Scheme, Member, Tariff, Preauth, Claim, ClaimLine, Denial, Reconciliation |
| Communication | Template, Consent, MessageEvent, IncomingMessage, PaymentPrompt, Loyalty         |
| Reporting     | ReportDefinition, ReportRun, Snapshot, Alert                                     |
| Audit         | StaffActivityLog, DataAccessLog, SecurityEvent, IntegrationEvent                 |

### Minimum cardinality deliverables

Every relationship must be documented, for example:

```text
Organisation 1 ── * Branch
Branch 1 ── * UserBranchAssignment
Patient 1 ── * Visit
Visit 1 ── * ClinicalNote
Visit 1 ── * Diagnosis
Visit 1 ── * LabOrder
LabOrder 1 ── * LabOrderLine
LabOrderLine 1 ── 0..* LabSample
LabOrderLine 1 ── 0..* LabResult
Prescription 1 ── * PrescriptionItem
Dispense 1 ── * DispenseLine
Product 1 ── * StockBatch
StockBatch 1 ── * StockMovement
Sale 1 ── * Invoice
Invoice 1 ── * PaymentAllocation
Claim 1 ── * ClaimLine
Claim 1 ── * ClaimAttachment
```

---

## Sprint 0B: Security, privacy, and identity architecture

| Item                 | Decision / deliverable                                                              |
| -------------------- | ----------------------------------------------------------------------------------- |
| Authentication       | OIDC-compatible architecture                                                        |
| Recommended identity | Azure Entra ID B2C / Entra External ID, or Keycloak if self-managed                 |
| Staff login          | Username/password + MFA for privileged roles                                        |
| Session model        | Short-lived access token + refresh token rotation                                   |
| Web session          | HTTP-only secure cookies preferred for browser app                                  |
| API security         | JWT validation, scopes, permissions, branch claims                                  |
| MFA                  | Required for owner, manager, pharmacist, clinician, lab verifier, claims/admin, DPO |
| PIN/signature        | Separate regulated-action PIN, not same as password                                 |
| Encryption           | TLS in transit, SQL TDE, field-level encryption for selected data                   |
| Key management       | Azure Key Vault                                                                     |
| Key rotation         | Defined rotation schedule and incident rotation process                             |
| API hardening        | CORS allowlist, rate limits, validation pipes, API versioning                       |
| Audit design         | Append-only audit events and separate patient data access logs                      |
| Secrets              | No secrets in code or `.env` committed                                              |
| Device trust         | Registered branch devices for POS/pharmacy/lab where possible                       |

Kenya’s Data Protection Act is directly relevant because health data is personal and sensitive, and the Digital Health health-information procedures refer to security measures including firewalls, encryption, and access controls, with health data held in the national system retained for at least twenty years. ([Kenya Law][2])

### Recommended authentication architecture

```text
Browser / PWA
    ↓
OIDC login
    ↓
Identity provider
    ↓
Access token with user_id, organisation_id, branch_scope, roles
    ↓
NestJS API gateway
    ↓
Permission guard + branch guard + module guard
```

### Token/session policy

| Item                      | Recommendation                                      |
| ------------------------- | --------------------------------------------------- |
| Access token lifetime     | 10–15 minutes                                       |
| Refresh token             | Rotating, revocable                                 |
| Browser storage           | HTTP-only secure SameSite cookie                    |
| Idle timeout              | 15 minutes for clinical/admin, configurable for POS |
| Absolute session lifetime | 8–12 hours                                          |
| Privileged actions        | Re-auth or regulated-action PIN                     |
| Failed login lockout      | Progressive lockout                                 |
| MFA                       | Required for privileged roles                       |

### Pharmacist/clinician/lab signature design

Do not use a normal password as a “signature.”

Use a separate **regulated-action PIN**:

| Field           | Design                                                                   |
| --------------- | ------------------------------------------------------------------------ |
| PIN storage     | Argon2/bcrypt hash                                                       |
| PIN scope       | Per user                                                                 |
| PIN purpose     | Approving prescriptions, controlled meds, lab verification, certificates |
| PIN retry limit | Strict                                                                   |
| PIN reset       | Manager/admin workflow with audit                                        |
| Signature event | `signed_by`, `signed_at`, `signature_method`, `device_id`, `branch_id`   |
| Non-repudiation | Audit event + immutable record version                                   |

### Patient data access log implementation

Do not log access synchronously in a way that slows EMR screens.

Recommended design:

```text
API request reads patient-sensitive record
    ↓
Access interceptor emits lightweight event
    ↓
Queue / service bus
    ↓
Audit worker writes to audit.data_access_logs
    ↓
Risk scoring job flags anomalies
```

Minimum log fields:

```text
user_id
role_id
branch_id
patient_id
record_type
record_id
action_type: view/edit/print/export/share
purpose
care_context_id
device_id
ip_address
timestamp
sensitive_flag
break_glass_flag
```

---

## Sprint 0C: Offline/sync, NFRs, integration, deployment and DR baseline

| Item             | Decision / deliverable                                 |
| ---------------- | ------------------------------------------------------ |
| Offline scope    | Explicitly limited and safe                            |
| Conflict design  | Entity-level strategies, no blind merge                |
| Sync unit        | Branch-scoped event batches                            |
| Offline duration | Define degraded-mode rules                             |
| NFRs             | POS, pharmacy, EMR, lab, claims, reports               |
| Load model       | 10 branches, 100 concurrent users, peak transactions   |
| Caching          | Product, tariffs, ICD, branch settings, test catalogue |
| Reporting        | Read replica/reporting schema                          |
| Integrations     | Technical sequence diagrams                            |
| Deployment       | Azure environments, IaC, release and rollback          |
| Monitoring       | APM, logs, metrics, alerts                             |
| Backup/DR        | RPO/RTO, restore drills                                |
| Rollout          | Feature flags, canary, branch waves                    |

---

# 2. Corrected offline/sync strategy

Your concern is right: clinical-data sync conflict resolution is dangerous. The right design is to **avoid conflicts by narrowing offline scope**, not to pretend all clinical data can be merged safely.

## Offline operating model

| Entity/workflow            |             Offline? | Conflict strategy                                                 |
| -------------------------- | -------------------: | ----------------------------------------------------------------- |
| Product catalogue          | Yes, read-only cache | Server wins                                                       |
| Price lists                | Yes, read-only cache | Server wins                                                       |
| Branch settings            | Yes, read-only cache | Server wins                                                       |
| ICD/test catalogue/tariffs | Yes, read-only cache | Server wins                                                       |
| POS sales                  |                  Yes | Append-only local transaction, sync once                          |
| M-Pesa/eTIMS               |              Partial | Queue, reconcile when online                                      |
| Pharmacy dispense          |      Limited offline | Append-only, branch-local, requires cached prescription/order     |
| Inventory stock movement   |      Limited offline | Append-only movement event                                        |
| Stock count                |                  Yes | Count session lock, no merge                                      |
| EMR registration           |         Yes, limited | Temporary patient ID, later reconciliation                        |
| EMR clinical notes         |              Limited | Draft-only offline; signing requires sync unless emergency mode   |
| Lab result entry           |              Limited | Draft offline; verification requires sync unless policy allows    |
| Claims                     |                   No | Online only                                                       |
| Controlled medicines       |     Strongly limited | Offline only with local branch register and strict reconciliation |
| Communication              |                   No | Queue online sending                                              |
| Reports                    |              Limited | Local branch reports only; enterprise reports online              |

## Offline duration policy

| Duration   | Behaviour                                              |
| ---------- | ------------------------------------------------------ |
| 0–4 hours  | Normal degraded offline mode                           |
| 4–24 hours | Restricted operations, manager alert                   |
| >24 hours  | Critical workflows only; claims/communication disabled |
| >48 hours  | Head-office escalation; manual continuity SOP          |

## Sync event model

Use append-only events for offline writes:

```text
local_event_id
branch_id
device_id
user_id
entity_type
operation_type
payload
idempotency_key
created_offline_at
sync_attempt_count
sync_status
server_event_id
```

## Conflict policies

| Conflict                                 | Policy                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| Two users edit same patient demographics | Server queues conflict for manual resolution                                         |
| Duplicate temporary patient              | Possible duplicate queue                                                             |
| Same stock batch sold from two devices   | Branch-local stock reservation and negative-stock block; if conflict, manager review |
| Same prescription dispensed twice        | Prescription lock required; offline dispense limited to branch-local queue           |
| Clinical note edited by two users        | No automatic merge; addendum/manual resolution                                       |
| Lab result changed after verification    | Correction version only                                                              |
| Price changed while offline              | Sale uses cached price; flagged if price changed before sync                         |
| eTIMS offline invoices                   | Queue and submit when online; accountant exception report                            |

---

# 3. Corrected performance and scalability baseline

## MVP NFRs

| Area                    | Requirement                                          |
| ----------------------- | ---------------------------------------------------- |
| POS product scan/search | < 500 ms for cached catalogue                        |
| POS checkout completion | < 2 seconds excluding external eTIMS/M-Pesa response |
| Receipt print trigger   | < 1 second after payment confirmation                |
| Pharmacy queue load     | < 2 seconds                                          |
| Patient search          | < 2 seconds                                          |
| EMR visit open          | < 3 seconds                                          |
| Lab result entry save   | < 1 second                                           |
| Claim validation        | < 5 seconds for outpatient claim                     |
| Dashboard cards         | < 3 seconds                                          |
| Standard reports        | < 10 seconds for common daily reports                |
| Large reports           | Async background generation                          |
| API p95 latency         | < 500 ms for common reads/writes                     |
| Uptime target           | 99.5% MVP, 99.9% after hardening                     |
| Concurrent users        | Design for 150 concurrent users initially            |
| Branches                | 10 live branches, scalable to 50                     |

## Initial load model

| Metric                     |                                                 Estimate |
| -------------------------- | -------------------------------------------------------: |
| Branches                   |                                                       10 |
| Concurrent users           |                            50–100 normal, design for 150 |
| Daily POS transactions     |                           2,000–5,000 across 10 branches |
| Daily invoices             |                                              2,000–5,000 |
| Daily stock movements      |                                             5,000–15,000 |
| Daily prescriptions        |                                                300–1,500 |
| Daily clinic visits        |                                                  200–800 |
| Daily lab orders           |                                                  100–500 |
| Daily communication events |                                                500–5,000 |
| Monthly audit events       |                                             1M+ possible |
| Two-year data              | Millions of rows in billing, stock, audit, communication |

## SQL Server indexing priorities

High-volume tables need early index design:

| Table                        | Critical indexes                                              |
| ---------------------------- | ------------------------------------------------------------- |
| `billing.invoices`           | `branch_id, invoice_date`, `etims_status`, `invoice_number`   |
| `billing.payments`           | `branch_id, payment_date`, `provider_reference`, `invoice_id` |
| `inventory.stock_movements`  | `branch_id, product_id, batch_id, movement_at`                |
| `inventory.stock_batches`    | `branch_id, product_id, expiry_date, status`                  |
| `pharmacy.dispenses`         | `branch_id, patient_id, dispensed_at`                         |
| `emr.visits`                 | `branch_id, patient_id, visit_date`                           |
| `lab.lab_results`            | `patient_id, verified_at`, `order_id`                         |
| `claims.claims`              | `payer_id, status, submitted_at`, `branch_id, visit_id`       |
| `comms.communication_events` | `patient_id, sent_at`, `status, channel`                      |
| `audit.data_access_logs`     | `patient_id, created_at`, `user_id, created_at`, `risk_score` |

## Caching strategy

| Data               | Cache type                              |
| ------------------ | --------------------------------------- |
| Product catalogue  | Branch-local cache + Redis/server cache |
| Price lists        | Branch-local cache with versioning      |
| Tariffs            | Redis/server cache + versioning         |
| ICD codes          | Server cache + frontend indexed search  |
| Lab test catalogue | Server/frontend cache                   |
| Branch settings    | Frontend/server cache                   |
| Permissions        | Short TTL cache with invalidation       |
| Reports            | Snapshot/cache for dashboards           |

---

# 4. Corrected integration architecture

## Integration principle

Every external integration must use this pattern:

```text
Internal transaction
    ↓
Integration request record
    ↓
Outbox queue
    ↓
Adapter worker
    ↓
External API
    ↓
Webhook/callback/status query
    ↓
Integration event log
    ↓
Business status update
```

No direct “click button → call API → assume success” pattern.

---

## eTIMS integration design deliverables

KRA confirms that system-to-system integration between taxpayer invoicing systems and eTIMS is provisioned via API, so the design must include formal onboarding, sandbox/prod credentials, payload specs, retry and rejection handling. ([Kenya Revenue Authority][1])

Required artifacts:

| Artifact                      |
| ----------------------------- |
| eTIMS onboarding checklist    |
| API credential/secrets design |
| Invoice payload mapping       |
| Credit note payload mapping   |
| Submission sequence diagram   |
| Rejection workflow            |
| Retry/backoff strategy        |
| Offline invoice queue         |
| Idempotency key design        |
| Accountant exception screen   |
| eTIMS integration test pack   |

---

## M-Pesa Daraja design deliverables

Safaricom Daraja is the official platform for M-Pesa API integration and provides access to M-Pesa APIs through developer onboarding and guides. ([developer.safaricom.co.ke][3])

Required artifacts:

| Artifact                               |
| -------------------------------------- |
| Daraja credential and environment plan |
| STK push sequence diagram              |
| C2B confirmation sequence diagram      |
| Transaction status query sequence      |
| Reversal flow                          |
| Timeout strategy                       |
| Duplicate callback strategy            |
| Idempotency strategy                   |
| Suspense payment workflow              |
| Callback security validation           |
| M-Pesa reconciliation design           |

### STK sequence

```text
Invoice created
    ↓
Payment prompt created with invoice_id + amount
    ↓
Daraja STK request sent
    ↓
Prompt status = pending
    ↓
Callback received
    ↓
Validate amount + phone + invoice + checkout ID
    ↓
Create payment allocation
    ↓
Invoice paid / partial paid
    ↓
Receipt generated
```

---

## SHA integration design deliverables

The SHA public provider API landing page states that it offers real-time online pre-authorisation and claims processing and exposes an API version, while the SHA provider portal is separately available for provider login. This is useful evidence that integration is possible, but the team must still obtain official provider credentials, sandbox access, endpoint documentation, payload rules, and certification requirements before relying on it. ([api-edi.provider.sha.go.ke][4])

Required artifacts:

| Artifact                                 |
| ---------------------------------------- |
| SHA API access request                   |
| Provider credential plan                 |
| Sandbox/prod endpoint confirmation       |
| Eligibility verification sequence        |
| Pre-authorisation sequence               |
| Claim submission sequence                |
| Claim status query sequence              |
| Error/rejection code mapping             |
| FHIR bundle assessment                   |
| Fallback provider-portal/manual workflow |
| Claims integration test pack             |

Do not make SHA API a hard blocker for claims MVP. Build:

```text
Claims engine
Manual/provider portal submission tracking
API adapter interface
SHA adapter when official API access is confirmed
```

---

## WhatsApp design deliverables

Meta’s official WhatsApp Cloud API documentation covers the message API, and the implementation must also include webhooks, message templates, token management, and template approval lifecycle. ([Facebook Developers][5])

Required artifacts:

| Artifact                                    |
| ------------------------------------------- |
| WhatsApp Business account/provider decision |
| Template approval workflow                  |
| Template category model                     |
| Outbound message sequence                   |
| Webhook verification                        |
| Incoming message routing                    |
| Opt-out handling                            |
| Delivery status mapping                     |
| Token/secrets management                    |
| Consent enforcement                         |
| Sensitive-content suppression rules         |

---

## External lab integration design

For MVP, do not assume reference labs will have APIs.

| Stage | Design                                        |
| ----- | --------------------------------------------- |
| MVP   | Manual send-out, courier tracking, PDF upload |
| V2    | Email/parser or portal import                 |
| V3    | API/FHIR DiagnosticReport integration         |

Required MVP artifacts:

| Artifact                       |
| ------------------------------ |
| External lab master data       |
| Send-out form                  |
| Chain-of-custody record        |
| External reference number      |
| Result PDF upload              |
| Internal verification workflow |
| Send-out TAT report            |

---

# 5. Corrected deployment and operations architecture

## Environment strategy

| Environment      | Purpose                               |
| ---------------- | ------------------------------------- |
| Local            | Developer machine                     |
| Dev              | Continuous integration testing        |
| QA               | QA automation and integration testing |
| UAT              | Business acceptance                   |
| Staging/pre-prod | Production-like release candidate     |
| Production       | Live branches                         |
| DR/recovery      | Restore testing / disaster recovery   |

## Infrastructure as Code

Use one of:

```text
Bicep
Terraform
Azure DevOps pipelines
GitHub Actions + Azure deployment
```

Deliverables:

| Deliverable                         |
| ----------------------------------- |
| Azure resource architecture         |
| Bicep/Terraform templates           |
| Network/security configuration      |
| Key Vault setup                     |
| SQL deployment scripts              |
| App deployment pipelines            |
| Environment variable/secrets policy |
| Rollback scripts                    |
| Monitoring dashboard                |

## Backup and DR baseline

This is critical.

| Item               | MVP target                                   |
| ------------------ | -------------------------------------------- |
| RPO                | ≤ 15 minutes for database                    |
| RTO                | ≤ 4 hours for production service restoration |
| SQL backups        | Automated point-in-time restore              |
| Document backups   | Geo-redundant or backup-copy policy          |
| Audit logs         | Append-only, backup-protected                |
| Restore drill      | Before pilot and quarterly                   |
| DR runbook         | Mandatory                                    |
| Offline continuity | Branch SOP if cloud unavailable              |

## Monitoring and alerting

| Area         | Alert                                        |
| ------------ | -------------------------------------------- |
| API          | 5xx rate, latency, unavailable               |
| Database     | CPU, DTU/vCore, blocking, deadlocks, storage |
| Queue        | Backlog, failed jobs                         |
| eTIMS        | Rejected/queued invoice spike                |
| M-Pesa       | Callback failures, unmatched payments        |
| WhatsApp/SMS | Delivery failure spike                       |
| Sync         | Branch stale > threshold                     |
| Backups      | Backup failure                               |
| Security     | Failed login spike, privilege changes        |
| Audit        | Bulk export, sensitive access anomaly        |
| Claims       | Submission failures                          |
| Stock        | Negative stock, recall batch sell attempt    |

## Rollout and rollback strategy

| Layer                 | Rollback plan                                              |
| --------------------- | ---------------------------------------------------------- |
| Frontend              | Versioned static build rollback                            |
| Backend               | Blue/green or slot swap rollback                           |
| Database              | Backward-compatible migrations only                        |
| Feature releases      | Feature flags per branch/module                            |
| Integrations          | Adapter-level disable switch                               |
| eTIMS                 | Queue invoices and retry later                             |
| M-Pesa                | Manual payment reference fallback                          |
| Branch rollout        | Wave-by-wave canary                                        |
| Failed branch go-live | Revert branch to previous/manual SOP while preserving data |

Database rule:

```text
No destructive migration during business hours.
No migration without tested rollback or forward-fix plan.
No feature release that requires irreversible schema changes without release gate approval.
```

---

# 6. Added architecture sprints

Your critique changes the sprint plan. Insert these before earlier Sprint 1–3.

## Sprint 0A: Data Architecture Sprint

| Deliverable             | Required output                              |
| ----------------------- | -------------------------------------------- |
| Aggregate map           | All domain aggregate roots                   |
| Logical ERD             | Entity relationships and cardinality         |
| Physical SQL Server ERD | Tables, schemas, keys, constraints           |
| Tenancy decision        | Shared DB, branch-scoped rows                |
| Data retention matrix   | By data class                                |
| Data seeding plan       | Product, stock, ICD, tariff, users, branches |
| Sizing estimate         | 2-year and 5-year                            |
| Index strategy          | High-volume tables                           |
| Reporting schema plan   | Views/snapshots/read models                  |
| Audit schema plan       | Append-only audit events                     |

### Exit criteria

```text
No development proceeds without approved ERD and tenancy model.
```

---

## Sprint 0B: Security Architecture Sprint

| Deliverable                 | Required output                           |
| --------------------------- | ----------------------------------------- |
| Authentication architecture | OIDC/session/MFA                          |
| Authorization architecture  | RBAC + branch + module + action           |
| Token/session design        | Access, refresh, cookie strategy          |
| API security design         | CORS, rate limits, validation, versioning |
| Encryption design           | SQL TDE, field encryption, Key Vault      |
| Signature/PIN design        | Regulated-action PIN                      |
| Audit design                | Staff + patient access logs               |
| Break-glass design          | Emergency access workflow                 |
| Data masking rules          | Per role/report                           |
| Threat model                | STRIDE or equivalent                      |

### Exit criteria

```text
No patient, payment, pharmacy, or claim feature proceeds without approved security architecture.
```

---

## Sprint 0C: Offline, Integration and Operations Architecture Sprint

| Deliverable             | Required output                                  |
| ----------------------- | ------------------------------------------------ |
| Offline scope           | Exact entities and workflows                     |
| Sync model              | Event queue, idempotency, conflict handling      |
| Offline duration rules  | Degraded mode policy                             |
| NFR document            | Latency, throughput, concurrency, uptime         |
| Integration specs       | eTIMS, M-Pesa, SHA, WhatsApp, SMS, external labs |
| Sequence diagrams       | For each integration                             |
| Deployment architecture | Azure environments                               |
| IaC plan                | Bicep/Terraform                                  |
| Monitoring plan         | APM/logs/alerts                                  |
| Backup/DR plan          | RPO/RTO/runbook                                  |
| Rollout/rollback plan   | Feature flags, canary, branch waves              |

### Exit criteria

```text
No 10-branch rollout plan is accepted without offline, integration, monitoring, backup and rollback designs.
```

---

# 7. Architecture decision records required

Create ADRs before build.

| ADR     | Decision                                     |
| ------- | -------------------------------------------- |
| ADR-001 | Tenancy model: shared DB, branch-scoped rows |
| ADR-002 | SQL Server schema strategy                   |
| ADR-003 | Authentication provider and OIDC model       |
| ADR-004 | Token/session model                          |
| ADR-005 | RBAC and branch authorization model          |
| ADR-006 | Audit/data access logging model              |
| ADR-007 | Encryption and key management                |
| ADR-008 | Offline/sync scope                           |
| ADR-009 | Conflict resolution strategy                 |
| ADR-010 | eTIMS integration strategy                   |
| ADR-011 | M-Pesa integration strategy                  |
| ADR-012 | SHA/manual/API claims strategy               |
| ADR-013 | WhatsApp/SMS communication strategy          |
| ADR-014 | Reporting architecture                       |
| ADR-015 | Azure deployment topology                    |
| ADR-016 | Backup/DR RPO/RTO                            |
| ADR-017 | Rollout/rollback strategy                    |
| ADR-018 | Device/printer/scanner support model         |
| ADR-019 | Data retention and archival policy           |
| ADR-020 | Patient data masking and export control      |

---

# 8. Revised critical-path plan

The implementation plan should now start like this:

```text
Sprint 0: Programme mobilisation
Sprint 0A: Data architecture
Sprint 0B: Security architecture
Sprint 0C: Offline, integration, NFR, deployment, DR architecture
Sprint 1: Enterprise discovery and 10-branch operating model
Sprint 2: Azure landing zone + DevSecOps foundation
Sprint 3: Platform skeleton
Sprint 4+: Module construction
```

This adds **6 weeks** but removes much larger downstream failure risk.

---

# 9. What changes in delivery gates

## New Gate 0: Architecture Baseline Approval

Before module build:

| Required evidence                      |
| -------------------------------------- |
| ERD approved                           |
| Tenancy ADR approved                   |
| Security ADRs approved                 |
| Offline scope approved                 |
| Integration sequence diagrams approved |
| NFRs approved                          |
| Azure deployment design approved       |
| Backup/DR plan approved                |
| Rollback plan approved                 |

No Gate 0 approval, no full development.

---

## Updated Gate 1: Engineering Foundation Approval

| Required evidence                |
| -------------------------------- |
| CI/CD working                    |
| Dev/QA/UAT environments deployed |
| Auth working                     |
| RBAC working                     |
| Audit event pipeline working     |
| Data access log pipeline working |
| SQL migrations working           |
| Document storage working         |
| Key Vault/secrets working        |
| Monitoring baseline active       |

---

# 10. Final architecture remediation backlog

| Priority | Work item                                      |
| -------- | ---------------------------------------------- |
| P0       | ERD and tenancy model                          |
| P0       | Auth/OIDC/session/MFA design                   |
| P0       | Audit/data access logging design               |
| P0       | Offline scope and conflict policy              |
| P0       | Backup/DR RPO/RTO                              |
| P0       | eTIMS/M-Pesa/SHA integration sequence diagrams |
| P0       | Azure deployment architecture                  |
| P1       | Database sizing and indexing                   |
| P1       | Retention and archival matrix                  |
| P1       | API security and versioning                    |
| P1       | Caching strategy                               |
| P1       | Reporting read model                           |
| P1       | Rollout/rollback plan                          |
| P2       | Advanced partitioning                          |
| P2       | Data warehouse                                 |
| P2       | Full IoT/analyser integration                  |
| P2       | AI analytics/decision support                  |

---

# 11. Direct response to your risk table

| Gap                           | Architect response                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| No ERD                        | Confirmed. Add Sprint 0A and make ERD mandatory gate.                                                                     |
| No migration/seeding strategy | Confirmed. Rename to “greenfield master-data seeding strategy.”                                                           |
| No retention policy           | Confirmed. Add retention matrix and archival policy. Health data has longer retention expectations than operational logs. |
| No sizing estimate            | Confirmed. Add 2-year/5-year sizing and high-volume table strategy.                                                       |
| Shared vs separate DB         | Critical. Decision: shared SQL Server DB, branch-scoped rows.                                                             |
| No auth architecture          | Confirmed. Decision required: OIDC provider, token/session policy, MFA.                                                   |
| No encryption strategy        | Confirmed. Decision: SQL encryption + Azure Key Vault + field encryption for selected data.                               |
| No API security model         | Confirmed. Add API standards: CORS, validation, rate limiting, versioning, idempotency.                                   |
| Pharmacist PIN/signature      | Confirmed. Add regulated-action PIN/signature service.                                                                    |
| Patient access logging        | Confirmed. Implement async audit event pipeline.                                                                          |
| No conflict resolution design | Confirmed. Limit offline clinical editing; use append-only events and manual conflict resolution.                         |
| No sync scope                 | Confirmed. Define offline entity matrix before build.                                                                     |
| No sync frequency/bandwidth   | Confirmed. Add NFR/load profile.                                                                                          |
| No offline duration           | Confirmed. Define 0–4h, 4–24h, >24h degraded rules.                                                                       |
| No performance requirements   | Confirmed. Add NFR document.                                                                                              |
| No concurrent estimates       | Confirmed. Design for 150 concurrent users initially.                                                                     |
| No caching                    | Confirmed. Add cache strategy for product, price, ICD, tariffs, settings.                                                 |
| Reporting on transactional DB | Confirmed. Add reporting schema/read models from MVP, replica later.                                                      |
| No eTIMS API reference        | Confirmed. KRA system-to-system API exists; still need official onboarding and specs.                                     |
| No M-Pesa design              | Confirmed. Add Daraja sequences, callbacks, idempotency, timeout/retry.                                                   |
| No SHA docs                   | Partially mitigated. Public SHA API page exists, but official credentialed docs and sandbox access must be obtained.      |
| No WhatsApp design            | Confirmed. Add Cloud API/template/webhook design.                                                                         |
| No external lab design        | Confirmed. MVP manual send-out; API later.                                                                                |
| No deployment architecture    | Confirmed. Add Azure/IaC/environment design.                                                                              |
| No monitoring                 | Confirmed. Add monitoring thresholds and dashboards.                                                                      |
| No backup/DR                  | Confirmed. Add RPO/RTO and restore drills.                                                                                |
| No rollback                   | Confirmed. Add feature flags, blue/green or slot swap, branch canary rollout.                                             |

---