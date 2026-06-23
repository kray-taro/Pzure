# Module 5: Clinic EMR Module

This module is the **clinical record and continuity-of-care engine** of the system.

Modules 1–4 answer:

```text
Module 1: Is the clinic/facility and clinician licensed?
Module 2: Was the visit billed, paid, invoiced, and receipted?
Module 3: Was the prescription dispensed safely?
Module 4: Was medicine/consumable stock controlled?
Module 5: Was the patient clinically assessed, documented, treated, followed up, referred, and summarized properly?
```

For a small Kenyan clinic, the EMR must be **fast enough for a busy outpatient clinician**, but structured enough to support:

```text
registration → queue → triage → consultation → diagnosis → orders → results → prescription → billing → claims → referral/follow-up → visit summary
```

Kenya’s Digital Health Act points toward integrated digital health systems with a national health data dictionary, client registry, facility registry, health worker registry, interoperability layer, shared health records, health management information systems, and finance/insurance services. That means the EMR should be simple for today’s clinic but designed for future interoperability. ([Kenya Law][1])

---

# 1. Purpose of the module

The Clinic EMR Module should:

| Purpose                  | Practical meaning                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Register patients        | Capture identity, demographics, contacts, next of kin                                                  |
| Manage patient flow      | Move patient from reception to triage to clinician to lab/pharmacy/billing                             |
| Record clinical care     | Complaint, history, exam, diagnosis, plan, orders, prescription                                        |
| Support safety           | Allergies, vitals, pregnancy, chronic conditions, medication history                                   |
| Support claims           | Structured diagnosis, services, orders, results, clinician identity, visit evidence                    |
| Support continuity       | Previous visits, chronic care, refills, referrals, visit summaries                                     |
| Support reporting        | Clinic activity, diagnoses, services, outcomes, chronic care, immunisation                             |
| Support referrals        | Generate referral notes and track receiving facility                                                   |
| Support privacy          | Role-based access, audit logs, consent, health-data protection                                         |
| Support interoperability | FHIR-ready patient, encounter, observation, diagnosis, medication, service request, document reference |

---

# 2. Kenya-specific design basis

## A. Facility licensing and professional accountability

A clinic EMR should not allow clinical work to run as though licensing does not matter. KMPDC’s health facility registration process includes county inspection, online registration, prescribed fees, committee approval, and issuance of a registration certificate. ([KMPDC][2])

Software implication:

| Requirement                | EMR behaviour                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| Active facility licence    | Required before enabling live clinical consultations                                                |
| Active clinician licence   | Required before signing clinical notes, prescriptions, certificates, referrals, and claim documents |
| Approved facility services | Facility should not bill/claim services outside its approved scope                                  |
| Facility identity          | Facility code, licence number, KMPDC/KMHFL mapping where available                                  |
| Clinical lead              | Link signed clinical records to responsible professional                                            |

---

## B. Health data and privacy

Kenya’s Data Protection Act defines health data as data related to a person’s physical or mental health, including data collected during registration for, or provision of, health services. It also classifies health status as sensitive personal data. ([Kenya Law][3])

Software implication:

| Requirement                          | EMR behaviour                                                    |
| ------------------------------------ | ---------------------------------------------------------------- |
| Patient data is sensitive            | Encrypt, restrict, audit                                         |
| Staff access must be role-based      | Reception should not see everything a clinician sees             |
| Consent must be captured             | Especially for SMS/WhatsApp, sharing, marketing, referrals       |
| Minor records need stricter handling | Guardian, consent, custody/access controls                       |
| Every access should be logged        | Who viewed, edited, printed, exported                            |
| Data export must be controlled       | Patient summaries, claim packs, referrals, reports               |
| DPO/data protection workflow         | Especially for clinics processing sensitive health data at scale |

---

## C. SHA/private insurance and claims

SHA regulations require contracted providers/facilities to maintain adequate systems for collecting, processing, maintaining, storing, retrieving, and distributing beneficiary records, and to retain beneficiary records in a readily accessible format. SHA also processes pre-authorizations and claims through a Centralized Digital Platform. ([Kenya Law][4])

Software implication:

| Claims requirement                   | EMR requirement                                                      |
| ------------------------------------ | -------------------------------------------------------------------- |
| Claims need clinical evidence        | Diagnosis, notes, orders, results, prescriptions, service timestamps |
| Services must be medically necessary | Link billed services to clinical indication                          |
| Claims may be returned for errors    | Structured fields reduce rejections                                  |
| Referrals matter                     | Referral source and destination should be captured                   |
| Benefit limits matter                | EMR should support payer rules through claims module                 |
| Fraud prevention                     | No billing for services not documented or not provided               |

---

## D. Diagnosis coding

The EMR should be **ICD-10-ready**. WHO’s ICD-10 browser is the International Statistical Classification of Diseases and Related Health Problems, 10th Revision, and supports browsing/searching the classification. ([ICD-11][5])

Software implication:

| Requirement                 | EMR behaviour                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Diagnosis text              | Clinician-friendly free-text diagnosis                                                      |
| ICD-10 code                 | Structured code for claims/reporting                                                        |
| Provisional/final diagnosis | Distinguish working diagnosis from confirmed diagnosis                                      |
| Primary/secondary diagnosis | Claims and clinical clarity                                                                 |
| Common diagnosis shortcuts  | Malaria, URTI, gastroenteritis, hypertension, diabetes, asthma, UTI, ANC-related conditions |

---

## E. Public health reporting readiness

Kenya’s Ministry of Health lists KHIS as a key national portal, and the MOH Virtual Academy describes KHIS Aggregate as powered by DHIS2 for data entry, reporting, and visualization. ([Ministry of Health][6]) ([elearning.health.go.ke][7])

Software implication:

| Requirement        | EMR behaviour                                                                      |
| ------------------ | ---------------------------------------------------------------------------------- |
| Aggregate reports  | OPD visits, diagnoses, maternal/child health, immunisation, lab statistics         |
| Program flags      | HIV/TB referral, chronic disease, immunisation, antenatal/postnatal where relevant |
| Export-ready data  | CSV/API/manual summary for KHIS/DHIS2-style reporting                              |
| Avoid double entry | Facility reports should be generated from clinical records where possible          |

---

# 3. Core users

| User                            | Main actions                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Receptionist                    | Register patient, book appointment, check queue, start visit, capture payment status |
| Triage nurse/clinical assistant | Capture vitals, reason for visit, allergies, pregnancy flag                          |
| Clinician                       | Document consultation, diagnosis, orders, prescription, referral, certificates       |
| Nurse                           | Immunisation, procedures, follow-up, chronic-care review                             |
| Lab user                        | Receive orders, enter results, attach reports                                        |
| Pharmacist                      | Receive prescription from EMR and dispense through Module 3                          |
| Billing officer                 | Bill consultation, lab, procedure, drugs, insurer/SHA split                          |
| Claims officer                  | Generate claim-ready records                                                         |
| Branch/facility manager         | Monitor visits, workload, reports, pending tasks                                     |
| Medical director/clinical lead  | Review clinical quality, sign off sensitive records                                  |
| Auditor/compliance officer      | Review clinical documentation, access logs, claims evidence                          |

---

# 4. Relationship with modules 1–4

## Module 1: Organisation and Licensing

| Data from Module 1          | EMR use                                             |
| --------------------------- | --------------------------------------------------- |
| Facility licence            | Enables clinical operations                         |
| Approved services           | Controls services/procedures available              |
| Clinician licence           | Controls who can sign notes, orders, certificates   |
| Branch/facility profile     | Appears on visit summaries, referrals, certificates |
| SHA/private contracts       | Enables claims workflow                             |
| ODPC/data protection record | Supports privacy compliance                         |

## Module 2: POS, Billing and Payments

| Billing event      | EMR link                                           |
| ------------------ | -------------------------------------------------- |
| Consultation bill  | Linked to visit                                    |
| Lab/procedure bill | Linked to clinical order                           |
| Prescription bill  | Linked to prescription                             |
| Insurer/SHA claim  | Linked to diagnosis and service evidence           |
| Receipt/invoice    | Linked to visit account                            |
| Credit note/refund | Linked to cancelled service/order where applicable |

## Module 3: Pharmacy Dispensing

| Pharmacy event         | EMR link                           |
| ---------------------- | ---------------------------------- |
| Prescription created   | Sent to pharmacy queue             |
| Prescription dispensed | Medication history updated         |
| Partial dispense       | EMR shows actual quantity supplied |
| Substitution           | EMR shows prescribed vs dispensed  |
| Refill                 | Chronic-care plan updated          |
| ADR report             | Patient safety record updated      |

## Module 4: Inventory

| Inventory event            | EMR link                                     |
| -------------------------- | -------------------------------------------- |
| Lab reagent/consumable use | Stock consumption                            |
| Procedure consumables      | Dressing, syringe, vaccine, nebulization kit |
| Vaccine stock              | Immunisation stock usage                     |
| Medicine issue             | Through pharmacy module                      |
| Cold-chain vaccine         | Vaccine batch/expiry traceability            |

---

# 5. Core clinical transaction types

| Transaction               | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| New outpatient visit      | First-time patient consultation                              |
| Return outpatient visit   | Repeat/review visit                                          |
| Nurse/triage-only visit   | Vitals, screening, minor service                             |
| Chronic-care visit        | Diabetes, hypertension, asthma, epilepsy follow-up           |
| Lab-only visit            | Walk-in or clinician-ordered test                            |
| Procedure visit           | Dressing, injection, nebulization, wound care                |
| Immunisation visit        | Vaccine administration record                                |
| Referral visit            | Patient referred in or out                                   |
| Emergency stabilization   | Initial urgent care before referral                          |
| Teleconsultation          | If enabled and lawful                                        |
| Corporate/insurance visit | Employer/private insurer/SHA workflow                        |
| Certificate visit         | Sick-off, school/work note, medical certificate where lawful |

---

# 6. Feature-by-feature design

## A. Registration

Registration should be fast but strong enough to identify the patient correctly.

### Registration fields

| Field                                  |           Required? | Notes                                   |
| -------------------------------------- | ------------------: | --------------------------------------- |
| Patient number                         |                 Yes | Auto-generated                          |
| Full name                              |                 Yes | As per ID/guardian                      |
| Sex                                    |                 Yes | Male/female/other as configured         |
| Date of birth                          |         Recommended | If unknown, capture estimated age       |
| Age                                    |                 Yes | Auto from DOB or manual estimate        |
| Phone number                           |         Recommended | For follow-up, results, reminders       |
| Alternative phone                      |            Optional | Useful for chronic care                 |
| National ID/passport/birth certificate |         Recommended | Optional for minor/urgent cases         |
| SHA/member number                      |            Optional | If claims enabled                       |
| Private insurer details                |            Optional | Payer workflow                          |
| Next of kin                            |         Recommended | Emergency/contact                       |
| Next of kin phone                      |         Recommended |                                         |
| Guardian/caregiver                     | Required for minors |                                         |
| County/sub-county/ward                 |         Recommended | Reporting/public health                 |
| Physical address                       |            Optional |                                         |
| Occupation                             |            Optional | Clinical/social relevance               |
| Marital status                         |            Optional |                                         |
| Allergies                              |         Recommended | Safety                                  |
| Chronic conditions                     |         Recommended | Diabetes, hypertension, asthma, etc.    |
| Current medications                    |            Optional | Safety                                  |
| Consent preferences                    |                 Yes | SMS, WhatsApp, sharing, reminders       |
| Patient category                       |                 Yes | Walk-in, corporate, SHA, private, staff |
| Registration source                    |                 Yes | Walk-in, referral, outreach, online     |
| Status                                 |                 Yes | Active, deceased, duplicate, inactive   |

### Registration rules

| Rule                           | System behaviour                                               |
| ------------------------------ | -------------------------------------------------------------- |
| Duplicate phone/name/DOB match | Warn possible duplicate                                        |
| Minor patient                  | Require guardian/caregiver where possible                      |
| Emergency patient              | Allow minimal registration, complete later                     |
| Missing phone                  | Allow visit but disable SMS/WhatsApp                           |
| ID missing                     | Allow care, but flag for later completion if claims require it |
| SHA/private insurance selected | Require payer-specific membership fields                       |
| Consent not given              | Do not send non-essential messages                             |
| Duplicate patient confirmed    | Merge workflow, never delete clinical history silently         |

### Patient identifiers

The system should support multiple identifiers:

| Identifier                    | Example            |
| ----------------------------- | ------------------ |
| Internal patient number       | `PT-000123`        |
| National ID                   | Kenyan ID          |
| Passport                      | Foreign patient    |
| Birth certificate number      | Child              |
| SHA number                    | Claims             |
| Private insurer member number | Claims             |
| Corporate employee number     | Employer scheme    |
| Facility legacy number        | Migration          |
| National client registry ID   | Future integration |

---

## B. Appointment and queue

Small clinics need a queue more than a complex hospital scheduler. The system should support both walk-ins and booked visits.

### Appointment fields

| Field                 | Notes                                          |
| --------------------- | ---------------------------------------------- |
| Appointment number    | Auto                                           |
| Patient               | Link                                           |
| Appointment date/time |                                                |
| Visit reason          | Complaint/review/procedure/lab/immunisation    |
| Clinician/provider    | Optional                                       |
| Service type          | Consultation, review, ANC, chronic, etc.       |
| Payment/payer         | Cash, SHA, insurer, corporate                  |
| Status                | Booked, arrived, no-show, cancelled, completed |
| Reminder status       | SMS/WhatsApp if consent                        |
| Notes                 | Optional                                       |

### Queue stages

```text
Registered → Waiting payment/eligibility → Waiting triage → In triage → Waiting clinician → In consultation → Waiting lab/procedure → Waiting pharmacy → Waiting billing → Completed
```

### Queue fields

| Field                  |
| ---------------------- |
| Queue number           |
| Patient                |
| Visit type             |
| Priority               |
| Current station        |
| Assigned clinician     |
| Waiting time           |
| Payment status         |
| Triage status          |
| Lab status             |
| Pharmacy status        |
| Claim/insurance status |
| Alerts                 |

### Queue priority levels

| Priority           | Use                              |
| ------------------ | -------------------------------- |
| Routine            | Normal outpatient                |
| Review             | Follow-up                        |
| Child under 5      | Optional priority                |
| Elderly            | Optional priority                |
| Emergency          | Immediate attention              |
| Pregnant           | Priority depending clinic policy |
| Appointment        | Scheduled slot                   |
| Procedure/lab only | Direct to relevant station       |

### Queue rules

| Rule                               | System behaviour                                       |
| ---------------------------------- | ------------------------------------------------------ |
| Patient not registered             | Cannot enter queue except emergency quick registration |
| Clinician unavailable              | Reassign or hold                                       |
| Payment-before-consultation policy | Queue to cashier before consultation                   |
| Pay-after-consultation policy      | Allow clinician first                                  |
| Emergency                          | Bypass normal billing queue                            |
| Lab ordered                        | Patient moves to lab queue                             |
| Prescription created               | Patient moves to pharmacy queue                        |
| Visit completed                    | Lock visit except authorized addendum                  |

---

## C. Vitals

Vitals should be quick, structured, and trendable.

### Vitals fields

| Vital                 | Field notes                                  |
| --------------------- | -------------------------------------------- |
| Blood pressure        | Systolic/diastolic, position optional        |
| Pulse                 | Beats per minute                             |
| Temperature           | °C                                           |
| Weight                | kg                                           |
| Height                | cm                                           |
| BMI                   | Auto-calculated                              |
| SpO₂                  | Percentage                                   |
| Respiratory rate      | Recommended                                  |
| Random blood sugar    | Optional quick screen                        |
| Pain score            | Optional                                     |
| MUAC                  | Paediatric/nutrition clinics                 |
| Pregnancy status      | For women of reproductive age where relevant |
| Last menstrual period | Where relevant                               |
| Triage notes          | Short free text                              |

### Vitals rules

| Rule                         | System behaviour                                       |
| ---------------------------- | ------------------------------------------------------ |
| BP extreme                   | Alert clinician                                        |
| Fever                        | Flag high temperature                                  |
| Low SpO₂                     | Emergency warning                                      |
| Child visit                  | Show age-specific prompts                              |
| Pregnancy flag               | Show pregnancy-sensitive warnings                      |
| Chronic hypertension patient | Show BP trend                                          |
| Diabetes patient             | Show glucose trend                                     |
| Missing vitals               | Warn clinician; allow emergency/teleconsult exceptions |
| Weight missing for child     | Warn before paediatric prescription                    |

### Vitals display

Clinician should see:

```text
Today: BP 150/95, Pulse 88, Temp 37.2, Weight 82kg, SpO₂ 96%
Previous: BP 142/90, 138/88, 160/100
Trend: BP not controlled
```

---

## D. Clinical notes

The EMR should be structured but not painful. Use a simple SOAP-style layout.

```text
S - Subjective: complaint and history
O - Objective: examination and vitals
A - Assessment: diagnosis/impression
P - Plan: treatment, orders, advice, follow-up
```

### Clinical note fields

| Section                         | Fields                                            |
| ------------------------------- | ------------------------------------------------- |
| Chief complaint                 | Main reason for visit                             |
| History of presenting complaint | Free text/structured                              |
| Past medical history            | Conditions, surgeries, admissions                 |
| Drug history                    | Current medicines                                 |
| Allergy history                 | Allergies/reactions                               |
| Family/social history           | Optional                                          |
| Review of systems               | Optional checklist                                |
| Examination                     | General and system exam                           |
| Assessment                      | Clinical impression                               |
| Diagnosis                       | ICD-10-ready                                      |
| Plan                            | Treatment, investigations, prescription, referral |
| Follow-up                       | Review date/instructions                          |
| Counselling                     | Lifestyle, adherence, danger signs                |
| Clinician                       | Auto                                              |
| Signature/time                  | Auto                                              |
| Addendum                        | Late correction without overwriting original      |

