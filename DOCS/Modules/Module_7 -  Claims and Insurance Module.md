# Module 7: Claims and Insurance Module

This module is the **payer, benefit, claim, denial, and reimbursement engine** of the system.

Modules 1–6 answer:

```text
Module 1: Is the facility/provider licensed and contracted?
Module 2: Was the service billed, invoiced, paid, credited, or receipted?
Module 3: Was the medicine dispensed safely and traceably?
Module 4: Was stock issued, valued, and controlled?
Module 5: Was the clinical encounter documented?
Module 6: Was the lab test ordered, billed, resulted, and verified?
Module 7: Can the facility prove the patient was eligible, the service was covered, the tariff was correct, the documents are complete, the claim was submitted, and the payment was reconciled?
```

For Kenya, this module must support **SHA, private medical insurers, employer/corporate schemes, capitation arrangements, cash top-ups, co-payments, exclusions, pre-authorisations, claim rejections, and receivables reconciliation**.

Kenya’s Social Health Insurance Act establishes a Claims Management Office responsible for reviewing, processing, validating, and appraising medical claims, issuing pre-authorisations, developing an e-claims system, conducting quality assurance surveillance, and establishing controls for detecting fraud. The Social Health Insurance Regulations also require claims to be lodged, reviewed, processed, validated, appraised, and paid through the Centralized Digital Platform. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/2023/16/eng%402023-11-24)) ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402024-03-08))

---

## 1. Purpose of the module

The Claims and Insurance Module should:

| Purpose                   | Practical meaning                                                                 |
| ------------------------- | --------------------------------------------------------------------------------- |
| Configure benefit schemes | SHA, private insurer, employer, corporate, capitation, staff schemes              |
| Verify eligibility        | Confirm patient/member, policy, cover, beneficiary, limits                        |
| Manage pre-authorisation  | Request approval before service where required                                    |
| Apply tariffs             | Use contracted prices for consultation, lab, drugs, procedures                    |
| Build claim bundles       | Combine patient, provider, diagnosis, services, documents, invoices               |
| Prevent claim leakage     | Detect missing diagnosis, unsigned notes, unverified results, missing attachments |
| Prevent fraud             | Block duplicate claims, non-covered services, undocumented services               |
| Track submission          | Draft, submitted, acknowledged, returned, rejected, approved, paid                |
| Manage denials            | Capture rejection reasons, corrections, resubmissions, write-offs                 |
| Reconcile payments        | Claimed vs approved vs paid vs patient balance                                    |
| Post receivables          | Know how much each payer owes                                                     |
| Support audits            | Every claim edit, denial, resubmission, and payment allocation is traceable       |

---

## 2. Kenya-specific design basis

## A. SHA empanelment, contracting, and provider obligations

SHA pays claims to empanelled and contracted healthcare providers or facilities. Emergency claims may also be payable to a licensed and certified provider or facility where the emergency service is within the benefits package. Contracted providers are required to provide covered services within the benefits package, use and verify beneficiary data, administer services within limits, provide medically necessary care, maintain records in readily accessible format, and maintain infrastructure for linking benefits administration and claims submission to the Centralized Digital Platform. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402024-03-08))

Software implications:

| SHA requirement                    | System behaviour                                                         |
| ---------------------------------- | ------------------------------------------------------------------------ |
| Empanelled and contracted provider | Claim submission enabled only for configured active contracts            |
| Beneficiary verification           | Patient/member eligibility fields and verification status                |
| Benefit package limits             | Check covered services, limits, co-pay, exclusions                       |
| Medically necessary service        | Link every billed service to clinical note/diagnosis/order/result        |
| Timely and accurate records        | Claim bundle generated from EMR, lab, pharmacy, billing                  |
| Centralized Digital Platform       | API/manual upload adapter and submission status tracking                 |
| Fraud controls                     | Duplicate, unprovided service, out-of-scope service, altered info checks |

---

## B. Pre-authorisation

The SHA regulations define pre-authorisation as permission required before specified healthcare services are provided to determine whether a beneficiary’s cover caters for the cost. The regulations require online pre-authorisation requests for specialized healthcare services determined by the Authority, accompanied by beneficiary details, provider/facility details, and service details; the decision should be made immediately but not later than 72 hours, and pre-authorisation does not apply to emergency services. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402024-03-08))

Software implications:

| Pre-authorisation requirement | System behaviour                                        |
| ----------------------------- | ------------------------------------------------------- |
| Beneficiary details           | Patient/member identity required                        |
| Provider/facility details     | Branch/provider code required                           |
| Service details               | Procedure/test/drug/service with diagnosis and tariff   |
| Decision tracking             | Pending, approved, denied, partially approved, expired  |
| 72-hour decision window       | SLA timer and escalation                                |
| Emergency exemption           | Emergency override with documentation                   |
| Peer review possibility       | Attach notes, results, referral, justification          |
| Limits                        | Approval amount, quantity, service cap, validity period |

---

## C. Tariffs

Kenya has published Tariffs for Healthcare Services, 2025 under the Social Health Insurance Act. The tariff notice commenced on 28 February 2025 and should be treated as a versioned tariff source for SHA pricing, subject to updates. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2025/56/eng%402025-02-28))

Software implications:

| Tariff requirement   | System behaviour                                      |
| -------------------- | ----------------------------------------------------- |
| Tariff versioning    | Store effective date and source                       |
| Service mapping      | Consultation, lab, procedure, drug, package           |
| Facility-level rules | Some services may depend on facility level/scope      |
| Benefit limits       | Quantity, frequency, amount, diagnosis, referral      |
| Updates              | New tariff version should not corrupt old claims      |
| Payer differences    | SHA tariff ≠ private insurer tariff ≠ employer tariff |

---

## D. Private medical insurers and claim handling

Private insurers operate under Kenya’s insurance regulatory framework. The Insurance Regulatory Authority says it regulates, supervises, and develops the insurance industry, and the Insurance Claims Management Guidelines, 2022 state that they are intended to provide principles for claims management, ensure prompt payment of claims, and promote consumer confidence. ([online.ira.go.ke](https://online.ira.go.ke/)) ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/gn/2022/3638/eng%402022-03-29))

Software implications:

| Private insurance need        | System behaviour                                               |
| ----------------------------- | -------------------------------------------------------------- |
| Different schemes             | Corporate, individual, family, inpatient, outpatient           |
| Different rules               | Co-pay, limits, exclusions, waiting periods                    |
| Different forms               | Claim forms, medical reports, invoices, prescriptions, results |
| Different submission channels | Portal, email, API, physical forms                             |
| Denial handling               | Track reasons and resubmissions                                |
| Payment reconciliation        | Match remittance advice to claims                              |

---

## 3. Core users

| User                       | Main actions                                                                 |
| -------------------------- | ---------------------------------------------------------------------------- |
| Receptionist               | Captures payer/member details, checks eligibility                            |
| Billing officer            | Applies scheme, co-pay, price split, invoice                                 |
| Clinician                  | Provides diagnosis, notes, medical justification, discharge/referral summary |
| Lab user                   | Provides verified lab results as claim evidence                              |
| Pharmacist                 | Provides prescription and dispense record                                    |
| Claims officer             | Builds, validates, submits, follows up, corrects claims                      |
| Facility manager           | Reviews claim ageing, denials, revenue leakage                               |
| Accountant                 | Reconciles approved/paid amounts and payer remittances                       |
| Owner/director             | Views payer debt, denial rate, cashflow exposure                             |
| Auditor/compliance officer | Reviews fraud controls, documentation, resubmission history                  |

---

## 4. Relationship with modules 1–6

## Module 1: Organisation and Licensing

| Data from Module 1           | Claims use                             |
| ---------------------------- | -------------------------------------- |
| Facility licence             | Claim eligibility                      |
| Provider/facility code       | Claim submission                       |
| SHA/private insurer contract | Scheme activation                      |
| Professional licences        | Clinician/lab/pharmacy sign-off        |
| Branch service scope         | Prevent claiming out-of-scope services |
| Contract expiry              | Block or warn on claims                |

## Module 2: POS, Billing and Payments

| Billing data        | Claims use              |
| ------------------- | ----------------------- |
| Bill lines          | Services/items claimed  |
| eTIMS invoice       | Financial/tax reference |
| Patient co-pay      | Patient portion         |
| Insurer/SHA portion | Receivable              |
| Credit notes        | Claim corrections       |
| Payments            | Reconciliation          |
| Refunds             | Claim adjustment        |

## Module 3: Pharmacy Dispensing

| Pharmacy data                | Claims use                                                   |
| ---------------------------- | ------------------------------------------------------------ |
| Prescription                 | Medicine claim support                                       |
| Dispense record              | Proof medicine was supplied                                  |
| Batch/expiry                 | Traceability                                                 |
| Substitution                 | Explain difference between prescribed and dispensed medicine |
| Partial dispense             | Claim only actual quantity supplied                          |
| Controlled medicine register | High-risk evidence                                           |

## Module 4: Inventory

| Inventory data        | Claims use                        |
| --------------------- | --------------------------------- |
| Stock issue           | Proves item/service consumed      |
| Drug cost             | Margin and reimbursement analysis |
| Batch data            | Recall and audit                  |
| Procedure consumables | Procedure costing                 |
| Vaccine/test-kit use  | Evidence for service provision    |

## Module 5: Clinic EMR

| EMR data             | Claims use                               |
| -------------------- | ---------------------------------------- |
| Patient demographics | Member identity                          |
| Visit                | Encounter date and provider              |
| Clinical note        | Medical necessity                        |
| Diagnosis            | Claim diagnosis                          |
| Orders               | Lab/procedure/prescription justification |
| Referral             | Referral-dependent benefits              |
| Visit summary        | Claim attachment                         |

## Module 6: Lab-lite

| Lab data                   | Claims use            |
| -------------------------- | --------------------- |
| Lab order                  | Test requested        |
| Billing link               | Test charged          |
| Result                     | Test performed        |
| Verification               | Result authenticity   |
| External lab document      | Send-out proof        |
| Critical/abnormal findings | Medical justification |

---

## 5. Core claim transaction types

| Transaction type              | Description                                      |
| ----------------------------- | ------------------------------------------------ |
| Outpatient claim              | Consultation, lab, drugs, minor procedure        |
| Pharmacy-only claim           | Covered medicines under scheme                   |
| Lab-only claim                | Diagnostic test claim                            |
| Procedure claim               | Dressing, injection, nebulization, minor surgery |
| Referral claim                | Claim requiring referral chain                   |
| Emergency claim               | Emergency service, may bypass pre-authorisation  |
| Chronic-care claim            | Diabetes, hypertension, asthma, etc.             |
| Capitation encounter          | Encounter under prepaid/capitated arrangement    |
| Employer/corporate claim      | Company pays directly                            |
| Private insurer claim         | AAR/Jubilee/Britam/etc. style schemes            |
| SHA claim                     | SHA benefit package and tariffs                  |
| Patient reimbursement support | Patient pays and later claims from insurer       |
| Claim adjustment              | Correct amount/service after submission          |
| Claim resubmission            | Re-submit returned/rejected claim                |
| Claim write-off               | Unrecoverable denied amount                      |
| Overpayment recovery          | Payer paid more than expected                    |

---

## 6. Feature-by-feature design

## A. Benefit scheme setup

Benefit scheme setup defines what a payer covers, at what price, with what rules.

### Scheme types

| Scheme type          | Example                                          |
| -------------------- | ------------------------------------------------ |
| SHA                  | Social Health Authority benefits                 |
| Private insurer      | AAR, Jubilee, Britam, CIC, Madison, etc.         |
| Employer/corporate   | Company staff scheme                             |
| Capitation           | Facility receives fixed amount per member/period |
| Fee-for-service      | Claim per service/item                           |
| Hybrid               | Capitation plus excluded fee-for-service items   |
| Staff scheme         | Facility’s own staff                             |
| Cash discount scheme | Not insurance, but special pricing               |
| Donor/NGO programme  | Specific covered services                        |
| Voucher scheme       | Maternal/child/other voucher workflows           |

### Payer master fields

| Field                   |   Required? | Notes                             |
| ----------------------- | ----------: | --------------------------------- |
| Payer name              |         Yes | SHA/private insurer/employer      |
| Payer type              |         Yes | SHA, private, employer, corporate |
| Regulator/reference     |    Optional | IRA/SHA/contract reference        |
| Contact person          | Recommended | Claims follow-up                  |
| Claims email/portal/API | Recommended | Submission route                  |
| Phone                   | Recommended |                                   |
| Address                 |    Optional |                                   |
| Payment bank/account    |    Optional | Reconciliation                    |
| Status                  |         Yes | Active, suspended, inactive       |

### Scheme fields

| Field                   |   Required? | Notes                               |
| ----------------------- | ----------: | ----------------------------------- |
| Scheme name             |         Yes | Example: Corporate Outpatient Plan  |
| Scheme code             |         Yes | Internal/payer code                 |
| Payer                   |         Yes | Link to payer                       |
| Contract number         |         Yes | From Module 1                       |
| Facility/provider code  |         Yes | From payer/SHA                      |
| Branch/facility         |         Yes | Claims are branch-specific          |
| Effective date          |         Yes |                                     |
| Expiry date             |         Yes |                                     |
| Scheme type             |         Yes | Fee-for-service/capitation/hybrid   |
| Covered services        |         Yes | Consultation, lab, drugs, procedure |
| Benefit limits          |         Yes | Amount, frequency, visit count      |
| Co-pay rules            | Recommended | Fixed, %, none                      |
| Exclusions              | Recommended | Non-covered services/drugs          |
| Waiting period          |    Optional | Private/employer schemes            |
| Referral requirement    |    Optional | Especially SHA/specialist           |
| Pre-auth rules          |         Yes | Services needing approval           |
| Tariff table            |         Yes | Link                                |
| Claim submission method |         Yes | Portal/API/email/manual             |
| Claim deadline          | Recommended | Days after visit/discharge          |
| Attachments required    |         Yes | Rules                               |
| Status                  |         Yes | Draft, active, suspended, expired   |

### Member/beneficiary fields

| Field                         |       Required? | Notes                              |
| ----------------------------- | --------------: | ---------------------------------- |
| Patient                       |             Yes | Link to EMR patient                |
| Payer                         |             Yes |                                    |
| Scheme                        |             Yes |                                    |
| Member number                 |             Yes | SHA/private insurer/employer ID    |
| Principal member              |    If dependent |                                    |
| Dependent relationship        |    If dependent | Spouse/child/etc.                  |
| ID/passport/birth certificate |     Recommended | Eligibility                        |
| SHA number                    |         For SHA |                                    |
| Policy number                 | Private insurer |                                    |
| Employer staff number         |       Corporate |                                    |
| Cover start/end               |     Recommended |                                    |
| Card photo/document           |        Optional |                                    |
| Eligibility status            |             Yes | Active, inactive, pending, expired |
| Last verified date            |             Yes |                                    |
| Verification method           |             Yes | Portal/API/manual                  |
| Notes                         |        Optional |                                    |

### Benefit scheme rules

| Rule                 | System behaviour                                                       |
| -------------------- | ---------------------------------------------------------------------- |
| Scheme expired       | Block new claims                                                       |
| Contract expired     | Block or warn based on configuration                                   |
| Patient not eligible | Require cash payment or override                                       |
| Service excluded     | Move to patient-pay or block claim                                     |
| Limit exceeded       | Alert billing and patient                                              |
| Co-pay required      | Calculate patient portion                                              |
| Pre-auth required    | Block claim until approved                                             |
| Referral required    | Require referral attachment                                            |
| Scheme capitation    | Record encounter but do not create normal receivable unless configured |
| Payer tariff missing | Block claim pricing                                                    |

---

## B. Pre-authorisation (request and workflow)

Pre-authorisation is a formal permission workflow before selected services are provided or claimed.

### Pre-authorisation request fields

| Field                                 |     Required? | Notes                                                                               |
| ------------------------------------- | ------------: | ----------------------------------------------------------------------------------- |
| Pre-auth request number               |           Yes | Internal                                                                            |
| Payer                                 |           Yes | SHA/insurer/employer                                                                |
| Scheme                                |           Yes |                                                                                     |
| Patient/member                        |           Yes |                                                                                     |
| Facility/provider code                |           Yes |                                                                                     |
| Requesting clinician                  |           Yes |                                                                                     |
| Diagnosis                             |           Yes | ICD-10-ready                                                                        |
| Requested service/procedure/test/drug |           Yes |                                                                                     |
| Clinical justification                |           Yes |                                                                                     |
| Estimated cost                        |           Yes | From tariff                                                                         |
| Requested quantity/days               | If applicable |                                                                                     |
| Attachments                           | Based on rule | Notes, lab, imaging, referral                                                       |
| Urgency                               |           Yes | Routine/urgent/emergency                                                            |
| Submitted by                          |           Yes |                                                                                     |
| Submitted date/time                   |           Yes |                                                                                     |
| Submission channel                    |           Yes | Portal/API/email/manual                                                             |
| External reference number             |   Recommended | Payer reference                                                                     |
| Status                                |           Yes | Draft, submitted, pending, approved, partially approved, denied, expired, cancelled |

### Pre-authorisation approval fields

| Field                   | Notes                      |
| ----------------------- | -------------------------- |
| Approval number         | Payer-provided             |
| Approved service        | May differ from requested  |
| Approved amount         | Amount limit               |
| Approved quantity       | Quantity/session/day limit |
| Approved facility       | If restricted              |
| Valid from              | Start date                 |
| Valid to                | Expiry                     |
| Conditions              | Payer notes                |
| Denial/partial reason   | If not fully approved      |
| Approved by payer       | Name/reference             |
| Approval document       | Upload                     |
| Patient co-pay          | If applicable              |
| Balance patient portion | Auto                       |

### Pre-authorisation rules

| Rule                                 | System behaviour                                       |
| ------------------------------------ | ------------------------------------------------------ |
| Service requires pre-auth            | Block claim submission until approval captured         |
| Pre-auth expired                     | Require renewal or patient-pay                         |
| Approved amount lower than estimated | Split balance to patient/pending approval              |
| Service changed                      | Require pre-auth amendment                             |
| Emergency case                       | Allow emergency override with reason and documentation |
| Approval number missing              | Mark claim not ready                                   |
| Pre-auth not linked to visit         | Block claim bundle                                     |
| Pre-auth quantity exceeded           | Warn/block extra claim lines                           |
| Payer decision overdue               | Show SLA alert                                         |

### Pre-auth statuses

```text
Draft
Submitted
Acknowledged
Pending review
More information required
Approved
Partially approved
Denied
Expired
Cancelled
Used
Closed
```

---

## C. Tariff table

Tariff tables determine how much a payer pays for each service, item, drug, test, or procedure.

### Tariff table types

| Tariff type            | Use                                   |
| ---------------------- | ------------------------------------- |
| SHA national tariff    | SHA claims                            |
| Private insurer tariff | Contracted insurer rates              |
| Employer tariff        | Corporate/employer rates              |
| Facility cash tariff   | Self-pay pricing                      |
| Capitation tariff      | Included/not separately billable      |
| Package tariff         | Bundled consultation + lab/procedure  |
| Drug formulary tariff  | Medicine reimbursement rules          |
| Procedure tariff       | Minor/major procedure prices          |
| Lab tariff             | Test reimbursement                    |
| Branch-specific tariff | Different facility branches/contracts |

### Tariff header fields

| Field           |   Required? | Notes                    |
| --------------- | ----------: | ------------------------ |
| Tariff name     |         Yes | Example: SHA Tariff 2025 |
| Payer           |         Yes |                          |
| Scheme          |    Optional | If scheme-specific       |
| Version         |         Yes | 2025-v1, insurer-2026-v2 |
| Effective from  |         Yes |                          |
| Effective to    |    Optional |                          |
| Source document | Recommended | Upload tariff/contract   |
| Currency        |         Yes | KES                      |
| Status          |         Yes | Draft, active, expired   |
| Approved by     |         Yes | Internal approval        |
| Notes           |    Optional |                          |

### Tariff line fields

| Field                      | Required? | Notes                              |
| -------------------------- | --------: | ---------------------------------- |
| Tariff code                |       Yes | Payer/service code                 |
| Internal item/service code |       Yes | Link to product/service/test       |
| Service category           |       Yes | Consultation, lab, drug, procedure |
| Description                |       Yes |                                    |
| Facility level/scope       |  Optional | Level/specialty restrictions       |
| Unit of measure            |       Yes | Visit, test, tablet, pack, day     |
| Allowed quantity           |  Optional | Maximum quantity                   |
| Unit tariff                |       Yes |                                    |
| Patient co-pay             |  Optional | Fixed or %                         |
| Payer portion              |      Auto |                                    |
| Requires pre-auth          |    Yes/no |                                    |
| Requires referral          |    Yes/no |                                    |
| Requires attachment        |    Yes/no |                                    |
| Covered diagnosis rules    |  Optional |                                    |
| Exclusion flag             |    Yes/no |                                    |
| Effective from/to          |       Yes | Line-specific versioning           |
| Status                     |       Yes | Active/inactive                    |

### Tariff rules

| Rule                   | System behaviour                                       |
| ---------------------- | ------------------------------------------------------ |
| No active tariff       | Claim line not ready                                   |
| Service not covered    | Patient-pay or block claim                             |
| Facility not eligible  | Block claim                                            |
| Quantity exceeds limit | Split extra quantity to patient-pay or pre-auth        |
| Pre-auth required      | Block without approval                                 |
| Referral required      | Require referral document                              |
| Drug not on formulary  | Patient-pay or exception request                       |
| Tariff changed         | New claims use new tariff; old claims retain old price |
| Package tariff         | Prevent duplicate billing of included services         |
| Capitated service      | Mark as included, not receivable unless configured     |

---

## D. Claim bundle

A claim bundle is the complete evidence packet submitted to the payer.

### Claim bundle contents

| Bundle section             | Data source                     |
| -------------------------- | ------------------------------- |
| Patient/member details     | Registration, scheme membership |
| Provider/facility details  | Module 1                        |
| Visit/encounter details    | EMR                             |
| Clinician details          | Module 1 + EMR                  |
| Diagnosis                  | EMR                             |
| Services rendered          | Billing/EMR/lab/pharmacy        |
| Lab results                | Lab-lite                        |
| Prescriptions              | EMR/pharmacy                    |
| Dispensed drugs            | Pharmacy                        |
| Procedures                 | EMR/procedure notes             |
| Invoices/receipts          | POS/billing                     |
| Pre-authorisation          | Claims module                   |
| Referral/discharge summary | EMR                             |
| Attachments                | Documents module                |
| Tariff/pricing             | Tariff table                    |
| Co-pay/patient payment     | Billing                         |
| Claim form                 | Generated                       |

### Claim header fields

| Field                       |      Required? |
| --------------------------- | -------------: |
| Claim number                |            Yes |
| External payer claim number | When available |
| Payer                       |            Yes |
| Scheme                      |            Yes |
| Patient/member              |            Yes |
| Facility/provider code      |            Yes |
| Branch                      |            Yes |
| Visit/admission number      |            Yes |
| Claim type                  |            Yes |
| Encounter start/end         |            Yes |
| Primary diagnosis           |            Yes |
| Claim amount                |            Yes |
| Patient portion             |            Yes |
| Payer portion               |            Yes |
| Submitted amount            |            Yes |
| Claim status                |            Yes |
| Submitted by                |            Yes |
| Submitted date              | When submitted |
| Submission channel          |            Yes |
| Deadline date               |    Recommended |

### Claim line fields

| Field                          |            Required? |
| ------------------------------ | -------------------: |
| Claim line number              |                  Yes |
| Service/item/test/drug         |                  Yes |
| Internal code                  |                  Yes |
| Payer tariff code              |                  Yes |
| Date of service                |                  Yes |
| Quantity                       |                  Yes |
| Unit price/tariff              |                  Yes |
| Gross amount                   |                  Yes |
| Co-pay                         |        If applicable |
| Patient portion                |                  Yes |
| Payer portion                  |                  Yes |
| Diagnosis link                 | Recommended/required |
| Order/result/prescription link |     Where applicable |
| Pre-auth link                  |          If required |
| Attachment required flag       |                 Auto |
| Status                         |                  Yes |

### Claim status lifecycle

```text
Draft
Missing information
Ready for validation
Validation failed
Ready to submit
Submitted
Acknowledged
Under review
Returned for correction
Rejected
Approved
Partially approved
Paid
Partially paid
Reconciled
Written off
Closed
```

### Claim validation checks

| Check                           | Why                                  |
| ------------------------------- | ------------------------------------ |
| Active contract                 | Facility must be eligible            |
| Patient eligible                | Member/beneficiary cover active      |
| Diagnosis present               | Clinical justification               |
| ICD-10 code present             | Claims/reporting                     |
| Clinician signed note           | Proof service was provided           |
| Service covered                 | Avoid denial                         |
| Tariff mapped                   | Correct pricing                      |
| Pre-auth present                | Required for specified services      |
| Referral present                | Required for referral-based benefits |
| Lab result verified             | Proof test was performed             |
| Prescription and dispense match | Proof medicine supplied              |
| Invoice exists                  | Financial evidence                   |
| Attachment exists               | Documentation                        |
| No duplicate claim              | Fraud prevention                     |
| Within deadline                 | Avoid late denial                    |
| Quantity within limit           | Avoid overclaim                      |
| Facility scope valid            | Avoid out-of-scope denial            |

### Claim fraud prevention rules

SHA regulations allow termination of a contract where a provider bills for unnecessary services, services not covered within the facility’s level of care, services outside professional scope, services or medicine not provided, falsifies or alters information with intent to defraud, or submits separate claims for the same service. The system should therefore treat these as hard validation and audit controls, not just reports. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402024-03-08))

