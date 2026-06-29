# Module 8: Reporting and Analytics Module

This module is the **business intelligence, compliance, audit, and decision-support engine** of the system.

Modules 1–7 generate operational data:

```text
Module 1: licences, branches, staff, contracts
Module 2: sales, payments, invoices, eTIMS, shifts
Module 3: prescriptions, dispensing, controlled medicines
Module 4: inventory, purchasing, batches, expiry, transfers
Module 5: clinic visits, diagnoses, services, referrals
Module 6: lab orders, samples, results, send-outs
Module 7: claims, denials, receivables, reconciliation
Module 8: turns all that data into reports, dashboards, alerts, audit trails, and management decisions
```

For a Kenyan pharmacy, clinic, chemist, or small health-retail chain, reporting is not just “nice to have.” It is needed for:

```text
cash control → tax/eTIMS compliance → stock control → expiry control → pharmacy safety → claims recovery → clinical quality → data protection → owner visibility
```

Kenya’s Digital Health Act places data collection, collation, analysis, reporting, storage, usage, sharing, retrieval, archival, data quality assurance, and audit within the national digital-health system architecture. The same Act also points to shared resources such as the national health data dictionary, client registry, facility registry, health worker registry, product catalogue, interoperability layer, health management information services, and finance/insurance services. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/2023/15))

---

## 1. Purpose of the module

The Reporting and Analytics Module should:

| Purpose                           | Practical meaning                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------- |
| Give owners visibility            | Sales, margin, stock, cash, claims, staff, branches                               |
| Support managers                  | Daily operations, queues, shift variances, stockouts, pending work                |
| Support accountants               | eTIMS status, invoices, payments, credit notes, taxes, receivables                |
| Support pharmacists               | prescription audit, controlled medicines, batch recall, near-expiry               |
| Support clinic managers           | diagnosis/service reports, clinician workload, visit volumes                      |
| Support procurement               | fast/slow movers, reorder, stockouts, dead stock, supplier performance            |
| Support billing officers          | claim denials, ageing, resubmissions, reconciliation                              |
| Support compliance                | licence expiry, data access logs, staff activity, audit trails                    |
| Support data protection           | who accessed patient data, what was exported, what was shared                     |
| Support future national reporting | health data dictionary, interoperability, aggregate reporting readiness           |
| Detect leakage and fraud          | discounts, voids, refunds, stock adjustments, cashier variances, duplicate claims |

---

## 2. Kenya-specific design basis

## A. eTIMS and tax reporting

Kenya’s Electronic Tax Invoice Regulations apply to persons carrying on business unless exempted, require each sale to be recorded in the system, require an invoice for each sale, require invoice details to be transmitted to the Commissioner, and require stock-in/stock-out records for applicable users. The same regulations require e-invoicing systems to be secure, tamper-proof, able to integrate with KRA systems, maintain data integrity, authenticate authorized users, log all activities, and assign a unique identifier to each invoice. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/64/eng@2024-03-28))

Software implication:

| eTIMS requirement                             | Reporting requirement                                   |
| --------------------------------------------- | ------------------------------------------------------- |
| Every sale recorded                           | Daily sales report must reconcile with invoice register |
| Invoice generated per sale                    | eTIMS invoice status report                             |
| Invoice details transmitted                   | Submitted/accepted/rejected/queued report               |
| Stock-in/stock-out records                    | Inventory movement and stock ledger reports             |
| System logs activities                        | User activity and eTIMS audit logs                      |
| Credit/debit notes reference original invoice | Credit note and reversal reports                        |

---

## B. Health data reporting and data governance

Kenya’s health information management regulations state that the Kenya Health Data Governance Framework governs the collection, access, sharing, and use of health data; they also refer to maintaining a National Health Data Bank, health-data-controller inventories, security measures including encryption and access controls, and publishing select aggregate health data. ([health.go.ke](https://health.go.ke/sites/default/files/2024-11/FINAL%20Digital%20Health%20%28Health%20Information%20Management%29%20Regulations%2019.11.24.pdf))

Software implication:

| Health data governance need       | Reporting requirement                                                    |
| --------------------------------- | ------------------------------------------------------------------------ |
| Collection and use of health data | Data dictionary and standard report definitions                          |
| Access controls                   | Data access log report                                                   |
| Sharing of health data            | Export/share log report                                                  |
| Aggregate reporting               | Diagnosis, service, immunisation, lab, chronic-care reports              |
| Security controls                 | Failed login, unusual access, export, breach, role-change reports        |
| Data quality                      | Missing diagnosis, unsigned notes, duplicate patients, incomplete visits |

---

## C. Data protection

Kenya’s Data Protection Act defines health data as data about a person’s physical or mental health, including data collected during registration for or provision of health services, and classifies health status as sensitive personal data. The Data Protection General Regulations classify processing sensitive personal data, children’s data, large-scale personal data, or cross-referenced datasets as high-risk processing that requires a data protection impact assessment before processing. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/2019/24/eng%402022-12-31)) ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2021/263/eng%402022-12-31))

Software implication:

| Data protection need  | Reporting requirement                        |
| --------------------- | -------------------------------------------- |
| Sensitive health data | Strict role-based reports                    |
| Access accountability | Patient data access log                      |
| Export accountability | Data export/share report                     |
| High-risk processing  | DPIA support report                          |
| Data minimization     | Report-level masking and aggregation         |
| Patient rights        | Access/rectification/erasure request log     |
| Breach readiness      | Security incident and unusual access reports |

---

## D. Claims and insurance reporting

SHA regulations require contracted providers and facilities to use and verify beneficiary data, provide services within benefit limits, maintain beneficiary records in accessible format, and maintain adequate systems for collecting, processing, storing, retrieving, and distributing beneficiary records. The regulations also require incomplete or erroneous claims to be returned with reasons, rejected claims to be notified with reasons, and claims processing to be guided by prescribed tariffs. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402024-03-08))

Software implication:

| Claims need          | Reporting requirement                            |
| -------------------- | ------------------------------------------------ |
| Benefit verification | Eligibility and pre-auth reports                 |
| Service limits       | Limit-exceeded and pre-auth reports              |
| Incomplete claims    | Missing-document and claim-readiness reports     |
| Rejected claims      | Claims rejection report                          |
| Tariffs              | Tariff mismatch and underpayment reports         |
| Accessible records   | Claim bundle and attachment completeness reports |

---

## E. Pharmacy traceability and recalls

PPB’s authentication and traceability standards describe traceability as important for patient safety, supply-chain integrity, and protection against falsified or substandard health products. ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/standards-for-authentication-and-traceability-of-health-products-and-technologies/))

Software implication:

| Pharmacy safety need      | Reporting requirement                       |
| ------------------------- | ------------------------------------------- |
| Batch traceability        | Batch recall report                         |
| Product integrity         | Supplier, batch, expiry, quarantine reports |
| Patient safety            | Affected-patient-by-batch report            |
| Dispensing accountability | Prescription and dispense audit             |
| Controlled medicines      | Controlled medicine register/report         |

---

## 3. Core users

| User                      | Main reporting needs                                                   |
| ------------------------- | ---------------------------------------------------------------------- |
| Owner/director            | Sales, margin, cash, stock value, claims, branches, staff, risks       |
| Branch manager            | Daily operations, stock, shifts, discounts, variances                  |
| Accountant                | eTIMS, invoices, payments, credit notes, receivables, reconciliation   |
| Pharmacist/superintendent | prescriptions, controlled medicines, recalls, expiry, dispensing audit |
| Procurement officer       | fast movers, slow movers, stockouts, reorder, supplier price changes   |
| Clinic manager            | visits, diagnoses, services, clinician workload, referrals             |
| Lab in-charge             | lab volumes, pending results, rejected samples, external send-outs     |
| Billing/claims officer    | claim readiness, denials, pre-auth, ageing, reconciliation             |
| Compliance officer        | licences, staff activity, overrides, audit trails                      |
| Data protection officer   | data access, exports, breach alerts, consent, DPIA support             |
| Auditor                   | immutable logs, exceptions, adjustments, reversals, user actions       |
| Franchise/head office     | branch comparisons, standard KPIs, compliance scorecards               |

---

## 4. Reporting architecture

The module should have three layers.

```text
Operational reports
    Real-time reports from transactional modules

Management analytics
    Dashboards, trends, KPIs, comparisons, exceptions

Compliance and audit reports
    Immutable logs, access records, regulatory exports, claim/eTIMS evidence
```

## Recommended technical architecture

| Layer                  | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| Transactional database | Live POS, EMR, pharmacy, lab, claims, inventory                  |
| Reporting replica      | Reduces load on live system                                      |
| Analytics warehouse    | Historical trends, KPIs, branch comparisons                      |
| Metrics engine         | Standard definitions for sales, margin, stock cover, denial rate |
| Report builder         | Controlled custom reports                                        |
| Scheduled reports      | Daily email/PDF/Excel exports                                    |
| Alert engine           | Exceptions: stockout, expiry, eTIMS rejection, claim denial      |
| Audit log store        | Immutable user/system activity                                   |
| Export control         | Permissioned CSV/PDF/Excel downloads                             |
| Data masking layer     | Hide patient-sensitive fields for non-clinical users             |

For small clinics and chemists, the MVP can start with operational reports directly from the application database. Larger branches/chains should move to a reporting replica or analytics warehouse.

---

## 5. Data sources

| Source module          | Data used in reporting                                     |
| ---------------------- | ---------------------------------------------------------- |
| Organisation/licensing | branches, licences, professionals, contracts               |
| POS/billing            | sales, invoices, payments, discounts, refunds, shifts      |
| Pharmacy dispensing    | prescriptions, dispenses, substitutions, controlled items  |
| Inventory              | stock balances, batches, purchases, transfers, adjustments |
| Clinic EMR             | visits, diagnoses, services, referrals, certificates       |
| Lab-lite               | orders, samples, results, send-outs                        |
| Claims/insurance       | pre-auth, claims, denials, reconciliation                  |
| User/security          | logins, activity, access, permissions                      |
| Notifications          | SMS/WhatsApp/email sent, failures, consent status          |
| Integrations           | eTIMS, M-Pesa, SHA/private insurer, external lab           |

---

## 6. Minimum report catalogue

## 6.1 Daily sales report

**Primary user:** Owner/manager
**Purpose:** Know how much was sold, by whom, through which branch, and by which payment method.

| Section     | Details                                                        |
| ----------- | -------------------------------------------------------------- |
| Data source | POS, billing, pharmacy, clinic, lab                            |
| Frequency   | Real-time, daily close                                         |
| Filters     | Date, branch, cashier, category, payment method, customer type |
| Grouping    | Branch, cashier, product/service category, payment method      |
| Export      | PDF, Excel, CSV                                                |

### Key columns

| Column                                           |
| ------------------------------------------------ |
| Date/time                                        |
| Branch                                           |
| Sale number                                      |
| Invoice number                                   |
| eTIMS status                                     |
| Customer/patient                                 |
| Category: retail/drug/consultation/lab/procedure |
| Subtotal                                         |
| Discount                                         |
| Tax                                              |
| Gross total                                      |
| Payment method                                   |
| Amount paid                                      |
| Balance                                          |
| Cashier                                          |
| Status: completed/refunded/credit-noted          |

### Metrics

| Metric                    | Formula                                     |
| ------------------------- | ------------------------------------------- |
| Gross sales               | Sum of completed sale totals before returns |
| Net sales                 | Gross sales - refunds - credit notes        |
| Discount rate             | Discount total / gross sales                |
| Average transaction value | Net sales / number of transactions          |
| Cash sales                | Sum payments where method = cash            |
| M-Pesa sales              | Sum payments where method = M-Pesa          |
| Insurance sales           | Sum payer portion posted to claims          |
| Credit sales              | Sum posted to customer/payer receivable     |

### Alerts

| Alert               | Trigger                                   |
| ------------------- | ----------------------------------------- |
| Sales unusually low | Below branch daily baseline               |
| High discount day   | Discount rate above threshold             |
| High refund day     | Refunds above threshold                   |
| Many voids          | Count above threshold                     |
| eTIMS pending       | Sales completed but invoices not accepted |

---

## 6.2 Cashier shift report

**Primary user:** Owner/manager
**Purpose:** Cash and payment control.

| Section     | Details                                       |
| ----------- | --------------------------------------------- |
| Data source | POS, payments, shifts                         |
| Frequency   | Every shift close                             |
| Filters     | Date, branch, cashier, terminal, shift status |
| Grouping    | Cashier, branch, terminal                     |
| Export      | PDF/Excel                                     |

### Key columns

| Column                 |
| ---------------------- |
| Shift number           |
| Branch                 |
| Terminal               |
| Cashier                |
| Open time              |
| Close time             |
| Opening float          |
| Cash sales             |
| Cash refunds           |
| Cash drops             |
| Expected cash          |
| Counted cash           |
| Variance               |
| M-Pesa expected        |
| M-Pesa confirmed       |
| Card expected          |
| Credit sales           |
| Insurer/SHA receivable |
| Discounts              |
| Voids                  |
| Refunds                |
| Manager approval       |
| Closing notes          |

### Metrics

| Metric              | Formula                            |
| ------------------- | ---------------------------------- |
| Cash variance       | Counted cash - expected cash       |
| Shift sales         | Sum sales within shift             |
| Refund ratio        | Refund value / shift sales         |
| Void ratio          | Void count / transactions          |
| Unreconciled M-Pesa | Expected M-Pesa - confirmed M-Pesa |

### Alerts

| Alert            | Trigger                            |
| ---------------- | ---------------------------------- |
| Cash shortage    | Variance below negative threshold  |
| Cash excess      | Variance above positive threshold  |
| Many refunds     | Refund count/value above threshold |
| Shift not closed | Open shift past configured hours   |
| M-Pesa mismatch  | POS M-Pesa > confirmed M-Pesa      |

---

## 6.3 eTIMS invoice status report

**Primary user:** Accountant
**Purpose:** Track invoice submission, acceptance, rejection, queued invoices, credit notes, and tax compliance.

| Section     | Details                                        |
| ----------- | ---------------------------------------------- |
| Data source | POS, invoice engine, eTIMS integration         |
| Frequency   | Real-time/daily                                |
| Filters     | Date, branch, status, invoice type, error code |
| Export      | Excel, PDF, CSV                                |

### Key columns

| Column                                     |
| ------------------------------------------ |
| Invoice number                             |
| eTIMS unique identifier                    |
| Sale number                                |
| Branch                                     |
| KRA PIN                                    |
| Invoice date/time                          |
| Submission date/time                       |
| Buyer PIN                                  |
| Gross amount                               |
| Tax amount                                 |
| Status: queued/submitted/accepted/rejected |
| Error code/message                         |
| Retry count                                |
| Credit note reference                      |
| Cashier                                    |
| Last sync time                             |

### Required status buckets

```text
Accepted
Submitted
Queued offline
Retrying
Rejected
Credit-noted
Cancelled before submission
Manual review
```

### Alerts

| Alert                | Trigger                                    |
| -------------------- | ------------------------------------------ |
| Rejected invoice     | eTIMS rejection received                   |
| Queued too long      | Invoice pending beyond threshold           |
| Missing buyer PIN    | Corporate/claimable invoice missing PIN    |
| Credit note mismatch | Credit note without valid original invoice |
| Offline period       | eTIMS queue accumulated                    |

---

## 6.4 Gross margin report

**Primary user:** Owner
**Purpose:** Know actual profitability, not just sales.

| Section     | Details                                            |
| ----------- | -------------------------------------------------- |
| Data source | POS, inventory, purchase cost, price lists         |
| Frequency   | Daily/weekly/monthly                               |
| Filters     | Product, category, branch, supplier, cashier, date |
| Grouping    | Product, category, branch, supplier, batch         |
| Export      | Excel/PDF                                          |

### Key columns

| Column          |
| --------------- |
| Product/service |
| Category        |
| Quantity sold   |
| Sales value     |
| Cost value      |
| Gross profit    |
| Gross margin %  |
| Discount value  |
| Supplier        |
| Batch           |
| Branch          |
| Price list      |
| Cashier         |

### Metrics

| Metric           | Formula                            |
| ---------------- | ---------------------------------- |
| Gross profit     | Net sales - cost of goods sold     |
| Gross margin %   | Gross profit / net sales           |
| Markup %         | Gross profit / cost                |
| Discount impact  | Discount value / gross sales       |
| Low-margin sales | Lines where margin below threshold |

