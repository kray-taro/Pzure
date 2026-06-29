# Revised Enterprise Implementation Plan

## 10-Branch Kenya Health Retail, Pharmacy, Clinic, Lab, Claims and Communication Platform

This should be treated as a **10-branch enterprise-grade implementation from day one**, using:

```text
Backend: NestJS
Frontend: ViteJS
Database: SQL Server
Infrastructure: Azure / client-owned Azure infrastructure
Pilot: 10 branches
Data: greenfield, no legacy migration
Integrations: eTIMS API, M-Pesa Daraja, SMS, WhatsApp, claims portals/APIs
Scope: pharmacy, clinic, lab-lite, claims, online pharmacy, delivery, chronic refills, controlled medicines
Delivery posture: quality-first rollout
```

The safest delivery model is:

```text
Build enterprise platform foundation
        ↓
Build all core modules with branch-aware architecture
        ↓
Run full end-to-end UAT on a simulated 10-branch network
        ↓
Go live in controlled waves: 2 branches → 3 branches → 5 branches
        ↓
Stabilise, optimise, then scale
```

---

## 1. Confirmed implementation baseline

| Area                   | Decision                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Pilot scope            | Multi-branch                                                                          |
| Number of branches     | 10                                                                                    |
| Existing systems       | None                                                                                  |
| Existing data          | None                                                                                  |
| eTIMS approach         | New API setup / new implementation                                                    |
| M-Pesa setup           | Till number, STK required, Daraja credentials acquired                                |
| Claims scope           | SHA, private insurers, employer/corporate schemes                                     |
| Lab scope              | In-house tests and external lab send-outs from day one                                |
| Pharmacy scope         | Controlled medicines, online pharmacy, delivery, chronic refills                      |
| Communication channels | SMS + WhatsApp from MVP                                                               |
| Hosting preference     | Azure / client-owned infrastructure                                                   |
| Devices                | Desktops, tablets, Android phones, receipt printers, label printers, barcode scanners |
| Team model             | Internal developers                                                                   |
| Budget posture         | Enterprise-grade from day one                                                         |
| Go-live urgency        | Quality-first rollout                                                                 |
| Preferred stack        | NestJS, ViteJS, SQL Server                                                            |

---

## 2. What this changes architecturally

Because this is a **10-branch enterprise pilot**, the system must be branch-aware from the first line of code.

## Key architecture decisions

| Decision                     | Implementation implication                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| 10 branches from day one     | Every record must carry `organisation_id`, `branch_id`, and access scope                   |
| No existing data             | Need a master-data creation and branch-seeding workstream                                  |
| Enterprise-grade             | DevSecOps, audit, RBAC, monitoring, backup, DR, QA automation from day one                 |
| eTIMS new implementation     | Build eTIMS adapter, queue, retries, rejected invoice handling                             |
| M-Pesa credentials available | Build STK, C2B, transaction status, reversal-ready architecture                            |
| All claims                   | Use generic payer/scheme/tariff engine, not hard-coded SHA-only logic                      |
| In-house + external lab      | Lab-lite must support send-outs from MVP                                                   |
| Controlled medicines         | Pharmacy module needs controlled register and stricter approvals in MVP                    |
| Online pharmacy + delivery   | Add e-commerce/prescription upload/delivery dispatch workflows early                       |
| SMS + WhatsApp MVP           | Consent, template governance, opt-out, delivery logs required early                        |
| Azure/client infrastructure  | Use client-owned Azure tenant/subscription and enterprise landing zone                     |
| NestJS + ViteJS + SQL Server | Modular NestJS backend, Vite frontend, SQL Server schema-per-domain or module-prefix model |

---

## 3. Recommended target architecture

## 3.1 Logical architecture

```text
ViteJS Web/PWA Frontend
    ├── Admin console
    ├── POS
    ├── Pharmacy workstation
    ├── Clinic EMR
    ├── Lab-lite
    ├── Claims workbench
    ├── Inventory/procurement
    ├── Reports/dashboard
    └── Patient communication console

NestJS Backend
    ├── Auth and RBAC module
    ├── Organisation/licensing module
    ├── POS/billing module
    ├── Pharmacy module
    ├── Inventory/procurement module
    ├── EMR module
    ├── Lab-lite module
    ├── Claims module
    ├── Reporting module
    ├── Communication module
    ├── Integration adapters
    ├── Rules engine
    ├── Audit engine
    └── Offline sync engine

SQL Server
    ├── Core master data
    ├── Transactional data
    ├── Audit logs
    ├── Reporting read models
    └── Analytics snapshots

Azure / Client Infrastructure
    ├── App hosting
    ├── SQL Server / Azure SQL / SQL Managed Instance
    ├── Blob/file storage
    ├── Queue/service bus
    ├── Redis/cache
    ├── Key vault/secrets
    ├── Monitoring/logging
    ├── Backup/DR
    └── Network/security controls
```

---

## 3.2 Recommended Azure deployment model

| Layer      | Recommended Azure/client setup                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Frontend   | Static web app or hosted Vite build behind WAF/CDN                                                             |
| Backend    | Containerised NestJS services on Azure App Service, Azure Container Apps, or AKS depending internal capability |
| Database   | SQL Server on Azure SQL Managed Instance, Azure SQL Database, or SQL Server VM depending enterprise policy     |
| Documents  | Azure Blob Storage or client-secured object storage                                                            |
| Queueing   | Azure Service Bus or equivalent queue                                                                          |
| Cache      | Redis-compatible cache                                                                                         |
| Secrets    | Azure Key Vault                                                                                                |
| Logging    | Centralised application logs and audit logs                                                                    |
| Monitoring | Application performance monitoring and uptime alerts                                                           |
| Backups    | Automated DB backup, point-in-time restore, document backup                                                    |
| DR         | Separate recovery plan with restore testing                                                                    |
| Networking | Private endpoints/VNet where required                                                                          |
| Security   | MFA, RBAC, audit, encryption, device/session controls                                                          |

Recommendation: **use the client’s Azure tenant/subscription**, not a developer-owned environment. This keeps data ownership, security, and long-term operations cleaner.

---

## 4. Recommended codebase structure

## 4.1 Repository structure

```text
health-platform/
    apps/
        web/                  # ViteJS frontend
        api/                  # NestJS backend
        worker/               # Background jobs, queues, schedulers
        integration-worker/    # eTIMS, M-Pesa, SMS, WhatsApp, claims adapters
    libs/
        auth/
        rbac/
        audit/
        rules-engine/
        documents/
        notifications/
        offline-sync/
        shared-types/
        validation/
    database/
        migrations/
        seeds/
        views/
        stored-procedures/
    infra/
        azure/
        docker/
        ci-cd/
    docs/
        architecture/
        api/
        user-guides/
        sops/
        compliance/
```

---

## 4.2 NestJS module layout

```text
src/
    modules/
        core/
        auth/
        users/
        organisations/
        licensing/
        patients/
        products/
        services/
        pos/
        payments/
        etims/
        inventory/
        procurement/
        pharmacy/
        emr/
        lab/
        claims/
        reporting/
        communications/
        integrations/
        audit/
        documents/
        settings/
```

---

## 4.3 SQL Server schema strategy

Use domain schemas to keep the database clean.

```text
core.*
org.*
billing.*
inventory.*
pharmacy.*
emr.*
lab.*
claims.*
comms.*
reporting.*
audit.*
integration.*
security.*
```

Example:

```text
core.patients
core.products
org.branches
billing.sales
billing.invoices
inventory.stock_batches
pharmacy.prescriptions
emr.visits
lab.lab_results
claims.claims
comms.communication_events
audit.staff_activity_logs
audit.data_access_logs
```

---

## 5. Enterprise non-negotiables

These must be present from the first production release.

| Area                  | Non-negotiable                                                                     |
| --------------------- | ---------------------------------------------------------------------------------- |
| Branch awareness      | Every transaction must be branch-scoped                                            |
| RBAC                  | Permissions by role, branch, module, and action                                    |
| Audit logs            | Every financial, clinical, pharmacy, stock, claim, and data-access action logged   |
| Data access log       | Patient record views, exports, prints, shares logged                               |
| Offline handling      | POS, pharmacy, inventory, and clinic queue must tolerate connection drops          |
| eTIMS queue           | Invoice queue, retry, rejection handling                                           |
| M-Pesa reconciliation | STK/C2B callbacks, manual reconciliation fallback                                  |
| Batch/expiry          | Medicines must be batch and expiry controlled                                      |
| Pharmacist approval   | Prescription-only and controlled medicine workflows cannot be cashier-only         |
| Clinical sign-off     | EMR notes, referrals, prescriptions, certificates require licensed user            |
| Lab verification      | Results must be verified before formal release                                     |
| Claim validation      | Claims must not submit with missing diagnosis, note, tariff, result, or attachment |
| Consent               | SMS/WhatsApp communication must check consent                                      |
| Export control        | Sensitive reports require permission and reason                                    |
| Backups               | Backups and restore tested before go-live                                          |
| Monitoring            | Production monitoring and alerting active before pilot                             |