| Fraud risk                     | System control                              |
| ------------------------------ | ------------------------------------------- |
| Claiming service not provided  | Require EMR/order/result/procedure evidence |
| Claiming medicine not supplied | Require dispense record                     |
| Duplicate claim                | Duplicate detector by patient/date/service  |
| Out-of-scope service           | Facility/service scope rule                 |
| Falsified edited data          | Immutable audit trail and addendum model    |
| Split duplicate claims         | Claim-line duplicate rules                  |
| Upcoding                       | Diagnosis-service consistency checks        |
| Billing after contract expiry  | Contract status block                       |

---

## E. Denial management

Denial management is where many clinics lose money. The system must track every rejection and whether it is recoverable.

### Denial types

| Denial type              | Example                                  |
| ------------------------ | ---------------------------------------- |
| Eligibility denial       | Member inactive                          |
| Authorization denial     | Pre-auth missing/expired                 |
| Benefit denial           | Service not covered                      |
| Limit denial             | Benefit exhausted                        |
| Documentation denial     | Missing lab result/referral/prescription |
| Coding denial            | Wrong diagnosis/service code             |
| Tariff denial            | Wrong price/code                         |
| Duplicate denial         | Already claimed                          |
| Timeliness denial        | Submitted late                           |
| Medical necessity denial | Insufficient clinical justification      |
| Facility-scope denial    | Facility not authorized for service      |
| Provider-scope denial    | Clinician not authorized/signed          |
| Technical denial         | Portal/API format error                  |
| Partial denial           | Some lines approved, others rejected     |

### Denial fields

| Field                    |                                                   Required? |
| ------------------------ | ----------------------------------------------------------: |
| Denial ID                |                                                         Yes |
| Claim ID                 |                                                         Yes |
| Claim line ID            |                           Optional/required for line denial |
| Payer denial code        |                                                 Recommended |
| Internal denial category |                                                         Yes |
| Denial reason text       |                                                         Yes |
| Denial date              |                                                         Yes |
| Received by              |                                                         Yes |
| Recoverable?             |                                                      Yes/no |
| Responsible department   |                   Billing, clinician, lab, pharmacy, claims |
| Required correction      |                                                         Yes |
| Correction deadline      |                                                 Recommended |
| Resubmission allowed     |                                                      Yes/no |
| Amount denied            |                                                         Yes |
| Patient billable?        |                                               Yes/no/policy |
| Write-off amount         |                                            If unrecoverable |
| Status                   | Open, corrected, resubmitted, accepted, written off, closed |

### Denial workflow

```text
1. Payer returns/rejects claim
2. Claims officer records denial reason
3. System classifies denial
4. Task assigned to responsible department
5. Missing/corrected document or data is added
6. Claim is resubmitted
7. Payer response is tracked
8. If unrecoverable, amount is written off or moved to patient balance
9. Denial analytics update
```

### Denial rules

| Rule                            | System behaviour                                         |
| ------------------------------- | -------------------------------------------------------- |
| Denial reason missing           | Cannot close denial                                      |
| Recoverable denial              | Create resubmission task                                 |
| Clinician documentation missing | Task clinician/medical records                           |
| Lab result missing              | Task lab                                                 |
| Prescription/dispense mismatch  | Task pharmacy                                            |
| Tariff error                    | Task billing/claims                                      |
| Non-covered service             | Move to patient balance only if policy and consent allow |
| Late claim                      | Manager approval for write-off                           |
| Repeated denial reason          | Show process improvement alert                           |

---

## F. Reconciliation

Reconciliation answers:

```text
What did we claim?
What did payer approve?
What did payer pay?
What did patient pay?
What remains outstanding?
What must be written off or billed to patient?
```

### Reconciliation sources

| Source                      | Data                          |
| --------------------------- | ----------------------------- |
| Claim submission            | Claimed amount                |
| Payer approval/remittance   | Approved amount               |
| Bank/M-Pesa/payment receipt | Paid amount                   |
| Patient receipt             | Co-pay/self-pay               |
| Credit notes                | Reversed claim/patient amount |
| Denial records              | Unpaid/rejected amount        |
| Write-off approval          | Unrecoverable amount          |
| Accounts receivable         | Outstanding balance           |

### Reconciliation fields

| Field                       |                                           Required? |
| --------------------------- | --------------------------------------------------: |
| Reconciliation batch number |                                                 Yes |
| Payer                       |                                                 Yes |
| Remittance advice number    |                                         Recommended |
| Payment date                |                                                 Yes |
| Bank reference              |                                                 Yes |
| Total paid                  |                                                 Yes |
| Claims included             |                                                 Yes |
| Claim amount                |                                                Auto |
| Approved amount             |                                                 Yes |
| Paid amount                 |                                                 Yes |
| Difference                  |                                                Auto |
| Withheld amount             |                                            Optional |
| Denied amount               |                                                Auto |
| Patient balance             |                                                Auto |
| Write-off amount            |                                         If approved |
| Posted to accounting        |                                              Yes/no |
| Reconciled by               |                                                 Yes |
| Reconciled date             |                                                 Yes |
| Status                      | Draft, matched, partially matched, disputed, posted |

### Reconciliation outcomes

| Outcome         | Meaning                       |
| --------------- | ----------------------------- |
| Fully paid      | Claimed/approved/paid matches |
| Partially paid  | Some amount unpaid            |
| Overpaid        | Payer paid more than expected |
| Underpaid       | Payer paid less than approved |
| Denied          | Not paid due to rejection     |
| Adjusted        | Payer changed amount          |
| Patient balance | Amount transferred to patient |
| Written off     | Facility absorbs loss         |
| Disputed        | Follow-up with payer needed   |

### Reconciliation rules

| Rule                             | System behaviour                                          |
| -------------------------------- | --------------------------------------------------------- |
| Paid amount lower than approved  | Create underpayment dispute                               |
| Paid amount higher than approved | Flag overpayment                                          |
| Claim rejected                   | Remove from expected payer receivable or keep as disputed |
| Patient co-pay unpaid            | Create patient receivable                                 |
| Denied non-covered service       | Move to patient balance only if policy allows             |
| Claim paid                       | Lock core claim fields                                    |
| Payment cannot be matched        | Keep in suspense account                                  |
| Remittance imported              | Auto-match by claim number/member/date/amount             |

---

## G. Attachments

Attachments are critical because many claims fail due to missing documentation.

### Attachment types

| Attachment                 | Source                               |
| -------------------------- | ------------------------------------ |
| Signed clinical note       | EMR                                  |
| Visit summary              | EMR                                  |
| Lab result                 | Lab-lite                             |
| Prescription               | EMR/pharmacy                         |
| Dispense record            | Pharmacy                             |
| Referral letter            | EMR                                  |
| Discharge summary          | EMR/inpatient module/facility upload |
| Procedure note             | EMR                                  |
| Imaging report             | EMR/external upload                  |
| Pre-authorisation approval | Claims module                        |
| Invoice/eTIMS receipt      | Billing                              |
| Patient ID/card            | Registration                         |
| Consent form               | EMR/documents                        |
| External lab report        | Lab-lite                             |
| Sick-off/certificate       | EMR                                  |
| Claim form                 | Generated PDF                        |
| Medical report             | Clinician-generated                  |
| Accident/emergency notes   | EMR                                  |

### Attachment rule setup

| Rule field                 | Example                            |
| -------------------------- | ---------------------------------- |
| Payer                      | SHA/private insurer                |
| Scheme                     | Corporate outpatient               |
| Service category           | Lab/procedure/drug/referral        |
| Attachment required        | Yes/no                             |
| Attachment type            | Lab result, referral, prescription |
| Required before submission | Yes                                |
| Required after denial only | Optional                           |
| File format                | PDF/JPEG/PNG                       |
| Max file size              | Configurable                       |
| Source module              | EMR/lab/pharmacy/billing           |
| Sensitive flag             | Yes/no                             |

### Attachment rules

| Rule                               | System behaviour                         |
| ---------------------------------- | ---------------------------------------- |
| Lab claim                          | Require verified lab result              |
| Drug claim                         | Require prescription and dispense record |
| Referral service                   | Require referral letter                  |
| Procedure claim                    | Require procedure note                   |
| Pre-auth service                   | Require approval document/reference      |
| Discharge-related claim            | Require discharge summary                |
| Missing attachment                 | Claim not ready                          |
| Attachment edited after submission | Create new version and resubmission flag |
| Sensitive attachment               | Restrict access and sharing              |
| Reprint/export                     | Log user and reason                      |

---

## 7. Required screens

## Screen 1: Payer and scheme setup

Sections:

| Section          | Contents                             |
| ---------------- | ------------------------------------ |
| Payer profile    | Name, type, contact, portal/API      |
| Scheme details   | Code, contract, branch, dates        |
| Benefits         | Covered services, exclusions, limits |
| Co-pay rules     | Fixed/percentage/none                |
| Pre-auth rules   | Services requiring approval          |
| Tariffs          | Linked tariff table                  |
| Attachment rules | Required documents                   |
| Submission rules | Portal/API/email/deadline            |
| Status           | Active/suspended/expired             |

---

## Screen 2: Member eligibility screen

Search by:

| Search key            |
| --------------------- |
| Patient number        |
| SHA number            |
| Member number         |
| National ID           |
| Phone                 |
| Policy number         |
| Employer staff number |

Shows:

```text
Patient
Payer
Scheme
Eligibility status
Cover start/end
Dependants
Available limits
Co-pay
Pre-auth requirements
Last verification
```

Actions:

```text
Verify eligibility
Attach card/document
Change payer
Mark cash/self-pay
Start pre-authorisation
```

---

## Screen 3: Pre-authorisation screen

Sections:

| Section                | Contents                      |
| ---------------------- | ----------------------------- |
| Beneficiary            | Patient/member                |
| Provider               | Facility/provider code        |
| Service requested      | Procedure/test/drug/admission |
| Diagnosis              | ICD-10-ready                  |
| Clinical justification | Notes                         |
| Estimated cost         | From tariff                   |
| Attachments            | Lab, referral, imaging, notes |
| Submission             | Portal/API/email/manual       |
| Decision               | Approved/denied/partial       |
| Limits                 | Amount, quantity, validity    |
| Status                 | Pending/approved/expired      |

---

## Screen 4: Tariff table screen

Features:

| Feature                     |
| --------------------------- |
| Import tariff CSV/Excel     |
| Manual tariff entry         |
| Version management          |
| Service mapping             |
| Drug formulary mapping      |
| Lab tariff mapping          |
| Procedure tariff mapping    |
| Effective dates             |
| Payer/scheme-specific rates |
| Facility-level restrictions |
| Approval workflow           |

---

## Screen 5: Claim workbench

This is the main claims officer screen.

Filters:

| Filter              |
| ------------------- |
| Draft               |
| Missing information |
| Ready to submit     |
| Submitted           |
| Returned            |
| Rejected            |
| Approved            |
| Paid                |
| Overdue             |
| Payer               |
| Branch              |
| Clinician           |
| Date range          |
| Claim type          |
| Denial reason       |

Columns:

| Column           |
| ---------------- |
| Claim number     |
| Patient          |
| Payer            |
| Visit date       |
| Diagnosis        |
| Claimed amount   |
| Patient portion  |
| Payer portion    |
| Missing items    |
| Status           |
| Days outstanding |
| Assigned user    |

---

## Screen 6: Claim bundle viewer

Sections:

| Section            | Contents                             |
| ------------------ | ------------------------------------ |
| Patient/member     | Identity, eligibility                |
| Provider           | Facility, provider code, clinician   |
| Visit              | Encounter dates and service type     |
| Diagnosis          | Primary/secondary ICD-10             |
| Claim lines        | Consultation, lab, drugs, procedures |
| Tariffs            | Expected payer amount                |
| Pre-auth           | Approval details                     |
| Attachments        | Required and uploaded documents      |
| Validation         | Errors/warnings                      |
| Submission history | Portal/API/email/manual              |
| Audit              | Edits and approvals                  |