### Note templates

Small clinics need templates for common visits:

| Template               | Use                                 |
| ---------------------- | ----------------------------------- |
| General outpatient     | Most visits                         |
| Paediatric visit       | Child complaints                    |
| ANC/PNC light template | Where facility offers maternal care |
| Chronic hypertension   | BP, meds, adherence                 |
| Diabetes               | Glucose, foot check, meds           |
| Asthma/COPD            | Symptoms, inhaler use               |
| Wound care/dressing    | Wound description and procedure     |
| UTI                    | Symptoms, urinalysis, treatment     |
| Malaria/fever          | Fever, RDT/lab, treatment           |
| Gastroenteritis        | Hydration, stool, danger signs      |
| Mental health screen   | Where appropriate                   |
| Immunisation visit     | Vaccine record                      |

### Clinical note rules

| Rule                           | System behaviour                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| Clinician licence inactive     | Cannot sign clinical note                                                                      |
| Unsigned note                  | Mark as draft, not claim-ready                                                                 |
| Addendum needed                | Create addendum; do not overwrite signed note                                                  |
| Diagnosis missing              | Warn before closing visit                                                                      |
| Prescription without diagnosis | Warn/require diagnosis depending policy                                                        |
| Referral without assessment    | Require reason and receiving facility                                                          |
| Claim visit                    | Diagnosis and signed note required                                                             |
| Sensitive note                 | Restrict access, especially mental health, HIV/TB, sexual/reproductive health where configured |

---

## E. Diagnosis

Diagnosis should be clinician-friendly first, claim/reporting-ready second.

### Diagnosis fields

| Field                   |                       Required? | Notes                            |
| ----------------------- | ------------------------------: | -------------------------------- |
| Diagnosis text          |                             Yes | Clinician-friendly               |
| ICD-10 code             | Recommended/required for claims |                                  |
| Diagnosis type          |                             Yes | Provisional, final, differential |
| Primary diagnosis       |                             Yes | One primary                      |
| Secondary diagnoses     |                        Optional | Multiple                         |
| Onset date              |                        Optional | Chronic care                     |
| Severity                |                        Optional | Mild/moderate/severe             |
| Status                  |                             Yes | Active, resolved, recurrent      |
| Linked visit            |                             Yes |                                  |
| Linked chronic registry |                      If chronic | Diabetes, hypertension, asthma   |
| Clinician               |                            Auto |                                  |
| Notes                   |                        Optional |                                  |

### Diagnosis rules

| Rule                            | System behaviour                                        |
| ------------------------------- | ------------------------------------------------------- |
| Multiple diagnoses              | Require one primary                                     |
| Claim visit                     | ICD-10 code required                                    |
| Chronic diagnosis               | Prompt chronic-care enrolment                           |
| HIV/TB diagnosis                | Use sensitive access controls and program/referral flag |
| Diagnosis changed after signing | Create correction/addendum                              |
| Diagnosis and service mismatch  | Warn claims officer                                     |
| Diagnosis not coded             | Allow clinical note but mark not claim-ready            |

### Common diagnosis favourites

The system should allow facility-specific shortcuts:

| Category       | Examples                                     |
| -------------- | -------------------------------------------- |
| Infectious     | Malaria, URTI, gastroenteritis, UTI          |
| Chronic        | Hypertension, diabetes, asthma               |
| Maternal/child | ANC visit, immunisation encounter, pneumonia |
| Injury         | Wound, sprain, burn                          |
| ENT/eye/skin   | Otitis media, conjunctivitis, dermatitis     |
| Mental health  | Anxiety, depression where appropriate        |
| Administrative | Medical exam, certificate visit              |

---

## F. Orders

Orders connect the clinician’s plan to lab, imaging, procedures, pharmacy, billing, and claims.

### Order types

| Order type    | Examples                                                  |
| ------------- | --------------------------------------------------------- |
| Lab           | Malaria RDT, CBC, urinalysis, pregnancy test, blood sugar |
| Imaging       | X-ray, ultrasound, external referral                      |
| Procedure     | Dressing, injection, nebulization, suturing               |
| Prescription  | Medicines to pharmacy                                     |
| Nursing order | Observation, wound care, injection                        |
| Referral      | Refer to hospital/specialist                              |
| Follow-up     | Review date                                               |
| Certificate   | Sick-off, school/work note where lawful                   |

### Order fields

| Field               | Notes                                                             |
| ------------------- | ----------------------------------------------------------------- |
| Order number        | Auto                                                              |
| Patient             | Link                                                              |
| Visit               | Link                                                              |
| Ordering clinician  | Auto                                                              |
| Order type          | Lab/imaging/procedure/prescription                                |
| Order item          | Test/procedure/medicine                                           |
| Clinical indication | Required for claims/high-risk orders                              |
| Priority            | Routine/urgent/stat                                               |
| Status              | Draft, ordered, billed, collected, resulted, completed, cancelled |
| Payment status      | From Module 2                                                     |
| Result status       | For lab/imaging                                                   |
| Assigned department | Lab, nursing, pharmacy                                            |
| Notes               | Optional                                                          |
| Created at          | Auto                                                              |

### Order rules

| Rule                         | System behaviour                                        |
| ---------------------------- | ------------------------------------------------------- |
| Clinician not licensed       | Cannot place signed clinical order                      |
| Order requires payment first | Route to billing before service                         |
| Order covered by insurer     | Route to claims/preauth where needed                    |
| Procedure needs consumables  | Trigger inventory consumption                           |
| Prescription item            | Route to pharmacy dispensing module                     |
| Lab order cancelled          | Update billing/credit note if already paid              |
| Result returned              | Notify clinician/patient where consent and policy allow |

---

## G. Results

Results should support numeric values, text, attachments, and result review.

### Result types

| Type            | Examples                                |
| --------------- | --------------------------------------- |
| Numeric         | Hb 12.5 g/dL, glucose 8.1 mmol/L        |
| Coded           | Positive/negative/reactive/non-reactive |
| Text            | Microscopy notes, imaging impression    |
| Attachment      | PDF, photo, scanned external result     |
| Panel           | CBC, urinalysis                         |
| External result | Referral lab report                     |

### Result fields

| Field              |                                       Required? |
| ------------------ | ----------------------------------------------: |
| Order ID           |                                             Yes |
| Patient            |                                            Auto |
| Visit              |                                            Auto |
| Test/procedure     |                                             Yes |
| Result value       |                                             Yes |
| Unit               |                                     For numeric |
| Reference range    |                                     Recommended |
| Abnormal flag      |                                     Auto/manual |
| Result notes       |                                        Optional |
| Attachment         |                                        Optional |
| Performed by       |                                       Lab/nurse |
| Verified by        |                If verification workflow enabled |
| Result date/time   |                                             Yes |
| Clinician reviewed |                                          Yes/no |
| Patient notified   |                                          Yes/no |
| Status             | Draft, resulted, verified, corrected, cancelled |

### Result rules

| Rule                         | System behaviour                                    |
| ---------------------------- | --------------------------------------------------- |
| Numeric result outside range | Flag abnormal                                       |
| Critical result              | Alert clinician                                     |
| Result correction            | Create corrected version; do not silently overwrite |
| External attachment          | Store source and upload user                        |
| Result not reviewed          | Show clinician pending task                         |
| Result sent to patient       | Log channel and user                                |
| Sensitive result             | Restrict visibility and notification content        |

---

## H. Referral

Referral must support both clinical continuity and claims.

### Referral types

| Type                 | Example                                          |
| -------------------- | ------------------------------------------------ |
| Outgoing referral    | Clinic refers to hospital/specialist             |
| Incoming referral    | Patient came from another facility               |
| Emergency referral   | Urgent transfer                                  |
| Lab/imaging referral | External diagnostic service                      |
| Program referral     | HIV/TB, mental health, specialist chronic care   |
| Reverse referral     | Higher facility sends patient back for follow-up |

### Referral fields

| Field                             |                                   Required? | Notes                    |
| --------------------------------- | ------------------------------------------: | ------------------------ |
| Referral number                   |                                         Yes | Auto                     |
| Patient                           |                                         Yes |                          |
| Visit                             |                                         Yes |                          |
| Referral type                     |                                         Yes | Out/in/emergency/program |
| Receiving facility                |                            Yes for outgoing |                          |
| Receiving clinician/department    |                                    Optional |                          |
| Reason for referral               |                                         Yes |                          |
| Diagnosis/impression              |                                         Yes |                          |
| Clinical summary                  |                                         Yes |                          |
| Treatment given                   |                                 Recommended |                          |
| Medicines prescribed/administered |                                 Recommended |                          |
| Results attached                  |                                    Optional |                          |
| Urgency                           |                                         Yes |                          |
| Transport/escort notes            |                                   Emergency |                          |
| Referring clinician               |                                         Yes |                          |
| Referral date/time                |                                         Yes |                          |
| Status                            | Draft, sent, accepted, completed, cancelled |                          |
| Feedback received                 |                                    Optional |                          |

### Referral letter contents

```text
Facility details
Patient details
Date/time
Reason for referral
Clinical history
Examination findings
Vitals
Diagnosis/impression
Investigations and results
Treatment given
Medicines prescribed/administered
Allergies
Urgency
Receiving facility/department
Referring clinician name, licence number, signature
```

### Referral rules

| Rule                       | System behaviour                                      |
| -------------------------- | ----------------------------------------------------- |
| Referral without reason    | Block                                                 |
| Emergency referral         | Require vitals and stabilization notes where possible |
| Claims referral required   | Route referral data to claims module                  |
| Program referral           | Mark sensitive where appropriate                      |
| Receiving facility unknown | Allow “external facility” but require name/contact    |
| Referral completed         | Record feedback/outcome if available                  |

---

## I. Certificates

Certificates should be controlled because they create legal and employment/school consequences.

### Certificate types

| Certificate                           | Notes                                                                      |
| ------------------------------------- | -------------------------------------------------------------------------- |
| Sick-off note                         | Time off work/school                                                       |
| Fit-to-return note                    | Return to work/school                                                      |
| School medical note                   | Child/school requirement                                                   |
| Procedure note                        | Wound care/injection/procedure proof                                       |
| Medical examination summary           | Where lawful and within facility scope                                     |
| Immunisation certificate/card extract | Where relevant                                                             |
| Death/birth-related certificates      | Avoid unless facility is licensed and legally authorized for that workflow |

### Certificate fields

| Field                    |                                Required? |
| ------------------------ | ---------------------------------------: |
| Certificate number       |                                      Yes |
| Patient                  |                                      Yes |
| Visit                    |                                      Yes |
| Certificate type         |                                      Yes |
| Diagnosis/reason         | Required or restricted based on template |
| Start date               |                              If sick-off |
| End date                 |                              If sick-off |
| Restrictions/advice      |                                 Optional |
| Issuing clinician        |                                      Yes |
| Clinician licence number |                                      Yes |
| Facility details         |                                      Yes |
| Issue date/time          |                                      Yes |
| QR/barcode verification  |                              Recommended |
| Status                   |                 Draft, issued, cancelled |
| Reprint count            |                                     Auto |
| Notes                    |                        Optional/internal |

### Certificate rules

| Rule                              | System behaviour                                       |
| --------------------------------- | ------------------------------------------------------ |
| Clinician licence inactive        | Cannot issue certificate                               |
| Certificate without visit         | Block except special authorized workflow               |
| Backdated certificate             | Requires senior approval/reason                        |
| Sick-off duration above threshold | Requires senior approval                               |
| Reprint                           | Require reason and log                                 |
| Cancel certificate                | Keep original record and cancellation reason           |
| Sensitive diagnosis               | Option to hide diagnosis on patient-facing certificate |

---

## J. Chronic care

Small clinics should support chronic-care tracking without becoming too complex.

### Chronic-care conditions

| Condition         | EMR support                                                          |
| ----------------- | -------------------------------------------------------------------- |
| Hypertension      | BP trend, medication history, follow-up, complications               |
| Diabetes          | Glucose/HbA1c where available, foot check, medication, refills       |
| Asthma/COPD       | Symptom control, inhaler use, exacerbations                          |
| Epilepsy          | Seizure frequency, medication adherence                              |
| HIV/TB            | Referral/program flag, privacy controls, do not expose unnecessarily |
| Mental health     | Sensitive notes, follow-up, medication monitoring                    |
| Pregnancy/ANC     | Basic tracking if facility offers maternal services                  |
| CKD/heart disease | Referral and monitoring fields                                       |

### Chronic registry fields

| Field                |
| -------------------- |
| Patient              |
| Condition            |
| Date diagnosed       |
| Diagnosis code       |
| Risk level           |
| Current medication   |
| Last visit date      |
| Next review date     |
| Last key measurement |
| Control status       |
| Complications        |
| Referrals            |
| Care plan            |
| Program flag         |
| Status               |

### Chronic-care visit fields

| Field              | Example                   |
| ------------------ | ------------------------- |
| Condition reviewed | Hypertension              |
| Symptoms           | Headache, dizziness, none |
| Adherence          | Good/poor/missed doses    |
| Side effects       | Yes/no                    |
| Vitals/trends      | BP, weight, glucose       |
| Medication changes | Continue/change/add       |
| Lifestyle advice   | Diet, exercise, smoking   |
| Follow-up date     | 1 month                   |
| Referral needed    | Yes/no                    |

### Chronic-care rules

| Rule                    | System behaviour                                          |
| ----------------------- | --------------------------------------------------------- |
| Chronic diagnosis added | Ask whether to enrol in chronic registry                  |
| Follow-up overdue       | Create recall task                                        |
| BP uncontrolled         | Alert clinician                                           |
| Diabetes visit          | Prompt glucose/foot review where configured               |
| Asthma frequent visits  | Flag poor control                                         |
| HIV/TB flag             | Restrict access and route to appropriate program/referral |
| Missed follow-up        | Send reminder only with consent                           |

---

## K. Immunisation

The immunisation feature should be optional and enabled only where the clinic actually provides vaccines.

Kenya’s Ministry of Health hosts national health portals including KHIS and other digital health systems, and its public communications emphasize routine childhood vaccination and keeping children up to date with scheduled doses. ([Ministry of Health][6]) ([Ministry of Health][8])

### Immunisation fields

| Field                    |                                Required? |
| ------------------------ | ---------------------------------------: |
| Patient                  |                                      Yes |
| Vaccine                  |                                      Yes |
| Dose number              |                                      Yes |
| Date administered        |                                      Yes |
| Age at administration    |                                     Auto |
| Batch/lot number         |    Recommended/required for traceability |
| Expiry date              |                     Recommended/required |
| Route/site               |                              Recommended |
| Administered by          |                                      Yes |
| Facility/branch          |                                      Yes |
| Next dose date           |                              Auto/manual |
| Contraindication checked |                              Recommended |
| Adverse event noted      |                                 Optional |
| Stock link               |                              Recommended |
| Card/registry reference  |                                 Optional |
| Status                   | Given, deferred, missed, contraindicated |

### Immunisation rules

| Rule                        | System behaviour                                 |
| --------------------------- | ------------------------------------------------ |
| Vaccine service not enabled | Hide immunisation workflow                       |
| Vaccine stock unavailable   | Warn/block administration                        |
| Vaccine expired             | Block                                            |
| Cold-chain issue            | Block/quarantine through inventory               |
| Next dose due               | Create reminder if consent                       |
| Missed dose                 | Flag catch-up                                    |
| AEFI/adverse event          | Create safety report workflow                    |
| Duplicate same dose         | Warn                                             |
| Child patient               | Show age-based schedule prompts where configured |

### Vaccine record output

The system should print or share:

```text
Patient name
Date of birth/age
Vaccine
Dose
Date administered
Batch/lot
Facility
Administering clinician/nurse
Next dose date
```

---

## L. Visit summary

The visit summary is the patient-facing and referral/claims-friendly output of the encounter.

### Visit summary contents

| Section             | Content                                    |
| ------------------- | ------------------------------------------ |
| Facility            | Name, branch, licence details where needed |
| Patient             | Name, age, sex, patient number             |
| Visit               | Date, clinician, visit type                |
| Complaint           | Main complaint                             |
| Vitals              | BP, pulse, temp, weight, height, SpO₂      |
| Diagnosis           | Primary and secondary diagnoses            |
| Investigations      | Ordered and resulted tests                 |
| Treatment           | Procedures, medicines, advice              |
| Prescription        | Medicines prescribed                       |
| Dispensed medicines | If pharmacy integrated                     |
| Referral            | Receiving facility and reason              |
| Follow-up           | Review date and instructions               |
| Warnings            | Danger signs, return instructions          |
| Clinician           | Name, cadre, licence number                |
| QR/barcode          | Optional verification                      |

### Visit summary formats

| Format               | Use                                      |
| -------------------- | ---------------------------------------- |
| Thermal summary      | Quick outpatient receipt-like note       |
| A4 PDF               | Formal referral/insurance/medical record |
| SMS/WhatsApp link    | Patient access, consent required         |
| Email PDF            | Corporate/insurance/patient copy         |
| FHIR document bundle | Future interoperability                  |
| Claim packet         | Billing/claims officer                   |

### Visit summary rules

| Rule                 | System behaviour                                        |
| -------------------- | ------------------------------------------------------- |
| Unsigned visit       | Watermark as draft                                      |
| Sensitive diagnosis  | Hide or restrict patient-facing output based on policy  |
| Claim-ready summary  | Requires diagnosis, clinician, services, orders/results |
| Referral summary     | Requires reason and receiving facility                  |
| Reprint              | Log user, time, reason                                  |
| Share electronically | Requires consent and secure access method               |