### Important design note

Services such as consultation and lab procedures may not have a simple stock cost. The system should allow:

| Item type             | Cost method                              |
| --------------------- | ---------------------------------------- |
| Medicine/retail stock | Batch cost or weighted average cost      |
| Lab test              | Reagent/consumable cost or standard cost |
| Procedure             | Consumables + standard service cost      |
| Consultation          | Optional clinician/time overhead         |
| Package               | Allocated cost per component             |

---

## 6.5 Fast/slow movers report

**Primary user:** Procurement
**Purpose:** Know what to buy, transfer, promote, or stop buying.

| Section     | Details                                       |
| ----------- | --------------------------------------------- |
| Data source | Inventory, sales, dispensing, stock movements |
| Frequency   | Daily/weekly/monthly                          |
| Filters     | Branch, category, supplier, date range        |
| Grouping    | Product, branch, category, supplier           |
| Export      | Excel                                         |

### Key columns

| Column                         |
| ------------------------------ |
| Product                        |
| Category                       |
| Branch                         |
| Quantity sold/dispensed        |
| Sales value                    |
| Gross margin                   |
| Current stock                  |
| Average daily/monthly movement |
| Days of stock cover            |
| Last sale date                 |
| Supplier                       |
| Reorder point                  |
| Suggested action               |

### Classifications

| Classification    | Rule example                                   |
| ----------------- | ---------------------------------------------- |
| Fast mover        | Top 20% by quantity or value                   |
| Slow mover        | Movement below threshold                       |
| Dead stock        | No movement for 90/180 days                    |
| Overstocked       | Stock cover above configured months            |
| Critical mover    | High clinical importance and frequent stockout |
| High-margin mover | Strong profit contributor                      |

### Suggested actions

| Situation               | Action                               |
| ----------------------- | ------------------------------------ |
| Fast mover, low stock   | Reorder                              |
| Slow mover, high stock  | Stop reorder                         |
| Dead stock              | Transfer/return/write-down           |
| Fast mover, high margin | Protect availability                 |
| Fast mover, low margin  | Renegotiate supplier or adjust price |

---

## 6.6 Stockout report

**Primary user:** Procurement
**Purpose:** Avoid lost sales, poor patient care, and emergency purchases.

| Section     | Details                                      |
| ----------- | -------------------------------------------- |
| Data source | Inventory, POS, dispensing, reorder settings |
| Frequency   | Real-time/daily                              |
| Filters     | Branch, category, critical item, supplier    |
| Export      | Excel/PDF                                    |

### Key columns

| Column                               |
| ------------------------------------ |
| Product                              |
| Generic name                         |
| Branch                               |
| Current stock                        |
| Reserved stock                       |
| Available stock                      |
| Reorder point                        |
| Minimum stock                        |
| Average daily usage                  |
| Days out of stock                    |
| Last sold/dispensed                  |
| Preferred supplier                   |
| Supplier lead time                   |
| Open PO quantity                     |
| Transfer available from other branch |
| Suggested action                     |

### Alerts

| Alert                              | Trigger                               |
| ---------------------------------- | ------------------------------------- |
| Out of stock                       | Available stock = 0                   |
| Below reorder point                | Available + on-order <= reorder point |
| Critical item out                  | Critical flag + stockout              |
| Open PO delayed                    | Expected delivery passed              |
| Branch A out, Branch B overstocked | Suggest transfer                      |

---

## 6.7 Near-expiry report

**Primary user:** Pharmacist/manager
**Purpose:** Reduce losses and prevent expired stock dispensing.

| Section     | Details                                                |
| ----------- | ------------------------------------------------------ |
| Data source | Inventory batches, dispensing, sales                   |
| Frequency   | Daily                                                  |
| Filters     | Expiry window, branch, supplier, category, stock value |
| Grouping    | Branch, product, batch, supplier                       |
| Export      | PDF/Excel                                              |

### Key columns

| Column                  |
| ----------------------- |
| Product                 |
| Generic/brand           |
| Batch                   |
| Expiry date             |
| Days to expiry          |
| Branch                  |
| Quantity on hand        |
| Quantity sold per month |
| Estimated days to clear |
| Cost value at risk      |
| Supplier                |
| Return eligibility      |
| Storage condition       |
| Suggested action        |

### Expiry windows

```text
180 days
90 days
60 days
30 days
Expired
```

### Suggested actions

| Situation                     | Action                                |
| ----------------------------- | ------------------------------------- |
| Fast-moving and 90 days left  | Continue FEFO sale                    |
| Slow-moving and 180 days left | Transfer to faster branch             |
| Supplier return possible      | Return to supplier                    |
| 30 days left                  | Pharmacist/manager review             |
| Expired                       | Block, quarantine, write-off workflow |

---

## 6.8 Batch recall report

**Primary user:** Pharmacist/manager
**Purpose:** Find affected stock and patients quickly.

| Section     | Details                                                     |
| ----------- | ----------------------------------------------------------- |
| Data source | Inventory batches, GRNs, dispensing, sales, patient records |
| Frequency   | On demand                                                   |
| Filters     | Product, batch, supplier, date range, branch                |
| Export      | PDF/Excel/recall pack                                       |

### Key columns

| Column                    |
| ------------------------- |
| Product                   |
| Batch                     |
| Expiry                    |
| Supplier                  |
| GRN number                |
| Branch                    |
| Quantity received         |
| Quantity available        |
| Quantity dispensed/sold   |
| Quantity transferred      |
| Quantity quarantined      |
| Patient/customer supplied |
| Patient phone             |
| Dispense date             |
| Invoice/sale number       |
| Pharmacist/dispenser      |
| Recall action status      |

### Recall actions

```text
Block batch
Move stock to quarantine
Identify affected branches
Identify affected patients/customers
Notify patients where appropriate
Record supplier/regulator return
Record disposal/write-off
Close recall
```

### Alert

| Alert                                | Trigger                  |
| ------------------------------------ | ------------------------ |
| Recalled batch still sellable        | Immediate critical alert |
| Patient supplied recalled batch      | Contact task             |
| Branch has unconfirmed recall action | Escalate to manager      |

---

## 6.9 Controlled medicine report

**Primary user:** Pharmacist
**Purpose:** Monitor high-risk medicines and reconcile controlled stock.

| Section     | Details                                             |
| ----------- | --------------------------------------------------- |
| Data source | Pharmacy dispensing, controlled register, inventory |
| Frequency   | Daily/weekly/monthly/on demand                      |
| Filters     | Medicine, branch, batch, date, patient, prescriber  |
| Export      | PDF/Excel                                           |

### Key columns

| Column                |
| --------------------- |
| Register entry number |
| Date/time             |
| Branch                |
| Medicine              |
| Strength/form         |
| Batch                 |
| Opening balance       |
| Quantity received     |
| Quantity dispensed    |
| Quantity adjusted     |
| Closing balance       |
| Patient               |
| Prescriber            |
| Prescription number   |
| Pharmacist            |
| Witness/approver      |
| Adjustment reason     |
| Variance status       |

### Controls

| Control                | Requirement                                          |
| ---------------------- | ---------------------------------------------------- |
| No silent edits        | Corrections create new entry                         |
| Balance reconciliation | System balance versus physical balance               |
| Adjustment approval    | Superintendent/authorized approval                   |
| Suspicious pattern     | Frequent adjustments, early refills, high quantities |
| Export audit           | Every export logged                                  |

---

## 6.10 Prescription audit report

**Primary user:** Pharmacist
**Purpose:** Audit prescription-only medicine dispensing, substitutions, partial dispensing, warnings, and approvals.

| Section     | Details                                                                  |
| ----------- | ------------------------------------------------------------------------ |
| Data source | Pharmacy dispensing, EMR, POS, inventory                                 |
| Frequency   | Daily/weekly/monthly                                                     |
| Filters     | Prescriber, pharmacist, medicine, patient, branch, warning, substitution |
| Export      | PDF/Excel                                                                |

### Key columns

| Column                  |
| ----------------------- |
| Prescription number     |
| Patient                 |
| Prescriber              |
| Facility/source         |
| Medicine prescribed     |
| Medicine dispensed      |
| Quantity prescribed     |
| Quantity dispensed      |
| Batch/expiry            |
| Substitution flag       |
| Substitution reason     |
| Partial dispense flag   |
| Partial reason          |
| Clinical warnings       |
| Warning override reason |
| Pharmacist approval     |
| Sale/invoice number     |
| Dispense date/time      |

### Audit flags

| Flag                                        | Meaning                    |
| ------------------------------------------- | -------------------------- |
| Missing prescriber detail                   | Prescription quality issue |
| Substitution without reason                 | Compliance risk            |
| Partial dispense without reason             | Compliance risk            |
| Warning overridden                          | Safety review              |
| Prescription-only sold without prescription | Critical violation         |
| Cashier-only approval                       | Critical violation         |
| Batch missing                               | Traceability issue         |

---

## 6.11 Diagnosis/service report

**Primary user:** Clinic manager
**Purpose:** Understand patient conditions, services provided, clinician workload, and reporting needs.

| Section     | Details                                                    |
| ----------- | ---------------------------------------------------------- |
| Data source | EMR, billing, lab, pharmacy                                |
| Frequency   | Daily/weekly/monthly                                       |
| Filters     | Date, branch, clinician, diagnosis, ICD-10, service, payer |
| Export      | PDF/Excel/CSV                                              |

### Key columns

| Column                      |
| --------------------------- |
| Visit date                  |
| Patient age/sex             |
| Branch                      |
| Clinician                   |
| Diagnosis text              |
| ICD-10 code                 |
| Primary/secondary diagnosis |
| Service type                |
| Consultation type           |
| Lab orders                  |
| Procedures                  |
| Prescriptions               |
| Referral status             |
| Payer                       |
| Claim status                |

### Useful summaries

| Summary                | Use                               |
| ---------------------- | --------------------------------- |
| Top diagnoses          | Clinic demand planning            |
| Services by diagnosis  | Clinical workflow insight         |
| Clinician workload     | Staffing                          |
| Diagnosis by age/sex   | Public health/internal planning   |
| Lab usage by diagnosis | Test utilization                  |
| Referral rate          | Quality and capability monitoring |
| Claims-ready visits    | Billing quality                   |

---

## 6.12 Claims rejection report

**Primary user:** Billing officer
**Purpose:** Recover rejected claims and reduce repeat denials.

| Section     | Details                                                     |
| ----------- | ----------------------------------------------------------- |
| Data source | Claims module, EMR, lab, pharmacy, billing                  |
| Frequency   | Daily/weekly                                                |
| Filters     | Payer, branch, denial reason, clinician, service type, date |
| Export      | Excel/PDF                                                   |

### Key columns

| Column                 |
| ---------------------- |
| Claim number           |
| Patient                |
| Payer                  |
| Scheme                 |
| Visit date             |
| Claim amount           |
| Denied amount          |
| Denial reason          |
| Denial category        |
| Claim line affected    |
| Responsible department |
| Correction required    |
| Resubmission deadline  |
| Resubmission status    |
| Amount recovered       |
| Write-off amount       |

### Denial categories

```text
Eligibility
Pre-authorisation
Benefit exhausted
Service not covered
Missing diagnosis
Missing attachment
Unsigned clinical note
Missing lab result
Prescription/dispense mismatch
Wrong tariff
Duplicate claim
Late submission
Medical necessity
Facility scope
Provider scope
Technical/portal error
```

---

## 6.13 Staff activity log

**Primary user:** Owner/compliance
**Purpose:** Know what staff did in the system.

| Section     | Details                                                   |
| ----------- | --------------------------------------------------------- |
| Data source | All modules                                               |
| Frequency   | Real-time/on demand                                       |
| Filters     | User, role, branch, date, module, action type, risk level |
| Export      | Restricted PDF/CSV                                        |

### Key columns

| Column          |
| --------------- |
| Date/time       |
| User            |
| Role            |
| Branch          |
| Module          |
| Action          |
| Record affected |
| Old value       |
| New value       |
| Reason          |
| Approval        |
| Device/IP       |
| Risk level      |

### High-risk activity categories

| Category  | Examples                                                                |
| --------- | ----------------------------------------------------------------------- |
| Financial | void sale, refund, discount, credit note, cash drawer open              |
| Inventory | stock adjustment, write-off, transfer, quarantine release               |
| Pharmacy  | prescription approval, controlled medicine adjustment, warning override |
| Clinical  | note correction, diagnosis change, certificate issue                    |
| Claims    | claim edit, denial closure, write-off                                   |
| Security  | role change, failed login, password reset                               |
| Data      | export, print, patient record access                                    |

---

## 6.14 Data access log

**Primary user:** Data protection/compliance
**Purpose:** Monitor access, sharing, printing, and exporting of patient and sensitive business data.

| Section     | Details                                                          |
| ----------- | ---------------------------------------------------------------- |
| Data source | Security, EMR, pharmacy, lab, claims, documents                  |
| Frequency   | Real-time/on demand                                              |
| Filters     | Patient, user, branch, module, access type, date, sensitive flag |
| Export      | Highly restricted                                                |

### Key columns

| Column                               |
| ------------------------------------ |
| Date/time                            |
| User                                 |
| Role                                 |
| Branch                               |
| Patient                              |
| Record type                          |
| Action: view/edit/print/export/share |
| Purpose/reason                       |
| Consent status                       |
| Recipient/channel                    |
| Device/IP                            |
| Sensitive flag                       |
| Break-glass flag                     |
| Outcome                              |
| Risk level                           |

### Data protection flags

| Flag                    | Meaning                                                  |
| ----------------------- | -------------------------------------------------------- |
| After-hours access      | User opened record outside normal hours                  |
| Non-care-team access    | User not linked to patient visit                         |
| Bulk export             | Many records exported                                    |
| Sensitive record access | HIV/TB, mental health, reproductive health, minors, etc. |
| Break-glass access      | Emergency override used                                  |
| Repeated failed logins  | Security risk                                            |
| Unusual branch access   | User accessed records from another branch                |

---

## 7. Additional recommended reports

The minimum reports are good, but a complete Kenyan solution should also include the following.

## Business and finance

| Report                           | User                      |
| -------------------------------- | ------------------------- |
| Payment reconciliation           | Accountant                |
| M-Pesa reconciliation            | Accountant/manager        |
| Credit customer ageing           | Accountant                |
| Insurer/SHA receivables ageing   | Accountant/claims officer |
| Refund and credit note report    | Owner/accountant          |
| Discount approval report         | Owner                     |
| Branch performance report        | Owner                     |
| Revenue by category              | Owner                     |
| VAT/tax summary                  | Accountant                |
| Supplier invoice/payables report | Accountant                |

## Pharmacy and stock

| Report                       | User                  |
| ---------------------------- | --------------------- |
| Stock valuation              | Owner/accountant      |
| Dead stock report            | Procurement           |
| Stock adjustment report      | Owner/compliance      |
| Quarantine report            | Pharmacist/manager    |
| Supplier performance report  | Procurement           |
| Supplier price movement      | Procurement/owner     |
| Inter-branch transfer report | Manager               |
| Cold-chain incident report   | Pharmacist/manager    |
| ADR/PQMP report              | Pharmacist/compliance |

## Clinic and lab

| Report                       | User                 |
| ---------------------------- | -------------------- |
| Daily visits                 | Clinic manager       |
| Queue waiting time           | Clinic manager       |
| Clinician workload           | Clinic manager       |
| Unsigned notes               | Medical director     |
| Pending lab results          | Lab in-charge        |
| Critical lab results         | Clinician/lab        |
| External lab send-out report | Lab in-charge        |
| Referral report              | Clinic manager       |
| Chronic-care due report      | Clinic manager       |
| Immunisation report          | Nurse/clinic manager |

## Compliance

| Report                        | User                    |
| ----------------------------- | ----------------------- |
| Licence expiry report         | Compliance officer      |
| Professional licence status   | Compliance officer      |
| Override report               | Owner/compliance        |
| Data export report            | DPO/compliance          |
| Consent report                | DPO/compliance          |
| Breach/incident report        | DPO/compliance          |
| Role/permission change report | System admin/compliance |
| Backup and sync health report | IT/admin                |

---

## 8. Dashboards

## A. Owner dashboard

Cards:

```text
Today’s sales
Net sales this month
Gross margin
Cash expected
M-Pesa confirmed
eTIMS rejected/queued
Stock value
Near-expiry value
Dead stock value
Claims outstanding
Claims rejected
Top-selling items
Lowest-margin items
Branch ranking
Staff exceptions
```

Charts:

| Chart                   | Use                          |
| ----------------------- | ---------------------------- |
| Sales trend             | Daily/weekly/monthly revenue |
| Margin trend            | Profitability                |
| Payment mix             | Cash/M-Pesa/card/insurance   |
| Branch comparison       | Chain performance            |
| Claims ageing           | Cashflow risk                |
| Stock value by category | Working capital              |
| Denial reasons          | Revenue recovery             |

---

## B. Branch manager dashboard

Cards:

```text
Sales today
Open shifts
Cash variance
Pending eTIMS invoices
Low stock
Near-expiry stock
Pending stock transfers
Pending orders
Pending lab results
Pending pharmacy queue
Claims not ready
```

---

## C. Pharmacist dashboard

Cards:

```text
Prescriptions pending review
Prescription-only dispenses today
Controlled medicine entries
Controlled stock variance
Clinical warnings overridden
Partial dispenses
Substitutions
Near-expiry medicines
Recalled/quarantined batches
ADR/PQMP reports
```

---

## D. Clinic manager dashboard

Cards:

```text
Patients seen today
Patients waiting
Average waiting time
Clinician workload
Top diagnoses
Lab orders pending
Results pending review
Referrals today
Chronic patients due
Unsigned notes
Claims-ready visits
```

---

## E. Accountant dashboard

Cards:

```text
eTIMS accepted
eTIMS rejected
eTIMS queued
Credit notes
Daily revenue
Cash variance
M-Pesa unreconciled
Supplier invoices pending
Payer receivables
Patient receivables
Write-offs
```

---

## F. Data protection/compliance dashboard

Cards:

```text
Sensitive record access
Bulk exports
After-hours access
Break-glass access
Failed logins
Role changes
Patient data shared
Consent exceptions
Data subject requests
Security incidents
Audit exports
```

---

## 9. Report permissions and masking

Not every user should see every report or every field.

## Role-based report access

| Report               |   Owner | Manager | Accountant | Pharmacist | Clinician |  Claims |     DPO | Auditor |
| -------------------- | ------: | ------: | ---------: | ---------: | --------: | ------: | ------: | ------: |
| Daily sales          |     Yes |     Yes |        Yes |    Limited |        No | Limited |      No |     Yes |
| Cashier shift        |     Yes |     Yes |        Yes |         No |        No |      No |      No |     Yes |
| eTIMS status         |     Yes | Limited |        Yes |         No |        No |      No |      No |     Yes |
| Gross margin         |     Yes | Limited |        Yes |    Limited |        No |      No |      No |     Yes |
| Fast/slow movers     |     Yes |     Yes |    Limited |        Yes |        No |      No |      No |     Yes |
| Stockout             |     Yes |     Yes |    Limited |        Yes |        No |      No |      No |     Yes |
| Near-expiry          |     Yes |     Yes |    Limited |        Yes |        No |      No |      No |     Yes |
| Batch recall         |     Yes |     Yes |         No |        Yes |   Limited |      No | Limited |     Yes |
| Controlled medicines | Limited | Limited |         No |        Yes |        No |      No |      No |     Yes |
| Prescription audit   | Limited | Limited |         No |        Yes |   Limited |      No |      No |     Yes |
| Diagnosis/service    |     Yes |     Yes |         No |         No |       Yes | Limited | Limited |     Yes |
| Claims rejection     |     Yes |     Yes |        Yes |         No |   Limited |     Yes |      No |     Yes |
| Staff activity       |     Yes | Limited |    Limited |         No |        No |      No |      No |     Yes |
| Data access log      | Limited |      No |         No |         No |        No |      No |     Yes |     Yes |

## Data masking examples

| User           | Masking rule                                                                  |
| -------------- | ----------------------------------------------------------------------------- |
| Owner          | Can see financials; patient identifiers masked unless necessary               |
| Accountant     | Financial data visible; clinical details minimized                            |
| Pharmacist     | Prescription and patient-safety data visible; unrelated clinical notes hidden |
| Clinician      | Clinical reports visible; gross margin hidden                                 |
| Procurement    | Stock and supplier data visible; patient data hidden                          |
| Claims officer | Claim-relevant clinical evidence visible; unrelated clinical history hidden   |
| DPO            | Access logs visible; sensitive clinical content limited unless investigating  |
| Auditor        | Broad read-only access with export logging                                    |

---

## 10. Filters and dimensions

Every serious report should support standard filters.

## Common filters

| Filter                |
| --------------------- |
| Date range            |
| Branch                |
| Department            |
| User/staff            |
| Role                  |
| Customer/patient type |
| Payer                 |
| Product category      |
| Service category      |
| Supplier              |
| Batch                 |
| Diagnosis             |
| Clinician             |
| Payment method        |
| Invoice status        |
| Claim status          |
| Stock status          |
| Data sensitivity      |
| Export status         |

## Analytics dimensions

| Dimension  | Examples                                      |
| ---------- | --------------------------------------------- |
| Time       | Hour, day, week, month, quarter               |
| Location   | Branch, county, sub-county                    |
| Product    | Brand, generic, category, supplier            |
| Patient    | Age band, sex, payer type                     |
| Staff      | Cashier, pharmacist, clinician                |
| Payer      | SHA, insurer, employer, cash                  |
| Service    | Consultation, lab, procedure, drug            |
| Stock      | Batch, expiry, storage condition              |
| Finance    | Payment method, tax status, price list        |
| Compliance | Licence status, audit event, data access type |

---

## 11. Metrics dictionary

The system should define metrics centrally so users do not argue over numbers.

| Metric                             | Definition                                                   |
| ---------------------------------- | ------------------------------------------------------------ |
| Gross sales                        | Total completed sales before refunds/credit notes            |
| Net sales                          | Gross sales minus refunds and credit notes                   |
| Cash collected                     | Confirmed cash payments                                      |
| M-Pesa collected                   | Confirmed M-Pesa payments                                    |
| Card collected                     | Confirmed card payments                                      |
| Insurance receivable               | Payer portion not yet paid                                   |
| Patient receivable                 | Patient balance outstanding                                  |
| Gross profit                       | Net sales minus cost of goods/services                       |
| Gross margin %                     | Gross profit divided by net sales                            |
| Stock value                        | Quantity on hand multiplied by valuation cost                |
| Stock cover days                   | Available stock divided by average daily usage               |
| Stockout days                      | Days with available stock equal to zero                      |
| Near-expiry value                  | Cost value of stock expiring within threshold                |
| Dead stock value                   | Cost value of stock with no movement beyond threshold        |
| Claim denial rate                  | Denied claims divided by submitted claims                    |
| Claim recovery rate                | Resubmitted/recovered denied amount divided by denied amount |
| Average days to payment            | Payment date minus claim submission date                     |
| Prescription warning override rate | Warning overrides divided by prescriptions with warnings     |
| Controlled medicine variance       | Physical balance minus system balance                        |
| Data access risk score             | Weighted score based on access type, sensitivity, time, role |

---

## 12. Alerts and exception reporting

Reporting should not only wait for users to open reports. It should push exceptions.

## Critical alerts

| Alert                               | Recipient                 |
| ----------------------------------- | ------------------------- |
| eTIMS invoices rejected             | Accountant/manager        |
| Cashier cash shortage               | Manager/owner             |
| Controlled medicine variance        | Pharmacist/superintendent |
| Recalled batch still sellable       | Pharmacist/manager        |
| Expired stock sold attempt          | Pharmacist/manager        |
| Critical lab result not reviewed    | Clinician/clinic manager  |
| Claim deadline approaching          | Claims officer            |
| Claim rejected                      | Claims officer/billing    |
| Bulk patient data export            | DPO/compliance            |
| After-hours sensitive record access | DPO/compliance            |
| Failed backup/sync                  | Admin/owner               |

## Warning alerts

| Alert                            | Recipient          |
| -------------------------------- | ------------------ |
| Low stock                        | Procurement        |
| Near-expiry stock                | Pharmacist/manager |
| High discounts                   | Manager/owner      |
| High refunds                     | Manager/owner      |
| Slow/dead stock                  | Procurement        |
| Unsigned clinical notes          | Clinic manager     |
| Lab results pending verification | Lab in-charge      |
| Claims missing attachments       | Claims officer     |
| Licence expiring                 | Compliance officer |
| Staff licence expiring           | Compliance officer |

---

## 13. Report scheduling

Reports should be schedulable.

| Schedule      | Reports                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------- |
| End of day    | Daily sales, shift, eTIMS, payments, stock exceptions                                        |
| Daily morning | Low stock, near-expiry, claims pending, lab pending                                          |
| Weekly        | Gross margin, fast/slow movers, denials, diagnosis/service                                   |
| Monthly       | Branch performance, stock valuation, claims ageing, controlled medicine, data access summary |
| Quarterly     | Supplier performance, chronic-care, compliance scorecard                                     |
| On demand     | Batch recall, audit logs, data access investigation                                          |

## Scheduled report fields

| Field            |
| ---------------- |
| Report name      |
| Schedule         |
| Recipients       |
| Format           |
| Filters          |
| Branch scope     |
| Permission check |
| Delivery channel |
| Last run         |
| Next run         |
| Failure reason   |

---

## 14. Data quality controls

Bad reports usually come from bad data. The module should include data quality reports.

## Data quality checks

| Check                     | Example                                   |
| ------------------------- | ----------------------------------------- |
| Missing branch            | Sale without branch                       |
| Missing cashier           | Sale without cashier                      |
| Missing batch             | Medicine sold without batch               |
| Missing diagnosis         | Claim visit without diagnosis             |
| Missing ICD-10            | Claim diagnosis not coded                 |
| Missing prescriber        | Prescription without prescriber           |
| Missing patient           | Prescription medicine without patient     |
| Missing lab result        | Claimed lab test without result           |
| Missing payment reference | M-Pesa payment without code               |
| Negative stock            | Stock balance below zero                  |
| Duplicate patient         | Same name/phone/DOB                       |
| Duplicate product         | Same barcode/brand/strength               |
| Unsigned note             | Visit not signed                          |
| Unverified result         | Result printed/shared before verification |
| Claim without attachment  | Claim-ready failure                       |
| eTIMS mismatch            | Sale total differs from invoice total     |

## Data quality dashboard

Cards:

```text
Missing diagnosis
Missing ICD-10
Missing batch
Negative stock
Duplicate patients
Unverified results
Unsigned notes
Unmatched payments
Rejected eTIMS invoices
Claims missing attachments
```

---

## 15. Data model

## Main reporting tables

### `report_definitions`

| Field                     |
| ------------------------- |
| id                        |
| report_code               |
| report_name               |
| report_category           |
| description               |
| default_filters_json      |
| required_permissions_json |
| sensitive_data_flag       |
| export_allowed            |
| schedule_allowed          |
| status                    |
| created_at                |

### `report_runs`

| Field                |
| -------------------- |
| id                   |
| report_definition_id |
| run_by               |
| branch_scope_json    |
| filters_json         |
| run_started_at       |
| run_completed_at     |
| status               |
| row_count            |
| output_format        |
| output_document_id   |
| error_message        |

### `scheduled_reports`

| Field                |
| -------------------- |
| id                   |
| report_definition_id |
| schedule_name        |
| frequency            |
| recipients_json      |
| filters_json         |
| output_format        |
| delivery_channel     |
| last_run_at          |
| next_run_at          |
| status               |

### `report_exports`

| Field                   |
| ----------------------- |
| id                      |
| report_run_id           |
| exported_by             |
| export_format           |
| exported_at             |
| recipient               |
| reason                  |
| file_hash               |
| sensitive_data_included |
| approval_required       |
| approved_by             |

### `dashboard_widgets`

| Field                |
| -------------------- |
| id                   |
| dashboard_code       |
| widget_code          |
| widget_name          |
| metric_code          |
| visualization_type   |
| default_filters_json |
| refresh_interval     |
| permission_required  |
| status               |

### `metric_definitions`

| Field              |
| ------------------ |
| id                 |
| metric_code        |
| metric_name        |
| formula            |
| source_tables_json |
| dimensions_json    |
| refresh_frequency  |
| owner_role         |
| status             |

### `analytics_snapshots`

| Field          |
| -------------- |
| id             |
| snapshot_date  |
| branch_id      |
| metric_code    |
| dimension_json |
| metric_value   |
| created_at     |

### `staff_activity_logs`

| Field            |
| ---------------- |
| id               |
| user_id          |
| role             |
| branch_id        |
| module           |
| action           |
| entity_type      |
| entity_id        |
| old_value_json   |
| new_value_json   |
| reason           |
| approval_user_id |
| device_id        |
| ip_address       |
| risk_level       |
| created_at       |

### `data_access_logs`

| Field            |
| ---------------- |
| id               |
| user_id          |
| role             |
| branch_id        |
| patient_id       |
| record_type      |
| record_id        |
| action_type      |
| purpose          |
| consent_status   |
| recipient        |
| channel          |
| sensitive_flag   |
| break_glass_flag |
| device_id        |
| ip_address       |
| risk_score       |
| created_at       |

### `report_alerts`

| Field           |
| --------------- |
| id              |
| alert_type      |
| severity        |
| branch_id       |
| module          |
| entity_type     |
| entity_id       |
| metric_code     |
| threshold_value |
| actual_value    |
| message         |
| assigned_to     |
| status          |
| created_at      |
| resolved_at     |

---

## 16. API design

## Report endpoints

| Endpoint                        | Purpose                  |
| ------------------------------- | ------------------------ |
| `GET /reports`                  | List available reports   |
| `POST /reports/{code}/run`      | Run report               |
| `GET /reports/{runId}/status`   | Check report run status  |
| `GET /reports/{runId}/download` | Download output          |
| `POST /reports/{runId}/export`  | Export with audit reason |
| `POST /reports/schedule`        | Schedule report          |
| `PATCH /reports/schedule/{id}`  | Update schedule          |
| `GET /reports/history`          | View report run history  |

## Dashboard endpoints

| Endpoint                         | Purpose                        |
| -------------------------------- | ------------------------------ |
| `GET /dashboards/{code}`         | Load dashboard                 |
| `GET /dashboards/{code}/widgets` | Load widgets                   |
| `GET /metrics/{code}`            | Get metric                     |
| `POST /metrics/refresh`          | Refresh metrics                |
| `GET /analytics/trends`          | Trend data                     |
| `GET /analytics/comparison`      | Branch/user/product comparison |

## Audit endpoints

| Endpoint                             | Purpose                     |
| ------------------------------------ | --------------------------- |
| `GET /audit/staff-activity`          | Staff activity log          |
| `GET /audit/data-access`             | Patient data access log     |
| `GET /audit/exports`                 | Export log                  |
| `GET /audit/overrides`               | Override report             |
| `GET /audit/security-events`         | Failed logins, role changes |
| `POST /audit/investigation`          | Open investigation case     |
| `POST /audit/access-log/{id}/review` | Mark access reviewed        |

## Alert endpoints

| Endpoint                    | Purpose           |
| --------------------------- | ----------------- |
| `GET /alerts`               | List alerts       |
| `POST /alerts/{id}/assign`  | Assign alert      |
| `POST /alerts/{id}/resolve` | Resolve alert     |
| `POST /alerts/rules`        | Create alert rule |
| `PATCH /alerts/rules/{id}`  | Update alert rule |

---

## 17. Report generation rules

## Permission rule

```text
RULE: Run sensitive report
IF report.sensitive_data_flag = true
THEN user must have report permission
AND export reason must be captured
AND export must be logged
```

## Patient data masking rule

```text
RULE: Patient identifiers
IF user.role NOT IN [clinician, pharmacist, claims_officer, DPO, auditor]
THEN mask patient name, ID, phone, and sensitive diagnosis
UNLESS explicit permission is granted
```

## eTIMS exception rule

```text
RULE: eTIMS rejected invoice alert
IF invoice.etims_status = rejected
THEN create alert for accountant
AND include rejection reason
AND mark sale as invoice_attention_required
```

## Batch recall rule

```text
RULE: Batch recall report
IF batch.recall_status = recalled
THEN block sale and dispensing
AND create affected-stock report
AND create affected-patient/customer report
```