---

## Screen 7: Denial management screen

Sections:

| Section           | Contents                                          |
| ----------------- | ------------------------------------------------- |
| Denied claim      | Claim and line                                    |
| Payer reason      | Code/text                                         |
| Internal category | Eligibility, authorization, documentation, coding |
| Amount denied     | Value                                             |
| Responsible party | Clinician/lab/pharmacy/billing/claims             |
| Correction task   | Required action                                   |
| Deadline          | Resubmission deadline                             |
| Resubmission      | New submission reference                          |
| Outcome           | Paid/written off/patient balance                  |

---

## Screen 8: Reconciliation screen

Sections:

| Section                | Contents                    |
| ---------------------- | --------------------------- |
| Payer remittance       | Payment batch               |
| Bank/payment reference | Amount received             |
| Claims paid            | Matched claims              |
| Differences            | Under/over payments         |
| Denials                | Unpaid claims               |
| Patient balances       | Co-pay or uncovered balance |
| Write-offs             | Approved losses             |
| Posting                | Accounting status           |

---

## Screen 9: Claim ageing dashboard

Cards:

```text
Total claims submitted
Claims pending submission
Claims awaiting payer response
Claims returned for correction
Claims rejected
Claims approved not paid
Claims paid
Claims overdue
Value outstanding
Denial rate
Average days to payment
Top denial reasons
```

---

## 8. Workflows

## A. Basic outpatient insured visit

```text
1. Patient is registered or selected
2. Payer and scheme are selected
3. Eligibility is verified
4. Co-pay and cover rules are displayed
5. Patient enters consultation queue
6. Clinician documents note and diagnosis
7. Lab/procedure/prescription orders are created where needed
8. Billing applies tariff and patient/payer split
9. Required services are performed and documented
10. Claim bundle is generated
11. Claims officer validates bundle
12. Claim is submitted
13. Payer response is tracked
14. Payment is reconciled
```

---

## B. Service requiring pre-authorisation

```text
1. Clinician orders service requiring pre-auth
2. System detects pre-auth rule
3. Pre-auth request is created
4. Diagnosis, justification, estimated cost, and documents are attached
5. Request is submitted to payer/SHA
6. Decision is captured
7. If approved, service proceeds within approved limits
8. If partially approved, patient balance or amendment is created
9. If denied, service is blocked or converted to cash/self-pay
10. Claim later references the approval number
```

---

## C. Lab claim workflow

```text
1. Clinician orders lab test
2. Billing applies payer tariff
3. Patient co-pay is collected if required
4. Lab collects sample and enters result
5. Lab verifies result
6. Claim bundle pulls verified result automatically
7. Claim validation confirms result attachment exists
8. Claim is submitted
```

---

## D. Drug claim workflow

```text
1. Clinician prescribes medicine
2. Pharmacy reviews and dispenses actual medicine
3. Substitution or partial dispense is captured where applicable
4. Billing applies drug tariff/formulary
5. Claim bundle includes prescription and dispense record
6. Claim amount reflects actual quantity supplied
7. Claim is submitted
```

---

## E. Denial and resubmission workflow

```text
1. Payer rejects or returns claim
2. Claims officer records denial reason
3. System classifies denial
4. Task is assigned to responsible department
5. Missing/corrected evidence is added
6. Claim is resubmitted
7. Resubmission result is tracked
8. If paid, reconciliation closes it
9. If unrecoverable, write-off or patient-balance workflow starts
```

---

## F. Reconciliation workflow

```text
1. Payer sends remittance/payment
2. Accountant imports or enters payment batch
3. System matches payment to claims
4. Approved amount, paid amount, denied amount, and patient balance are calculated
5. Differences are flagged
6. Underpayments become disputes
7. Denials become denial tasks
8. Patient balances move to receivables
9. Matched payments are posted to accounting
10. Claims are marked reconciled
```

---

## G. Capitation workflow

```text
1. Scheme is configured as capitation
2. Patient eligibility is verified
3. Visit is recorded as covered under capitation
4. Services are marked as included unless excluded
5. Claim/encounter report is generated for utilization
6. No normal fee-for-service receivable is created unless service is outside capitation
7. Utilization and cost are monitored
```

---

## 9. Rules engine

## Eligibility

```text
RULE: Patient eligible
IF member.status = active
AND scheme.status = active
AND contract.status = active
AND visit_date BETWEEN cover_start AND cover_end
THEN allow insured billing
ELSE route to cash/self-pay or require override
```

## Benefit coverage

```text
RULE: Covered service
IF service IN scheme.covered_services
AND service NOT IN scheme.exclusions
AND facility.scope_allows_service = true
THEN allow payer pricing
ELSE mark patient-pay or block claim
```

## Pre-authorisation

```text
RULE: Pre-authorisation required
IF tariff_line.requires_preauth = true
THEN preauth.status must be approved
AND preauth.valid_until >= service_date
AND claimed_amount <= approved_amount
ELSE claim line not ready
```

## Tariff pricing

```text
RULE: Apply tariff
IF active_tariff_line exists for payer, scheme, service, date
THEN claim_line.unit_price = tariff_line.amount
ELSE claim_line.status = missing_tariff
```

## Claim readiness

```text
RULE: Claim ready
IF patient_eligibility_verified = true
AND diagnosis.primary exists
AND clinician_note.signed = true
AND all claim_lines have tariffs
AND all required attachments are present
AND no duplicate claim detected
THEN claim.status = ready_to_submit
ELSE claim.status = missing_information
```

## Lab attachment

```text
RULE: Lab claim evidence
IF claim_line.category = lab
THEN verified_lab_result must exist
ELSE block submission
```

## Drug attachment

```text
RULE: Drug claim evidence
IF claim_line.category = drug
THEN prescription exists
AND dispense_record exists
AND quantity_claimed <= quantity_dispensed
ELSE block submission
```

## Duplicate claim

```text
RULE: Duplicate detection
IF same payer + member + service_code + service_date + provider_code already submitted
THEN flag duplicate
AND require manager approval or correction
```

## Denial closure

```text
RULE: Close denial
IF denial.status = open
THEN require resolution_type IN [resubmitted, accepted, written_off, patient_billed, payer_dispute]
AND resolution_note is required
```

## Reconciliation

```text
RULE: Reconcile claim
IF paid_amount = approved_amount
THEN claim.status = reconciled
ELSE create variance record
```

---

## 10. Data model

## Main tables

### `payers`

| Field                   |
| ----------------------- |
| id                      |
| payer_name              |
| payer_type              |
| regulator_reference     |
| contact_person          |
| phone                   |
| email                   |
| portal_url              |
| api_endpoint            |
| claim_submission_method |
| status                  |
| created_at              |

### `benefit_schemes`

| Field                 |
| --------------------- |
| id                    |
| payer_id              |
| scheme_code           |
| scheme_name           |
| scheme_type           |
| contract_id           |
| branch_id             |
| provider_code         |
| effective_from        |
| effective_to          |
| covered_services_json |
| exclusions_json       |
| benefit_limits_json   |
| copay_rules_json      |
| preauth_rules_json    |
| claim_deadline_days   |
| status                |

### `scheme_members`

| Field                     |
| ------------------------- |
| id                        |
| patient_id                |
| payer_id                  |
| scheme_id                 |
| member_number             |
| policy_number             |
| sha_number                |
| principal_member_name     |
| principal_member_number   |
| relationship_to_principal |
| cover_start_date          |
| cover_end_date            |
| eligibility_status        |
| last_verified_at          |
| verification_method       |
| verification_reference    |
| status                    |

### `tariff_tables`

| Field              |
| ------------------ |
| id                 |
| payer_id           |
| scheme_id          |
| tariff_name        |
| version            |
| effective_from     |
| effective_to       |
| source_document_id |
| currency           |
| status             |
| approved_by        |
| approved_at        |

### `tariff_lines`

| Field                        |
| ---------------------------- |
| id                           |
| tariff_table_id              |
| tariff_code                  |
| internal_item_type           |
| internal_item_id             |
| service_category             |
| description                  |
| facility_level_rule          |
| unit_of_measure              |
| allowed_quantity             |
| unit_tariff                  |
| copay_type                   |
| copay_value                  |
| requires_preauth             |
| requires_referral            |
| required_attachments_json    |
| covered_diagnosis_rules_json |
| exclusion_flag               |
| effective_from               |
| effective_to                 |
| status                       |

### `preauthorisations`

| Field                   |
| ----------------------- |
| id                      |
| preauth_number          |
| payer_id                |
| scheme_id               |
| patient_id              |
| member_id               |
| visit_id                |
| provider_code           |
| requesting_clinician_id |
| diagnosis_id            |
| requested_service_type  |
| requested_service_id    |
| clinical_justification  |
| estimated_amount        |
| requested_quantity      |
| urgency                 |
| submission_channel      |
| external_reference      |
| submitted_by            |
| submitted_at            |
| status                  |
| decision_at             |
| decision_by_payer       |
| approval_number         |
| approved_amount         |
| approved_quantity       |
| valid_from              |
| valid_to                |
| denial_reason           |
| conditions              |
| document_id             |

### `claims`

| Field                 |
| --------------------- |
| id                    |
| claim_number          |
| external_claim_number |
| payer_id              |
| scheme_id             |
| patient_id            |
| member_id             |
| branch_id             |
| visit_id              |
| provider_code         |
| claim_type            |
| encounter_start       |
| encounter_end         |
| primary_diagnosis_id  |
| total_claimed_amount  |
| total_patient_portion |
| total_payer_portion   |
| total_approved_amount |
| total_paid_amount     |
| status                |
| submission_channel    |
| submitted_by          |
| submitted_at          |
| acknowledged_at       |
| deadline_date         |
| validation_status     |
| created_at            |

### `claim_lines`

| Field              |
| ------------------ |
| id                 |
| claim_id           |
| line_number        |
| service_category   |
| internal_item_type |
| internal_item_id   |
| tariff_line_id     |
| payer_tariff_code  |
| service_date       |
| quantity           |
| unit_price         |
| gross_amount       |
| copay_amount       |
| patient_portion    |
| payer_portion      |
| approved_amount    |
| paid_amount        |
| diagnosis_id       |
| preauth_id         |
| source_module      |
| source_record_id   |
| status             |
| denial_id          |

### `claim_attachments`

| Field            |
| ---------------- |
| id               |
| claim_id         |
| claim_line_id    |
| attachment_type  |
| source_module    |
| source_record_id |
| document_id      |
| required_flag    |
| uploaded_by      |
| uploaded_at      |
| status           |

### `claim_submissions`

| Field                |
| -------------------- |
| id                   |
| claim_id             |
| submission_number    |
| submission_channel   |
| external_reference   |
| payload_json         |
| submitted_by         |
| submitted_at         |
| response_status      |
| response_message     |
| response_document_id |
| status               |

### `claim_denials`

| Field                  |
| ---------------------- |
| id                     |
| claim_id               |
| claim_line_id          |
| payer_denial_code      |
| denial_category        |
| denial_reason_text     |
| denial_date            |
| amount_denied          |
| recoverable_flag       |
| responsible_department |
| required_correction    |
| correction_deadline    |
| resubmission_allowed   |
| patient_billable_flag  |
| writeoff_amount        |
| status                 |
| created_by             |
| closed_by              |
| closed_at              |
| resolution_type        |
| resolution_notes       |

### `claim_reconciliations`

| Field                       |
| --------------------------- |
| id                          |
| reconciliation_batch_number |
| payer_id                    |
| scheme_id                   |
| remittance_number           |
| payment_date                |
| bank_reference              |
| total_paid                  |
| total_claimed               |
| total_approved              |
| total_denied                |
| total_writeoff              |
| total_patient_balance       |
| status                      |
| reconciled_by               |
| reconciled_at               |
| posted_to_accounting        |
| posted_at                   |

### `claim_reconciliation_lines`

| Field             |
| ----------------- |
| id                |
| reconciliation_id |
| claim_id          |
| claim_line_id     |
| claimed_amount    |
| approved_amount   |
| paid_amount       |
| denied_amount     |
| variance_amount   |
| patient_balance   |
| writeoff_amount   |
| status            |
| notes             |

### `claim_audit_logs`

| Field          |
| -------------- |
| id             |
| entity_type    |
| entity_id      |
| claim_id       |
| action         |
| old_value_json |
| new_value_json |
| reason         |
| performed_by   |
| approved_by    |
| branch_id      |
| created_at     |

---

## 11. API design

## Payer and scheme endpoints

| Endpoint                           | Purpose                  |
| ---------------------------------- | ------------------------ |
| `POST /payers`                     | Create payer             |
| `GET /payers/search`               | Search payers            |
| `POST /benefit-schemes`            | Create scheme            |
| `PATCH /benefit-schemes/{id}`      | Update scheme            |
| `POST /scheme-members`             | Add member/patient cover |
| `POST /scheme-members/{id}/verify` | Verify eligibility       |

## Tariff endpoints

| Endpoint                           | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `POST /tariff-tables`              | Create tariff table             |
| `POST /tariff-tables/{id}/import`  | Import CSV/Excel tariff         |
| `POST /tariff-tables/{id}/approve` | Approve tariff                  |
| `POST /tariff-lines`               | Add tariff line                 |
| `GET /tariffs/lookup`              | Find active tariff for service  |
| `POST /tariffs/map-service`        | Map internal item to payer code |

## Pre-authorisation endpoints

| Endpoint                                | Purpose                     |
| --------------------------------------- | --------------------------- |
| `POST /preauthorisations`               | Create request              |
| `POST /preauthorisations/{id}/submit`   | Submit to payer             |
| `POST /preauthorisations/{id}/decision` | Record decision             |
| `POST /preauthorisations/{id}/attach`   | Attach documents            |
| `GET /preauthorisations/pending`        | Pending approvals           |
| `POST /preauthorisations/{id}/extend`   | Request extension/amendment |

## Claim endpoints

| Endpoint                            | Purpose                   |
| ----------------------------------- | ------------------------- |
| `POST /claims`                      | Create claim              |
| `POST /claims/from-visit/{visitId}` | Generate claim from visit |
| `POST /claims/{id}/validate`        | Run validation            |
| `POST /claims/{id}/submit`          | Submit claim              |
| `POST /claims/{id}/attachments`     | Add attachment            |
| `POST /claims/{id}/return`          | Mark returned             |
| `POST /claims/{id}/approve`         | Record approval           |
| `POST /claims/{id}/reject`          | Record rejection          |
| `POST /claims/{id}/resubmit`        | Resubmit corrected claim  |
| `GET /claims/search`                | Search claims             |
| `GET /claims/{id}/bundle`           | View claim bundle         |

## Denial endpoints

| Endpoint                             | Purpose                 |
| ------------------------------------ | ----------------------- |
| `POST /claim-denials`                | Create denial           |
| `POST /claim-denials/{id}/assign`    | Assign correction task  |
| `POST /claim-denials/{id}/resubmit`  | Resubmit denial         |
| `POST /claim-denials/{id}/write-off` | Write off denied amount |
| `POST /claim-denials/{id}/close`     | Close denial            |
| `GET /claim-denials/report`          | Denial report           |

## Reconciliation endpoints

| Endpoint                                             | Purpose                     |
| ---------------------------------------------------- | --------------------------- |
| `POST /claim-reconciliations`                        | Create reconciliation batch |
| `POST /claim-reconciliations/{id}/import-remittance` | Import payer remittance     |
| `POST /claim-reconciliations/{id}/match`             | Match claims                |
| `POST /claim-reconciliations/{id}/post`              | Post reconciliation         |
| `GET /claim-reconciliations/unmatched`               | Unmatched payments          |
| `GET /claim-reconciliations/ageing`                  | Receivables ageing          |

---

## 12. Integration points

| Integration                  | Purpose                                                         |
| ---------------------------- | --------------------------------------------------------------- |
| Organisation/licensing       | Facility, provider code, contract, professional scope           |
| EMR                          | Clinical note, diagnosis, visit summary, referral, certificates |
| Lab-lite                     | Verified lab results and external lab attachments               |
| Pharmacy                     | Prescription, dispense, batch, actual quantity                  |
| Inventory                    | Consumed items, stock evidence, drug costing                    |
| POS/billing                  | Invoice, co-pay, patient payments, credit notes                 |
| eTIMS                        | Invoice references                                              |
| SHA portal/API               | Eligibility, pre-auth, claim submission, status                 |
| Private insurer portals/APIs | Claim submission/status                                         |
| Accounting                   | Receivables, payments, write-offs, suspense                     |
| Notifications                | Pre-auth decisions, denial tasks, patient balances              |
| Document storage             | Attachments and claim forms                                     |
| Audit/security               | Access, exports, edits, resubmissions                           |

---

## 13. Permissions

| Permission              | Reception | Billing | Clinician | Lab | Pharmacy | Claims officer | Accountant | Manager | Auditor |
| ----------------------- | --------: | ------: | --------: | --: | -------: | -------------: | ---------: | ------: | ------: |
| Add payer/member        |       Yes |     Yes |        No |  No |       No |            Yes |         No |     Yes |    View |
| Verify eligibility      |       Yes |     Yes |        No |  No |       No |            Yes |         No |     Yes |    View |
| Create pre-auth         |   Limited |     Yes |       Yes |  No |       No |            Yes |         No |     Yes |    View |
| Submit pre-auth         |        No | Limited |        No |  No |       No |            Yes |         No |     Yes |    View |
| Configure scheme        |        No |      No |        No |  No |       No |        Limited |         No |     Yes |    View |
| Configure tariff        |        No | Limited |        No |  No |       No |            Yes |        Yes |     Yes |    View |
| Generate claim          |        No |     Yes |        No |  No |       No |            Yes |         No |     Yes |    View |
| Validate claim          |        No |     Yes |        No |  No |       No |            Yes |         No |     Yes |    View |
| Submit claim            |        No |      No |        No |  No |       No |            Yes |         No |     Yes |    View |
| Add clinical attachment |        No |      No |       Yes |  No |       No |            Yes |         No |     Yes |    View |
| Add lab attachment      |        No |      No |        No | Yes |       No |            Yes |         No |     Yes |    View |
| Add pharmacy attachment |        No |      No |        No |  No |      Yes |            Yes |         No |     Yes |    View |
| Record denial           |        No |      No |        No |  No |       No |            Yes |         No |     Yes |    View |
| Write off claim         |        No |      No |        No |  No |       No |        Request |         No |     Yes |    View |
| Reconcile payment       |        No |      No |        No |  No |       No |        Limited |        Yes |     Yes |    View |
| Export claims           |        No |      No |        No |  No |       No |            Yes |        Yes |     Yes |     Yes |
| View audit logs         |        No |      No |        No |  No |       No |        Limited |    Limited |     Yes |     Yes |

---

## 14. Reports

## Claims operations reports

