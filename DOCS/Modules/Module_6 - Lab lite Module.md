# Module 6: Lab-lite Module

This module is the **basic diagnostic workflow engine** for small clinics.

Modules 1–5 answer:

```text
Module 1: Is the clinic/lab/professional licensed?
Module 2: Was the test billed, paid, invoiced, and receipted?
Module 3: Did the prescription flow safely to pharmacy?
Module 4: Were reagents, consumables, stock, batch, and expiry controlled?
Module 5: Was the clinical visit documented?
Module 6: Was the lab test ordered, paid for, collected, resulted, verified, reported, and linked back to the patient visit?
```

A small clinic may not need a full laboratory information system, but it still needs a controlled workflow for:

```text
test catalogue → order → billing → sample collection → result entry → verification → clinician review → print/share → claims/reporting
```

For Kenya, the module should respect the fact that medical laboratory practice is regulated. KMLTTB states that it has statutory mandate over the training, business, practice, and employment of medical laboratory technicians and technologists in Kenya, and its professional-registration page states that every Medical Laboratory Science professional practising in Kenya must be registered and licensed with KMLTTB. ([kmlttb.org](https://www.kmlttb.org/)) ([kmlttb.org](https://www.kmlttb.org/registration/))

---

## 1. Purpose of the module

The Lab-lite Module should:

| Purpose                 | Practical meaning                                                   |
| ----------------------- | ------------------------------------------------------------------- |
| Maintain test catalogue | CBC, malaria, urinalysis, glucose, pregnancy test, etc.             |
| Receive orders          | From clinician, reception, package, or walk-in workflow             |
| Link tests to billing   | Prevent unbilled tests and claim gaps                               |
| Track samples           | Ordered, paid, collected, rejected, in process, resulted, verified  |
| Capture results         | Numeric, text, coded, attachment, panel result                      |
| Support verification    | Lab professional reviews before release                             |
| Print/share results     | Patient copy, clinician copy, claim/referral copy                   |
| Support external labs   | Track send-outs to partner/reference labs                           |
| Link to EMR             | Results return to patient visit and clinician review                |
| Link to inventory       | Reagents, test kits, vacutainers, strips, swabs, consumables        |
| Support audit           | Who ordered, collected, tested, verified, corrected, printed        |
| Support claims          | Diagnosis, order, result, billing, clinician, and facility evidence |

---

## 2. Kenya-specific design basis

## A. Laboratory professional and facility control

The Medical Laboratory Technicians and Technologists Act provides for the training, registration, and licensing of medical laboratory technicians and technologists and establishes KMLTTB. The Act defines “medical laboratory” broadly to include any facility where medical laboratory analysis and investigations are carried out, including hospital laboratories. It also gives the Board power to licence and regulate the business and practice of registered laboratory technicians and technologists. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/1999/10/eng@2022-12-31))

Software implication:

| Requirement                             | Lab-lite behaviour                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| Lab service enabled only where licensed | Module 1 should confirm facility/lab permission                                             |
| Lab professional must be valid          | Result entry/verification should require active KMLTTB professional record                  |
| Lab in-charge/superintendent            | Branch should have responsible laboratory professional                                      |
| Lab branch-specific control             | Each branch should have its own lab setup, users, services, and reports                     |
| Scope of tests                          | Clinic should only offer tests it is configured, equipped, staffed, and licensed to perform |

KMLTTB’s public/private laboratory application form states that all medical laboratory services must be supervised by persons holding a practising certificate and annual licence, and that medical laboratory branches must apply, be inspected, registered, licensed, and have a different medical laboratory superintendent. ([kmlttb.org](https://www.kmlttb.org/downloads/APPLICATION%20FORM%20FOR%20PUBLIC%20%26%20PRIVATE%20LABORATORIES%20KMLTTBLAB06.pdf))

---

## B. Digital health and interoperability

Kenya’s Digital Health Act establishes shared digital-health resources such as a national health data dictionary, client registry, facility registry, health worker registry, interoperability layer, shared health records, health management information systems, and finance/insurance services. Lab data should therefore be structured enough to plug into future national interoperability requirements. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/2023/15))

The 2025 Digital Health Data Exchange Component Regulations state that the national and county health data banks comprise centralized information systems that collate client-level minimum datasets and aggregate data from certified digital health solutions, and that transmitted data must be stored, reviewed, audited, updated, and secured in accordance with the Act and regulations. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2025/77/eng@2025-04-11))

Software implication:

| Requirement           | Lab-lite behaviour                                                     |
| --------------------- | ---------------------------------------------------------------------- |
| Structured test names | Use standard test catalogue, local codes, and LOINC-ready mapping      |
| Structured results    | Numeric, coded, text, reference ranges, abnormal flags                 |
| Patient-level linkage | Every result should link to patient, visit, order, and facility        |
| Audit trail           | Every result entry, verification, correction, print, and export logged |
| Interoperability      | FHIR-ready ServiceRequest, Specimen, Observation, DiagnosticReport     |
| Data quality          | Required fields, validation, corrected-result workflow                 |