---

# 7. Required screens

## Screen 1: Patient registration

Sections:

| Section    | Contents                                          |
| ---------- | ------------------------------------------------- |
| Identity   | Name, DOB/age, sex, ID/passport/birth certificate |
| Contact    | Phone, address, next of kin                       |
| Payer      | Cash, SHA, insurer, corporate                     |
| Safety     | Allergies, chronic conditions, current meds       |
| Consent    | SMS, WhatsApp, sharing, reminders                 |
| Duplicates | Possible existing patients                        |
| Documents  | ID card, referral letter, prior reports           |

---

## Screen 2: Appointment and queue dashboard

Columns:

| Column              |
| ------------------- |
| Queue number        |
| Patient             |
| Age/sex             |
| Visit reason        |
| Payer               |
| Stage               |
| Waiting time        |
| Assigned clinician  |
| Priority            |
| Payment status      |
| Lab/pharmacy status |
| Alerts              |

Actions:

```text
Register
Book appointment
Check in
Send to triage
Send to consultation
Send to lab
Send to pharmacy
Send to billing
Complete visit
```

---

## Screen 3: Triage screen

Sections:

| Section            | Contents                                   |
| ------------------ | ------------------------------------------ |
| Visit reason       | Complaint/review                           |
| Vitals             | BP, pulse, temp, weight, height, BMI, SpO₂ |
| Risk flags         | Emergency, pregnancy, child, elderly       |
| Allergies          | Add/update                                 |
| Chronic conditions | Add/update                                 |
| Notes              | Short triage note                          |
| Routing            | Send to clinician/emergency/procedure      |

---

## Screen 4: Clinician consultation screen

Layout:

```text
LEFT: patient summary, previous visits, allergies, chronic conditions, current meds
CENTER: clinical note template
RIGHT: orders, diagnosis, prescription, results, follow-up
BOTTOM: sign note, print summary, send to billing/pharmacy/lab
```

Important tabs:

| Tab                | Use                  |
| ------------------ | -------------------- |
| Today’s visit      | Current note         |
| History            | Previous visits      |
| Vitals trend       | BP/weight/glucose    |
| Medication history | Prescribed/dispensed |
| Results            | Lab/imaging          |
| Documents          | Attachments          |
| Chronic care       | Condition dashboard  |
| Claims             | Claim readiness      |

---

## Screen 5: Diagnosis screen

Features:

| Feature                       |
| ----------------------------- |
| Search diagnosis text         |
| ICD-10 code lookup            |
| Common diagnosis favourites   |
| Primary/secondary diagnosis   |
| Provisional/final status      |
| Chronic-care enrolment prompt |
| Claims readiness warning      |

---

## Screen 6: Orders screen

Order panels:

| Panel          | Use                               |
| -------------- | --------------------------------- |
| Lab orders     | Test selection                    |
| Imaging orders | Internal/external                 |
| Procedures     | Dressing, injection, nebulization |
| Prescriptions  | Medicine orders                   |
| Referrals      | Outgoing referral                 |
| Certificates   | Sick-off/school/work note         |

---

## Screen 7: Results review

Features:

| Feature                         |
| ------------------------------- |
| Pending results                 |
| Abnormal/critical flags         |
| Numeric/text/attachment results |
| Previous result comparison      |
| Clinician review checkbox       |
| Patient notification log        |
| Result correction trail         |

---

## Screen 8: Referral screen

Features:

| Feature                     |
| --------------------------- |
| Receiving facility          |
| Referral reason             |
| Clinical summary            |
| Attached results            |
| Treatment already given     |
| Urgency                     |
| Print/share referral letter |
| Referral status tracking    |

---

## Screen 9: Chronic-care dashboard

Cards:

```text
Patients due for review
Missed follow-ups
Uncontrolled BP
Uncontrolled glucose
Asthma frequent exacerbations
Medication refill overdue
Program referrals
```

Patient view:

```text
Condition
Last visit
Last measurement
Current medicines
Next review
Control status
Complications
```

---

## Screen 10: Immunisation screen

Features:

| Feature                 |
| ----------------------- |
| Vaccine schedule view   |
| Vaccine administered    |
| Batch/expiry            |
| Next dose date          |
| Missed dose/catch-up    |
| Print vaccine record    |
| AEFI/adverse event note |
| Stock link              |

---

## Screen 11: Visit summary screen

Features:

| Feature                  |
| ------------------------ |
| Summary preview          |
| Include/exclude sections |
| Patient copy             |
| Referral copy            |
| Claim copy               |
| Print PDF                |
| Send link                |
| FHIR/export package      |
| Reprint log              |

---

# 8. Workflows

## A. New outpatient visit

```text
1. Reception registers patient
2. Patient is added to queue
3. Payment/eligibility is checked based on clinic policy
4. Triage captures vitals and safety flags
5. Clinician opens consultation
6. Clinician records complaint, history, exam, diagnosis, plan
7. Clinician orders labs/procedure/prescription/referral if needed
8. Billing module bills services and items
9. Lab/pharmacy/procedure workflows run
10. Clinician reviews results if needed
11. Visit summary is printed/shared
12. Visit is closed
```

---

## B. Returning patient visit

```text
1. Reception searches patient
2. System shows previous visits, chronic flags, allergies
3. Patient is checked into queue
4. Triage captures current vitals
5. Clinician reviews previous record
6. Clinician documents follow-up
7. Medication/refill/orders are updated
8. Visit summary and next review date are created
```

---

## C. Consultation with lab order

```text
1. Clinician creates lab order
2. Billing confirms payment or insurer authorization
3. Lab receives order
4. Sample is collected
5. Result is entered and verified
6. Clinician receives result alert
7. Clinician updates plan
8. Prescription/referral/follow-up is completed
```

---

## D. Consultation with prescription

```text
1. Clinician selects medicines and dosage instructions
2. EMR sends prescription to pharmacy queue
3. Pharmacist reviews through Module 3
4. POS bills through Module 2
5. Dispensed medicines return to EMR medication history
6. Visit summary shows prescribed and dispensed medicines
```

---

## E. Procedure visit

```text
1. Clinician/nurse orders procedure
2. Billing confirms payment/cover
3. Procedure is performed
4. Procedure note is captured
5. Consumables are deducted from inventory if configured
6. Visit summary includes procedure details
```

---

## F. Referral workflow

```text
1. Clinician decides patient needs higher/specialist care
2. Referral reason and receiving facility are captured
3. Key clinical notes, vitals, diagnosis, results, and treatment are pulled into letter
4. Referral letter is printed/shared
5. Patient is marked referred
6. Feedback/outcome can be recorded later
```

---

## G. Chronic-care follow-up

```text
1. Patient is flagged as chronic-care patient
2. Follow-up visit opens chronic template
3. System shows trends and medication history
4. Clinician records control status and adherence
5. Medicines/labs/referrals are updated
6. Next review date is set
7. Reminder task is created if consent exists
```

---

## H. Immunisation workflow

```text
1. Child/patient is registered
2. Immunisation screen shows due vaccine if configured
3. Nurse confirms vaccine, dose, batch, expiry
4. System checks stock and expiry
5. Vaccine is administered
6. Stock is decremented
7. Next dose date is calculated
8. Vaccine record is printed/shared
```

---

## I. Claim-ready visit workflow

```text
1. Patient/payer is selected
2. Eligibility/preauth is captured where required
3. Clinician documents visit
4. ICD-10-ready diagnosis is selected
5. Services, lab, procedure, and prescription are linked to visit
6. Results/attachments are added
7. Visit is signed
8. Claims module creates claim packet
9. Claim validation checks missing documentation
```

---

# 9. Rules engine

## Clinical consultation allowed

```text
RULE: Consultation signing
IF facility_licence.status = active
AND clinician.practising_licence.status = active
AND clinician.assigned_branch = current_branch
THEN allow clinician to sign note
ELSE block signing
```

## Queue movement

```text
RULE: Send to consultation
IF patient_registered = true
AND visit_open = true
AND queue_status in [registered, triaged, waiting_clinician]
THEN allow consultation
ELSE show blocker
```

## Vitals safety

```text
RULE: Critical vital alert
IF spo2 < configured_threshold
OR temperature > configured_high_fever
OR systolic_bp > configured_hypertensive_crisis
THEN mark visit high_priority
AND alert clinician
```

## Diagnosis requirement

```text
RULE: Close visit
IF visit.requires_claim = true
THEN primary_diagnosis and signed_note are required
ELSE allow closure with warning if diagnosis missing
```

## ICD-10 requirement

```text
RULE: Claim-ready diagnosis
IF payer_type in [SHA, private_insurer, corporate_claim]
THEN diagnosis.icd10_code is required
ELSE diagnosis text may be sufficient
```

## Lab order

```text
RULE: Lab order completion
IF lab_order.status = resulted
AND result.verified = true
THEN notify ordering clinician
AND mark result pending_review
```

## Prescription

```text
RULE: Send prescription to pharmacy
IF clinician_note.signed = true
OR facility_policy.allows_draft_prescriptions = true
THEN create pharmacy_queue_item
ELSE block prescription release
```

## Certificate

```text
RULE: Sick-off certificate
IF clinician.practising_licence.status = active
AND visit.exists = true
AND certificate.reason is provided
THEN allow issue
ELSE block
```

## Referral

```text
RULE: Referral letter
IF referral.reason exists
AND diagnosis_or_assessment exists
AND receiving_facility exists
AND clinician_signature exists
THEN allow referral generation
ELSE show missing fields
```

## Immunisation

```text
RULE: Administer vaccine
IF vaccine_stock.status = available
AND batch.expiry_date > today
AND cold_chain_status = valid
AND administering_user.authorized = true
THEN allow vaccine record
ELSE block
```

---

# 10. Data model

## Main tables

### `patients`

| Field                    |
| ------------------------ |
| id                       |
| patient_number           |
| full_name                |
| date_of_birth            |
| estimated_age            |
| sex                      |
| phone                    |
| alternative_phone        |
| national_id              |
| passport_number          |
| birth_certificate_number |
| county                   |
| sub_county               |
| ward                     |
| address                  |
| next_of_kin_name         |
| next_of_kin_phone        |
| guardian_name            |
| guardian_relationship    |
| sha_number               |
| status                   |
| created_at               |
| updated_at               |

### `patient_consents`

| Field         |
| ------------- |
| id            |
| patient_id    |
| consent_type  |
| consent_given |
| channel       |
| captured_by   |
| captured_at   |
| withdrawn_at  |
| notes         |

### `patient_allergies`

| Field         |
| ------------- |
| id            |
| patient_id    |
| allergen      |
| allergen_type |
| reaction      |
| severity      |
| recorded_by   |
| recorded_at   |
| status        |

### `appointments`

| Field                |
| -------------------- |
| id                   |
| appointment_number   |
| patient_id           |
| branch_id            |
| clinician_id         |
| service_type         |
| appointment_datetime |
| reason               |
| payer_type           |
| status               |
| reminder_status      |
| notes                |
| created_by           |
| created_at           |

### `visits`

| Field              |
| ------------------ |
| id                 |
| visit_number       |
| patient_id         |
| branch_id          |
| visit_type         |
| visit_date         |
| payer_type         |
| payer_contract_id  |
| priority           |
| status             |
| checked_in_by      |
| checked_in_at      |
| closed_by          |
| closed_at          |
| claim_ready_status |

### `queue_events`

| Field       |
| ----------- |
| id          |
| visit_id    |
| from_stage  |
| to_stage    |
| assigned_to |
| moved_by    |
| moved_at    |
| notes       |

### `vitals`

| Field                    |
| ------------------------ |
| id                       |
| visit_id                 |
| patient_id               |
| blood_pressure_systolic  |
| blood_pressure_diastolic |
| pulse                    |
| temperature              |
| weight                   |
| height                   |
| bmi                      |
| spo2                     |
| respiratory_rate         |
| pain_score               |
| pregnancy_status         |
| lmp                      |
| recorded_by              |
| recorded_at              |
| alert_status             |

### `clinical_notes`

| Field                        |
| ---------------------------- |
| id                           |
| visit_id                     |
| patient_id                   |
| clinician_id                 |
| chief_complaint              |
| history_presenting_complaint |
| past_medical_history         |
| drug_history                 |
| allergy_history              |
| examination                  |
| assessment                   |
| plan                         |
| counselling_notes            |
| follow_up_date               |
| note_status                  |
| signed_by                    |
| signed_at                    |
| addendum_to_note_id          |
| created_at                   |
| updated_at                   |

### `diagnoses`

| Field          |
| -------------- |
| id             |
| visit_id       |
| patient_id     |
| diagnosis_text |
| icd10_code     |
| diagnosis_type |
| primary_flag   |
| status         |
| onset_date     |
| severity       |
| clinician_id   |
| created_at     |

### `orders`

| Field                 |
| --------------------- |
| id                    |
| order_number          |
| visit_id              |
| patient_id            |
| ordering_clinician_id |
| order_type            |
| order_item_id         |
| clinical_indication   |
| priority              |
| payment_status        |
| status                |
| created_at            |
| cancelled_at          |
| cancellation_reason   |

### `results`

| Field                  |
| ---------------------- |
| id                     |
| order_id               |
| visit_id               |
| patient_id             |
| result_type            |
| result_value           |
| unit                   |
| reference_range        |
| abnormal_flag          |
| critical_flag          |
| result_text            |
| attachment_document_id |
| performed_by           |
| verified_by            |
| verified_at            |
| reviewed_by_clinician  |
| reviewed_at            |
| status                 |
| created_at             |

### `prescriptions`

| Field               |
| ------------------- |
| id                  |
| visit_id            |
| patient_id          |
| clinician_id        |
| prescription_number |
| diagnosis_id        |
| status              |
| sent_to_pharmacy_at |
| created_at          |

### `prescription_items`

| Field                |
| -------------------- |
| id                   |
| prescription_id      |
| medicine_id          |
| generic_name         |
| strength             |
| dosage_form          |
| dose                 |
| frequency            |
| duration             |
| route                |
| quantity             |
| instructions         |
| substitution_allowed |
| status               |

### `procedures`

| Field                 |
| --------------------- |
| id                    |
| visit_id              |
| patient_id            |
| procedure_code        |
| procedure_name        |
| indication            |
| performed_by          |
| performed_at          |
| notes                 |
| consumables_used_json |
| status                |

### `referrals`

| Field                   |
| ----------------------- |
| id                      |
| referral_number         |
| visit_id                |
| patient_id              |
| referral_type           |
| receiving_facility      |
| receiving_department    |
| receiving_clinician     |
| reason                  |
| urgency                 |
| diagnosis_summary       |
| clinical_summary        |
| treatment_given         |
| documents_attached_json |
| referred_by             |
| referred_at             |
| status                  |
| feedback_received       |
| feedback_notes          |

### `certificates`

| Field               |
| ------------------- |
| id                  |
| certificate_number  |
| visit_id            |
| patient_id          |
| certificate_type    |
| reason              |
| start_date          |
| end_date            |
| restrictions        |
| issued_by           |
| issued_at           |
| qr_code             |
| status              |
| cancelled_by        |
| cancelled_at        |
| cancellation_reason |

### `chronic_care_registry`

| Field                    |
| ------------------------ |
| id                       |
| patient_id               |
| condition                |
| diagnosis_id             |
| date_diagnosed           |
| risk_level               |
| current_medications_json |
| last_visit_date          |
| next_review_date         |
| control_status           |
| complications_json       |
| program_flag             |
| status                   |

### `immunisations`

| Field              |
| ------------------ |
| id                 |
| patient_id         |
| visit_id           |
| vaccine_id         |
| dose_number        |
| date_administered  |
| batch_id           |
| batch_number       |
| expiry_date        |
| route              |
| site               |
| administered_by    |
| next_dose_date     |
| adverse_event_flag |
| status             |

### `visit_summaries`

| Field               |
| ------------------- |
| id                  |
| visit_id            |
| patient_id          |
| summary_type        |
| summary_json        |
| document_id         |
| generated_by        |
| generated_at        |
| shared_with_patient |
| sharing_channel     |
| status              |

### `clinical_attachments`

| Field            |
| ---------------- |
| id               |
| patient_id       |
| visit_id         |
| document_type    |
| file_url         |
| file_hash        |
| uploaded_by      |
| uploaded_at      |
| visibility_level |
| notes            |

### `emr_audit_logs`

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

# 11. API design

## Patient and registration endpoints

| Endpoint                          | Purpose                  |
| --------------------------------- | ------------------------ |
| `POST /patients`                  | Register patient         |
| `GET /patients/search`            | Search patients          |
| `GET /patients/{id}`              | View patient             |
| `PATCH /patients/{id}`            | Update patient           |
| `POST /patients/{id}/consents`    | Capture consent          |
| `POST /patients/{id}/merge`       | Merge duplicate patients |
| `POST /patients/{id}/attachments` | Upload document          |

## Appointment and queue endpoints

| Endpoint                           | Purpose                       |
| ---------------------------------- | ----------------------------- |
| `POST /appointments`               | Book appointment              |
| `POST /appointments/{id}/check-in` | Check in patient              |
| `POST /visits`                     | Start visit                   |
| `GET /queue`                       | View queue                    |
| `POST /queue/{visitId}/move`       | Move patient to another stage |
| `POST /visits/{id}/close`          | Close visit                   |

## Vitals endpoints

| Endpoint                          | Purpose                    |
| --------------------------------- | -------------------------- |
| `POST /visits/{id}/vitals`        | Record vitals              |
| `GET /patients/{id}/vitals-trend` | View trends                |
| `POST /vitals/{id}/review-alert`  | Acknowledge critical vital |