| Report                         | Purpose                                    |
| ------------------------------ | ------------------------------------------ |
| Claims by status               | Draft, submitted, approved, paid, rejected |
| Claims ageing                  | Outstanding by days and payer              |
| Claims by payer                | SHA/private/employer performance           |
| Claims by branch               | Branch performance                         |
| Claims by clinician            | Documentation and claim volume             |
| Claims by service category     | Consultation, lab, drugs, procedure        |
| Claim value report             | Claimed, approved, paid                    |
| Denial report                  | Rejection reasons and amounts              |
| Denial ageing report           | Open denials by days                       |
| Resubmission report            | Recoverable denials                        |
| Pre-auth pending report        | Waiting payer decisions                    |
| Pre-auth expiry report         | Approved but expiring                      |
| Missing attachment report      | Claims blocked by documents                |
| Missing diagnosis report       | Claims blocked by clinical data            |
| Tariff mismatch report         | Pricing issues                             |
| Duplicate claim alert report   | Fraud prevention                           |
| Patient balance report         | Co-pay/uncovered amounts                   |
| Payer remittance report        | Payment batches                            |
| Reconciliation variance report | Under/over payments                        |
| Write-off report               | Lost revenue                               |
| Capitation utilization report  | Cost and service use under capitation      |

## Owner/manager dashboard

```text
Claims submitted today
Claims value this month
Claims approved
Claims paid
Claims rejected
Claims pending correction
Claims overdue
Top denial reasons
Average days to payment
Payer outstanding balances
Patient balances from insurance
Pre-auth pending
Pre-auth expiring
Write-offs this month
```

---

## 15. Quality, fraud, and compliance controls

| Control                       | Requirement                                 |
| ----------------------------- | ------------------------------------------- |
| Duplicate claim detection     | Same member/service/date/provider           |
| Signed note requirement       | Prevent undocumented claims                 |
| Diagnosis-service consistency | Reduce inappropriate claims                 |
| Pre-auth validation           | Prevent unauthorized service claims         |
| Facility-scope validation     | Prevent out-of-scope billing                |
| Clinician-scope validation    | Prevent wrong provider claims               |
| Service-performed evidence    | Lab result, procedure note, dispense record |
| Quantity limits               | Prevent excessive drug/test claims          |
| Immutable submitted claim     | Corrections through version/resubmission    |
| Audit trail                   | All edits, submissions, denials, payments   |
| Attachment versioning         | Preserve original and corrected documents   |
| Payment matching              | Avoid hidden underpayments                  |
| Write-off approval            | Prevent revenue leakage                     |
| Denial analytics              | Fix root causes                             |
| Patient balance rules         | Avoid improper billing after payer denial   |

---

## 16. Edge cases

| Edge case                                           | Correct handling                                                       |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| Patient claims to be insured but eligibility fails  | Route to cash/self-pay or hold visit pending verification              |
| Payer portal is down                                | Mark verification/submission pending and log manual evidence           |
| Patient has two covers                              | Support primary/secondary payer or manual selection                    |
| Service requires pre-auth but was done in emergency | Emergency override with documentation                                  |
| Pre-auth approved after service                     | Link approval and validate date/payer policy                           |
| Approval amount lower than bill                     | Split balance to patient or request extension                          |
| Claim submitted with missing lab result             | Validation should block before submission                              |
| Lab result comes after claim submission             | Submit addendum/resubmission if payer allows                           |
| Payer rejects for wrong tariff                      | Correct tariff and resubmit                                            |
| Payer pays partially                                | Reconcile partial payment and create denial/variance                   |
| Payer overpays                                      | Flag overpayment/suspense                                              |
| Patient paid cash then insurer pays                 | Refund/allocate patient credit according to policy                     |
| Drug substituted                                    | Claim actual dispensed item with substitution note                     |
| Partial dispense                                    | Claim only quantity supplied                                           |
| Payer denies non-covered medicine                   | Move to patient balance only if policy allows and patient was informed |
| Claim deadline missed                               | Manager review and potential write-off                                 |
| Facility contract expires mid-visit                 | Apply date-of-service contract rule                                    |
| Claim edited after submission                       | Create correction version, not silent edit                             |
| Payer requests more information                     | Task relevant department and track deadline                            |
| Fraud suspicion                                     | Freeze claim and escalate to manager/compliance                        |

---

## 17. MVP versus later versions

## MVP

Build these first:

| Feature                     | Reason                                            |
| --------------------------- | ------------------------------------------------- |
| Payer master                | SHA/private/employer setup                        |
| Benefit scheme setup        | Contract, cover, limits, co-pay                   |
| Member/eligibility record   | Patient cover tracking                            |
| Tariff table                | Correct pricing                                   |
| Claim generation from visit | Reduce double entry                               |
| Claim validation checklist  | Prevent rejections                                |
| Pre-authorisation tracking  | Required for selected services                    |
| Claim bundle                | Patient, provider, diagnosis, services, documents |
| Attachment management       | Lab, prescription, referral, summary              |
| Claim submission status     | Follow-up                                         |
| Denial management           | Recover rejected claims                           |
| Reconciliation              | Paid vs claimed vs patient balance                |
| Receivables ageing          | Cashflow visibility                               |
| Audit logs                  | Compliance and fraud control                      |

## Version 2

Add:

| Feature                             | Reason                                     |
| ----------------------------------- | ------------------------------------------ |
| SHA portal/API adapter              | Faster eligibility, pre-auth, claim status |
| Private insurer portal/API adapters | Reduce manual submissions                  |
| Remittance import                   | Faster reconciliation                      |
| Advanced denial analytics           | Reduce repeat rejections                   |
| Automated claim-form generation     | Faster submission                          |
| Tariff import/mapping tools         | Easier payer setup                         |
| Co-insurance/secondary payer        | Complex insurance support                  |
| Capitation analytics                | Monitor utilization and profitability      |
| Patient balance automation          | Convert uncovered amounts to receivables   |
| Pre-auth SLA alerts                 | Avoid delays                               |
| Medical-necessity checklist         | Stronger claim evidence                    |

## Version 3

Add:

| Feature                              | Reason                                         |
| ------------------------------------ | ---------------------------------------------- |
| AI claim validator                   | Detect missing/weak evidence before submission |
| Fraud/waste/abuse analytics          | Detect duplicate/upcoded/unusual claims        |
| Real-time payer eligibility APIs     | Faster reception workflow                      |
| Automated remittance matching        | Accounting efficiency                          |
| Predictive denial risk               | Reduce claim losses                            |
| Multi-payer coordination of benefits | Advanced insurance                             |
| FHIR Claim/ClaimResponse APIs        | Interoperability                               |
| National platform integration        | Digital Health Act/SHA readiness               |
| Contract profitability analytics     | Know which schemes make/lose money             |
| Provider scorecards                  | Clinician documentation quality                |

---

## 18. Acceptance criteria

The Claims and Insurance Module is ready when it passes these tests:

| Test                               | Expected result                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| Create SHA/private/employer scheme | Scheme has payer, contract, branch, benefits, tariff, dates                         |
| Add member                         | Patient is linked to member number and scheme                                       |
| Verify eligibility                 | Eligibility status and verification record saved                                    |
| Apply tariff                       | Consultation/lab/drug/procedure priced by active payer tariff                       |
| Calculate co-pay                   | Patient and payer portions calculated correctly                                     |
| Detect pre-auth need               | Service requiring pre-auth is blocked until approval                                |
| Record pre-auth approval           | Approval number, amount, quantity, validity stored                                  |
| Generate claim from visit          | Claim pulls patient, provider, diagnosis, services, bill lines                      |
| Attach lab result                  | Verified lab result added to claim bundle                                           |
| Attach prescription/dispense       | Medicine evidence added to claim bundle                                             |
| Validate claim                     | Missing diagnosis, unsigned note, missing result, or tariff issue blocks submission |
| Submit claim                       | Submission reference and status captured                                            |
| Record denial                      | Denial reason, amount, responsible department, correction task captured             |
| Resubmit claim                     | Corrected claim version submitted with history                                      |
| Reconcile payment                  | Paid vs claimed vs approved vs patient balance calculated                           |
| Detect underpayment                | Variance/dispute created                                                            |
| Write off denied amount            | Requires approval and audit                                                         |
| Claims dashboard                   | Shows ageing, denials, pending pre-auths, payer balances                            |
| Audit                              | Every claim edit, attachment, submission, denial, resubmission, payment logged      |

---

## 19. Final product behaviour

The Claims and Insurance Module should behave like this:

| Situation                     | Correct behaviour                                          |
| ----------------------------- | ---------------------------------------------------------- |
| Patient has SHA/private cover | Eligibility and benefit rules are checked                  |
| Service has tariff            | Correct payer price is applied                             |
| Co-pay exists                 | Patient portion is billed immediately                      |
| Pre-auth is required          | Request and approval are captured before claim             |
| Clinician documents visit     | Diagnosis and signed note feed the claim                   |
| Lab test is claimed           | Verified lab result is attached                            |
| Medicine is claimed           | Prescription and dispense record are attached              |
| Referral is required          | Referral letter is attached                                |
| Claim is incomplete           | Submission is blocked with clear missing items             |
| Claim is submitted            | Status and payer reference are tracked                     |
| Claim is rejected             | Reason, amount, correction, and resubmission are tracked   |
| Payer pays                    | Payment is matched to claim lines                          |
| Payer underpays               | Variance and dispute are created                           |
| Patient owes balance          | Patient receivable is created if policy allows             |
| Claim is unrecoverable        | Write-off requires approval                                |
| Owner reviews business        | Payer debt, denial rate, and cashflow exposure are visible |

The key design principle is:

**No insured service should be claimed unless the patient is eligible, the provider is contracted, the service is covered, the tariff is correct, the clinical evidence exists, required attachments are present, and the final payment can be reconciled.**

Correct. Module 7 needs a formal **tariff data contract** before the import tool is built.

I would close this as:

```text
ADR-024: Tariff Table Import Format, Versioning, Payer Contract Mapping, and Claims Pricing Strategy
```

Kenya’s current SHA tariff instrument is **Legal Notice 56 of 2025: Tariffs for Healthcare Services, 2025**, published and commenced on **28 February 2025**. Kenya Law also notes that this 2025 notice repeals the earlier 2024 tariff notice. That means the system must treat tariffs as **versioned legal/contractual price schedules**, not as ordinary editable price lists. ([Kenya Law][1])

---

## 1. Architecture decision

Use a **generic tariff engine** with payer-specific import templates.

```text
Canonical internal tariff model:
    payer
    scheme
    contract
    tariff table
    tariff version
    tariff line
    service/item mapping
    effective date range
    access rules
    pre-authorisation rules
    attachment rules
    limits
    co-pay / patient portion
    claim code
```

Then provide import templates for:

```text
1. SHA tariff
2. Private insurer tariff
3. Employer/corporate tariff
4. Drug formulary tariff
5. Lab tariff
6. Procedure tariff
7. Package/bundled tariff
8. Capitation tariff
```

The import tool should **not** be SHA-only. SHA is one payer. Private insurers and employer schemes will vary, so the internal shape must be more general.

---

## 2. Why this matters

SHA regulations state that providers lodge claims for payment of healthcare services, that SHA pays based on prescribed tariffs, and that claims are reviewed and processed through the Centralized Digital Platform. They also require claims to include patient identifiers, clinical details, and the amount claimed. ([Kenya Law][2])

The same regulations say claim processing should be guided by prescribed tariffs and formularies used for benefits-package development, diagnostics mapping, costing, and tariff development. They also provide for pre-authorisation of specified services and require beneficiary, provider/facility, and service details in the pre-authorisation request. ([Kenya Law][2])

So the tariff import format must support more than “service code + price.” It needs:

```text
service identity
payer code
internal service mapping
effective dates
facility/access level
benefit package
pre-authorisation flag
referral flag
attachments
limits
co-pay
claim category
exclusions
versioning
```

---

## 3. Recommended tariff model

## 3.1 Tariff hierarchy

```text
Payer
    ↓
Benefit scheme / contract
    ↓
Tariff table
    ↓
Tariff version
    ↓
Tariff line
    ↓
Mapped internal service/product/lab/procedure/drug/package
```

Example:

```text
Payer: SHA
Scheme: Social Health Insurance Fund
Contract: SHA Contract 2026 - Branch Group A
Tariff table: SHA Tariffs for Healthcare Services
Version: LN56-2025-effective-2025-02-28
Tariff line: Consultation outpatient level 2/3
Internal mapping: SVC-CONS-GP
```

---

## 4. Tariff table data model

## `claims.tariff_tables`

| Field              | Purpose                                     |
| ------------------ | ------------------------------------------- |
| id                 | Internal ID                                 |
| payer_id           | SHA/private insurer/employer                |
| scheme_id          | Benefit scheme                              |
| contract_id        | Contract                                    |
| tariff_table_code  | Example: `SHA-LN56-2025`                    |
| tariff_table_name  | Human-readable name                         |
| tariff_type        | SHA, private, employer, capitation, package |
| source_document_id | Uploaded tariff/contract                    |
| source_reference   | Legal notice / contract / insurer document  |
| currency           | KES                                         |
| status             | draft, active, expired, superseded          |
| created_by         | User                                        |
| created_at         | Timestamp                                   |

---

## `claims.tariff_versions`

| Field           | Purpose                            |
| --------------- | ---------------------------------- |
| id              | Version ID                         |
| tariff_table_id | Parent tariff table                |
| version_code    | `2025.02.28`, `AAR-2026-V1`, etc.  |
| effective_from  | Start date                         |
| effective_to    | End date                           |
| import_batch_id | Link to import                     |
| approved_by     | Approver                           |
| approved_at     | Approval time                      |
| status          | draft, active, superseded, retired |
| notes           | Change notes                       |

---

## `claims.tariff_lines`

| Field                 | Purpose                                                         |
| --------------------- | --------------------------------------------------------------- |
| id                    | Internal line ID                                                |
| tariff_version_id     | Parent version                                                  |
| line_number           | Source line number                                              |
| benefit_fund          | PHC, SHIF, ECCIF, private OPD, corporate OPD                    |
| benefit_package       | Outpatient, inpatient, chronic, maternity, emergency            |
| service_category      | consultation, lab, drug, procedure, imaging, package, admission |
| service_group         | OPD, diagnostics, pharmacy, minor procedure                     |
| payer_service_code    | SHA/insurer tariff code                                         |
| payer_service_name    | Name from tariff source                                         |
| internal_item_type    | service, product, lab_test, procedure, package                  |
| internal_item_id      | Mapped item                                                     |
| internal_item_code    | Internal code                                                   |
| facility_level_min    | Optional                                                        |
| facility_level_max    | Optional                                                        |
| branch_scope          | all/specific                                                    |
| provider_cadre_rule   | Optional                                                        |
| diagnosis_rule        | Optional                                                        |
| age_rule              | Optional                                                        |
| sex_rule              | Optional                                                        |
| unit_of_measure       | visit, test, item, tablet, session, day, package                |
| tariff_amount         | Payer allowed amount                                            |
| patient_copay_type    | none, fixed, percent                                            |
| patient_copay_value   | Amount or percent                                               |
| payer_portion_formula | How payer amount is calculated                                  |
| quantity_min          | Optional                                                        |
| quantity_max          | Optional                                                        |
| frequency_limit       | Optional                                                        |
| limit_period          | visit, day, month, year, benefit_period                         |
| annual_limit_amount   | Optional                                                        |
| requires_preauth      | Yes/no                                                          |
| requires_referral     | Yes/no                                                          |
| requires_diagnosis    | Yes/no                                                          |
| required_attachments  | JSON/list                                                       |
| exclusion_flag        | Yes/no                                                          |
| exclusion_reason      | Optional                                                        |
| claimable_flag        | Yes/no                                                          |
| effective_from        | Line effective start                                            |
| effective_to          | Line effective end                                              |
| status                | draft, active, inactive, mapped, unmapped                       |

---

## 5. Canonical tariff import file

Use a CSV/XLSX import format with one row per tariff line.

## 5.1 Canonical tariff import headers

```csv
tariff_table_code,
tariff_table_name,
version_code,
source_reference,
payer_code,
payer_name,
scheme_code,
scheme_name,
contract_code,
effective_from,
effective_to,
benefit_fund,
benefit_package,
service_category,
service_group,
payer_service_code,
payer_service_name,
payer_service_description,
internal_item_type,
internal_item_code,
facility_level_min,
facility_level_max,
provider_cadre_rule,
diagnosis_rule,
age_min_days,
age_max_days,
sex_rule,
unit_of_measure,
tariff_amount,
currency,
patient_copay_type,
patient_copay_value,
quantity_min,
quantity_max,
frequency_limit,
limit_period,
annual_limit_amount,
requires_preauth,
requires_referral,
requires_diagnosis,
required_attachments,
claimable_flag,
exclusion_flag,
exclusion_reason,
mapping_confidence,
notes
```

The import tool should allow unknown/internal mappings initially, but not activate claim lines until required mappings are resolved.

---

## 6. SHA tariff import format

## 6.1 SHA-specific fields

SHA tariffs need to handle:

| Field             | Why                                                  |
| ----------------- | ---------------------------------------------------- |
| Benefit fund      | PHC, SHIF, Emergency/Chronic/Critical Illness        |
| Access point      | Facility level or provider access category           |
| Scope             | Outpatient, inpatient, chronic, emergency, maternity |
| Access rules      | Referral, level of care, service limits              |
| Tariff            | Payable amount                                       |
| Limits            | Visits, frequency, annual limit                      |
| Pre-authorisation | For specified services                               |
| Attachments       | Clinical notes, results, referral, prescription      |

SHA regulations require providers to deliver services within benefit limits, verify beneficiary data, provide medically necessary care, maintain beneficiary records, and maintain systems for linking benefits administration and claims submission to the Centralized Digital Platform. ([Kenya Law][2])

## 6.2 SHA sample CSV