HL7 FHIR’s ServiceRequest is used for orders or requests for services such as diagnostic investigations, and DiagnosticReport is intended for laboratory reports and can reference Observations as atomic results. LOINC provides universal names and codes for identifying laboratory and clinical test results and supports interoperability between systems. ([hl7.org](https://fhir.hl7.org/fhir/servicerequest.html)) ([hl7.org](https://fhir.hl7.org/fhir/diagnosticreport.html)) ([regenstrief.org](https://www.regenstrief.org/real-world-solutions/loinc/))

---

## 3. What “Lab-lite” means

A Lab-lite module is not a full enterprise LIS. It should avoid unnecessary complexity, but still handle the core outpatient lab workflow.

## Lab-lite includes

| Included            | Example                                                       |
| ------------------- | ------------------------------------------------------------- |
| Test catalogue      | Malaria test, CBC, urinalysis, pregnancy test                 |
| Basic ordering      | Clinician or reception orders test                            |
| Billing link        | Test must be paid/covered before processing, depending policy |
| Sample tracking     | Ordered, collected, resulted, verified                        |
| Result entry        | Numeric, coded, text, attachments                             |
| Result verification | Lab in-charge or authorized staff release result              |
| Result printout     | Patient and clinician copy                                    |
| Send-out tracking   | External reference lab workflow                               |
| Basic QC flagging   | Control results, kit lot, abnormal/critical flag              |
| Inventory link      | Kits/reagents/consumables consumed                            |
| Claims support      | Attach result to visit/claim                                  |
| Audit trail         | All lab actions logged                                        |

## Lab-lite does not need, at MVP stage

| Not necessary at MVP                  | Reason                                |
| ------------------------------------- | ------------------------------------- |
| Full analyser integration             | Expensive and complex                 |
| Advanced middleware                   | Not needed for small clinics          |
| Full ISO 15189 document-control suite | Can come later                        |
| Complex microbiology workflow         | Usually not done in small clinics     |
| Histopathology/cytology workflow      | Usually external send-out             |
| Blood bank workflow                   | High-risk, requires separate controls |
| Advanced QC/statistics                | Add in later versions                 |
| Full HL7 v2 analyser interfaces       | Add when volumes justify it           |

---

## 4. Core users

| User                         | Main actions                                                      |
| ---------------------------- | ----------------------------------------------------------------- |
| Receptionist                 | Registers patient, bills lab test, sends to lab queue             |
| Clinician                    | Orders tests, reviews results, acts on result                     |
| Lab technician/technologist  | Collects sample, performs test, enters result                     |
| Lab in-charge/superintendent | Verifies results, manages catalogue, handles QC/send-outs         |
| Nurse/triage staff           | May collect simple samples where allowed by facility policy       |
| Billing officer              | Confirms payment, insurer/SHA cover, credit, package billing      |
| Claims officer               | Uses result as evidence for claim                                 |
| Branch manager               | Reviews lab revenue, pending tests, rejected samples              |
| Inventory/storekeeper        | Manages kits, reagents, tubes, strips                             |
| Auditor/compliance officer   | Reviews result changes, access logs, unbilled tests, verification |

---

## 5. Relationship with other modules

## Module 1: Organisation and Licensing

| Data from Module 1            | Lab-lite use                            |
| ----------------------------- | --------------------------------------- |
| KMPDC facility licence        | Confirms clinic facility status         |
| KMLTTB lab facility record    | Enables lab services                    |
| Lab in-charge/superintendent  | Required for lab governance             |
| Lab professional licences     | Controls result entry/verification      |
| Branch service permissions    | Determines which tests can be performed |
| SHA/private insurer contracts | Enables payer lab claims                |

## Module 2: POS and Billing

| Billing event         | Lab-lite effect                             |
| --------------------- | ------------------------------------------- |
| Lab test billed       | Order can proceed                           |
| Payment completed     | Sample collection/testing allowed           |
| Insurer authorization | Claim-linked order allowed                  |
| Credit customer bill  | Lab proceeds if credit policy allows        |
| Refund/credit note    | Lab order cancellation or correction        |
| eTIMS invoice         | Test sale recorded for tax/commercial audit |

## Module 4: Inventory

| Inventory item | Lab-lite use                                    |
| -------------- | ----------------------------------------------- |
| Test kits      | Malaria RDT, pregnancy kit                      |
| Reagents       | Chemistry/haematology/urinalysis                |
| Consumables    | Gloves, lancets, vacutainers, swabs, slides     |
| Batch/expiry   | Kit/reagent safety and traceability             |
| Cold-chain     | Temperature-sensitive reagents/kits             |
| Stockout       | Prevent ordering tests that cannot be performed |
| QC material    | Quality control tracking                        |

## Module 5: Clinic EMR

| EMR event                     | Lab-lite effect             |
| ----------------------------- | --------------------------- |
| Clinician orders test         | Lab order created           |
| Diagnosis/clinical indication | Linked to lab order         |
| Result released               | EMR receives result         |
| Critical result               | Clinician alerted           |
| Visit summary                 | Lab result included         |
| Claim packet                  | Result attached as evidence |

---

## 6. Core lab transaction types

| Transaction               | Description                                     |
| ------------------------- | ----------------------------------------------- |
| Clinician-ordered test    | Test ordered during consultation                |
| Reception-ordered test    | Walk-in or package test ordered at front desk   |
| Package/bundle test       | Consultation + lab package                      |
| Paid lab test             | Cash/M-Pesa/card paid test                      |
| Insurer/SHA lab test      | Payer-covered test                              |
| Credit/corporate lab test | Employer/company account                        |
| External send-out         | Sample sent to reference lab                    |
| Repeat/retest             | Result repeated due to error/QC/clinical reason |
| Cancelled test            | Test cancelled before completion                |
| Rejected sample           | Sample unsuitable for testing                   |
| Corrected result          | Result amended after release                    |
| Critical result           | Urgent abnormal result requiring escalation     |

---

## 7. Feature-by-feature design

## A. Test catalogue

The test catalogue is the foundation. It determines what can be ordered, billed, collected, resulted, printed, claimed, and reported.

### Common small-clinic test catalogue

| Category                     | Tests                                                                |
| ---------------------------- | -------------------------------------------------------------------- |
| Malaria/fever                | Malaria RDT, malaria microscopy where available                      |
| Haematology                  | CBC/FBC, haemoglobin, blood group if offered                         |
| Urine                        | Urinalysis, urine microscopy, pregnancy test                         |
| Glucose/diabetes             | Random blood sugar, fasting blood sugar, HbA1c if available/external |
| Infectious disease screening | HIV test, HBsAg, syphilis, COVID/flu where configured and compliant  |
| Stool                        | Stool microscopy, occult blood where available                       |
| Chemistry                    | Urea/creatinine, LFTs, lipids, electrolytes if available/external    |
| Reproductive health          | Pregnancy test, antenatal screening tests                            |
| External send-out            | Tests not performed in-house                                         |
| Procedure-linked tests       | Pre-op or certificate-related tests where lawful                     |

### Test catalogue fields

| Field                    |          Required? | Notes                                    |
| ------------------------ | -----------------: | ---------------------------------------- |
| Test code                |                Yes | Internal code                            |
| Test name                |                Yes | Example: Malaria RDT                     |
| Short name               |        Recommended | For receipts and screens                 |
| Test category            |                Yes | Haematology, chemistry, urine, etc.      |
| Local code               |                Yes | Facility code                            |
| LOINC code               | Optional/MVP-ready | For interoperability                     |
| Specimen type            |                Yes | Blood, urine, stool, swab, serum, plasma |
| Collection container     |        Recommended | EDTA tube, urine container, plain tube   |
| Sample volume            |           Optional | Useful for venous blood tests            |
| Method                   |           Optional | RDT, microscopy, analyser, manual        |
| Result type              |                Yes | Numeric, coded, text, panel, attachment  |
| Unit                     |         If numeric | mmol/L, g/dL, %, cells/µL                |
| Reference range          |        Recommended | Age/sex-specific where possible          |
| Critical limits          |           Optional | Triggers urgent alert                    |
| Turnaround time          |        Recommended | Example: 15 min, 2 hrs, 24 hrs           |
| In-house or external     |                Yes | Determines workflow                      |
| External lab partner     |        If send-out | Default reference lab                    |
| Price                    |                Yes | Linked to price list                     |
| Tax code                 |                Yes | For billing/eTIMS configuration          |
| Claim code/tariff        |         If insured | SHA/private insurer mapping              |
| Consumables used         |           Optional | Inventory deduction                      |
| Reagent/test-kit link    |           Optional | Stock control                            |
| Requires fasting         |             Yes/no | Patient instruction                      |
| Requires consent         |             Yes/no | Sensitive tests                          |
| Requires clinician order |             Yes/no | Prevent inappropriate walk-in tests      |
| Requires verification    |             Yes/no | Usually yes                              |
| Active status            |                Yes | Active/inactive/discontinued             |

### Test catalogue rules

| Rule                          | System behaviour                                    |
| ----------------------------- | --------------------------------------------------- |
| Test inactive                 | Cannot order                                        |
| Test external                 | Route to send-out workflow                          |
| Test requires payment         | Block collection/testing until billing status valid |
| Test requires clinician order | Reception cannot order without clinician            |
| Test requires consent         | Capture consent before collection                   |
| Test has no price             | Block billing                                       |
| Test has no result template   | Warn before activation                              |
| Test has consumables          | Check stock availability                            |
| Test has critical limits      | Auto-flag critical result                           |
| Insurer/SHA test              | Apply payer tariff and authorization rules          |

---

## B. Sample status

Sample tracking prevents lost samples, unpaid testing, duplicate results, and unclear accountability.

### Recommended sample/order lifecycle

```text
Ordered
Awaiting billing
Billed
Paid / Covered / Approved credit
Awaiting collection
Collected
Rejected
In process
Result entered
Pending verification
Verified
Released
Printed / Shared
Clinician reviewed
Completed
```

Exception statuses:

```text
Cancelled
Refund pending
Repeat requested
Corrected
Sent out
Received by external lab
External result received
Delayed
Lost
```

### Order-level status versus sample-level status

A single order may have multiple tests and samples. For example:

```text
Order: Fever workup
Tests: Malaria RDT, CBC, urinalysis
Samples: Finger-prick blood, EDTA blood, urine
```

Therefore, the system should track:

| Level           | Example                                      |
| --------------- | -------------------------------------------- |
| Lab order       | Whole order/request                          |
| Test line       | CBC, malaria, urinalysis                     |
| Specimen/sample | EDTA tube, urine container                   |
| Result          | Hb, WBC, platelet, malaria positive/negative |

### Sample fields

| Field                   |   Required? | Notes                                                  |
| ----------------------- | ----------: | ------------------------------------------------------ |
| Sample ID/barcode       |         Yes | Unique                                                 |
| Order ID                |         Yes | Link to order                                          |
| Patient                 |         Yes | Link                                                   |
| Visit                   | Recommended | Link to EMR                                            |
| Specimen type           |         Yes | Blood, urine, stool                                    |
| Collection container    | Recommended | EDTA/plain/urine container                             |
| Collected by            |         Yes | User                                                   |
| Collection date/time    |         Yes |                                                        |
| Collection location     |    Optional | Lab, ward, outreach                                    |
| Sample condition        |         Yes | Acceptable, clotted, haemolysed, insufficient, leaking |
| Sample status           |         Yes | Collected, rejected, sent out, processed               |
| Rejection reason        | If rejected | Mandatory                                              |
| Received by lab         |    Optional | For split collection/testing                           |
| Received date/time      |    Optional |                                                        |
| Storage condition       |    Optional | Room temp/fridge/frozen                                |
| Dispatch details        | If external | Courier/reference lab                                  |
| Chain-of-custody events | Recommended | Collection, dispatch, receipt                          |

### Sample status rules

| Rule                                  | System behaviour                                                  |
| ------------------------------------- | ----------------------------------------------------------------- |
| Order not billed/covered              | Block collection/testing unless emergency or credit policy allows |
| Sample not collected                  | Result entry blocked                                              |
| Sample rejected                       | Result entry blocked; recollection task created                   |
| Sample collected by unauthorized user | Block or require lab in-charge approval                           |
| External sample                       | Must have dispatch and receiving lab details                      |
| Critical test delayed                 | Alert lab and clinician                                           |
| Sample lost                           | Incident and recollection workflow                                |
| Duplicate sample ID                   | Block                                                             |
| Result entered before collection      | Block unless legacy/external upload workflow                      |

---

## C. Result entry

Result entry must handle simple rapid tests, numeric tests, panel tests, text reports, and uploaded external PDFs.

### Result types

| Result type       | Example                               |
| ----------------- | ------------------------------------- |
| Numeric           | Glucose 7.8 mmol/L                    |
| Coded             | Positive/negative                     |
| Semi-quantitative | Protein ++, ketones +                 |
| Text              | “No malaria parasites seen”           |
| Panel             | CBC with Hb, WBC, platelets           |
| Attachment        | External lab PDF                      |
| Image             | Microscopy image, scanned report      |
| Comment-only      | “Sample haemolysed; repeat requested” |

### Result fields

| Field                     |               Required? | Notes                                    |
| ------------------------- | ----------------------: | ---------------------------------------- |
| Result ID                 |                     Yes | Auto                                     |
| Order/test ID             |                     Yes |                                          |
| Sample ID                 |  Yes where sample-based |                                          |
| Patient                   |                    Auto |                                          |
| Visit                     |                    Auto |                                          |
| Test name                 |                    Auto |                                          |
| Result value              |                     Yes | Numeric/coded/text                       |
| Unit                      |              If numeric |                                          |
| Reference range           |             Recommended | Auto from catalogue                      |
| Abnormal flag             |             Auto/manual | Low, high, critical                      |
| Interpretation            |                Optional | Reactive/non-reactive, positive/negative |
| Result comment            |                Optional |                                          |
| Method                    |                Optional | RDT/analyser/manual                      |
| Kit/reagent lot           |             Recommended | Traceability                             |
| Kit/reagent expiry        |             Recommended |                                          |
| Result entered by         |                    Auto |                                          |
| Result entered at         |                    Auto |                                          |
| Verified by               | Required before release |                                          |
| Verified at               | Required before release |                                          |
| Corrected result flag     |              If amended |                                          |
| Previous result reference |            If corrected |                                          |
| Attachment                |                Optional | PDF/image                                |
| Clinician reviewed        |                  Yes/no |                                          |
| Patient notified          |                  Yes/no |                                          |

### Reference range configuration

Reference ranges should be configurable by:

| Factor    | Example                                    |
| --------- | ------------------------------------------ |
| Age       | Child versus adult                         |
| Sex       | Male/female Hb range                       |
| Pregnancy | Pregnancy-specific ranges where configured |
| Method    | Lab method/analyser differences            |
| Unit      | mmol/L versus mg/dL                        |
| Facility  | Different devices/reference materials      |

### Abnormal and critical flags

| Flag              | Behaviour                            |
| ----------------- | ------------------------------------ |
| Normal            | No special action                    |
| Low               | Mark low                             |
| High              | Mark high                            |
| Critical low      | Alert clinician/lab in-charge        |
| Critical high     | Alert clinician/lab in-charge        |
| Positive/reactive | Follow configured notification rules |
| Invalid           | Repeat/recollect                     |
| Indeterminate     | Require comment and possible repeat  |

### Result correction model

The system should not silently overwrite released results.

| Correction step           | System behaviour                      |
| ------------------------- | ------------------------------------- |
| User requests correction  | Reason required                       |
| Original result retained  | Historical record remains             |
| Corrected result created  | New version issued                    |
| Correction approved       | Lab in-charge verifies                |
| Clinician notified        | If result already released            |
| Printout marked corrected | Shows corrected report status         |
| Audit preserved           | Old and new values visible to auditor |

---

## D. Billing link

The lab module must prevent unbilled tests, while still allowing emergency or credit-policy exceptions.

### Billing states

| Billing state   | Meaning                             |
| --------------- | ----------------------------------- |
| Not billable    | Included in package/no charge/admin |
| Pending billing | Order created but not billed        |
| Billed unpaid   | Invoice created, payment pending    |
| Paid            | Patient paid                        |
| Covered         | Insurer/SHA/corporate approved      |
| Credit approved | Customer account allowed            |
| Waived          | Authorized waiver                   |
| Refunded        | Payment reversed                    |
| Cancelled       | Test cancelled                      |

### Billing rules

| Rule                             | System behaviour                                             |
| -------------------------------- | ------------------------------------------------------------ |
| Payment-before-test policy       | Block collection until paid/covered                          |
| Payment-after-consult policy     | Allow test but flag unpaid until billing                     |
| Emergency policy                 | Allow collection, require later billing reason               |
| Insurer/SHA test                 | Require eligibility/preauth where configured                 |
| Corporate credit                 | Check credit limit and active contract                       |
| Test not priced                  | Cannot bill/order live test                                  |
| Cancelled before collection      | Reverse/credit billing if paid                               |
| Cancelled after collection       | Manager decision: refund/no refund                           |
| Result cannot be released unpaid | Configurable; recommended for cash patients                  |
| Claim packet                     | Include order, result, clinician, diagnosis, tariff, invoice |

### Billing integration flow

```text
Clinician orders test
→ Lab order appears in billing
→ Billing confirms payment/cover
→ Lab sees test as collectable
→ Lab collects sample
→ Result is entered and verified
→ Result returns to EMR
→ Claim/receipt/visit summary updated
```

### No-unbilled-test control

The system should produce a daily report:

| Report column                       |
| ----------------------------------- |
| Order number                        |
| Patient                             |
| Test                                |
| Ordered by                          |
| Billing status                      |
| Sample status                       |
| Result status                       |
| Reason if test done without payment |
| Approved by                         |

---

## E. Result printout

The result printout must be professional, readable, and controlled.

### Result printout contents

| Section                | Contents                                                            |
| ---------------------- | ------------------------------------------------------------------- |
| Facility header        | Clinic/lab name, branch, contacts, licence details where configured |
| Patient details        | Name, age, sex, patient number                                      |
| Visit/order details    | Order number, sample number, request date                           |
| Clinician              | Ordering clinician                                                  |
| Test details           | Test name, specimen, method                                         |
| Result                 | Value, unit, reference range, abnormal flag                         |
| Interpretation/comment | Lab comment                                                         |
| Collection details     | Collection date/time                                                |
| Result date            | Resulted and verified date/time                                     |
| Verified by            | Lab professional name/signature/PIN where configured                |
| Report status          | Final, preliminary, corrected, amended                              |
| QR/barcode             | Optional verification                                               |
| Footer                 | Confidentiality note, page number                                   |

### Printout types

| Type                 | Use                               |
| -------------------- | --------------------------------- |
| Patient copy         | Given to patient                  |
| Clinician copy       | Internal EMR view/print           |
| Claim copy           | Payer documentation               |
| Referral copy        | Attached to referral letter       |
| External upload copy | Scanned/PDF partner lab result    |
| Corrected report     | Replaces previously issued result |

### Result release rules

| Rule                         | System behaviour                                       |
| ---------------------------- | ------------------------------------------------------ |
| Result not verified          | Print with “unverified/draft” watermark or block print |
| Result corrected             | Print corrected version with correction status         |
| Sensitive result             | Restrict print/share permissions                       |
| Result reprint               | Require reason and log user                            |
| Patient copy by WhatsApp/SMS | Use secure link or minimal content, consent required   |
| Result shared externally     | Log recipient and purpose                              |

---

## F. External lab send-out

Small clinics often outsource tests they cannot perform. The module should track the sample, external lab, cost, status, and returned result.

### Send-out use cases

| Use case                    | Example                                   |
| --------------------------- | ----------------------------------------- |
| Test not available in-house | HbA1c, LFT, renal profile                 |
| Equipment breakdown         | CBC analyser unavailable                  |
| Specialist test             | Hormones, cultures, histology             |
| Confirmatory test           | Positive screening requiring confirmation |
| Insurance/payer requirement | Approved reference lab                    |
| Quality assurance           | Repeat/confirmation externally            |

### External lab partner fields

| Field                         |       Required? |                                     |
| ----------------------------- | --------------: | ----------------------------------- |
| External lab name             |             Yes |                                     |
| Contact person                |     Recommended |                                     |
| Phone/email                   |     Recommended |                                     |
| Address                       |     Recommended |                                     |
| Licence/accreditation details |     Recommended |                                     |
| Contract status               |     Recommended |                                     |
| Price list                    |     Recommended |                                     |
| Turnaround time               |     Recommended |                                     |
| Sample requirements           |     Recommended |                                     |
| Courier/dispatch method       |     Recommended |                                     |
| Result delivery method        |             Yes | Portal, email, WhatsApp, paper, API |
| Payment terms                 |     Recommended |                                     |
| Status                        | Active/inactive |                                     |

### Send-out order fields

| Field                  |         Required? | Notes                                |
| ---------------------- | ----------------: | ------------------------------------ |
| Send-out number        |               Yes | Auto                                 |
| Patient                |               Yes |                                      |
| Visit/order            |               Yes |                                      |
| Test                   |               Yes |                                      |
| External lab           |               Yes |                                      |
| Sample ID              |               Yes |                                      |
| Sample type            |               Yes |                                      |
| Collection date/time   |               Yes |                                      |
| Dispatch date/time     |               Yes |                                      |
| Dispatched by          |               Yes |                                      |
| Courier/driver         |          Optional |                                      |
| Receiving lab contact  |          Optional |                                      |
| Received confirmation  |       Recommended |                                      |
| Expected result date   |       Recommended |                                      |
| External lab reference |       Recommended |                                      |
| External cost          |       Recommended | Margin                               |
| Patient charge         |               Yes | Billing                              |
| Status                 |               Yes | Sent, received, processing, resulted |
| Result attachment      | Yes when returned | PDF/image                            |
| Result values          |          Optional | Structured entry                     |
| Verified internally    |            Yes/no | Local review before release          |
| Delay reason           |        If delayed |                                      |

### Send-out status lifecycle

```text
Ordered
Billed/covered
Collected
Packed
Dispatched
Received by external lab
In process externally
External result received
Internal review pending
Verified/released
Completed
```

Exception statuses:

```text
Rejected by external lab
Lost in transit
Delayed
Cancelled
Recollection required
Corrected by external lab
```

### Send-out rules

| Rule                               | System behaviour                                          |
| ---------------------------------- | --------------------------------------------------------- |
| External test ordered              | Route to send-out workflow                                |
| Sample not collected               | Cannot dispatch                                           |
| Dispatch missing                   | Send-out remains pending                                  |
| External lab overdue               | Alert lab/reception/clinician                             |
| Result received as PDF             | Attach to result and optionally extract structured values |
| External result not reviewed       | Do not release until internal review, if policy requires  |
| External lab cost missing          | Warn margin/accounting                                    |
| External lab rejects sample        | Create recollection/refund/credit workflow                |
| Result from external lab corrected | Keep old result and issue corrected report                |

---

## 8. Required screens

## Screen 1: Lab dashboard

Cards:

```text
Orders waiting billing
Orders ready for collection
Samples collected
Samples rejected
Tests in process
Results pending verification
Critical results
External send-outs pending
External results overdue
Unbilled lab tests
Lab revenue today
```

---

## Screen 2: Test catalogue

Sections:

| Section          | Contents                                   |
| ---------------- | ------------------------------------------ |
| Identity         | Test name, code, category                  |
| Specimen         | Type, container, volume                    |
| Result template  | Numeric/coded/text/panel                   |
| Reference ranges | Age/sex/method-specific                    |
| Billing          | Price, tariff, tax, claim code             |
| Workflow         | In-house/external, TAT, verification       |
| Inventory        | Test kit, reagent, consumables             |
| Controls         | Requires fasting, consent, clinician order |
| Interoperability | LOINC code, FHIR mapping                   |
| Status           | Active/inactive                            |

---

## Screen 3: Lab order screen

Used by clinician or reception.

Fields:

| Field                         |
| ----------------------------- |
| Patient                       |
| Visit                         |
| Ordering clinician            |
| Diagnosis/clinical indication |
| Test(s)                       |
| Priority                      |
| Payer                         |
| Billing status                |
| Notes                         |
| Sample instructions           |

Actions:

```text
Order test
Send to billing
Cancel order
Print sample label
```

---

## Screen 4: Sample collection screen

Features:

| Feature                              |
| ------------------------------------ |
| Search by patient/order/queue number |
| Show paid/covered status             |
| Print sample barcode                 |
| Capture specimen type                |
| Capture collected by/date/time       |
| Capture sample condition             |
| Reject sample with reason            |
| Send to testing or send-out          |

---

## Screen 5: Result entry screen

Features:

| Feature                             |
| ----------------------------------- |
| Test-specific template              |
| Numeric result entry                |
| Unit and reference range            |
| Positive/negative dropdown          |
| Urinalysis semi-quantitative fields |
| CBC panel fields                    |
| Text comments                       |
| Attachment upload                   |
| Abnormal/critical flag              |
| Save draft                          |
| Submit for verification             |

---

## Screen 6: Result verification screen

Features:

| Feature                      |
| ---------------------------- |
| Pending verification queue   |
| Patient/order/sample context |
| Result values                |
| Reference ranges             |
| Critical flags               |
| Previous results             |
| Kit/reagent lot              |
| Approve/reject/correct       |
| Verification signature/PIN   |
| Release result               |

---

## Screen 7: Result print/share screen

Features:

| Feature                 |
| ----------------------- |
| Result preview          |
| Patient copy            |
| Clinician copy          |
| Claim copy              |
| Print PDF               |
| Send secure link        |
| Reprint reason          |
| Corrected report status |
| Print history           |

---

## Screen 8: External lab send-out screen

Sections:

| Section        | Contents                                    |
| -------------- | ------------------------------------------- |
| Send-out order | Patient, test, sample                       |
| External lab   | Partner lab and contact                     |
| Dispatch       | Courier, date/time, tracking                |
| Status         | Sent, received, processing, result received |
| Result         | Attachment/structured values                |
| Billing        | Patient charge, external cost               |
| Delay tracking | Overdue reason and follow-up                |
| Audit          | Chain of custody                            |

---

## Screen 9: Lab reports screen

Filters:

| Filter            |
| ----------------- |
| Date              |
| Branch            |
| Test              |
| Status            |
| Lab user          |
| Clinician         |
| Billing status    |
| Payer             |
| External lab      |
| Critical results  |
| Rejected samples  |
| Corrected results |

---

## 9. Workflows

## A. Clinician-ordered test

```text
1. Clinician orders test from EMR
2. Diagnosis/clinical indication is linked
3. Order appears in billing
4. Patient pays or payer cover is confirmed
5. Lab collects sample
6. Lab performs test
7. Result is entered
8. Result is verified
9. Result returns to clinician
10. Clinician reviews and updates plan
11. Result can be printed/shared
```

---

## B. Walk-in lab test

```text
1. Reception registers/selects patient
2. Reception selects test from catalogue
3. Billing confirms payment
4. Lab collects sample
5. Result is entered and verified
6. Patient receives result
7. If abnormal/critical, clinician review is recommended or required by policy
```

---

## C. Malaria RDT workflow

```text
1. Test ordered and paid/covered
2. Sample collected
3. RDT kit lot/expiry captured if configured
4. Result entered as positive/negative/invalid
5. Invalid result triggers repeat
6. Result verified
7. Clinician notified
8. Result appears in visit summary
```

---

## D. CBC panel workflow

```text
1. CBC ordered
2. EDTA sample collected
3. Result template opens CBC panel
4. Hb, WBC, platelet, RBC indices entered or imported
5. Abnormal values are flagged
6. Critical values trigger alert
7. Lab in-charge verifies result
8. Result is released to EMR/patient
```

---

## E. Urinalysis workflow

```text
1. Urinalysis ordered
2. Urine sample collected
3. Dipstick/microscopy fields entered
4. Semi-quantitative values captured: protein, glucose, ketones, blood, nitrite, leukocytes
5. Comments entered
6. Result verified and released
```

---

## F. External send-out workflow

```text
1. Clinician/reception orders external test
2. Patient pays or payer cover is confirmed
3. Sample is collected
4. Sample is packed and dispatched
5. External lab receipt is recorded
6. External result is received
7. Result PDF is uploaded or values entered
8. Internal lab user reviews/verifies
9. Result is released to clinician/patient
10. External cost and margin are recorded
```

---

## G. Sample rejection workflow

```text
1. Sample is found unsuitable
2. Lab user selects rejection reason
3. Order is marked sample rejected
4. Clinician/reception is notified
5. Recollection task is created
6. Billing rule decides refund/no refund/recollection free
7. Rejected sample appears in quality report
```

---

## H. Corrected result workflow

```text
1. Error is identified after result entry or release
2. Lab user requests correction
3. Reason is captured
4. Original result remains locked
5. Corrected result version is created
6. Lab in-charge verifies correction
7. Clinician and patient are notified where appropriate
8. Corrected report is printed/shared
9. Audit trail shows full history
```

---

## 10. Rules engine

## Test ordering

```text
RULE: Order lab test
IF test.status = active
AND branch.lab_service_enabled = true
AND test.available_at_branch = true
THEN allow order
ELSE block order
```

## Billing control

```text
RULE: Collect sample
IF lab_order.billing_status IN [paid, covered, credit_approved, waived]
OR lab_order.emergency_override = true
THEN allow sample collection
ELSE block collection
```

## Result entry

```text
RULE: Enter result
IF sample.status = collected
AND user.role IN [lab_technician, lab_technologist, lab_in_charge]
AND user.professional_licence_status = active
THEN allow result entry
ELSE block
```

## Verification

```text
RULE: Verify result
IF result.status = pending_verification
AND verifier.has_lab_verification_permission = true
AND verifier.professional_licence_status = active
THEN allow verification and release
ELSE block
```

## Critical result

```text
RULE: Critical result alert
IF result.value < test.critical_low
OR result.value > test.critical_high
OR result.coded_value IN configured_critical_values
THEN mark critical
AND alert ordering clinician
AND require notification action log
```

## External send-out

```text
RULE: Send external sample
IF test.performance_location = external
AND sample.status = collected
AND external_lab.status = active
AND billing_status IN [paid, covered, credit_approved]
THEN allow dispatch
ELSE block
```

## Result printing

```text
RULE: Print result
IF result.status = verified
THEN allow final printout
ELSE print draft/unverified copy only if user has permission
```

## Result correction

```text
RULE: Correct released result
IF result.status = released
THEN require correction_reason
AND create new version
AND require verification
AND notify clinician if already reviewed/released
```

---

## 11. Data model

## Main tables

### `lab_tests`

| Field                    |
| ------------------------ |
| id                       |
| test_code                |
| test_name                |
| short_name               |
| category                 |
| loinc_code               |
| specimen_type            |
| collection_container     |
| sample_volume            |
| method                   |
| result_type              |
| unit                     |
| default_reference_range  |
| turnaround_time_minutes  |
| performance_location     |
| default_external_lab_id  |
| price                    |
| tax_code_id              |
| claim_code               |
| requires_fasting         |
| requires_consent         |
| requires_clinician_order |
| requires_verification    |
| active_status            |
| created_at               |

### `lab_test_panels`

| Field             |
| ----------------- |
| id                |
| panel_test_id     |
| component_test_id |
| display_order     |
| required_flag     |

### `lab_reference_ranges`

| Field            |
| ---------------- |
| id               |
| lab_test_id      |
| sex              |
| min_age_days     |
| max_age_days     |
| pregnancy_status |
| method           |
| unit             |
| low_value        |
| high_value       |
| critical_low     |
| critical_high    |
| text_range       |
| active_status    |

### `lab_orders`

| Field               |
| ------------------- |
| id                  |
| order_number        |
| patient_id          |
| visit_id            |
| branch_id           |
| ordered_by          |
| order_source        |
| clinical_indication |
| diagnosis_id        |
| priority            |
| payer_type          |
| billing_status      |
| order_status        |
| created_at          |
| cancelled_at        |
| cancellation_reason |

### `lab_order_lines`

| Field                |
| -------------------- |
| id                   |
| lab_order_id         |
| lab_test_id          |
| performance_location |
| external_lab_id      |
| price                |
| billing_line_id      |
| status               |
| sample_required      |
| result_status        |
| created_at           |

### `lab_samples`

| Field             |
| ----------------- |
| id                |
| sample_number     |
| barcode           |
| lab_order_id      |
| lab_order_line_id |
| patient_id        |
| visit_id          |
| specimen_type     |
| container         |
| collected_by      |
| collected_at      |
| received_by       |
| received_at       |
| sample_condition  |
| sample_status     |
| rejection_reason  |
| storage_condition |
| notes             |

### `lab_results`

| Field                    |
| ------------------------ |
| id                       |
| result_number            |
| lab_order_line_id        |
| sample_id                |
| patient_id               |
| visit_id                 |
| result_type              |
| result_value_numeric     |
| result_value_text        |
| result_value_code        |
| unit                     |
| reference_range_text     |
| abnormal_flag            |
| critical_flag            |
| interpretation           |
| method                   |
| reagent_lot              |
| reagent_expiry           |
| entered_by               |
| entered_at               |
| status                   |
| verified_by              |
| verified_at              |
| released_at              |
| clinician_reviewed_by    |
| clinician_reviewed_at    |
| result_version           |
| corrected_from_result_id |

### `lab_result_components`

| Field             |
| ----------------- |
| id                |
| lab_result_id     |
| component_test_id |
| component_name    |
| value_numeric     |
| value_text        |
| value_code        |
| unit              |
| reference_range   |
| abnormal_flag     |
| critical_flag     |
| display_order     |

### `external_labs`

| Field                    |
| ------------------------ |
| id                       |
| lab_name                 |
| contact_person           |
| phone                    |
| email                    |
| address                  |
| licence_number           |
| accreditation_details    |
| contract_status          |
| payment_terms            |
| default_turnaround_hours |
| result_delivery_method   |
| status                   |

### `external_lab_sendouts`

| Field                     |
| ------------------------- |
| id                        |
| sendout_number            |
| lab_order_line_id         |
| sample_id                 |
| external_lab_id           |
| dispatch_datetime         |
| dispatched_by             |
| courier_name              |
| tracking_reference        |
| received_confirmation     |
| received_by_external_lab  |
| expected_result_datetime  |
| external_reference_number |
| external_cost             |
| patient_charge            |
| status                    |
| delay_reason              |
| result_received_at        |
| reviewed_by               |
| reviewed_at               |

### `lab_result_documents`

| Field         |
| ------------- |
| id            |
| lab_result_id |
| document_type |
| file_url      |
| file_hash     |
| uploaded_by   |
| uploaded_at   |
| status        |

### `lab_quality_events`

| Field        |
| ------------ |
| id           |
| event_type   |
| lab_order_id |
| sample_id    |
| result_id    |
| description  |
| severity     |
| action_taken |
| reported_by  |
| reviewed_by  |
| created_at   |
| closed_at    |
| status       |

### `lab_audit_logs`

| Field          |
| -------------- |
| id             |
| entity_type    |
| entity_id      |
| patient_id     |
| visit_id       |
| action         |
| old_value_json |
| new_value_json |
| reason         |
| performed_by   |
| branch_id      |
| device_id      |
| created_at     |

---

## 12. API design

## Test catalogue endpoints

| Endpoint                                | Purpose             |
| --------------------------------------- | ------------------- |
| `POST /lab/tests`                       | Create test         |
| `GET /lab/tests/search`                 | Search catalogue    |
| `PATCH /lab/tests/{id}`                 | Update test         |
| `POST /lab/tests/{id}/reference-ranges` | Add reference range |
| `POST /lab/tests/{id}/activate`         | Activate test       |
| `POST /lab/tests/{id}/deactivate`       | Deactivate test     |

## Order endpoints

| Endpoint                                | Purpose           |
| --------------------------------------- | ----------------- |
| `POST /lab/orders`                      | Create lab order  |
| `POST /lab/orders/{id}/lines`           | Add test          |
| `POST /lab/orders/{id}/send-to-billing` | Link to billing   |
| `POST /lab/orders/{id}/cancel`          | Cancel order      |
| `GET /lab/orders/search`                | Search orders     |
| `GET /lab/orders/pending`               | Pending lab queue |

## Sample endpoints

| Endpoint                         | Purpose               |
| -------------------------------- | --------------------- |
| `POST /lab/samples`              | Create/collect sample |
| `POST /lab/samples/{id}/receive` | Mark received by lab  |
| `POST /lab/samples/{id}/reject`  | Reject sample         |
| `POST /lab/samples/{id}/barcode` | Generate barcode      |
| `GET /lab/samples/search`        | Search samples        |

## Result endpoints

| Endpoint                                     | Purpose               |
| -------------------------------------------- | --------------------- |
| `POST /lab/results`                          | Enter result          |
| `POST /lab/results/{id}/submit-verification` | Send for verification |
| `POST /lab/results/{id}/verify`              | Verify result         |
| `POST /lab/results/{id}/release`             | Release result        |
| `POST /lab/results/{id}/correct`             | Correct result        |
| `POST /lab/results/{id}/review`              | Clinician review      |
| `POST /lab/results/{id}/print`               | Print result          |
| `POST /lab/results/{id}/share`               | Share result securely |

## External send-out endpoints

| Endpoint                                  | Purpose                      |
| ----------------------------------------- | ---------------------------- |
| `POST /lab/external-labs`                 | Add partner lab              |
| `POST /lab/sendouts`                      | Create send-out              |
| `POST /lab/sendouts/{id}/dispatch`        | Dispatch sample              |
| `POST /lab/sendouts/{id}/confirm-receipt` | External lab received        |
| `POST /lab/sendouts/{id}/result`          | Upload/enter external result |
| `POST /lab/sendouts/{id}/delay`           | Record delay                 |
| `GET /lab/sendouts/overdue`               | Overdue send-outs            |

## Reporting endpoints

| Endpoint                             | Purpose                 |
| ------------------------------------ | ----------------------- |
| `GET /lab/reports/daily`             | Daily lab report        |
| `GET /lab/reports/pending-results`   | Pending results         |
| `GET /lab/reports/unbilled-tests`    | Unbilled tests          |
| `GET /lab/reports/rejected-samples`  | Sample rejection report |
| `GET /lab/reports/critical-results`  | Critical result report  |
| `GET /lab/reports/external-sendouts` | Send-out report         |

---

## 13. Integration points

| Integration             | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| Organisation/licensing  | Facility/lab/professional permission checks             |
| EMR                     | Orders, diagnosis, results, clinician review            |
| POS/billing             | Test billing, payment, eTIMS, refunds                   |
| Claims                  | Result evidence, tariffs, authorization                 |
| Inventory               | Kits, reagents, consumables, batch/expiry               |
| Notifications           | Critical results, ready results, delayed send-outs      |
| Document storage        | PDF results, external reports, attachments              |
| Audit/security          | Access, correction, print, export logs                  |
| FHIR API                | ServiceRequest, Specimen, Observation, DiagnosticReport |
| LOINC mapping           | Standard lab test/result identifiers                    |
| External lab portal/API | Future partner-lab integration                          |

---

## 14. Permissions

| Permission               |       Reception | Clinician |   Lab tech | Lab in-charge | Billing | Manager | Auditor |
| ------------------------ | --------------: | --------: | ---------: | ------------: | ------: | ------: | ------: |
| Order test               |         Limited |       Yes |    Limited |           Yes | Limited |     Yes |    View |
| Bill test                |              No |        No |         No |            No |     Yes |     Yes |    View |
| Collect sample           |      No/limited |        No |        Yes |           Yes |      No |     Yes |    View |
| Reject sample            |              No |        No |        Yes |           Yes |      No |     Yes |    View |
| Enter result             |              No |        No |        Yes |           Yes |      No |      No |    View |
| Verify result            |              No |        No | No/limited |           Yes |      No |      No |    View |
| Release result           |              No |        No |    Limited |           Yes |      No |     Yes |    View |
| Correct result           |              No |        No |    Request |           Yes |      No |     Yes |    View |
| Print patient result     | Yes if released |       Yes |        Yes |           Yes |      No |     Yes |    View |
| Share result             |         Limited |       Yes |    Limited |           Yes |      No |     Yes |    View |
| Configure test catalogue |              No |   Limited |         No |           Yes |      No |     Yes |    View |
| Manage external labs     |              No |        No |         No |           Yes |      No |     Yes |    View |
| Export lab reports       |              No |   Limited |    Limited |           Yes |     Yes |     Yes |     Yes |
| View audit logs          |              No |        No |         No |       Limited |      No |     Yes |     Yes |

---

## 15. Reports

## Operational reports

| Report                            | Purpose                          |
| --------------------------------- | -------------------------------- |
| Daily lab orders                  | All tests ordered                |
| Lab revenue report                | Revenue by test, payer, branch   |
| Pending sample collection         | Ordered/paid tests not collected |
| Pending results                   | Collected tests not resulted     |
| Pending verification              | Results awaiting approval        |
| Critical results                  | Urgent clinician follow-up       |
| Rejected samples                  | Quality improvement              |
| Corrected results                 | Audit and quality                |
| Unbilled tests                    | Revenue leakage                  |
| Refunded/cancelled tests          | Billing control                  |
| External send-outs                | Outsourced test tracking         |
| Overdue external results          | Follow-up                        |
| Turnaround time report            | Efficiency                       |
| Test volume by clinician          | Utilization                      |
| Test volume by diagnosis          | Clinical analytics               |
| Reagent/kit consumption           | Inventory planning               |
| Abnormal result report            | Clinical review                  |
| Results not reviewed by clinician | Continuity gap                   |

## Dashboard cards

```text
Tests ordered today
Tests paid/covered
Samples collected
Samples rejected
Results pending entry
Results pending verification
Critical results
External send-outs pending
External results overdue
Unbilled tests
Lab revenue
Average turnaround time
```

---

## 16. Quality and safety controls

Even a Lab-lite module needs basic quality controls.

| Control                      | Requirement                           |
| ---------------------------- | ------------------------------------- |
| Sample ID/barcode            | Prevent patient/sample mix-up         |
| Required billing status      | Prevent unbilled tests                |
| Required sample status       | Prevent result without collection     |
| Required verification        | Prevent unreviewed release            |
| Result correction versioning | Prevent silent result tampering       |
| Critical result alerts       | Protect patient safety                |
| Rejected sample reasons      | Improve collection quality            |
| Kit/reagent batch capture    | Traceability                          |
| Reference ranges             | Help interpretation                   |
| QC event logging             | Record errors, invalid tests, repeats |
| Access logs                  | Privacy and accountability            |
| Print/share logs             | Control disclosure                    |

---

## 17. Privacy and security

Lab results are health data and can be sensitive. The module should follow the same privacy posture as the EMR.

| Control                | Requirement                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| Role-based access      | Reception sees limited results; clinicians/lab see more             |
| Sensitive test flag    | HIV, pregnancy, STI, mental-health-related or other sensitive tests |
| Result sharing consent | Required for WhatsApp/SMS/email                                     |
| Secure links           | Better than sending full sensitive result in plain SMS              |
| Reprint reason         | Required for result reprint                                         |
| Audit every view       | Especially sensitive results                                        |
| Correction audit       | Old/new values and approver                                         |
| Data encryption        | At rest and in transit                                              |
| Device timeout         | Shared lab/reception devices                                        |
| Break-glass access     | Emergency access with reason                                        |
| Patient copy control   | Avoid accidental release to wrong person                            |

---

## 18. Edge cases

| Edge case                              | Correct handling                                                        |
| -------------------------------------- | ----------------------------------------------------------------------- |
| Test ordered but not paid              | Remains awaiting billing; sample blocked unless override                |
| Patient pays but sample not collected  | Appears in pending collection report                                    |
| Sample collected but patient leaves    | Continue result workflow; notify according to policy                    |
| Wrong test ordered                     | Cancel and credit note if billed                                        |
| Wrong patient selected                 | Correction/incident workflow                                            |
| Sample clotted/insufficient            | Reject sample and request recollection                                  |
| Result entered for wrong sample        | Correction and incident workflow                                        |
| Critical result                        | Alert clinician and log notification                                    |
| External lab delays result             | Overdue send-out alert                                                  |
| External lab rejects sample            | Recollection/refund workflow                                            |
| Kit/reagent expired                    | Block result entry/test performance if inventory linked                 |
| Lab staff licence inactive             | Block result entry/verification                                         |
| Result printer fails                   | Save result; allow later print/release                                  |
| Result shared with wrong contact       | Incident/breach workflow                                                |
| Duplicate test order                   | Warn clinician/reception                                                |
| Package includes lab test              | Billing link should mark included, not unpaid                           |
| Insurer denies lab test                | Convert to patient bill or cancel/refund based on policy                |
| Internet outage                        | Allow local collection/result entry if offline mode enabled; sync later |
| Result corrected after clinician acted | Notify clinician and mark corrected report                              |

---

## 19. MVP versus later versions

## MVP

Build these first:

| Feature                        | Reason                                |
| ------------------------------ | ------------------------------------- |
| Test catalogue                 | Foundation                            |
| Lab order from EMR/reception   | Core workflow                         |
| Billing link                   | No unbilled tests                     |
| Sample collection status       | Workflow control                      |
| Basic result entry             | Numeric, text, positive/negative      |
| Reference ranges               | Clinical usefulness                   |
| Verification/release           | Quality and accountability            |
| Result printout/PDF            | Patient and clinician copy            |
| External lab send-out tracking | Real small-clinic need                |
| Audit logs                     | Compliance                            |
| Result-to-EMR link             | Continuity                            |
| Basic reports                  | Pending, completed, unbilled, revenue |
| Sample rejection               | Quality control                       |
| Critical result flag           | Patient safety                        |

## Version 2

Add:

| Feature                               | Reason                |
| ------------------------------------- | --------------------- |
| Barcode labels                        | Reduce sample mix-ups |
| Panel templates                       | CBC, urinalysis, LFTs |
| LOINC mapping                         | Interoperability      |
| Kit/reagent lot capture               | Traceability          |
| Inventory consumption                 | Stock accuracy        |
| Critical-result notification workflow | Safety                |
| Corrected-result workflow             | Quality               |
| External lab price/cost tracking      | Margin                |
| TAT analytics                         | Efficiency            |
| QC logs                               | Quality improvement   |
| Secure patient result links           | Privacy               |

## Version 3

Add:

| Feature                                 | Reason                       |
| --------------------------------------- | ---------------------------- |
| Analyser integration                    | Automation                   |
| HL7/FHIR external lab API               | Partner integration          |
| Advanced QC statistics                  | Lab quality maturity         |
| National health data dictionary mapping | Digital Health Act readiness |
| Automated claims attachments            | Reduce rejections            |
| AI abnormal-result triage               | Safety support               |
| External lab portal                     | Send/receive electronically  |
| SMS/WhatsApp result readiness           | Patient convenience          |
| Multi-branch lab routing                | Chains and hub labs          |
| Full LIS upgrade path                   | Larger laboratories          |

---

## 20. Acceptance criteria

The Lab-lite Module is ready when it passes these tests:

| Test                       | Expected result                                                               |
| -------------------------- | ----------------------------------------------------------------------------- |
| Create test catalogue item | Test has code, specimen, result type, price, status                           |
| Order test from EMR        | Order links to patient, visit, clinician, diagnosis                           |
| Order test from reception  | Walk-in order creates billing requirement                                     |
| Billing block              | Sample cannot be collected if unpaid/uncovered unless override                |
| Collect sample             | Sample ID/barcode and collection details recorded                             |
| Reject sample              | Rejection reason captured and recollection task created                       |
| Enter numeric result       | Value, unit, reference range, abnormal flag saved                             |
| Enter text/coded result    | Positive/negative/text result saved                                           |
| Verify result              | Authorized lab user releases result                                           |
| Print result               | Verified result prints with patient, test, values, reference ranges, verifier |
| Critical result            | Clinician alert and notification log created                                  |
| Correct result             | Old result retained and corrected version issued                              |
| External send-out          | Dispatch, external lab, status, result attachment tracked                     |
| Result returns to EMR      | Clinician sees result in patient visit                                        |
| Claim support              | Result links to bill, diagnosis, clinician, visit, payer                      |
| Audit                      | Order, collection, result entry, verification, correction, print all logged   |
| Report                     | Pending, unbilled, rejected, critical, external, and completed tests visible  |

---

## 21. Final product behaviour

The Lab-lite Module should behave like this:

| Situation                   | Correct behaviour                                    |
| --------------------------- | ---------------------------------------------------- |
| Clinician orders test       | Order appears in lab and billing                     |
| Patient has not paid        | Collection/testing blocked or override logged        |
| Sample is collected         | Sample ID, collector, date/time, specimen recorded   |
| Sample is unsuitable        | Rejected with reason and recollection task           |
| Result is entered           | Value, unit, reference range, abnormal flag captured |
| Result is abnormal/critical | Clinician alerted                                    |
| Result is ready             | Lab in-charge verifies before release                |
| Patient needs copy          | Result printed/shared securely                       |
| Test is outsourced          | Send-out status tracked until result returns         |
| External result arrives     | PDF/value attached and reviewed                      |
| Claim is needed             | Result links to order, bill, diagnosis, and visit    |
| Audit is needed             | Full chain visible from order to release             |

The key design principle is:

**No lab result should exist without a patient, order, sample status, billing status, responsible lab user, verification status, and audit trail.**

Correct. Module 6 needs a formal lab terminology decision.

I would close this as:

```text
ADR-023: Laboratory Test Catalogue, LOINC Mapping, Kenya KEDL Alignment, and Result Terminology Strategy
```

## 1. Architecture decision

For this Kenyan 10-branch implementation, use a **hybrid lab catalogue**:

```text
Canonical operational catalogue:
    Internal facility lab test catalogue

Kenya alignment:
    Kenya Essential Diagnostics List / local facility scope

Interoperability mapping:
    LOINC where a suitable code exists

FHIR mapping:
    ServiceRequest for orders
    Specimen for samples
    Observation for atomic results
    DiagnosticReport for released lab reports
```

So the answer is:

| Question                               | Decision                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Internal or LOINC?                     | **Both**. Internal catalogue is operational; LOINC is interoperability mapping.                   |
| Kenya-specific?                        | **Yes**. Align test availability with Kenya Essential Diagnostics List and branch/facility scope. |
| Full LOINC import?                     | Not necessary for MVP. Import/map a controlled subset first.                                      |
| Can tests exist without LOINC?         | Yes, but marked `loinc_mapping_status = unmapped`.                                                |
| Can claims/reports use internal codes? | Yes, but with payer/KHIS/export mappings where needed.                                            |
| External labs?                         | Support external lab test codes and cross-mapping.                                                |

LOINC is a universal code system for tests, measurements, and observations, and is widely used to identify and exchange clinical and laboratory observations. It is best used here as a mapping layer rather than the operational catalogue itself. ([Regenstrief Institute][1])

---

## 2. Why not use LOINC as the only catalogue?

LOINC is powerful, but it is not a complete operational lab catalogue by itself.

A clinic still needs local operational fields:

| Operational need      | Why LOINC alone is not enough                      |
| --------------------- | -------------------------------------------------- |
| Local price           | LOINC does not define your branch price            |
| Billing item          | LOINC does not define your POS/service item        |
| Sample workflow       | Facility-specific collection process needed        |
| Container             | EDTA, plain tube, urine container, swab            |
| Turnaround time       | Local branch/external lab dependent                |
| In-house vs send-out  | Local operational rule                             |
| Machine/manual method | Depends on equipment                               |
| Reference ranges      | Depend on method, unit, age, sex, pregnancy        |
| Result template       | Panel layout differs by facility/device            |
| Claims tariff         | Payer-specific                                     |
| Stock consumption     | Reagents, kits, strips, consumables                |
| Branch availability   | Some tests available in one branch but not another |

Therefore:

```text
Use internal lab test codes to run the clinic.
Use LOINC codes to interoperate, report, and exchange data.
```

---

## 3. Kenya-specific source layer

The Kenya Essential Diagnostics List 2023 should be used as a **local alignment reference** for what diagnostics are essential in Kenya’s health system context. The KEDL 2023 describes 249 essential in-vitro diagnostics for clinical management, public-health surveillance, and forensic testing for Kenya’s priority communicable and non-communicable diseases. ([prescribingcompanion.com][2])

Use it for:

| Use                       | Example                                             |
| ------------------------- | --------------------------------------------------- |
| Facility test scope       | Which tests are reasonable for a small clinic/lab   |
| Public health alignment   | Priority communicable and non-communicable diseases |
| Procurement alignment     | Essential diagnostic supplies/kits                  |
| Branch capability mapping | Which KEPH/facility level can perform what          |
| Reporting alignment       | Internal grouping and future KHIS/DHIS2 mapping     |

Do **not** treat KEDL as a result-code system. It is a diagnostics list/reference, not a full interoperability terminology like LOINC.

---

## 4. Lab code systems needed

The lab module needs multiple code systems, not one.

| Code system                | Role                                                          |
| -------------------------- | ------------------------------------------------------------- |
| Internal lab test code     | Operational ordering, billing, workflow                       |
| LOINC                      | Interoperability and standardized observation/result identity |
| External lab code          | Reference lab’s own test code                                 |
| Payer tariff code          | Claims and reimbursement                                      |
| KHIS/DHIS2 reporting group | Aggregate reporting                                           |
| Inventory item code        | Reagent/kit/consumable link                                   |
| Device/analyser code       | Future analyser integration                                   |
| Local synonym/alias        | Clinician search UX                                           |

Example:

```text
Internal test: LAB-MAL-RDT
Display name: Malaria rapid diagnostic test
LOINC: mapped where appropriate
Specimen: capillary/whole blood
Method: RDT
Billing code: SVC-LAB-MAL-RDT
Payer tariff code: depends on payer
Inventory link: malaria RDT kit
Reporting group: Malaria diagnostics
External lab code: not applicable
```

---

## 5. Data model additions

Add a `terminology` layer for lab codes and a `lab` operational catalogue.

## 5.1 `terminology.code_systems`

Already proposed for ICD-10; extend it to LOINC and local lab systems.

| Field           | Purpose                                      |
| --------------- | -------------------------------------------- |
| id              | Internal ID                                  |
| code_system_key | LOINC, LOCAL_LAB, EXTERNAL_LAB, PAYER_TARIFF |
| name            | Code system name                             |
| version         | Version                                      |
| publisher       | Regenstrief, internal, external lab, payer   |
| canonical_uri   | FHIR/terminology URI                         |
| licence_notes   | Usage notes                                  |
| active_flag     | Active/inactive                              |
| imported_at     | Import timestamp                             |

---

## 5.2 `lab.lab_tests`

This is the operational catalogue.

| Field                     | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| id                        | Internal ID                                      |
| test_code                 | Internal code, e.g. `LAB-CBC`                    |
| test_name                 | Display name                                     |
| short_name                | CBC, RBS, UPT                                    |
| category                  | Haematology, chemistry, microbiology, urinalysis |
| test_type                 | Single, panel, profile, package                  |
| orderable_flag            | Can be ordered                                   |
| resultable_flag           | Can have results                                 |
| in_house_flag             | In-house or external                             |
| default_external_lab_id   | If send-out                                      |
| specimen_type             | Blood, urine, stool, swab, serum                 |
| collection_container      | EDTA, plain tube, urine cup                      |
| sample_volume             | Optional                                         |
| method                    | RDT, microscopy, analyser, dipstick              |
| turnaround_minutes        | Expected TAT                                     |
| requires_fasting          | Yes/no                                           |
| requires_consent          | Yes/no                                           |
| requires_clinician_order  | Yes/no                                           |
| requires_verification     | Yes/no                                           |
| branch_availability_scope | All branches/specific branches                   |
| billing_service_id        | Link to POS service                              |
| claim_category            | Lab                                              |
| active_flag               | Active/inactive                                  |

---

## 5.3 `lab.lab_test_code_mappings`

Maps internal test to LOINC, external lab, payer, or reporting code.

| Field                  | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| id                     | Mapping ID                                              |
| lab_test_id            | Internal test                                           |
| code_system_id         | LOINC/external/payer/KHIS                               |
| external_code          | Mapped code                                             |
| external_display       | External display name                                   |
| mapping_type           | exact, broader, narrower, panel, component, approximate |
| mapping_confidence     | high, medium, low                                       |
| mapped_by              | User/system                                             |
| clinically_verified_by | Lab in-charge/clinician                                 |
| active_flag            | Active/inactive                                         |
| effective_from         | Date                                                    |
| effective_to           | Date                                                    |

Important: not all mappings are exact. A local “LFT” panel may map to multiple component LOINC codes, not one single code.

---

## 5.4 `lab.lab_test_components`

For panel tests.

| Field                 | Purpose                           |
| --------------------- | --------------------------------- |
| id                    | Component ID                      |
| parent_lab_test_id    | Panel/profile                     |
| component_lab_test_id | Atomic test/component             |
| display_name          | Hb, WBC, Platelets                |
| display_order         | Print order                       |
| required_flag         | Required result                   |
| result_type           | Numeric, coded, text              |
| unit                  | g/dL, mmol/L, cells/µL            |
| loinc_code            | Optional direct component mapping |
| active_flag           | Active/inactive                   |

Example:

```text
CBC / FBC
    Hb
    WBC
    RBC
    Platelets
    MCV
    MCH
    MCHC
    Differential counts
```

Each component may have its own LOINC mapping.

---

## 5.5 `lab.lab_reference_ranges`

Reference ranges are not purely terminology; they are method, unit, age, sex, and sometimes pregnancy dependent.

| Field            | Purpose                    |
| ---------------- | -------------------------- |
| id               | Range ID                   |
| lab_test_id      | Test/component             |
| sex              | Male/female/all            |
| min_age_days     | Age lower bound            |
| max_age_days     | Age upper bound            |
| pregnancy_status | pregnant/non-pregnant/all  |
| method           | Optional                   |
| unit             | Unit                       |
| low_value        | Numeric low                |
| high_value       | Numeric high               |
| critical_low     | Critical low               |
| critical_high    | Critical high              |
| text_range       | For non-numeric            |
| source           | Local/lab/device/reference |
| verified_by      | Lab in-charge              |
| active_flag      | Active/inactive            |

---

## 5.6 `lab.lab_result_value_sets`

For coded results.

| Field         | Purpose                                                  |
| ------------- | -------------------------------------------------------- |
| id            | Value set ID                                             |
| lab_test_id   | Test/component                                           |
| allowed_value | Positive, negative, reactive, non-reactive, trace, +, ++ |
| display_label | Human display                                            |
| abnormal_flag | Normal/high/low/abnormal                                 |
| critical_flag | Yes/no                                                   |
| display_order | Order                                                    |
| active_flag   | Active/inactive                                          |

---

## 5.7 `lab.external_lab_test_catalogues`

For reference labs.

| Field                  | Purpose               |
| ---------------------- | --------------------- |
| id                     | External catalogue ID |
| external_lab_id        | Partner lab           |
| external_test_code     | Their code            |
| external_test_name     | Their display name    |
| specimen_requirement   | Their requirement     |
| turnaround_time        | Their TAT             |
| external_price         | Cost to facility      |
| result_delivery_method | Portal/email/API/PDF  |
| mapped_lab_test_id     | Internal test         |
| active_flag            | Active/inactive       |

---

## 6. Import strategy

## MVP import

Do not import full LOINC immediately unless the team is ready to govern it. LOINC is large and broad, including many non-lab observations.

Recommended MVP approach:

```text
1. Build internal lab catalogue for in-house and send-out tests.
2. Seed common tests:
   CBC/FBC
   malaria RDT
   malaria microscopy if offered
   urinalysis
   urine pregnancy test
   random blood sugar
   fasting blood sugar
   HbA1c if send-out
   blood group if offered
   HIV/HBsAg/syphilis screening if configured and compliant
   LFT/RFT/lipid profile if send-out
3. Map each test or component to LOINC where clear.
4. Mark uncertain mappings as pending verification.
5. Maintain external lab code mappings separately.
```

## Version 2 import

| Import                  | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| LOINC subset            | Only lab-relevant codes used by the facility |
| KEDL alignment table    | Kenya essential diagnostics mapping          |
| External lab catalogues | Send-out mapping                             |
| Payer tariff tables     | Claims mapping                               |
| KHIS reporting groups   | Aggregate reports                            |

## Version 3 import

| Import                           | Purpose                                |
| -------------------------------- | -------------------------------------- |
| Full LOINC or terminology server | Advanced interoperability              |
| FHIR terminology service         | `$lookup`, `$validate-code`, `$expand` |
| Analyser/device mappings         | Automated result import                |
| External lab API mappings        | Electronic result exchange             |

---

## 7. LOINC mapping strategy

## Mapping rule

Do not map casually by test name alone. LOINC depends on:

```text
Component
Property
Time
System/specimen
Scale
Method
```

For example, “glucose” may differ by specimen, timing, and method.

## Mapping confidence

| Confidence | Meaning                                                   |
| ---------- | --------------------------------------------------------- |
| High       | Exact component/specimen/unit/method match                |
| Medium     | Clinically acceptable but method not exact                |
| Low        | Approximate mapping; not used for exchange without review |
| Unmapped   | No mapping yet                                            |

## Governance rule

```text
No LOINC mapping should be marked high confidence until reviewed by lab in-charge or qualified clinical/lab governance user.
```

---

## 8. Search UX for test catalogue

Lab test search should work for both clinicians and lab users.

## Search should support

| Search input | Result                                  |
| ------------ | --------------------------------------- |
| CBC          | Complete blood count / full blood count |
| FBC          | CBC/FBC                                 |
| Malaria      | Malaria RDT, microscopy                 |
| RBS          | Random blood sugar                      |
| UPT          | Urine pregnancy test                    |
| Urine        | Urinalysis, urine microscopy, pregnancy |
| LFT          | Liver function tests                    |
| RFT          | Renal function tests                    |
| HbA1c        | HbA1c                                   |
| HIV          | HIV screening tests where configured    |
| Blood group  | ABO/Rh                                  |

## Ranking

```text
score =
    exact_code_match
  + exact_short_name_match
  + synonym_match
  + branch_available_boost
  + clinician_recent_boost
  + branch_frequency_boost
  + in_house_boost
  - inactive_penalty
  - unavailable_at_branch_penalty
```

## Test picker result row

```text
CBC / FBC
Category: Haematology
Specimen: Whole blood
Container: EDTA
Location: In-house
TAT: 30 min
Price: KES ...
LOINC: mapped / pending
```

---

## 9. Lab ordering and result model

## FHIR-aligned design

Use FHIR concepts even before exposing FHIR APIs.

| Workflow object  | FHIR equivalent   |
| ---------------- | ----------------- |
| Lab order        | ServiceRequest    |
| Sample           | Specimen          |
| Result component | Observation       |
| Final report     | DiagnosticReport  |
| Attachment/PDF   | DocumentReference |

FHIR ServiceRequest represents an order/request for a service such as a diagnostic investigation, and DiagnosticReport is used for reports such as laboratory reports that can reference observations/results. ([FHIR][3])

---

## 10. Result template design

## Single result test

Example: Malaria RDT

| Field                             |
| --------------------------------- |
| Result: Positive/Negative/Invalid |
| Method                            |
| Kit lot                           |
| Kit expiry                        |
| Comment                           |
| Verified by                       |

## Numeric result

Example: Random blood sugar

| Field           |
| --------------- |
| Numeric value   |
| Unit            |
| Reference range |
| Abnormal flag   |
| Critical flag   |
| Comment         |

## Panel result

Example: CBC

| Component    | Result type        |
| ------------ | ------------------ |
| Hb           | Numeric            |
| WBC          | Numeric            |
| Platelets    | Numeric            |
| RBC          | Numeric            |
| MCV          | Numeric            |
| MCH          | Numeric            |
| MCHC         | Numeric            |
| Differential | Numeric/percentage |

## Semi-quantitative result

Example: urinalysis

| Component        | Allowed values              |
| ---------------- | --------------------------- |
| Protein          | Negative, trace, +, ++, +++ |
| Glucose          | Negative, trace, +, ++, +++ |
| Ketones          | Negative, trace, +, ++, +++ |
| Blood            | Negative, trace, +, ++, +++ |
| Nitrite          | Negative, positive          |
| Leukocytes       | Negative, trace, +, ++, +++ |
| pH               | Numeric                     |
| Specific gravity | Numeric                     |

---

## 11. Kenya reporting and KHIS/DHIS2 mapping

The lab module should support aggregate reporting groups, not just individual tests. Kenya’s Ministry of Health Virtual Academy describes KHIS Aggregate as powered by DHIS2, with data entry, reporting, and visualizations. ([MOH-VA][4])

Add:

## `lab.lab_reporting_groups`

| Field               | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| id                  | Group                                                |
| group_name          | Malaria diagnostics, HIV testing, diabetes screening |
| reporting_framework | Internal, KHIS, payer, public health                 |
| active_flag         | Active                                               |

## `lab.lab_reporting_group_members`

| Field            | Purpose                                                       |
| ---------------- | ------------------------------------------------------------- |
| group_id         | Reporting group                                               |
| lab_test_id      | Test                                                          |
| aggregation_rule | Count ordered, count resulted, count positive, count abnormal |

This allows reports like:

```text
Malaria tests ordered
Malaria positive rate
Pregnancy tests performed
Glucose screening count
External send-outs by category
```

---

## 12. Claims integration

Each lab test must map to billable service and payer tariff.

## Required mappings

| Mapping                               | Purpose              |
| ------------------------------------- | -------------------- |
| `lab_test_id → billing.service_id`    | POS billing          |
| `billing.service_id → tariff_line_id` | Claims pricing       |
| `lab_result_id → claim_attachment`    | Claim evidence       |
| `lab_test_id → payer_test_code`       | Payer-specific claim |
| `lab_test_id → LOINC`                 | Interoperability     |
| `lab_test_id → reporting_group`       | Analytics            |

## Claim readiness rule

```text
If claim line category = lab,
then a verified lab result must exist,
and the test must have an active tariff mapping for the payer,
and required attachment rules must be satisfied.
```

---

## 13. Inventory integration

Lab tests consume stock.

## Required stock links

| Lab item           | Inventory link                         |
| ------------------ | -------------------------------------- |
| Malaria RDT        | Test kit batch                         |
| Pregnancy test     | Test kit batch                         |
| Glucose test       | Strip/lancet/gloves                    |
| Urinalysis         | Dipstick strip                         |
| CBC                | EDTA tube/reagent if configured        |
| External send-out  | Sample container/transport consumables |
| Cold-chain reagent | Cold-chain stock                       |

## Data model

### `lab.lab_test_consumables`

| Field                  | Purpose                  |
| ---------------------- | ------------------------ |
| id                     | ID                       |
| lab_test_id            | Test                     |
| product_id             | Reagent/kit/consumable   |
| quantity_per_test      | Consumption quantity     |
| required_flag          | Whether stock must exist |
| batch_capture_required | For kits/reagents        |
| active_flag            | Active                   |

---

## 14. Governance model

Lab catalogue governance should be owned by the lab in-charge and clinical governance team.

## Rule lifecycle

```text
Draft test
    ↓
Configure sample, result template, reference range, billing, branch availability
    ↓
Map to LOINC/payer/reporting group where applicable
    ↓
Lab in-charge review
    ↓
Billing/claims review
    ↓
Activate
```

## Required activation checklist

| Checklist item                        |
| ------------------------------------- |
| Test name and code                    |
| Specimen                              |
| Result type/template                  |
| Reference range or value set          |
| Billing service                       |
| Branch availability                   |
| Verification requirement              |
| In-house/send-out status              |
| External lab mapping if send-out      |
| Payer tariff mapping where applicable |
| LOINC mapping status                  |
| Inventory consumables if stock-linked |
| Lab in-charge approval                |

---

## 15. Architecture principle

Replace:

```text
Test catalogue: CBC, malaria, urinalysis, glucose, pregnancy, etc.
```

With:

```text
The lab catalogue must be an operational internal catalogue aligned to Kenya diagnostic scope, mapped to LOINC where possible, linked to billing/tariffs, inventory, result templates, reference ranges, external lab codes, reporting groups, and future FHIR ServiceRequest/Observation/DiagnosticReport exchange.
```

---

## 16. Sprint addition

Add a dedicated terminology sprint before Lab-lite implementation.

## New sprint: Lab Terminology and Test Catalogue Foundation

### Scope

| Workstream                    | Deliverable                                   |
| ----------------------------- | --------------------------------------------- |
| ADR-023                       | Lab terminology decision                      |
| Internal lab catalogue schema | `lab.lab_tests`                               |
| LOINC mapping schema          | `lab.lab_test_code_mappings`                  |
| Panel/component schema        | `lab.lab_test_components`                     |
| Reference range schema        | `lab.lab_reference_ranges`                    |
| Result value sets             | Positive/negative/semi-quantitative values    |
| Kenya KEDL alignment          | Essential diagnostics reference mapping       |
| External lab catalogue        | Send-out test mapping                         |
| Billing service mapping       | Lab test → service                            |
| Payer tariff mapping          | Lab service → tariff                          |
| Inventory consumable mapping  | Lab test → stock item                         |
| Test search UX                | Autocomplete, synonyms, favourites, frequency |
| Governance workflow           | Draft/review/approve/activate                 |
| Import tools                  | CSV import for lab catalogue and mappings     |

### Acceptance criteria

| Test                       | Expected result                                           |
| -------------------------- | --------------------------------------------------------- |
| Create CBC panel           | Components and result template configured                 |
| Search `FBC`               | CBC/FBC appears                                           |
| Search `RBS`               | Random blood sugar appears                                |
| Order send-out test        | External lab workflow triggered                           |
| Test lacks billing code    | Cannot activate                                           |
| Test lacks result template | Cannot activate                                           |
| LOINC mapping pending      | Test can operate but marked not interoperability-complete |
| Result entered             | Reference range and abnormal flag work                    |
| Lab claim generated        | Verified result attached                                  |
| Kit-linked test performed  | Consumable deducted if configured                         |

---

## 17. Final recommendation

For Module 6, implement:

```text
MVP:
    Internal lab test catalogue
    Kenya KEDL-aligned scope
    LOINC mapping field and mapping table
    Core in-house tests
    External send-out catalogue
    Result templates
    Reference ranges
    Value sets
    Billing/tariff links
    Inventory consumable links
    Lab search UX
    Governance workflow

Version 2:
    LOINC subset import
    KHIS/DHIS2 aggregate mappings
    External lab catalogue imports
    QC and kit/reagent lot governance

Version 3:
    FHIR terminology service
    Analyser/device code mappings
    External lab API/FHIR integration
    Full interoperability-grade LOINC governance
```

The important rule is:

**The lab module should run on an internal operational test catalogue, but every test should be capable of mapping to LOINC, payer tariffs, external lab codes, inventory consumables, Kenya reporting groups, and FHIR resources.**

[1]: https://www.regenstrief.org/real-world-solutions/loinc/?utm_source=chatgpt.com "LOINC Data Standards - Regenstrief Institute"
[2]: https://prescribingcompanion.com/media/1729/kenya-essential-diagnostics-list-2023.pdf?utm_source=chatgpt.com "Published by the Ministry of Health Kenya 2023 - 2023"
[3]: https://fhir.hl7.org/fhir/servicerequest.html?utm_source=chatgpt.com "ServiceRequest - FHIR v5.0.0 - fhir.hl7.org"
[4]: https://elearning.health.go.ke/course/index.php?categoryid=5&utm_source=chatgpt.com "KHIS/DHIS2 Aggregate - Ministry of Health"

## Module 6 Gap Closure: Lab-lite — Developer Handoff Addendum

## Updated handoff status

| Area                      |                                                                            Previous status |                                                                                                      After this closure |
| ------------------------- | -----------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------: |
| Completeness              |                                                                                       Good |                                                                                        **Very high for Lab-lite scope** |
| Developer readiness       |                                                                                     Medium |                                                                                               **High for MVP Lab-lite** |
| Accuracy confidence       |                                                  Good directionally; lab governance needed |                                      **Good, with explicit KMLTTB/professional governance and facility approval gates** |
| Main previous gaps        | Test catalogue, barcode labels, reference ranges, billing exceptions, partner-lab handling |                                                                                                              **Closed** |
| Developer start readiness |                                                                 Could build shell/workflow | **Can now implement catalogue, sample tracking, result templates, verification, billing rules, send-outs, and reports** |

The updated design principle is:

```text
Lab-lite should not become a full LIS,
but no lab result should be released unless the system can prove:
who ordered it, who paid or approved it, who collected the sample,
which sample was tested, what template and reference range were used,
who entered the result, who verified it, and how it was delivered.
```

KMLTTB has statutory mandate over training, business, practice and employment of medical laboratory technicians and technologists in Kenya, and KMLTTB states that every Medical Laboratory Science professional practising in Kenya must be registered and licensed with the Board. The software should therefore treat lab verification as a regulated professional action, not a normal clerical action. ([kmlttb.org][g6-1])

---

## 1. Final developer decisions

| Gap                         | Final decision                                                                                                                                                                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial test catalogue      | Ship a **seed Lab-lite catalogue v1** covering malaria, CBC/FBC, haemoglobin, blood group/Rh, urinalysis, pregnancy, glucose, HIV screening workflow placeholder, stool, H. pylori, basic chemistry send-outs, and common external lab tests. |
| Sample barcode/label format | Use a human-readable + barcode format: `BRANCH-LAB-YYMMDD-SEQ-SPECIMEN`, with Code128 by default and QR optional.                                                                                                                             |
| Result templates            | Use structured templates: numeric single result, coded positive/negative, semi-quantitative urinalysis, panel result, microscopy text, external PDF result.                                                                                   |
| Reference ranges and units  | Provide **starter reference-range templates**, but require facility/lab in-charge approval before activation. Ranges must be versioned by method, age, sex, pregnancy status, specimen, and unit.                                             |
| Billing exceptions          | Default is **payment/cover before sample collection**, but allow configured exceptions: emergency, clinician-authorized urgent test, corporate credit, insurer/SHA pre-auth, package-included test, and manager-approved waiver.              |
| Partner-lab contracts       | Add partner-lab master, contract terms, price list, turnaround time, sample requirements, result format, courier chain-of-custody, and internal verification/review rules.                                                                    |
| Result-format handling      | Support structured entry, PDF upload, image upload, external lab portal reference, and future API/FHIR import.                                                                                                                                |
| Verification roles          | Result release requires active lab professional role: `lab_technician`, `lab_technologist`, or `lab_in_charge`, configurable by test risk.                                                                                                    |
| Clinical safety             | Critical results create clinician alert and notification log; sensitive results use restricted access and neutral patient communication.                                                                                                      |
| Interoperability            | Store LOINC-ready codes and FHIR-ready mappings for ServiceRequest, Specimen, Observation, and DiagnosticReport.                                                                                                                              |

LOINC should be used as the preferred external code system where mapped because it is a universal code system for laboratory tests, measurements and clinical observations. FHIR ServiceRequest should represent lab orders, while DiagnosticReport and Observation should represent released lab results and component values. ([Regenstrief Institute][g6-2])

---

## 2. Final Lab-lite scope

## 2.1 In scope for MVP

| Area            | Included                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------- |
| Test catalogue  | Local test codes, LOINC-ready mapping, specimen, container, result template, billing item |
| Orders          | From EMR, reception, package, claim, or walk-in                                           |
| Billing gate    | Paid, covered, credit-approved, waived, emergency override                                |
| Sample tracking | Ordered, billed, collected, rejected, in process, resulted, verified, released            |
| Result entry    | Numeric, coded, text, panel, PDF attachment                                               |
| Verification    | Lab professional verification before final release                                        |
| Printout        | Patient copy, clinician copy, claim copy                                                  |
| Send-out        | External lab dispatch, tracking, result receipt                                           |
| Reports         | Pending, unbilled, rejected, critical, send-out, TAT                                      |
| Audit           | Order, collection, result, verification, correction, print, share                         |

## 2.2 Out of scope for MVP

| Area                                   | Reason                                     |
| -------------------------------------- | ------------------------------------------ |
| Full analyser integration              | Add later after volumes justify it         |
| Blood bank                             | High-risk separate module                  |
| Histopathology/cytology                | External send-out or full LIS              |
| Advanced microbiology culture workflow | Full LIS territory                         |
| ISO 15189 full QMS                     | Version 2/3; MVP keeps basic QC/event logs |
| Complex QC statistics                  | Version 2                                  |
| Full HL7 v2 analyser middleware        | Version 3                                  |
| National reporting APIs                | Future adapter                             |

---

## 3. Seed test catalogue v1

## 3.1 Catalogue design rule

The seed catalogue should be editable and approvable per facility. Do **not** assume every clinic performs every test in-house.

```text
test can be:
  in_house
  external_sendout
  disabled
  package_only
  clinician_order_required
```

## 3.2 Core seed catalogue

| Code                 | Test name                                       | Category            | Specimen                  | Container                | Result type      | Default location           | Billing unit |
| -------------------- | ----------------------------------------------- | ------------------- | ------------------------- | ------------------------ | ---------------- | -------------------------- | ------------ |
| `MAL_RDT`            | Malaria rapid diagnostic test                   | Malaria/fever       | Capillary/venous blood    | RDT kit                  | Coded            | In-house                   | Test         |
| `MAL_MICRO`          | Malaria microscopy                              | Malaria/fever       | Blood                     | Slide                    | Text/coded       | In-house/external          | Test         |
| `CBC`                | Complete blood count / FBC                      | Haematology         | Venous blood              | EDTA tube                | Panel            | In-house/external          | Test         |
| `HB`                 | Haemoglobin                                     | Haematology         | Blood                     | EDTA/capillary           | Numeric          | In-house                   | Test         |
| `BLOOD_GROUP_RH`     | Blood group and Rh                              | Haematology         | Blood                     | EDTA/plain               | Coded            | In-house/external          | Test         |
| `ESR`                | ESR                                             | Haematology         | Blood                     | Citrate/EDTA per method  | Numeric          | External/in-house          | Test         |
| `RBS`                | Random blood sugar                              | Glucose/diabetes    | Capillary/venous blood    | Glucometer/fluoride tube | Numeric          | In-house                   | Test         |
| `FBS`                | Fasting blood sugar                             | Glucose/diabetes    | Venous/capillary blood    | Fluoride tube/glucometer | Numeric          | In-house/external          | Test         |
| `HBA1C`              | HbA1c                                           | Diabetes            | Blood                     | EDTA                     | Numeric          | External                   | Test         |
| `URINALYSIS`         | Urinalysis dipstick                             | Urine               | Urine                     | Urine container          | Panel/semi-quant | In-house                   | Test         |
| `URINE_MICRO`        | Urine microscopy                                | Urine               | Urine                     | Urine container          | Text/panel       | In-house/external          | Test         |
| `URINE_PREG`         | Urine pregnancy test                            | Reproductive health | Urine                     | Urine container          | Coded            | In-house                   | Test         |
| `STOOL_MICRO`        | Stool microscopy                                | Stool               | Stool                     | Stool container          | Text/panel       | External/in-house          | Test         |
| `H_PYLORI_STOOL`     | H. pylori stool antigen                         | Gastrointestinal    | Stool                     | Stool container          | Coded            | External/in-house          | Test         |
| `H_PYLORI_AB`        | H. pylori antibody rapid test                   | Gastrointestinal    | Blood                     | RDT kit                  | Coded            | In-house/external          | Test         |
| `WIDAL`              | Widal test                                      | Febrile illness     | Blood/serum               | Plain tube               | Semi-quant/text  | External/in-house          | Test         |
| `HIV_SCREEN`         | HIV screening workflow placeholder              | Infectious disease  | Blood                     | RDT/venous               | Coded/sensitive  | In-house only if compliant | Test         |
| `HBsAg`              | Hepatitis B surface antigen                     | Infectious disease  | Blood/serum               | Plain tube/RDT           | Coded            | External/in-house          | Test         |
| `RPR_VDRL`           | Syphilis screen                                 | Infectious disease  | Blood/serum               | Plain tube               | Coded            | External/in-house          | Test         |
| `COVID_AG`           | COVID-19 antigen                                | Respiratory         | Nasal/nasopharyngeal swab | Swab/test kit            | Coded            | In-house if enabled        | Test         |
| `LIPID_PROFILE`      | Lipid profile                                   | Chemistry           | Blood/serum               | Plain tube               | Panel            | External                   | Test         |
| `LFT`                | Liver function tests                            | Chemistry           | Blood/serum               | Plain tube               | Panel            | External                   | Test         |
| `RFT_UEC`            | Renal function / Urea, electrolytes, creatinine | Chemistry           | Blood/serum               | Plain tube               | Panel            | External                   | Test         |
| `CRP`                | C-reactive protein                              | Inflammation        | Blood/serum               | Plain tube               | Numeric/coded    | External/in-house          | Test         |
| `TFT`                | Thyroid function tests                          | Endocrine           | Blood/serum               | Plain tube               | Panel            | External                   | Test         |
| `PSA`                | PSA                                             | Screening           | Blood/serum               | Plain tube               | Numeric          | External                   | Test         |
| `BETA_HCG`           | Serum beta-hCG                                  | Reproductive health | Blood/serum               | Plain tube               | Numeric          | External                   | Test         |
| `SICKLE_CELL_SCREEN` | Sickle cell screen                              | Haematology         | Blood                     | EDTA                     | Coded            | External/in-house          | Test         |
| `BLOOD_SLIDE`        | Peripheral blood film                           | Haematology         | Blood                     | EDTA/slide               | Text             | External/in-house          | Test         |

## 3.3 Catalogue activation rules

| Rule                             | Behaviour                                          |
| -------------------------------- | -------------------------------------------------- |
| Test has no billing item         | Cannot order live test                             |
| Test has no result template      | Cannot activate                                    |
| Test marked in-house             | Requires lab service active for branch             |
| Test requires specific equipment | Equipment must be enabled                          |
| Test uses stock kit/reagent      | Inventory item should be mapped                    |
| Test is sensitive                | Restricted access and neutral patient notification |
| Test is external                 | Partner lab and send-out workflow required         |
| Test requires clinician order    | Reception cannot order without clinician           |
| Test requires consent            | Consent prompt before collection                   |

---

## 4. Result templates

## 4.1 Template types

| Template code     | Use                                                    |
| ----------------- | ------------------------------------------------------ |
| `NUMERIC_SINGLE`  | Glucose, Hb, CRP                                       |
| `CODED_POS_NEG`   | Malaria RDT, pregnancy test, HBsAg                     |
| `SEMI_QUANT`      | Urinalysis dipstick, Widal titres                      |
| `PANEL_NUMERIC`   | CBC, LFT, RFT, lipid profile                           |
| `MICROSCOPY_TEXT` | Malaria microscopy, stool microscopy, urine microscopy |
| `BLOOD_GROUP`     | ABO/Rh result                                          |
| `PDF_EXTERNAL`    | External lab result upload                             |
| `TEXT_REPORT`     | Imaging-like or narrative result                       |
| `SENSITIVE_CODED` | HIV/sensitive screening placeholder                    |
| `INVALID_REPEAT`  | Invalid RDT/sample repeat                              |

## 4.2 `lab_result_templates`

| Field                   |    Required |
| ----------------------- | ----------: |
| `id`                    |         Yes |
| `template_code`         |         Yes |
| `template_name`         |         Yes |
| `result_type`           |         Yes |
| `test_id`               |    Optional |
| `sensitive_flag`        |         Yes |
| `requires_verification` |         Yes |
| `supports_components`   |         Yes |
| `supports_attachment`   |         Yes |
| `active`                |         Yes |
| `version`               |         Yes |
| `approved_by`           | Conditional |
| `approved_at`           | Conditional |

## 4.3 `lab_result_template_fields`

| Field                    |    Required | Example                          |
| ------------------------ | ----------: | -------------------------------- |
| `id`                     |         Yes |                                  |
| `template_id`            |         Yes |                                  |
| `field_code`             |         Yes | `hb`, `wbc`, `malaria_result`    |
| `field_label`            |         Yes | Haemoglobin                      |
| `field_type`             |         Yes | numeric, coded, text, semi_quant |
| `unit_id`                | Conditional | g/dL                             |
| `reference_range_set_id` |    Optional | Adult female Hb                  |
| `coded_options_json`     |    Optional | Positive, negative, invalid      |
| `decimal_places`         |    Optional | 1                                |
| `required`               |         Yes |                                  |
| `critical_low`           |    Optional |                                  |
| `critical_high`          |    Optional |                                  |
| `display_order`          |         Yes |                                  |

---

## 5. Starter result templates by test

## 5.1 Malaria RDT

| Field           | Type           | Options                       |
| --------------- | -------------- | ----------------------------- |
| Result          | Coded          | Negative, Positive, Invalid   |
| Species/antigen | Coded optional | Pf, Pan, Mixed, Not specified |
| Kit lot         | Text           | From inventory if mapped      |
| Kit expiry      | Date           | From inventory if mapped      |
| Comment         | Text           | Optional                      |

Rules:

```text
Invalid result → result status = repeat_required
Positive result → abnormal flag
```

---

## 5.2 Malaria microscopy

| Field            | Type         | Options / unit                                             |
| ---------------- | ------------ | ---------------------------------------------------------- |
| Parasites seen   | Coded        | Seen, Not seen                                             |
| Species          | Coded        | P. falciparum, P. malariae, P. vivax, mixed, not specified |
| Parasite density | Numeric/text | Parasites/µL or plus grading                               |
| Comment          | Text         | Optional                                                   |

---

## 5.3 CBC / FBC panel

| Component         | Field code    | Unit        | Type    |
| ----------------- | ------------- | ----------- | ------- |
| WBC               | `wbc`         | ×10⁹/L      | Numeric |
| RBC               | `rbc`         | ×10¹²/L     | Numeric |
| Haemoglobin       | `hb`          | g/dL        | Numeric |
| Haematocrit / PCV | `hct`         | % or L/L    | Numeric |
| MCV               | `mcv`         | fL          | Numeric |
| MCH               | `mch`         | pg          | Numeric |
| MCHC              | `mchc`        | g/dL        | Numeric |
| Platelets         | `platelets`   | ×10⁹/L      | Numeric |
| Neutrophils       | `neutrophils` | % or ×10⁹/L | Numeric |
| Lymphocytes       | `lymphocytes` | % or ×10⁹/L | Numeric |
| Monocytes         | `monocytes`   | % or ×10⁹/L | Numeric |
| Eosinophils       | `eosinophils` | % or ×10⁹/L | Numeric |
| Basophils         | `basophils`   | % or ×10⁹/L | Numeric |
| Comment           | `comment`     | —           | Text    |

CBC reference ranges vary by analyser, age, sex, and lab policy; the seed table should be treated as a template requiring facility approval, not as universal clinical truth. MedlinePlus and Merck both emphasize that normal/reference ranges vary by lab and patient factors. ([MedlinePlus][g6-3])

---

## 5.4 Haemoglobin single result

| Field       | Type    | Unit |
| ----------- | ------- | ---- |
| Haemoglobin | Numeric | g/dL |
| Comment     | Text    | —    |

---

## 5.5 Random / fasting blood sugar

| Field          | Type    | Unit                            |
| -------------- | ------- | ------------------------------- |
| Glucose        | Numeric | mmol/L, mg/dL                   |
| Sample type    | Coded   | Capillary, venous plasma        |
| Fasting status | Coded   | Fasting, random, unknown        |
| Method         | Coded   | Glucometer, laboratory analyser |
| Comment        | Text    | —                               |

MedlinePlus states that fasting blood glucose of 70–99 mg/dL, equivalent to about 3.9–5.5 mmol/L, is considered normal, while random glucose depends on when the patient last ate; it also notes normal ranges may vary between laboratories. Use such values as seed guidance only and allow facility-specific configuration. ([MedlinePlus][g6-4])

---

## 5.6 Urinalysis dipstick panel

| Component        | Type               | Options                                 |
| ---------------- | ------------------ | --------------------------------------- |
| Colour           | Coded              | Straw, yellow, amber, red, brown, other |
| Appearance       | Coded              | Clear, cloudy, turbid                   |
| Specific gravity | Numeric            | e.g. 1.000–1.040                        |
| pH               | Numeric            | pH                                      |
| Protein          | Semi-quant         | Negative, trace, +, ++, +++             |
| Glucose          | Semi-quant         | Negative, trace, +, ++, +++             |
| Ketones          | Semi-quant         | Negative, trace, +, ++, +++             |
| Blood            | Semi-quant         | Negative, trace, +, ++, +++             |
| Nitrite          | Coded              | Negative, positive                      |
| Leukocytes       | Semi-quant         | Negative, trace, +, ++, +++             |
| Bilirubin        | Semi-quant         | Negative, +, ++, +++                    |
| Urobilinogen     | Semi-quant/numeric | Normal, increased                       |
| Comment          | Text               | —                                       |

MedlinePlus describes urinalysis as physical, chemical and microscopic examination of urine and notes that it detects or measures compounds in urine; exact component interpretation should be configured by the lab and clinician governance team. ([MedlinePlus][g6-5])

---

## 5.7 Urine pregnancy test

| Field       | Type  | Options                     |
| ----------- | ----- | --------------------------- |
| hCG result  | Coded | Positive, negative, invalid |
| Sample type | Coded | Urine                       |
| Kit lot     | Text  | Optional                    |
| Kit expiry  | Date  | Optional                    |
| Comment     | Text  | Optional                    |

Rules:

```text
Pregnancy result is sensitive.
SMS/WhatsApp must never say “positive” or “negative”.
Use “Your clinic update is ready.”
```

---

## 5.8 Blood group and Rh

| Field       | Type  | Options            |
| ----------- | ----- | ------------------ |
| ABO group   | Coded | A, B, AB, O        |
| Rh factor   | Coded | Positive, negative |
| Comment     | Text  | Optional           |
| Verified by | User  | Required           |

---

## 5.9 Stool microscopy

| Field               | Type            | Options                 |
| ------------------- | --------------- | ----------------------- |
| Macroscopy          | Text/coded      | Form/appearance         |
| Ova/cysts/parasites | Text/coded      | Seen, not seen, specify |
| RBC                 | Semi-quant/text | Optional                |
| WBC/pus cells       | Semi-quant/text | Optional                |
| Comment             | Text            | Optional                |

---

## 5.10 External PDF result

| Field                     | Type        |               Required |
| ------------------------- | ----------- | ---------------------: |
| External lab              | Partner lab |                    Yes |
| External reference number | Text        |            Recommended |
| Result date               | Date/time   |                    Yes |
| PDF/image attachment      | File        |                    Yes |
| Structured summary        | Text        |            Recommended |
| Internal review status    | Coded       |                    Yes |
| Verified/released by      | User        | Yes if policy requires |

---

## 6. Reference ranges and units

## 6.1 Final reference-range policy

Reference ranges must be **configurable, versioned, and approved by the lab in-charge**.

```text
Do not hard-code medical reference ranges permanently in code.
Do not interpret results solely by generic internet ranges.
Do not use one adult range for children, pregnancy, or method-specific tests.
```

Lab-result reference ranges vary by laboratory, patient factors, specimen, method, and instrument. The system should therefore ship seed ranges only as editable defaults requiring facility approval before release. ([MedlinePlus][g6-6])

---

## 6.2 `lab_units`

| Field            |    Required | Example                     |
| ---------------- | ----------: | --------------------------- |
| `id`             |         Yes |                             |
| `unit_code`      |         Yes | `G_DL`, `MMOL_L`            |
| `display_unit`   |         Yes | g/dL                        |
| `ucum_code`      | Recommended | g/dL, mmol/L                |
| `unit_type`      |         Yes | concentration, count, ratio |
| `decimal_places` |         Yes | 1                           |
| `active`         |         Yes |                             |

## 6.3 Seed unit catalogue

| Unit code   | Display          | Use                              |
| ----------- | ---------------- | -------------------------------- |
| `G_DL`      | g/dL             | Haemoglobin, MCHC                |
| `G_L`       | g/L              | Haemoglobin alternative          |
| `PERCENT`   | %                | Haematocrit, differential        |
| `X10_9_L`   | ×10⁹/L           | WBC, platelets                   |
| `X10_12_L`  | ×10¹²/L          | RBC                              |
| `FL`        | fL               | MCV                              |
| `PG`        | pg               | MCH                              |
| `MMOL_L`    | mmol/L           | Glucose, electrolytes            |
| `MG_DL`     | mg/dL            | Glucose, creatinine alternative  |
| `UMOL_L`    | µmol/L           | Creatinine alternative           |
| `IU_L`      | IU/L             | Liver enzymes                    |
| `U_L`       | U/L              | Enzymes                          |
| `MM_HR`     | mm/hr            | ESR                              |
| `PH`        | pH               | Urine pH                         |
| `SPEC_GRAV` | specific gravity | Urinalysis                       |
| `COPIES_ML` | copies/mL        | Program/specialist tests, future |
| `QUAL`      | qualitative      | Positive/negative tests          |

---

## 6.4 `reference_range_sets`

| Field                      |    Required |
| -------------------------- | ----------: |
| `id`                       |         Yes |
| `test_id`                  |         Yes |
| `component_code`           | Conditional |
| `method`                   |    Optional |
| `specimen_type`            |    Optional |
| `unit_id`                  |         Yes |
| `sex`                      |    Optional |
| `min_age_days`             |    Optional |
| `max_age_days`             |    Optional |
| `pregnancy_status`         |    Optional |
| `low_value`                |    Optional |
| `high_value`               |    Optional |
| `critical_low`             |    Optional |
| `critical_high`            |    Optional |
| `coded_normal_values_json` |    Optional |
| `text_range`               |    Optional |
| `effective_from`           |         Yes |
| `effective_to`             |    Optional |
| `approval_status`          |         Yes |
| `approved_by`              | Conditional |
| `source_note`              |    Optional |

---

## 6.5 Starter reference-range placeholders

These are **starter templates**, not clinical-authority final values.

| Test/component            | Unit    | Starter adult range placeholder | Approval note              |
| ------------------------- | ------- | ------------------------------- | -------------------------- |
| Haemoglobin, adult male   | g/dL    | 13.0–17.0                       | Facility to approve        |
| Haemoglobin, adult female | g/dL    | 12.0–15.0                       | Facility to approve        |
| WBC                       | ×10⁹/L  | 4.0–11.0                        | Facility/analyser-specific |
| Platelets                 | ×10⁹/L  | 150–450                         | Facility/analyser-specific |
| RBC, adult male           | ×10¹²/L | 4.5–5.9                         | Facility/analyser-specific |
| RBC, adult female         | ×10¹²/L | 4.0–5.2                         | Facility/analyser-specific |
| MCV                       | fL      | 80–100                          | Facility/analyser-specific |
| MCH                       | pg      | 27–33                           | Facility/analyser-specific |
| MCHC                      | g/dL    | 32–36                           | Facility/analyser-specific |
| Fasting glucose           | mmol/L  | 3.9–5.5                         | Facility/method-specific   |
| Fasting glucose           | mg/dL   | 70–99                           | Facility/method-specific   |
| Random glucose            | mmol/L  | No single universal normal      | Interpret clinically       |
| Urine protein             | Qual    | Negative/trace                  | Method-specific            |
| Urine glucose             | Qual    | Negative                        | Method-specific            |
| Urine ketones             | Qual    | Negative                        | Method-specific            |
| Pregnancy test            | Qual    | Negative/positive/invalid       | No numeric range           |
| Malaria RDT               | Qual    | Negative/positive/invalid       | No numeric range           |

The fasting-glucose seed is consistent with MedlinePlus’ common fasting blood glucose range, but the system should still allow lab-specific units and ranges. ([MedlinePlus][g6-4])

---

## 7. Sample barcode and label format

## 7.1 Final barcode format

Use:

```text
{BRANCH_CODE}-LAB-{YYMMDD}-{SEQ4}-{SPECIMEN_CODE}
```

Example:

```text
RNG-LAB-260623-0042-EDTA
```

Where:

| Segment  | Meaning                 |
| -------- | ----------------------- |
| `RNG`    | Branch code             |
| `LAB`    | Department              |
| `260623` | Date: YYMMDD            |
| `0042`   | Daily sequence          |
| `EDTA`   | Specimen/container code |

## 7.2 Barcode symbology

| Label type            | Default      | Optional   |
| --------------------- | ------------ | ---------- |
| Sample tube/container | Code128      | QR         |
| Result printout       | QR           | Code128    |
| Send-out dispatch     | Code128 + QR | SSCC later |
| External lab packet   | QR           | Code128    |

## 7.3 Sample label contents

Minimum label:

```text
Sample: RNG-LAB-260623-0042-EDTA
Patient: J. Wanjiku / PT-000456
Age/Sex: 32F
Specimen: Blood - EDTA
Tests: CBC
Collected: 23-Jun-2026 10:42
Branch: Rongai
Barcode: [Code128]
```

## 7.4 Sensitive label option

For sensitive tests, support a privacy label:

```text
Sample: RNG-LAB-260623-0048-BLD
Patient ID: PT-000456
Specimen: Blood
Collected: 23-Jun-2026 10:42
Barcode: [Code128]
```

Avoid printing sensitive test names such as HIV, pregnancy, STI, or similar on open labels where unnecessary.

## 7.5 Label sizes

| Size                | Use                    |
| ------------------- | ---------------------- |
| 50 × 25 mm          | Tubes/small containers |
| 70 × 40 mm          | Urine/stool containers |
| A6/A5 dispatch note | External send-out      |
| A4 report           | Final lab result       |

## 7.6 Sample ID rules

| Rule                            | Behaviour                                    |
| ------------------------------- | -------------------------------------------- |
| Sample ID must be unique        | Block duplicates                             |
| Sample label can be reprinted   | Reason required                              |
| Sample rejected                 | Label status becomes rejected                |
| Sample recollected              | New sample ID, linked to original            |
| Multiple specimens per order    | One barcode per specimen                     |
| One specimen for multiple tests | Same sample can support multiple order lines |
| External send-out               | Sample barcode appears on dispatch manifest  |

---

## 8. Sample status lifecycle

## 8.1 Final sample/order status model

Separate **order**, **sample**, and **result** statuses.

## 8.2 Lab order status

```text
draft
ordered
awaiting_billing
billed_unpaid
paid_or_covered
awaiting_collection
partially_collected
collected
in_process
partially_resulted
resulted
verified
released
completed
cancelled
```

## 8.3 Sample status

```text
not_required
awaiting_collection
collected
received_by_lab
rejected
recollection_required
in_process
sent_out
received_by_external_lab
lost
disposed
closed
```

## 8.4 Result status

```text
not_started
draft
entered
pending_verification
verified
released
corrected
cancelled
invalid_repeat_required
```

## 8.5 Status transition rules

| From                                  | To                                      | Required |
| ------------------------------------- | --------------------------------------- | -------- |
| Ordered → Awaiting billing            | Billable test                           |          |
| Awaiting billing → Paid/covered       | Payment, cover, waiver, credit, package |          |
| Paid/covered → Awaiting collection    | Lab queue                               |          |
| Awaiting collection → Collected       | Collector, specimen, time, sample ID    |          |
| Collected → Rejected                  | Rejection reason                        |          |
| Collected → In process                | Lab user                                |          |
| In process → Result entered           | Result fields                           |          |
| Result entered → Pending verification | Submit action                           |          |
| Pending verification → Verified       | Authorized verifier                     |          |
| Verified → Released                   | Release action                          |          |
| Released → Corrected                  | Correction workflow                     |          |

---

## 9. Billing-before-test and exception policy

## 9.1 Default policy

```text
Default: no sample collection or testing until the test is paid, covered, credit-approved, package-included, waived, or emergency-overridden.
```

## 9.2 Allowed billing states

| Billing state          | Collection allowed? | Result release allowed? |
| ---------------------- | ------------------: | ----------------------: |
| Paid                   |                 Yes |                     Yes |
| Covered by insurer/SHA |                 Yes |                     Yes |
| Credit approved        |                 Yes |                     Yes |
| Package included       |                 Yes |                     Yes |
| Waived by manager      |                 Yes |                     Yes |
| Emergency override     |                 Yes |        Yes, with review |
| Billed unpaid          |       No by default |           No by default |
| Pending billing        |       No by default |                      No |
| Cancelled/refunded     |                  No |                      No |

## 9.3 Exception types

| Exception                    | Who can approve       | Required reason        |
| ---------------------------- | --------------------- | ---------------------- |
| Emergency urgent test        | Clinician/manager     | Clinical urgency       |
| Corporate credit             | Billing/manager       | Active credit account  |
| Insurer pre-auth pending     | Claims/billing        | Payer process          |
| Package included             | System                | Package reference      |
| Manager waiver               | Manager/owner         | Waiver reason          |
| Public health/no-charge test | Manager/clinical lead | Programme reason       |
| Staff benefit                | Manager               | Staff scheme           |
| System downtime              | Manager               | Offline/payment outage |

## 9.4 Exception fields

| Field                    | Required |
| ------------------------ | -------: |
| `exception_type`         |      Yes |
| `approved_by`            |      Yes |
| `approval_datetime`      |      Yes |
| `reason`                 |      Yes |
| `linked_visit_id`        |      Yes |
| `billing_resolution_due` | Optional |
| `resolved_status`        |      Yes |
| `audit_log_id`           |      Yes |

## 9.5 Exception report

Every exception should appear in a daily report:

| Column              |
| ------------------- |
| Date                |
| Patient             |
| Test                |
| Amount              |
| Exception type      |
| Approver            |
| Reason              |
| Result status       |
| Billing resolved?   |
| Outstanding balance |

---

## 10. Partner-lab contract and send-out handling

## 10.1 Partner-lab master

### `external_labs`

| Field                      |    Required |
| -------------------------- | ----------: |
| `id`                       |         Yes |
| `lab_name`                 |         Yes |
| `contact_person`           | Recommended |
| `phone`                    | Recommended |
| `email`                    | Recommended |
| `physical_address`         | Recommended |
| `licence_number`           | Recommended |
| `accreditation_details`    |    Optional |
| `contract_status`          |         Yes |
| `default_turnaround_hours` | Recommended |
| `result_delivery_method`   |         Yes |
| `payment_terms`            | Recommended |
| `sample_pickup_available`  |         Yes |
| `courier_required`         |         Yes |
| `status`                   |         Yes |

## 10.2 Partner-lab contract fields

### `external_lab_contracts`

| Field                                |                                  Required |
| ------------------------------------ | ----------------------------------------: |
| `id`                                 |                                       Yes |
| `external_lab_id`                    |                                       Yes |
| `branch_id`                          |                                       Yes |
| `contract_number`                    |                               Recommended |
| `effective_from`                     |                                       Yes |
| `effective_to`                       |                                  Optional |
| `price_list_document_id`             |                               Recommended |
| `service_level_json`                 |                               Recommended |
| `sample_requirements_json`           |                               Recommended |
| `result_format`                      |                                       Yes |
| `data_sharing_agreement_document_id` |                               Recommended |
| `courier_terms`                      |                                  Optional |
| `billing_model`                      | Yes: prepaid, monthly_invoice, per_sample |
| `status`                             |                                       Yes |

## 10.3 External result formats

| Format                  |      MVP support | Handling                                  |
| ----------------------- | ---------------: | ----------------------------------------- |
| PDF attachment          |              Yes | Upload and attach to result               |
| Image/JPEG/PNG          |              Yes | Upload and attach                         |
| Structured manual entry |              Yes | Enter key values using internal template  |
| Email result            |              Yes | Upload PDF/file and record source         |
| Portal reference        |              Yes | Store external reference number           |
| CSV/Excel               |               V2 | Import mapper                             |
| HL7/FHIR API            |               V3 | Adapter                                   |
| WhatsApp image          | Avoid as primary | Download/upload with audit if unavoidable |

## 10.4 Send-out chain-of-custody fields

| Field                       |    Required |
| --------------------------- | ----------: |
| `sendout_number`            |         Yes |
| `sample_id`                 |         Yes |
| `external_lab_id`           |         Yes |
| `packed_by`                 |         Yes |
| `packed_at`                 |         Yes |
| `dispatched_by`             |         Yes |
| `dispatched_at`             |         Yes |
| `courier_name`              |    Optional |
| `courier_phone`             |    Optional |
| `tracking_reference`        |    Optional |
| `temperature_condition`     | Conditional |
| `received_by_external_lab`  | Recommended |
| `external_received_at`      | Recommended |
| `external_reference_number` | Recommended |
| `expected_result_at`        |         Yes |
| `result_received_at`        | Conditional |
| `delay_reason`              | Conditional |
| `status`                    |         Yes |

## 10.5 Send-out status lifecycle

```text
ordered
billed_or_covered
collected
packed
dispatched
received_by_external_lab
processing_external
result_received
internal_review_pending
verified_released
completed
```

Exception statuses:

```text
external_rejected
recollection_required
delayed
lost_in_transit
cancelled
corrected_by_external_lab
```

## 10.6 Send-out rules

| Rule                               | Behaviour                               |
| ---------------------------------- | --------------------------------------- |
| External test has no partner lab   | Cannot activate                         |
| Sample not collected               | Cannot dispatch                         |
| Dispatch missing                   | Send-out remains pending                |
| External result overdue            | Alert lab in-charge                     |
| Result arrives as PDF              | Attach and mark internal review pending |
| Result values manually transcribed | Require verifier review                 |
| External lab rejects sample        | Recollection/refund workflow            |
| External correction                | Keep original, add corrected version    |
| Data-sharing agreement missing     | Warning/block configurable              |

---

## 11. Verification roles and permissions

## 11.1 Final verification role model

| Role             | Can collect? | Can enter result? |                     Can verify? | Notes                                               |
| ---------------- | -----------: | ----------------: | ------------------------------: | --------------------------------------------------- |
| Receptionist     |           No |                No |                              No | Can create order if allowed                         |
| Nurse/triage     |      Limited |                No |                              No | Collection only if facility policy allows           |
| Lab assistant    |          Yes |           Limited |                              No | Optional role                                       |
| Lab technician   |          Yes |               Yes | Configurable for low-risk tests |                                                     |
| Lab technologist |          Yes |               Yes |                             Yes |                                                     |
| Lab in-charge    |          Yes |               Yes |       Yes + correction approval |                                                     |
| Clinician        |   No/limited |                No |                              No | Reviews clinical result, does not verify lab result |
| Manager          |           No |                No |                              No | Can approve billing exception                       |
| Auditor          |         View |              View |                            View | Read-only                                           |

## 11.2 Test-risk verification levels

| Risk level | Example                               | Minimum verification                    |
| ---------- | ------------------------------------- | --------------------------------------- |
| Low        | Pregnancy test, malaria RDT           | Lab technician/technologist             |
| Medium     | CBC, urinalysis microscopy            | Lab technologist or configured verifier |
| High       | HIV/sensitive tests, critical results | Lab in-charge/authorized verifier       |
| External   | HbA1c, LFT, RFT                       | Internal review before release          |
| Critical   | Any critical abnormal result          | Verifier + clinician alert log          |

## 11.3 Verification rules

```text
RULE: Verify result
IF user.professional_licence_status = active
AND user.branch_assignment = active
AND user.role has verification permission for test.risk_level
THEN allow verification
ELSE block
```

```text
RULE: Release result
IF result.status = verified
AND billing_status allows release
THEN allow print/share/release
ELSE block
```

---

## 12. Data model additions and refinements

## 12.1 `lab_tests`

Add or confirm:

| Field                              |
| ---------------------------------- |
| `test_code`                        |
| `test_name`                        |
| `category`                         |
| `loinc_code`                       |
| `specimen_type_id`                 |
| `container_type_id`                |
| `result_template_id`               |
| `default_result_unit_id`           |
| `performance_location`             |
| `risk_level`                       |
| `requires_clinician_order`         |
| `requires_consent`                 |
| `requires_fasting`                 |
| `requires_verification`            |
| `sensitive_flag`                   |
| `billing_item_id`                  |
| `inventory_consumption_profile_id` |
| `external_lab_id`                  |
| `turnaround_minutes`               |
| `active_status`                    |
| `approval_status`                  |

## 12.2 `specimen_types`

| Field           |
| --------------- |
| `id`            |
| `specimen_code` |
| `specimen_name` |
| `description`   |
| `active`        |

Seed:

```text
BLD - Blood
SER - Serum
PLA - Plasma
UR - Urine
STL - Stool
SWB - Swab
CAP - Capillary blood
EDTA - EDTA blood
```

## 12.3 `container_types`

| Field              |
| ------------------ |
| `id`               |
| `container_code`   |
| `container_name`   |
| `specimen_type_id` |
| `additive`         |
| `colour_hint`      |
| `active`           |

Seed:

```text
EDTA tube
Plain tube
Fluoride tube
Urine container
Stool container
Swab tube
Slide
RDT cassette
Capillary tube
```

## 12.4 `lab_orders`

Add:

| Field                  |
| ---------------------- |
| `order_source`         |
| `billing_exception_id` |
| `clinical_indication`  |
| `diagnosis_id`         |
| `priority`             |
| `claim_linked`         |
| `package_id`           |
| `created_by_role`      |

## 12.5 `lab_samples`

Add:

| Field                       |
| --------------------------- |
| `sample_number`             |
| `barcode_value`             |
| `label_print_count`         |
| `specimen_type_id`          |
| `container_type_id`         |
| `sample_condition`          |
| `rejection_reason_code`     |
| `recollection_of_sample_id` |
| `chain_of_custody_json`     |

## 12.6 `lab_results`

Add:

| Field                          |
| ------------------------------ |
| `result_template_id`           |
| `result_version`               |
| `method`                       |
| `device_id`                    |
| `reagent_lot`                  |
| `reagent_expiry`               |
| `reference_range_set_id`       |
| `critical_notification_status` |
| `released_to_patient_at`       |
| `released_to_clinician_at`     |
| `corrected_from_result_id`     |
| `correction_reason`            |

---

## 13. API additions and refinements

## 13.1 Catalogue endpoints

| Endpoint                                  | Purpose             |
| ----------------------------------------- | ------------------- |
| `POST /lab/catalogue/seed`                | Load seed catalogue |
| `GET /lab/tests`                          | Search tests        |
| `POST /lab/tests`                         | Create test         |
| `PATCH /lab/tests/{id}`                   | Update test         |
| `POST /lab/tests/{id}/approve`            | Approve test        |
| `POST /lab/tests/{id}/disable`            | Disable test        |
| `POST /lab/tests/{id}/reference-ranges`   | Add ranges          |
| `POST /lab/result-templates`              | Create template     |
| `POST /lab/result-templates/{id}/approve` | Approve template    |

## 13.2 Sample/barcode endpoints

| Endpoint                               | Purpose                    |
| -------------------------------------- | -------------------------- |
| `POST /lab/orders/{id}/samples`        | Create/collect sample      |
| `POST /lab/samples/{id}/label`         | Generate label             |
| `POST /lab/samples/{id}/reprint-label` | Reprint label with reason  |
| `POST /lab/samples/{id}/reject`        | Reject sample              |
| `POST /lab/samples/{id}/recollect`     | Create recollection sample |
| `GET /lab/samples/{barcode}`           | Lookup sample by barcode   |

## 13.3 Billing exception endpoints

| Endpoint                                    | Purpose           |
| ------------------------------------------- | ----------------- |
| `POST /lab/billing-exceptions`              | Create exception  |
| `POST /lab/billing-exceptions/{id}/approve` | Approve exception |
| `GET /lab/reports/billing-exceptions`       | Exception report  |

## 13.4 External lab endpoints

| Endpoint                                  | Purpose         |
| ----------------------------------------- | --------------- |
| `POST /lab/external-labs`                 | Add partner lab |
| `POST /lab/external-lab-contracts`        | Add contract    |
| `POST /lab/sendouts`                      | Create send-out |
| `POST /lab/sendouts/{id}/dispatch`        | Dispatch        |
| `POST /lab/sendouts/{id}/confirm-receipt` | Confirm receipt |
| `POST /lab/sendouts/{id}/receive-result`  | Receive result  |
| `POST /lab/sendouts/{id}/mark-delayed`    | Record delay    |
| `GET /lab/sendouts/overdue`               | Overdue list    |

## 13.5 Verification endpoints

| Endpoint                                       | Purpose                      |
| ---------------------------------------------- | ---------------------------- |
| `POST /lab/results`                            | Enter result                 |
| `POST /lab/results/{id}/submit-verification`   | Submit                       |
| `POST /lab/results/{id}/verify`                | Verify                       |
| `POST /lab/results/{id}/release`               | Release                      |
| `POST /lab/results/{id}/correct`               | Correct result               |
| `POST /lab/results/{id}/critical-notification` | Record critical notification |

---

## 14. Workflows finalized

## 14.1 In-house paid lab test

```text
1. Clinician or reception orders test
2. Billing item is created
3. Patient pays or cover is confirmed
4. Lab prints sample label
5. Lab collects sample
6. Lab performs test
7. Lab enters result using test template
8. Result submitted for verification
9. Authorized verifier releases result
10. Clinician reviews result
11. Patient copy printed/shared safely
```

## 14.2 Emergency exception test

```text
1. Clinician marks test urgent/emergency
2. Billing exception requested
3. Authorized user approves exception
4. Lab collects and processes sample
5. Result is verified and released
6. Billing follows up later
7. Exception appears in daily exception report
```

## 14.3 Sample rejection

```text
1. Sample collected
2. Lab identifies issue: clotted, insufficient, haemolysed, leaking, wrong container
3. Sample rejected with reason
4. Result entry blocked
5. Recollection task created
6. Patient/clinician notified according to workflow
7. Rejection appears in quality report
```

## 14.4 External send-out

```text
1. External test ordered
2. Billing/cover confirmed
3. Sample collected and labelled
4. Send-out record created
5. Dispatch manifest printed
6. External lab receipt recorded
7. Result received as PDF/structured entry
8. Internal review/verification completed
9. Result released to EMR/patient/claim bundle
```

## 14.5 Corrected result

```text
1. Error discovered
2. Correction request created with reason
3. Original result remains locked
4. Corrected version created
5. Lab in-charge verifies correction
6. Clinician notified if result was already released/reviewed
7. Corrected report is printed/shared
8. Audit log preserved
```

---

## 15. Developer acceptance criteria

## 15.1 Test catalogue

| Test                                       | Expected result                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| Seed catalogue loaded                      | Core tests appear with categories, specimen, template, billing item placeholder |
| Activate test without template             | Blocked                                                                         |
| Activate test without billing item         | Blocked                                                                         |
| Activate in-house test without lab service | Blocked                                                                         |
| External test without partner lab          | Blocked                                                                         |
| Sensitive test                             | Access and notification restrictions apply                                      |
| LOINC code missing                         | Allowed but warning, not blocked                                                |

## 15.2 Sample barcode/label

| Test              | Expected result                                        |
| ----------------- | ------------------------------------------------------ |
| Collect sample    | Unique sample number generated                         |
| Print label       | Code128 label printed with patient/sample/test details |
| Reprint label     | Reason required                                        |
| Multiple samples  | Each specimen gets separate barcode                    |
| Sensitive test    | Privacy-safe label option available                    |
| Duplicate barcode | Blocked                                                |
| Recollection      | New sample linked to rejected sample                   |

## 15.3 Result templates and ranges

| Test                    | Expected result                                                |
| ----------------------- | -------------------------------------------------------------- |
| Enter malaria RDT       | Positive/negative/invalid options                              |
| Enter CBC               | Panel fields appear                                            |
| Enter glucose           | Numeric value and unit required                                |
| Enter urinalysis        | Semi-quantitative panel appears                                |
| Missing reference range | Result can save with warning or block based on facility policy |
| Abnormal value          | Abnormal flag calculated                                       |
| Critical value          | Critical alert created                                         |
| Change reference range  | New version, old results keep old range                        |

## 15.4 Billing exceptions

| Test                  | Expected result                             |
| --------------------- | ------------------------------------------- |
| Unpaid test           | Collection blocked by default               |
| Paid test             | Collection allowed                          |
| Emergency exception   | Collection allowed with approval and reason |
| Package-included test | Collection allowed                          |
| Credit-approved test  | Collection allowed                          |
| Waived test           | Manager approval required                   |
| Exception report      | Shows all exceptions and unresolved billing |

## 15.5 External send-out

| Test                        | Expected result                                    |
| --------------------------- | -------------------------------------------------- |
| Create send-out             | Partner lab, sample, expected result date captured |
| Dispatch sample             | Status becomes dispatched                          |
| External lab receipt        | Status becomes received by external lab            |
| Result overdue              | Alert created                                      |
| Upload external PDF         | Result attached and internal review pending        |
| External result corrected   | Corrected version created                          |
| External lab rejects sample | Recollection/refund workflow triggered             |

## 15.6 Verification roles

| Test                         | Expected result                                          |
| ---------------------------- | -------------------------------------------------------- |
| Receptionist tries to verify | Blocked                                                  |
| Lab tech enters result       | Allowed if role configured                               |
| Lab technologist verifies    | Allowed                                                  |
| Licence inactive             | Verification blocked                                     |
| Sensitive/high-risk test     | Requires lab in-charge or configured authorized verifier |
| Verified result printed      | Allowed                                                  |
| Unverified result printed    | Blocked or draft-watermarked based on policy             |

---

## 16. Implementation sequence

## Phase 1: Catalogue and templates

Build:

```text
lab_tests
specimen_types
container_types
lab_units
lab_result_templates
lab_result_template_fields
reference_range_sets
seed catalogue v1
approval workflow
```

## Phase 2: Orders, billing gate, samples

Build:

```text
lab_orders
lab_order_lines
billing status integration
billing exceptions
lab_samples
sample barcode/label generation
sample rejection/recollection
```

## Phase 3: Results and verification

Build:

```text
lab_results
lab_result_components
result entry UI
abnormal/critical flags
verification workflow
result release
result correction
```

## Phase 4: External send-out

Build:

```text
external_labs
external_lab_contracts
external_lab_sendouts
dispatch manifest
external result upload
overdue alerts
```

## Phase 5: Reporting and interoperability

Build:

```text
pending tests report
unbilled tests report
critical results report
rejected samples report
send-out report
LOINC mapping
FHIR-ready ServiceRequest/Specimen/Observation/DiagnosticReport mapping
```

---

## 17. Final handoff summary

Module 6 is now developer-ready with these final decisions:

| Area                   | Final state                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Initial test catalogue | Seed catalogue v1 defined                                                                                             |
| Sample barcode/label   | Format and label content defined                                                                                      |
| Result templates       | Numeric, coded, semi-quant, panel, microscopy, PDF templates defined                                                  |
| Reference ranges       | Configurable, versioned, approval-required                                                                            |
| Units                  | Seed unit catalogue defined                                                                                           |
| Billing exceptions     | Default block + controlled exceptions defined                                                                         |
| External labs          | Contract, dispatch, result-format handling defined                                                                    |
| Verification roles     | Role and licence-based verification defined                                                                           |
| Data model             | Additions defined                                                                                                     |
| APIs                   | Additions defined                                                                                                     |
| Developer readiness    | High                                                                                                                  |
| Governance risk        | Reference ranges, sensitive tests, and verification rules need lab in-charge/clinical lead approval before production |

The closed Module 6 rule is:

```text
No lab result should be released unless the system can prove:
the test was active and appropriate for the branch,
the patient and visit/order were identified,
billing or a valid exception was resolved,
the sample was labelled and tracked,
the correct result template and reference range version were used,
the result was entered by an authorized user,
the result was verified by an authorized licensed lab professional,
critical or sensitive results were handled safely,
and every print, correction, share, or send-out was audited.
```

[g6-1]: https://www.kmlttb.org/?utm_source=chatgpt.com "KMLTTB | Kenya Medical Laboratory Technicians & Technologist Board"
[g6-2]: https://www.regenstrief.org/real-world-solutions/loinc/?utm_source=chatgpt.com "LOINC Data Standards - Regenstrief Institute"
[g6-3]: https://medlineplus.gov/laboratorytests.html?utm_source=chatgpt.com "Laboratory Tests - MedlinePlus"
[g6-4]: https://medlineplus.gov/ency/article/003482.htm?utm_source=chatgpt.com "Blood sugar test: MedlinePlus Medical Encyclopedia"
[g6-5]: https://medlineplus.gov/ency/article/003579.htm?utm_source=chatgpt.com "Urinalysis: MedlinePlus Medical Encyclopedia"
[g6-6]: https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/?utm_source=chatgpt.com "How to Understand Your Lab Results: MedlinePlus Medical Test"