---

## 6. Delivery model

Because this is enterprise-grade and internal-development-led, use **programme increments** with parallel squads.

## 6.1 Recommended squads

| Squad                                   | Responsibility                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| Platform & Security Squad               | Auth, RBAC, audit, documents, DevOps, offline sync, core APIs                    |
| Commerce & Inventory Squad              | POS, eTIMS, M-Pesa, payments, stock, procurement, pricing                        |
| Clinical & Pharmacy Squad               | EMR, pharmacy, prescriptions, lab-lite, chronic care, controlled medicines       |
| Claims, Reporting & Communication Squad | Claims, tariffs, denials, reports, dashboards, SMS, WhatsApp                     |
| QA, Data & Release Squad                | Test automation, UAT, branch rollout, data seeding, training, release management |

---

## 6.2 Recommended internal team size

For a quality-first 10-branch enterprise rollout, the realistic team is:

| Role                            |     Recommended count |
| ------------------------------- | --------------------: |
| Product owner                   |                     1 |
| Programme/project manager       |                     1 |
| Solution architect              |                     1 |
| Technical lead                  |                     1 |
| Business analysts               |                     2 |
| UX/UI designer                  |                   1–2 |
| Backend NestJS engineers        |                   5–7 |
| Frontend Vite engineers         |                   4–5 |
| SQL Server/database engineer    |                   1–2 |
| DevOps/cloud engineer           |                   1–2 |
| QA automation engineers         |                   3–4 |
| Manual/UAT QA analysts          |                     2 |
| Data/migration/master-data lead |                     1 |
| Security/privacy lead           |                     1 |
| Pharmacy SME                    | Part-time but regular |
| Clinical SME                    | Part-time but regular |
| Lab SME                         | Part-time but regular |
| Claims/billing SME              | Part-time but regular |
| Training/change lead            |                     1 |
| Support/hypercare analysts      |    2–4 during rollout |

Minimum effective delivery team: **18–22 people**.
Ideal enterprise delivery team: **24–30 people**.

With a smaller internal team, do not reduce quality gates; extend the timeline.

---

## 7. Sprint structure

Assumption: **2-week sprints**.

The sprint plan below is designed as a **quality-first enterprise rollout**. Multiple squads work in parallel inside each sprint, but each sprint has a clear programme-level theme.

---

## 8. Enterprise sprint roadmap

## Phase 0: Mobilisation and enterprise blueprint

---

## Sprint 0: Programme mobilisation

| Item         | Detail                                                      |
| ------------ | ----------------------------------------------------------- |
| Theme        | Mobilise delivery programme                                 |
| Main outcome | Governance, team, environments, backlog, and controls ready |

### Deliverables

| Deliverable                |
| -------------------------- |
| Programme charter          |
| 10-branch pilot definition |
| RACI matrix                |
| Delivery governance        |
| Sprint cadence             |
| Risk register v1           |
| Decision log               |
| Steering committee setup   |
| Definition of Ready        |
| Definition of Done         |
| Enterprise release gates   |
| Branch rollout strategy v1 |

### Acceptance criteria

| Test                     | Expected result                           |
| ------------------------ | ----------------------------------------- |
| Team structure confirmed | Squads and leads assigned                 |
| Scope confirmed          | 10-branch enterprise pilot agreed         |
| Delivery tools ready     | Backlog, repo, documentation tools active |
| Governance active        | Sprint, demo, steering, risk cadence set  |

---

## Sprint 1: Enterprise discovery and 10-branch operating model

| Item         | Detail                                       |
| ------------ | -------------------------------------------- |
| Theme        | Convert modules 1–9 into operating workflows |
| Main outcome | Approved enterprise workflow blueprint       |

### Deliverables

| Deliverable                   |
| ----------------------------- |
| 10-branch operating model     |
| Branch type definitions       |
| User role model               |
| Pharmacy workflows            |
| Clinic workflows              |
| Lab workflows                 |
| Claims workflows              |
| Online pharmacy workflow      |
| Delivery workflow             |
| Controlled medicine workflow  |
| M-Pesa workflow               |
| eTIMS workflow                |
| SMS/WhatsApp consent workflow |
| Claims payer model            |
| Master data blueprint         |
| Device and hardware blueprint |

### Acceptance criteria

| Test                            | Expected result                                         |
| ------------------------------- | ------------------------------------------------------- |
| Branch workflows mapped         | Pharmacy, clinic, lab, claims, stock, delivery included |
| All roles mapped                | Cashier, pharmacist, clinician, lab, claims, DPO, owner |
| MVP and enterprise scope locked | No ambiguity on release target                          |
| Critical risks identified       | eTIMS, claims, stock, devices, branch readiness logged  |

---

## Sprint 2: Solution architecture and Azure landing zone design

| Item         | Detail                                   |
| ------------ | ---------------------------------------- |
| Theme        | Finalise architecture and infrastructure |
| Main outcome | Approved technical architecture          |

### Deliverables

| Deliverable                              |
| ---------------------------------------- |
| Azure/client infrastructure architecture |
| NestJS modular architecture              |
| Vite frontend architecture               |
| SQL Server schema strategy               |
| Offline-sync architecture                |
| Audit architecture                       |
| Document storage architecture            |
| Integration adapter architecture         |
| eTIMS integration design                 |
| M-Pesa integration design                |
| SMS/WhatsApp integration design          |
| Security model                           |
| Backup and DR design                     |
| Monitoring/logging design                |

### Acceptance criteria

| Test                         | Expected result                                   |
| ---------------------------- | ------------------------------------------------- |
| Architecture approved        | Solution design signed off                        |
| Infrastructure chosen        | Azure/client deployment model confirmed           |
| Security model approved      | RBAC, audit, encryption, secrets, MFA planned     |
| Integration pattern approved | eTIMS/M-Pesa/SMS/WhatsApp/payer adapters designed |

---

## Sprint 3: DevSecOps foundation and base platform skeleton

| Item         | Detail                       |
| ------------ | ---------------------------- |
| Theme        | Build engineering foundation |
| Main outcome | Deployable skeleton app      |

### Deliverables

| Deliverable                    |
| ------------------------------ |
| Git repositories               |
| CI/CD pipelines                |
| Dev/staging/UAT environments   |
| Base NestJS API                |
| Base Vite app                  |
| SQL Server migration framework |
| Auth service                   |
| RBAC framework                 |
| Audit logger                   |
| Document upload service        |
| Secrets management             |
| Error monitoring               |
| Health checks                  |
| API documentation framework    |

### Acceptance criteria

| Test                | Expected result                        |
| ------------------- | -------------------------------------- |
| App deploys         | Frontend and backend deploy to staging |
| User logs in        | Authentication works                   |
| Role assigned       | Permissions affect menu/actions        |
| Audit event written | Login/action recorded                  |
| File uploaded       | Document stored with metadata          |

---

## Phase 1: Core platform and master data

---

## Sprint 4: Core master data and branch foundation

| Item         | Detail                                |
| ------------ | ------------------------------------- |
| Theme        | Branch-aware platform                 |
| Main outcome | 10-branch structure can be configured |

### Deliverables

| Deliverable               |
| ------------------------- |
| Organisation profile      |
| Branch profiles           |
| Branch service flags      |
| Staff/user profiles       |
| Branch assignment         |
| User role matrix          |
| Patient master v1         |
| Product master v1         |
| Service master v1         |
| Supplier master v1        |
| System settings           |
| Branch device registry v1 |
| Audit viewer v1           |

### Acceptance criteria

| Test                    | Expected result                                  |
| ----------------------- | ------------------------------------------------ |
| Create 10 branches      | Branch records created with service flags        |
| Assign user to branches | User sees only permitted branch data             |
| Create product          | Product available by branch                      |
| Create patient          | Patient record created and audited               |
| Create service          | Consultation/lab/procedure available for billing |

---

## Sprint 5: Module 1 enterprise — organisation, licensing, professionals, contracts

| Item         | Detail                                                   |
| ------------ | -------------------------------------------------------- |
| Theme        | Compliance backbone                                      |
| Main outcome | Regulated workflows controlled by licences and contracts |

### Deliverables

| Deliverable                             |
| --------------------------------------- |
| Business registration records           |
| PPB premise licence records             |
| KMPDC facility licence records          |
| KMLTTB lab licence/professional records |
| Professional licence records            |
| Superintendent assignment               |
| Clinical lead assignment                |
| Lab in-charge assignment                |
| SHA/private/employer contract records   |
| Licence document upload/versioning      |
| Expiry alerts                           |
| Branch compliance dashboard             |
| Workflow blockers                       |