```csv
tariff_table_code,tariff_table_name,version_code,source_reference,payer_code,payer_name,scheme_code,scheme_name,contract_code,effective_from,effective_to,benefit_fund,benefit_package,service_category,service_group,payer_service_code,payer_service_name,payer_service_description,internal_item_type,internal_item_code,facility_level_min,facility_level_max,provider_cadre_rule,diagnosis_rule,age_min_days,age_max_days,sex_rule,unit_of_measure,tariff_amount,currency,patient_copay_type,patient_copay_value,quantity_min,quantity_max,frequency_limit,limit_period,annual_limit_amount,requires_preauth,requires_referral,requires_diagnosis,required_attachments,claimable_flag,exclusion_flag,exclusion_reason,mapping_confidence,notes
SHA-LN56-2025,SHA Tariffs for Healthcare Services,2025-02-28,Legal Notice 56 of 2025,SHA,Social Health Authority,SHIF-OPD,Social Health Insurance Fund Outpatient,SHA-CONTRACT-2026,2025-02-28,,SHIF,Outpatient,consultation,OPD,SHA-OPD-CONS-GP,Outpatient consultation,General outpatient consultation,service,SVC-CONS-GP,2,4,clinical_officer_or_doctor,required,,,all,visit,0,KES,none,0,1,1,1,visit,,false,false,true,"clinical_note;diagnosis",true,false,,medium,Amount to be loaded from official SHA tariff source
SHA-LN56-2025,SHA Tariffs for Healthcare Services,2025-02-28,Legal Notice 56 of 2025,SHA,Social Health Authority,SHIF-LAB,Social Health Insurance Fund Diagnostics,SHA-CONTRACT-2026,2025-02-28,,SHIF,Outpatient,lab,Diagnostics,SHA-LAB-MAL-RDT,Malaria RDT,Malaria rapid diagnostic test,lab_test,LAB-MAL-RDT,2,4,lab_personnel,fever_or_malaria_suspected,,,all,test,0,KES,none,0,1,1,1,visit,,false,false,true,"verified_lab_result;clinical_indication",true,false,,medium,Amount to be loaded from official SHA tariff source
SHA-LN56-2025,SHA Tariffs for Healthcare Services,2025-02-28,Legal Notice 56 of 2025,SHA,Social Health Authority,SHIF-PHARM,Social Health Insurance Fund Pharmacy,SHA-CONTRACT-2026,2025-02-28,,SHIF,Outpatient,drug,Pharmacy,SHA-DRUG-AMOX-500,Amoxicillin 500mg capsule,Antibiotic medicine line,product,MED-AMOX-500-CAP,2,4,pharmacist_or_pharmtech,required,,,all,capsule,0,KES,none,0,1,21,1,visit,,false,false,true,"prescription;dispense_record",true,false,,low,Drug tariffs may be formulary-based; verify source
```

Important: the `tariff_amount` values above are placeholders. The import file should be populated from the official SHA tariff schedule, contract, or payer source approved by the client. Do not let developers type amounts manually into production without approval.

---

## 7. Private insurer tariff import format

Private insurers are more likely to have:

```text
scheme-specific prices
pre-authorisation rules
co-pay rules
exclusions
drug formulary limits
provider network restrictions
family/corporate limits
session limits
```

## 7.1 Private insurer sample CSV

```csv
tariff_table_code,tariff_table_name,version_code,source_reference,payer_code,payer_name,scheme_code,scheme_name,contract_code,effective_from,effective_to,benefit_fund,benefit_package,service_category,service_group,payer_service_code,payer_service_name,payer_service_description,internal_item_type,internal_item_code,facility_level_min,facility_level_max,provider_cadre_rule,diagnosis_rule,age_min_days,age_max_days,sex_rule,unit_of_measure,tariff_amount,currency,patient_copay_type,patient_copay_value,quantity_min,quantity_max,frequency_limit,limit_period,annual_limit_amount,requires_preauth,requires_referral,requires_diagnosis,required_attachments,claimable_flag,exclusion_flag,exclusion_reason,mapping_confidence,notes
AAR-OPD-2026,AAR Corporate OPD Tariff,2026-V1,Contract AAR/CLIENT/2026,AAR,AAR Insurance,AAR-CORP-OPD,Corporate Outpatient,AAR-CONTRACT-2026,2026-01-01,2026-12-31,PRIVATE,Outpatient,consultation,OPD,AAR-CONS-GP,GP consultation,Outpatient general consultation,service,SVC-CONS-GP,,,,required,,,all,visit,2500,KES,fixed,500,1,1,1,visit,,false,false,true,"clinical_note;diagnosis",true,false,,high,
AAR-OPD-2026,AAR Corporate OPD Tariff,2026-V1,Contract AAR/CLIENT/2026,AAR,AAR Insurance,AAR-CORP-OPD,Corporate Outpatient,AAR-CONTRACT-2026,2026-01-01,2026-12-31,PRIVATE,Outpatient,lab,Diagnostics,AAR-LAB-CBC,CBC/FBC,Complete blood count,lab_test,LAB-CBC,,,,required,,,all,test,1200,KES,none,0,1,1,1,visit,,false,false,true,"verified_lab_result",true,false,,high,
AAR-OPD-2026,AAR Corporate OPD Tariff,2026-V1,Contract AAR/CLIENT/2026,AAR,AAR Insurance,AAR-CORP-OPD,Corporate Outpatient,AAR-CONTRACT-2026,2026-01-01,2026-12-31,PRIVATE,Outpatient,procedure,Minor procedure,AAR-PROC-DRESS,Wound dressing,Wound dressing procedure,procedure,PROC-DRESSING,,,,required,,,all,session,1500,KES,percent,10,1,3,3,month,,true,false,true,"procedure_note;clinical_note",true,false,,high,
AAR-OPD-2026,AAR Corporate OPD Tariff,2026-V1,Contract AAR/CLIENT/2026,AAR,AAR Insurance,AAR-CORP-OPD,Corporate Outpatient,AAR-CONTRACT-2026,2026-01-01,2026-12-31,PRIVATE,Outpatient,drug,Pharmacy,AAR-DRUG-FORMULARY,Formulary medicine,Reimbursed formulary medicine,product,FORMULARY_GROUP,,,,required,,,all,item,0,KES,percent,10,1,30,1,visit,,false,false,true,"prescription;dispense_record",true,false,,medium,Use drug formulary file for item-level pricing
```

---

## 8. Employer/corporate tariff format

Employer schemes often have simpler rules:

```text
consultation covered
lab covered up to limit
medicine covered up to limit
co-pay optional
credit billing to employer
monthly invoice/reconciliation
```

## Sample employer CSV

```csv
tariff_table_code,tariff_table_name,version_code,source_reference,payer_code,payer_name,scheme_code,scheme_name,contract_code,effective_from,effective_to,benefit_fund,benefit_package,service_category,service_group,payer_service_code,payer_service_name,payer_service_description,internal_item_type,internal_item_code,facility_level_min,facility_level_max,provider_cadre_rule,diagnosis_rule,age_min_days,age_max_days,sex_rule,unit_of_measure,tariff_amount,currency,patient_copay_type,patient_copay_value,quantity_min,quantity_max,frequency_limit,limit_period,annual_limit_amount,requires_preauth,requires_referral,requires_diagnosis,required_attachments,claimable_flag,exclusion_flag,exclusion_reason,mapping_confidence,notes
CORP-ABC-2026,ABC Ltd Staff Medical Scheme,2026-V1,ABC Contract 2026,ABC-LTD,ABC Limited,ABC-STAFF-OPD,ABC Staff Outpatient,ABC-CONTRACT-2026,2026-01-01,2026-12-31,EMPLOYER,Outpatient,consultation,OPD,ABC-CONS-GP,Consultation,Staff outpatient consultation,service,SVC-CONS-GP,,,,required,,,all,visit,1800,KES,none,0,1,1,1,visit,50000,false,false,true,"clinical_note;diagnosis",true,false,,high,
CORP-ABC-2026,ABC Ltd Staff Medical Scheme,2026-V1,ABC Contract 2026,ABC-LTD,ABC Limited,ABC-STAFF-OPD,ABC Staff Outpatient,ABC-CONTRACT-2026,2026-01-01,2026-12-31,EMPLOYER,Outpatient,lab,Diagnostics,ABC-LAB-STD,Standard lab test,Employer standard lab coverage,lab_test,LAB_GROUP_BASIC,,,,required,,,all,test,1000,KES,none,0,1,5,month,50000,false,false,true,"verified_lab_result",true,false,,medium,
CORP-ABC-2026,ABC Ltd Staff Medical Scheme,2026-V1,ABC Contract 2026,ABC-LTD,ABC Limited,ABC-STAFF-OPD,ABC Staff Outpatient,ABC-CONTRACT-2026,2026-01-01,2026-12-31,EMPLOYER,Outpatient,drug,Pharmacy,ABC-DRUG-OPD,OPD medicines,Staff outpatient medicines,product,PRODUCT_GROUP_MEDICINES,,,,required,,,all,item,0,KES,none,0,1,30,visit,50000,false,false,true,"prescription;dispense_record",true,false,,medium,Use retail price less agreed discount unless formulary override exists
```

---

## 9. Drug formulary tariff file

Drug tariffs are different from consultation/lab/procedure tariffs because they need product, ingredient, pack, unit, formulary status, substitution, and quantity rules.

## Drug formulary import headers

```csv
tariff_table_code,
version_code,
payer_code,
scheme_code,
effective_from,
effective_to,
payer_drug_code,
internal_product_code,
generic_name,
brand_name,
strength,
dosage_form,
route,
pack_size,
unit_of_measure,
reimbursement_unit,
unit_tariff,
max_quantity_per_visit,
max_days_supply,
formulary_status,
requires_preauth,
requires_diagnosis,
requires_prescription,
substitution_allowed,
patient_copay_type,
patient_copay_value,
required_attachments,
exclusion_flag,
exclusion_reason,
notes
```

## Sample drug formulary CSV

```csv
tariff_table_code,version_code,payer_code,scheme_code,effective_from,effective_to,payer_drug_code,internal_product_code,generic_name,brand_name,strength,dosage_form,route,pack_size,unit_of_measure,reimbursement_unit,unit_tariff,max_quantity_per_visit,max_days_supply,formulary_status,requires_preauth,requires_diagnosis,requires_prescription,substitution_allowed,patient_copay_type,patient_copay_value,required_attachments,exclusion_flag,exclusion_reason,notes
AAR-OPD-2026,2026-V1,AAR,AAR-CORP-OPD,2026-01-01,2026-12-31,AAR-AMOX-500,MED-AMOX-500-CAP,Amoxicillin,,500mg,capsule,oral,21,capsule,capsule,35,21,7,preferred,false,true,true,true,percent,10,"prescription;dispense_record",false,,
AAR-OPD-2026,2026-V1,AAR,AAR-CORP-OPD,2026-01-01,2026-12-31,AAR-ATOR-20,MED-ATOR-20-TAB,Atorvastatin,,20mg,tablet,oral,30,tablet,tablet,60,30,30,preferred,false,true,true,true,percent,10,"prescription;dispense_record",false,,
AAR-OPD-2026,2026-V1,AAR,AAR-CORP-OPD,2026-01-01,2026-12-31,AAR-NONFORM,PRODUCT_GROUP_NON_FORMULARY,Non-formulary medicines,,,various,various,,item,item,0,0,0,excluded,true,true,true,false,none,0,"preauth_approval;prescription;dispense_record",true,Non-formulary medicine requires approval,
```

---

## 10. Lab tariff import file

Lab tariffs need mapping to the internal lab catalogue and sometimes LOINC/external lab codes.

## Lab tariff headers

```csv
tariff_table_code,
version_code,
payer_code,
scheme_code,
effective_from,
effective_to,
payer_lab_code,
internal_lab_test_code,
loinc_code,
test_name,
specimen_type,
in_house_or_external,
external_lab_code,
unit_of_measure,
tariff_amount,
patient_copay_type,
patient_copay_value,
requires_preauth,
requires_referral,
requires_diagnosis,
required_attachments,
max_quantity_per_visit,
frequency_limit,
limit_period,
claimable_flag,
notes
```

## Sample lab tariff CSV

```csv
tariff_table_code,version_code,payer_code,scheme_code,effective_from,effective_to,payer_lab_code,internal_lab_test_code,loinc_code,test_name,specimen_type,in_house_or_external,external_lab_code,unit_of_measure,tariff_amount,patient_copay_type,patient_copay_value,requires_preauth,requires_referral,requires_diagnosis,required_attachments,max_quantity_per_visit,frequency_limit,limit_period,claimable_flag,notes
SHA-LN56-2025,2025-02-28,SHA,SHIF-LAB,2025-02-28,,SHA-LAB-MAL-RDT,LAB-MAL-RDT,,Malaria RDT,blood,in_house,,test,0,none,0,false,false,true,"verified_lab_result;clinical_indication",1,1,visit,true,Amount from official SHA tariff source
AAR-OPD-2026,2026-V1,AAR,AAR-CORP-OPD,2026-01-01,2026-12-31,AAR-LAB-CBC,LAB-CBC,,Complete blood count,whole_blood,in_house,,test,1200,none,0,false,false,true,"verified_lab_result",1,1,visit,true,
AAR-OPD-2026,2026-V1,AAR,AAR-CORP-OPD,2026-01-01,2026-12-31,AAR-LAB-HBA1C,LAB-HBA1C,,HbA1c,blood,external,EXT-HBA1C,test,2500,percent,10,false,false,true,"external_lab_result;clinical_note",1,1,month,true,
```

---

## 11. Procedure tariff import file

Procedures often need pre-authorisation, referral, notes, limits, and sometimes package pricing.

## Procedure tariff headers

```csv
tariff_table_code,
version_code,
payer_code,
scheme_code,
effective_from,
effective_to,
payer_procedure_code,
internal_procedure_code,
procedure_name,
procedure_category,
unit_of_measure,
tariff_amount,
facility_level_min,
facility_level_max,
requires_preauth,
requires_referral,
requires_diagnosis,
required_attachments,
max_quantity_per_visit,
frequency_limit,
limit_period,
patient_copay_type,
patient_copay_value,
claimable_flag,
notes
```

## Sample procedure CSV

```csv
tariff_table_code,version_code,payer_code,scheme_code,effective_from,effective_to,payer_procedure_code,internal_procedure_code,procedure_name,procedure_category,unit_of_measure,tariff_amount,facility_level_min,facility_level_max,requires_preauth,requires_referral,requires_diagnosis,required_attachments,max_quantity_per_visit,frequency_limit,limit_period,patient_copay_type,patient_copay_value,claimable_flag,notes
AAR-OPD-2026,2026-V1,AAR,AAR-CORP-OPD,2026-01-01,2026-12-31,AAR-PROC-NEB,PROC-NEB,Nebulization,minor_procedure,session,1500,,,false,false,true,"procedure_note;clinical_note",3,3,visit,percent,10,true,
AAR-OPD-2026,2026-V1,AAR,AAR-CORP-OPD,2026-01-01,2026-12-31,AAR-PROC-DRESS,PROC-DRESSING,Wound dressing,minor_procedure,session,1200,,,false,false,true,"procedure_note",5,5,month,percent,10,true,
AAR-OPD-2026,2026-V1,AAR,AAR-CORP-OPD,2026-01-01,2026-12-31,AAR-PROC-SUTURE,PROC-SUTURE,Suturing,minor_surgery,session,3500,,,true,false,true,"procedure_note;clinical_note;preauth_approval",1,1,visit,percent,10,true,
```

---

## 12. Package / bundled tariff import file

Packages require a header plus components.

## Package header file

```csv
package_code,
package_name,
tariff_table_code,
version_code,
payer_code,
scheme_code,
effective_from,
effective_to,
package_category,
tariff_amount,
currency,
patient_copay_type,
patient_copay_value,
requires_preauth,
requires_referral,
required_attachments,
claimable_flag,
notes
```

## Package components file

```csv
package_code,
component_type,
component_code,
component_name,
included_quantity,
included_flag,
separately_billable_flag,
overage_rule,
notes
```

## Sample package

```csv
package_code,package_name,tariff_table_code,version_code,payer_code,scheme_code,effective_from,effective_to,package_category,tariff_amount,currency,patient_copay_type,patient_copay_value,requires_preauth,requires_referral,required_attachments,claimable_flag,notes
PKG-FEVER-OPD,Fever outpatient package,AAR-OPD-2026,2026-V1,AAR,AAR-CORP-OPD,2026-01-01,2026-12-31,outpatient_package,3500,KES,percent,10,false,false,"clinical_note;diagnosis;lab_result",true,
```

```csv
package_code,component_type,component_code,component_name,included_quantity,included_flag,separately_billable_flag,overage_rule,notes
PKG-FEVER-OPD,service,SVC-CONS-GP,Consultation,1,true,false,not_allowed,
PKG-FEVER-OPD,lab_test,LAB-MAL-RDT,Malaria RDT,1,true,false,not_allowed,
PKG-FEVER-OPD,lab_test,LAB-RBS,Random blood sugar,1,true,false,not_allowed,
PKG-FEVER-OPD,product,PRODUCT_GROUP_BASIC_MEDICINES,Basic medicines,1,true,true,patient_pays_overage,Within package medicine cap
```

---

## 13. Capitation tariff format

Capitation is not priced per normal service line. It requires encounter reporting and exception billing.

## Capitation import headers

```csv
payer_code,
scheme_code,
contract_code,
effective_from,
effective_to,
capitation_group_code,
capitation_group_name,
member_category,
amount_per_member,
period,
covered_service_categories,
excluded_service_categories,
exception_billable_categories,
requires_encounter_reporting,
notes
```

## Sample capitation CSV

```csv
payer_code,scheme_code,contract_code,effective_from,effective_to,capitation_group_code,capitation_group_name,member_category,amount_per_member,period,covered_service_categories,excluded_service_categories,exception_billable_categories,requires_encounter_reporting,notes
ABC-LTD,ABC-CAP-OPD,ABC-CONTRACT-2026,2026-01-01,2026-12-31,ABC-CAP-STAFF,ABC Staff OPD Capitation,employee,1200,month,"consultation;basic_lab;basic_drugs","specialist;external_lab;minor_surgery","external_lab;procedure;non_formulary_drugs",true,Normal OPD services included; exceptions separately billable
```

---

## 14. Import workflow

## 14.1 Import lifecycle

```text
Upload tariff file
    ↓
Validate file structure
    ↓
Load into staging table
    ↓
Validate payer/scheme/contract
    ↓
Validate effective dates
    ↓
Validate numeric amounts
    ↓
Validate service category
    ↓
Validate internal item mapping
    ↓
Flag unmapped lines
    ↓
Review errors/warnings
    ↓
Approve import batch
    ↓
Activate tariff version
    ↓
Old version superseded by effective date
```

## 14.2 Import statuses

```text
Uploaded
Parsed
Validation failed
Validation passed with warnings
Mapping required
Ready for approval
Approved
Activated
Rejected
Rolled back
Superseded
```

---

## 15. Validation rules

## Hard validation errors

| Error                                             | Behaviour       |
| ------------------------------------------------- | --------------- |
| Missing payer code                                | Reject row      |
| Missing scheme code                               | Reject row      |
| Missing effective_from                            | Reject row      |
| Invalid date range                                | Reject row      |
| Negative tariff amount                            | Reject row      |
| Missing service category                          | Reject row      |
| Unknown internal item type                        | Reject row      |
| Required boolean invalid                          | Reject row      |
| Duplicate active payer code for same version/item | Reject row      |
| Currency not KES or approved currency             | Reject row      |
| Claimable line with no payer service code         | Reject row      |
| Claimable line with no internal mapping           | Cannot activate |

## Warnings