## Clinical note endpoints

| Endpoint                              | Purpose                 |
| ------------------------------------- | ----------------------- |
| `POST /visits/{id}/clinical-notes`    | Create note             |
| `PATCH /clinical-notes/{id}`          | Edit draft note         |
| `POST /clinical-notes/{id}/sign`      | Sign note               |
| `POST /clinical-notes/{id}/addendum`  | Add correction/addendum |
| `GET /patients/{id}/clinical-history` | Patient history         |

## Diagnosis endpoints

| Endpoint                       | Purpose                 |
| ------------------------------ | ----------------------- |
| `POST /visits/{id}/diagnoses`  | Add diagnosis           |
| `GET /diagnoses/search`        | Search diagnosis/ICD-10 |
| `PATCH /diagnoses/{id}`        | Update diagnosis        |
| `POST /diagnoses/{id}/resolve` | Mark resolved           |

## Orders and results endpoints

| Endpoint                     | Purpose                                         |
| ---------------------------- | ----------------------------------------------- |
| `POST /orders`               | Create lab/imaging/procedure/prescription order |
| `POST /orders/{id}/cancel`   | Cancel order                                    |
| `GET /orders/pending`        | Pending orders                                  |
| `POST /results`              | Add result                                      |
| `POST /results/{id}/verify`  | Verify result                                   |
| `POST /results/{id}/review`  | Clinician review                                |
| `POST /results/{id}/correct` | Correct result                                  |

## Referral and certificate endpoints

| Endpoint                         | Purpose            |
| -------------------------------- | ------------------ |
| `POST /referrals`                | Create referral    |
| `POST /referrals/{id}/send`      | Mark sent/share    |
| `POST /referrals/{id}/feedback`  | Record feedback    |
| `POST /certificates`             | Create certificate |
| `POST /certificates/{id}/issue`  | Issue certificate  |
| `POST /certificates/{id}/cancel` | Cancel certificate |
| `POST /certificates/{id}/print`  | Print/reprint      |

## Chronic care and immunisation endpoints

| Endpoint                           | Purpose                 |
| ---------------------------------- | ----------------------- |
| `POST /chronic-care/enrol`         | Enrol patient           |
| `GET /chronic-care/due`            | Patients due for review |
| `POST /chronic-care/{id}/review`   | Record chronic review   |
| `POST /immunisations`              | Record vaccine          |
| `GET /patients/{id}/immunisations` | Vaccine history         |
| `GET /immunisations/due`           | Due/missed vaccines     |

## Visit summary endpoints

| Endpoint                          | Purpose                     |
| --------------------------------- | --------------------------- |
| `POST /visits/{id}/summary`       | Generate summary            |
| `GET /visits/{id}/summary`        | View summary                |
| `POST /visits/{id}/summary/print` | Print                       |
| `POST /visits/{id}/summary/share` | Share securely              |
| `POST /visits/{id}/claim-pack`    | Generate claim-ready packet |

---

# 12. Integration points

| Integration            | Purpose                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Organisation/licensing | Facility and clinician permission checks                                                                           |
| POS/billing            | Consultation, lab, procedure, prescription billing                                                                 |
| Pharmacy dispensing    | Send prescriptions and receive dispense status                                                                     |
| Inventory              | Procedure consumables, vaccines, lab consumables                                                                   |
| Lab-lite module        | Orders and results                                                                                                 |
| Claims module          | Diagnosis, services, results, attachments, visit summary                                                           |
| SHA/private insurer    | Eligibility, preauth, claim evidence                                                                               |
| KHIS/DHIS2 reporting   | Aggregate facility reports                                                                                         |
| SMS/WhatsApp           | Appointment, refill, results, follow-up reminders with consent                                                     |
| FHIR API               | Patient, Encounter, Observation, Condition, ServiceRequest, DiagnosticReport, MedicationRequest, DocumentReference |
| Document storage       | Attachments, certificates, referral letters                                                                        |
| Audit/security         | Access logs and data protection                                                                                    |

---

# 13. Permissions

| Permission               |  Reception | Triage/Nurse |    Clinician |     Lab | Pharmacy |    Billing |      Manager | Auditor |
| ------------------------ | ---------: | -----------: | -----------: | ------: | -------: | ---------: | -----------: | ------: |
| Register patient         |        Yes |          Yes |          Yes |      No |  Limited |        Yes |          Yes |    View |
| Edit demographics        |        Yes |      Limited |      Limited |      No |       No |    Limited |          Yes |    View |
| View full clinical notes | No/limited |      Limited |          Yes | Limited |  Limited | No/limited | Configurable |     Yes |
| Record vitals            | No/limited |          Yes |          Yes |      No |       No |         No |          Yes |    View |
| Write clinical note      |         No |      Limited |          Yes |      No |       No |         No |           No |    View |
| Sign clinical note       |         No | Configurable |          Yes |      No |       No |         No |           No |    View |
| Add diagnosis            |         No |   No/limited |          Yes |      No |       No |         No |           No |    View |
| Create lab order         |         No |      Limited |          Yes |      No |       No |         No |           No |    View |
| Enter lab result         |         No |           No |           No |     Yes |       No |         No |           No |    View |
| Verify/review result     |         No |           No | Yes/Lab lead |     Yes |       No |         No |           No |    View |
| Create prescription      |         No |   No/limited |          Yes |      No |       No |         No |           No |    View |
| Dispense prescription    |         No |           No |           No |      No |      Yes |         No |           No |    View |
| Issue certificate        |         No |           No |          Yes |      No |       No |         No |           No |    View |
| Create referral          |         No |      Limited |          Yes |      No |       No |         No |           No |    View |
| View billing             |        Yes |      Limited |      Limited |      No |  Limited |        Yes |          Yes |    View |
| Export reports           |         No |           No |      Limited | Limited |       No |        Yes |          Yes |     Yes |
| View audit logs          |         No |           No |           No |      No |       No |         No |          Yes |     Yes |

---

# 14. Reports

## Clinical operations reports

| Report                  | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| Daily visit report      | Visits by date, branch, clinician             |
| OPD attendance          | Outpatient volume                             |
| Queue waiting time      | Service efficiency                            |
| Clinician workload      | Consultations per clinician                   |
| Triage report           | Vitals and triage activity                    |
| Diagnosis report        | Common conditions                             |
| ICD-10 diagnosis report | Claims/public health readiness                |
| Lab order/result report | Pending and completed investigations          |
| Prescription report     | Medicines ordered from EMR                    |
| Referral report         | Outgoing/incoming referrals                   |
| Certificate report      | Sick-off/school/work notes issued             |
| Visit summary report    | Summaries generated/shared                    |
| Unsigned notes report   | Clinical documentation gaps                   |
| Incomplete visit report | Visits not closed properly                    |
| Critical result report  | Safety monitoring                             |
| Chronic-care due report | Follow-up management                          |
| Immunisation report     | Vaccines given/missed/due                     |
| Claims readiness report | Missing diagnosis, notes, results, signatures |
| Audit/access report     | Privacy and compliance                        |

## Owner/manager dashboard

```text
Patients seen today
Patients waiting
Average waiting time
Clinicians active
Visits by service
Revenue-linked visits
Claims-ready visits
Unsigned notes
Pending lab results
Pending prescriptions
Referrals today
Chronic patients due
Immunisations today
Certificates issued
```

---

# 15. Privacy and security controls

Because EMR data is sensitive health data, the module must have stronger controls than a normal POS.

| Control                | Requirement                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| Role-based access      | Different screens for reception, nurse, clinician, lab, billing            |
| Patient-level audit    | Every view/edit/export logged                                              |
| Sensitive-note marking | HIV/TB, mental health, reproductive health, minors, violence-related notes |
| Consent capture        | SMS, WhatsApp, sharing, reminders, referral exchange                       |
| Session timeout        | Especially shared clinic computers                                         |
| Device control         | Revoke lost/stolen tablets                                                 |
| Encryption             | At rest and in transit                                                     |
| Backup and restore     | Tested recovery                                                            |
| Addendum model         | Signed notes cannot be silently edited                                     |
| Break-glass access     | Emergency access with reason and audit                                     |
| Data export control    | Visit summaries, claim packs, referral letters                             |
| Minor/guardian rules   | Control who receives messages and summaries                                |
| Data retention         | Configurable policy                                                        |
| Breach log             | Incident recording and response workflow                                   |

---

# 16. Edge cases

| Edge case                                | Correct handling                                                     |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Patient arrives unconscious/emergency    | Quick registration, complete demographics later                      |
| Patient has no ID                        | Allow care, flag ID as missing                                       |
| Duplicate patient record                 | Merge workflow with audit                                            |
| Wrong patient selected                   | Correction workflow; do not delete silently                          |
| Clinician forgets to sign note           | Visit remains not claim-ready                                        |
| Lab result entered for wrong patient     | Correction version and incident log                                  |
| Patient leaves before completion         | Visit marked incomplete/left before treatment                        |
| Prescription created before payment      | Facility policy decides: hold, bill first, or dispense after payment |
| Insurer/SHA rejects claim                | Claim module routes missing documentation back to EMR                |
| Referral facility unknown                | Allow free text but flag for cleanup                                 |
| Sick-off backdated                       | Senior approval and reason                                           |
| Sensitive diagnosis printed accidentally | Use summary templates and privacy filters                            |
| Minor patient notification               | Send to guardian only where appropriate                              |
| Internet outage                          | Continue local queue/notes if offline mode is enabled, sync later    |
| Clinician licence expired mid-day        | Block new signatures after status update                             |
| Patient requests record copy             | Generate controlled patient summary/export                           |
| Death or severe adverse event            | Incident/referral/clinical governance workflow                       |

---

# 17. MVP versus later versions

## MVP

Build these first:

| Feature                  | Reason                         |
| ------------------------ | ------------------------------ |
| Patient registration     | Foundation                     |
| Appointment/queue        | Clinic flow                    |
| Triage/vitals            | Clinical safety                |
| Clinical notes           | Core EMR                       |
| Diagnosis, ICD-10-ready  | Claims and reporting           |
| Orders                   | Lab, procedure, prescription   |
| Prescription to pharmacy | Clinic-pharmacy integration    |
| Results entry            | Basic lab/result workflow      |
| Referral letter          | Continuity and escalation      |
| Certificates             | Common clinic need             |
| Visit summary            | Patient/referral/claims output |
| Role-based access        | Privacy                        |
| Audit logs               | Compliance                     |
| Billing link             | Revenue and claims             |
| Basic reports            | Owner/manager visibility       |

## Version 2

Add:

| Feature                     | Reason                                   |
| --------------------------- | ---------------------------------------- |
| Chronic-care registry       | Diabetes, hypertension, asthma follow-up |
| Immunisation module         | Vaccine records where relevant           |
| Advanced templates          | Faster clinician documentation           |
| Results trend charts        | Chronic and lab monitoring               |
| Claims validation           | Reduce rejections                        |
| SMS/WhatsApp reminders      | Appointments, follow-ups, chronic care   |
| Patient portal              | Visit summaries and results              |
| Referral feedback tracking  | Continuity                               |
| Program flags               | HIV/TB/ANC/etc.                          |
| KHIS/DHIS2 aggregate export | Reporting support                        |
| FHIR API                    | Interoperability                         |

## Version 3

Add:

| Feature                              | Reason                              |
| ------------------------------------ | ----------------------------------- |
| National client registry integration | Future Digital Health Act readiness |
| Shared health record integration     | Continuity across facilities        |
| Clinical decision support            | Safety and quality                  |
| Telemedicine                         | Remote consultations                |
| AI documentation assistant           | Faster notes, with clinician review |
| Advanced chronic-care analytics      | Population management               |
| Immunisation registry integration    | National vaccine record support     |
| e-referral network                   | Referral tracking                   |
| Full insurer/SHA API integration     | Claims automation                   |
| Offline-first mobile EMR             | Rural/low-connectivity support      |

---

# 18. Acceptance criteria

The module is ready when it passes these tests:

| Test                 | Expected result                                                                         |
| -------------------- | --------------------------------------------------------------------------------------- |
| Register new patient | Patient number created with demographics, phone, ID/guardian/next of kin where captured |
| Duplicate check      | System warns on likely duplicate                                                        |
| Queue patient        | Patient moves from reception to triage to clinician                                     |
| Record vitals        | BP, pulse, temperature, weight, height/BMI, SpO₂ saved and visible to clinician         |
| Critical vital       | System alerts clinician                                                                 |
| Clinician note       | Complaint, history, exam, assessment, plan captured                                     |
| Diagnosis            | Primary diagnosis captured with ICD-10-ready field                                      |
| Lab order            | Order reaches lab/billing and result returns to clinician                               |
| Prescription         | Prescription reaches pharmacy dispensing module                                         |
| Procedure            | Procedure note links to billing and inventory where configured                          |
| Referral             | Referral letter generated with clinical summary                                         |
| Certificate          | Certificate issued only by authorized licensed clinician                                |
| Chronic care         | Patient enrolled and follow-up date generated                                           |
| Immunisation         | Vaccine record captures dose, batch, expiry, next dose                                  |
| Visit summary        | Printable/shareable visit summary generated                                             |
| Claim readiness      | Visit shows missing diagnosis/note/result/signature before claim                        |
| Privacy              | Reception cannot access restricted clinical details unless permitted                    |
| Audit                | Every view, edit, print, export, and signature is logged                                |

---

# 19. Final product behaviour

The Clinic EMR Module should behave like this:

| Situation              | Correct behaviour                                        |
| ---------------------- | -------------------------------------------------------- |
| New patient arrives    | Register, check duplicates, add to queue                 |
| Patient goes to triage | Capture vitals and safety flags                          |
| Clinician consults     | Document note, diagnosis, plan                           |
| Lab needed             | Order test, bill, result, clinician review               |
| Medicine needed        | Prescription flows to pharmacy                           |
| Procedure needed       | Procedure order, billing, note, consumables              |
| Patient needs referral | Generate referral letter and track destination           |
| Patient needs sick-off | Issue controlled certificate with clinician signature    |
| Chronic patient        | Show trends, medication history, follow-up plan          |
| Vaccine given          | Record vaccine, batch, dose, next due date               |
| Visit ends             | Generate visit summary and close visit                   |
| Claim needed           | Provide signed, structured, evidence-backed claim packet |
| Audit needed           | Show who did what, when, and why                         |

The key design principle is:

**A small-clinic EMR should be fast at the point of care, but every visit must leave behind a clear clinical story: who the patient is, what was found, what was diagnosed, what was ordered, what was done, what was prescribed, what was billed, and what should happen next.**

[1]: https://new.kenyalaw.org/akn/ke/act/2023/15 "
      Digital Health Act
    - Kenya Law"
[2]: https://kmpdc.go.ke/registration-of-a-health-facility/ "Registration of a Health Facility – Kenya Medical Practitioners and Dentists Council"
[3]: https://new.kenyalaw.org/akn/ke/act/2019/24/eng%402022-12-31 "
      Data Protection Act
    - Kenya Law"
[4]: https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402025-02-28 "
      The Social Health Insurance Regulations
    - Kenya Law"
[5]: https://icd.who.int/browse10/ "ICD-10 Version:2019 "
[6]: https://www.health.go.ke/ "MoH | Ministry of Health"
[7]: https://elearning.health.go.ke/course/index.php?categoryid=5 "MOH-VA: All courses | MOH-VA"
[8]: https://health.go.ke/vaccines-administered-our-children-are-safe-ministry-health-clarifies-nairobi-kenya-9th-november "Vaccines Administered to Our Children Are Safe, Ministry of Health Clarifies Nairobi, Kenya - 9th November 2024 | Ministry of Health"

You are right. **Module 5 has a diagnosis-terminology architecture gap.** “ICD-10-ready” is not enough. We must decide the exact code system, import method, search UX, indexing, ranking, favourites, governance, claims mapping, and update process.

I would close this as:

```text
ADR-022: Diagnosis Coding Terminology, ICD-10 Import, Search and Governance Strategy
```

---

# 1. Architecture decision

For Kenya, I recommend:

```text
MVP / Version 1:
    WHO ICD-10 Version 2019 as the canonical diagnosis code set
    Full code set loaded
    Kenya/common outpatient diagnosis favourites layered on top
    Frequency-ranked autocomplete
    Recent and clinician favourites
    Synonyms/local terms table

Version 2:
    Add claims/payer-specific diagnosis rule mapping
    Add clinical templates tied to common diagnoses
    Add KHIS/DHIS2-style aggregate reporting groupings

Version 3:
    Add ICD-11 readiness and FHIR terminology services
```

Do **not** use ICD-10-CM as the canonical Kenyan diagnosis code system unless a payer specifically demands it. ICD-10-CM is the United States clinical modification; CDC describes ICD-10-CM as the U.S. morbidity classification used for diagnoses and reasons for visits in healthcare settings. WHO ICD-10 is the international base classification and is the safer canonical choice for Kenya unless local payer rules say otherwise. ([ICD-11][1])

---

# 2. Full ICD-10 vs ICD-10-CM vs short list

## Recommended decision

| Option                          | Decision                             | Reason                                                                               |
| ------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| **WHO ICD-10 full set**         | **Use as canonical MVP code system** | International base ICD-10; best fit for Kenya-first implementation                   |
| **ICD-10-CM full set**          | Do not use as canonical              | U.S.-specific clinical modification; can be mapped later if a private payer requires |
| **WHO ICD-10 short list only**  | Do not use alone                     | Too limited for claims, referrals, reporting, audits                                 |
| **Common diagnosis favourites** | Use as UX layer                      | Makes clinician workflow fast without losing full-code coverage                      |