### Acceptance criteria

| Test                            | Expected result                   |
| ------------------------------- | --------------------------------- |
| Pharmacy without PPB licence    | Dispensing disabled               |
| Clinic without facility licence | Consultation signing disabled     |
| Lab without lab permission      | Result verification disabled      |
| Professional licence expired    | User cannot sign regulated action |
| Contract expired                | Claim submission blocked          |
| Licence expiring                | Alert generated                   |

---

## Sprint 6: Master-data factory for greenfield rollout

| Item         | Detail                                                 |
| ------------ | ------------------------------------------------------ |
| Theme        | No legacy data, so create clean production master data |
| Main outcome | Repeatable data-seeding process for 10 branches        |

### Deliverables

| Deliverable                 |
| --------------------------- |
| Product catalogue template  |
| Medicine catalogue template |
| Service catalogue template  |
| Lab test catalogue template |
| Supplier template           |
| Staff template              |
| Price list template         |
| Branch setup template       |
| Payer/scheme template       |
| Tariff import template      |
| Opening stock template      |
| Data validation rules       |
| Bulk import tools           |
| Data approval workflow      |

### Acceptance criteria

| Test                            | Expected result                      |
| ------------------------------- | ------------------------------------ |
| Product template imported       | Products created without duplicates  |
| Staff template imported         | Users/staff created with branch/role |
| Opening stock template imported | Batch/expiry stock created           |
| Tariff template imported        | Payer tariffs created                |
| Invalid data                    | Rejected with clear errors           |

---

## Phase 2: Commerce, billing, eTIMS, M-Pesa

---

## Sprint 7: Module 2 POS core

| Item         | Detail                                                     |
| ------------ | ---------------------------------------------------------- |
| Theme        | Fast checkout                                              |
| Main outcome | Branches can sell retail products, services, and OTC items |

### Deliverables

| Deliverable                               |
| ----------------------------------------- |
| POS screen                                |
| Barcode product search                    |
| Product/service cart                      |
| Customer/patient selection                |
| Retail sale                               |
| OTC sale                                  |
| Service sale                              |
| Price lists v1                            |
| Discount controls v1                      |
| Receipt printing v1                       |
| POS audit                                 |
| Held bills                                |
| Basic returns before invoice finalisation |

### Acceptance criteria

| Test                 | Expected result                   |
| -------------------- | --------------------------------- |
| Cashier scans item   | Item added to cart                |
| Service selected     | Consultation/lab/procedure billed |
| Discount above limit | Manager approval required         |
| Receipt printed      | 58mm/80mm/PDF supported           |
| Sale completed       | Audit log created                 |

---

## Sprint 8: Payments, M-Pesa STK, C2B, and shift close

| Item         | Detail                                     |
| ------------ | ------------------------------------------ |
| Theme        | Payment control                            |
| Main outcome | Payments and cashier shifts are controlled |

### Deliverables

| Deliverable                  |
| ---------------------------- |
| Cash payment                 |
| Manual M-Pesa reference      |
| M-Pesa STK integration       |
| M-Pesa callback handling     |
| C2B confirmation handling    |
| Transaction status query     |
| Card/manual payment          |
| Split payment                |
| Credit/customer account      |
| Shift open/close             |
| Cash variance                |
| M-Pesa reconciliation report |
| Suspense payments            |
| Payment audit                |

### Acceptance criteria

| Test              | Expected result                     |
| ----------------- | ----------------------------------- |
| STK sent          | Linked to invoice/bill              |
| Callback received | Bill marked paid                    |
| Payment fails     | Bill remains unpaid                 |
| Overpayment       | Suspense/credit workflow created    |
| Shift closed      | Expected vs counted cash calculated |
| M-Pesa mismatch   | Reconciliation issue logged         |

---

## Sprint 9: eTIMS implementation and invoice controls

| Item         | Detail                                             |
| ------------ | -------------------------------------------------- |
| Theme        | Tax invoice compliance                             |
| Main outcome | eTIMS-ready invoicing and API flow are operational |

### Deliverables

| Deliverable                   |
| ----------------------------- |
| Invoice engine                |
| eTIMS adapter                 |
| Invoice queue                 |
| Submission retry              |
| Accepted/rejected states      |
| Credit notes                  |
| Invoice correction workflow   |
| Buyer PIN handling            |
| eTIMS status dashboard        |
| Offline invoice queue         |
| eTIMS audit log               |
| Accountant exception workflow |

### Acceptance criteria

| Test                | Expected result                    |
| ------------------- | ---------------------------------- |
| Sale completed      | Invoice generated                  |
| eTIMS available     | Invoice submitted                  |
| eTIMS unavailable   | Invoice queued                     |
| eTIMS rejected      | Error shown and accountant alerted |
| Credit note issued  | Original invoice referenced        |
| eTIMS report opened | Accepted/rejected/queued visible   |

---

## Phase 3: Inventory, procurement, stock control

---

## Sprint 10: Module 4 procurement, PO, GRN, supplier invoices

| Item         | Detail                                        |
| ------------ | --------------------------------------------- |
| Theme        | Stock-in discipline                           |
| Main outcome | Branches can order and receive stock properly |

### Deliverables

| Deliverable                             |
| --------------------------------------- |
| Purchase orders                         |
| Purchase approval rules                 |
| Supplier price history                  |
| Goods received notes                    |
| Direct GRN with approval                |
| Supplier invoice capture                |
| PO-GRN-invoice matching                 |
| Batch and expiry required for medicines |
| Cost price capture                      |
| Stock-in ledger                         |
| Procurement reports v1                  |

### Acceptance criteria

| Test                      | Expected result             |
| ------------------------- | --------------------------- |
| PO created                | Approval workflow triggered |
| Medicine GRN              | Batch/expiry required       |
| Supplier invoice mismatch | Flagged                     |
| GRN posted                | Stock balance increases     |
| Supplier price changes    | Price history updated       |

---

## Sprint 11: Stock ledger, transfers, counts, adjustments

| Item         | Detail                                           |
| ------------ | ------------------------------------------------ |
| Theme        | Stock movement control                           |
| Main outcome | Stock movements are traceable across 10 branches |

### Deliverables

| Deliverable               |
| ------------------------- |
| Stock balances by branch  |
| Batch stock ledger        |
| POS stock-out integration |
| Stock count               |
| Blind count option        |
| Stock adjustment request  |
| Adjustment approval       |
| Inter-branch transfers    |
| In-transit stock          |
| Transfer variance         |
| Stock movement report     |
| Stock valuation report    |

### Acceptance criteria

| Test                | Expected result                 |
| ------------------- | ------------------------------- |
| Sale completed      | Stock decreases                 |
| Count variance      | Approval required               |
| Transfer dispatched | Origin stock reduced/in-transit |
| Transfer received   | Destination stock increased     |
| Transfer mismatch   | Variance task created           |

---

## Sprint 12: Expiry, quarantine, recall, cold-chain

| Item         | Detail                            |
| ------------ | --------------------------------- |
| Theme        | Medicine safety and stock risk    |
| Main outcome | Stock risk is actively controlled |

### Deliverables

| Deliverable             |
| ----------------------- |
| Near-expiry report      |
| Expired stock block     |
| Quarantine stock        |
| Recall workflow         |
| Batch recall report     |
| Affected branch lookup  |
| Affected patient lookup |
| Reorder levels          |
| Stockout report         |
| Dead stock report       |
| Cold-chain flag         |
| Temperature log v1      |
| Cold-chain incident v1  |

### Acceptance criteria

| Test                | Expected result                       |
| ------------------- | ------------------------------------- |
| Expired medicine    | Blocked from sale/dispense            |
| Recalled batch      | Blocked and quarantined               |
| Batch recall report | Affected patients and branches listed |
| Low stock           | Reorder alert generated               |
| Cold-chain incident | Affected stock flagged                |

---

## Phase 4: Pharmacy, controlled medicines, online pharmacy, delivery

---

## Sprint 13: Module 3 prescription intake and pharmacist approval

| Item         | Detail                                                    |
| ------------ | --------------------------------------------------------- |
| Theme        | Prescription control                                      |
| Main outcome | Prescription-only medicines require professional workflow |

### Deliverables

| Deliverable                     |
| ------------------------------- |
| Prescription entry              |
| Prescription upload             |
| Prescriber details              |
| Patient profile                 |
| Allergy/chronic/pregnancy flags |
| Pharmacy queue                  |
| Pharmacist review               |
| Prescription-only POS blocker   |
| Dosage instructions             |
| Basic clinical warnings         |
| Pharmacist approval             |
| Dispense audit v1               |