| Warning                | Behaviour                                         |
| ---------------------- | ------------------------------------------------- |
| Internal item unmapped | Allow draft, block activation                     |
| LOINC missing for lab  | Allow, mark interoperability incomplete           |
| Attachment rule empty  | Warn for lab/procedure/drug                       |
| Pre-auth not specified | Default false but warn                            |
| Facility level blank   | Allow if payer contract does not require          |
| Tariff amount zero     | Warn unless capitation/free/package/included line |
| Mapping confidence low | Require review before activation                  |

---

## 16. Tariff versioning rules

## Version activation

| Rule                                  | Behaviour                                                    |
| ------------------------------------- | ------------------------------------------------------------ |
| New version same payer/scheme         | Can overlap only if line-level rules do not conflict         |
| Same service and same effective dates | Reject duplicate                                             |
| New version effective later           | Previous version gets effective_to automatically if approved |
| Claim already created                 | Keeps tariff version used at claim creation                  |
| Claim resubmitted                     | Uses original tariff unless payer requires current tariff    |
| Backdated tariff                      | Requires manager/claims-admin approval                       |
| Retired tariff line                   | Old claims remain valid; new claims cannot use it            |

## Data preservation

Each claim line must store:

```text
tariff_line_id
tariff_version_id
payer_service_code
unit_tariff_at_claim_time
quantity
gross_amount
patient_portion
payer_portion
pricing_rule_snapshot_json
```

This prevents old claims changing when tariffs are updated.

---

## 17. Tariff mapping UI

The import tool needs a mapping workbench.

## Mapping screen columns

| Column                  |
| ----------------------- |
| Import row number       |
| Payer service code      |
| Payer service name      |
| Service category        |
| Tariff amount           |
| Suggested internal item |
| Internal item type      |
| Mapping confidence      |
| Mapping status          |
| Required attachments    |
| Pre-auth flag           |
| Effective dates         |
| Errors/warnings         |
| Reviewer                |
| Approval status         |

## Mapping actions

```text
Map to internal service
Map to lab test
Map to product
Map to procedure
Map to package
Create new internal item
Mark as excluded
Mark as capitation-included
Split into multiple internal items
Request SME review
Approve mapping
Reject row
```

---

## 18. API design for tariff import

## Endpoints

| Endpoint                                       | Purpose                 |
| ---------------------------------------------- | ----------------------- |
| `POST /claims/tariff-imports`                  | Upload tariff file      |
| `GET /claims/tariff-imports/{id}`              | View import batch       |
| `GET /claims/tariff-imports/{id}/rows`         | View parsed rows        |
| `POST /claims/tariff-imports/{id}/validate`    | Validate batch          |
| `POST /claims/tariff-imports/{id}/auto-map`    | Suggest mappings        |
| `PATCH /claims/tariff-import-rows/{rowId}/map` | Map row                 |
| `POST /claims/tariff-imports/{id}/approve`     | Approve batch           |
| `POST /claims/tariff-imports/{id}/activate`    | Activate tariff version |
| `POST /claims/tariff-imports/{id}/rollback`    | Rollback if not used    |
| `GET /claims/tariffs/lookup`                   | Price a service/item    |
| `GET /claims/tariffs/differences`              | Compare versions        |

---

## 19. Tariff lookup logic

## Input

```json
{
  "payer_code": "AAR",
  "scheme_code": "AAR-CORP-OPD",
  "branch_id": "BR001",
  "service_date": "2026-05-22",
  "internal_item_type": "lab_test",
  "internal_item_code": "LAB-CBC",
  "patient_id": "PT0001",
  "diagnosis_code": "I10",
  "quantity": 1
}
```

## Output

```json
{
  "tariff_found": true,
  "tariff_version": "2026-V1",
  "payer_service_code": "AAR-LAB-CBC",
  "tariff_amount": 1200,
  "currency": "KES",
  "patient_copay_type": "none",
  "patient_copay_value": 0,
  "patient_portion": 0,
  "payer_portion": 1200,
  "requires_preauth": false,
  "requires_referral": false,
  "requires_diagnosis": true,
  "required_attachments": ["verified_lab_result"],
  "claimable": true,
  "warnings": []
}
```

---

## 20. Pricing precedence

When multiple pricing rules exist, use precedence:

```text
1. Patient-specific approval / pre-auth approved amount
2. Scheme-specific tariff line
3. Contract-specific tariff line
4. Payer default tariff
5. Employer/corporate tariff
6. Branch cash price list
7. Manual approved price override
```

Every override must be audited.

---

## 21. Claim validation rules from tariff

The tariff line drives claim readiness.

| Tariff field             | Claim validation                        |
| ------------------------ | --------------------------------------- |
| `requires_preauth`       | Approved preauth required               |
| `requires_referral`      | Referral attachment required            |
| `requires_diagnosis`     | ICD diagnosis required                  |
| `required_attachments`   | Documents/results/prescription required |
| `quantity_max`           | Quantity above limit blocked/split      |
| `frequency_limit`        | Prior claims checked                    |
| `exclusion_flag`         | Not claimable                           |
| `facility_level_min/max` | Branch scope checked                    |
| `provider_cadre_rule`    | Clinician/provider checked              |
| `claimable_flag`         | Claim line allowed or patient-pay       |

---

## 22. Reports needed for tariff governance

| Report                         | Purpose                       |
| ------------------------------ | ----------------------------- |
| Unmapped tariff lines          | Import cleanup                |
| Low-confidence mappings        | SME review                    |
| Tariff changes by version      | Governance                    |
| Services with no active tariff | Claim risk                    |
| Claims using expired tariff    | Audit                         |
| Tariff mismatch denials        | Denial reduction              |
| Pre-auth-required services     | Claims readiness              |
| Zero-amount tariff lines       | Review free/included services |
| Package overage report         | Patient balance control       |

---

## 23. Updated sprint addition

Add a dedicated tariff-import sprint before building full claims.

## New sprint: Tariff Import and Pricing Engine Foundation

### Scope

| Workstream                      | Deliverable                        |
| ------------------------------- | ---------------------------------- |
| ADR-024                         | Tariff import decision             |
| Canonical tariff schema         | `claims.tariff_*`                  |
| Tariff import staging           | Upload/parse/validate              |
| SHA import template             | SHA-specific profile               |
| Private insurer import template | Insurer profile                    |
| Employer import template        | Corporate profile                  |
| Drug formulary import           | Product/formulary tariff           |
| Lab tariff import               | Lab-test tariff                    |
| Procedure tariff import         | Procedure tariff                   |
| Package/capitation import       | Bundled and capitation             |
| Mapping workbench               | Import row to internal item        |
| Pricing lookup API              | Tariff lookup                      |
| Claim validation hooks          | Preauth/attachments/limits         |
| Versioning workflow             | Approve/activate/supersede         |
| Reports                         | Unmapped, changed, expired tariffs |

### Acceptance criteria

| Test                              | Expected result                                 |
| --------------------------------- | ----------------------------------------------- |
| SHA tariff file uploaded          | Rows parsed into staging                        |
| Private insurer file uploaded     | Rows parsed and validated                       |
| Missing internal mapping          | Row cannot activate                             |
| Duplicate active line             | Validation error                                |
| New tariff version activated      | Old version preserved                           |
| Claim priced                      | Correct tariff version used                     |
| Claim line requires preauth       | Claim validation blocks without approval        |
| Lab tariff requires result        | Claim validation requires verified lab result   |
| Drug tariff requires prescription | Claim validation requires prescription/dispense |
| Tariff updated                    | Existing claims preserve old price              |
| Unmapped report                   | Shows rows needing action                       |

---

## 24. Final recommendation

Implement Module 7 tariffs like this:

```text
MVP:
    generic tariff engine
    SHA import template
    private insurer import template
    employer scheme import template
    drug formulary import
    lab/procedure/package import
    mapping workbench
    tariff versioning
    pricing lookup API
    claim validation hooks

Version 2:
    payer-specific import profiles
    remittance and denial feedback into tariff mappings
    automated tariff comparison
    payer portal/API pricing checks

Version 3:
    contract profitability analytics
    AI tariff-mapping suggestions
    advanced package/capitation analytics
```

The core rule should be:

**No claimable service, lab test, drug, procedure, or package should be submitted unless it maps to an active payer tariff version, has a preserved price snapshot, satisfies pre-authorisation and attachment rules, and can be traced back to the source tariff document or contract.**

[1]: https://new.kenyalaw.org/akn/ke/act/ln/2025/56/eng%402025-02-28 "
      Tariffs for Healthcare Services, 2025
    - Kenya Law"
[2]: https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402024-03-08 "
      The Social Health Insurance Regulations
    - Kenya Law"

## Module 7 Gap Closure: Claims and Insurance — Developer Handoff Addendum

## Updated handoff status

| Area                      |                            Previous status |                                                                                                                                 After this closure |
| ------------------------- | -----------------------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------: |
| Completeness              |                                       Good |                                                                                                       **Very high for configurable claims engine** |
| Developer readiness       |                       Medium-low to medium |                                                                    **High for manual/configurable claims; medium for automated live integrations** |
| Accuracy confidence       | Directionally good, operationally volatile |                                                      **Good, with volatility handled through versioned payer catalogues, importers, and adapters** |
| Biggest previous risk     |                  SHA/private payer changes |                                             **Closed by making tariffs, forms, attachments, remittance, portals, and API behaviours configurable** |
| Developer start readiness |                 Manual claim tracking only | **Developers can now build the core claims engine, tariff importer, attachment matrix, denial workflows, reconciliation, and payer-adapter layer** |

The updated design principle is:

```text
Claims must not be hard-coded around one SHA form, one insurer format, one tariff file, or one portal behaviour.
The system must be payer-configurable, versioned, import-friendly, manual-first, and API-ready.
```

As at **23 June 2026**, SHA’s public resources show tariff materials including **L.N. 56 of 2025** and a newer **L.N. 78 SHA – Tariffs for Healthcare Services under SHA, May 8th 2026**. That means the system must treat tariffs as **versioned external rules**, not fixed application code. ([Kenya Law][1])

---

## 1. Final developer decisions

| Gap                                      | Final decision                                                                                                                                                                                             |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actual SHA/private insurer tariff tables | Build a **versioned tariff importer** that supports SHA gazette notices, SHA resource files, private insurer Excel/PDF tariffs, employer tariffs, and manual entry. Do not seed fixed prices into code.    |
| Current SHA portal/API behaviour         | Build **manual-first SHA workflow** with provider portal reference fields, then add `PayerAdapter` API integrations only after official/current API or portal specifications and credentials are obtained. |
| Payer-specific claim formats             | Build a **claim format template engine**: SHA Form 3-style, private insurer outpatient, inpatient, pharmacy-only, lab-only, pre-auth, capitation encounter, and custom payer forms.                        |
| Remittance import formats                | Support manual entry, Excel/CSV import, PDF remittance upload, bank statement reference matching, and future API import.                                                                                   |
| Required attachment matrix               | Build a configurable **payer + scheme + service + facility + claim-type attachment matrix**. Seed a conservative default matrix.                                                                           |
| Denial management                        | Use a payer-specific denial-code catalogue plus internal denial categories.                                                                                                                                |
| Reconciliation                           | Reconcile at both **claim header** and **claim line** level. Support partial payments, underpayments, overpayments, write-offs, patient transfers, and payer disputes.                                     |
| Pre-authorisation                        | Store online/manual portal request reference, submitted payload, decision, approval limits, validity period, documents, and SLA timer.                                                                     |
| SHA/private volatility                   | Add `effective_from`, `effective_to`, `source_document`, `version`, `approval_status`, and `superseded_by` to tariffs, claim formats, attachment rules, and benefit rules.                                 |
| Production integration                   | Automated SHA/private payer submission must wait for current provider credentials, live portal/API docs, test cases, and payer approval.                                                                   |

---

## 2. Regulatory and operational anchor summary

SHA claims are not ordinary invoices. Under the Social Health Insurance Regulations, benefits are payable where valid claims are lodged and approved, and all claims are to be lodged, reviewed, processed, validated, appraised and paid through the Centralized Digital Platform. Claims must be lodged within seven days from discharge, and the claim information includes SHA number, hospital registration number, patient demographics/contact details, clinical details, and amount claimed. ([Kenya Law][2])

The regulations also define claim-processing outcomes: approved claims, incomplete/error claims returned with reasons for amendment, and rejected claims notified with reasons not later than fourteen days from rejection. Pre-authorisation requests for specialized services are online requests and should include beneficiary details, provider/facility details, and service details; the decision should be immediate but no later than seventy-two hours, and pre-authorisation does not apply to emergency services. ([Kenya Law][2])

The regulations say claim processing is guided by prescribed tariffs, and tariffs are approved/gazetted and may be reviewed based on factors such as technology, economic factors, disease burden, market dynamics, population health risk, and provider feedback. This is the legal reason the application must support tariff versioning, not hard-coded tariff constants. ([Kenya Law][2])

SHA has a public provider portal, but the visible public page does not expose a stable developer API contract. Therefore, the correct developer posture is **manual-first, adapter-ready**. ([SHA Provider Portal][3])

---

## 3. Final claims architecture

## 3.1 Core architecture

```text
Benefit scheme setup
    ↓
Eligibility / member verification
    ↓
Pre-authorisation, where required
    ↓
Tariff lookup
    ↓
Bill split: patient + payer
    ↓
Clinical evidence collection
    ↓
Claim validation
    ↓
Claim format rendering
    ↓
Manual/API/portal submission
    ↓
Payer response
    ↓
Denial / correction / resubmission
    ↓
Payment / remittance import
    ↓
Reconciliation
    ↓
Accounting posting
```

## 3.2 Adapter architecture

```text
Claims Engine
    ├── ManualPortalAdapter
    ├── SHAProviderPortalAdapter, future
    ├── PrivateInsurerAdapter
    ├── EmployerSchemeAdapter
    ├── CapitationEncounterAdapter
    ├── RemittanceImportAdapter
    └── FHIRClaimAdapter, future
```

## 3.3 Payer-adapter rule

No claims code should depend directly on SHA or one insurer.

```text
Claim data model → Claim format renderer → Submission adapter → Response parser
```

This allows the same core claim to be rendered as:

```text
SHA claim form
Private insurer outpatient claim
Employer invoice claim
Pharmacy claim
Lab claim
PDF claim pack
API payload
Portal upload checklist
```

---

## 4. Tariff table closure

## 4.1 Final tariff policy

Tariffs must be:

```text
versioned
payer-specific
scheme-specific
facility-specific where needed
effective-date controlled
source-document linked
line-level mapped
importable
auditable
supersedable
```

## 4.2 Tariff source types

| Source type            | Example                          | System handling                        |
| ---------------------- | -------------------------------- | -------------------------------------- |
| SHA gazette tariff     | L.N. 56 of 2025, L.N. 78 of 2026 | Import as official tariff version      |
| SHA resource PDF/Excel | SHA resource download            | Store source document and parsed lines |
| Private insurer Excel  | AAR/Jubilee/etc. tariff          | Import as payer tariff                 |
| Private insurer PDF    | PDF price schedule               | Upload + manual/assisted mapping       |
| Employer contract      | Corporate staff tariff           | Manual/Excel import                    |
| Capitation contract    | Included services                | Mark included/non-claimable            |
| Facility cash price    | Cash-paying patient price        | Separate price list, not claim tariff  |
| Pharmacy formulary     | Covered medicines                | Drug tariff/formulary table            |
| Lab tariff             | Covered tests                    | Test code mapping                      |
| Procedure schedule     | Procedures/minor ops             | Procedure tariff mapping               |

---

## 4.3 `tariff_tables`

| Field                          |    Required | Notes                                            |
| ------------------------------ | ----------: | ------------------------------------------------ |
| `id`                           |         Yes |                                                  |
| `payer_id`                     |         Yes | SHA/private/employer                             |
| `scheme_id`                    | Conditional | Scheme-specific                                  |
| `tariff_name`                  |         Yes | SHA Tariff L.N. 78 2026                          |
| `tariff_type`                  |         Yes | SHA, private_insurer, employer, capitation, cash |
| `version_code`                 |         Yes | `SHA_LN78_2026`                                  |
| `legal_notice_or_contract_ref` | Recommended | L.N. 78/2026, contract number                    |
| `source_document_id`           |         Yes | PDF/Excel/contract                               |
| `effective_from`               |         Yes |                                                  |
| `effective_to`                 |    Optional |                                                  |
| `supersedes_tariff_table_id`   |    Optional |                                                  |
| `import_method`                |         Yes | manual, csv, excel, pdf_assisted, api            |
| `approval_status`              |         Yes | draft, mapped, validated, approved, retired      |
| `approved_by`                  | Conditional |                                                  |
| `approved_at`                  | Conditional |                                                  |
| `status`                       |         Yes | active, inactive, superseded                     |
| `created_at`                   |         Yes |                                                  |

## 4.4 `tariff_lines`

| Field                          |    Required | Notes                                       |
| ------------------------------ | ----------: | ------------------------------------------- |
| `id`                           |         Yes |                                             |
| `tariff_table_id`              |         Yes |                                             |
| `payer_service_code`           |         Yes | External code                               |
| `payer_service_name`           |         Yes | External name                               |
| `internal_service_type`        |         Yes | consultation, lab, drug, procedure, package |
| `internal_item_id`             | Conditional | Service/test/drug/procedure ID              |
| `service_category`             |         Yes | OPD, IPD, lab, pharmacy, procedure          |
| `facility_level_rule`          |    Optional | Level 2/3/4/5/6 where applicable            |
| `provider_type_rule`           |    Optional | Clinic, hospital, pharmacy                  |
| `unit_of_measure`              |         Yes | visit, test, dose, pack, procedure          |
| `unit_tariff`                  |         Yes |                                             |
| `max_quantity`                 |    Optional |                                             |
| `max_amount_per_claim`         |    Optional |                                             |
| `annual_limit`                 |    Optional |                                             |
| `episode_limit`                |    Optional |                                             |
| `requires_preauth`             |         Yes |                                             |
| `requires_referral`            |         Yes |                                             |
| `requires_diagnosis_code`      |         Yes |                                             |
| `required_attachments_json`    |         Yes |                                             |
| `covered_diagnosis_rules_json` |    Optional |                                             |
| `exclusion_flag`               |         Yes |                                             |
| `patient_copay_rule_json`      |    Optional |                                             |
| `effective_from`               |         Yes |                                             |
| `effective_to`                 |    Optional |                                             |
| `line_status`                  |         Yes | active, inactive, superseded                |

---

## 4.5 Tariff import workflow

```text
1. Upload tariff source document
2. Create tariff table version
3. Parse/import lines from Excel/CSV or manual mapping
4. Map payer codes to internal services/drugs/tests/procedures
5. Validate duplicate codes, missing prices, missing service mappings
6. Compare to previous tariff version
7. Show increases/decreases and removed/added lines
8. Claims/product owner approves tariff version
9. Version becomes active from effective date
10. Old claims retain old tariff version
```