## Controlled medicine variance rule

```text
RULE: Controlled medicine variance
IF physical_count != system_controlled_balance
THEN create critical alert
AND require superintendent review
```

## Claims rejection rule

```text
RULE: Claim denial analytics
IF claim.status = rejected
THEN classify denial reason
AND assign correction task
AND update denial dashboard
```

## Data access anomaly rule

```text
RULE: Suspicious data access
IF sensitive_record_access = true
AND user not linked to patient care team
OR access_time outside normal hours
OR bulk_export_count > threshold
THEN create DPO review alert
```

---

## 18. Report formats

| Format             | Use                                       |
| ------------------ | ----------------------------------------- |
| On-screen table    | Daily operations                          |
| PDF                | Formal reports, compliance, management    |
| Excel              | Analysis and accounting                   |
| CSV                | System imports/exports                    |
| Dashboard card     | Quick KPIs                                |
| Chart              | Trends and comparisons                    |
| Scheduled email    | Daily/weekly summaries                    |
| Secure link        | Sensitive report sharing                  |
| API response       | Integrations                              |
| Printable register | Controlled medicines, recalls, audit pack |

## Export controls

| Control              | Requirement                         |
| -------------------- | ----------------------------------- |
| Export reason        | Required for sensitive reports      |
| Export watermark     | User, date, branch, report name     |
| File hash            | Detect tampering                    |
| Access expiry        | Secure links expire                 |
| Recipient log        | Who received report                 |
| Patient data masking | Default unless permitted            |
| Approval             | Required for bulk/sensitive exports |
| Export audit         | Permanent log                       |

---

## 19. Visual analytics

The system should provide simple visuals.

| Chart             | Best for                                       |
| ----------------- | ---------------------------------------------- |
| Line chart        | Sales, claims, visits over time                |
| Bar chart         | Branch comparison, top products, top diagnoses |
| Pie/donut         | Payment mix, category mix                      |
| Heat map          | Busy hours/days                                |
| Ageing buckets    | Claims and receivables                         |
| Exception list    | Alerts, missing documents, rejected invoices   |
| Stock cover chart | Procurement                                    |
| Funnel            | Claims: draft → submitted → approved → paid    |
| Trend cards       | Month-over-month growth                        |

For small clinics and chemists, avoid overly complex BI screens. A clear table plus a few useful charts is better than a dashboard nobody uses.

---

## 20. Offline and sync reporting

Because outlets may operate with unstable internet, reporting must distinguish local and synced data.

| Scenario                | Reporting behaviour                            |
| ----------------------- | ---------------------------------------------- |
| Offline sale            | Appears in local report and marked unsynced    |
| eTIMS queued            | Appears in pending eTIMS report                |
| Offline stock movement  | Marked pending sync                            |
| Offline lab/clinic note | Marked local pending upload                    |
| Branch sync delayed     | Head office dashboard shows stale-data warning |
| Duplicate after sync    | Conflict report                                |
| Sync failure            | Admin alert                                    |

## Sync health report

| Column                    |
| ------------------------- |
| Branch                    |
| Device                    |
| Last sync time            |
| Unsynced sales            |
| Unsynced invoices         |
| Unsynced stock movements  |
| Unsynced clinical records |
| Sync errors               |
| Action required           |

---

## 21. Data retention and archiving

Reports should not permanently depend on recalculating live records only. Historical figures should be reproducible.

## Retention design

| Data type           | Approach                                               |
| ------------------- | ------------------------------------------------------ |
| Sales               | Keep transaction-level records and daily snapshots     |
| Invoices/eTIMS      | Keep invoice identifiers, statuses, payload references |
| Stock movements     | Keep permanent stock ledger                            |
| Dispensing          | Keep prescription and dispense audit                   |
| Clinical            | Keep visit records and summaries per policy            |
| Lab                 | Keep results and corrections                           |
| Claims              | Keep claim versions, submissions, denials, payments    |
| Audit logs          | Immutable retention per compliance policy              |
| Analytics snapshots | Store daily/monthly KPI snapshots                      |
| Exports             | Store export metadata, not always report file forever  |