### Acceptance criteria

| Test                           | Expected result                     |
| ------------------------------ | ----------------------------------- |
| Prescription-only item scanned | POS blocks direct sale              |
| Prescription uploaded          | Appears in pharmacy queue           |
| Pharmacist approves            | Bill can proceed                    |
| Warning exists                 | Pharmacist acknowledgement required |
| Missing prescriber             | Approval blocked or flagged         |

---

## Sprint 14: Dispensing, batch selection, labels, partials, substitutions

| Item         | Detail                                                       |
| ------------ | ------------------------------------------------------------ |
| Theme        | Safe medicine handover                                       |
| Main outcome | Medicine dispensed with batch, instructions, and audit trail |

### Deliverables

| Deliverable                 |
| --------------------------- |
| Batch/expiry selection      |
| FEFO recommendation         |
| Partial dispensing          |
| Balance tracking            |
| Substitution workflow       |
| Label printing              |
| Refill/repeat tracking v1   |
| Dispense-to-POS integration |
| Stock-out by batch          |
| Prescription audit report   |
| Refill reminder hook        |

### Acceptance criteria

| Test              | Expected result                 |
| ----------------- | ------------------------------- |
| Expired batch     | Cannot dispense                 |
| Partial dispense  | Reason and balance stored       |
| Substitution      | Reason and approval stored      |
| Label printed     | Shows actual dispensed medicine |
| Dispense complete | Stock, POS, audit linked        |

---

## Sprint 15: Controlled medicines and advanced pharmacy controls

| Item         | Detail                                     |
| ------------ | ------------------------------------------ |
| Theme        | High-risk pharmacy compliance              |
| Main outcome | Controlled medicines are strictly governed |

### Deliverables

| Deliverable                        |
| ---------------------------------- |
| Controlled medicine register       |
| Opening/closing balances           |
| Controlled stock receiving         |
| Controlled dispense workflow       |
| Controlled adjustment approval     |
| Controlled stock reconciliation    |
| Witness/counter-sign configuration |
| Early refill warning               |
| Controlled medicine report         |
| Pharmacist override audit          |
| ADR/PQMP record v1                 |

### Acceptance criteria

| Test                         | Expected result                  |
| ---------------------------- | -------------------------------- |
| Controlled medicine selected | Controlled workflow triggered    |
| No prescription              | Dispense blocked                 |
| Balance mismatch             | Critical alert                   |
| Adjustment requested         | Superintendent approval required |
| Report exported              | Export logged                    |

---

## Sprint 16: Online pharmacy and delivery MVP

| Item         | Detail                                     |
| ------------ | ------------------------------------------ |
| Theme        | Internet pharmacy and delivery workflow    |
| Main outcome | Online orders are controlled and auditable |

### Deliverables

| Deliverable                                    |
| ---------------------------------------------- |
| Online order intake                            |
| Prescription upload for online order           |
| Pharmacist review                              |
| Online order payment                           |
| Delivery request                               |
| Delivery address                               |
| Delivery status                                |
| Rider/dispatch assignment                      |
| Proof of handover                              |
| Delivery audit                                 |
| Controlled medicine delivery restriction rules |
| Cold-chain delivery flag                       |
| Online pharmacy reports                        |

### Acceptance criteria

| Test                      | Expected result                                    |
| ------------------------- | -------------------------------------------------- |
| Online prescription order | Pharmacist review required                         |
| Prescription missing      | Restricted medicines blocked                       |
| Delivery created          | Linked to order, invoice, patient                  |
| Medicine handed over      | Proof captured                                     |
| Controlled medicine       | Delivery blocked or restricted by policy           |
| Delivery status           | Visible to branch and patient communication module |

---

## Phase 5: Clinic EMR and lab-lite

---

## Sprint 17: Module 5 EMR registration, queue, triage, notes

| Item         | Detail                                                  |
| ------------ | ------------------------------------------------------- |
| Theme        | Core clinic operations                                  |
| Main outcome | Clinic visit can be registered, triaged, and documented |

### Deliverables

| Deliverable           |
| --------------------- |
| Patient registration  |
| Duplicate detection   |
| Appointment booking   |
| Queue workflow        |
| Triage                |
| Vitals                |
| Clinical note         |
| Clinical templates v1 |
| Clinician signature   |
| Visit lifecycle       |
| Clinical audit        |
| Visit history         |

### Acceptance criteria

| Test                       | Expected result             |
| -------------------------- | --------------------------- |
| Patient registered         | Patient number created      |
| Appointment booked         | Reminder hook available     |
| Triage completed           | Vitals visible to clinician |
| Note signed                | Locked with audit           |
| Clinician licence inactive | Signing blocked             |

---

## Sprint 18: EMR diagnosis, orders, prescription, referral, certificate, summary

| Item         | Detail                                       |
| ------------ | -------------------------------------------- |
| Theme        | Complete outpatient encounter                |
| Main outcome | Visit produces claim-ready clinical evidence |

### Deliverables

| Deliverable                |
| -------------------------- |
| Diagnosis                  |
| ICD-10-ready fields        |
| Lab orders                 |
| Procedure orders           |
| Prescription orders        |
| Prescription-to-pharmacy   |
| Referral letters           |
| Certificates               |
| Visit summary              |
| Chronic-care flags         |
| Immunisation record v1     |
| Claim-readiness indicators |

### Acceptance criteria

| Test                 | Expected result                      |
| -------------------- | ------------------------------------ |
| Diagnosis captured   | Visit claim-ready indicator improves |
| Lab ordered          | Lab module receives order            |
| Prescription ordered | Pharmacy receives prescription       |
| Referral generated   | Letter includes clinical summary     |
| Certificate issued   | Licensed clinician required          |

---

## Sprint 19: Module 6 lab-lite core

| Item         | Detail                                                               |
| ------------ | -------------------------------------------------------------------- |
| Theme        | In-house lab workflow                                                |
| Main outcome | Tests can be ordered, billed, collected, resulted, verified, printed |

### Deliverables

| Deliverable        |
| ------------------ |
| Test catalogue     |
| Lab order          |
| Billing link       |
| Sample collection  |
| Sample rejection   |
| Numeric results    |
| Text/coded results |
| Reference ranges   |
| Verification       |
| Result printout    |
| Result-to-EMR      |
| Lab reports v1     |

### Acceptance criteria

| Test             | Expected result                    |
| ---------------- | ---------------------------------- |
| Test ordered     | Linked to patient/visit            |
| Unpaid test      | Collection blocked unless override |
| Sample collected | Status changes                     |
| Result entered   | Reference range applied            |
| Result verified  | Released to clinician              |
| Result printed   | Verification details shown         |

---

## Sprint 20: External lab send-outs and lab quality controls

| Item         | Detail                                              |
| ------------ | --------------------------------------------------- |
| Theme        | Outsourced diagnostics                              |
| Main outcome | External lab tests are tracked from order to result |

### Deliverables

| Deliverable                  |
| ---------------------------- |
| External lab master          |
| Send-out order               |
| Sample dispatch              |
| External lab receipt         |
| External result upload       |
| External cost tracking       |
| External result verification |
| Overdue send-out alerts      |
| Corrected result workflow    |
| Critical result alert        |
| Kit/reagent lot capture v1   |
| Lab turnaround dashboard     |

### Acceptance criteria

| Test                     | Expected result             |
| ------------------------ | --------------------------- |
| External test ordered    | Send-out workflow triggered |
| Sample dispatched        | Tracking recorded           |
| External result received | Attached and reviewed       |
| Overdue result           | Alert generated             |
| Corrected result         | Previous version retained   |

---

## Phase 6: Claims, tariffs, denials, reconciliation

---

## Sprint 21: Module 7 benefit schemes, eligibility, tariffs

| Item         | Detail                                                       |
| ------------ | ------------------------------------------------------------ |
| Theme        | Payer configuration                                          |
| Main outcome | SHA, private insurer, and employer schemes can be configured |

### Deliverables

| Deliverable               |
| ------------------------- |
| Payer master              |
| Benefit schemes           |
| Scheme members            |
| Eligibility status        |
| Contract link             |
| Tariff tables             |
| Tariff import             |
| Co-pay rules              |
| Exclusion rules           |
| Benefit limits            |
| Claim deadline rules      |
| Service-to-tariff mapping |

### Acceptance criteria

| Test              | Expected result                    |
| ----------------- | ---------------------------------- |
| Scheme created    | Linked to payer and branch         |
| Member added      | Patient linked to scheme           |
| Service priced    | Tariff applied                     |
| Co-pay configured | Patient and payer split calculated |
| Service excluded  | Patient-pay or blocked             |

---

## Sprint 22: Pre-authorisation and claim bundle