So the actual design is:

```text
Store full WHO ICD-10
Expose fast common-diagnosis UX
Allow full-code search when needed
Track frequency, favourites, recent diagnoses
```

---

# 3. Why full ICD-10 should be loaded

Even if 90% of clinic use is common outpatient diagnoses, the system still needs the full set because:

| Reason                  | Example                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| Claims                  | Payer may require a specific ICD-10 code                                   |
| Referrals               | Higher facility may need precise diagnosis                                 |
| Reporting               | Aggregates require stable standard codes                                   |
| Chronic care            | Diabetes, hypertension, asthma, HIV/TB, CKD need structured classification |
| Audit                   | Free-text-only diagnoses are weak evidence                                 |
| Future interoperability | FHIR Condition needs standard coding                                       |
| Avoid rework            | Adding full codes later causes mapping pain                                |

Clinician UX should hide the complexity, but the database should contain the full code set.

---

# 4. Code system choice

## Canonical diagnosis system

```text
Code system: WHO ICD-10
Version: 2019
Canonical source: WHO ICD-10 Browser / downloadable ICD-10 release where licensed/available
```

WHO’s ICD-10 browser identifies the classification as the International Statistical Classification of Diseases and Related Health Problems, 10th Revision, Version 2019, and supports browsing by hierarchy and search. ([ICD-11][1])

## Secondary mappings

| Mapping                        | Use                                                       |
| ------------------------------ | --------------------------------------------------------- |
| ICD-10-CM                      | Only if a private insurer, partner, or export requires it |
| Local common diagnosis terms   | Clinician search and favourites                           |
| KHIS/DHIS2 aggregate group     | Reporting                                                 |
| Chronic-care registry category | Hypertension, diabetes, asthma, etc.                      |
| Claims diagnosis group         | Payer validation                                          |
| FHIR coding system URI         | Interoperability                                          |

HL7 notes that ICD is a family of code systems maintained by WHO, and countries may publish their own variants; this supports keeping WHO ICD-10 canonical while allowing variant mappings when necessary. ([HL7 Terminology][2])

---

# 5. Import format

## Recommended import pipeline

```text
ICD source file
    ↓
Raw staging table
    ↓
Validation and normalization
    ↓
Canonical diagnosis table
    ↓
Search index table
    ↓
Common favourites and synonyms layer
    ↓
Version activation
```

## Import formats to support

| Format              | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| CSV                 | Simple controlled import                            |
| XML                 | Better hierarchy preservation if source provides it |
| JSON                | Internal normalized import/export                   |
| SQL seed            | Deployment seeding                                  |
| Manual admin import | Future updates                                      |

ICD-10-CM files are commonly available from CDC in PDF and XML formats, but that is for the U.S. modification. For WHO ICD-10, the project should confirm licensing and approved downloadable format before import. ([CDC][3])

---

# 6. Data model additions

Add a terminology schema:

```text
terminology.*
```

## `terminology.code_systems`

| Field           | Purpose                               |
| --------------- | ------------------------------------- |
| id              | Internal ID                           |
| code_system_key | WHO_ICD10, ICD10_CM, LOCAL_DIAGNOSIS  |
| name            | Display name                          |
| version         | 2019, FY2026, etc.                    |
| publisher       | WHO, CDC, local                       |
| canonical_uri   | FHIR/terminology URI where applicable |
| licence_notes   | Usage/licence notes                   |
| active_flag     | Active/inactive                       |
| imported_at     | Import timestamp                      |
| imported_by     | User/system                           |

---

## `terminology.diagnosis_codes`

| Field           | Purpose                                |
| --------------- | -------------------------------------- |
| id              | Internal ID                            |
| code_system_id  | Link to code system                    |
| code            | ICD-10 code                            |
| title           | Official title                         |
| short_title     | Short display                          |
| description     | Longer text if available               |
| chapter_code    | ICD chapter                            |
| chapter_title   | Chapter name                           |
| block_code      | ICD block                              |
| parent_code     | Parent hierarchy                       |
| code_level      | Chapter/block/category/subcategory     |
| billable_flag   | Whether selectable for diagnosis/claim |
| selectable_flag | Whether clinician can select it        |
| active_flag     | Active/inactive                        |
| effective_from  | Version date                           |
| effective_to    | Retirement date                        |
| created_at      | Import timestamp                       |

---

## `terminology.diagnosis_synonyms`

| Field             | Purpose                                            |
| ----------------- | -------------------------------------------------- |
| id                | Internal ID                                        |
| diagnosis_code_id | Link to ICD code                                   |
| synonym           | Common/local term                                  |
| language          | English, Kiswahili, local language                 |
| synonym_type      | Common, abbreviation, lay term, clinical shorthand |
| approved_by       | Governance                                         |
| active_flag       | Active/inactive                                    |

Examples:

| Synonym             | Maps to                                                         |
| ------------------- | --------------------------------------------------------------- |
| High blood pressure | Essential hypertension                                          |
| BP                  | Essential hypertension                                          |
| Sugar disease       | Diabetes mellitus                                               |
| UTI                 | Urinary tract infection                                         |
| Flu                 | Acute upper respiratory infection / influenza depending context |
| Malaria             | Malaria category/code                                           |
| Ulcers              | Gastritis/peptic ulcer depending clinician choice               |

---

## `terminology.diagnosis_favourites`

| Field             | Purpose                        |
| ----------------- | ------------------------------ |
| id                | Internal ID                    |
| user_id           | Clinician                      |
| branch_id         | Optional branch scope          |
| diagnosis_code_id | ICD code                       |
| favourite_type    | Personal, branch, organisation |
| display_order     | Ranking                        |
| created_at        | Timestamp                      |

---

## `terminology.diagnosis_usage_stats`

| Field                | Purpose          |
| -------------------- | ---------------- |
| id                   | Internal ID      |
| diagnosis_code_id    | ICD code         |
| branch_id            | Branch           |
| clinician_id         | Optional         |
| use_count            | Frequency        |
| last_used_at         | Last use         |
| rolling_30_day_count | Recent frequency |
| rolling_90_day_count | Recent frequency |

---

## `terminology.diagnosis_mappings`

| Field                 | Purpose                                 |
| --------------------- | --------------------------------------- |
| id                    | Internal ID                             |
| source_code_system_id | WHO ICD-10                              |
| source_code           | ICD-10 code                             |
| target_code_system_id | ICD-10-CM, local claim code, KHIS group |
| target_code           | Mapped code                             |
| mapping_type          | exact, broader, narrower, approximate   |
| confidence            | high, medium, low                       |
| approved_by           | Governance                              |
| active_flag           | Active/inactive                         |

---

## `emr.diagnoses`

This is the actual patient diagnosis table.

| Field               | Purpose                                    |
| ------------------- | ------------------------------------------ |
| id                  | Diagnosis record                           |
| visit_id            | Visit                                      |
| patient_id          | Patient                                    |
| diagnosis_code_id   | Link to terminology.diagnosis_codes        |
| diagnosis_text      | Clinician-facing text                      |
| icd10_code          | Denormalized for reporting/claim stability |
| code_system_version | Version used                               |
| diagnosis_type      | provisional, final, differential           |
| primary_flag        | Primary diagnosis                          |
| chronic_flag        | Chronic diagnosis marker                   |
| onset_date          | Optional                                   |
| severity            | Optional                                   |
| status              | active, resolved, recurrent                |
| clinician_id        | User                                       |
| created_at          | Timestamp                                  |
| updated_at          | Timestamp                                  |

Important: store both the foreign key and the denormalized code/version at time of use. This protects old claims and reports when the terminology version changes.

---

# 7. Search UX design

The clinician should not be forced to browse 70,000 codes manually.

## Search design

The diagnosis picker should have four layers:

```text
1. Favourites
2. Recent diagnoses
3. Facility/branch common diagnoses
4. Full ICD-10 search
```

## Search box behaviour

The user should be able to type:

```text
malaria
uti
bp
hypertension
diabetes
fever
pregnancy
asthma
ulcer
back pain
J45
I10
E11
```

The search should return:

| Result type         | Example                         |
| ------------------- | ------------------------------- |
| Exact code match    | `I10 - Essential hypertension`  |
| Exact text match    | `Malaria, unspecified`          |
| Synonym match       | `BP → Essential hypertension`   |
| Abbreviation match  | `UTI → Urinary tract infection` |
| Recent match        | Recently used by this clinician |
| Branch common match | Common in this branch           |
| Fuzzy match         | “diabetis” → diabetes           |
| Chapter/block match | Respiratory infections          |

---

## Ranking formula

A practical ranking model:

```text
score =
    exact_code_match * 100
  + exact_title_match * 80
  + synonym_match * 70
  + prefix_match * 50
  + fuzzy_match * 30
  + clinician_favourite * 40
  + branch_frequency_score * 30
  + clinician_recent_score * 25
  + organisation_frequency_score * 15
  - inactive_penalty
  - non_selectable_penalty
```

## Ranking principles

| Rule                        | Behaviour                                       |
| --------------------------- | ----------------------------------------------- |
| Exact code wins             | Typing `I10` should show I10 first              |
| Favourites rank high        | Clinician’s own common diagnoses appear early   |
| Branch frequency matters    | Malaria-heavy branch sees malaria high          |
| Recent matters              | Diagnoses used this week rank higher            |
| Non-selectable categories   | Show but prevent final selection if not allowed |
| Misspellings tolerated      | Fuzzy search                                    |
| Abbreviations supported     | UTI, URTI, BP, DM, HTN, ANC                     |
| Claims-ready status visible | Show if code is acceptable for claim            |

---

# 8. Diagnosis picker UI

## Recommended UI

```text
Diagnosis search box
    ↓
Tabs:
    - Common
    - Recent
    - Favourites
    - Full ICD-10
    - Chronic
    - Claims suggestions

Search result row:
    Code
    Diagnosis name
    Chapter/category
    Common/local synonym
    Selectable indicator
    Star/favourite button
```

Example row:

```text
I10 | Essential hypertension
Chapter IX: Diseases of the circulatory system
Common: High blood pressure, BP
[Primary] [Add as secondary] [★]
```

## Selection workflow

When selected:

```text
Select diagnosis
    ↓
Set primary/secondary
    ↓
Set provisional/final
    ↓
Set chronic flag if applicable
    ↓
Attach to visit
    ↓
Attach to orders/claims
```

## Common outpatient favourites

For Kenyan outpatient clinics, seed a practical common list:

| Category       | Examples                                              |
| -------------- | ----------------------------------------------------- |
| Infectious     | Malaria, URTI, gastroenteritis, UTI                   |
| Chronic        | Hypertension, diabetes, asthma                        |
| Respiratory    | Pneumonia, bronchitis, allergic rhinitis              |
| GI             | Gastritis, peptic ulcer disease, diarrhoea            |
| Skin           | Dermatitis, fungal infection, cellulitis              |
| Injury         | Wound, sprain, burn                                   |
| Maternal/child | Pregnancy-related visits, immunisation encounter      |
| Eye/ENT        | Otitis media, conjunctivitis, tonsillitis             |
| Genitourinary  | UTI, vaginal discharge, STI syndrome where configured |
| Administrative | Medical examination, follow-up visit                  |

These must be mapped to the correct ICD-10 codes during clinical governance, not guessed casually by developers.

---

# 9. Claims integration

Diagnosis codes must support claims validation.

## Claim-readiness rules

| Rule                            | Behaviour                                               |
| ------------------------------- | ------------------------------------------------------- |
| Claim visit                     | Primary diagnosis required                              |
| Payer requires ICD-10           | ICD-10 code required                                    |
| Diagnosis free-text only        | Claim not ready                                         |
| Diagnosis not selectable        | Claim not ready                                         |
| Service-diagnosis mismatch      | Warning                                                 |
| Lab/procedure without diagnosis | Claim warning/block depending payer                     |
| Chronic-care claim              | Chronic diagnosis/status required                       |
| Pre-authorisation               | Diagnosis required before submission                    |
| Denial correction               | Diagnosis correction creates claim resubmission version |

## Diagnosis-to-claim linkage

Each claim line should optionally link to diagnosis:

```text
claims.claim_lines.diagnosis_id → emr.diagnoses.id
```

This allows:

| Use                                      |
| ---------------------------------------- |
| Diagnosis-based medical necessity checks |
| Claim validation                         |
| Denial management                        |
| Payer review                             |
| Analytics                                |
| Audit                                    |

---

# 10. Reporting integration

Diagnosis coding feeds Module 8.

## Reports enabled

| Report                       | Use                       |
| ---------------------------- | ------------------------- |
| Diagnosis/service report     | Clinic manager            |
| Top diagnoses                | Operational planning      |
| Diagnosis by branch          | Branch comparison         |
| Diagnosis by age/sex         | Public health/management  |
| Diagnosis by clinician       | Clinical workload         |
| Diagnosis by payer           | Claims analytics          |
| Chronic-care registry        | Continuity                |
| Lab orders by diagnosis      | Utilization               |
| Prescription by diagnosis    | Pharmacy analytics        |
| Referral by diagnosis        | Service capability        |
| Claim rejection by diagnosis | Revenue cycle improvement |

## Aggregation groups

Add a table:

### `terminology.diagnosis_reporting_groups`

| Field               | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| id                  | Group ID                                              |
| group_name          | Fever/malaria, respiratory, chronic, maternal, injury |
| reporting_framework | Internal, KHIS, payer, custom                         |
| active_flag         | Active/inactive                                       |

### `terminology.diagnosis_reporting_group_members`

| Field             | Purpose                    |
| ----------------- | -------------------------- |
| group_id          | Reporting group            |
| diagnosis_code_id | ICD code                   |
| mapping_type      | exact/chapter/block/custom |

---

# 11. FHIR and interoperability readiness

For future interoperability, diagnosis should map to FHIR Condition.

## FHIR mapping

| Local field       | FHIR Condition field                       |
| ----------------- | ------------------------------------------ |
| patient_id        | `Condition.subject`                        |
| visit_id          | `Condition.encounter`                      |
| diagnosis_code_id | `Condition.code.coding`                    |
| diagnosis_text    | `Condition.code.text`                      |
| diagnosis_type    | `Condition.verificationStatus` / extension |
| primary_flag      | Encounter diagnosis rank/use               |
| onset_date        | `Condition.onsetDateTime`                  |
| status            | `Condition.clinicalStatus`                 |
| clinician_id      | `Condition.recorder`                       |
| created_at        | `Condition.recordedDate`                   |

Use WHO ICD-10 canonical coding system where applicable, and retain mapping flexibility for ICD-10-CM or ICD-11 later.

---

# 12. Import and update governance

## Import lifecycle

```text
Acquire official code set
    ↓
Load into staging
    ↓
Validate code count, hierarchy, duplicates
    ↓
Run selectable/billable rules
    ↓
Build search index
    ↓
Clinical governance review
    ↓
Activate version
    ↓
Freeze old version for historical claims
```

## Update rules

| Rule                        | Behaviour                                       |
| --------------------------- | ----------------------------------------------- |
| New ICD version imported    | Do not overwrite old diagnosis records          |
| Code retired                | Keep old records, stop new selection            |
| Code title changes          | New version effective from activation date      |
| Mapping changes             | Version mappings                                |
| Claim already submitted     | Preserve old code/version                       |
| Favourite uses retired code | Prompt replacement                              |
| Synonym changed             | Keep history if used in searches/selection logs |

---

# 13. Search implementation options

## SQL Server full-text search

For MVP, SQL Server full-text search can work well.

| Component                | Use                                    |
| ------------------------ | -------------------------------------- |
| Full-text index          | Diagnosis title, short title, synonyms |
| Normalized search column | Lowercase, stripped punctuation        |
| Usage stats table        | Ranking                                |
| Favourites table         | Personal ranking                       |
| Recent diagnosis cache   | Fast clinician UX                      |
| Frontend debounce        | 250–400 ms                             |
| Result limit             | 20–50 results                          |
| Async preload            | Common/favourite/recent codes          |

## Optional later search engine

If search grows more complex, add:

| Tool                     | Use                                      |
| ------------------------ | ---------------------------------------- |
| Azure AI Search          | Better ranking, synonyms, typo tolerance |
| Elasticsearch/OpenSearch | Advanced full-text and analytics         |
| Redis search/cache       | Very fast common-code search             |

For 10 branches, SQL Server full-text plus caching is enough for MVP.

---

# 14. Frontend UX details

## Autocomplete behaviour

| UX requirement                | Behaviour                       |
| ----------------------------- | ------------------------------- |
| Debounced search              | Do not query on every keystroke |
| Keyboard friendly             | Arrow keys, Enter to select     |
| Mouse/touch friendly          | Tablet-compatible               |
| Shows code and name           | Avoid selecting wrong diagnosis |
| Shows favourites first        | Faster for common diagnoses     |
| Allows star/favourite         | Personalise                     |
| Recent diagnoses              | Clinician and branch recent     |
| Allows secondary diagnosis    | Multi-diagnosis visits          |
| Requires primary diagnosis    | For claim-ready visit           |
| Allows provisional diagnosis  | Before lab results              |
| Allows update/final diagnosis | With addendum/audit             |
| Warns free-text-only          | Not claim-ready                 |

---

# 15. Data quality controls

## Required controls

| Control                        | Behaviour                                  |
| ------------------------------ | ------------------------------------------ |
| Free-text diagnosis allowed?   | Yes for clinical note, but not claim-ready |
| ICD code required?             | Required for claims and reports            |
| One primary diagnosis          | Required when multiple diagnoses           |
| Secondary diagnoses allowed    | Yes                                        |
| Chronic diagnosis prompt       | For diabetes, hypertension, asthma, etc.   |
| Duplicate diagnosis warning    | Same visit, same code                      |
| Inactive code                  | Not selectable                             |
| Parent category selection      | Block if not billable/selectable           |
| Diagnosis change after signing | Addendum/correction workflow               |
| Diagnosis deletion             | Soft delete with audit, not hard delete    |