The health information management regulations refer to retaining health data held in the national system for at least twenty years or as specified in the Act, so the application should be configurable for long-retention health records and shorter operational cache/report files. ([health.go.ke](https://health.go.ke/sites/default/files/2024-11/FINAL%20Digital%20Health%20%28Health%20Information%20Management%29%20Regulations%2019.11.24.pdf))

---

## 22. Workflows

## A. Daily close workflow

```text
1. Cashiers close shifts
2. System compares expected vs counted cash
3. M-Pesa/card payments are reconciled
4. eTIMS status is checked
5. Daily sales report is generated
6. Stock movements are checked
7. Exceptions are shown to branch manager
8. Manager approves daily close
9. Owner/accountant receives summary
```

---

## B. Stock reporting workflow

```text
1. Sales and dispensing update stock movements
2. Inventory module recalculates stock balances
3. Reorder and stockout reports run
4. Near-expiry report runs by batch
5. Slow/dead stock report runs by movement history
6. Procurement receives suggested actions
7. Manager reviews transfer/purchase/write-off decisions
```

---

## C. Pharmacy safety reporting workflow

```text
1. Dispensing creates prescription and batch records
2. Clinical warnings, substitutions, partial dispenses are logged
3. Controlled medicine register updates
4. Prescription audit report runs
5. Controlled medicine variance report runs
6. Batch recall report is available on demand
7. Pharmacist/superintendent resolves exceptions
```

---

## D. Claims reporting workflow

```text
1. Visit and billing data create claim bundle
2. Claim validation runs
3. Missing information report updates
4. Submitted claims move to ageing report
5. Rejected claims move to denial report
6. Resubmissions and recoveries update rejection analytics
7. Payments update reconciliation and receivables
```

---

## E. Data protection audit workflow

```text
1. Every patient record view/edit/export is logged
2. Sensitive access events are scored
3. Bulk exports and after-hours access are flagged
4. DPO reviews exceptions
5. Investigation notes are recorded
6. Incident or breach workflow is opened if required
7. Monthly data access summary is generated
```

---

## 23. MVP versus later versions

## MVP

Build these first:

| Feature                     | Reason                    |
| --------------------------- | ------------------------- |
| Daily sales report          | Owner visibility          |
| Cashier shift report        | Cash control              |
| eTIMS invoice status report | Tax compliance            |
| Gross margin report         | Profitability             |
| Fast/slow movers            | Procurement               |
| Stockout report             | Avoid lost sales          |
| Near-expiry report          | Reduce losses             |
| Batch recall report         | Patient safety            |
| Controlled medicine report  | Pharmacy compliance       |
| Prescription audit          | Dispensing accountability |
| Diagnosis/service report    | Clinic management         |
| Claims rejection report     | Revenue recovery          |
| Staff activity log          | Fraud/compliance          |
| Data access log             | Data protection           |
| Basic dashboards            | Fast decision-making      |
| Export controls             | Compliance                |
| Scheduled daily summary     | Owner convenience         |

## Version 2

Add:

| Feature                            | Reason                 |
| ---------------------------------- | ---------------------- |
| Advanced dashboards                | Better management      |
| Claims ageing and denial analytics | Cashflow improvement   |
| Supplier performance reports       | Procurement quality    |
| M-Pesa reconciliation              | Payment control        |
| Data quality dashboard             | Better records         |
| Audit investigation workflow       | Compliance maturity    |
| Branch comparison                  | Chain/franchise growth |
| Report builder                     | Custom needs           |
| Scheduled reports                  | Automation             |
| Visual analytics                   | Easier interpretation  |
| Role-based masking                 | Privacy improvement    |
| KPI snapshots                      | Historical accuracy    |

## Version 3

Add:

| Feature                               | Reason                       |
| ------------------------------------- | ---------------------------- |
| Data warehouse                        | Large-scale analytics        |
| Predictive stockout forecasting       | Smarter procurement          |
| AI anomaly detection                  | Fraud and leakage detection  |
| AI claim denial prediction            | Reduce rejections            |
| National aggregate reporting adapters | Digital Health Act readiness |
| FHIR analytics exports                | Interoperability             |
| Executive mobile dashboard            | Owner convenience            |
| Benchmarking across branches          | Performance improvement      |
| Cohort analytics                      | Chronic-care management      |
| Advanced data protection risk scoring | Privacy governance           |

---

## 24. Acceptance criteria

The Reporting and Analytics Module is ready when it passes these tests:

| Test                | Expected result                                                                 |
| ------------------- | ------------------------------------------------------------------------------- |
| Daily sales         | Owner sees net sales, payment methods, category sales, branch/cashier breakdown |
| Cashier shift       | Manager sees expected cash, counted cash, variance, M-Pesa/card reconciliation  |
| eTIMS status        | Accountant sees accepted, queued, rejected, retried invoices and credit notes   |
| Gross margin        | Owner sees sales, cost, profit, margin by product/category/branch               |
| Fast/slow movers    | Procurement sees movement, stock cover, reorder/stop-buy suggestions            |
| Stockout            | Procurement sees out-of-stock and below-reorder items                           |
| Near-expiry         | Pharmacist sees batch, expiry, value at risk, suggested action                  |
| Batch recall        | Pharmacist finds affected stock, branches, patients, invoices, actions          |
| Controlled medicine | Pharmacist sees register entries and balance variances                          |
| Prescription audit  | Pharmacist sees prescriptions, substitutions, partials, warnings, approvals     |
| Diagnosis/service   | Clinic manager sees diagnoses, ICD-10-ready data, services, clinician workload  |
| Claims rejection    | Billing sees denials, reasons, correction tasks, recoverable amounts            |
| Staff activity      | Owner/compliance sees high-risk actions by user and branch                      |
| Data access         | DPO sees patient record access, exports, sensitive access, anomalies            |
| Export control      | Sensitive report export requires permission and reason                          |
| Role masking        | Unauthorized users see masked patient/clinical data                             |
| Scheduled report    | Daily summary is generated and delivered                                        |
| Alert               | Rejected eTIMS, stockout, recall, data export, or claim denial creates alert    |
| Audit               | Every report run/export is logged                                               |

---

## 25. Final product behaviour

The Reporting and Analytics Module should behave like this:

| Situation                         | Correct behaviour                                                     |
| --------------------------------- | --------------------------------------------------------------------- |
| Owner opens dashboard             | Shows sales, margin, cash, stock, claims, branch performance          |
| Manager closes day                | Shift, cash, M-Pesa, eTIMS, refunds, discounts reviewed               |
| Accountant checks tax             | eTIMS status and credit notes visible                                 |
| Procurement plans buying          | Fast movers, stockouts, reorder, dead stock visible                   |
| Pharmacist manages risk           | Expiry, recall, controlled medicine, prescription audit visible       |
| Clinic manager reviews operations | Visits, diagnoses, services, waiting time, clinician workload visible |
| Claims officer follows revenue    | Rejections, missing documents, ageing, reconciliation visible         |
| DPO reviews privacy               | Data access, exports, sensitive record access, anomalies visible      |
| Auditor investigates issue        | Staff action and data access trail available                          |
| Branch goes offline               | Reports show stale/unsynced data clearly                              |
| Sensitive report is exported      | Permission, reason, watermark, and audit log required                 |

The key design principle is:

**Every important action in the business should either become a useful management report, a compliance record, an audit trail, or an exception alert.**

# Module 8 Gap Closure: Reporting and Analytics — Developer Handoff Addendum

## Updated handoff status

| Area                      |                                                                     Previous status |                                                                                                   After this closure |
| ------------------------- | ----------------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------------: |
| Completeness              |                                                                                Good |                                                                                                        **Very high** |
| Developer readiness       |                                                                              Medium |                                                                **High for MVP reports and analytics infrastructure** |
| Accuracy confidence       |                                                                                Good |                                                             **Good, assuming final schema names follow Modules 1–7** |
| Main previous gaps        | SQL/data sources, masking, dashboards, KPI definitions, immutable audit, thresholds |                                                                                                           **Closed** |
| Developer start readiness |                                                Could build reporting infrastructure | **Can now implement reporting views, first report pack, dashboards, alerts, exports, audit logs, and masking rules** |

The updated design principle is:

```text
Reporting must not be a collection of random SQL queries.
It must be a governed reporting layer with standard facts, dimensions, metrics, access policies, masking rules, export controls, alerts, immutable audit trails, and versioned report definitions.
```

---

## 1. Final developer decisions

| Gap                                | Final decision                                                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Report SQL/data-source definitions | Use a **reporting mart** with stable views: `rpt_*` views for operational reports and `analytics_*` tables for snapshots/KPIs. MVP can use database views; chains should move to materialized views or warehouse tables. |
| Exact report specs                 | Each report must have a `report_definition` record containing source view, filters, columns, roles, masking policy, export formats, schedule rules, and alert hooks.                                                     |
| Masking rules                      | Implement **column-level masking + row-level branch/role scoping + export approval**. Patient identifiers, diagnosis, lab results, prescription details, and data-access logs are sensitive by default.                  |
| Dashboard wireframes               | Ship role-based dashboards: Owner, Branch Manager, Accountant, Pharmacist, Clinic Manager, Claims Officer, DPO/Compliance.                                                                                               |
| KPI definitions                    | Use a central `metric_definitions` table. Formulas must be defined once and reused everywhere.                                                                                                                           |
| Immutable audit                    | Use append-only `audit_events` and `data_access_events` tables with hash chaining, no update/delete, optional WORM/object-lock export, and separate export logs.                                                         |
| Alerts and thresholds              | Use configurable `alert_rules` with default thresholds for cash variance, eTIMS rejection, stockout, expiry, controlled medicine variance, claim denial, and data-access anomalies.                                      |
| Export rules                       | Reports can be viewed, scheduled, or exported only if role and sensitivity rules allow. Sensitive exports require reason, watermark, file hash, and audit log.                                                           |
| MVP delivery                       | Build reporting views and the 14 minimum reports first; dashboards and alerts read from those same views.                                                                                                                |

---

## 2. Reporting architecture

## 2.1 Recommended architecture

```text
Transactional tables
    ↓
Reporting views: rpt_*
    ↓
Materialized views / analytics snapshots
    ↓
Report definitions
    ↓
Dashboards / exports / scheduled reports / alerts
```

## 2.2 Reporting layers

| Layer              | Name                                  | Purpose                                           |
| ------------------ | ------------------------------------- | ------------------------------------------------- |
| Source             | Transactional tables                  | POS, inventory, pharmacy, EMR, lab, claims, audit |
| Standard reporting | `rpt_*` views                         | Clean, joined, report-ready datasets              |
| Metrics            | `metric_definitions`                  | Central formulas                                  |
| Snapshots          | `analytics_snapshots`                 | Daily/monthly KPI history                         |
| Report registry    | `report_definitions`                  | Machine-readable report specs                     |
| Alert engine       | `alert_rules` + `alert_events`        | Exception detection                               |
| Export engine      | `report_runs` + `report_exports`      | PDF/Excel/CSV control                             |
| Audit              | `audit_events` + `data_access_events` | Immutable logs                                    |

---

## 3. Reporting schema foundations

## 3.1 Core reporting dimensions

### `rpt_dim_branch`

Source: `branches`, `organisations`

| Column            | Meaning                       |
| ----------------- | ----------------------------- |
| `organisation_id` | Tenant/legal entity           |
| `branch_id`       | Branch                        |
| `branch_code`     | Internal branch code          |
| `branch_name`     | Branch display name           |
| `branch_type`     | Pharmacy, clinic, lab, retail |
| `county`          | Location                      |
| `status`          | Active/suspended/closed       |

### `rpt_dim_user`

Source: `users`, `professionals`, `branch_professionals`

| Column            | Meaning                                      |
| ----------------- | -------------------------------------------- |
| `user_id`         | System user                                  |
| `full_name`       | Staff name                                   |
| `role_code`       | Cashier, pharmacist, clinician, lab, billing |
| `professional_id` | Linked professional                          |
| `cadre`           | Pharmacist, nurse, clinician, lab tech       |
| `licence_status`  | Active/expired/suspended                     |
| `branch_scope`    | Assigned branch                              |

### `rpt_dim_product`

Source: `products`, `medicine_profiles`, `inventory_control_profiles`

| Column                       | Meaning                              |
| ---------------------------- | ------------------------------------ |
| `product_id`                 | Product/SKU                          |
| `sku`                        | Internal SKU                         |
| `display_name`               | Product name                         |
| `product_type`               | Medicine, retail, lab consumable     |
| `generic_name`               | Medicine generic                     |
| `regulatory_sale_class`      | POM, P, OTC, GS                      |
| `controlled_substance_class` | None/narcotic/psychotropic/precursor |
| `batch_controlled`           | Yes/no                               |
| `expiry_controlled`          | Yes/no                               |
| `cold_chain_required`        | Yes/no                               |
| `supplier_id`                | Preferred supplier where configured  |

### `rpt_dim_patient_masked`

Source: `patients`

This view should always mask by default. Full patient data should only be available through a permissioned secure view.

| Column                 | Meaning                                          |
| ---------------------- | ------------------------------------------------ |
| `patient_id`           | Internal ID                                      |
| `patient_number`       | Patient number                                   |
| `patient_label_masked` | Example: `PT-000123 / J*** W***`                 |
| `age_years`            | Age                                              |
| `age_band`             | 0–4, 5–14, 15–24, etc.                           |
| `sex`                  | Sex                                              |
| `phone_masked`         | Example: `07******123`                           |
| `id_masked`            | Example: `******1234`                            |
| `sensitive_flag`       | Whether record contains sensitive clinical flags |

---

## 4. Core reporting fact views

Developers should build these first. The 14 minimum reports should read from these views, not directly from many transactional tables.

## 4.1 `rpt_sales_lines`

Purpose: base for daily sales, margin, category revenue, branch performance.

Source tables:

```text
sales
sale_lines
invoices
payments/payment_allocations
branches
products/services
tax_codes
users
```

Recommended SQL-style view:

```sql
CREATE VIEW rpt_sales_lines AS
SELECT
    s.organisation_id,
    s.branch_id,
    b.branch_code,
    b.branch_name,
    s.id AS sale_id,
    s.sale_number,
    s.sale_type,
    s.status AS sale_status,
    s.completed_at AS sale_datetime,
    DATE(s.completed_at) AS sale_date,
    s.cashier_user_id,
    u.full_name AS cashier_name,
    s.customer_id,
    s.patient_id,
    sl.id AS sale_line_id,
    sl.line_number,
    sl.item_type,
    sl.product_id,
    sl.service_id,
    COALESCE(p.display_name, svc.service_name, sl.description) AS item_name,
    p.generic_name,
    p.regulatory_sale_class,
    p.controlled_substance_class,
    sl.quantity,
    sl.unit_of_measure,
    sl.unit_price,
    sl.discount_amount,
    sl.tax_code_id,
    sl.tax_rate,
    sl.net_amount,
    sl.tax_amount,
    sl.gross_amount,
    sl.cost_amount,
    (sl.net_amount - COALESCE(sl.cost_amount, 0)) AS gross_profit,
    CASE
      WHEN sl.net_amount > 0
      THEN (sl.net_amount - COALESCE(sl.cost_amount, 0)) / sl.net_amount
      ELSE NULL
    END AS gross_margin_rate,
    sl.batch_id,
    sl.expiry_date,
    i.id AS invoice_id,
    i.invoice_number,
    i.etims_status,
    i.etims_unique_identifier,
    s.payment_status,
    s.payer_contract_id,
    s.price_list_id
FROM sales s
JOIN sale_lines sl ON sl.sale_id = s.id
LEFT JOIN invoices i ON i.sale_id = s.id
LEFT JOIN branches b ON b.id = s.branch_id
LEFT JOIN users u ON u.id = s.cashier_user_id
LEFT JOIN products p ON p.id = sl.product_id
LEFT JOIN services svc ON svc.id = sl.service_id
WHERE s.status IN ('completed','partially_refunded','credit_noted');
```

---

## 4.2 `rpt_payments`

Purpose: payment mix, M-Pesa reconciliation, patient/insurer balances.

Source tables:

```text
payments
payment_allocations
sales
invoices
mpesa_transactions
branches
users
```

```sql
CREATE VIEW rpt_payments AS
SELECT
    p.organisation_id,
    p.branch_id,
    b.branch_name,
    p.id AS payment_id,
    p.payment_number,
    p.payment_method,
    p.amount,
    p.currency,
    p.status AS payment_status,
    p.reference_number,
    p.mpesa_receipt_number,
    p.card_auth_code,
    p.received_by,
    u.full_name AS received_by_name,
    p.received_at,
    pa.invoice_id,
    pa.sale_id,
    pa.allocated_amount,
    i.invoice_number,
    s.sale_number,
    s.shift_id
FROM payments p
LEFT JOIN payment_allocations pa ON pa.payment_id = p.id
LEFT JOIN invoices i ON i.id = pa.invoice_id
LEFT JOIN sales s ON s.id = pa.sale_id
LEFT JOIN branches b ON b.id = p.branch_id
LEFT JOIN users u ON u.id = p.received_by;
```

---

## 4.3 `rpt_shift_summary`

Purpose: cashier shift report.

Source tables:

```text
shifts
sales
payments
cash_movements
users
branches
```

```sql
CREATE VIEW rpt_shift_summary AS
SELECT
    sh.organisation_id,
    sh.branch_id,
    b.branch_name,
    sh.id AS shift_id,
    sh.shift_number,
    sh.terminal_id,
    sh.cashier_user_id,
    u.full_name AS cashier_name,
    sh.opened_at,
    sh.closed_at,
    sh.opening_float,
    sh.expected_cash,
    sh.counted_cash,
    (sh.counted_cash - sh.expected_cash) AS cash_variance,
    SUM(CASE WHEN p.payment_method = 'cash' THEN p.amount ELSE 0 END) AS cash_collected,
    SUM(CASE WHEN p.payment_method = 'mpesa' THEN p.amount ELSE 0 END) AS mpesa_collected,
    SUM(CASE WHEN p.payment_method = 'card' THEN p.amount ELSE 0 END) AS card_collected,
    SUM(CASE WHEN p.payment_method IN ('insurer','sha') THEN p.amount ELSE 0 END) AS payer_portion,
    COUNT(DISTINCT s.id) AS transaction_count,
    SUM(s.gross_total) AS shift_sales_total,
    sh.status,
    sh.manager_approved_by,
    sh.notes
FROM shifts sh
LEFT JOIN sales s ON s.shift_id = sh.id AND s.status IN ('completed','partially_refunded','credit_noted')
LEFT JOIN payments p ON p.shift_id = sh.id AND p.status IN ('confirmed','allocated')
LEFT JOIN branches b ON b.id = sh.branch_id
LEFT JOIN users u ON u.id = sh.cashier_user_id
GROUP BY
    sh.organisation_id, sh.branch_id, b.branch_name, sh.id, sh.shift_number,
    sh.terminal_id, sh.cashier_user_id, u.full_name, sh.opened_at, sh.closed_at,
    sh.opening_float, sh.expected_cash, sh.counted_cash, sh.status,
    sh.manager_approved_by, sh.notes;
```

---

## 4.4 `rpt_etims_invoices`

Purpose: eTIMS status report.

Source tables:

```text
invoices
tax_invoice_submissions
sales
branches
users
```

```sql
CREATE VIEW rpt_etims_invoices AS
SELECT
    i.organisation_id,
    s.branch_id,
    b.branch_name,
    i.id AS invoice_id,
    i.invoice_number,
    s.sale_number,
    i.seller_pin,
    i.buyer_pin,
    i.buyer_name,
    i.issue_datetime,
    i.gross_total,
    i.tax_total,
    i.etims_status,
    i.etims_unique_identifier,
    i.control_unit_id,
    i.control_unit_invoice_number,
    i.qr_code_payload,
    tis.adapter_mode,
    tis.status AS submission_status,
    tis.error_code,
    tis.error_message,
    tis.retry_count,
    tis.submitted_at,
    tis.accepted_at,
    s.cashier_user_id,
    u.full_name AS cashier_name
FROM invoices i
LEFT JOIN sales s ON s.id = i.sale_id
LEFT JOIN branches b ON b.id = s.branch_id
LEFT JOIN users u ON u.id = s.cashier_user_id
LEFT JOIN tax_invoice_submissions tis
    ON tis.invoice_id = i.id
   AND tis.id = (
        SELECT MAX(tis2.id)
        FROM tax_invoice_submissions tis2
        WHERE tis2.invoice_id = i.id
   );
```

---

## 4.5 `rpt_stock_lots`

Purpose: stockout, near-expiry, stock valuation, batch recall.

Source tables:

```text
stock_lots
stock_balances
products
medicine_profiles
suppliers
branches
storage_locations
```

```sql
CREATE VIEW rpt_stock_lots AS
SELECT
    sl.organisation_id,
    sl.branch_id,
    b.branch_name,
    sl.product_id,
    p.sku,
    p.display_name AS product_name,
    mp.generic_name,
    mp.regulatory_sale_class,
    mp.controlled_substance_class,
    sl.id AS stock_lot_id,
    sl.internal_lot_number,
    sl.manufacturer_batch_number AS batch_number,
    sl.expiry_date,
    DATE_PART('day', sl.expiry_date::timestamp - CURRENT_DATE::timestamp) AS days_to_expiry,
    sl.available_quantity_base,
    sl.reserved_quantity_base,
    sl.quarantined_quantity_base,
    sl.unit_cost_base,
    (sl.available_quantity_base * sl.unit_cost_base) AS available_stock_value,
    sl.quality_status,
    sl.recall_status,
    sl.cold_chain_status,
    sl.supplier_id,
    sup.supplier_name,
    sl.storage_location_id
FROM stock_lots sl
LEFT JOIN products p ON p.id = sl.product_id
LEFT JOIN medicine_profiles mp ON mp.product_id = p.id
LEFT JOIN suppliers sup ON sup.id = sl.supplier_id
LEFT JOIN branches b ON b.id = sl.branch_id;
```

---

## 4.6 `rpt_stock_movements`

Purpose: stock ledger, fast/slow movers, recalls, transfers.

Source tables:

```text
stock_movements
stock_lots
products
branches
users
```

```sql
CREATE VIEW rpt_stock_movements AS
SELECT
    sm.organisation_id,
    sm.branch_id,
    b.branch_name,
    sm.product_id,
    p.sku,
    p.display_name AS product_name,
    sm.stock_lot_id,
    sl.manufacturer_batch_number AS batch_number,
    sl.expiry_date,
    sm.movement_number,
    sm.movement_datetime,
    sm.movement_type,
    sm.movement_reason,
    sm.quantity_in_base,
    sm.quantity_out_base,
    sm.balance_after_base,
    sm.unit_cost_base,
    sm.total_cost,
    sm.source_document_type,
    sm.source_document_id,
    sm.performed_by,
    u.full_name AS performed_by_name,
    sm.approved_by
FROM stock_movements sm
LEFT JOIN stock_lots sl ON sl.id = sm.stock_lot_id
LEFT JOIN products p ON p.id = sm.product_id
LEFT JOIN branches b ON b.id = sm.branch_id
LEFT JOIN users u ON u.id = sm.performed_by;
```

---

## 4.7 `rpt_prescription_audit`

Purpose: prescription audit.

Source tables:

```text
prescriptions
prescription_items
dispenses
dispense_lines
patients
prescribers
products
stock_lots
users
invoices
```

```sql
CREATE VIEW rpt_prescription_audit AS
SELECT
    pr.organisation_id,
    d.branch_id,
    b.branch_name,
    pr.id AS prescription_id,
    pr.prescription_number,
    pr.source AS prescription_source,
    pr.patient_id,
    pat.patient_number,
    pr.prescriber_id,
    pres.full_name AS prescriber_name,
    pres.registration_number AS prescriber_registration,
    pi.id AS prescription_item_id,
    prescribed.display_name AS prescribed_product,
    dispensed.display_name AS dispensed_product,
    pi.quantity_prescribed,
    dl.quantity_dispensed,
    dl.balance_quantity,
    dl.substitution_flag,
    dl.substitution_reason,
    dl.partial_dispense_flag,
    dl.partial_dispense_reason,
    dl.batch_number,
    dl.expiry_date,
    d.pharmacist_id,
    pharm.full_name AS pharmacist_name,
    d.approved_at,
    d.handed_over_at,
    d.sale_id,
    i.invoice_number,
    d.status AS dispense_status
FROM prescriptions pr
JOIN prescription_items pi ON pi.prescription_id = pr.id
LEFT JOIN dispenses d ON d.prescription_id = pr.id
LEFT JOIN dispense_lines dl ON dl.dispense_id = d.id AND dl.prescription_item_id = pi.id
LEFT JOIN patients pat ON pat.id = pr.patient_id
LEFT JOIN prescribers pres ON pres.id = pr.prescriber_id
LEFT JOIN products prescribed ON prescribed.id = pi.prescribed_product_id
LEFT JOIN products dispensed ON dispensed.id = dl.dispensed_product_id
LEFT JOIN users pharm ON pharm.id = d.pharmacist_id
LEFT JOIN invoices i ON i.id = d.invoice_id
LEFT JOIN branches b ON b.id = d.branch_id;
```

---

## 4.8 `rpt_controlled_medicine_register`

Purpose: controlled medicine report.

Source tables:

```text
controlled_medicine_register
products
patients
prescribers
users
branches
```

```sql
CREATE VIEW rpt_controlled_medicine_register AS
SELECT
    cmr.organisation_id,
    cmr.branch_id,
    b.branch_name,
    cmr.register_entry_number,
    cmr.transaction_datetime,
    cmr.transaction_type,
    cmr.medicine_product_id,
    p.display_name AS medicine_name,
    cmr.controlled_substance_class,
    cmr.batch_number,
    cmr.expiry_date,
    cmr.opening_balance,
    cmr.quantity_in,
    cmr.quantity_out,
    cmr.quantity_adjusted,
    cmr.closing_balance,
    cmr.patient_id,
    cmr.patient_name_snapshot,
    cmr.prescription_number,
    cmr.prescriber_name_snapshot,
    cmr.prescriber_registration_snapshot,
    cmr.pharmacist_id,
    cmr.pharmacist_name_snapshot,
    cmr.witness_user_id,
    cmr.reason,
    cmr.entry_status,
    cmr.correction_of_entry_id
FROM controlled_medicine_register cmr
LEFT JOIN products p ON p.id = cmr.medicine_product_id
LEFT JOIN branches b ON b.id = cmr.branch_id;
```

---

## 4.9 `rpt_visit_diagnosis_service`

Purpose: diagnosis/service report.

Source tables:

```text
visits
patients
clinical_notes
diagnoses
orders
procedures
prescriptions
lab_orders
sales/sale_lines
users
branches
```

```sql
CREATE VIEW rpt_visit_diagnosis_service AS
SELECT
    v.organisation_id,
    v.branch_id,
    b.branch_name,
    v.id AS visit_id,
    v.visit_number,
    v.visit_date,
    v.patient_id,
    pat.patient_number,
    pat.sex,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, pat.date_of_birth)) AS age_years,
    v.visit_type,
    v.payer_type,
    cn.clinician_id,
    clinician.full_name AS clinician_name,
    d.id AS diagnosis_id,
    d.diagnosis_text,
    d.icd10_code,
    d.primary_flag,
    cn.note_status,
    cn.signed_at,
    COUNT(DISTINCT o.id) AS order_count,
    COUNT(DISTINCT lo.id) AS lab_order_count,
    COUNT(DISTINCT pr.id) AS prescription_count,
    COUNT(DISTINCT proc.id) AS procedure_count,
    SUM(sl.gross_amount) AS billed_amount
FROM visits v
LEFT JOIN patients pat ON pat.id = v.patient_id
LEFT JOIN branches b ON b.id = v.branch_id
LEFT JOIN clinical_notes cn ON cn.visit_id = v.id
LEFT JOIN users clinician ON clinician.id = cn.clinician_id
LEFT JOIN diagnoses d ON d.visit_id = v.id
LEFT JOIN orders o ON o.visit_id = v.id
LEFT JOIN lab_orders lo ON lo.visit_id = v.id
LEFT JOIN prescriptions pr ON pr.visit_id = v.id
LEFT JOIN procedures proc ON proc.visit_id = v.id
LEFT JOIN sales s ON s.visit_id = v.id
LEFT JOIN sale_lines sl ON sl.sale_id = s.id
GROUP BY
    v.organisation_id, v.branch_id, b.branch_name, v.id, v.visit_number,
    v.visit_date, v.patient_id, pat.patient_number, pat.sex, pat.date_of_birth,
    v.visit_type, v.payer_type, cn.clinician_id, clinician.full_name,
    d.id, d.diagnosis_text, d.icd10_code, d.primary_flag,
    cn.note_status, cn.signed_at;
```

---

## 4.10 `rpt_claim_denials`

Purpose: claims rejection report.

Source tables:

```text
claims
claim_lines
claim_denials
payers
benefit_schemes
visits
patients
branches
```

```sql
CREATE VIEW rpt_claim_denials AS
SELECT
    c.organisation_id,
    c.branch_id,
    b.branch_name,
    c.id AS claim_id,
    c.claim_number,
    c.external_claim_number,
    c.patient_id,
    pat.patient_number,
    c.visit_id,
    c.payer_id,
    py.payer_name,
    c.scheme_id,
    bs.scheme_name,
    c.submitted_at,
    c.total_claimed_amount,
    c.total_approved_amount,
    c.total_paid_amount,
    cd.id AS denial_id,
    cd.claim_line_id,
    cd.payer_denial_code,
    cd.denial_category,
    cd.denial_reason_text,
    cd.denial_date,
    cd.amount_denied,
    cd.recoverable_flag,
    cd.responsible_department,
    cd.required_correction,
    cd.correction_deadline,
    cd.status AS denial_status,
    cd.resolution_type,
    cd.writeoff_amount
FROM claim_denials cd
JOIN claims c ON c.id = cd.claim_id
LEFT JOIN branches b ON b.id = c.branch_id
LEFT JOIN patients pat ON pat.id = c.patient_id
LEFT JOIN payers py ON py.id = c.payer_id
LEFT JOIN benefit_schemes bs ON bs.id = c.scheme_id;
```

---

## 4.11 `rpt_staff_activity`

Purpose: staff activity log.

Source tables:

```text
audit_events
users
branches
```

```sql
CREATE VIEW rpt_staff_activity AS
SELECT
    ae.organisation_id,
    ae.branch_id,
    b.branch_name,
    ae.id AS audit_event_id,
    ae.event_datetime,
    ae.actor_user_id,
    u.full_name AS actor_name,
    ae.actor_role,
    ae.module,
    ae.action,
    ae.entity_type,
    ae.entity_id,
    ae.reason,
    ae.risk_level,
    ae.approved_by,
    ae.device_id,
    ae.ip_address,
    ae.hash_current,
    ae.hash_previous
FROM audit_events ae
LEFT JOIN users u ON u.id = ae.actor_user_id
LEFT JOIN branches b ON b.id = ae.branch_id;
```

---

## 4.12 `rpt_data_access`

Purpose: data access log.

Source tables:

```text
data_access_events
users
patients
branches
```

```sql
CREATE VIEW rpt_data_access AS
SELECT
    dae.organisation_id,
    dae.branch_id,
    b.branch_name,
    dae.id AS data_access_event_id,
    dae.event_datetime,
    dae.actor_user_id,
    u.full_name AS actor_name,
    dae.actor_role,
    dae.patient_id,
    pat.patient_number,
    dae.record_type,
    dae.record_id,
    dae.action_type,
    dae.purpose,
    dae.consent_status,
    dae.recipient,
    dae.channel,
    dae.sensitive_flag,
    dae.break_glass_flag,
    dae.bulk_access_flag,
    dae.after_hours_flag,
    dae.risk_score,
    dae.device_id,
    dae.ip_address,
    dae.hash_current,
    dae.hash_previous
FROM data_access_events dae
LEFT JOIN users u ON u.id = dae.actor_user_id
LEFT JOIN patients pat ON pat.id = dae.patient_id
LEFT JOIN branches b ON b.id = dae.branch_id;
```

---

## 5. Machine-readable report registry v1

Developers should seed these into `report_definitions`.

## 5.1 Common report definition schema

```json
{
  "report_code": "DAILY_SALES",
  "report_name": "Daily Sales",
  "category": "finance",
  "source_view": "rpt_sales_lines",
  "default_date_field": "sale_datetime",
  "default_filters": {},
  "required_permissions": [],
  "sensitivity": "business_confidential",
  "columns": [],
  "metrics": [],
  "group_by_options": [],
  "export_formats": ["pdf", "xlsx", "csv"],
  "masking_policy": "business_no_patient_detail",
  "schedule_allowed": true,
  "default_schedule": null
}
```

---

## 5.2 `DAILY_SALES`

```json
{
  "report_code": "DAILY_SALES",
  "report_name": "Daily Sales",
  "category": "finance",
  "source_view": "rpt_sales_lines",
  "default_date_field": "sale_datetime",
  "default_filters": {
    "sale_status": ["completed", "partially_refunded", "credit_noted"]
  },
  "required_permissions": ["report.daily_sales.view"],
  "sensitivity": "business_confidential",
  "columns": [
    "sale_datetime",
    "branch_name",
    "sale_number",
    "invoice_number",
    "etims_status",
    "item_name",
    "item_type",
    "quantity",
    "unit_price",
    "discount_amount",
    "net_amount",
    "tax_amount",
    "gross_amount",
    "payment_status",
    "cashier_name"
  ],
  "metrics": [
    "gross_sales",
    "net_sales",
    "discount_total",
    "tax_total",
    "transaction_count",
    "average_transaction_value"
  ],
  "group_by_options": ["branch_name", "cashier_name", "item_type", "sale_date"],
  "export_formats": ["pdf", "xlsx", "csv"],
  "masking_policy": "mask_patient_default",
  "schedule_allowed": true,
  "default_schedule": "daily_2100"
}
```

---

## 5.3 `CASHIER_SHIFT`

```json
{
  "report_code": "CASHIER_SHIFT",
  "report_name": "Cashier Shift Report",
  "category": "finance_control",
  "source_view": "rpt_shift_summary",
  "default_date_field": "opened_at",
  "required_permissions": ["report.cashier_shift.view"],
  "sensitivity": "business_confidential",
  "columns": [
    "shift_number",
    "branch_name",
    "terminal_id",
    "cashier_name",
    "opened_at",
    "closed_at",
    "opening_float",
    "cash_collected",
    "mpesa_collected",
    "card_collected",
    "expected_cash",
    "counted_cash",
    "cash_variance",
    "transaction_count",
    "shift_sales_total",
    "manager_approved_by",
    "status",
    "notes"
  ],
  "metrics": [
    "cash_variance",
    "shift_sales_total",
    "payment_mix",
    "void_count",
    "refund_total"
  ],
  "export_formats": ["pdf", "xlsx"],
  "masking_policy": "no_patient_data",
  "schedule_allowed": true,
  "default_schedule": "shift_close"
}
```

---

## 5.4 `ETIMS_STATUS`

```json
{
  "report_code": "ETIMS_STATUS",
  "report_name": "eTIMS Invoice Status",
  "category": "tax",
  "source_view": "rpt_etims_invoices",
  "default_date_field": "issue_datetime",
  "required_permissions": ["report.etims_status.view"],
  "sensitivity": "tax_confidential",
  "columns": [
    "issue_datetime",
    "branch_name",
    "invoice_number",
    "sale_number",
    "seller_pin",
    "buyer_pin",
    "buyer_name",
    "gross_total",
    "tax_total",
    "etims_status",
    "etims_unique_identifier",
    "control_unit_invoice_number",
    "adapter_mode",
    "submission_status",
    "error_code",
    "error_message",
    "retry_count",
    "submitted_at",
    "accepted_at"
  ],
  "metrics": [
    "etims_accepted_count",
    "etims_rejected_count",
    "etims_queued_count",
    "etims_pending_value",
    "etims_rejected_value"
  ],
  "export_formats": ["xlsx", "csv", "pdf"],
  "masking_policy": "tax_fields_visible_accountant",
  "schedule_allowed": true,
  "default_schedule": "daily_2000"
}
```

---

## 5.5 `GROSS_MARGIN`

```json
{
  "report_code": "GROSS_MARGIN",
  "report_name": "Gross Margin Report",
  "category": "profitability",
  "source_view": "rpt_sales_lines",
  "default_date_field": "sale_datetime",
  "required_permissions": ["report.gross_margin.view"],
  "sensitivity": "high_business_confidential",
  "columns": [
    "sale_date",
    "branch_name",
    "product_id",
    "item_name",
    "generic_name",
    "quantity",
    "net_amount",
    "cost_amount",
    "gross_profit",
    "gross_margin_rate",
    "discount_amount",
    "price_list_id",
    "batch_id"
  ],
  "metrics": [
    "net_sales",
    "cost_of_goods_sold",
    "gross_profit",
    "gross_margin_percent",
    "low_margin_line_count",
    "below_cost_sales_count"
  ],
  "group_by_options": [
    "branch_name",
    "item_name",
    "generic_name",
    "product_id",
    "sale_date"
  ],
  "export_formats": ["xlsx", "pdf"],
  "masking_policy": "no_patient_data",
  "schedule_allowed": true,
  "default_schedule": "weekly_monday_0700"
}
```

---

## 5.6 `FAST_SLOW_MOVERS`

```json
{
  "report_code": "FAST_SLOW_MOVERS",
  "report_name": "Fast and Slow Movers",
  "category": "procurement",
  "source_view": "rpt_stock_velocity",
  "default_date_field": "movement_date",
  "required_permissions": ["report.fast_slow_movers.view"],
  "sensitivity": "business_confidential",
  "columns": [
    "branch_name",
    "product_id",
    "sku",
    "product_name",
    "generic_name",
    "quantity_sold_30d",
    "quantity_sold_90d",
    "sales_value_30d",
    "current_stock_base",
    "average_daily_usage",
    "stock_cover_days",
    "last_sale_date",
    "movement_classification",
    "suggested_action"
  ],
  "metrics": [
    "average_daily_usage",
    "stock_cover_days",
    "dead_stock_value",
    "fast_mover_count",
    "slow_mover_count"
  ],
  "export_formats": ["xlsx", "csv"],
  "masking_policy": "no_patient_data",
  "schedule_allowed": true,
  "default_schedule": "weekly_monday_0700"
}
```

`rpt_stock_velocity` should be a materialized view built from `rpt_stock_movements` and `rpt_stock_lots`.

---

## 5.7 `STOCKOUT_REPORT`

```json
{
  "report_code": "STOCKOUT_REPORT",
  "report_name": "Stockout Report",
  "category": "inventory",
  "source_view": "rpt_stockout",
  "required_permissions": ["report.stockout.view"],
  "sensitivity": "business_confidential",
  "columns": [
    "branch_name",
    "product_id",
    "sku",
    "product_name",
    "generic_name",
    "available_quantity_base",
    "reserved_quantity_base",
    "reorder_point",
    "minimum_stock",
    "average_daily_usage",
    "stockout_days",
    "preferred_supplier",
    "open_po_quantity",
    "transfer_available_quantity",
    "suggested_action"
  ],
  "metrics": [
    "stockout_item_count",
    "critical_stockout_count",
    "lost_sales_estimate",
    "below_reorder_count"
  ],
  "export_formats": ["xlsx", "csv", "pdf"],
  "masking_policy": "no_patient_data",
  "schedule_allowed": true,
  "default_schedule": "daily_0700"
}
```

---

## 5.8 `NEAR_EXPIRY`

```json
{
  "report_code": "NEAR_EXPIRY",
  "report_name": "Near-Expiry Stock",
  "category": "inventory_pharmacy",
  "source_view": "rpt_stock_lots",
  "required_permissions": ["report.near_expiry.view"],
  "sensitivity": "business_confidential",
  "default_filters": {
    "days_to_expiry_lte": 180,
    "available_quantity_base_gt": 0
  },
  "columns": [
    "branch_name",
    "product_name",
    "generic_name",
    "batch_number",
    "expiry_date",
    "days_to_expiry",
    "available_quantity_base",
    "unit_cost_base",
    "available_stock_value",
    "supplier_name",
    "quality_status",
    "recall_status",
    "suggested_action"
  ],
  "metrics": [
    "near_expiry_value_180d",
    "near_expiry_value_90d",
    "near_expiry_value_30d",
    "expired_stock_value"
  ],
  "export_formats": ["xlsx", "pdf"],
  "masking_policy": "no_patient_data",
  "schedule_allowed": true,
  "default_schedule": "daily_0700"
}
```

---

## 5.9 `BATCH_RECALL`

```json
{
  "report_code": "BATCH_RECALL",
  "report_name": "Batch Recall Report",
  "category": "pharmacy_safety",
  "source_view": "rpt_batch_trace",
  "required_permissions": ["report.batch_recall.view"],
  "sensitivity": "sensitive_health_operational",
  "required_filters": ["product_id", "batch_number"],
  "columns": [
    "branch_name",
    "product_name",
    "batch_number",
    "expiry_date",
    "supplier_name",
    "quantity_received",
    "quantity_available",
    "quantity_dispensed",
    "quantity_sold",
    "patient_number",
    "patient_label_masked",
    "phone_masked",
    "dispense_date",
    "sale_number",
    "invoice_number",
    "dispensed_by",
    "recall_action_status"
  ],
  "metrics": [
    "affected_branch_count",
    "affected_patient_count",
    "available_quantity_to_quarantine",
    "dispensed_quantity"
  ],
  "export_formats": ["xlsx", "pdf"],
  "masking_policy": "mask_patient_default_allow_pharmacist",
  "schedule_allowed": false
}
```

`rpt_batch_trace` should combine `stock_movements`, `dispenses`, `sales`, `patients`, and `stock_lots`.

---

## 5.10 `CONTROLLED_MEDICINE`

```json
{
  "report_code": "CONTROLLED_MEDICINE",
  "report_name": "Controlled Medicine Register",
  "category": "pharmacy_compliance",
  "source_view": "rpt_controlled_medicine_register",
  "required_permissions": ["report.controlled_medicine.view"],
  "sensitivity": "restricted_pharmacy",
  "columns": [
    "register_entry_number",
    "transaction_datetime",
    "branch_name",
    "medicine_name",
    "controlled_substance_class",
    "batch_number",
    "opening_balance",
    "quantity_in",
    "quantity_out",
    "quantity_adjusted",
    "closing_balance",
    "patient_name_snapshot",
    "prescription_number",
    "prescriber_name_snapshot",
    "pharmacist_name_snapshot",
    "witness_user_id",
    "reason",
    "entry_status"
  ],
  "metrics": [
    "controlled_balance_variance",
    "controlled_dispense_count",
    "controlled_adjustment_count"
  ],
  "export_formats": ["pdf", "xlsx"],
  "masking_policy": "restricted_patient_identifiers",
  "schedule_allowed": true,
  "default_schedule": "monthly_1st_0800"
}
```

---

## 5.11 `PRESCRIPTION_AUDIT`

```json
{
  "report_code": "PRESCRIPTION_AUDIT",
  "report_name": "Prescription Audit",
  "category": "pharmacy_compliance",
  "source_view": "rpt_prescription_audit",
  "required_permissions": ["report.prescription_audit.view"],
  "sensitivity": "sensitive_health_operational",
  "columns": [
    "prescription_number",
    "prescription_source",
    "patient_number",
    "prescriber_name",
    "prescriber_registration",
    "prescribed_product",
    "dispensed_product",
    "quantity_prescribed",
    "quantity_dispensed",
    "balance_quantity",
    "substitution_flag",
    "substitution_reason",
    "partial_dispense_flag",
    "partial_dispense_reason",
    "batch_number",
    "expiry_date",
    "pharmacist_name",
    "approved_at",
    "invoice_number",
    "dispense_status"
  ],
  "metrics": [
    "pom_dispense_count",
    "substitution_rate",
    "partial_dispense_rate",
    "warning_override_count",
    "missing_prescriber_count"
  ],
  "export_formats": ["xlsx", "pdf"],
  "masking_policy": "pharmacy_patient_limited",
  "schedule_allowed": true,
  "default_schedule": "weekly_monday_0800"
}
```

---

## 5.12 `DIAGNOSIS_SERVICE`

```json
{
  "report_code": "DIAGNOSIS_SERVICE",
  "report_name": "Diagnosis and Service Report",
  "category": "clinical",
  "source_view": "rpt_visit_diagnosis_service",
  "required_permissions": ["report.diagnosis_service.view"],
  "sensitivity": "sensitive_health_aggregate",
  "columns": [
    "visit_date",
    "branch_name",
    "visit_type",
    "age_years",
    "sex",
    "clinician_name",
    "diagnosis_text",
    "icd10_code",
    "primary_flag",
    "order_count",
    "lab_order_count",
    "prescription_count",
    "procedure_count",
    "billed_amount",
    "payer_type"
  ],
  "metrics": [
    "visit_count",
    "top_diagnoses",
    "service_count",
    "clinician_visit_count",
    "claim_ready_visit_count"
  ],
  "export_formats": ["xlsx", "csv", "pdf"],
  "masking_policy": "aggregate_clinical_default",
  "schedule_allowed": true,
  "default_schedule": "monthly_1st_0800"
}
```

Default output should be aggregate. Patient-level drilldown requires clinical-manager permission.

---

## 5.13 `CLAIMS_REJECTION`

```json
{
  "report_code": "CLAIMS_REJECTION",
  "report_name": "Claims Rejection Report",
  "category": "claims",
  "source_view": "rpt_claim_denials",
  "required_permissions": ["report.claims_rejection.view"],
  "sensitivity": "claims_confidential",
  "columns": [
    "denial_date",
    "branch_name",
    "claim_number",
    "patient_number",
    "payer_name",
    "scheme_name",
    "total_claimed_amount",
    "amount_denied",
    "payer_denial_code",
    "denial_category",
    "denial_reason_text",
    "responsible_department",
    "required_correction",
    "correction_deadline",
    "denial_status",
    "resolution_type",
    "writeoff_amount"
  ],
  "metrics": [
    "denial_count",
    "denial_value",
    "denial_rate",
    "recoverable_denial_value",
    "writeoff_value",
    "average_days_to_resolve_denial"
  ],
  "export_formats": ["xlsx", "pdf"],
  "masking_policy": "claims_patient_limited",
  "schedule_allowed": true,
  "default_schedule": "weekly_monday_0800"
}
```

---

## 5.14 `STAFF_ACTIVITY`

```json
{
  "report_code": "STAFF_ACTIVITY",
  "report_name": "Staff Activity Log",
  "category": "compliance",
  "source_view": "rpt_staff_activity",
  "required_permissions": ["report.staff_activity.view"],
  "sensitivity": "restricted_audit",
  "columns": [
    "event_datetime",
    "branch_name",
    "actor_name",
    "actor_role",
    "module",
    "action",
    "entity_type",
    "entity_id",
    "reason",
    "risk_level",
    "approved_by",
    "device_id",
    "ip_address",
    "hash_current"
  ],
  "metrics": [
    "high_risk_action_count",
    "refund_action_count",
    "discount_override_count",
    "stock_adjustment_count",
    "role_change_count"
  ],
  "export_formats": ["xlsx", "csv", "pdf"],
  "masking_policy": "audit_sensitive",
  "schedule_allowed": false
}
```

---

## 5.15 `DATA_ACCESS`

```json
{
  "report_code": "DATA_ACCESS",
  "report_name": "Data Access Log",
  "category": "data_protection",
  "source_view": "rpt_data_access",
  "required_permissions": ["report.data_access.view"],
  "sensitivity": "restricted_data_protection",
  "columns": [
    "event_datetime",
    "branch_name",
    "actor_name",
    "actor_role",
    "patient_number",
    "record_type",
    "record_id",
    "action_type",
    "purpose",
    "consent_status",
    "recipient",
    "channel",
    "sensitive_flag",
    "break_glass_flag",
    "bulk_access_flag",
    "after_hours_flag",
    "risk_score",
    "device_id",
    "ip_address",
    "hash_current"
  ],
  "metrics": [
    "sensitive_access_count",
    "after_hours_access_count",
    "bulk_export_count",
    "break_glass_count",
    "unusual_access_count"
  ],
  "export_formats": ["xlsx", "csv", "pdf"],
  "masking_policy": "dpo_restricted",
  "schedule_allowed": true,
  "default_schedule": "monthly_1st_0800"
}
```

---

## 6. Exact KPI definitions

Seed these into `metric_definitions`.

| Metric code                     | Formula                                                                   | Source                        |
| ------------------------------- | ------------------------------------------------------------------------- | ----------------------------- |
| `gross_sales`                   | `SUM(gross_amount)` before refunds/credit notes                           | `rpt_sales_lines`             |
| `net_sales`                     | `SUM(gross_amount) - SUM(credit_note_amount) - SUM(refund_amount)`        | Sales + credit notes          |
| `transaction_count`             | `COUNT(DISTINCT sale_id)`                                                 | `rpt_sales_lines`             |
| `average_transaction_value`     | `net_sales / transaction_count`                                           | Sales                         |
| `discount_total`                | `SUM(discount_amount)`                                                    | `rpt_sales_lines`             |
| `discount_rate`                 | `SUM(discount_amount) / NULLIF(SUM(gross_amount + discount_amount),0)`    | Sales                         |
| `tax_total`                     | `SUM(tax_amount)`                                                         | `rpt_sales_lines`             |
| `cash_collected`                | `SUM(amount) WHERE payment_method='cash' AND status confirmed/allocated`  | `rpt_payments`                |
| `mpesa_collected`               | `SUM(amount) WHERE payment_method='mpesa' AND status confirmed/allocated` | `rpt_payments`                |
| `card_collected`                | `SUM(amount) WHERE payment_method='card'`                                 | `rpt_payments`                |
| `cash_variance`                 | `counted_cash - expected_cash`                                            | `rpt_shift_summary`           |
| `gross_profit`                  | `SUM(net_amount - cost_amount)`                                           | `rpt_sales_lines`             |
| `gross_margin_percent`          | `SUM(net_amount - cost_amount) / NULLIF(SUM(net_amount),0)`               | `rpt_sales_lines`             |
| `cost_of_goods_sold`            | `SUM(cost_amount)`                                                        | `rpt_sales_lines`             |
| `stock_value`                   | `SUM(available_quantity_base * unit_cost_base)`                           | `rpt_stock_lots`              |
| `near_expiry_value_180d`        | Stock value where `days_to_expiry BETWEEN 0 AND 180`                      | `rpt_stock_lots`              |
| `near_expiry_value_90d`         | Stock value where `days_to_expiry BETWEEN 0 AND 90`                       | `rpt_stock_lots`              |
| `expired_stock_value`           | Stock value where `days_to_expiry < 0`                                    | `rpt_stock_lots`              |
| `stockout_item_count`           | Count products where `available_quantity_base <= 0`                       | `rpt_stockout`                |
| `average_daily_usage`           | `quantity_out_last_n_days / n` for sale/dispense issues                   | `rpt_stock_movements`         |
| `stock_cover_days`              | `available_quantity_base / average_daily_usage`                           | Stock + movement              |
| `dead_stock_value`              | Stock value where no sale/dispense movement in configured days            | Stock + movement              |
| `substitution_rate`             | `substitution_count / prescription_dispense_count`                        | `rpt_prescription_audit`      |
| `partial_dispense_rate`         | `partial_dispense_count / prescription_dispense_count`                    | `rpt_prescription_audit`      |
| `controlled_balance_variance`   | `physical_count - system_controlled_balance`                              | Controlled count              |
| `visit_count`                   | `COUNT(DISTINCT visit_id)`                                                | `rpt_visit_diagnosis_service` |
| `claim_denial_rate`             | `denied_claim_count / submitted_claim_count`                              | Claims                        |
| `denial_value`                  | `SUM(amount_denied)`                                                      | `rpt_claim_denials`           |
| `claim_recovery_rate`           | `recovered_denied_amount / total_denied_amount`                           | Claims                        |
| `average_days_to_claim_payment` | `AVG(payment_date - submitted_at)`                                        | Claims reconciliation         |
| `sensitive_access_count`        | Count data-access events where `sensitive_flag=true`                      | `rpt_data_access`             |
| `bulk_export_count`             | Count data-access/export events where `bulk_access_flag=true`             | Access/export logs            |

---

## 7. Dashboard wireframes

## 7.1 Owner dashboard

```text
┌──────────────────────────────────────────────────────────────┐
│ OWNER DASHBOARD                                              │
├───────────────┬───────────────┬───────────────┬──────────────┤
│ Sales Today   │ Gross Margin  │ Cash Variance │ Claims Owed  │
│ KES xxx       │ xx%           │ KES xx        │ KES xxx      │
├───────────────┬───────────────┬───────────────┬──────────────┤
│ eTIMS Issues  │ Stock Value   │ Expiry Risk   │ Denial Rate  │
│ x rejected    │ KES xxx       │ KES xxx       │ xx%          │
├──────────────────────────────────────────────────────────────┤
│ Sales trend by day                                           │
├───────────────────────────────┬──────────────────────────────┤
│ Branch ranking                │ Top low-margin products      │
├───────────────────────────────┴──────────────────────────────┤
│ Alerts: cash shortage, rejected invoices, stockouts, denials  │
└──────────────────────────────────────────────────────────────┘
```

KPI cards:

```json
[
  "net_sales_today",
  "gross_margin_percent",
  "cash_variance_today",
  "payer_receivables",
  "etims_rejected_count",
  "stock_value",
  "near_expiry_value_90d",
  "claim_denial_rate"
]
```

---

## 7.2 Branch manager dashboard

```text
┌──────────────────────────────────────────────────────────────┐
│ BRANCH MANAGER DASHBOARD                                     │
├───────────────┬───────────────┬───────────────┬──────────────┤
│ Sales Today   │ Open Shifts   │ M-Pesa Pending│ eTIMS Queued │
├───────────────┼───────────────┼───────────────┼──────────────┤
│ Low Stock     │ Near Expiry   │ Pending Lab   │ Pharmacy Q   │
├──────────────────────────────────────────────────────────────┤
│ Staff exceptions: discounts, refunds, voids, adjustments      │
└──────────────────────────────────────────────────────────────┘
```

---

## 7.3 Accountant dashboard

```text
┌──────────────────────────────────────────────────────────────┐
│ ACCOUNTANT DASHBOARD                                         │
├───────────────┬───────────────┬───────────────┬──────────────┤
│ eTIMS Accepted│ eTIMS Rejected│ Credit Notes  │ Tax Total    │
├───────────────┼───────────────┼───────────────┼──────────────┤
│ Cash Expected │ M-Pesa Match  │ Payer AR      │ Patient AR   │
├──────────────────────────────────────────────────────────────┤
│ Reconciliation queue: unmatched M-Pesa, claim remittance      │
└──────────────────────────────────────────────────────────────┘
```

---

## 7.4 Pharmacist dashboard

```text
┌──────────────────────────────────────────────────────────────┐
│ PHARMACIST DASHBOARD                                         │
├───────────────┬───────────────┬───────────────┬──────────────┤
│ Rx Pending    │ Controlled Var│ Near Expiry   │ Recalled Lots│
├───────────────┼───────────────┼───────────────┼──────────────┤
│ Substitutions │ Partials      │ Warnings      │ ADR/PQMP     │
├──────────────────────────────────────────────────────────────┤
│ High-risk items needing review                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 7.5 Clinic manager dashboard

```text
┌──────────────────────────────────────────────────────────────┐
│ CLINIC MANAGER DASHBOARD                                     │
├───────────────┬───────────────┬───────────────┬──────────────┤
│ Visits Today  │ Waiting Now   │ Avg Wait Time │ Unsigned     │
├───────────────┼───────────────┼───────────────┼──────────────┤
│ Top Dx        │ Pending Labs  │ Referrals     │ Claims Ready │
├──────────────────────────────────────────────────────────────┤
│ Clinician workload and service distribution                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 7.6 DPO/compliance dashboard

```text
┌──────────────────────────────────────────────────────────────┐
│ DATA PROTECTION / COMPLIANCE DASHBOARD                       │
├───────────────┬───────────────┬───────────────┬──────────────┤
│ Sensitive View│ Bulk Exports  │ Break-glass   │ Failed Login │
├───────────────┼───────────────┼───────────────┼──────────────┤
│ After-hours   │ Role Changes  │ Consent Issues│ Export Queue │
├──────────────────────────────────────────────────────────────┤
│ Highest-risk data access events                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Masking rules implementation

## 8.1 Data sensitivity classes

```text
public_business
internal_business
confidential_business
restricted_financial
restricted_pharmacy
sensitive_health
restricted_claims
restricted_audit
restricted_data_protection
```

## 8.2 Column masking functions

Developers should implement database or application-level masking functions.

```sql
mask_name('Jane Wanjiku')       → 'J*** W***'
mask_phone('0712345678')        → '07******78'
mask_id('12345678')             → '****5678'
mask_email('jane@test.com')     → 'j***@test.com'
mask_patient_number('PT-00012') → 'PT-00012'
```

## 8.3 Report masking policy table

### `report_masking_policies`

| Field                         | Example                                                |
| ----------------------------- | ------------------------------------------------------ |
| `policy_code`                 | `mask_patient_default`                                 |
| `description`                 | Patient identifiers masked unless clinical/claims role |
| `applies_to_sensitivity`      | `sensitive_health`                                     |
| `column_rules_json`           | Name, phone, ID, diagnosis                             |
| `allowed_unmasked_roles_json` | Clinician, pharmacist, claims, DPO                     |
| `export_requires_approval`    | true/false                                             |

## 8.4 Masking policies v1

| Policy code                      | Rule                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `no_patient_data`                | Patient columns not included                                                                        |
| `mask_patient_default`           | Patient name, phone, ID masked                                                                      |
| `pharmacy_patient_limited`       | Pharmacist sees patient number/name; owner sees masked                                              |
| `claims_patient_limited`         | Claims officer sees required patient/member fields; owner sees masked                               |
| `aggregate_clinical_default`     | Clinical report is aggregate by default; patient-level drilldown restricted                         |
| `restricted_patient_identifiers` | Controlled-medicine report shows required register fields only to pharmacist/superintendent/auditor |
| `audit_sensitive`                | Audit exports require reason and may include staff but not patient content                          |
| `dpo_restricted`                 | DPO can see access metadata; clinical content excluded unless investigation approved                |

---

## 9. Report access control

## 9.1 Access decision inputs

```text
user role
branch assignment
organisation scope
professional cadre
report permission
report sensitivity
purpose of access
patient-care relationship, where applicable
export request or view only
```

## 9.2 Row-level scoping

| User           | Scope                                                      |
| -------------- | ---------------------------------------------------------- |
| Cashier        | Own shift / own branch limited                             |
| Branch manager | Assigned branch                                            |
| Pharmacist     | Assigned pharmacy branch                                   |
| Clinician      | Assigned clinical branch and care-related clinical reports |
| Lab in-charge  | Assigned lab branch                                        |
| Accountant     | Financial reports across assigned organisation/branches    |
| Claims officer | Claims-related reports across assigned facilities          |
| Owner          | Business reports across organisation; patient data masked  |
| DPO            | Data-access reports across organisation                    |
| Auditor        | Read-only audit scope as approved                          |

## 9.3 Report permission model

### `report_permissions`

| Field                      |
| -------------------------- |
| `id`                       |
| `report_code`              |
| `role_code`                |
| `can_view`                 |
| `can_drill_down`           |
| `can_export`               |
| `can_schedule`             |
| `can_view_unmasked`        |
| `requires_export_reason`   |
| `requires_export_approval` |

---

## 10. Immutable audit architecture

## 10.1 Final audit design

Use two append-only streams:

```text
audit_events
data_access_events
```

No update. No delete. Corrections are new events.

## 10.2 `audit_events`

| Field             |    Required |
| ----------------- | ----------: |
| `id`              |         Yes |
| `organisation_id` |         Yes |
| `branch_id`       |    Optional |
| `event_datetime`  |         Yes |
| `actor_user_id`   |         Yes |
| `actor_role`      |         Yes |
| `module`          |         Yes |
| `action`          |         Yes |
| `entity_type`     |         Yes |
| `entity_id`       |         Yes |
| `old_value_json`  |    Optional |
| `new_value_json`  |    Optional |
| `reason`          | Conditional |
| `approved_by`     |    Optional |
| `device_id`       |    Optional |
| `ip_address`      |    Optional |
| `risk_level`      |         Yes |
| `hash_previous`   |         Yes |
| `hash_current`    |         Yes |
| `signature`       |    Optional |
| `created_at`      |         Yes |

## 10.3 `data_access_events`

| Field              |                              Required |
| ------------------ | ------------------------------------: |
| `id`               |                                   Yes |
| `organisation_id`  |                                   Yes |
| `branch_id`        |                              Optional |
| `event_datetime`   |                                   Yes |
| `actor_user_id`    |                                   Yes |
| `actor_role`       |                                   Yes |
| `patient_id`       |                           Conditional |
| `record_type`      |                                   Yes |
| `record_id`        |                                   Yes |
| `action_type`      | Yes: view, edit, print, export, share |
| `purpose`          |  Required for sensitive access/export |
| `consent_status`   |                              Optional |
| `recipient`        |                              Optional |
| `channel`          |                              Optional |
| `sensitive_flag`   |                                   Yes |
| `break_glass_flag` |                                   Yes |
| `bulk_access_flag` |                                   Yes |
| `after_hours_flag` |                                   Yes |
| `risk_score`       |                                   Yes |
| `device_id`        |                              Optional |
| `ip_address`       |                              Optional |
| `hash_previous`    |                                   Yes |
| `hash_current`     |                                   Yes |
| `created_at`       |                                   Yes |

## 10.4 Hash-chaining rule

```text
hash_current = SHA256(
  organisation_id
  + event_datetime
  + actor_user_id
  + module
  + action
  + entity_type
  + entity_id
  + canonical_json_payload
  + hash_previous
)
```

## 10.5 Audit immutability rules

| Rule                | Behaviour                         |
| ------------------- | --------------------------------- |
| Audit event created | Append only                       |
| User attempts edit  | Block                             |
| Correction needed   | Create correction event           |
| Export audit log    | Logged as separate export event   |
| Daily audit seal    | Store daily hash checkpoint       |
| Legal hold          | Prevent purge/archive deletion    |
| Backup              | Audit stream backed up separately |
| Tamper check        | Recompute hash chain              |

---

## 11. Export rules

## 11.1 Export decision flow

```text
User clicks export
  ↓
Check report permission
  ↓
Check sensitivity
  ↓
Apply masking policy
  ↓
If sensitive: require reason
  ↓
If high-risk/bulk: require approval
  ↓
Generate file
  ↓
Watermark
  ↓
Hash file
  ↓
Store export log
  ↓
Allow download
```

## 11.2 `report_exports`

| Field                     |    Required |
| ------------------------- | ----------: |
| `id`                      |         Yes |
| `report_run_id`           |         Yes |
| `report_code`             |         Yes |
| `exported_by`             |         Yes |
| `export_format`           |         Yes |
| `filters_json`            |         Yes |
| `row_count`               |         Yes |
| `sensitive_data_included` |         Yes |
| `masking_policy_applied`  |         Yes |
| `export_reason`           | Conditional |
| `approved_by`             | Conditional |
| `file_hash`               |         Yes |
| `watermark_text`          |         Yes |
| `recipient`               |    Optional |
| `exported_at`             |         Yes |

## 11.3 Watermark format

```text
Report: DAILY_SALES
Generated: 2026-06-23 18:30
User: jane.manager
Branch scope: Rongai
Filters: 2026-06-23 to 2026-06-23
Confidentiality: Internal use only
Export ID: EXP-000234
```

---

## 12. Alerts and thresholds

## 12.1 Alert rule schema

### `alert_rules`

| Field                        | Example                         |
| ---------------------------- | ------------------------------- |
| `alert_code`                 | `ETIMS_REJECTED_INVOICE`        |
| `source_view`                | `rpt_etims_invoices`            |
| `condition_json`             | `{"etims_status":"rejected"}`   |
| `threshold_json`             | `{"count_gt":0}`                |
| `severity`                   | critical                        |
| `recipient_roles_json`       | Accountant, branch manager      |
| `notification_channels_json` | in_app, email, SMS for critical |
| `cooldown_minutes`           | 30                              |
| `active`                     | true                            |

## 12.2 Default alert thresholds

| Alert                                | Trigger                                              | Severity         | Recipients                |
| ------------------------------------ | ---------------------------------------------------- | ---------------- | ------------------------- |
| `ETIMS_REJECTED_INVOICE`             | Any invoice rejected                                 | Critical         | Accountant, manager       |
| `ETIMS_QUEUED_TOO_LONG`              | Queued > 2 hours warning, > 24 hours critical        | Warning/Critical | Accountant                |
| `CASH_VARIANCE_HIGH`                 | Abs variance > KES 100 or > 1% of cash sales         | Warning          | Manager                   |
| `CASH_VARIANCE_CRITICAL`             | Abs variance > KES 1,000                             | Critical         | Owner, manager            |
| `MPESA_UNMATCHED`                    | Unmatched M-Pesa > 30 minutes                        | Warning          | Accountant/manager        |
| `DISCOUNT_HIGH`                      | Line discount > user limit or day discount rate > 5% | Warning          | Manager/owner             |
| `SALE_BELOW_COST`                    | Any stock line sold below cost                       | Critical         | Owner                     |
| `STOCKOUT_CRITICAL_ITEM`             | Critical item available stock <= 0                   | Critical         | Procurement, manager      |
| `BELOW_REORDER`                      | Available + on-order <= reorder point                | Warning          | Procurement               |
| `NEAR_EXPIRY_90D`                    | Stock value expiring within 90 days > threshold      | Warning          | Pharmacist/manager        |
| `EXPIRED_STOCK_AVAILABLE`            | Expired lot still available > 0                      | Critical         | Pharmacist                |
| `RECALLED_BATCH_AVAILABLE`           | Recalled batch sellable/available                    | Critical         | Pharmacist/manager        |
| `CONTROLLED_VARIANCE`                | Controlled physical/system variance != 0             | Critical         | Superintendent            |
| `PRESCRIPTION_WARNING_OVERRIDE_HIGH` | Overrides > threshold per day/week                   | Warning          | Pharmacist/superintendent |
| `UNSIGNED_NOTES`                     | Unsigned notes older than 24h                        | Warning          | Clinic manager            |
| `CRITICAL_LAB_UNREVIEWED`            | Critical result not reviewed within configured SLA   | Critical         | Clinician/clinic manager  |
| `CLAIM_REJECTION`                    | Any claim rejected                                   | Warning          | Claims officer            |
| `CLAIM_DENIAL_RATE_HIGH`             | Weekly denial rate > 10%                             | Warning          | Billing manager           |
| `CLAIM_DEADLINE_APPROACHING`         | Claim deadline within 2 days                         | Warning          | Claims officer            |
| `BULK_EXPORT`                        | Export > 50 patient rows                             | Critical         | DPO                       |
| `AFTER_HOURS_SENSITIVE_ACCESS`       | Sensitive record access outside hours                | Warning          | DPO                       |
| `BREAK_GLASS_USED`                   | Any break-glass access                               | Critical         | DPO/compliance            |
| `FAILED_LOGINS`                      | > 5 failed attempts in 15 minutes                    | Warning/Critical | Admin                     |

## 12.3 Notification rules

| Severity | Channels                                           | Expected action               |
| -------- | -------------------------------------------------- | ----------------------------- |
| Info     | In-app                                             | Review later                  |
| Warning  | In-app + email                                     | Assign task                   |
| Critical | In-app + email + SMS/WhatsApp to responsible staff | Immediate action              |
| Blocking | In-app + workflow block                            | Cannot proceed until resolved |

---

## 13. Scheduling rules

## 13.1 Default report schedules

| Report              | Default schedule                   | Recipients                |
| ------------------- | ---------------------------------- | ------------------------- |
| Daily sales         | Daily 9:00 PM                      | Owner, manager            |
| Cashier shift       | On shift close                     | Manager                   |
| eTIMS status        | Daily 8:00 PM + hourly if errors   | Accountant                |
| Gross margin        | Weekly Monday 7:00 AM              | Owner                     |
| Fast/slow movers    | Weekly Monday 7:00 AM              | Procurement               |
| Stockout            | Daily 7:00 AM                      | Procurement, manager      |
| Near-expiry         | Daily 7:00 AM                      | Pharmacist, manager       |
| Batch recall        | On demand only                     | Pharmacist                |
| Controlled medicine | Monthly + on demand                | Pharmacist/superintendent |
| Prescription audit  | Weekly                             | Pharmacist                |
| Diagnosis/service   | Monthly                            | Clinic manager            |
| Claims rejection    | Weekly + immediate rejection alert | Billing/claims            |
| Staff activity      | On demand                          | Owner/compliance          |
| Data access log     | Monthly + anomaly alerts           | DPO                       |

## 13.2 Scheduled report delivery rules

| Rule                           | Behaviour                                             |
| ------------------------------ | ----------------------------------------------------- |
| User lacks permission          | Do not send                                           |
| Report contains sensitive data | Send secure link, not attachment                      |
| Export reason required         | Scheduled job uses predefined reason                  |
| No data                        | Send summary “no records” or suppress based on config |
| Job fails                      | Alert admin                                           |
| Large report                   | Generate async and send secure link                   |
| Branch scope                   | Recipient gets only permitted branches                |

---

## 14. Data quality report definitions

Build a `DATA_QUALITY_DASHBOARD` early because weak data will damage every report.

## 14.1 Data quality checks

| Check code                      | Source              | Condition                                |
| ------------------------------- | ------------------- | ---------------------------------------- |
| `SALE_WITHOUT_INVOICE`          | Sales/invoices      | Completed sale missing invoice           |
| `INVOICE_WITHOUT_ETIMS_STATUS`  | Invoices            | Invoice status null                      |
| `MEDICINE_WITHOUT_BATCH`        | Sale/dispense lines | Medicine line missing batch              |
| `NEGATIVE_STOCK`                | Stock balances      | Available quantity < 0                   |
| `EXPIRED_STOCK_AVAILABLE`       | Stock lots          | Expired but available > 0                |
| `POM_WITHOUT_PRESCRIPTION`      | Sale/dispense       | POM line no prescription                 |
| `VISIT_WITHOUT_DIAGNOSIS`       | Visits/diagnoses    | Closed visit missing diagnosis           |
| `CLAIM_WITHOUT_ICD`             | Claims/diagnoses    | Claim diagnosis no ICD where required    |
| `LAB_CLAIM_WITHOUT_RESULT`      | Claim/lab           | Lab claim line missing verified result   |
| `UNSIGNED_NOTE`                 | Clinical notes      | Draft older than threshold               |
| `UNMATCHED_MPESA`               | Payments            | M-Pesa confirmed but not allocated       |
| `CLAIM_WITH_MISSING_ATTACHMENT` | Claims              | Required attachment missing              |
| `DUPLICATE_PATIENT`             | Patients            | Same name/phone/DOB similarity           |
| `DUPLICATE_PRODUCT_BARCODE`     | Products            | Same barcode active on multiple products |

---

## 15. Implementation sequence

## Phase 1: Reporting infrastructure

Build:

```text
report_definitions
metric_definitions
report_runs
report_exports
report_permissions
report_masking_policies
alert_rules
alert_events
scheduled_reports
```

## Phase 2: Core reporting views

Build:

```text
rpt_dim_branch
rpt_dim_user
rpt_dim_product
rpt_dim_patient_masked
rpt_sales_lines
rpt_payments
rpt_shift_summary
rpt_etims_invoices
rpt_stock_lots
rpt_stock_movements
rpt_prescription_audit
rpt_controlled_medicine_register
rpt_visit_diagnosis_service
rpt_claim_denials
rpt_staff_activity
rpt_data_access
```

## Phase 3: Minimum reports

Implement:

```text
DAILY_SALES
CASHIER_SHIFT
ETIMS_STATUS
GROSS_MARGIN
FAST_SLOW_MOVERS
STOCKOUT_REPORT
NEAR_EXPIRY
BATCH_RECALL
CONTROLLED_MEDICINE
PRESCRIPTION_AUDIT
DIAGNOSIS_SERVICE
CLAIMS_REJECTION
STAFF_ACTIVITY
DATA_ACCESS
```

## Phase 4: Dashboards

Build:

```text
Owner dashboard
Branch manager dashboard
Accountant dashboard
Pharmacist dashboard
Clinic manager dashboard
Claims officer dashboard
DPO/compliance dashboard
```

## Phase 5: Alerts and schedules

Build:

```text
default alert rules
alert delivery service
daily report schedules
secure export links
export approval workflow
```

## Phase 6: Immutable audit and anomaly detection

Build:

```text
append-only audit_events
append-only data_access_events
hash chaining
daily audit seal
bulk export detection
after-hours access detection
break-glass detection
```

---

## 16. Developer acceptance criteria

## 16.1 Report infrastructure

| Test                     | Expected result                          |
| ------------------------ | ---------------------------------------- |
| Create report definition | Report appears in catalogue              |
| Run report               | Report run record created                |
| Export report            | Export log, file hash, watermark created |
| Sensitive export         | Reason required                          |
| Unauthorized role        | Report blocked                           |
| Branch-limited user      | Only assigned branch data visible        |
| Scheduled report         | Runs at configured time                  |
| Failed report            | Admin alert created                      |

## 16.2 Report correctness

| Test                        | Expected result                 |
| --------------------------- | ------------------------------- |
| Completed sale              | Appears in daily sales          |
| Refunded sale               | Net sales reduced               |
| Credit note                 | Linked to original invoice      |
| eTIMS rejection             | Appears in eTIMS status         |
| Stock sale                  | Margin uses correct cost        |
| Stockout                    | Available quantity <= 0 appears |
| Near expiry                 | Batch appears by expiry window  |
| Controlled dispense         | Appears in controlled report    |
| Prescription substitution   | Appears in prescription audit   |
| Closed visit with diagnosis | Appears in diagnosis/service    |
| Claim denial                | Appears in claims rejection     |
| User refund action          | Appears in staff activity       |
| Patient record view         | Appears in data access log      |

## 16.3 Masking and access

| Test                               | Expected result                                    |
| ---------------------------------- | -------------------------------------------------- |
| Owner opens diagnosis report       | Aggregate data visible, patient identifiers masked |
| Clinician opens own patient report | Patient details visible within scope               |
| Procurement opens stock report     | No patient data visible                            |
| Pharmacist opens recall report     | Patient contact visible only if permission allows  |
| DPO opens data access log          | Access metadata visible                            |
| Cashier tries data access log      | Blocked                                            |
| Sensitive export                   | Approval/reason required                           |
| Bulk export                        | DPO alert created                                  |

## 16.4 Audit immutability

| Test                       | Expected result                  |
| -------------------------- | -------------------------------- |
| Audit event created        | Hash current and previous stored |
| Attempt update audit event | Blocked                          |
| Correction needed          | New correction event created     |
| Export report              | Export itself logged             |
| Hash chain verification    | Passes if untouched              |
| Tampered audit row         | Verification fails               |
| Daily audit seal           | Created                          |

## 16.5 Alerts

| Test                         | Expected result                         |
| ---------------------------- | --------------------------------------- |
| eTIMS rejected               | Critical alert to accountant            |
| Cash variance high           | Manager alert                           |
| Controlled variance          | Superintendent alert                    |
| Batch recalled               | Sale/dispense blocked and alert created |
| Claim rejected               | Claims officer task                     |
| Bulk data export             | DPO alert                               |
| After-hours sensitive access | DPO review alert                        |

---

## 17. Final handoff summary

Module 8 is now developer-ready with these final decisions:

| Area                    | Final state                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Report SQL/data sources | Core `rpt_*` views defined                                                                                            |
| Report specs            | Machine-readable report registry defined                                                                              |
| Metrics                 | Central metric dictionary defined                                                                                     |
| Dashboards              | Role-based wireframes defined                                                                                         |
| Masking                 | Column masking, row scoping, export control defined                                                                   |
| Immutable audit         | Append-only hash-chained architecture defined                                                                         |
| Alerts                  | Default thresholds and recipients defined                                                                             |
| Scheduling              | Default schedules and delivery rules defined                                                                          |
| Export                  | Watermark, reason, approval, hash, audit defined                                                                      |
| Developer readiness     | High for MVP report pack                                                                                              |
| Production risk         | Final thresholds, role permissions, and masking policies should be confirmed with owner/compliance/DPO before go-live |

The closed Module 8 rule is:

```text
No report should exist unless the system knows:
which source view it uses,
which metric definitions it applies,
which filters and columns are allowed,
which roles may view or export it,
which fields must be masked,
which export controls apply,
which alerts it can trigger,
which schedule may run it,
and how every view, export, and anomaly is audited.
```