| Item         | Detail                                          |
| ------------ | ----------------------------------------------- |
| Theme        | Claim readiness                                 |
| Main outcome | Pre-auth and claim bundles work across services |

### Deliverables

| Deliverable                      |
| -------------------------------- |
| Pre-auth request                 |
| Pre-auth approval/denial         |
| Approval limits                  |
| Pre-auth expiry                  |
| Claim generation from visit      |
| Claim lines                      |
| Claim validation                 |
| Claim attachments                |
| Lab result attachment            |
| Prescription/dispense attachment |
| Referral attachment              |
| Visit summary attachment         |

### Acceptance criteria

| Test                 | Expected result                            |
| -------------------- | ------------------------------------------ |
| Pre-auth required    | Claim line blocked until approved          |
| Claim generated      | Patient/provider/diagnosis/services pulled |
| Missing lab result   | Claim not ready                            |
| Missing prescription | Drug claim not ready                       |
| Missing tariff       | Claim validation fails                     |

---

## Sprint 23: Claim submission, denials, resubmission

| Item         | Detail                                                        |
| ------------ | ------------------------------------------------------------- |
| Theme        | Revenue recovery                                              |
| Main outcome | Claims can be submitted, rejected, corrected, and resubmitted |

### Deliverables

| Deliverable                        |
| ---------------------------------- |
| Claim submission status            |
| Manual portal/API-ready submission |
| Submission reference               |
| Denial management                  |
| Denial categories                  |
| Correction tasks                   |
| Resubmission                       |
| Claim versioning                   |
| Denial dashboard                   |
| Claim ageing                       |
| Missing-document report            |
| Claim audit                        |

### Acceptance criteria

| Test              | Expected result                  |
| ----------------- | -------------------------------- |
| Claim submitted   | Status and reference captured    |
| Claim denied      | Reason and task created          |
| Claim corrected   | Version retained                 |
| Claim resubmitted | History visible                  |
| Denial report     | Shows reason, amount, department |

---

## Sprint 24: Reconciliation, receivables, payer analytics

| Item         | Detail                                           |
| ------------ | ------------------------------------------------ |
| Theme        | Financial closure                                |
| Main outcome | Paid vs claimed vs patient balance is reconciled |

### Deliverables

| Deliverable                     |
| ------------------------------- |
| Remittance entry/import v1      |
| Claim payment matching          |
| Approved amount                 |
| Paid amount                     |
| Underpayment variance           |
| Overpayment suspense            |
| Patient balance transfer        |
| Write-off workflow              |
| Payer receivables ageing        |
| Patient receivables             |
| Claims reconciliation dashboard |
| Claim profitability report v1   |

### Acceptance criteria

| Test                  | Expected result               |
| --------------------- | ----------------------------- |
| Payment received      | Claims matched                |
| Partial payment       | Variance created              |
| Denied amount         | Denial or write-off workflow  |
| Patient balance       | Receivable created            |
| Reconciliation report | Claimed/approved/paid visible |

---

## Phase 7: Reporting, analytics, communication

---

## Sprint 25: Module 8 operational reports

| Item         | Detail                                    |
| ------------ | ----------------------------------------- |
| Theme        | Core management visibility                |
| Main outcome | Minimum operational reports are available |

### Deliverables

| Report               |
| -------------------- |
| Daily sales          |
| Cashier shift        |
| eTIMS invoice status |
| Gross margin         |
| Fast/slow movers     |
| Stockout             |
| Near-expiry          |
| Batch recall         |
| Controlled medicine  |
| Prescription audit   |
| Diagnosis/service    |
| Claims rejection     |
| Staff activity       |
| Data access log      |

### Acceptance criteria

| Test               | Expected result                                     |
| ------------------ | --------------------------------------------------- |
| Owner dashboard    | Sales, margin, stock, claims visible                |
| Pharmacist reports | Expiry, controlled meds, prescription audit visible |
| Accountant reports | eTIMS, payments, claims receivables visible         |
| DPO reports        | Data access and exports visible                     |

---

## Sprint 26: Analytics dashboards, scheduled reports, export controls

| Item         | Detail                                                   |
| ------------ | -------------------------------------------------------- |
| Theme        | Enterprise reporting                                     |
| Main outcome | Dashboards and controlled reporting are production-ready |

### Deliverables

| Deliverable              |
| ------------------------ |
| Owner dashboard          |
| Branch manager dashboard |
| Pharmacist dashboard     |
| Clinic manager dashboard |
| Accountant dashboard     |
| Claims dashboard         |
| DPO dashboard            |
| Scheduled reports        |
| Report export controls   |
| Report run history       |
| Data masking             |
| KPI snapshots            |
| Alert engine             |
| Sync health report       |

### Acceptance criteria

| Test                      | Expected result                      |
| ------------------------- | ------------------------------------ |
| Sensitive report exported | Permission and reason required       |
| Scheduled report          | Delivered as configured              |
| Patient data masked       | Unauthorized users see masked values |
| Alert triggered           | Owner/manager notified               |
| KPI snapshot              | Historical value retained            |

---

## Sprint 27: Module 9 consent, SMS, WhatsApp, templates

| Item         | Detail                                  |
| ------------ | --------------------------------------- |
| Theme        | Consent-led communication               |
| Main outcome | SMS/WhatsApp communications work safely |

### Deliverables

| Deliverable                    |
| ------------------------------ |
| Consent management             |
| Communication preferences      |
| SMS provider adapter           |
| WhatsApp provider adapter      |
| Template manager               |
| Template approval              |
| Opt-out handling               |
| Appointment reminders          |
| Refill reminders               |
| Lab result-ready notifications |
| Communication history          |
| Delivery report                |
| Consent report                 |

### Acceptance criteria

| Test                       | Expected result                  |
| -------------------------- | -------------------------------- |
| No consent                 | Message suppressed               |
| Appointment reminder       | Sent through allowed channel     |
| Lab result notice          | Neutral wording, no result value |
| STOP received              | Opt-out recorded                 |
| WhatsApp template inactive | Message blocked                  |

---

## Sprint 28: Payment prompts, loyalty, campaigns, online patient communication

| Item         | Detail                                                            |
| ------------ | ----------------------------------------------------------------- |
| Theme        | Patient engagement and payment collection                         |
| Main outcome | Patient-facing communication is commercially useful and compliant |

### Deliverables

| Deliverable                          |
| ------------------------------------ |
| Invoice-linked payment prompts       |
| STK prompt from communication module |
| Payment reminder                     |
| Receipt link                         |
| Health education campaigns           |
| Loyalty programme v1                 |
| Retail-only loyalty rules            |
| Campaign approval workflow           |
| Two-way inbox v1                     |
| Patient response routing             |
| Wrong-number handling                |
| Communication cost dashboard         |

### Acceptance criteria

| Test                          | Expected result                        |
| ----------------------------- | -------------------------------------- |
| Payment prompt sent           | Amount matches invoice                 |
| Payment callback              | Invoice paid                           |
| Health campaign               | Consent and approved template required |
| Prescription product campaign | Blocked by default                     |
| Loyalty sale                  | Retail-only points applied             |

---

## Phase 8: Enterprise hardening, security, UAT

---

## Sprint 29: Offline-first hardening and device readiness

| Item         | Detail                                                   |
| ------------ | -------------------------------------------------------- |
| Theme        | Real branch operations                                   |
| Main outcome | System can survive branch connectivity and device issues |

### Deliverables

| Deliverable                  |
| ---------------------------- |
| Offline POS                  |
| Offline invoice queue        |
| Offline pharmacy workflow    |
| Offline stock movement queue |
| Offline clinic queue         |
| Sync dashboard               |
| Conflict handling            |
| Device registry              |
| Device revocation            |
| Receipt printer testing      |
| Label printer testing        |
| Barcode scanner testing      |
| Android/tablet testing       |
| Branch hardware checklist    |

### Acceptance criteria

| Test            | Expected result                |
| --------------- | ------------------------------ |
| Internet drops  | POS continues                  |
| Sync resumes    | Transactions upload            |
| Conflict occurs | Admin resolution queue         |
| Device lost     | Device revoked                 |
| Printer fails   | Sale saved and reprint allowed |

---

## Sprint 30: Security, privacy, audit, compliance hardening

| Item         | Detail                  |
| ------------ | ----------------------- |
| Theme        | Enterprise control      |
| Main outcome | Platform is audit-ready |

### Deliverables

| Deliverable                |
| -------------------------- |
| MFA for sensitive users    |
| Session timeout            |
| Password/security policies |
| Advanced RBAC review       |
| Break-glass access         |
| Data access anomaly alerts |
| Export approval            |
| Consent audit              |
| Staff activity review      |
| Data protection dashboard  |
| Audit pack generation      |
| Backup verification        |
| Restore test               |
| Security test remediation  |