---

# 16. Security and access

Diagnosis data is health data, so access must be controlled.

| User           | Access                                                                    |
| -------------- | ------------------------------------------------------------------------- |
| Reception      | Usually no full diagnosis access unless required                          |
| Clinician      | Full diagnosis access                                                     |
| Pharmacist     | Relevant diagnosis for prescription safety and claim where needed         |
| Lab            | Limited diagnosis/clinical indication for ordered tests                   |
| Claims officer | Claim-relevant diagnosis                                                  |
| Accountant     | Diagnosis usually masked                                                  |
| Owner/manager  | Aggregated diagnosis reports, patient identifiers masked unless permitted |
| DPO/auditor    | Access logs and controlled investigation access                           |

---

# 17. Performance estimate

## ICD-10 data size

Full WHO ICD-10 is manageable for SQL Server. Even ICD-10-CM with tens of thousands of codes is not large compared to transactional tables. The performance risk is not storage; it is search UX and careless queries.

## Performance design

| Area                     | Requirement                     |
| ------------------------ | ------------------------------- |
| Initial common list load | < 1 second                      |
| Search result response   | < 300–500 ms target             |
| Result count             | Limit to 20–50                  |
| Full-text index          | Required                        |
| Synonym index            | Required                        |
| Usage ranking table      | Required                        |
| Caching                  | Common/favourites/recent cached |
| Mobile/tablet            | Autocomplete must work smoothly |

---

# 18. Sprint addition

Add a dedicated terminology sprint before EMR diagnosis implementation.

## New sprint: Terminology and ICD-10 Foundation

Place before existing EMR diagnosis sprint.

### Scope

| Workstream            | Deliverable                         |
| --------------------- | ----------------------------------- |
| ADR-022               | ICD-10 code system decision         |
| ICD import pipeline   | Load full WHO ICD-10                |
| Code-system tables    | `terminology.*` schema              |
| Diagnosis code table  | Full code hierarchy                 |
| Search index          | Full-text and synonym search        |
| Common diagnosis list | Kenya outpatient favourites         |
| Synonym table         | Local/common terms                  |
| Favourites            | User/branch/organisation favourites |
| Recent diagnosis      | Usage tracking                      |
| Frequency ranking     | Ranking service                     |
| Diagnosis picker UI   | Autocomplete and selection          |
| Claim-readiness rules | ICD required for claim              |
| Reporting groups      | Top diagnosis/reporting aggregation |
| Governance            | Versioning and update workflow      |

### Acceptance criteria

| Test                            | Expected result                         |
| ------------------------------- | --------------------------------------- |
| Full WHO ICD-10 imported        | Codes searchable and versioned          |
| Search `I10`                    | Essential hypertension appears first    |
| Search `BP`                     | Hypertension appears via synonym        |
| Search `UTI`                    | Urinary diagnosis options appear        |
| Clinician favourites diagnosis  | It appears higher next time             |
| Recent diagnosis                | Appears in recent tab                   |
| Branch common diagnosis         | Appears in common tab                   |
| Inactive code                   | Not selectable                          |
| Parent non-selectable category  | Cannot be used as final claim diagnosis |
| Claim visit without ICD code    | Claim not ready                         |
| Diagnosis changed after signing | Audit/addendum workflow triggered       |
| Report top diagnoses            | Uses ICD codes and groups               |

---

# 19. Updated Module 5 principle

Replace:

```text
Diagnosis should be ICD-10-ready.
```

With:

```text
Diagnosis must be stored as structured, versioned terminology: full WHO ICD-10 code set loaded, clinician-friendly autocomplete, favourites, recents, synonyms, frequency ranking, claim-readiness validation, and reporting mappings.
```

---

# 20. Final recommendation

For this project:

```text
Use WHO ICD-10 full code set as canonical.
Do not use ICD-10-CM as canonical unless a payer requires it.
Do not use a short list as the database source.
Do use a short/common diagnosis list as the clinician UX layer.
Build autocomplete with:
    exact code match
    title match
    synonym match
    abbreviation match
    favourites
    recent use
    branch frequency
    organisation frequency.
Version the code set.
Preserve code/version on every diagnosis record.
Map to claims, reporting, chronic care, and future FHIR Condition.
```

The important rule is:

**Clinicians should experience diagnosis entry as a fast common-diagnosis search, but the system must store a full, versioned, standard ICD-10 diagnosis code behind the visit, claim, report, and referral.**

# Module 5 Gap Closure: Clinic EMR — Developer Handoff Addendum

## Updated handoff status

| Area                      |                                                      Previous status |                                                                                                            After this closure |
| ------------------------- | -------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------: |
| Completeness              |                                                         Good to high |                                                                                                                 **Very high** |
| Developer readiness       |                                                               Medium |                                                             **High for MVP EMR; medium-high for clinical governance content** |
| Accuracy confidence       |                       Good directionally; clinical governance needed |                                                                  **Good, with explicit clinician/product-owner review gates** |
| Main previous gaps        | UI speed, templates, ICD lookup, certificate scope, service packages |                              **Closed with configurable templates, coding source, certificate guardrails, and package model** |
| Developer start readiness |                                          Could scaffold EMR entities | **Can now implement UI flows, data model, templates, claim-readiness rules, certificates, and service package configuration** |

The updated design principle is:

```text
The Clinic EMR must be fast enough for a 3-minute outpatient encounter,
but structured enough that every visit can support continuity of care, claims, audit, referral, and future interoperability.
```

Developers can build the core EMR now. Clinical templates, certificate wording, diagnosis favourites, and service packages should be reviewed by the clinic’s clinical lead or product-owner clinician before production use.

---

# 1. Final developer decisions