## 4.6 Tariff validation checks

| Check                                    | Behaviour                             |
| ---------------------------------------- | ------------------------------------- |
| Duplicate payer service code             | Block approval                        |
| Missing internal mapping                 | Mark unmapped, not claim-ready        |
| Missing tariff amount                    | Block line activation                 |
| Effective date overlaps active tariff    | Require supersession rule             |
| Service mapped to wrong category         | Warn                                  |
| Facility level restriction missing       | Warning if payer requires level rules |
| Requires pre-auth but no rule configured | Warning/block                         |
| Required attachments missing             | Warning/block                         |
| Price dropped/increased materially       | Highlight for reviewer                |
| Old tariff used after effective date     | Claim validator warns                 |

---

## 5. Benefit scheme closure

## 5.1 Benefit scheme model

The benefit scheme must combine:

```text
payer contract
covered benefits
tariff version
eligibility rules
pre-auth rules
attachment rules
claim deadline
submission format
remittance format
denial code set
```

## 5.2 `benefit_schemes`

| Field                         |                                        Required |
| ----------------------------- | ----------------------------------------------: |
| `id`                          |                                             Yes |
| `payer_id`                    |                                             Yes |
| `scheme_code`                 |                                             Yes |
| `scheme_name`                 |                                             Yes |
| `scheme_type`                 | Yes: SHA, private, employer, capitation, hybrid |
| `contract_id`                 |                                     Conditional |
| `provider_code`               |                                     Conditional |
| `branch_id`                   |                                     Conditional |
| `active_tariff_table_id`      |                                             Yes |
| `eligibility_method`          |    Yes: portal_manual, api, card, employer_list |
| `claim_submission_method`     |       Yes: portal, email, api, physical, manual |
| `preauth_submission_method`   |                                             Yes |
| `remittance_format_id`        |                                        Optional |
| `claim_format_id`             |                                             Yes |
| `denial_code_set_id`          |                                        Optional |
| `default_claim_deadline_days` |                                             Yes |
| `status`                      |                                             Yes |
| `effective_from`              |                                             Yes |
| `effective_to`                |                                        Optional |

## 5.3 Scheme rule matrix

| Rule area                    | Configurable values                                           |
| ---------------------------- | ------------------------------------------------------------- |
| Eligibility                  | Must verify per visit, once per day, once per episode, manual |
| Co-pay                       | Fixed, percentage, service-specific, none                     |
| Exclusions                   | Service category, drug group, diagnosis, facility level       |
| Limits                       | Per visit, per episode, annual, family, quantity              |
| Referral                     | Required/not required, source level, attachment               |
| Pre-auth                     | By service, amount threshold, admission, procedure            |
| Attachments                  | By service and claim type                                     |
| Claim deadline               | Days from visit/discharge                                     |
| Resubmission deadline        | Days from denial/return                                       |
| Patient billing after denial | Allowed, not allowed, requires consent, manager approval      |
| Capitation                   | Included service, carve-out, encounter-only                   |

---

## 6. Current portal/API behaviour closure

## 6.1 Final integration position

Because SHA and private insurer portal/API behaviours are operationally volatile, developers should implement this staged model:

| Stage   | Implementation            | Use                                                               |
| ------- | ------------------------- | ----------------------------------------------------------------- |
| Stage 1 | Manual tracking           | Claims officer enters portal references and uploads claim packs   |
| Stage 2 | Assisted portal export    | System generates claim PDF/Excel/ZIP pack for upload              |
| Stage 3 | Semi-automated import     | Import status/remittance files from payer portal                  |
| Stage 4 | API adapter               | Only after official docs/credentials                              |
| Stage 5 | Bidirectional integration | Eligibility, pre-auth, claim submission, claim status, remittance |

## 6.2 Provider portal fields to capture

| Field                         |    Required |
| ----------------------------- | ----------: |
| `portal_name`                 |         Yes |
| `portal_url`                  |    Optional |
| `provider_username_reference` |    Optional |
| `branch_provider_code`        |         Yes |
| `portal_claim_reference`      | Conditional |
| `portal_preauth_reference`    | Conditional |
| `submitted_by_user`           |         Yes |
| `submitted_at`                |         Yes |
| `portal_status_snapshot`      |    Optional |
| `screenshot_document_id`      |    Optional |
| `response_document_id`        |    Optional |
| `notes`                       |    Optional |

## 6.3 API readiness checklist

Before building live SHA/private API:

| Requirement                | Needed |
| -------------------------- | -----: |
| Official API documentation |    Yes |
| Sandbox/test credentials   |    Yes |
| Production credentials     |  Later |
| Data dictionary            |    Yes |
| Authentication method      |    Yes |
| Endpoint list              |    Yes |
| Payload schemas            |    Yes |
| Error codes                |    Yes |
| Rate limits                |    Yes |
| Webhook/callback specs     |    Yes |
| Privacy/security agreement |    Yes |
| Test patient/member data   |    Yes |
| Certification/UAT signoff  |    Yes |
| Fallback process           |    Yes |

## 6.4 Payer adapter interface

```text
PayerAdapter
    verifyEligibility()
    requestPreauthorisation()
    queryPreauthorisationStatus()
    submitClaim()
    queryClaimStatus()
    submitClaimCorrection()
    submitAppealOrReview()
    importRemittance()
    downloadResponseDocuments()
```

Each method must support:

```text
request_id
idempotency_key
raw_payload
raw_response
status
error_code
error_message
retry_policy
manual_override_reference
```

---

## 7. Payer-specific claim formats

## 7.1 Final claim format strategy

Use a **claim format template engine**.

```text
claim_format
    ├── header fields
    ├── patient fields
    ├── provider fields
    ├── clinical fields
    ├── service lines
    ├── attachments
    ├── signatures
    ├── export format
    └── validation rules
```

## 7.2 Claim format types

| Format type            | Use                                                 |
| ---------------------- | --------------------------------------------------- |
| `SHA_FORM3_STYLE`      | SHA claim form based on regulation Form 3 concepts  |
| `SHA_PORTAL_ENTRY`     | Manual SHA portal data-entry checklist              |
| `SHA_API_JSON`         | Future SHA API                                      |
| `PRIVATE_OPD_FORM`     | Private insurer outpatient claim                    |
| `PRIVATE_IPD_FORM`     | Inpatient/discharge claim                           |
| `PHARMACY_CLAIM`       | Drug-only/pharmacy claim                            |
| `LAB_CLAIM`            | Lab-only claim                                      |
| `EMPLOYER_STATEMENT`   | Corporate/employer invoice statement                |
| `CAPITATION_ENCOUNTER` | Encounter report without fee-for-service receivable |
| `CUSTOM_PDF_PACK`      | PDF/ZIP claim bundle                                |
| `FHIR_CLAIM`           | Future FHIR Claim resource                          |

## 7.3 `claim_formats`

| Field                   |                                          Required |
| ----------------------- | ------------------------------------------------: |
| `id`                    |                                               Yes |
| `payer_id`              |                                       Conditional |
| `scheme_id`             |                                       Conditional |
| `format_code`           |                                               Yes |
| `format_name`           |                                               Yes |
| `format_type`           |                                               Yes |
| `output_type`           | Yes: pdf, excel, csv, json, portal_checklist, zip |
| `template_version`      |                                               Yes |
| `field_mapping_json`    |                                               Yes |
| `validation_rules_json` |                                               Yes |
| `attachment_ruleset_id` |                                          Optional |
| `effective_from`        |                                               Yes |
| `effective_to`          |                                          Optional |
| `approval_status`       |                                               Yes |
| `status`                |                                               Yes |

## 7.4 Common claim header fields

| Field                          | Source         |
| ------------------------------ | -------------- |
| Claim number                   | Claims module  |
| Payer claim reference          | Payer/portal   |
| Payer                          | Scheme setup   |
| Scheme                         | Scheme setup   |
| Provider/facility code         | Module 1       |
| Facility name                  | Module 1       |
| Facility level/type            | Module 1       |
| Branch                         | Module 1       |
| Claim type                     | Claims         |
| Visit/admission/discharge date | EMR            |
| Submission date                | Claims         |
| Claim amount                   | Billing/tariff |
| Patient portion                | Billing        |
| Payer portion                  | Billing        |
| Tariff version                 | Tariff table   |

## 7.5 Common patient fields

| Field                         | Source            |
| ----------------------------- | ----------------- |
| SHA number/member number      | Patient/member    |
| Hospital registration number  | Patient/EMR       |
| Full name                     | Patient           |
| Date of birth/age             | Patient           |
| Gender                        | Patient           |
| ID/passport/birth certificate | Patient           |
| Phone/contact                 | Patient           |
| Address/county                | Patient           |
| Principal member              | Scheme membership |
| Dependent relationship        | Scheme membership |

## 7.6 Common clinical fields

| Field                    | Source               |
| ------------------------ | -------------------- |
| Primary diagnosis        | EMR                  |
| ICD-10 code              | EMR                  |
| Secondary diagnosis      | EMR                  |
| Chief complaint          | EMR                  |
| Clinical summary         | EMR                  |
| Services provided        | Billing/EMR          |
| Lab results              | Lab-lite             |
| Prescriptions            | EMR/pharmacy         |
| Dispensed medicines      | Pharmacy             |
| Procedures               | EMR                  |
| Referral details         | EMR                  |
| Pre-authorisation number | Claims               |
| Clinician name/licence   | Module 1 + EMR       |
| Discharge summary        | EMR/inpatient upload |

---

## 8. Seed required-attachment matrix

## 8.1 Final attachment strategy

Attachments should be configured by:

```text
payer
scheme
claim type
service category
facility type/level
tariff line
pre-auth rule
claim status
```

## 8.2 `attachment_rulesets`

| Field             | Required |
| ----------------- | -------: |
| `id`              |      Yes |
| `ruleset_name`    |      Yes |
| `payer_id`        | Optional |
| `scheme_id`       | Optional |
| `claim_type`      | Optional |
| `effective_from`  |      Yes |
| `effective_to`    | Optional |
| `approval_status` |      Yes |
| `status`          |      Yes |

## 8.3 `attachment_rules`

| Field                      |                                          Required |
| -------------------------- | ------------------------------------------------: |
| `id`                       |                                               Yes |
| `ruleset_id`               |                                               Yes |
| `service_category`         |                                               Yes |
| `service_code`             |                                          Optional |
| `claim_type`               |                                          Optional |
| `required_attachment_type` |                                               Yes |
| `required_timing`          | Yes: before_submission, on_return, before_payment |
| `required_condition_json`  |                                          Optional |
| `source_module`            |                                               Yes |
| `missing_action`           |               Yes: block, warn, allow_with_reason |
| `status`                   |                                               Yes |

## 8.4 Seed attachment matrix

| Claim/service                   | Required by default                                                        | Source module            | Submission behaviour                   |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------ | -------------------------------------- |
| General outpatient consultation | Signed clinical note, diagnosis, invoice/bill                              | EMR + billing            | Block if claim payer requires          |
| Lab test                        | Lab order, verified result, invoice/bill                                   | Lab-lite + billing       | Block                                  |
| Pharmacy/drug claim             | Prescription, dispense record, invoice/bill                                | EMR + pharmacy + billing | Block                                  |
| Controlled/high-risk medicine   | Prescription, dispense record, controlled register reference               | Pharmacy                 | Block                                  |
| Procedure                       | Procedure note, consent if configured, invoice/bill                        | EMR + billing            | Block                                  |
| Dressing/wound care             | Procedure/dressing note, invoice/bill                                      | EMR                      | Block/warn                             |
| Injection/nebulization          | Procedure/admin note, medicine/consumable record                           | EMR + inventory          | Block/warn                             |
| Referral-required service       | Referral letter/source referral                                            | EMR                      | Block                                  |
| External lab                    | External lab result PDF, send-out record, invoice                          | Lab-lite                 | Block                                  |
| Imaging                         | Imaging request/report/film reference                                      | EMR/external document    | Block if claimed                       |
| Pre-authorised service          | Approval number/document, clinical justification                           | Claims + EMR             | Block                                  |
| Emergency claim                 | Emergency note, triage/vitals, stabilization note                          | EMR                      | Block                                  |
| Chronic-care claim              | Chronic registry/review note, diagnosis, prescription/lab where applicable | EMR/pharmacy/lab         | Block/warn                             |
| Inpatient/discharge-style claim | Admission/discharge summary, itemized bill, reports                        | EMR/documents            | Block                                  |
| Capitation encounter            | Encounter record, diagnosis/service summary                                | EMR                      | Submit encounter, no normal receivable |
| Patient reimbursement support   | Receipt/invoice, visit summary, result/prescription as applicable          | Billing/EMR              | Generate pack                          |

## 8.5 Attachment status lifecycle

```text
not_required
required_missing
attached_unverified
attached_verified
rejected
superseded
expired
waived_with_reason
```

---

## 9. Remittance import formats

## 9.1 Final remittance strategy

Support multiple remittance routes:

```text
manual entry
CSV import
Excel import
PDF upload + manual mapping
bank statement matching
portal screenshot/reference
future API import
```

## 9.2 Remittance file types

| Format                |       MVP support | Handling                        |
| --------------------- | ----------------: | ------------------------------- |
| Manual batch entry    |               Yes | Accountant enters payer payment |
| CSV                   |               Yes | Column mapper                   |
| Excel                 |               Yes | Column mapper                   |
| PDF remittance advice |               Yes | Upload + manual line mapping    |
| Bank statement CSV    |               Yes | Match payment references        |
| Portal export         | Yes, if CSV/Excel | Import through mapper           |
| API remittance        |            Future | PayerAdapter                    |
| Email remittance      |               Yes | Upload attachment/document      |

## 9.3 `remittance_format_templates`

| Field                    |                        Required |
| ------------------------ | ------------------------------: |
| `id`                     |                             Yes |
| `payer_id`               |                        Optional |
| `scheme_id`              |                        Optional |
| `format_name`            |                             Yes |
| `file_type`              | Yes: csv, xlsx, pdf_manual, api |
| `column_mapping_json`    |                     Conditional |
| `date_format`            |                        Optional |
| `amount_format`          |                        Optional |
| `claim_reference_column` |                     Conditional |
| `member_number_column`   |                        Optional |
| `service_date_column`    |                        Optional |
| `approved_amount_column` |                        Optional |
| `paid_amount_column`     |                        Optional |
| `denial_code_column`     |                        Optional |
| `withholding_column`     |                        Optional |
| `status`                 |                             Yes |

## 9.4 Common remittance columns

| Column                 | Meaning                        |
| ---------------------- | ------------------------------ |
| Payer name             | Insurer/SHA/employer           |
| Remittance number      | Batch reference                |
| Payment date           | Date paid                      |
| Bank reference         | Bank/M-Pesa/transfer reference |
| Claim number           | Internal or payer claim        |
| Payer claim reference  | Portal/API reference           |
| Member number          | SHA/insurer member             |
| Patient name           | Matching support               |
| Service date           | Visit/service date             |
| Claimed amount         | Submitted amount               |
| Approved amount        | Payer-approved amount          |
| Paid amount            | Actual paid                    |
| Deduction/withholding  | Payer deductions               |
| Denied amount          | Rejected amount                |
| Denial code            | Payer reason                   |
| Denial reason          | Text                           |
| Patient responsibility | Patient balance                |
| Comments               | Payer remarks                  |

## 9.5 Remittance matching algorithm

Recommended matching order:

```text
1. Payer claim reference exact match
2. Internal claim number exact match
3. Invoice number exact match
4. Member number + service date + amount
5. Patient name + service date + amount, manual review
6. Unmatched suspense
```

## 9.6 Remittance outcomes

| Outcome                    | System behaviour                    |
| -------------------------- | ----------------------------------- |
| Exact paid                 | Mark claim/line reconciled          |
| Partially paid             | Create variance/denial/underpayment |
| Overpaid                   | Create overpayment/suspense         |
| Denied                     | Create denial record                |
| Withheld                   | Create withholding/variance         |
| Unknown claim              | Unmatched remittance queue          |
| Duplicate remittance line  | Flag duplicate                      |
| Paid after write-off       | Reverse write-off/recovery workflow |
| Payment without remittance | Suspense until matched              |

---

## 10. Denial code catalogue

## 10.1 Internal denial categories

```text
eligibility
preauthorisation
benefit_limit
service_not_covered
facility_not_contracted
facility_scope
provider_scope
missing_diagnosis
missing_icd_code
missing_clinical_note
unsigned_note
missing_lab_result
missing_prescription
missing_dispense_record
missing_referral
missing_attachment
wrong_tariff
wrong_service_code
duplicate_claim
late_submission
medical_necessity
quantity_exceeded
formulary_issue
technical_portal_error
data_mismatch
member_details_mismatch
claim_format_error
payer_policy_exception
other
```

## 10.2 `denial_code_sets`

| Field                | Required |
| -------------------- | -------: |
| `id`                 |      Yes |
| `payer_id`           | Optional |
| `scheme_id`          | Optional |
| `code_set_name`      |      Yes |
| `version`            |      Yes |
| `source_document_id` | Optional |
| `effective_from`     |      Yes |
| `status`             |      Yes |

## 10.3 `denial_codes`

| Field                            |            Required |
| -------------------------------- | ------------------: |
| `id`                             |                 Yes |
| `code_set_id`                    |                 Yes |
| `payer_denial_code`              |                 Yes |
| `payer_denial_text`              |                 Yes |
| `internal_category`              |                 Yes |
| `recoverable_default`            |                 Yes |
| `default_responsible_department` |                 Yes |
| `default_correction_action`      |            Optional |
| `resubmission_allowed_default`   |                 Yes |
| `patient_billable_default`       | Yes/no/configurable |
| `status`                         |                 Yes |

## 10.4 Denial workflow rule

```text
RULE: Denial received
IF denial_code maps to recoverable category
THEN create correction task
AND set resubmission deadline
ELSE route to write-off / patient-balance review
```

---

## 11. Claim validation engine

## 11.1 Validation layers

```text
Layer 1: Organisation/facility eligibility
Layer 2: Patient/member eligibility
Layer 3: Benefit/scheme coverage
Layer 4: Tariff mapping
Layer 5: Pre-authorisation
Layer 6: Clinical evidence
Layer 7: Attachment completeness
Layer 8: Billing/invoice consistency
Layer 9: Duplicate/fraud checks
Layer 10: Submission format readiness
```

## 11.2 `claim_validation_rules`

| Field              |              Required |
| ------------------ | --------------------: |
| `id`               |                   Yes |
| `payer_id`         |              Optional |
| `scheme_id`        |              Optional |
| `rule_code`        |                   Yes |
| `rule_name`        |                   Yes |
| `rule_level`       |                   Yes |
| `condition_json`   |                   Yes |
| `severity`         | Yes: warning, blocker |
| `responsible_role` |                   Yes |
| `message_template` |                   Yes |
| `active`           |                   Yes |