### Acceptance criteria

| Test                    | Expected result          |
| ----------------------- | ------------------------ |
| Sensitive record viewed | Access log created       |
| Bulk export             | Approval/reason required |
| Break-glass used        | Critical audit event     |
| Backup restored         | Restore test passes      |
| Unauthorized role       | Access blocked           |

---

## Sprint 31: End-to-end regression and enterprise UAT round 1

| Item         | Detail                  |
| ------------ | ----------------------- |
| Theme        | Prove full system works |
| Main outcome | End-to-end UAT begins   |

### Deliverables

| Deliverable                   |
| ----------------------------- |
| UAT scripts                   |
| Role-based test packs         |
| Branch workflow tests         |
| Pharmacy test pack            |
| Clinic test pack              |
| Lab test pack                 |
| Claims test pack              |
| Inventory test pack           |
| eTIMS/M-Pesa test pack        |
| Communication test pack       |
| Defect triage board           |
| Regression automation pack v1 |

### Acceptance criteria

| Test                    | Expected result        |
| ----------------------- | ---------------------- |
| Clinic-pharmacy journey | Passes end-to-end      |
| Retail sale             | Passes end-to-end      |
| Lab order/result        | Passes end-to-end      |
| Claim submission        | Passes end-to-end      |
| Payment prompt          | Passes end-to-end      |
| Critical defects        | Logged and prioritised |

---

## Sprint 32: UAT round 2, performance, integration certification readiness

| Item         | Detail                     |
| ------------ | -------------------------- |
| Theme        | Production readiness       |
| Main outcome | Release candidate prepared |

### Deliverables

| Deliverable                      |
| -------------------------------- |
| UAT fixes                        |
| Performance tuning               |
| SQL Server index optimisation    |
| POS speed testing                |
| Report performance testing       |
| eTIMS integration test evidence  |
| M-Pesa integration test evidence |
| SMS/WhatsApp test evidence       |
| Claims workflow validation       |
| Load testing                     |
| Penetration/security remediation |
| Release candidate 1              |

### Acceptance criteria

| Test                 | Expected result           |
| -------------------- | ------------------------- |
| POS checkout         | Meets agreed speed target |
| Reports              | Load within accepted time |
| M-Pesa callback      | Reliable under test       |
| eTIMS queue          | Handles retries           |
| UAT critical defects | Zero open criticals       |

---

## Sprint 33: Production readiness, SOPs, training, branch preparation

| Item         | Detail                       |
| ------------ | ---------------------------- |
| Theme        | Prepare 10 branches          |
| Main outcome | Branch rollout pack is ready |

### Deliverables

| Deliverable                |
| -------------------------- |
| User guides                |
| SOPs                       |
| Cashier SOP                |
| Pharmacist SOP             |
| Clinic SOP                 |
| Lab SOP                    |
| Claims SOP                 |
| Inventory SOP              |
| Daily close SOP            |
| Data protection SOP        |
| Branch readiness checklist |
| Training environment       |
| Super-user training        |
| Opening stock process      |
| Branch device checklist    |
| Cutover plan               |
| Hypercare plan             |

### Acceptance criteria

| Test                         | Expected result                     |
| ---------------------------- | ----------------------------------- |
| Users trained                | Super users sign off                |
| SOPs approved                | Branch teams ready                  |
| Branch data seeded           | 10 branches configured              |
| Opening stock process tested | Physical-to-system process verified |
| Go-live checklist            | Approved by steering team           |

---

## Phase 9: 10-branch production pilot rollout

---

## Sprint 34: Production pilot wave 1 — 2 branches

| Item         | Detail                       |
| ------------ | ---------------------------- |
| Theme        | Controlled production launch |
| Main outcome | First two branches live      |

### Scope

| Work item                                |
| ---------------------------------------- |
| Branch 1 and Branch 2 production cutover |
| Opening stock count                      |
| Staff login verification                 |
| Device/printer/scanner testing           |
| eTIMS live verification                  |
| M-Pesa live verification                 |
| First POS sales                          |
| First pharmacy dispenses                 |
| First clinic visits                      |
| First lab results                        |
| First claims                             |
| Daily close support                      |
| Hypercare daily war room                 |

### Acceptance criteria

| Test                | Expected result                      |
| ------------------- | ------------------------------------ |
| Both branches trade | Sales, payments, receipts work       |
| Pharmacy works      | Prescription/batch/label/audit works |
| Clinic works        | Registration/queue/consult works     |
| Lab works           | Order/result/print works             |
| Claims work         | Claim bundle generated               |
| Daily close         | Shift/eTIMS/payment reports pass     |

---

## Sprint 35: Production pilot wave 2 — additional 3 branches

| Item         | Detail                                       |
| ------------ | -------------------------------------------- |
| Theme        | Expand to 5 live branches                    |
| Main outcome | Branches 3–5 live after wave 1 stabilisation |

### Scope

| Work item                            |
| ------------------------------------ |
| Apply fixes from wave 1              |
| Cut over branches 3–5                |
| Validate branch-specific price lists |
| Validate branch-specific stock       |
| Validate branch payment accounts     |
| Validate branch licences/contracts   |
| Train branch teams                   |
| Live support                         |
| Reports comparison across 5 branches |
| Stabilisation dashboard              |

### Acceptance criteria

| Test                        | Expected result                      |
| --------------------------- | ------------------------------------ |
| 5 branches live             | All core workflows operational       |
| Branch reports              | Sales/stock/claims visible by branch |
| Branch support issues       | Within acceptable threshold          |
| No critical data corruption | Verified through audit/reports       |

---

## Sprint 36: Production pilot wave 3 — final 5 branches

| Item         | Detail                   |
| ------------ | ------------------------ |
| Theme        | Complete 10-branch pilot |
| Main outcome | All 10 branches live     |

### Scope

| Work item                     |
| ----------------------------- |
| Apply wave 2 fixes            |
| Cut over branches 6–10        |
| Full 10-branch monitoring     |
| Central dashboard validation  |
| Inter-branch transfers live   |
| Multi-branch procurement live |
| Claims across all branches    |
| Controlled medicine reporting |
| Data access log review        |
| Daily executive report        |
| Hypercare support             |

### Acceptance criteria

| Test                  | Expected result                 |
| --------------------- | ------------------------------- |
| 10 branches live      | All trade on platform           |
| Owner dashboard       | All branches visible            |
| Inter-branch transfer | Works between live branches     |
| Multi-branch reports  | Correct branch separation       |
| Daily close           | All branches close successfully |
| Audit                 | Branch/user actions traceable   |

---

## Sprint 37: Stabilisation and post-pilot optimisation

| Item         | Detail                                 |
| ------------ | -------------------------------------- |
| Theme        | Stabilise and improve                  |
| Main outcome | Pilot accepted and scale plan approved |

### Deliverables

| Deliverable                      |
| -------------------------------- |
| Pilot performance report         |
| Defect closure report            |
| User adoption report             |
| Revenue and claims report        |
| Stock accuracy report            |
| eTIMS/M-Pesa reliability report  |
| Pharmacy safety report           |
| Data protection report           |
| Branch feedback report           |
| Prioritised optimisation backlog |
| Go/no-go for broader rollout     |
| Version 2/3 roadmap update       |

### Acceptance criteria

| Test                | Expected result                                     |
| ------------------- | --------------------------------------------------- |
| Pilot KPIs reviewed | Steering team accepts or defines fixes              |
| Critical defects    | Closed                                              |
| Users stable        | Training gaps identified and fixed                  |
| Reports trusted     | Owner/accountant/pharmacist/claims reports accepted |
| Next rollout plan   | Approved                                            |

---

## 9. Enterprise Version 2 and Version 3 roadmap after pilot

Because you selected enterprise-grade from day one, many Version 2 items are already pulled into MVP. The remaining enhancements should be planned after the 10-branch pilot.

## Version 2: Optimisation after 10-branch pilot

| Area          | Enhancements                                                         |
| ------------- | -------------------------------------------------------------------- |
| eTIMS         | Deeper automation, advanced exception handling                       |
| M-Pesa        | Advanced reconciliation, reversals, settlement matching              |
| Inventory     | Advanced demand forecasting, supplier scorecards                     |
| Pharmacy      | Advanced drug interaction database, pharmacovigilance automation     |
| EMR           | More clinical templates, chronic dashboards, referral feedback       |
| Lab           | QC logs, analyser integration preparation                            |
| Claims        | Payer-specific adapters, remittance imports, denial prediction rules |
| Communication | Full two-way WhatsApp workflows, patient self-service                |
| Reporting     | Advanced analytics, KPI snapshots, branch benchmarking               |

---

## Version 3: Scale, interoperability, intelligence