| Gap                                | Final decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| UI wireframes for clinician speed  | Use a **single-page clinician workspace** with patient summary, quick SOAP note, diagnosis, orders, prescription, follow-up, and sign buttons visible without heavy navigation. Add templates, favourites, shortcuts, and “copy forward with review.”                                                                                                                                                                                                                                |
| Clinical templates                 | Ship configurable templates for General OPD, Review Visit, Paediatric, Fever/Malaria, Respiratory/URTI, UTI, Gastroenteritis, Hypertension, Diabetes, Asthma, Wound/Dressing, Procedure, Immunisation, Lab-only, Referral, Emergency Stabilisation, and Certificate Visit.                                                                                                                                                                                                           |
| ICD-10 lookup                      | Use **WHO ICD API / WHO ICD browser as the source direction**, with a local cached diagnosis-code table, clinic favourites, search synonyms, and offline fallback. Design should be ICD-10-ready and ICD-11-ready. WHO states that the ICD API allows programmatic access to ICD and is HTTP REST based. ([icd.who.int](https://icd.who.int/docs/icd-api/))                                                                                                                          |
| FHIR mapping                       | Map MVP resources to Patient, Encounter, Observation, Condition, ServiceRequest, MedicationRequest, DiagnosticReport, Procedure, DocumentReference, and Immunization. HL7 FHIR defines ServiceRequest as a request for services such as diagnostic investigations that may result in Procedure, Observation, DiagnosticReport, ImagingStudy or similar resources. ([hl7.org](https://fhir.hl7.org/fhir/servicerequest.html))                                                         |
| Certificate legal scope            | Implement certificate types with **role, facility, template, and approval controls**. Sick-off/incapacity certificates should only be issued by authorized clinical users. Kenya’s Employment Act recognizes a certificate of incapacity to work signed by a duly qualified medical practitioner or a person acting on the practitioner’s behalf in charge of a dispensary or medical aid centre. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/2007/11/eng%402024-04-26)) |
| Facility-specific service packages | Configure service packages per branch/facility based on Module 1 facility type, approved services, staff cadre, equipment, payer contracts, and product-owner approval.                                                                                                                                                                                                                                                                                                              |
| Claim-readiness validation         | Create a `visit_readiness_score` and blocker list: diagnosis, ICD-10 where required, signed note, orders, results, prescription, attachments, referral, certificate, and bill lines.                                                                                                                                                                                                                                                                                                 |
| Clinical governance                | Add a `clinical_template_approval` workflow. Templates and certificate wording cannot be edited freely in production.                                                                                                                                                                                                                                                                                                                                                                |
| Data model                         | Use reusable form templates and structured fields, not hard-coded forms only.                                                                                                                                                                                                                                                                                                                                                                                                        |
| Production risk                    | Certificate scope, facility service packages, and clinical templates must be reviewed by licensed clinical leadership before go-live.                                                                                                                                                                                                                                                                                                                                                |

---

# 2. Standards and regulatory anchor summary

| Area                              | Source                                                            | System implication                                                                                          |
| --------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Facility and clinician legitimacy | KMPDC and relevant professional councils                          | EMR signing must depend on Module 1 professional and facility permissions                                   |
| ICD diagnosis coding              | WHO ICD API / ICD browser                                         | Use WHO ICD code source, local cache, and favourites                                                        |
| Interoperability                  | HL7 FHIR                                                          | Map patient, encounter, vitals, diagnosis, orders, results, prescriptions, summaries                        |
| Sick-off/incapacity certificate   | Employment Act                                                    | Certificate issuance must be controlled by authorized clinical staff                                        |
| Facility service scope            | KMPDC facility registration/checklists and Module 1 licence setup | Facility packages must be branch/facility-specific, not global                                              |
| Data protection                   | Kenya Data Protection Act                                         | Access to clinical notes, lab results, certificates, and sensitive diagnoses must be role-based and audited |

KMPDC lists health-facility inspection checklists by facility level and provides application forms for private medical or dental institutions, which supports the design decision that service packages should depend on facility type, level, approved services, staff, and equipment rather than being hard-coded across all clinics. ([kmpdc.go.ke](https://kmpdc.go.ke/downloads/))

---

# 3. UI wireframes for clinician speed

## 3.1 Clinician workspace layout

The clinician screen should avoid forcing the user through many tabs. Use one main workspace.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Patient: Jane Wanjiku | 32F | Allergies: Penicillin | BP: 146/92     │
│ Visit: OPD Review | Payer: Cash | Queue time: 18 min | Alerts: 2     │
├───────────────┬───────────────────────────────────────┬─────────────┤
│ LEFT PANEL    │ CENTRE: CONSULTATION NOTE             │ RIGHT PANEL │
│               │                                       │             │
│ Patient card  │ Template: General OPD                 │ Diagnoses   │
│ Previous Dx   │ Complaint                             │ Orders      │
│ Med history   │ History                               │ Prescription│
│ Allergies     │ Exam                                  │ Lab results │
│ Vitals trend  │ Assessment                            │ Follow-up   │
│ Recent visits │ Plan                                  │ Billing     │
│ Documents     │                                       │             │
├───────────────┴───────────────────────────────────────┴─────────────┤
│ [Save draft] [Order lab] [Prescribe] [Refer] [Certificate] [Sign]    │
└─────────────────────────────────────────────────────────────────────┘
```

## 3.2 Left panel: patient context

| Widget            | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| Patient summary   | Age, sex, phone, patient number                         |
| Alerts            | Allergies, pregnancy, chronic disease, critical results |
| Last 3 visits     | Quick continuity                                        |
| Current medicines | Avoid duplicate prescribing                             |
| Active problems   | Hypertension, diabetes, asthma                          |
| Vitals trend      | BP, weight, glucose, SpO₂                               |
| Pending tasks     | Lab results, unpaid bill, missed follow-up              |
| Documents         | External results, referrals, prior summaries            |

## 3.3 Centre panel: fast clinical note

Use progressive disclosure: simple by default, detailed when needed.

```text
Chief complaint: [________________________]

History:
[Quick phrases] [Free text]

Exam:
[Normal exam] [Focused exam] [Free text]

Assessment:
[Diagnosis search] [Favourites]

Plan:
[Order lab] [Prescribe] [Procedure] [Refer] [Follow-up]
```

## 3.4 Right panel: orders and actions

| Action        | Behaviour                                             |
| ------------- | ----------------------------------------------------- |
| Add diagnosis | Opens ICD/search + favourites                         |
| Order lab     | Creates ServiceRequest/lab order                      |
| Prescribe     | Opens medication order builder                        |
| Add procedure | Creates procedure order and billing line              |
| Refer         | Creates referral letter                               |
| Certificate   | Opens allowed certificate templates                   |
| Follow-up     | Sets review date and reminder                         |
| Sign visit    | Runs claim-readiness and clinical completeness checks |

## 3.5 Clinician keyboard shortcuts

| Shortcut       | Action               |
| -------------- | -------------------- |
| `Ctrl + S`     | Save draft           |
| `Ctrl + D`     | Add diagnosis        |
| `Ctrl + L`     | Order lab            |
| `Ctrl + P`     | Prescribe            |
| `Ctrl + R`     | Referral             |
| `Ctrl + F`     | Follow-up            |
| `Ctrl + Enter` | Sign note            |
| `/`            | Open command palette |
| `@template`    | Insert template      |
| `#dx`          | Diagnosis search     |
| `#med`         | Medicine search      |
| `#lab`         | Lab order search     |

## 3.6 Command palette

Clinicians should be able to type quick commands.

```text
/lab malaria
/rx amoxicillin
/dx malaria
/followup 7 days
/cert sickoff
/refer hospital
```

## 3.7 Speed features

| Feature                     | Rule                                       |
| --------------------------- | ------------------------------------------ |
| Favourites                  | Per clinician and per facility             |
| Template snippets           | Approved phrases only                      |
| Copy previous note          | Allowed only as “copy forward with review” |
| One-click normal exam       | Inserts approved text                      |
| Default follow-up intervals | By template/condition                      |
| Smart visit close           | Shows missing data before signing          |
| Draft autosave              | Every 15–30 seconds                        |
| Offline draft               | Allowed where offline mode enabled         |
| Mobile/tablet mode          | Triage and simple consultations            |
| Red flags                   | Always visible, never hidden in tabs       |

---

# 4. Final clinical template framework

## 4.1 Template architecture

Do not hard-code every template directly into the UI. Use a configurable template engine.

```text
clinical_template
    └── template_sections
            └── template_fields
                    └── validation_rules
                    └── claim_readiness_rules
```

## 4.2 `clinical_templates`

| Field                         |    Required | Notes                           |
| ----------------------------- | ----------: | ------------------------------- |
| `id`                          |         Yes |                                 |
| `template_code`               |         Yes | `GENERAL_OPD`, `HTN_REVIEW`     |
| `template_name`               |         Yes | General OPD                     |
| `visit_type`                  |         Yes | OPD, review, emergency, chronic |
| `facility_service_package_id` |    Optional | Limit by branch package         |
| `age_group`                   |    Optional | adult, child, all               |
| `sex_applicability`           |    Optional | all, female, male               |
| `sensitive_flag`              |         Yes | For HIV/TB/mental health/etc.   |
| `claim_ready_supported`       |         Yes |                                 |
| `active`                      |         Yes |                                 |
| `version`                     |         Yes |                                 |
| `approval_status`             |         Yes | draft, approved, retired        |
| `approved_by`                 | Conditional |                                 |
| `approved_at`                 | Conditional |                                 |

## 4.3 `clinical_template_sections`

| Field                  | Required |
| ---------------------- | -------: |
| `id`                   |      Yes |
| `template_id`          |      Yes |
| `section_code`         |      Yes |
| `section_name`         |      Yes |
| `display_order`        |      Yes |
| `required_for_signing` |      Yes |
| `required_for_claim`   |      Yes |
| `collapsible`          |      Yes |
| `default_open`         |      Yes |

## 4.4 `clinical_template_fields`

| Field                | Required |
| -------------------- | -------: |
| `id`                 |      Yes |
| `section_id`         |      Yes |
| `field_code`         |      Yes |
| `field_label`        |      Yes |
| `field_type`         |      Yes |
| `required`           |      Yes |
| `required_for_claim` |      Yes |
| `default_value`      | Optional |
| `options_json`       | Optional |
| `validation_json`    | Optional |
| `maps_to_fhir`       | Optional |
| `display_order`      |      Yes |

---

# 5. Final MVP clinical templates

## 5.1 General OPD template

| Section     | Fields                                                        |
| ----------- | ------------------------------------------------------------- |
| Complaint   | Chief complaint, duration                                     |
| History     | HPI, associated symptoms, past history, drug history, allergy |
| Vitals      | BP, pulse, temp, weight, height/BMI, SpO₂                     |
| Examination | General exam, system exam                                     |
| Assessment  | Primary diagnosis, differential diagnosis                     |
| Plan        | Lab orders, prescription, procedure, advice, follow-up        |
| Disposition | Home, review, referral, emergency transfer                    |

### Minimum required to sign

```text
Chief complaint
Assessment/diagnosis
Plan
Clinician signature
```

### Required for claim-ready visit

```text
Primary diagnosis
ICD-10 code if payer requires
Signed note
Billable service line
Clinician licence active
```

---

## 5.2 Review visit template

| Section           | Fields                                     |
| ----------------- | ------------------------------------------ |
| Reason for review | Follow-up, results review, medicine review |
| Interval history  | Better/worse/same, new symptoms            |
| Adherence         | Medicines taken, missed doses              |
| Vitals            | Relevant trend                             |
| Results           | Pending/reviewed                           |
| Assessment        | Response to treatment                      |
| Plan              | Continue/change/refer/follow-up            |

---

## 5.3 Paediatric visit template

| Section             | Fields                                                    |
| ------------------- | --------------------------------------------------------- |
| Guardian            | Guardian name, relationship, phone                        |
| Complaint           | Complaint and duration                                    |
| Red flags           | Poor feeding, lethargy, convulsions, difficulty breathing |
| Vitals              | Temp, weight, respiratory rate, SpO₂                      |
| Growth/nutrition    | Weight, MUAC if used                                      |
| Immunisation status | Up to date, missed, unknown                               |
| Assessment          | Diagnosis                                                 |
| Plan                | Treatment, dose by weight, safety advice, follow-up       |

### Paediatric rules

```text
If age < configured paediatric threshold:
  Weight is strongly required before prescribing weight-sensitive medicines.
```

---

## 5.4 Fever / malaria template

| Section   | Fields                                                |
| --------- | ----------------------------------------------------- |
| Complaint | Fever duration, chills, headache, vomiting            |
| Red flags | Convulsions, altered consciousness, severe weakness   |
| Exam      | Temp, hydration, pallor, respiratory signs            |
| Orders    | Malaria RDT/microscopy, CBC if available              |
| Diagnosis | Malaria suspected/confirmed, fever unspecified, other |
| Plan      | Antimalarial if indicated, fluids, return precautions |

---

## 5.5 Respiratory / URTI template

| Section   | Fields                                                                        |
| --------- | ----------------------------------------------------------------------------- |
| Complaint | Cough, sore throat, fever, duration                                           |
| Red flags | Shortness of breath, chest pain, low SpO₂                                     |
| Exam      | Throat, chest, respiratory rate, SpO₂                                         |
| Diagnosis | URTI, bronchitis, pneumonia suspected, asthma exacerbation                    |
| Plan      | Symptomatic treatment, antibiotics only where clinically justified, follow-up |

---

## 5.6 UTI template

| Section   | Fields                                        |
| --------- | --------------------------------------------- |
| Complaint | Dysuria, frequency, urgency, flank pain       |
| Risk      | Pregnancy, male patient, recurrent UTI, fever |
| Orders    | Urinalysis, pregnancy test where relevant     |
| Diagnosis | UTI/cystitis/pyelonephritis suspected         |
| Plan      | Treatment, hydration, danger signs, review    |

---

## 5.7 Gastroenteritis template

| Section   | Fields                                                      |
| --------- | ----------------------------------------------------------- |
| Complaint | Diarrhoea, vomiting, duration                               |
| Red flags | Blood in stool, severe dehydration, child/elderly           |
| Exam      | Hydration, abdominal exam, temp                             |
| Orders    | Stool test if indicated                                     |
| Plan      | ORS, zinc for children where configured, referral if severe |

---

## 5.8 Hypertension review template

| Section      | Fields                                          |
| ------------ | ----------------------------------------------- |
| BP trend     | Current BP, previous BP                         |
| Adherence    | Good/poor/missed doses                          |
| Symptoms     | Headache, chest pain, breathlessness, dizziness |
| Risk factors | Smoking, alcohol, weight, diabetes              |
| Medications  | Current antihypertensives                       |
| Assessment   | Controlled/uncontrolled/hypertensive urgency    |
| Plan         | Continue/change medicines, lifestyle, follow-up |

### Hypertension rules

```text
If BP above configured critical threshold:
  Mark urgent
  Require clinician acknowledgement
  Suggest emergency/referral consideration
```

---

## 5.9 Diabetes review template

| Section       | Fields                                       |
| ------------- | -------------------------------------------- |
| Glucose trend | RBS/FBS/HbA1c where available                |
| Adherence     | Medication, diet, exercise                   |
| Symptoms      | Polyuria, polydipsia, hypoglycaemia          |
| Foot check    | Optional but recommended                     |
| Complications | Vision, neuropathy, renal symptoms           |
| Plan          | Medication, lab orders, education, follow-up |

---

## 5.10 Asthma review template

| Section       | Fields                                             |
| ------------- | -------------------------------------------------- |
| Symptoms      | Wheeze, cough, night symptoms                      |
| Exacerbations | ER visits, steroid use                             |
| Triggers      | Dust, smoke, cold, exercise                        |
| Inhaler use   | Technique/adherence                                |
| Exam          | Respiratory rate, SpO₂, chest exam                 |
| Plan          | Reliever/controller review, action plan, follow-up |

---

## 5.11 Wound / dressing template

| Section     | Fields                                                 |
| ----------- | ------------------------------------------------------ |
| Wound site  | Body location                                          |
| Wound type  | Traumatic, surgical, diabetic, burn                    |
| Appearance  | Size, discharge, smell, redness                        |
| Procedure   | Cleaning, dressing, sutures removed                    |
| Consumables | Dressing pack, gauze, antiseptic                       |
| Plan        | Next dressing date, antibiotics if indicated, referral |

---

## 5.12 Procedure template

| Section        | Fields                                      |
| -------------- | ------------------------------------------- |
| Procedure name | Injection, nebulization, suturing, dressing |
| Indication     | Why procedure was done                      |
| Consent        | Verbal/written where required               |
| Performed by   | Staff member                                |
| Consumables    | Stock items used                            |
| Complications  | None/describe                               |
| Outcome        | Completed/referred/review                   |

---

## 5.13 Immunisation template

| Section           | Fields             |
| ----------------- | ------------------ |
| Vaccine           | Vaccine name       |
| Dose              | Dose number        |
| Batch             | Batch/lot          |
| Expiry            | Expiry date        |
| Site/route        | Route/site         |
| Contraindications | Checked            |
| Next dose         | Date               |
| AEFI              | Adverse event flag |

---

## 5.14 Emergency stabilisation template

| Section              | Fields                                |
| -------------------- | ------------------------------------- |
| Presenting emergency | Short description                     |
| Triage category      | Emergency/urgent                      |
| Initial vitals       | BP, pulse, temp, SpO₂, RBS            |
| Immediate actions    | Oxygen, fluids, medication, procedure |
| Response             | Improved/unchanged/worse              |
| Referral             | Facility, transport, handover         |
| Clinician/nurse      | Responsible staff                     |

---

## 5.15 Lab-only visit template

| Section                 | Fields                                          |
| ----------------------- | ----------------------------------------------- |
| Reason                  | Walk-in test, review, employer, clinician order |
| Test ordered            | Lab order                                       |
| Billing status          | Paid/covered                                    |
| Result status           | Pending/resulted                                |
| Clinician review needed | Yes/no                                          |

---

## 5.16 Certificate visit template

| Section                | Fields                                |
| ---------------------- | ------------------------------------- |
| Certificate type       | Sick-off, school note, return-to-work |
| Reason for certificate | Clinical reason/summary               |
| Assessment done        | Yes/no                                |
| Date range             | Start/end where applicable            |
| Restrictions           | Work/school/activity restrictions     |
| Issuer                 | Authorized clinician                  |
| Legal disclaimer       | Configured wording                    |
| Approval               | Required if backdated/long duration   |

---

# 6. ICD-10 diagnosis coding source and implementation

## 6.1 Final source decision

Use:

```text
Primary source: WHO ICD API / ICD browser
Local system cache: diagnosis_codes
Facility favourites: diagnosis_favourites
Clinician synonyms: diagnosis_synonyms
Fallback: curated common OPD list
```

WHO’s ICD API documentation states that the ICD API allows programmatic access to ICD and includes supported classification versions and authentication documentation; WHO also provides an ICD API site for up-to-date API documentation and key management. ([icd.who.int](https://icd.who.int/docs/icd-api/)) ([icd.who.int](https://icd.who.int/icdapi))

## 6.2 Diagnosis lookup modes

| Mode                            | Use                         |
| ------------------------------- | --------------------------- |
| Online WHO lookup               | Best available source       |
| Local cache lookup              | Fast and offline            |
| Facility favourites             | Common OPD diagnoses        |
| Free-text provisional diagnosis | Allowed but not claim-ready |
| ICD-11-ready mode               | Future migration            |

## 6.3 `diagnosis_code_systems`

| Field         | Required | Example        |
| ------------- | -------: | -------------- |
| `id`          |      Yes |                |
| `code_system` |      Yes | ICD-10         |
| `source_name` |      Yes | WHO            |
| `source_url`  | Optional |                |
| `version`     |      Yes | 2019/2024/etc. |
| `active`      |      Yes |                |

## 6.4 `diagnosis_codes`

| Field            | Required |
| ---------------- | -------: |
| `id`             |      Yes |
| `code_system_id` |      Yes |
| `code`           |      Yes |
| `title`          |      Yes |
| `description`    | Optional |
| `parent_code`    | Optional |
| `chapter`        | Optional |
| `block`          | Optional |
| `active`         |      Yes |
| `search_terms`   | Optional |
| `last_synced_at` | Optional |

## 6.5 `diagnosis_synonyms`

| Field               |    Required | Example               |
| ------------------- | ----------: | --------------------- |
| `id`                |         Yes |                       |
| `diagnosis_code_id` |         Yes |                       |
| `synonym`           |         Yes | “High blood pressure” |
| `language`          |         Yes | English/Kiswahili     |
| `facility_defined`  |         Yes |                       |
| `approved_by`       | Conditional |                       |

## 6.6 `diagnosis_favourites`

| Field               | Required |
| ------------------- | -------: |
| `id`                |      Yes |
| `branch_id`         | Optional |
| `clinician_id`      | Optional |
| `diagnosis_code_id` |      Yes |
| `display_order`     |      Yes |
| `active`            |      Yes |

## 6.7 Diagnosis coding rules

| Rule                            | System behaviour                                                      |
| ------------------------------- | --------------------------------------------------------------------- |
| Free-text diagnosis only        | Allow clinical signing but mark not claim-ready if payer requires ICD |
| Claim payer requires ICD        | Block claim readiness until ICD selected                              |
| Primary diagnosis missing       | Warn/block visit closure based on visit type                          |
| Multiple diagnoses              | Require one primary                                                   |
| Chronic ICD selected            | Prompt chronic registry enrolment                                     |
| Sensitive diagnosis             | Apply sensitive-access and print/share filters                        |
| Diagnosis changed after signing | Addendum/correction required; do not silently overwrite               |
| ICD source unavailable          | Use local cache and mark source                                       |

---

# 7. Certificate legal scope and guardrails

## 7.1 Final certificate policy

The EMR should include certificates, but with controls:

```text
Certificates are clinical/legal documents.
They should be issued only by authorized users,
from an active licensed facility,
linked to a real patient encounter,
using approved templates,
with immutable numbering and audit.
```

Kenya’s Employment Act specifically links sick leave entitlement to production of a certificate of incapacity to work signed by a duly qualified medical practitioner or a person acting on that practitioner’s behalf in charge of a dispensary or medical aid centre. This supports a controlled sick-off/incapacity certificate workflow rather than casual free-text notes. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/2007/11/eng%402024-04-26))

## 7.2 Certificate types for MVP

| Certificate type                                  | MVP decision                                         | Control                                                                           |
| ------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| Sick-off / incapacity certificate                 | Allow                                                | Authorized clinician only                                                         |
| Return-to-work/school note                        | Allow                                                | Authorized clinician only                                                         |
| School clinic note                                | Allow                                                | Facility policy                                                                   |
| Attendance note                                   | Allow                                                | Reception can generate only if clinician-approved or non-clinical attendance-only |
| Procedure confirmation                            | Allow                                                | Linked to procedure                                                               |
| Immunisation record extract                       | Allow                                                | Linked to vaccine record                                                          |
| Referral letter                                   | Allow                                                | Clinician only                                                                    |
| Medical report                                    | Allow with approval                                  | Clinician/medical director review                                                 |
| Fitness certificate                               | Configure only after legal/clinical approval         | Higher risk                                                                       |
| Death certificate                                 | Exclude from MVP unless facility has lawful workflow | Requires separate legal review                                                    |
| Birth certificate                                 | Exclude from MVP                                     | Usually not small-clinic workflow                                                 |
| Driving/aviation/special occupational certificate | Exclude unless specifically licensed/approved        | Separate specialist workflow                                                      |
| Insurance medical report                          | Allow with claim template approval                   | Clinician + patient consent                                                       |

## 7.3 Certificate status lifecycle

```text
draft
pending_clinician_review
issued
cancelled
superseded
reprinted
voided_with_reason
```

## 7.4 Certificate required fields

| Field                             |                                        Required |
| --------------------------------- | ----------------------------------------------: |
| `certificate_number`              |                                             Yes |
| `certificate_type`                |                                             Yes |
| `patient_id`                      |                                             Yes |
| `visit_id`                        |                                             Yes |
| `issuing_branch_id`               |                                             Yes |
| `issuing_clinician_id`            |                                             Yes |
| `clinician_licence_snapshot`      |                                             Yes |
| `facility_licence_snapshot`       |                                             Yes |
| `issue_datetime`                  |                                             Yes |
| `start_date`                      |                                     Conditional |
| `end_date`                        |                                     Conditional |
| `reason_summary`                  | Yes, but patient-facing diagnosis can be masked |
| `restrictions_or_recommendations` |                                        Optional |
| `template_version`                |                                             Yes |
| `qr_verification_code`            |                                     Recommended |
| `status`                          |                                             Yes |
| `reprint_count`                   |                                             Yes |

## 7.5 Certificate rules

| Rule                       | System behaviour                                                                |
| -------------------------- | ------------------------------------------------------------------------------- |
| No visit                   | Block certificate                                                               |
| Clinician licence inactive | Block issue                                                                     |
| Facility licence inactive  | Block issue                                                                     |
| Backdated certificate      | Requires senior approval and reason                                             |
| Sick-off above threshold   | Requires senior/medical director approval                                       |
| Sensitive diagnosis        | Hide detailed diagnosis unless explicitly included                              |
| Attendance note            | Clearly label as attendance note, not incapacity certificate                    |
| Certificate cancellation   | Preserve original; mark cancelled with reason                                   |
| Reprint                    | Watermark/reprint count and log reason                                          |
| Employer verification      | QR/verification page shows minimal authenticity data, not full clinical details |
| Template edit              | New version required; old certificates retain old wording                       |

---

# 8. Facility-specific service packages

## 8.1 Final service package model

A clinic should not globally expose every service to every branch. Services depend on:

```text
facility licence
branch type
KMPDC/facility level
available staff cadre
equipment
lab/pharmacy capability
payer contract
business policy
clinical governance approval
```

KMPDC provides health-facility inspection checklists by facility level, which supports modelling services as facility-specific packages rather than a one-size-fits-all EMR catalogue. ([kmpdc.go.ke](https://kmpdc.go.ke/downloads/))

## 8.2 `facility_service_packages`

| Field             |    Required |
| ----------------- | ----------: |
| `id`              |         Yes |
| `branch_id`       |         Yes |
| `package_code`    |         Yes |
| `package_name`    |         Yes |
| `facility_type`   |         Yes |
| `facility_level`  |    Optional |
| `effective_from`  |         Yes |
| `effective_to`    |    Optional |
| `approval_status` |         Yes |
| `approved_by`     | Conditional |
| `status`          |         Yes |

## 8.3 `facility_service_items`

| Field                  |    Required |
| ---------------------- | ----------: |
| `id`                   |         Yes |
| `service_package_id`   |         Yes |
| `service_code`         |         Yes |
| `service_name`         |         Yes |
| `service_category`     |         Yes |
| `requires_clinician`   |         Yes |
| `requires_nurse`       |         Yes |
| `requires_lab`         |         Yes |
| `requires_pharmacy`    |         Yes |
| `requires_equipment`   |    Optional |
| `requires_preauth`     |    Optional |
| `billable_service_id`  | Conditional |
| `clinical_template_id` |    Optional |
| `claim_eligible`       |         Yes |
| `active`               |         Yes |

## 8.4 MVP service packages

### Package A: Retail clinic / outpatient basic

| Service                  | Module dependency |
| ------------------------ | ----------------- |
| Registration             | EMR               |
| Triage/vitals            | EMR               |
| General consultation     | EMR + billing     |
| Review consultation      | EMR + billing     |
| Basic prescription       | EMR + pharmacy    |
| Referral                 | EMR               |
| Sick-off/attendance note | EMR certificates  |
| Visit summary            | EMR               |

### Package B: Clinic + lab-lite

| Service                       | Module dependency              |
| ----------------------------- | ------------------------------ |
| All basic outpatient services | EMR                            |
| Malaria RDT                   | Lab-lite + billing + inventory |
| Urinalysis                    | Lab-lite                       |
| Pregnancy test                | Lab-lite                       |
| Random blood sugar            | Lab-lite                       |
| CBC/FBC                       | Lab-lite or external           |
| External lab send-out         | Lab-lite                       |

### Package C: Clinic + pharmacy

| Service                       | Module dependency        |
| ----------------------------- | ------------------------ |
| All basic outpatient services | EMR                      |
| Prescription to pharmacy      | EMR + dispensing         |
| Medicine billing              | POS                      |
| Refill plan                   | Pharmacy + communication |
| Patient medication history    | EMR + pharmacy           |

### Package D: Chronic-care clinic

| Service             | Module dependency    |
| ------------------- | -------------------- |
| Hypertension review | EMR chronic template |
| Diabetes review     | EMR + lab            |
| Asthma review       | EMR                  |
| Medication refill   | Pharmacy             |
| Follow-up reminders | Communication        |
| Chronic registry    | EMR                  |

### Package E: Minor procedures

| Service                    | Module dependency          |
| -------------------------- | -------------------------- |
| Dressing/wound care        | EMR + inventory + billing  |
| Injection administration   | EMR + inventory + pharmacy |
| Nebulization               | EMR + inventory            |
| Suturing/suture removal    | EMR + billing              |
| Procedure certificate/note | EMR                        |

### Package F: Immunisation

| Service                      | Module dependency |
| ---------------------------- | ----------------- |
| Vaccine administration       | EMR + inventory   |
| Batch/expiry record          | Inventory         |
| Cold-chain control           | Inventory         |
| Next-dose reminder           | Communication     |
| Immunisation record printout | EMR               |

## 8.5 Service activation rule

```text
RULE: Enable service
IF branch.service_package contains service
AND Module 1 facility permissions allow service
AND required staff cadre assigned and active
AND required equipment/inventory setup exists
AND billing item exists
THEN service is active
ELSE service is hidden or blocked
```

---

# 9. Claim-readiness validation

## 9.1 Visit readiness statuses

```text
clinical_draft
clinical_signed
billing_pending
claim_missing_info
claim_ready
claim_submitted
closed_no_claim
```

## 9.2 `visit_readiness_checks`

| Check                     | Required for cash visit |         Required for claim visit |
| ------------------------- | ----------------------: | -------------------------------: |
| Patient registered        |                     Yes |                              Yes |
| Visit created             |                     Yes |                              Yes |
| Clinician active/licensed |                     Yes |                              Yes |
| Vitals captured           |                 Warning | Recommended/required by template |
| Chief complaint           |                     Yes |                              Yes |
| Assessment/diagnosis      |                     Yes |                              Yes |
| ICD-10 code               |                Optional |       Required if payer requires |
| Signed note               |                     Yes |                              Yes |
| Services documented       |                     Yes |                              Yes |
| Bill lines linked         |                     Yes |                              Yes |
| Lab results verified      |             If lab done |          Required if lab claimed |
| Prescription linked       |           If prescribed |         Required if drug claimed |
| Procedure note            |            If procedure |    Required if procedure claimed |
| Referral letter           |      If referral needed |       Required if payer requires |
| Attachments               |                Optional |          Required by payer rules |
| Visit summary generated   |             Recommended |    Recommended/required by payer |

## 9.3 Claim-readiness blocker examples

| Blocker                                    | Fix                            |
| ------------------------------------------ | ------------------------------ |
| Missing primary diagnosis                  | Clinician adds diagnosis       |
| Missing ICD-10                             | Clinician/coder selects code   |
| Unsigned note                              | Clinician signs                |
| Lab claimed but result not verified        | Lab verifies result            |
| Medicine claimed but not dispensed         | Pharmacy completes dispense    |
| Procedure billed but no procedure note     | Clinician/nurse completes note |
| Referral-required service missing referral | Add referral letter            |
| Clinician licence inactive                 | Module 1 compliance correction |
| Facility service not enabled               | Module 1/package correction    |

## 9.4 Readiness API

```text
GET /visits/{id}/readiness
```

Example response:

```json
{
  "visit_id": "VIS-000123",
  "clinical_status": "clinical_signed",
  "claim_status": "claim_missing_info",
  "score": 82,
  "blockers": [
    {
      "code": "MISSING_ICD10",
      "message": "Primary diagnosis has no ICD-10 code",
      "responsible_role": "clinician"
    },
    {
      "code": "LAB_RESULT_NOT_VERIFIED",
      "message": "CBC result is pending verification",
      "responsible_role": "lab"
    }
  ],
  "warnings": [
    {
      "code": "VITALS_MISSING_SPO2",
      "message": "SpO2 was not captured"
    }
  ]
}
```

---

# 10. FHIR/interoperability mapping

## 10.1 MVP mappings

| EMR object                | FHIR resource                      |
| ------------------------- | ---------------------------------- |
| Patient                   | Patient                            |
| Guardian/next of kin      | RelatedPerson                      |
| Facility/branch           | Organization / Location            |
| Clinician                 | Practitioner / PractitionerRole    |
| Visit                     | Encounter                          |
| Vitals                    | Observation                        |
| Diagnosis/problem         | Condition                          |
| Lab order                 | ServiceRequest                     |
| Lab result                | Observation / DiagnosticReport     |
| Prescription              | MedicationRequest                  |
| Dispense result           | MedicationDispense                 |
| Procedure                 | Procedure                          |
| Referral                  | ServiceRequest / DocumentReference |
| Certificate/visit summary | DocumentReference / Composition    |
| Immunisation              | Immunization                       |
| Claim evidence            | Claim / DocumentReference, future  |

HL7 FHIR describes DiagnosticReport as a resource that provides clinical or workflow context for a set of observations, with Observation referenced to represent laboratory, imaging, and other clinical or diagnostic data. ([hl7.org](https://fhir.hl7.org/fhir/observation.html))

## 10.2 FHIR-readiness rule

```text
Every clinical object should store:
  internal ID
  patient ID
  encounter/visit ID
  author/user
  branch/facility
  timestamp
  status
  code/system where applicable
  source module
```

---

# 11. Updated EMR data model additions

## 11.1 `clinical_templates`

Already defined above.

## 11.2 `clinical_template_versions`

| Field            |
| ---------------- |
| `id`             |
| `template_id`    |
| `version_number` |
| `template_json`  |
| `approved_by`    |
| `approved_at`    |
| `effective_from` |
| `effective_to`   |
| `status`         |

## 11.3 `clinical_notes`

Add:

| Field                       | Purpose                 |
| --------------------------- | ----------------------- |
| `template_id`               | Which template was used |
| `template_version_id`       | Exact version used      |
| `note_json`                 | Structured note content |
| `copy_forward_from_note_id` | If copied               |
| `copy_forward_reviewed`     | Clinician confirmed     |
| `signed_hash`               | Tamper evidence         |
| `claim_readiness_status`    | Fast claims status      |
| `sensitive_flag`            | Access control          |
| `addendum_count`            | Corrections             |

## 11.4 `visit_readiness_results`

| Field            |
| ---------------- |
| `id`             |
| `visit_id`       |
| `readiness_type` |
| `score`          |
| `status`         |
| `blockers_json`  |
| `warnings_json`  |
| `evaluated_at`   |
| `evaluated_by`   |

## 11.5 `certificates`

Add:

| Field                             |
| --------------------------------- |
| `certificate_number`              |
| `certificate_type`                |
| `template_version_id`             |
| `clinician_licence_snapshot_json` |
| `facility_licence_snapshot_json`  |
| `qr_verification_code`            |
| `public_verification_hash`        |
| `backdated_flag`                  |
| `backdate_reason`                 |
| `approval_user_id`                |
| `diagnosis_visible_to_recipient`  |
| `reprint_count`                   |

## 11.6 `facility_service_packages`

Already defined above.

## 11.7 `diagnosis_codes`

Already defined above.

---

# 12. API endpoints to add or refine

## 12.1 Clinician workspace

| Endpoint                             | Purpose                        |
| ------------------------------------ | ------------------------------ |
| `GET /clinician/workspace/{visitId}` | Load full workspace            |
| `POST /visits/{id}/autosave-note`    | Autosave note                  |
| `POST /visits/{id}/apply-template`   | Apply template                 |
| `POST /visits/{id}/copy-forward`     | Copy previous note with review |
| `POST /clinical-notes/{id}/sign`     | Sign note                      |
| `POST /clinical-notes/{id}/addendum` | Add correction                 |

## 12.2 Templates

| Endpoint                                      | Purpose                    |
| --------------------------------------------- | -------------------------- |
| `GET /clinical-templates`                     | List templates             |
| `POST /clinical-templates`                    | Create template            |
| `POST /clinical-templates/{id}/submit-review` | Submit for clinical review |
| `POST /clinical-templates/{id}/approve`       | Approve template           |
| `POST /clinical-templates/{id}/retire`        | Retire template            |

## 12.3 Diagnosis lookup

| Endpoint                      | Purpose                     |
| ----------------------------- | --------------------------- |
| `GET /diagnosis/search?q=`    | Search local ICD cache      |
| `GET /diagnosis/favourites`   | Common diagnosis favourites |
| `POST /diagnosis/favourites`  | Add favourite               |
| `POST /diagnosis/sync-who`    | Sync/update ICD cache       |
| `POST /visits/{id}/diagnoses` | Add diagnosis               |

## 12.4 Certificates

| Endpoint                          | Purpose                       |
| --------------------------------- | ----------------------------- |
| `GET /certificate-templates`      | List allowed templates        |
| `POST /certificates`              | Create draft certificate      |
| `POST /certificates/{id}/issue`   | Issue certificate             |
| `POST /certificates/{id}/cancel`  | Cancel certificate            |
| `POST /certificates/{id}/reprint` | Reprint with reason           |
| `GET /certificates/verify/{code}` | Minimal verification endpoint |

## 12.5 Service packages

| Endpoint                                       | Purpose                    |
| ---------------------------------------------- | -------------------------- |
| `POST /facility-service-packages`              | Create package             |
| `POST /facility-service-packages/{id}/items`   | Add service                |
| `POST /facility-service-packages/{id}/approve` | Approve package            |
| `GET /branches/{id}/available-services`        | Services active for branch |
| `GET /branches/{id}/service-readiness`         | Missing requirements       |

## 12.6 Visit readiness

| Endpoint                           | Purpose              |
| ---------------------------------- | -------------------- |
| `GET /visits/{id}/readiness`       | Get readiness status |
| `POST /visits/{id}/validate-close` | Check before closure |
| `POST /visits/{id}/validate-claim` | Claim validation     |
| `POST /visits/{id}/close`          | Close visit          |

---

# 13. Final workflows

## 13.1 Fast OPD consultation

```text
1. Clinician opens patient from queue
2. Workspace loads patient summary, vitals, allergies, last visits
3. Default template opens based on visit reason
4. Clinician records complaint, history, exam, assessment, plan
5. Clinician selects diagnosis from favourites/search
6. Clinician orders lab/prescription/procedure if needed
7. System runs readiness warnings
8. Clinician signs note
9. Patient moves to lab/pharmacy/billing/follow-up
10. Visit summary is generated
```

## 13.2 Review visit

```text
1. Previous visit is shown
2. Clinician may copy forward key problems/medicines
3. Copy-forward content is marked for review
4. Clinician updates interval history, vitals, response, plan
5. Follow-up date is set
6. Note is signed
```

## 13.3 Diagnosis coding

```text
1. Clinician types diagnosis text
2. System searches local ICD cache
3. If online and enabled, WHO ICD lookup can refresh/search
4. Clinician selects diagnosis
5. System stores text + code + coding system + version
6. If free text only, visit remains clinically valid but not claim-ready where ICD is required
```

## 13.4 Certificate

```text
1. Clinician opens certificate tool from signed/draft visit
2. System checks clinician licence and facility status
3. User selects approved certificate template
4. Required fields completed
5. Backdate/long duration rules checked
6. Certificate issued with unique number and QR verification
7. PDF generated
8. Reprint/export is logged
```

## 13.5 Service package activation

```text
1. Admin selects branch
2. Admin selects package: basic clinic, lab-lite, pharmacy, chronic, procedures
3. System checks Module 1 facility and professional permissions
4. System checks required module setup: billing, lab, inventory, pharmacy
5. Missing items shown
6. Clinical lead approves service package
7. Active services appear in EMR and billing
```

---

# 14. Final validation rules

## 14.1 Note signing

```text
RULE: Sign clinical note
IF clinician.licence_status = active
AND clinician.assigned_to_branch = true
AND visit.status = active
AND required_template_fields are complete
THEN allow signing
ELSE block and show missing items
```

## 14.2 Copy-forward

```text
RULE: Copy previous note
IF user copies previous note
THEN mark copied sections
AND require clinician to confirm reviewed
AND log source note
```

## 14.3 ICD claim rule

```text
RULE: Claim diagnosis
IF visit.payer_requires_icd = true
THEN primary_diagnosis.icd_code is required
ELSE diagnosis text may be accepted clinically
```

## 14.4 Certificate

```text
RULE: Issue certificate
IF certificate.visit_id exists
AND issuing_clinician.licence_status = active
AND certificate_template.status = approved
AND facility.status = active
THEN allow issue
ELSE block
```

## 14.5 Service availability

```text
RULE: Show service in EMR
IF branch.service_package contains service
AND service.status = active
AND required_staff_and_modules are available
THEN show service
ELSE hide or show disabled with reason
```

## 14.6 Visit closure

```text
RULE: Close visit
IF note_signed = true
AND disposition selected
AND pending critical tasks = none
THEN allow close
ELSE allow close with warning or block depending facility policy
```

---

# 15. Final acceptance criteria

## 15.1 Clinician UI

| Test                       | Expected result                                  |
| -------------------------- | ------------------------------------------------ |
| Open patient from queue    | Clinician workspace loads within acceptable time |
| Patient has allergy        | Allergy visible at top of screen                 |
| Previous visits exist      | Last visits visible in left panel                |
| Use General OPD template   | SOAP fields appear                               |
| Use command `/lab malaria` | Lab order search opens                           |
| Autosave                   | Draft note is recoverable                        |
| Copy previous note         | Copied fields are marked and require review      |
| Sign note                  | Required fields checked                          |

## 15.2 Clinical templates

| Test                   | Expected result                                        |
| ---------------------- | ------------------------------------------------------ |
| Create template        | Draft template saved                                   |
| Approve template       | Approved version becomes usable                        |
| Edit approved template | New version created                                    |
| Retire template        | Not available for new visits, old notes retain version |
| Paediatric template    | Weight prompts for child                               |
| Chronic template       | Follow-up and trend fields appear                      |
| Procedure template     | Consumables and procedure note fields appear           |

## 15.3 ICD lookup

| Test                | Expected result                               |
| ------------------- | --------------------------------------------- |
| Search diagnosis    | Returns local ICD matches                     |
| Select diagnosis    | Stores text, ICD code, coding system, version |
| Free-text only      | Visit can save but claim-readiness warns      |
| ICD cache offline   | Local favourites still work                   |
| Chronic diagnosis   | Chronic enrolment prompt appears              |
| Sensitive diagnosis | Access/printing restrictions apply            |

## 15.4 Certificates

| Test                    | Expected result                                                |
| ----------------------- | -------------------------------------------------------------- |
| Issue sick-off          | Requires visit and authorized clinician                        |
| Backdate certificate    | Approval/reason required                                       |
| Reprint certificate     | Reason required and logged                                     |
| Cancel certificate      | Original retained and marked cancelled                         |
| Verify QR               | Minimal authenticity data shown                                |
| Non-authorized user     | Certificate issuance blocked                                   |
| Birth/death certificate | Not available in MVP unless configured/legal workflow approved |

## 15.5 Service packages

| Test                          | Expected result                                        |
| ----------------------------- | ------------------------------------------------------ |
| Activate basic clinic package | Consultation templates/services appear                 |
| Activate lab-lite package     | Lab orders appear only if lab setup complete           |
| Activate pharmacy package     | Prescriptions route to pharmacy                        |
| Missing lab professional      | Lab service blocked                                    |
| Missing billing item          | Service appears disabled or setup incomplete           |
| Payer contract missing        | Claim eligibility disabled but cash service can remain |
| Change package                | Audit log and approval required                        |

## 15.6 Claim readiness

| Test                                    | Expected result          |
| --------------------------------------- | ------------------------ |
| Visit missing diagnosis                 | Claim-readiness blocker  |
| Visit missing ICD when payer requires   | Claim-readiness blocker  |
| Unsigned note                           | Claim-readiness blocker  |
| Lab claim without verified result       | Claim-readiness blocker  |
| Procedure billed without procedure note | Claim-readiness blocker  |
| Drug claim without dispense             | Claim-readiness blocker  |
| All requirements met                    | Visit marked claim-ready |

---

# 16. Developer implementation sequence

## Phase 1: Clinician workspace and core EMR

Build:

```text
patient summary
visit workspace
queue integration
vitals display
clinical note draft/autosave
SOAP note signing
basic visit summary
```

## Phase 2: Template engine

Build:

```text
clinical_templates
template_sections
template_fields
template_versions
template approval workflow
MVP template seed data
```

## Phase 3: Diagnosis coding

Build:

```text
diagnosis_code_systems
diagnosis_codes
diagnosis_synonyms
diagnosis_favourites
local ICD cache
WHO ICD adapter placeholder
diagnosis selection UI
```

## Phase 4: Orders and summaries

Build:

```text
lab orders
procedure orders
prescriptions
referrals
follow-up
visit summaries
FHIR-ready internal mappings
```

## Phase 5: Certificates

Build:

```text
certificate templates
certificate issuance
QR verification
backdate/long-duration approval
reprint/cancel audit
```

## Phase 6: Facility service packages and readiness

Build:

```text
facility_service_packages
facility_service_items
branch service availability
claim-readiness checks
clinical completeness rules
```

---

# 17. Final handoff summary

Module 5 is now developer-ready with these final decisions:

| Area                      | Final state                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| Clinician UI              | Single-page speed-focused workspace defined                                                             |
| Clinical templates        | MVP templates defined and versioned                                                                     |
| ICD coding                | WHO ICD source + local cache + favourites model defined                                                 |
| Certificate scope         | MVP certificate types and guardrails defined                                                            |
| Facility service packages | Branch-specific package model defined                                                                   |
| Claim readiness           | Validation engine defined                                                                               |
| FHIR mapping              | MVP mapping defined                                                                                     |
| Developer readiness       | High for core EMR implementation                                                                        |
| Governance risk           | Template wording, certificate scope, and service packages need clinical lead approval before production |

The closed Module 5 rule is:

```text
No clinical visit should close unless the system can prove:
who the patient is,
which facility and clinician handled the visit,
what template/version was used,
what was complained of and found,
what diagnosis was made,
what orders or prescriptions were created,
what follow-up or referral was needed,
whether any certificate was issued lawfully,
whether the record is claim-ready,
and who signed the final clinical note.
```