## 11.3 Standard blockers

| Blocker                          | Responsible role   |
| -------------------------------- | ------------------ |
| Facility contract inactive       | Admin/compliance   |
| Provider code missing            | Admin/claims       |
| Patient eligibility not verified | Reception/billing  |
| Diagnosis missing                | Clinician          |
| ICD code missing                 | Clinician/coder    |
| Clinical note unsigned           | Clinician          |
| Tariff missing                   | Claims/billing     |
| Pre-auth missing                 | Claims             |
| Lab result missing               | Lab                |
| Prescription missing             | Clinician/pharmacy |
| Dispense record missing          | Pharmacy           |
| Attachment missing               | Claims             |
| Duplicate claim                  | Claims/manager     |
| Service outside benefit          | Billing/claims     |
| Claim deadline exceeded          | Claims/manager     |

---

## 12. Claim bundle formats

## 12.1 PDF/ZIP claim pack

For manual portal/email submission, generate:

```text
Claim summary PDF
Itemized invoice
eTIMS invoice/receipt where applicable
Signed clinical note or visit summary
Diagnosis sheet
Lab results
Prescription and dispense record
Procedure note
Referral/discharge summary
Pre-authorisation approval
Patient/member documents where required
Claim form
Attachment index
```

## 12.2 Claim pack index

| Field             |
| ----------------- |
| Claim number      |
| Patient name      |
| Member number     |
| Visit date        |
| Payer             |
| Scheme            |
| Total claimed     |
| Attachment type   |
| Source module     |
| Document version  |
| Required/optional |
| Included yes/no   |
| Missing reason    |
| File name         |
| File hash         |

## 12.3 Claim bundle immutability

Once submitted:

```text
claim header, lines, attachments, tariff version, and submission payload are frozen.
```

Corrections use:

```text
claim amendment
claim resubmission
claim appeal/review
credit note / billing correction
```

No silent claim edit after submission.

---

## 13. Pre-authorisation closure

## 13.1 Pre-auth service catalogue

Add configurable table:

### `preauth_service_rules`

| Field                       | Required |
| --------------------------- | -------: |
| `id`                        |      Yes |
| `payer_id`                  | Optional |
| `scheme_id`                 | Optional |
| `service_category`          |      Yes |
| `service_code`              | Optional |
| `amount_threshold`          | Optional |
| `diagnosis_rule_json`       | Optional |
| `facility_level_rule`       | Optional |
| `requires_attachments_json` |      Yes |
| `emergency_exempt`          |      Yes |
| `effective_from`            |      Yes |
| `effective_to`              | Optional |
| `status`                    |      Yes |

## 13.2 Pre-auth SLA

SHA regulations require pre-authorisation decisions not later than seventy-two hours from receipt, with emergency services excluded from pre-authorisation. The system should therefore default SHA pre-auth SLA to **72 hours**, while allowing private insurers to have their own SLA rules. ([Kenya Law][2])

## 13.3 Pre-auth statuses

```text
draft
submitted
portal_reference_captured
acknowledged
pending_review
more_information_required
approved
partially_approved
denied
expired
cancelled
used
closed
```

## 13.4 Pre-auth fields to add

| Field                    |    Required |
| ------------------------ | ----------: |
| `submission_reference`   | Conditional |
| `portal_reference`       | Conditional |
| `approval_number`        | Conditional |
| `approved_amount`        | Conditional |
| `approved_quantity`      | Conditional |
| `approved_services_json` | Conditional |
| `valid_from`             | Conditional |
| `valid_to`               | Conditional |
| `conditions_json`        |    Optional |
| `denial_reason`          | Conditional |
| `sla_due_at`             |         Yes |
| `peer_review_required`   |    Optional |
| `peer_review_status`     |    Optional |

---

## 14. Reconciliation and accounting closure

## 14.1 Claims receivable accounts

| Account                      | Use                                     |
| ---------------------------- | --------------------------------------- |
| Insurer/SHA receivable       | Payer portion after bill/claim          |
| Patient receivable           | Co-pay or transferred balance           |
| Claim underpayment variance  | Payer short payment                     |
| Claim overpayment suspense   | Payer excess payment                    |
| Claim write-off expense      | Unrecoverable denial                    |
| Claim recovery income/offset | Recovered after write-off               |
| Payer withholding            | Deductions/withholding where applicable |
| Capitation income            | Capitation payments                     |
| Capitation utilization cost  | Internal tracking                       |

## 14.2 Reconciliation posting examples

### Claim submitted / payer receivable created

From billing:

|                  Debit |                         Credit |
| ---------------------: | -----------------------------: |
| Insurer/SHA receivable | Revenue / VAT where applicable |

### Payer pays fully

|                Debit |                 Credit |
| -------------------: | ---------------------: |
| Bank/M-Pesa clearing | Insurer/SHA receivable |

### Payer underpays

|                               Debit |                          Credit |
| ----------------------------------: | ------------------------------: |
|                                Bank | Insurer/SHA receivable, partial |
| Claim variance / dispute receivable | Insurer/SHA receivable, balance |

### Payer denies and facility writes off

|                   Debit |                 Credit |
| ----------------------: | ---------------------: |
| Claim write-off expense | Insurer/SHA receivable |

### Denied amount transferred to patient

|              Debit |                 Credit |
| -----------------: | ---------------------: |
| Patient receivable | Insurer/SHA receivable |

### Overpayment

| Debit |                     Credit |
| ----: | -------------------------: |
|  Bank | Claim overpayment suspense |

---

## 15. Data model additions and refinements

## 15.1 Add `payer_portals`

| Field                          | Required |
| ------------------------------ | -------: |
| `id`                           |      Yes |
| `payer_id`                     |      Yes |
| `portal_name`                  |      Yes |
| `portal_url`                   | Optional |
| `submission_method`            |      Yes |
| `supports_eligibility`         |      Yes |
| `supports_preauth`             |      Yes |
| `supports_claim_submission`    |      Yes |
| `supports_claim_status`        |      Yes |
| `supports_remittance_download` |      Yes |
| `api_available`                |      Yes |
| `status`                       |      Yes |

## 15.2 Add `claim_format_fields`

| Field                  | Required |
| ---------------------- | -------: |
| `id`                   |      Yes |
| `claim_format_id`      |      Yes |
| `field_code`           |      Yes |
| `field_label`          |      Yes |
| `source_module`        |      Yes |
| `source_field_path`    |      Yes |
| `required`             |      Yes |
| `validation_rule_json` | Optional |
| `display_order`        |      Yes |

## 15.3 Add `claim_versions`

| Field                 | Required |
| --------------------- | -------: |
| `id`                  |      Yes |
| `claim_id`            |      Yes |
| `version_number`      |      Yes |
| `version_reason`      |      Yes |
| `claim_snapshot_json` |      Yes |
| `created_by`          |      Yes |
| `created_at`          |      Yes |
| `submitted_flag`      |      Yes |

## 15.4 Add `claim_tasks`

| Field              | Required |
| ------------------ | -------: |
| `id`               |      Yes |
| `claim_id`         |      Yes |
| `task_type`        |      Yes |
| `responsible_role` |      Yes |
| `assigned_to`      | Optional |
| `description`      |      Yes |
| `due_date`         | Optional |
| `status`           |      Yes |
| `created_at`       |      Yes |
| `completed_at`     | Optional |

## 15.5 Add `remittance_batches`

| Field                |                         Required |
| -------------------- | -------------------------------: |
| `id`                 |                              Yes |
| `payer_id`           |                              Yes |
| `scheme_id`          |                         Optional |
| `batch_number`       |                              Yes |
| `source_type`        | Yes: manual, csv, xlsx, pdf, api |
| `source_document_id` |                         Optional |
| `payment_date`       |                              Yes |
| `bank_reference`     |                         Optional |
| `total_paid`         |                              Yes |
| `import_status`      |                              Yes |
| `matched_amount`     |                              Yes |
| `unmatched_amount`   |                              Yes |
| `created_by`         |                              Yes |
| `created_at`         |                              Yes |

## 15.6 Add `remittance_lines`

| Field                   | Required |
| ----------------------- | -------: |
| `id`                    |      Yes |
| `remittance_batch_id`   |      Yes |
| `payer_claim_reference` | Optional |
| `internal_claim_id`     | Optional |
| `member_number`         | Optional |
| `patient_name`          | Optional |
| `service_date`          | Optional |
| `claimed_amount`        | Optional |
| `approved_amount`       | Optional |
| `paid_amount`           |      Yes |
| `denied_amount`         | Optional |
| `denial_code`           | Optional |
| `denial_reason`         | Optional |
| `match_status`          |      Yes |
| `matched_by`            | Optional |
| `matched_at`            | Optional |

---

## 16. API additions and refinements

## 16.1 Tariff endpoints

| Endpoint                                   | Purpose                              |
| ------------------------------------------ | ------------------------------------ |
| `POST /tariffs/import`                     | Import tariff file                   |
| `POST /tariffs/{id}/map-lines`             | Map payer codes to internal services |
| `POST /tariffs/{id}/validate`              | Run tariff validation                |
| `POST /tariffs/{id}/approve`               | Approve tariff version               |
| `GET /tariffs/active?payer=&scheme=&date=` | Get active tariff                    |
| `GET /tariffs/compare?old=&new=`           | Compare versions                     |

## 16.2 Claim format endpoints

| Endpoint                           | Purpose                                |
| ---------------------------------- | -------------------------------------- |
| `POST /claim-formats`              | Create format                          |
| `POST /claim-formats/{id}/fields`  | Add field mapping                      |
| `POST /claim-formats/{id}/approve` | Approve format                         |
| `POST /claims/{id}/render`         | Render PDF/Excel/JSON/portal checklist |
| `POST /claims/{id}/generate-pack`  | Generate PDF/ZIP claim bundle          |

## 16.3 Attachment matrix endpoints

| Endpoint                               | Purpose                    |
| -------------------------------------- | -------------------------- |
| `POST /attachment-rulesets`            | Create ruleset             |
| `POST /attachment-rulesets/{id}/rules` | Add rule                   |
| `POST /claims/{id}/check-attachments`  | Validate attachments       |
| `POST /claims/{id}/waive-attachment`   | Waive with reason/approval |

## 16.4 Pre-auth endpoints

| Endpoint                                     | Purpose                         |
| -------------------------------------------- | ------------------------------- |
| `POST /preauth-rules`                        | Create pre-auth rule            |
| `POST /preauthorisations`                    | Create request                  |
| `POST /preauthorisations/{id}/submit-manual` | Record portal/manual submission |
| `POST /preauthorisations/{id}/decision`      | Record decision                 |
| `GET /preauthorisations/sla-breaches`        | SLA report                      |

## 16.5 Remittance endpoints

| Endpoint                                   | Purpose                    |
| ------------------------------------------ | -------------------------- |
| `POST /remittance-formats`                 | Create import template     |
| `POST /remittances/import`                 | Upload CSV/Excel/PDF       |
| `POST /remittances/{id}/match`             | Match lines                |
| `POST /remittances/{id}/post`              | Post reconciliation        |
| `GET /remittances/unmatched`               | Unmatched remittance lines |
| `POST /remittance-lines/{id}/manual-match` | Manual match               |

---

## 17. Final workflows

## 17.1 Manual SHA claim workflow

```text
1. Visit is completed and signed
2. Claim validation runs
3. Claim bundle generated
4. SHA claim format rendered
5. Claims officer logs into provider portal
6. Claim entered/uploaded manually
7. Portal reference captured
8. Submission screenshot/acknowledgement uploaded
9. Claim status tracked manually or through imported portal reports
10. Payment/remittance imported and reconciled
```

## 17.2 Private insurer claim workflow

```text
1. Payer and scheme selected
2. Eligibility verified manually/API/card
3. Tariff applied
4. Pre-auth captured if required
5. Claim bundle generated using insurer format
6. Submitted by portal/email/API/manual
7. Response/denial/remittance captured
8. Reconciliation posted
```

## 17.3 Tariff update workflow

```text
1. New tariff source received
2. Upload as tariff source document
3. Import/enter tariff lines
4. Map to internal services
5. Compare with old tariff
6. Approve with effective date
7. New claims use new tariff
8. Old submitted claims retain old tariff
```

## 17.4 Attachment validation workflow

```text
1. Claim lines created
2. Attachment rules run by payer/scheme/service
3. Missing attachments listed
4. Responsible module/user assigned
5. Attachments pulled from EMR/lab/pharmacy/billing
6. Claim becomes ready only when required attachments are present or waived
```

## 17.5 Remittance import workflow

```text
1. Payer sends payment/remittance
2. Accountant uploads CSV/Excel/PDF or enters manually
3. System parses lines
4. Matching algorithm runs
5. Matched claims update paid/denied/underpaid status
6. Unmatched lines go to suspense
7. Denials create denial tasks
8. Approved reconciliation posts accounting journals
```

---

## 18. Developer acceptance criteria

## 18.1 Tariff tables

| Test                             | Expected result                                 |
| -------------------------------- | ----------------------------------------------- |
| Import tariff file               | Tariff table and lines created                  |
| Missing internal service mapping | Tariff approval blocked or line marked unmapped |
| Duplicate payer code             | Validation error                                |
| New tariff effective date        | Claims on/after date use new version            |
| Old claim opened                 | Retains old tariff version                      |
| Tariff comparison                | Shows new, removed, changed amounts             |
| Superseded tariff                | Cannot be used for new claims after end date    |

## 18.2 SHA/manual portal

| Test                     | Expected result                       |
| ------------------------ | ------------------------------------- |
| Generate SHA claim pack  | PDF/ZIP/checklist produced            |
| Capture portal reference | Claim status becomes submitted/manual |
| Upload portal screenshot | Stored as submission evidence         |
| Mark claim returned      | Denial/return reason required         |
| Mark claim approved      | Approved amount captured              |
| Mark claim paid          | Reconciliation required               |
| No API credentials       | Manual workflow still works           |

## 18.3 Claim formats

| Test                        | Expected result                             |
| --------------------------- | ------------------------------------------- |
| Render private OPD form     | Fields populated from patient/visit/billing |
| Missing required field      | Claim format validation blocks export       |
| Render pharmacy claim       | Prescription and dispense fields included   |
| Render lab claim            | Verified lab result attached                |
| Render capitation encounter | No normal receivable unless carve-out       |

## 18.4 Attachments

| Test                                       | Expected result                           |
| ------------------------------------------ | ----------------------------------------- |
| Lab claim missing result                   | Submission blocked                        |
| Drug claim missing dispense                | Submission blocked                        |
| Referral-required service missing referral | Submission blocked                        |
| Missing attachment waived                  | Approval and reason required              |
| Attachment changed after submission        | New claim version/resubmission required   |
| Claim pack index                           | Lists all required and included documents |

## 18.5 Pre-authorisation

| Test                      | Expected result                              |
| ------------------------- | -------------------------------------------- |
| Service requires pre-auth | Claim line blocked until approval            |
| Pre-auth approved         | Approval number, amount, validity stored     |
| Pre-auth expired          | Claim blocked or warning based on policy     |
| Emergency service         | Pre-auth bypass with emergency documentation |
| SLA exceeded              | Alert created                                |
| Partial approval          | Patient balance or extension request created |

## 18.6 Remittance

| Test                      | Expected result              |
| ------------------------- | ---------------------------- |
| Import CSV remittance     | Lines parsed                 |
| Exact claim match         | Claim marked paid/reconciled |
| Partial payment           | Variance created             |
| Denial code in file       | Denial record created        |
| Unknown claim             | Unmatched queue              |
| Overpayment               | Suspense/overpayment record  |
| Post reconciliation       | Accounting journals created  |
| Duplicate remittance line | Duplicate flagged            |

---

## 19. Implementation sequence

## Phase 1: Configurable claims core

Build:

```text
payers
benefit_schemes
scheme_members
claim_formats
claim_format_fields
tariff_tables
tariff_lines
attachment_rulesets
attachment_rules
claims
claim_lines
claim_versions
```

## Phase 2: Validation and manual submission

Build:

```text
claim_validation_rules
claim validation engine
claim readiness screen
manual portal submission tracking
claim pack generator
attachment index
```

## Phase 3: Pre-authorisation

Build:

```text
preauth_service_rules
preauthorisations
preauth decisions
SLA alerts
preauth-to-claim linking
```

## Phase 4: Denials and tasks

Build:

```text
denial_code_sets
denial_codes
claim_denials
claim_tasks
resubmission workflow
write-off / patient-balance transfer
```

## Phase 5: Remittance and reconciliation

Build:

```text
remittance_format_templates
remittance_batches
remittance_lines
matching algorithm
reconciliation batches
accounting postings
```

## Phase 6: Integration adapters

Build only after current specs are obtained:

```text
SHA provider portal/API adapter
private insurer adapters
employer scheme adapters
FHIR Claim/ClaimResponse adapter
status webhooks/importers
```

---

## 20. Final handoff summary

Module 7 is now developer-ready with these final decisions:

| Area                        | Final state                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| SHA/private volatility      | Handled through versioned payer configuration                                                                     |
| Tariff tables               | Importable, versioned, source-linked                                                                              |
| SHA integration             | Manual-first, adapter-ready                                                                                       |
| Private insurer integration | Configurable formats, adapter-ready                                                                               |
| Claim formats               | Template-driven                                                                                                   |
| Required attachments        | Matrix-driven                                                                                                     |
| Pre-authorisation           | Rule-driven with SLA and approval limits                                                                          |
| Denials                     | Payer-code + internal category model                                                                              |
| Remittance                  | Manual/CSV/Excel/PDF/API-ready                                                                                    |
| Reconciliation              | Claim-line-level and accounting-ready                                                                             |
| Developer readiness         | High for core engine; automated live integration waits for specs/credentials                                      |
| Production risk             | Tariffs, payer rules, attachment matrices, and API behaviours need payer/current portal validation before go-live |

The closed Module 7 rule is:

```text
No insured claim should be submitted unless the system can prove:
the payer and scheme were active,
the patient was eligible,
the provider/facility was contracted,
the correct tariff version was used,
the service was covered,
pre-authorisation was obtained where required,
the clinical evidence exists,
the required attachments are present,
the claim format is valid for that payer,
the submission reference is captured,
denials can be corrected or written off,
and every paid amount can be reconciled to the original claim line.
```

[1]: https://new.kenyalaw.org/akn/ke/act/ln/2025/56 "
      Tariffs for Healthcare Services, 2025
    - Kenya Law"
[2]: https://new.kenyalaw.org/akn/ke/act/ln/2024/49 "
      The Social Health Insurance Regulations
    - Kenya Law"
[3]: https://portal.sha.go.ke/ "SHA | Provider Portal"