| Area               | Enhancements                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| FHIR               | Patient, Encounter, Observation, DiagnosticReport, MedicationRequest, MedicationDispense, Claim |
| GS1                | GTIN, GLN, DataMatrix, serialization, EPCIS-ready events                                        |
| AI                 | Claim validation, stock anomaly detection, clinical note drafting, prescription checks          |
| IoT                | Cold-chain fridge sensors and automated quarantine                                              |
| Patient portal     | Secure results, visit summaries, refills, appointments                                          |
| Partner portals    | External lab, insurer, referral, supplier portals                                               |
| Data warehouse     | Enterprise BI and predictive analytics                                                          |
| Privacy governance | DPIA support, data subject requests, breach workflows                                           |

---

## 10. Branch rollout strategy

Do not take all 10 branches live on the same day. Use controlled waves.

## Recommended rollout waves

| Wave          |                   Branches | Goal                                       |
| ------------- | -------------------------: | ------------------------------------------ |
| Wave 0        | Training/simulation branch | Validate workflows without production risk |
| Wave 1        |                 2 branches | Prove live operations                      |
| Wave 2        |                 3 branches | Expand after stabilisation                 |
| Wave 3        |                 5 branches | Complete pilot                             |
| Stabilisation |                     All 10 | Fix, optimise, standardise                 |

---

## Branch readiness checklist

Each branch must pass this before go-live.

| Area           | Required before go-live                                        |
| -------------- | -------------------------------------------------------------- |
| Branch profile | Branch created and configured                                  |
| Licences       | PPB/KMPDC/KMLTTB/SHA/private contracts loaded where applicable |
| Staff          | Users, roles, licences, branch assignments completed           |
| Products       | Product catalogue available                                    |
| Prices         | Branch price list active                                       |
| Services       | Consultation, lab, procedure, pharmacy services configured     |
| Stock          | Opening physical count completed and approved                  |
| Payment        | Till/Paybill/STK branch mapping tested                         |
| eTIMS          | Branch invoicing tested                                        |
| Devices        | Desktop/tablet/Android/printers/scanners tested                |
| Pharmacy       | Labels, batches, controlled register tested                    |
| Clinic         | Queue, EMR, vitals, visit summary tested                       |
| Lab            | Test catalogue, result templates, printout tested              |
| Claims         | Payer contracts, tariffs, pre-auth rules tested                |
| Communication  | SMS/WhatsApp templates and consent flow tested                 |
| Reports        | Daily close, sales, stock, eTIMS reports tested                |
| Training       | Users trained and signed off                                   |
| Support        | Hypercare contact and escalation clear                         |

---

## 11. Data strategy for “no existing data”

Having no existing system does not remove data work. It means the project must create clean master data from scratch.

## Required data before go-live

| Data group                | Needed for                          |
| ------------------------- | ----------------------------------- |
| 10 branch profiles        | Branch operations                   |
| Business/licence records  | Compliance                          |
| Staff and roles           | System access                       |
| Professional licences     | Clinical/pharmacy/lab sign-off      |
| Product catalogue         | POS, inventory, pharmacy            |
| Medicine catalogue        | Dispensing, batches, prescriptions  |
| Service catalogue         | Clinic/lab/procedure billing        |
| Lab test catalogue        | Lab-lite                            |
| Supplier catalogue        | Procurement                         |
| Price lists               | Retail, wholesale, branch-specific  |
| Payer schemes             | Claims                              |
| Tariff tables             | Claims pricing                      |
| Communication templates   | SMS/WhatsApp                        |
| Opening stock             | Inventory and pharmacy go-live      |
| Hardware/device list      | Branch readiness                    |
| Chart of accounts mapping | Accounting/reconciliation readiness |

---

## Master-data workstream

| Sprint       | Activity                                          |
| ------------ | ------------------------------------------------- |
| Sprint 1–2   | Define master-data templates                      |
| Sprint 3–4   | Build import tools                                |
| Sprint 5–8   | Build initial product/service/supplier catalogues |
| Sprint 9–16  | Build medicine/lab/tariff-specific catalogues     |
| Sprint 17–24 | Validate branch-specific data                     |
| Sprint 29–33 | Final branch seeding and opening stock            |
| Sprint 34–36 | Branch-by-branch data validation during go-live   |

---

## 12. Device and hardware plan

## Standard branch hardware kit

| Device                    | Use                                                      |
| ------------------------- | -------------------------------------------------------- |
| Desktop/laptop            | Admin, reception, POS, pharmacy, lab                     |
| Tablet                    | Queue, triage, stock count, mobile workflows             |
| Android phone             | Communication, delivery, stock count, fallback workflows |
| 58mm/80mm receipt printer | Receipts                                                 |
| Label printer             | Pharmacy labels, sample labels                           |
| Barcode scanner           | POS, receiving, stock count                              |
| Cash drawer               | Cashier control                                          |
| UPS/power backup          | Branch reliability                                       |
| Router/fallback internet  | Offline risk reduction                                   |

---

## Device testing matrix

| Device/workflow | Must be tested                              |
| --------------- | ------------------------------------------- |
| Receipt printer | POS receipt, reprint                        |
| Label printer   | Medicine label, sample label                |
| Barcode scanner | Product scan, batch scan, stock count       |
| Android phone   | Queue, stock count, communication, delivery |
| Tablet          | Triage, clinician, stock count              |
| Desktop         | POS, EMR, claims, reports                   |
| Offline mode    | Sale, dispense, queue, stock movement       |
| Branch network  | Local printer and internet                  |

---

## 13. Integration implementation plan

## eTIMS

| Stage                | Deliverable                                     |
| -------------------- | ----------------------------------------------- |
| Design               | eTIMS payload, status, queue, credit note model |
| Sandbox/test         | Submit invoice and credit note test             |
| Exception handling   | Rejection, retry, offline queue                 |
| Production readiness | Branch KRA/eTIMS configuration                  |
| Go-live              | Monitor accepted/rejected/queued invoices       |
| Post-go-live         | Accountant exception workflow                   |

---

## M-Pesa

| Stage          | Deliverable                                     |
| -------------- | ----------------------------------------------- |
| Setup          | Daraja credentials, callback URLs, Till mapping |
| STK            | Invoice-linked prompts                          |
| C2B            | Manual customer payment confirmation            |
| Status query   | Resolve pending payments                        |
| Reversal       | Refund/reversal-ready workflow                  |
| Reconciliation | M-Pesa vs POS matching                          |
| Reporting      | Unmatched, overpaid, underpaid payments         |

---

## SMS and WhatsApp

| Stage            | Deliverable                             |
| ---------------- | --------------------------------------- |
| Provider setup   | SMS and WhatsApp provider selected      |
| Consent setup    | Patient preferences                     |
| Templates        | Appointment, refill, lab-ready, payment |
| Approval         | Template governance                     |
| Delivery logs    | Sent/delivered/failed                   |
| Incoming replies | STOP, confirm, reschedule, refill       |
| Reporting        | Consent, delivery, opt-out              |

---

## Claims

| Stage                | Deliverable                        |
| -------------------- | ---------------------------------- |
| Generic engine       | Payers, schemes, tariffs           |
| Manual workflow      | Portal/manual status tracking      |
| SHA/private/employer | Scheme-specific configuration      |
| Attachments          | Claim bundle                       |
| Denials              | Rejection and resubmission         |
| Reconciliation       | Remittance and receivables         |
| API adapters         | Add where payer APIs are available |

---

## 14. Quality strategy

## Quality gates by sprint

| Gate                | Applies to                                    |
| ------------------- | --------------------------------------------- |
| Code review         | Every change                                  |
| Unit tests          | Business rules                                |
| API tests           | Every endpoint                                |
| UI tests            | Core workflows                                |
| Security review     | Auth, RBAC, patient data, payments            |
| Audit review        | Financial, clinical, pharmacy, claims actions |
| UAT                 | Every module                                  |
| Regression          | Every release candidate                       |
| Performance testing | POS, reports, claims, stock search            |
| Integration testing | eTIMS, M-Pesa, SMS, WhatsApp                  |
| Offline testing     | POS, pharmacy, inventory, queue               |
| Go-live readiness   | Every branch                                  |

---

## Enterprise definition of done

A feature is not done until:

| Requirement                                            |
| ------------------------------------------------------ |
| API implemented                                        |
| UI implemented                                         |
| SQL migration implemented                              |
| RBAC applied                                           |
| Audit log applied                                      |
| Data access log applied where patient data is involved |
| Validation rules implemented                           |
| Error states handled                                   |
| Offline behaviour considered                           |
| Report impact considered                               |
| Test cases written                                     |
| UAT scenario written                                   |
| Documentation updated                                  |
| Security reviewed                                      |
| Product owner accepted                                 |

---

## 15. End-to-end acceptance test scenarios

These are mandatory before production.

| Scenario              | End-to-end flow                                                                   |
| --------------------- | --------------------------------------------------------------------------------- |
| Retail sale           | Scan item → payment → eTIMS → receipt → stock-out → report                        |
| Prescription dispense | Upload prescription → pharmacist approval → batch → label → POS → payment → eTIMS |
| Controlled medicine   | Prescription → controlled register → stock balance → report                       |
| Online pharmacy       | Order → prescription upload → pharmacist review → payment → delivery → audit      |
| Clinic visit          | Registration → queue → vitals → note → diagnosis → orders → summary               |
| Lab test              | Order → billing → collection → result → verification → print → EMR                |
| External lab          | Order → send-out → result upload → verification → print                           |
| Claim                 | Visit → bill → diagnosis → lab/drug evidence → claim → denial/payment             |
| Inter-branch transfer | Request → approve → dispatch → receive → variance                                 |
| Stock count           | Count → variance → approval → adjustment                                          |
| Recall                | Batch recalled → block → affected stock/patients → quarantine                     |
| Communication         | Consent → reminder → reply → opt-out → report                                     |
| Payment prompt        | Invoice → STK → callback → receipt → reconciliation                               |
| Data protection       | Patient record access → log → DPO report                                          |
| Offline branch        | Sale/dispense offline → sync → reports correct                                    |

---

## 16. Risk register tailored to your setup

| Risk                            | Why serious                                             | Mitigation                                               |
| ------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| 10 branches increase complexity | Branch-specific stock, staff, prices, devices, licences | Wave rollout, branch readiness checklist                 |
| No existing data                | Clean data must be created from scratch                 | Master-data factory from Sprint 6                        |
| eTIMS new setup                 | Integration/certification delays can block go-live      | Start eTIMS track early, queue/manual fallback           |
| All claims scope                | SHA/private/employer rules differ                       | Generic configurable payer engine                        |
| Controlled medicines            | High compliance risk                                    | Controlled register in MVP, strict RBAC                  |
| Online pharmacy + delivery      | Regulatory and safety risk                              | Pharmacist review, prescription controls, delivery audit |
| SMS + WhatsApp MVP              | Consent/privacy risk                                    | Consent engine before messaging                          |
| SQL Server performance          | Reports may slow operations                             | Reporting views/snapshots, indexing, warehouse later     |
| Internal team learning curve    | NestJS/Vite/SQL Server/Azure needs discipline           | Architecture standards, code reviews, DevOps             |
| Device variability              | Printers/scanners/tablets may fail                      | Hardware test matrix and branch kit                      |
| Offline sync complexity         | Data conflicts                                          | Event queue, conflict handling, sync dashboard           |
| Branch user adoption            | Workflow resistance                                     | Super-user model, SOPs, hypercare                        |
| Claims denials                  | Revenue loss                                            | Claim validation before submission                       |
| Stock mismatch at go-live       | Inventory mistrust                                      | Mandatory physical opening count                         |
| Patient data leakage            | Legal/compliance risk                                   | RBAC, masking, access logs, export controls              |
| Scope pressure                  | Enterprise scope can sprawl                             | Release gates and change-control board                   |

---

## 17. Governance model

## Weekly delivery cadence

| Meeting                  | Frequency      | Purpose                                |
| ------------------------ | -------------- | -------------------------------------- |
| Daily stand-up           | Daily          | Team execution                         |
| Squad refinement         | Weekly         | Backlog grooming                       |
| Architecture review      | Weekly         | Technical decisions                    |
| SME review               | Weekly         | Pharmacy/clinic/lab/claims correctness |
| QA defect triage         | Twice weekly   | Defect prioritisation                  |
| Sprint demo              | Every 2 weeks  | Working software review                |
| Sprint retrospective     | Every 2 weeks  | Process improvement                    |
| Steering committee       | Every 2 weeks  | Scope, budget, risks, decisions        |
| Go-live readiness review | During rollout | Branch cutover decision                |

---

## Steering committee decision areas

| Decision type              |
| -------------------------- |
| Scope changes              |
| Integration delays         |
| Regulatory constraints     |
| Go-live approval           |
| Branch rollout approval    |
| Critical defect acceptance |
| Vendor/provider selection  |
| Data protection decisions  |
| Budget/resource changes    |

---

## 18. Immediate next 30 days

## Week 1

| Activity                                   |
| ------------------------------------------ |
| Confirm internal team members and leads    |
| Set up project governance                  |
| Create backlog structure                   |
| Create architecture repository             |
| Confirm Azure/client infrastructure owner  |
| Confirm SMS/WhatsApp provider shortlist    |
| Confirm eTIMS implementation path          |
| Confirm M-Pesa Daraja callback environment |
| Confirm 10 branch types and services       |

---

## Week 2

| Activity                                                |
| ------------------------------------------------------- |
| Complete 10-branch process mapping                      |
| Define role and permission matrix                       |
| Define master-data templates                            |
| Define product/service/lab/medicine catalogue structure |
| Define claims payer model                               |
| Define online pharmacy and delivery workflow            |
| Define controlled medicine controls                     |
| Define branch hardware kit                              |

---

## Week 3

| Activity                                 |
| ---------------------------------------- |
| Finalise solution architecture           |
| Create Dev/Staging/UAT environments      |
| Build backend/frontend skeleton          |
| Build authentication and RBAC foundation |
| Build audit log foundation               |
| Build document storage foundation        |
| Start SQL Server schema baseline         |

---

## Week 4

| Activity                                            |
| --------------------------------------------------- |
| Build organisation/branch foundation                |
| Build user/staff foundation                         |
| Build patient/product/service master foundation     |
| Build bulk import framework                         |
| Build first branch setup screens                    |
| Start UI design for POS, pharmacy, EMR, lab, claims |
| Confirm UAT test structure                          |

---

## 19. Items to finalise during Sprint 0

You have provided enough to proceed. These are the remaining operational choices that should be closed during Sprint 0, not blockers now.

| Area                       | Sprint 0 decision                                        |
| -------------------------- | -------------------------------------------------------- |
| Azure ownership            | Which Azure tenant/subscription will host production     |
| SQL Server deployment      | Azure SQL, SQL Managed Instance, or SQL Server VM        |
| App hosting                | App Service, Container Apps, or AKS                      |
| SMS provider               | Provider, sender ID, pricing, delivery reports           |
| WhatsApp provider          | WhatsApp Business Platform provider and template process |
| eTIMS path                 | Direct API/VSCU/OSCU path or certified middleware route  |
| Private insurers           | Initial insurer list and submission method per payer     |
| External labs              | Initial partner labs and result delivery method          |
| Online pharmacy policy     | Which medicines are allowed online/delivery              |
| Controlled medicine policy | Branch-by-branch controlled stock permissions            |
| Device procurement         | Approved printer/scanner/tablet models                   |
| Branch wave order          | Which 2 branches go live first                           |
| Support model              | Internal helpdesk, escalation, hypercare hours           |

---

## 20. Recommended final delivery timeline

Assuming 2-week sprints:

| Stage                         | Sprint range | Approximate duration |
| ----------------------------- | -----------: | -------------------: |
| Mobilisation and architecture |          0–3 |              8 weeks |
| Core platform and compliance  |          4–6 |              6 weeks |
| Commerce, payments, eTIMS     |          7–9 |              6 weeks |
| Inventory and stock control   |        10–12 |              6 weeks |
| Pharmacy and online pharmacy  |        13–16 |              8 weeks |
| EMR and lab-lite              |        17–20 |              8 weeks |
| Claims and reconciliation     |        21–24 |              8 weeks |
| Reporting and communication   |        25–28 |              8 weeks |
| Hardening and UAT             |        29–33 |             10 weeks |
| 10-branch rollout             |        34–37 |              8 weeks |

Total to stable 10-branch enterprise pilot: **approximately 72 weeks**.

With a strong internal team running multiple squads in parallel, selected workstreams can overlap and reduce the practical timeline. The quality-first assumption means the plan should not be compressed by removing security, audit, UAT, device testing, or branch-readiness gates.

---

## 21. Final recommendation

For your selected scope, the correct implementation posture is:

```text
Enterprise platform first.
Branch-aware everything.
Audit everything.
Offline-capable operations.
Compliance-controlled pharmacy and clinic workflows.
Claims-configurable, not payer-hardcoded.
Communication consent-led from day one.
10-branch rollout in waves, not a big-bang launch.
```

The project should be managed as a **regulated health-commerce platform**, not as a normal POS, EMR, or pharmacy app.

The most important implementation rule is:

**Do not let any module go live unless it is branch-aware, role-controlled, auditable, reportable, and tested in a complete end-to-end workflow across POS, inventory, pharmacy, clinic, lab, claims, reporting, and communication.**
