# Module 1: Organisation and Licensing Module

This module is the **compliance backbone** of the whole system. It answers one basic question before the system allows pharmacy, clinic, claims, or branch operations:

**Is this business, branch, facility, and responsible professional legally allowed to perform this activity?**

In Kenya, this matters because a pharmacy/chemist, clinic, and claims-enabled health facility are not licensed in the same way. PPB regulates pharmacy premises and pharmaceutical practice; KMPDC handles health facility registration; SHA pays claims to empanelled/contracted healthcare providers and facilities; professional councils maintain practitioner registers; BRS maintains business registration records; and ODPC regulates data handlers processing personal and health data. PPB says a person cannot carry on a pharmacy business in Kenya unless the premises have current approval, and the pharmacy business must meet the Pharmacy and Poisons Act framework. KMPDC’s facility registration process includes county inspection, online registration, prescribed fees, committee approval, and issuance of a registration certificate. BRS describes itself as the custodian of business registration records in Kenya. ([web.pharmacyboardkenya.org][1])

---

## 1. Purpose of the module

The Organisation and Licensing Module should:

| Purpose                             | Practical meaning                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Confirm legal identity              | Know who owns the business and under what registration                                                 |
| Confirm branch/facility legality    | Know which branch is allowed to operate as a pharmacy, clinic, lab, or shop                            |
| Confirm professional accountability | Link each regulated activity to a licensed responsible person                                          |
| Prevent illegal workflows           | Do not allow pharmacy dispensing, clinical consultation, or claims unless required licences are active |
| Manage renewals                     | Warn before licences expire                                                                            |
| Support audits                      | Produce a compliance file for PPB, KMPDC, SHA, insurers, ODPC, owners, or auditors                     |
| Support multi-branch growth         | Manage chains/franchises where each branch has different licences and staff                            |
| Support claims                      | Ensure SHA/private insurer contracts are tied to the right facility and services                       |

---

## 2. Core users

| User role                              | What they do in this module                                                       |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| Owner/director                         | Adds business registration, branches, ownership, documents                        |
| Compliance/admin officer               | Maintains licences, renewals, evidence, inspection records                        |
| Superintendent pharmacist/technologist | Confirms pharmacy responsibility for a branch                                     |
| Clinic manager                         | Maintains KMPDC/facility information                                              |
| HR/admin                               | Adds professional licences for clinicians, nurses, pharmacists, clinical officers |
| Claims officer                         | Maintains SHA/private insurer contracts                                           |
| Auditor                                | Reviews licence status, documents, expiry history, and user changes               |
| System admin                           | Configures licence types, alert rules, approval workflow                          |

---

## 3. Main data structure

The module should be built around these entities:

```text
Organisation / Legal Entity
    └── Branch / Facility / Outlet
            ├── Licences and permits
            ├── Responsible professionals
            ├── Services allowed
            ├── SHA/private insurer contracts
            ├── Documents
            ├── Renewal alerts
            └── Compliance status
```

A business may have one legal entity and many branches. Each branch may have different permissions:

| Branch example    | Required records                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Retail-only shop  | Business registration, county permit, KRA PIN, eTIMS setup                                                                    |
| Chemist/pharmacy  | Business registration, PPB premise licence, superintendent, staff licences, county permit                                     |
| Clinic only       | Business registration, KMPDC facility licence, clinician licences, SHA/private contracts if applicable                        |
| Clinic + pharmacy | Business registration, KMPDC facility licence, PPB premise licence, superintendent, clinician licences, insurer/SHA contracts |
| Chain/franchise   | Parent organisation, branch-level licences, branch-level staff, branch-level contracts                                        |

---

## 4. Detailed data fields

## A. Business registration

BRS maintains business registration records and provides online business registration services; therefore, the system should treat the business registration as the parent legal identity for branches and licences. ([Business Registration Service][2])

| Field                                     |               Type |     Required? | Notes                                                                      |
| ----------------------------------------- | -----------------: | ------------: | -------------------------------------------------------------------------- |
| Legal entity name                         |               Text |           Yes | Name as registered                                                         |
| Trading name                              |               Text |           Yes | Name displayed to customers                                                |
| Entity type                               |           Dropdown |           Yes | Sole proprietor, partnership, limited company, NGO/FBO, SACCO, trust, etc. |
| Business registration number              |               Text |           Yes | BRS/eCitizen registration number                                           |
| Certificate of registration/incorporation |        File upload |           Yes | PDF/image                                                                  |
| CR12 / official company search            |        File upload | For companies | Useful for ownership verification                                          |
| KRA PIN                                   |               Text |           Yes | Needed for tax/eTIMS/accounting                                            |
| VAT status                                |           Dropdown |           Yes | VAT registered, non-VAT, exempt, unknown                                   |
| Postal address                            |               Text |      Optional | Formal documents                                                           |
| Physical head office address              | Structured address |           Yes | County, sub-county, ward, street/building                                  |
| Business phone                            |              Phone |           Yes | Official contact                                                           |
| Business email                            |              Email |           Yes | Official contact                                                           |
| Owner/director names                      |              Table |           Yes | Include ID/passport and role                                               |
| Beneficial owner details                  |              Table |   Recommended | Useful for compliance and insurer contracts                                |
| Bank account details                      |         Structured |      Optional | Claims and supplier payments                                               |
| M-Pesa Till/Paybill                       |         Structured |      Optional | Payment setup                                                              |
| Date registered                           |               Date |           Yes | Business age                                                               |
| Status                                    |           Dropdown |           Yes | Draft, active, suspended, closed                                           |
| Verification source                       |          Text/link |      Optional | BRS/eCitizen/manual                                                        |
| Last verified date                        |               Date |   Recommended | For compliance checks                                                      |

### Business rules

| Rule                                         | System behaviour                                    |
| -------------------------------------------- | --------------------------------------------------- |
| No active branch without active legal entity | Branch remains “setup incomplete”                   |
| Legal name change                            | Requires document upload and approval               |
| KRA PIN missing                              | Allow setup, but block eTIMS activation until added |
| Company ownership document expired/outdated  | Warn admin to refresh official search               |
| Duplicate business registration number       | Block duplicate legal entity                        |

---

## B. Branches / outlets / facilities

This is the most important operational entity. A branch is the physical place where sales, dispensing, consultation, billing, and claims happen.

| Field                         |         Type |   Required? | Notes                                                         |
| ----------------------------- | -----------: | ----------: | ------------------------------------------------------------- |
| Branch name                   |         Text |         Yes | Example: AfyaCare Pharmacy - Rongai                           |
| Branch code                   |  Auto/manual |         Yes | Internal unique code                                          |
| Branch type                   | Multi-select |         Yes | Retail, pharmacy, clinic, lab, clinic+pharmacy, warehouse     |
| Ownership model               |     Dropdown |         Yes | Owned branch, franchise, partner, managed outlet              |
| Physical address              |   Structured |         Yes | County, sub-county, ward, town, estate, building              |
| GPS coordinates               |          Geo | Recommended | Helps with inspections, deliveries, branch maps               |
| Phone                         |        Phone |         Yes | Branch contact                                                |
| Email                         |        Email |    Optional | Branch contact                                                |
| Operating hours               |     Schedule |         Yes | Used for online orders/appointments                           |
| Branch manager                |   Staff link |         Yes | Accountable admin                                             |
| Services offered              | Multi-select |         Yes | Consultation, pharmacy, lab, immunisation, chronic care, etc. |
| KEPH/facility level           |     Dropdown | For clinics | Useful for SHA/KMPDC alignment                                |
| Tax invoice unit              |     Dropdown |         Yes | Which eTIMS setup applies                                     |
| Cash drawers/payment accounts |        Table |    Optional | Till/paybill/cash drawer assignment                           |
| Status                        |     Dropdown |         Yes | Setup, pending inspection, active, suspended, closed          |
| Opening date                  |         Date |    Optional | Business reporting                                            |
| Closure date                  |         Date |   If closed | Historical audit                                              |

### Branch service flags

The branch should have controlled service flags:

| Flag                                  | Meaning                              |
| ------------------------------------- | ------------------------------------ |
| `can_sell_retail_goods`               | Normal POS allowed                   |
| `can_sell_otc_medicines`              | OTC medicine sales allowed           |
| `can_dispense_prescription_medicines` | Prescription dispensing allowed      |
| `can_run_clinic_consultations`        | EMR consultations allowed            |
| `can_run_lab_tests`                   | Lab-lite/LIS workflow allowed        |
| `can_submit_claims`                   | SHA/private insurer claims allowed   |
| `can_sell_online`                     | Internet pharmacy/e-commerce enabled |
| `can_transfer_stock`                  | Branch-to-branch transfer allowed    |

These flags should not be turned on casually. They should depend on licence records.

---

## C. PPB premise licence

PPB’s portal supports new facility/premise licence applications, renewals, variation of issued licences, and download/printing of approved licences. The portal instructions also show that for a hospital premise, a current medical council licence may be attached; after approval, PPB inspection and final review occur before the licence is downloaded and displayed. ([practice.pharmacyboardkenya.org][3])

| Field                            |                    Type |        Required? | Notes                                                           |
| -------------------------------- | ----------------------: | ---------------: | --------------------------------------------------------------- |
| PPB premise licence number       |                    Text | Yes for pharmacy | Main identifier                                                 |
| PPB application/reference number |                    Text |      Recommended | Tracks pending application                                      |
| Premise category                 |                Dropdown |              Yes | Retail pharmacy, wholesale, hospital pharmacy, warehouse, etc.  |
| Premise name on licence          |                    Text |              Yes | Must match document                                             |
| Branch linked                    |             Branch link |              Yes | Licence is branch-specific                                      |
| Licence issue date               |                    Date |              Yes |                                                                 |
| Licence expiry date              |                    Date |              Yes |                                                                 |
| Licence status                   |                Dropdown |              Yes | Pending, active, renewal submitted, expired, suspended, revoked |
| Superintendent                   | Staff/professional link |              Yes | Responsible pharmacist/technologist                             |
| Regional PPB office              |           Dropdown/text |         Optional | Useful for follow-up                                            |
| Inspection date                  |                    Date |         Optional |                                                                 |
| Inspection outcome               |                Dropdown |         Optional | Passed, failed, conditional, pending                            |
| Conditions from PPB              |                    Text |         Optional | Any restrictions or notes                                       |
| Licence document                 |             File upload |              Yes | Certificate                                                     |
| Payment receipt                  |             File upload |         Optional | Renewal evidence                                                |
| Last verification date           |                    Date |      Recommended |                                                                 |
| Verification method              |                Dropdown |      Recommended | PPB portal/manual/document                                      |
| Display confirmed                |                Checkbox |      Recommended | Confirms branch printed/displayed certificate                   |
| Renewal submitted date           |                    Date |         Optional |                                                                 |
| Renewal approved date            |                    Date |         Optional |                                                                 |

### PPB business rules

| Rule                                         | System behaviour                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Branch marked as pharmacy but no PPB licence | Show “non-compliant setup”                                                                 |
| PPB licence expired                          | Block prescription dispensing or require emergency override with owner/compliance approval |
| No superintendent linked                     | Block pharmacy activation                                                                  |
| Superintendent licence expired               | Warn and optionally block dispensing                                                       |
| Licence pending inspection                   | Allow setup, block live dispensing unless admin override                                   |
| PPB variation required                       | Trigger workflow when branch address, business name, ownership, or superintendent changes  |
| Hospital pharmacy                            | Require linked clinic/facility licence record where applicable                             |

---

## D. KMPDC facility licence

KMPDC states that health facility registration involves inspection by the County Health Management Team, online registration, prescribed fees, approval by the relevant committee, and issuance of a registration certificate. KMPDC also provides quick links to search registered practitioners and registered health facilities. ([kmpdc.go.ke][4])

| Field                              |         Type |      Required? | Notes                                                 |
| ---------------------------------- | -----------: | -------------: | ----------------------------------------------------- |
| KMPDC facility registration number |         Text | Yes for clinic |                                                       |
| Facility name on certificate       |         Text |            Yes |                                                       |
| Facility type                      |     Dropdown |            Yes | Clinic, medical centre, hospital, dental clinic, etc. |
| KEPH level                         |     Dropdown |    Recommended | Important for claims and service limits               |
| Branch linked                      |  Branch link |            Yes |                                                       |
| Ownership type                     |     Dropdown |            Yes | Private, public, faith-based, NGO, company-owned      |
| County inspection date             |         Date |       Optional |                                                       |
| Inspection team/office             |         Text |       Optional |                                                       |
| Inspection result                  |     Dropdown |       Optional | Passed, failed, conditional, pending                  |
| Licence/certificate issue date     |         Date |            Yes |                                                       |
| Licence/certificate expiry date    |         Date |            Yes |                                                       |
| Services approved                  | Multi-select |            Yes | Consultation, lab, maternity, dental, imaging, etc.   |
| Beds/capacity                      |       Number |  If applicable |                                                       |
| Facility administrator             |   Staff link |            Yes |                                                       |
| Medical director/clinical lead     |   Staff link |    Recommended |                                                       |
| Certificate document               |  File upload |            Yes |                                                       |
| Payment receipt                    |  File upload |       Optional |                                                       |
| Licence status                     |     Dropdown |            Yes | Pending, active, expired, suspended, revoked          |
| Last verified date                 |         Date |    Recommended |                                                       |
| Verification method                |     Dropdown |    Recommended | KMPDC portal/manual/document                          |

### KMPDC business rules

| Rule                                         | System behaviour                                         |
| -------------------------------------------- | -------------------------------------------------------- |
| Branch marked as clinic but no KMPDC licence | Block clinical activation                                |
| Facility licence expired                     | Block new clinical visits or require compliance override |
| Service not approved                         | Prevent billing/claiming for that service                |
| KEPH level missing                           | Warn claims officer before SHA/private insurer setup     |
| Inspection failed                            | Keep facility status as “not approved”                   |
| Certificate missing                          | Compliance dashboard shows incomplete file               |

---

## E. Superintendent pharmacist / pharmaceutical technologist

PPB’s practice portal uses registration/enrolment credentials and supports premise and practice licence processes. It also indicates that a superintendent’s renewal/approval comes before non-superintendent approvals for a premise. ([practice.pharmacyboardkenya.org][3])

| Field                             |        Type |   Required? | Notes                                       |
| --------------------------------- | ----------: | ----------: | ------------------------------------------- |
| Full name                         |        Text |         Yes |                                             |
| Professional category             |    Dropdown |         Yes | Pharmacist, pharmaceutical technologist     |
| PPB registration/enrolment number |        Text |         Yes |                                             |
| National ID/passport              |        Text |         Yes |                                             |
| Phone                             |       Phone |         Yes |                                             |
| Email                             |       Email | Recommended |                                             |
| Practising licence number         |        Text |         Yes |                                             |
| Practising licence issue date     |        Date |         Yes |                                             |
| Practising licence expiry date    |        Date |         Yes |                                             |
| Licence status                    |    Dropdown |         Yes | Active, expired, suspended, pending renewal |
| Superintendent flag               |     Boolean |         Yes |                                             |
| Branch assigned                   | Branch link |         Yes |                                             |
| Appointment date                  |        Date |         Yes |                                             |
| End date                          |        Date |    Optional |                                             |
| Appointment letter                | File upload | Recommended |                                             |
| PPB licence document              | File upload |         Yes |                                             |
| Last verified date                |        Date | Recommended |                                             |
| Verification method               |    Dropdown | Recommended |                                             |

### Superintendent rules

| Rule                                                | System behaviour                                                                  |
| --------------------------------------------------- | --------------------------------------------------------------------------------- |
| No active superintendent                            | Branch pharmacy compliance status becomes red                                     |
| Superintendent licence expiring                     | Alert owner/admin and superintendent                                              |
| Superintendent removed                              | Branch pharmacy module becomes pending until replacement approved                 |
| New superintendent assigned                         | Require appointment evidence and PPB variation/approval workflow where applicable |
| User is cashier only                                | Cannot approve prescription dispensing                                            |
| User is pharmacist/technologist but licence expired | Cannot perform regulated approval unless override is configured                   |

---

## F. Clinician professional licence

For clinics, professional staff may include doctors, dentists, clinical officers, nurses, pharmacists, lab personnel, radiographers, nutritionists, counsellors, and others. The module should not assume every clinician is licensed by KMPDC. Clinical officers and nurses have their own registers. The Clinical Officers Council licence-status page states that all clinical officers practising in Kenya must be on the COC Retention Register. The Nursing Council of Kenya licence-status page states that all nurses practising in Kenya must be on the NCK Retention Register and provides licence verification. ([portal.clinicalofficerscouncil.org][5])

| Field                        |              Type |                                       Required? | Notes                                                                        |
| ---------------------------- | ----------------: | ----------------------------------------------: | ---------------------------------------------------------------------------- |
| Full name                    |              Text |                                             Yes |                                                                              |
| Staff number                 |              Text |                                             Yes |                                                                              |
| Cadre                        |          Dropdown |                                             Yes | Doctor, dentist, clinical officer, nurse, pharmacist, lab technologist, etc. |
| Regulatory council           |          Dropdown |                                             Yes | KMPDC, COC, NCK, PPB, KMLTTB, etc.                                           |
| Registration number          |              Text |                                             Yes |                                                                              |
| Practising licence number    |              Text |                                             Yes |                                                                              |
| Licence issue date           |              Date |                                             Yes |                                                                              |
| Licence expiry date          |              Date |                                             Yes |                                                                              |
| Scope/specialty              | Text/multi-select |                                     Recommended |                                                                              |
| Facility/branch assigned     |        Multi-link |                                             Yes |                                                                              |
| Employment/engagement type   |          Dropdown |                                             Yes | Full-time, part-time, visiting, locum                                        |
| Professional indemnity cover |         File/date | Recommended, required for some cadres/contracts |                                                                              |
| Licence document             |       File upload |                                             Yes |                                                                              |
| ID/passport                  |  File upload/text |                                     Recommended |                                                                              |
| Last verified date           |              Date |                                     Recommended |                                                                              |
| Verification source          |     Dropdown/link |                                     Recommended |                                                                              |
| Status                       |          Dropdown |                                             Yes | Active, expired, suspended, resigned, blocked                                |

### Clinician licence rules

| Rule                          | System behaviour                                                  |
| ----------------------------- | ----------------------------------------------------------------- |
| Licence expired               | Clinician cannot sign notes, prescriptions, lab orders, or claims |
| Cadre not allowed for service | Block activity or require senior approval                         |
| Missing professional council  | Staff cannot be activated as clinician                            |
| Visiting consultant           | Must have valid licence and approved branch assignment            |
| Staff leaves                  | Disable login, preserve historical records                        |
| Licence pending renewal       | Warn but allow only if business policy permits                    |

---

## G. SHA and private insurer contracts

SHA regulations state that the Authority pays claims to empanelled and contracted healthcare providers or facilities, continuously empanels licensed and certified providers/facilities, and onboards contracted providers into the Centralized Digital Platform. They also require contracted providers to maintain beneficiary records in accessible format and have equipment such as computers/mobile phones with working internet connection for beneficiary verification. ([Kenya Law][6])

| Field                       |             Type |               Required? | Notes                                                            |
| --------------------------- | ---------------: | ----------------------: | ---------------------------------------------------------------- |
| Payer type                  |         Dropdown |                     Yes | SHA, private insurer, employer, corporate scheme                 |
| Payer name                  |             Text |                     Yes |                                                                  |
| Contract number             |             Text |                     Yes |                                                                  |
| Provider/facility code      |             Text |                     Yes |                                                                  |
| Branch/facility linked      |      Branch link |                     Yes |                                                                  |
| KMPDC facility linked       |     Licence link | Yes for clinical claims |                                                                  |
| Contract start date         |             Date |                     Yes |                                                                  |
| Contract end date           |             Date |                     Yes |                                                                  |
| Contract status             |         Dropdown |                     Yes | Draft, active, suspended, terminated, expired                    |
| Approved benefit packages   |     Multi-select |                     Yes | Outpatient, inpatient, maternity, dental, optical, chronic, etc. |
| Service limits              | Structured table |             Recommended | By service/category                                              |
| Tariff schedule             |       File/table |                     Yes |                                                                  |
| Pre-authorisation required  |      Rules table |                     Yes |                                                                  |
| Claim submission method     |         Dropdown |                     Yes | Portal, API, email, manual                                       |
| Claim deadline rules        |      Rules table |             Recommended |                                                                  |
| Payment bank account        |       Structured |                     Yes |                                                                  |
| Contact person              |             Text |             Recommended |                                                                  |
| Contract document           |      File upload |                     Yes |                                                                  |
| Empanelment/approval letter |      File upload |             Yes for SHA |                                                                  |
| Last verification date      |             Date |             Recommended |                                                                  |

### Contract rules

| Rule                           | System behaviour                             |
| ------------------------------ | -------------------------------------------- |
| No active SHA/private contract | Cannot submit claims to that payer           |
| Contract expired               | Block claim submission                       |
| Service outside contract       | Warn or block claim                          |
| Facility licence expired       | Block claim submission                       |
| Professional licence expired   | Block provider-signed claim                  |
| Tariff missing                 | Claim cannot be priced automatically         |
| Pre-authorisation required     | Claim cannot proceed without approval number |
| Contract terminated/suspended  | Stop eligibility checks and claims           |

---

## H. ODPC / data protection registration

Health facilities and pharmacies process sensitive personal and health data. ODPC defines a data controller as an entity that collects and determines how personal data is used, and a data processor as an entity processing data on behalf of a controller. Kenya’s Data Protection registration regulations list “health administration and provision of patient care” among processing purposes requiring registration as a data controller or processor. ([ODPC][7])

Even though ODPC is not in your original table, it should be included in this module for any clinic/pharmacy system handling patient data.

| Field                           |          Type |                             Required? | Notes                                               |
| ------------------------------- | ------------: | ------------------------------------: | --------------------------------------------------- |
| ODPC registration type          |      Dropdown | Recommended/required where applicable | Controller, processor, both                         |
| ODPC certificate number         |          Text |                           Recommended |                                                     |
| Registration issue date         |          Date |                           Recommended |                                                     |
| Registration expiry date        |          Date |                           Recommended |                                                     |
| Data protection officer/contact | Staff/contact |                           Recommended |                                                     |
| Privacy notice document         |     File/link |                           Recommended |                                                     |
| Data processing purposes        |  Multi-select |                                   Yes | Patient care, billing, claims, marketing, analytics |
| Sensitive data processed        |  Multi-select |                                   Yes | Health, biometrics, ID, financial, insurance        |
| Third-party processors          |         Table |                           Recommended | Cloud host, SMS provider, claims processor          |
| Cross-border transfer           |        Yes/no |                           Recommended | Where cloud/SMS/payment providers are outside Kenya |
| Certificate document            |   File upload |                           Recommended |                                                     |
| Breach contact workflow         |        Config |                           Recommended |                                                     |

---

## 5. Recommended extra compliance records

The user table is correct, but the system should also support configurable extra permits because counties and facility types differ.

| Record                        | Applies to                        | Why useful                            |
| ----------------------------- | --------------------------------- | ------------------------------------- |
| County single business permit | Most businesses                   | Local business operation              |
| Public health permit          | Clinics/food-adjacent premises    | County public health compliance       |
| Fire safety certificate       | Clinics, larger facilities, malls | Inspection/compliance                 |
| Waste management contract     | Clinics, labs, pharmacies         | Medical/pharmaceutical waste handling |
| Radiation licence             | Imaging facilities                | X-ray/CT/radiology                    |
| Lab licence/accreditation     | Labs                              | Lab service legitimacy                |
| Signage permit                | Some counties                     | Outdoor branding                      |
| Lease agreement               | All branches                      | Proof of premises                     |
| Professional indemnity cover  | Clinicians/facilities             | Claims and liability                  |
| Insurance cover               | Facility                          | Public/professional liability         |

These should be stored using a generic **Licence/Permit Type** configuration so the product can adapt to Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, county governments, chains, and different facility levels without rewriting code.

---

## 6. Screens required

## Screen 1: Organisation profile

Shows the parent legal entity.

Sections:

1. Legal identity
2. Owners/directors
3. Tax/KRA/eTIMS readiness
4. Bank and payment accounts
5. Documents
6. Branches
7. Compliance score

Key actions:

| Button/action             | Result                              |
| ------------------------- | ----------------------------------- |
| Add business registration | Opens legal entity form             |
| Upload certificate        | Adds document to compliance file    |
| Add owner/director        | Adds accountable person             |
| Add branch                | Creates outlet/facility             |
| Verify details            | Adds verification log               |
| Generate compliance pack  | Exports documents and status report |

---

## Screen 2: Branch/facility profile

This is the operational compliance screen.

Sections:

1. Branch identity
2. Location
3. Services enabled
4. Licences
5. Responsible professionals
6. SHA/private contracts
7. Operating hours
8. Devices/payment/tax setup
9. Compliance status

The top of the screen should show:

```text
Branch: AfyaCare Rongai
Status: Active
Compliance: 86%
Pharmacy: Active
Clinic: Active
Claims: Warning - SHA contract expires in 27 days
Next action: Renew SHA contract
```

---

## Screen 3: Licence register

A searchable list of all licences.

Filters:

| Filter             | Examples                               |
| ------------------ | -------------------------------------- |
| Licence type       | PPB, KMPDC, ODPC, SHA, county permit   |
| Status             | Active, expiring, expired, suspended   |
| Branch             | Rongai, Kitengela, CBD                 |
| Expiry window      | 7, 14, 30, 60, 90 days                 |
| Responsible person | Superintendent, facility administrator |
| Document missing   | Yes/no                                 |

Columns:

| Column             |
| ------------------ |
| Licence type       |
| Licence number     |
| Branch             |
| Responsible person |
| Issue date         |
| Expiry date        |
| Days to expiry     |
| Status             |
| Last verified      |
| Next action        |

---

## Screen 4: Professional register

A searchable list of all regulated staff.

Columns:

| Column                    |
| ------------------------- |
| Name                      |
| Cadre                     |
| Council                   |
| Registration number       |
| Practising licence number |
| Branch                    |
| Role                      |
| Expiry date               |
| Status                    |
| Last verified             |
| Actions                   |

Actions:

| Action                    | Result                                    |
| ------------------------- | ----------------------------------------- |
| Assign to branch          | Links professional to branch              |
| Mark as superintendent    | Starts superintendent assignment workflow |
| Upload renewed licence    | Updates document and expiry               |
| Suspend system privileges | Disables clinical/pharmacy permissions    |
| Verify licence            | Records verification source and date      |

---

## Screen 5: Payer/contract register

For SHA and private insurers.

Columns:

| Column           |
| ---------------- |
| Payer            |
| Contract number  |
| Branch/facility  |
| Provider code    |
| Start date       |
| End date         |
| Services covered |
| Claim method     |
| Status           |
| Expiry alert     |

---

## Screen 6: Compliance dashboard

This should be the owner’s main view.

Widgets:

| Widget                    | Shows                                           |
| ------------------------- | ----------------------------------------------- |
| Branch compliance summary | Green/yellow/red status per branch              |
| Expiring licences         | Next 90 days                                    |
| Missing documents         | Missing certificates/receipts/contracts         |
| Expired professionals     | Staff who should not practise                   |
| Claim blockers            | Missing SHA/private contract requirements       |
| Pharmacy blockers         | Missing PPB/superintendent requirements         |
| Clinic blockers           | Missing KMPDC/professional licence requirements |
| Verification overdue      | Records not verified recently                   |

---

## 7. Licence status model

Every licence, permit, contract, or professional credential should use a common lifecycle.

```text
Draft
Pending submission
Submitted
Pending inspection
Approved / Active
Renewal due soon
Renewal submitted
Expired
Suspended
Revoked
Archived
```

## Status logic

| Status             | Meaning                             |
| ------------------ | ----------------------------------- |
| Draft              | Record being prepared               |
| Pending submission | Ready but not yet submitted         |
| Submitted          | Submitted to regulator/payer        |
| Pending inspection | Awaiting physical/remote inspection |
| Active             | Valid and usable                    |
| Renewal due soon   | Still valid but nearing expiry      |
| Renewal submitted  | Renewal in progress                 |
| Expired            | Validity date passed                |
| Suspended          | Temporarily not usable              |
| Revoked            | Cancelled by authority              |
| Archived           | Historical, not active              |

---

## 8. Alerts and reminders

## Alert schedule

Default alert windows:

| Time before expiry | Alert target                                    |
| ------------------ | ----------------------------------------------- |
| 90 days            | Owner, compliance officer                       |
| 60 days            | Owner, compliance officer, branch manager       |
| 30 days            | Owner, branch manager, responsible professional |
| 14 days            | Escalate to senior admin                        |
| 7 days             | Daily reminders                                 |
| Expiry day         | Critical alert                                  |
| After expiry       | Block or restrict affected workflow             |

## Alert channels

| Channel             | Use                    |
| ------------------- | ---------------------- |
| In-app notification | All users              |
| Email               | Owners/admins          |
| SMS/WhatsApp        | Critical expiry alerts |
| Dashboard badge     | Compliance dashboard   |
| Task assignment     | Renewal workflow       |

## Example alerts

```text
PPB premise licence for AfyaCare Rongai expires in 30 days.
Affected workflows: prescription dispensing, internet pharmacy orders.
Required action: upload renewal receipt or updated licence.
```

```text
Dr. Jane Mwangi’s practising licence expires in 14 days.
Affected workflows: consultation notes, prescriptions, SHA/private claims.
```

```text
SHA contract for AfyaCare Kitengela expires in 7 days.
Affected workflows: SHA eligibility checks, pre-authorisations, claim submission.
```

---

## 9. Workflow: setting up a new pharmacy branch

```text
1. Create legal entity
2. Add branch
3. Mark branch type as pharmacy
4. Upload business registration and KRA PIN
5. Add PPB premise application/licence
6. Add superintendent pharmacist/technologist
7. Upload superintendent practising licence
8. Add county/local permits
9. Record inspection status
10. Approve branch as pharmacy-active
11. Enable pharmacy POS and dispensing workflows
```

## Workflow controls

| Step                    | System control                                             |
| ----------------------- | ---------------------------------------------------------- |
| Branch marked pharmacy  | Requires PPB licence workflow                              |
| Superintendent added    | Requires PPB registration/enrolment and practising licence |
| Licence active          | Enables pharmacy stock and dispensing                      |
| Licence expired         | Blocks/restricts regulated dispensing                      |
| New superintendent      | Triggers variation/approval task                           |
| Online pharmacy enabled | Requires internet pharmacy compliance checklist            |

---

## 10. Workflow: setting up a new clinic

```text
1. Create legal entity
2. Add branch/facility
3. Mark branch type as clinic
4. Add KMPDC facility registration
5. Add facility type and KEPH level
6. Add facility administrator/clinical lead
7. Add licensed clinicians
8. Upload professional licences
9. Add approved services
10. Add SHA/private contracts if needed
11. Activate clinic workflows
```

## Clinic setup workflow controls

| Step                         | System control                                  |
| ---------------------------- | ----------------------------------------------- |
| Branch marked clinic         | Requires KMPDC licence                          |
| Consultation service enabled | Requires at least one active licensed clinician |
| Lab service enabled          | Requires lab licence/config where applicable    |
| Claim submission enabled     | Requires active payer contract                  |
| Facility licence expired     | Blocks/restricts clinical and claims workflows  |

---

## 11. Workflow: setting up SHA/private insurer claims

```text
1. Confirm branch has active facility licence
2. Add payer
3. Add contract number/provider code
4. Upload contract/empanelment letter
5. Add tariff schedule
6. Configure benefit packages
7. Configure pre-authorisation rules
8. Configure claim submission method
9. Map services and drugs to payer tariffs
10. Activate claims for that branch
```

## Claim blockers

| Blocker                        | Reason                              |
| ------------------------------ | ----------------------------------- |
| No active facility licence     | Facility may not be claim-eligible  |
| No active contract             | Payer should not receive claim      |
| No provider code               | Claim cannot be identified          |
| No tariff table                | System cannot price claim correctly |
| Clinician licence expired      | Claim may be rejected               |
| Service outside approved scope | Claim may be fraudulent or invalid  |
| Pre-authorisation missing      | Claim may be rejected               |

---

## 12. Permissions and access control

## Recommended permissions

| Permission                | Owner |        Admin | Branch manager |            Pharmacist |             Clinician |     Claims officer | Auditor |
| ------------------------- | ----: | -----------: | -------------: | --------------------: | --------------------: | -----------------: | ------: |
| View organisation         |   Yes |          Yes |        Limited |               Limited |               Limited |            Limited |     Yes |
| Edit organisation         |   Yes |          Yes |             No |                    No |                    No |                 No |      No |
| Add branch                |   Yes |          Yes |             No |                    No |                    No |                 No |      No |
| Edit branch               |   Yes |          Yes |        Limited |                    No |                    No |                 No |      No |
| Upload licence            |   Yes |          Yes |            Yes | Own/professional only | Own/professional only | Contract docs only |      No |
| Approve licence record    |   Yes |          Yes |             No |                    No |                    No |                 No |      No |
| Assign superintendent     |   Yes |          Yes |             No |                    No |                    No |                 No |      No |
| Assign clinician          |   Yes |          Yes |        Limited |                    No |                    No |                 No |      No |
| Add payer contract        |   Yes |          Yes |             No |                    No |                    No |                Yes |      No |
| View audit log            |   Yes |          Yes |             No |                    No |                    No |                 No |     Yes |
| Override compliance block |   Yes | Configurable |             No |                    No |                    No |                 No |      No |

## Important security rule

No user should be able to both:

1. Upload a licence document, and
2. Approve the same licence as verified,

unless they are a high-trust owner/admin and the action is clearly logged.

---

## 13. Document management

Each uploaded document should store:

| Metadata            | Why                                                |
| ------------------- | -------------------------------------------------- |
| Document type       | PPB licence, KMPDC certificate, SHA contract, etc. |
| Linked record       | Branch, licence, professional, contract            |
| File name           | Basic reference                                    |
| File hash           | Detect tampering/replacement                       |
| Uploaded by         | Audit                                              |
| Uploaded date       | Audit                                              |
| Version number      | Renewal history                                    |
| Issue date          | Compliance                                         |
| Expiry date         | Alerts                                             |
| Verification status | Draft, verified, rejected                          |
| Verified by         | Accountability                                     |
| Verification date   | Audit                                              |
| Notes               | Inspection comments, conditions                    |
| Visibility level    | Sensitive/non-sensitive                            |

Documents should never be overwritten silently. A renewed licence should create a new version.

---

## 14. Compliance scoring

The dashboard can calculate compliance percentage per branch.

## Example scoring model

| Requirement                                     | Weight |
| ----------------------------------------------- | -----: |
| Business registration present                   |    10% |
| Branch profile complete                         |    10% |
| KRA PIN/eTIMS setup present                     |    10% |
| PPB licence active, if pharmacy                 |    20% |
| Superintendent active, if pharmacy              |    15% |
| KMPDC licence active, if clinic                 |    20% |
| Professional licences active                    |    10% |
| SHA/private contracts active, if claims enabled |    10% |
| ODPC/data protection record present             |     5% |
| No expired critical documents                   |    10% |

Because requirements differ by business type, the denominator should change by branch type. A retail-only shop should not be penalized for missing a PPB licence unless it is configured to sell/dispense medicines.

---

## 15. Rules engine

The module should expose compliance rules to other modules.

## Example rules

```text
RULE: Pharmacy dispensing allowed
IF branch.can_dispense_prescription_medicines = true
AND branch.PPB_premise_licence.status = active
AND branch.superintendent.status = active
AND superintendent.practising_licence.status = active
THEN allow prescription dispensing
ELSE block or require approved override
```

```text
RULE: Clinic consultation allowed
IF branch.can_run_clinic_consultations = true
AND branch.KMPDC_facility_licence.status = active
AND clinician.practising_licence.status = active
THEN allow clinician to sign consultation
ELSE block signing
```

```text
RULE: Claim submission allowed
IF payer_contract.status = active
AND facility_licence.status = active
AND service is covered
AND provider_code exists
AND required pre_authorisation exists where applicable
THEN allow claim submission
ELSE return claim blocker list
```

```text
RULE: Online pharmacy allowed
IF branch.PPB_premise_licence.status = active
AND superintendent.status = active
AND internet_pharmacy_compliance_checklist = complete
THEN allow online medicine orders
ELSE online pharmacy disabled
```

---

## 16. Reports

## Compliance reports

| Report                           | Purpose                                   |
| -------------------------------- | ----------------------------------------- |
| Organisation compliance summary  | Owner overview                            |
| Branch compliance status         | See which outlets are safe to operate     |
| Expiring licences report         | Renewal planning                          |
| Expired licences report          | Risk management                           |
| Missing documents report         | File completion                           |
| Professional licence status      | HR/clinical/pharmacy compliance           |
| Superintendent assignment report | Pharmacy accountability                   |
| Facility licence report          | Clinic compliance                         |
| SHA/private contract report      | Claims readiness                          |
| Verification log report          | Audit evidence                            |
| Licence renewal history          | Shows previous certificates and timelines |
| Compliance override report       | Shows every time a block was bypassed     |

## Example branch compliance report

| Branch    | Type              | PPB    | KMPDC   | Superintendent | Clinicians | SHA      | Status  |
| --------- | ----------------- | ------ | ------- | -------------- | ---------- | -------- | ------- |
| Rongai    | Clinic + pharmacy | Active | Active  | Active         | 3 active   | Expiring | Warning |
| Kitengela | Pharmacy          | Active | N/A     | Expiring       | N/A        | N/A      | Warning |
| CBD       | Retail            | N/A    | N/A     | N/A            | N/A        | N/A      | Active  |
| Thika     | Clinic            | N/A    | Expired | N/A            | 2 active   | Active   | Blocked |

---

## 17. Database design

## Main tables

### `organisations`

| Field               |
| ------------------- |
| id                  |
| legal_name          |
| trading_name        |
| entity_type         |
| registration_number |
| kra_pin             |
| vat_status          |
| physical_address_id |
| postal_address      |
| phone               |
| email               |
| status              |
| created_at          |
| updated_at          |

### `organisation_owners`

| Field                |
| -------------------- |
| id                   |
| organisation_id      |
| full_name            |
| id_number            |
| role                 |
| ownership_percentage |
| phone                |
| email                |
| start_date           |
| end_date             |

### `branches`

| Field                  |
| ---------------------- |
| id                     |
| organisation_id        |
| branch_code            |
| branch_name            |
| branch_type            |
| ownership_model        |
| address_id             |
| gps_lat                |
| gps_lng                |
| phone                  |
| email                  |
| operating_hours_json   |
| branch_manager_user_id |
| status                 |
| opening_date           |
| closure_date           |

### `licence_types`

| Field                   |
| ----------------------- |
| id                      |
| name                    |
| regulator               |
| applies_to              |
| required_for_service    |
| default_validity_months |
| renewal_alert_days      |
| blocks_workflow         |
| configurable_rules_json |

### `licences`

| Field                 |
| --------------------- |
| id                    |
| organisation_id       |
| branch_id             |
| licence_type_id       |
| licence_number        |
| application_reference |
| issue_date            |
| expiry_date           |
| status                |
| regulator_status      |
| inspection_date       |
| inspection_result     |
| conditions            |
| verified_by           |
| verified_at           |
| verification_method   |
| notes                 |

### `professionals`

| Field                     |
| ------------------------- |
| id                        |
| full_name                 |
| cadre                     |
| council                   |
| registration_number       |
| practising_licence_number |
| licence_issue_date        |
| licence_expiry_date       |
| status                    |
| phone                     |
| email                     |
| id_number                 |
| last_verified_at          |

### `branch_professionals`

| Field                   |
| ----------------------- |
| id                      |
| branch_id               |
| professional_id         |
| role_at_branch          |
| is_superintendent       |
| is_clinical_lead        |
| start_date              |
| end_date                |
| appointment_document_id |
| status                  |

### `payer_contracts`

| Field                   |
| ----------------------- |
| id                      |
| branch_id               |
| payer_type              |
| payer_name              |
| contract_number         |
| provider_code           |
| start_date              |
| end_date                |
| status                  |
| covered_services_json   |
| tariff_schedule_id      |
| claim_submission_method |
| preauth_rules_json      |
| payment_account_id      |

### `documents`

| Field              |
| ------------------ |
| id                 |
| linked_entity_type |
| linked_entity_id   |
| document_type      |
| file_url           |
| file_hash          |
| version            |
| issue_date         |
| expiry_date        |
| uploaded_by        |
| uploaded_at        |
| verified_by        |
| verified_at        |
| status             |
| notes              |

### `compliance_alerts`

| Field              |
| ------------------ |
| id                 |
| linked_entity_type |
| linked_entity_id   |
| branch_id          |
| alert_type         |
| severity           |
| message            |
| due_date           |
| status             |
| assigned_to        |
| escalated_to       |
| created_at         |
| resolved_at        |

### `verification_logs`

| Field                |
| -------------------- |
| id                   |
| entity_type          |
| entity_id            |
| verification_source  |
| verification_result  |
| verified_by          |
| verified_at          |
| notes                |
| evidence_document_id |

---

## 18. API design

## Internal API endpoints

| Endpoint                                  | Purpose                          |
| ----------------------------------------- | -------------------------------- |
| `POST /organisations`                     | Create legal entity              |
| `GET /organisations/{id}`                 | View organisation                |
| `POST /organisations/{id}/branches`       | Add branch                       |
| `POST /branches/{id}/licences`            | Add licence                      |
| `POST /branches/{id}/professionals`       | Assign professional              |
| `POST /licences/{id}/verify`              | Mark licence verified            |
| `POST /licences/{id}/renewal`             | Start renewal                    |
| `POST /payer-contracts`                   | Add SHA/private insurer contract |
| `GET /branches/{id}/compliance-status`    | Return compliance state          |
| `GET /branches/{id}/workflow-permissions` | Return allowed/blocked workflows |
| `GET /compliance/alerts`                  | List alerts                      |
| `POST /documents`                         | Upload document                  |

## Compliance response example

```json
{
  "branch_id": "BR-001",
  "branch_name": "AfyaCare Rongai",
  "overall_status": "warning",
  "services": {
    "retail_sales": "allowed",
    "otc_sales": "allowed",
    "prescription_dispensing": "allowed",
    "clinic_consultation": "allowed",
    "sha_claims": "warning"
  },
  "blockers": [],
  "warnings": [
    {
      "type": "contract_expiry",
      "message": "SHA contract expires in 27 days",
      "action_required": "Upload renewed contract or renewal evidence"
    }
  ]
}
```

---

## 19. Integration points

## Current/practical integrations

| System            | Integration approach                                                |
| ----------------- | ------------------------------------------------------------------- |
| BRS/eCitizen      | Manual upload and verification log unless official API is available |
| PPB portal        | Manual upload/verification log unless official API is available     |
| KMPDC portal      | Manual lookup/verification log unless official API is available     |
| COC/NCK registers | Manual lookup/verification log                                      |
| SHA portal        | Contract/provider code storage; future API adapter                  |
| ODPC portal       | Registration certificate storage                                    |
| eTIMS             | Uses organisation KRA PIN and branch invoice configuration          |
| M-Pesa            | Uses branch Till/Paybill/payment account                            |
| Private insurers  | Contract/tariff/preauth/claim configuration                         |

## Design principle

Do not build the system assuming every regulator has a clean public API. Build with:

1. Manual document upload
2. Verification log
3. Source URL/reference
4. Last verified date
5. API adapter later

This makes the system usable immediately and future-proof.

---

## 20. Acceptance criteria

The module is usable when it passes these tests:

| Test                                | Expected result                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------ |
| Add a registered business           | Organisation profile created with registration, KRA PIN, owners, and documents             |
| Add a pharmacy branch               | System requires PPB licence and superintendent before pharmacy activation                  |
| Add a clinic branch                 | System requires KMPDC licence before clinic activation                                     |
| Add a clinician                     | System requires professional council, registration number, licence number, and expiry date |
| Add SHA contract                    | System links contract to facility, provider code, tariffs, and approved services           |
| Licence expiring                    | System sends alerts at configured intervals                                                |
| Licence expired                     | System blocks or restricts affected workflows                                              |
| Upload renewed licence              | System keeps old document, adds new version, updates expiry                                |
| Remove superintendent               | Pharmacy branch becomes non-compliant until replacement is added                           |
| Attempt claim with expired contract | Claim submission is blocked                                                                |
| Auditor opens branch file           | Auditor can see licence documents, verification logs, expiry history, and overrides        |
| Owner views dashboard               | Owner sees all branches and compliance status at a glance                                  |

---

## 21. MVP versus later versions

## MVP

Build these first:

| Feature                       | Reason                          |
| ----------------------------- | ------------------------------- |
| Organisation profile          | Foundation                      |
| Branch profile                | Multi-outlet support            |
| Business registration storage | Owner accountability            |
| PPB licence storage           | Pharmacy compliance             |
| KMPDC licence storage         | Clinic compliance               |
| Professional licence storage  | Staff accountability            |
| Superintendent assignment     | Pharmacy control                |
| SHA/private contract storage  | Claims eligibility              |
| Document uploads              | Evidence                        |
| Expiry alerts                 | Avoid accidental non-compliance |
| Compliance dashboard          | Owner visibility                |
| Workflow blocking rules       | Prevent illegal use             |

## Version 2

Add:

| Feature                           | Reason                             |
| --------------------------------- | ---------------------------------- |
| Regulator verification links      | Faster validation                  |
| Automated licence renewal tasks   | Better compliance workflow         |
| Digital signatures/approval chain | Stronger audit                     |
| Compliance score                  | Better owner dashboard             |
| Branch opening checklist          | Faster expansion                   |
| Inspection management             | Track regulator/county inspections |
| Contract/tariff versioning        | Better claims accuracy             |
| ODPC/data protection workflow     | Stronger privacy governance        |

## Version 3

Add:

| Feature                                 | Reason                              |
| --------------------------------------- | ----------------------------------- |
| Regulator API integrations              | Reduce manual work                  |
| Automated professional register checks  | Reduce expired-practitioner risk    |
| Multi-country licence framework         | Useful for expansion beyond Kenya   |
| AI compliance assistant                 | Suggest missing documents and risks |
| Franchise compliance portal             | Head office can monitor franchisees |
| Digital regulator-ready compliance pack | One-click audit export              |

---

## 22. Final product behaviour

The module should quietly control the rest of the software:

| Other module    | What Organisation & Licensing controls                                    |
| --------------- | ------------------------------------------------------------------------- |
| POS             | Whether branch can sell retail goods, OTC medicines, or pharmacy products |
| Pharmacy        | Whether prescription dispensing is allowed                                |
| EMR             | Whether clinic consultations are allowed                                  |
| Lab             | Whether lab services are allowed                                          |
| Claims          | Whether SHA/private insurer claims are allowed                            |
| eTIMS           | Which legal entity/KRA PIN/branch issues invoices                         |
| M-Pesa          | Which branch Till/Paybill receives money                                  |
| Online pharmacy | Whether internet medicine orders are allowed                              |
| Reporting       | Which branch/legal entity owns revenue and compliance risk                |
| User management | Which professionals can perform regulated actions                         |

The correct design is not simply “store licence files.” The module must **actively enforce licensing rules** so that the business cannot accidentally operate a pharmacy, clinic, claims process, or online medicine workflow without the required legal and professional foundation.

[1]: https://web.pharmacyboardkenya.org/download/guidelines-for-registration-and-licensing-of-premises/ "Guidelines for Registration and Licensing of premises - Pharmacy and Poisons Board"
[2]: https://brs.go.ke/ "Business Registration Service | Doing Business Made Easier"
[3]: https://practice.pharmacyboardkenya.org/ "PPB - Online Services Portal"
[4]: https://kmpdc.go.ke/registration-of-a-health-facility/ "Registration of a Health Facility – Kenya Medical Practitioners and Dentists Council"
[5]: https://portal.clinicalofficerscouncil.org/LicenseStatus "COC - Online Services Portal"
[6]: https://new.kenyalaw.org/akn/ke/act/ln/2024/49/eng%402024-03-08 "
      The Social Health Insurance Regulations
    - Kenya Law"
[7]: https://www.odpc.go.ke/ "Office of the Data Protection Commissioner (ODPC)"

## Module 1 Gap Closure: Organisation and Licensing — Developer Handoff Addendum

## Updated handoff status

| Area                      |                    Previous status |                                                                                  After this closure |
| ------------------------- | ---------------------------------: | --------------------------------------------------------------------------------------------------: |
| Completeness              |                               High |                                                                                       **Very high** |
| Developer readiness       |                        Medium-high |                                                                                            **High** |
| Accuracy confidence       | Good, pending regulator validation |                              **Good, with explicit regulator-source matrix and configurable rules** |
| Developer start readiness |                            Partial | **Ready for schema modelling, UI wireframing, rule engine, onboarding workflows, and API planning** |

Module 1 should now be treated as a **master-data + compliance-control module**, not only a document repository.

The key closure principle is:

```text
Licence types, regulators, verification sources, document rules, branch permissions, and onboarding steps must be configurable master data.
Do not hard-code Kenya compliance rules directly into business logic.
```

---

## 1. Regulatory anchor summary

The module should support these official/regulatory sources as configurable verification anchors.

| Area                           | Primary authority/source | System implication                                                                        |
| ------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------- |
| Business registration          | BRS                      | Legal entity record, registration number, business name/company details                   |
| Pharmacy premises and practice | PPB                      | Premise licence, practice licence, superintendent assignment, pharmacy service enablement |
| Health facility registration   | KMPDC                    | Clinic/facility licence, facility scope, health-facility activation                       |
| SHA contracting                | SHA                      | Claims eligibility, provider/facility code, contract status                               |
| Data protection                | ODPC                     | Controller/processor registration, DPO/contact, privacy compliance                        |
| Tax/eTIMS                      | KRA                      | KRA PIN, eTIMS readiness, invoice setup                                                   |
| Clinical officers              | COC                      | Clinical officer retention/licence verification                                           |
| Nurses                         | NCK                      | Nurse/midwife retention/licence verification                                              |
| Laboratory professionals       | KMLTTB                   | Lab professional and lab-service governance                                               |
| Private insurers               | IRA/private contracts    | Payer validity and private insurer contract setup                                         |
| Radiology/radiation services   | KNRA                     | Imaging/radiation service licensing where applicable                                      |

BRS describes itself as the sole custodian of the list of companies and information for entities registered in Kenya. PPB provides online services for practice, premise licensing, renewals, and licence status. KMPDC states that health-facility registration involves county inspection, online registration, prescribed fees, committee approval, and issuance of a registration certificate. SHA states that it facilitates healthcare services from empanelled and contracted healthcare providers and facilities. ODPC provides electronic registration for data controllers and processors. KRA states that all persons engaged in business are required to onboard eTIMS and issue electronic tax invoices. COC and NCK both provide online licence-status checks for their respective retention registers. KMLTTB states that every medical laboratory science professional practising in Kenya must be registered and licensed with KMLTTB. IRA is Kenya’s insurance regulator, and KNRA handles radiation/nuclear regulatory licensing services. ([Business Registration Service][1])

---

## 2. Final normalized model

Do **not** model every licence as a separate hard-coded table such as `ppb_licences`, `kmpdc_licences`, `odpc_certificates`, `sha_contracts`.

Instead, use a normalized model:

```text
regulators
    └── licence_types
            └── licence_instances
                    ├── documents
                    ├── verification_logs
                    ├── renewal_events
                    └── compliance_rules

professionals
    └── professional_credentials
            └── branch_professional_assignments

organisations
    └── branches
            ├── branch_service_permissions
            ├── branch_licence_requirements
            ├── payer_contracts
            └── onboarding_tasks
```

## 2.1 `regulators`

| Field                          |    Type | Required | Example                                                     |
| ------------------------------ | ------: | -------: | ----------------------------------------------------------- |
| `id`                           |    UUID |      Yes |                                                             |
| `code`                         |  String |      Yes | `PPB`, `KMPDC`, `SHA`, `ODPC`                               |
| `name`                         |  String |      Yes | Pharmacy and Poisons Board                                  |
| `country_code`                 |  String |      Yes | `KE`                                                        |
| `regulator_type`               |    Enum |      Yes | `health_professional`, `facility`, `tax`, `data_protection` |
| `website_url`                  |  String | Optional |                                                             |
| `portal_url`                   |  String | Optional |                                                             |
| `verification_url`             |  String | Optional |                                                             |
| `supports_manual_verification` | Boolean |      Yes | `true`                                                      |
| `supports_api_verification`    | Boolean |      Yes | `false` initially                                           |
| `active`                       | Boolean |      Yes |                                                             |

## 2.2 `licence_types`

| Field                               |       Type | Required | Example                                                                     |
| ----------------------------------- | ---------: | -------: | --------------------------------------------------------------------------- |
| `id`                                |       UUID |      Yes |                                                                             |
| `code`                              |     String |      Yes | `PPB_PREMISE_RETAIL_PHARMACY`                                               |
| `name`                              |     String |      Yes | PPB Retail Pharmacy Premise Licence                                         |
| `regulator_id`                      |         FK |      Yes | PPB                                                                         |
| `licence_class`                     |       Enum |      Yes | `premise`, `facility`, `professional`, `contract`, `tax`, `data_protection` |
| `applies_to_entity`                 |       Enum |      Yes | `organisation`, `branch`, `professional`, `payer_contract`                  |
| `required_for_services`             | JSON array |      Yes | `["prescription_dispensing","otc_sale"]`                                    |
| `blocks_workflow`                   |    Boolean |      Yes | `true`                                                                      |
| `renewable`                         |    Boolean |      Yes |                                                                             |
| `has_expiry`                        |    Boolean |      Yes |                                                                             |
| `default_alert_days`                | JSON array |      Yes | `[90,60,30,14,7,0]`                                                         |
| `verification_method_default`       |       Enum |      Yes | `portal_manual`, `document_manual`, `api`                                   |
| `document_required`                 |    Boolean |      Yes |                                                                             |
| `requires_responsible_professional` |    Boolean |      Yes |                                                                             |
| `active`                            |    Boolean |      Yes |                                                                             |

## 2.3 `licence_instances`

| Field                   |     Type |             Required | Example                                  |
| ----------------------- | -------: | -------------------: | ---------------------------------------- |
| `id`                    |     UUID |                  Yes |                                          |
| `licence_type_id`       |       FK |                  Yes |                                          |
| `organisation_id`       |       FK |          Conditional |                                          |
| `branch_id`             |       FK |          Conditional |                                          |
| `professional_id`       |       FK |          Conditional |                                          |
| `payer_contract_id`     |       FK |          Conditional |                                          |
| `licence_number`        |   String | Yes where applicable |                                          |
| `application_reference` |   String |             Optional |                                          |
| `name_on_document`      |   String |                  Yes |                                          |
| `issue_date`            |     Date |          Conditional |                                          |
| `expiry_date`           |     Date |          Conditional |                                          |
| `status`                |     Enum |                  Yes | `active`, `expired`, `suspended`         |
| `verification_status`   |     Enum |                  Yes | `unverified`, `verified`, `rejected`     |
| `last_verified_at`      | DateTime |             Optional |                                          |
| `verified_by`           |  FK user |             Optional |                                          |
| `verification_source`   |     Enum |             Optional | `portal`, `document`, `regulator_letter` |
| `conditions_json`       |     JSON |             Optional |                                          |
| `metadata_json`         |     JSON |             Optional | Regulator-specific fields                |
| `created_by`            |  FK user |                  Yes |                                          |
| `created_at`            | DateTime |                  Yes |                                          |
| `updated_at`            | DateTime |                  Yes |                                          |

## 2.4 `branch_service_permissions`

This is the table that turns compliance into system behaviour.

| Field                     |     Type | Required | Example                                     |
| ------------------------- | -------: | -------: | ------------------------------------------- |
| `id`                      |     UUID |      Yes |                                             |
| `branch_id`               |       FK |      Yes |                                             |
| `service_code`            |     Enum |      Yes | `prescription_dispensing`                   |
| `requested_enabled`       |  Boolean |      Yes | User wants it enabled                       |
| `system_allowed`          |  Boolean |      Yes | Compliance engine result                    |
| `manual_override_allowed` |  Boolean |      Yes |                                             |
| `override_status`         |     Enum | Optional | `none`, `pending`, `approved`, `rejected`   |
| `effective_status`        |     Enum |      Yes | `enabled`, `blocked`, `warning`, `disabled` |
| `block_reason_json`       |     JSON | Optional | Missing PPB licence                         |
| `last_evaluated_at`       | DateTime |      Yes |                                             |

---

## 3. Final controlled enums

These should be implemented as database-backed master data where possible, not only code enums.

## 3.1 `legal_entity_type`

```text
sole_proprietor
business_name
partnership
limited_liability_partnership
private_limited_company
public_limited_company
ngo
faith_based_organisation
sacco
trust
county_public_facility
national_public_facility
other
```

## 3.2 `branch_type`

```text
retail_shop
chemist
retail_pharmacy
wholesale_pharmacy
clinic
medical_centre
clinic_with_pharmacy
clinic_with_lab
hospital_pharmacy
laboratory
imaging_centre
warehouse
head_office
online_pharmacy_fulfilment_point
other
```

## 3.3 `service_code`

```text
retail_sales
otc_medicine_sales
prescription_dispensing
controlled_medicine_handling
internet_pharmacy
clinic_consultation
triage
minor_procedure
lab_testing
external_lab_sendout
immunisation
imaging
claims_submission
sha_claims
private_insurer_claims
m_pesa_collections
etims_invoicing
stock_receiving
stock_transfer
cold_chain_storage
```

## 3.4 `licence_class`

```text
business_registration
tax
county_permit
premise
facility
professional
practice
contract
empanelment
data_protection
insurance
radiation
laboratory
waste_management
fire_safety
lease_or_premise_document
other
```

## 3.5 `licence_status`

```text
draft
pending_submission
submitted
pending_inspection
pending_payment
active
renewal_due_soon
renewal_submitted
expired
suspended
revoked
rejected
cancelled
archived
```

## 3.6 `verification_status`

```text
not_required
unverified
pending_verification
verified
verification_failed
needs_reverification
source_unavailable
```

## 3.7 `document_status`

```text
draft
uploaded
pending_review
verified
rejected
superseded
expired
archived
deleted_soft
legal_hold
```

## 3.8 `professional_cadre`

```text
pharmacist
pharmaceutical_technologist
medical_doctor
dentist
clinical_officer
nurse
midwife
laboratory_technologist
laboratory_technician
radiographer
nutritionist
counsellor
physiotherapist
health_records_officer
other
```

## 3.9 `professional_regulator_code`

```text
PPB
KMPDC
COC
NCK
KMLTTB
KNRA
other
```

## 3.10 `contract_status`

```text
draft
pending_signature
active
suspended
expired
terminated
renewal_under_review
archived
```

## 3.11 `onboarding_status`

```text
not_started
in_progress
blocked
pending_external_approval
pending_internal_approval
ready_for_activation
active
rejected
closed
```

## 3.12 `compliance_severity`

```text
info
warning
major
critical
blocking
```

---

## 4. Normalized licence-type catalogue v1

This is the first developer-ready catalogue. It should be loaded through seed data and editable by super-admin/compliance roles.

| Code                            | Name                                                    | Regulator/source      | Applies to            | Required when                                   |               Blocks workflow? | Verification source                               |
| ------------------------------- | ------------------------------------------------------- | --------------------- | --------------------- | ----------------------------------------------- | -----------------------------: | ------------------------------------------------- |
| `BRS_BUSINESS_REGISTRATION`     | Business registration certificate                       | BRS                   | Organisation          | Any business setup                              |             Yes for activation | BRS/eCitizen document/manual search               |
| `KRA_PIN`                       | KRA PIN certificate                                     | KRA                   | Organisation          | Tax, eTIMS, invoicing                           |                  Yes for eTIMS | KRA/iTax document/manual                          |
| `KRA_ETIMS_ONBOARDING`          | eTIMS onboarding/configuration                          | KRA                   | Organisation/branch   | Any branch issuing invoices                     |             Yes for live eTIMS | KRA/eTIMS portal/API/manual                       |
| `COUNTY_BUSINESS_PERMIT`        | County single/unified business permit                   | County government     | Branch                | Any physical branch                             |     Warning/block configurable | County portal/manual                              |
| `PPB_PREMISE_RETAIL_PHARMACY`   | PPB retail pharmacy premise licence                     | PPB                   | Branch                | Retail pharmacy/chemist                         |                            Yes | PPB portal/licence document                       |
| `PPB_PREMISE_WHOLESALE`         | PPB wholesale premise licence                           | PPB                   | Branch                | Wholesale pharmacy                              |                            Yes | PPB portal/licence document                       |
| `PPB_HOSPITAL_PHARMACY`         | PPB hospital pharmacy premise licence                   | PPB                   | Branch                | Clinic/hospital pharmacy                        |                            Yes | PPB portal/licence document                       |
| `PPB_INTERNET_PHARMACY`         | Internet pharmacy compliance approval/checklist         | PPB                   | Branch                | Online medicine orders                          |                            Yes | PPB guidance/manual approval                      |
| `PPB_PRACTICE_LICENCE`          | Pharmacist/pharmaceutical technologist practice licence | PPB                   | Professional          | Pharmacy approval/dispensing                    |                            Yes | PPB practice portal/licence status                |
| `PPB_SUPERINTENDENT_ASSIGNMENT` | Superintendent appointment/assignment                   | PPB/internal          | Branch + professional | Pharmacy branch                                 |                            Yes | Appointment evidence + PPB renewal/premise record |
| `KMPDC_FACILITY_REGISTRATION`   | Health facility registration certificate                | KMPDC                 | Branch                | Clinic/medical centre                           |                            Yes | KMPDC portal/certificate                          |
| `KMPDC_PRACTITIONER_LICENCE`    | Doctor/dentist practice licence                         | KMPDC                 | Professional          | Medical/dental consultations                    |                Yes for signing | KMPDC portal/manual                               |
| `COC_PRACTICE_LICENCE`          | Clinical officer licence/retention                      | COC                   | Professional          | Clinical officer consultations                  |                Yes for signing | COC licence-status portal                         |
| `NCK_RETENTION_LICENCE`         | Nurse/midwife practice/retention licence                | NCK                   | Professional          | Nursing/triage/procedures                       | Yes for assigned nursing scope | NCK licence-status portal                         |
| `KMLTTB_PROFESSIONAL_LICENCE`   | Lab professional licence                                | KMLTTB                | Professional          | Result entry/verification                       |       Yes for lab verification | KMLTTB portal/document                            |
| `KMLTTB_LAB_FACILITY`           | Medical laboratory facility registration/licence        | KMLTTB                | Branch                | In-house lab testing                            |            Yes for lab service | KMLTTB/eCitizen/document                          |
| `SHA_EMPANELMENT_CONTRACT`      | SHA empanelment/contract                                | SHA                   | Branch/contract       | SHA claims                                      |             Yes for SHA claims | SHA portal/contract/letter                        |
| `PRIVATE_INSURER_CONTRACT`      | Private insurer contract                                | Insurer/IRA context   | Branch/contract       | Private insurer claims                          |             Yes for that payer | Contract document/payer portal                    |
| `ODPC_CONTROLLER_REGISTRATION`  | ODPC data controller registration                       | ODPC                  | Organisation          | Patient/health data processing where applicable |     Warning/block configurable | ODPC portal/certificate                           |
| `ODPC_PROCESSOR_REGISTRATION`   | ODPC data processor registration                        | ODPC                  | Organisation/vendor   | Processing for others                           |     Warning/block configurable | ODPC portal/certificate                           |
| `KNRA_RADIATION_LICENCE`        | Radiation/imaging licence                               | KNRA                  | Branch/equipment      | X-ray/radiology services                        |                Yes for imaging | KNRA/eCitizen/document                            |
| `WASTE_MANAGEMENT_CONTRACT`     | Medical/pharmaceutical waste contract                   | County/NEMA/vendor    | Branch                | Clinic/lab/pharmacy waste                       |     Warning/block configurable | Contract/document                                 |
| `FIRE_SAFETY_CERTIFICATE`       | Fire safety certificate                                 | County/fire authority | Branch                | Physical premises                               |           Warning configurable | Certificate/manual                                |
| `PUBLIC_HEALTH_CERTIFICATE`     | Public health certificate                               | County public health  | Branch                | County/facility-specific                        |           Warning configurable | Certificate/manual                                |
| `LEASE_AGREEMENT`               | Lease/tenancy document                                  | Landlord/internal     | Branch                | Physical branch                                 |                        Warning | Document                                          |
| `PROFESSIONAL_INDEMNITY`        | Professional/facility indemnity cover                   | Insurer/internal      | Professional/facility | Clinics, claims, contracts                      |     Warning/block configurable | Policy document                                   |

PPB’s online practice procedures describe premise and practice licence renewal through the PPB practice portal, including superintendent selection and document/payment steps. KMPDC’s health-facility pages state that private, community, and faith-based health facilities are registered and issued certificates by the Council. SHA’s regulations require empanelment/contracting and provider records for claims processing. COC and NCK both expose licence-status search pages for their respective professionals. KMLTTB provides professional licensure information for medical laboratory science professionals. KRA states all persons engaged in business must onboard eTIMS and issue electronic tax invoices. ([Pharmacy and Poisons Board][2])

---

## 5. Exact regulator/source verification matrix

This closes the “exact regulator/source verification matrix” gap.

| Record                     | Verify against                            | How to verify in MVP                               | Evidence to store                                                    | Verification cadence                                  | Blocks                         |
| -------------------------- | ----------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------ |
| Business registration      | BRS/eCitizen                              | Manual document upload + official search/reference | Certificate, CR12/company search where applicable, verification note | On setup, ownership/name change, annually             | Organisation activation        |
| KRA PIN                    | KRA/iTax                                  | Manual certificate upload                          | KRA PIN certificate, screenshot/reference                            | On setup, PIN change                                  | eTIMS setup                    |
| eTIMS onboarding           | KRA/eTIMS                                 | Manual/API status when available                   | eTIMS configuration, device/API status                               | On setup, integration change, daily invoice checks    | Invoice submission             |
| County permit              | County portal/revenue office              | Manual upload                                      | County permit, receipt                                               | Annual/expiry-based                                   | Branch activation configurable |
| PPB premise licence        | PPB practice portal/licence document      | Manual licence upload + portal status/reference    | Premise licence, receipt, inspection/approval notes                  | On setup, renewal, superintendent/address/name change | Pharmacy services              |
| PPB practice licence       | PPB practice portal/licence status        | Manual/portal verification                         | Practice licence, licence status evidence                            | On setup, expiry alert, renewal                       | Pharmacist approval/dispensing |
| Superintendent assignment  | PPB premise record + internal appointment | Manual                                             | Appointment letter, PPB/premise evidence                             | On appointment/change/renewal                         | Pharmacy branch activation     |
| KMPDC facility certificate | KMPDC portal/certificate                  | Manual upload + portal reference                   | Registration certificate, inspection evidence                        | On setup, renewal/expiry                              | Clinic services                |
| KMPDC practitioner         | KMPDC portal/manual                       | Manual                                             | Practice licence/status evidence                                     | On setup, expiry, renewal                             | Doctor/dentist signatures      |
| COC clinical officer       | COC licence-status page                   | Manual status lookup                               | Status screenshot/reference, licence document                        | On setup, expiry, renewal                             | Clinical officer signatures    |
| NCK nurse/midwife          | NCK licence-status page                   | Manual status lookup                               | Status screenshot/reference, licence document                        | On setup, expiry, renewal                             | Nursing/procedure scope        |
| KMLTTB professional        | KMLTTB/eCitizen/document                  | Manual                                             | Licence document/status evidence                                     | On setup, expiry, renewal                             | Lab result verification        |
| KMLTTB lab facility        | KMLTTB/eCitizen/document                  | Manual                                             | Lab licence/certificate, inspection notes                            | On setup, expiry, service change                      | Lab services                   |
| SHA contract               | SHA/provider portal/contract              | Manual initially                                   | Empanelment/contract letter, provider code, tariff                   | On setup, renewal, tariff change                      | SHA claims                     |
| Private insurer contract   | Payer contract/portal                     | Manual                                             | Signed contract, tariff, provider code                               | On setup, renewal, tariff change                      | That payer’s claims            |
| ODPC controller/processor  | ODPC portal/certificate                   | Manual                                             | ODPC certificate, privacy notice, DPO contact                        | On setup, renewal, processing change                  | Warning/block configurable     |
| KNRA radiation licence     | KNRA/eCitizen/document                    | Manual                                             | Licence/certificate, equipment details                               | On setup, renewal, equipment change                   | Imaging/radiation services     |
| Waste contract             | Vendor/county/internal                    | Manual                                             | Contract, disposal certificates                                      | On setup, renewal                                     | Warning/block configurable     |
| Fire safety                | County/fire authority                     | Manual                                             | Certificate                                                          | On setup, renewal                                     | Warning configurable           |
| Public health certificate  | County public health                      | Manual                                             | Certificate                                                          | On setup, renewal                                     | Warning configurable           |
| Lease                      | Landlord/internal                         | Manual                                             | Lease, rent/occupation evidence                                      | On setup, renewal, branch move                        | Warning                        |

## Verification log required fields

Every verification action should create a record.

| Field                     |    Required |
| ------------------------- | ----------: |
| `entity_type`             |         Yes |
| `entity_id`               |         Yes |
| `verification_source`     |         Yes |
| `source_url_or_reference` | Recommended |
| `source_checked_at`       |         Yes |
| `verified_by`             |         Yes |
| `verification_result`     |         Yes |
| `matched_fields_json`     |         Yes |
| `mismatched_fields_json`  |    Optional |
| `evidence_document_id`    |    Optional |
| `notes`                   |    Optional |
| `next_reverification_due` |    Optional |

## Verification result enum

```text
verified_match
verified_with_warning
not_found
expired
name_mismatch
branch_mismatch
professional_mismatch
document_unreadable
source_unavailable
manual_override
```

---

## 6. Branch onboarding workflows

This closes the “workflow diagrams for branch onboarding” gap.

## 6.1 Common onboarding workflow

```text
START
  ↓
Create organisation/legal entity
  ↓
Add business registration + KRA PIN
  ↓
Create branch profile
  ↓
Select branch type
  ↓
System generates required licence checklist
  ↓
Upload documents and assign responsible staff
  ↓
Compliance officer verifies records
  ↓
System evaluates branch service permissions
  ↓
Branch becomes:
    - Active
    - Active with warnings
    - Blocked
  ↓
Enable allowed modules only
END
```

## 6.2 Retail-only shop onboarding

```text
Create organisation
  ↓
Add BRS/business registration
  ↓
Add KRA PIN
  ↓
Add branch
  ↓
Select branch_type = retail_shop
  ↓
Add county business permit
  ↓
Configure eTIMS branch setup
  ↓
Configure M-Pesa/cash/card accounts
  ↓
Enable:
    retail_sales
    etims_invoicing
    m_pesa_collections
  ↓
Block:
    prescription_dispensing
    clinic_consultation
    lab_testing
    claims_submission
```

## 6.3 Pharmacy/chemist onboarding

```text
Create organisation
  ↓
Add BRS + KRA PIN
  ↓
Add branch
  ↓
Select branch_type = retail_pharmacy / chemist
  ↓
Add PPB premise licence/application
  ↓
Add superintendent pharmacist/technologist
  ↓
Verify superintendent PPB practice licence
  ↓
Add county permit
  ↓
Configure eTIMS + payment accounts
  ↓
Compliance review
  ↓
If PPB licence active AND superintendent active:
    Enable OTC medicine sales
    Enable prescription dispensing
    Enable pharmacy stock receiving
  ↓
If controlled medicine permission configured:
    Enable controlled medicine handling
  ↓
If internet pharmacy checklist complete:
    Enable online pharmacy workflow
```

## 6.4 Clinic onboarding

```text
Create organisation
  ↓
Add BRS + KRA PIN
  ↓
Add branch
  ↓
Select branch_type = clinic / medical_centre
  ↓
Add KMPDC facility registration
  ↓
Add facility level/type and approved services
  ↓
Assign clinical lead / facility administrator
  ↓
Add licensed clinicians
  ↓
Verify professional licences
  ↓
Configure consultation/service catalogue
  ↓
Configure eTIMS + payments
  ↓
If facility licence active AND clinician licence active:
    Enable registration
    Enable appointments/queue
    Enable triage
    Enable consultation
    Enable prescriptions
```

## 6.5 Clinic + pharmacy onboarding

```text
Create organisation
  ↓
Add branch
  ↓
Select branch_type = clinic_with_pharmacy
  ↓
Complete clinic checklist:
    KMPDC facility certificate
    clinicians
    services
  ↓
Complete pharmacy checklist:
    PPB premise licence
    superintendent
    PPB practice licence
  ↓
Configure shared patient ID
  ↓
Configure EMR-to-pharmacy prescription route
  ↓
Configure billing/eTIMS/payment
  ↓
Enable only validated workflows:
    clinic_consultation
    prescription_creation
    pharmacy_dispensing
    medicine_billing
    claims_submission if contract exists
```

## 6.6 Clinic + lab onboarding

```text
Create branch
  ↓
Select branch_type = clinic_with_lab
  ↓
Complete KMPDC facility checklist
  ↓
Complete KMLTTB lab checklist
  ↓
Assign lab in-charge
  ↓
Verify lab professional licence
  ↓
Configure test catalogue
  ↓
Configure billing and inventory consumables
  ↓
Enable:
    lab_ordering
    sample_collection
    result_entry
    result_verification
```

## 6.7 SHA/private insurer claims onboarding

```text
Branch must already be clinic/health facility active
  ↓
Add payer
  ↓
Add scheme/contract
  ↓
Add provider/facility code
  ↓
Upload contract/empanelment letter
  ↓
Upload tariff table
  ↓
Configure covered services
  ↓
Configure pre-auth rules
  ↓
Configure required attachments
  ↓
Validate clinician/facility requirements
  ↓
Enable claims_submission for that payer only
```

---

## 7. Branch service permission rules

These rules should be evaluated whenever a licence, staff assignment, contract, or branch setting changes.

## 7.1 Retail sales

```text
ALLOW retail_sales
IF organisation.status = active
AND branch.status IN [active, active_with_warning]
AND branch_type IN [retail_shop, chemist, retail_pharmacy, clinic_with_pharmacy]
AND KRA_PIN exists
```

## 7.2 eTIMS invoicing

```text
ALLOW etims_invoicing
IF organisation.KRA_PIN exists
AND branch.etims_config.status IN [active, manual_mode_allowed]
```

## 7.3 OTC medicine sales

```text
ALLOW otc_medicine_sales
IF branch.PPB_premise_licence.status = active
AND branch.superintendent_assignment.status = active
AND superintendent.PPB_practice_licence.status = active
```

## 7.4 Prescription dispensing

```text
ALLOW prescription_dispensing
IF otc_medicine_sales = allowed
AND branch.service_permission.prescription_dispensing.requested_enabled = true
AND at least one active pharmacy professional assigned to branch
```

## 7.5 Clinic consultation

```text
ALLOW clinic_consultation
IF branch.KMPDC_facility_licence.status = active
AND at least one active clinician assigned to branch
AND clinician.professional_licence.status = active
```

## 7.6 Lab testing

```text
ALLOW lab_testing
IF branch.KMPDC_facility_licence.status = active
AND branch.KMLTTB_lab_facility.status = active
AND at least one active lab professional assigned
```

## 7.7 Claims submission

```text
ALLOW claims_submission FOR payer
IF branch.KMPDC_facility_licence.status = active
AND payer_contract.status = active
AND provider_code exists
AND tariff_table.status = active
```

## 7.8 Imaging/radiology

```text
ALLOW imaging
IF branch.KMPDC_facility_licence.status = active
AND branch.KNRA_radiation_licence.status = active
AND assigned radiology professional/equipment records are active
```

---

## 8. Document retention and versioning policy

This closes the “document retention/versioning policy” gap.

## 8.1 Document versioning rules

| Rule                             | Requirement                                                |
| -------------------------------- | ---------------------------------------------------------- |
| No silent overwrite              | New upload creates a new version                           |
| Old versions retained            | Superseded documents remain accessible to authorized users |
| Verification is version-specific | Verifying version 2 does not verify version 3              |
| File hash required               | Store SHA-256 or equivalent file hash                      |
| Rejection preserves file         | Rejected documents are kept with reason                    |
| Expired documents preserved      | Expired documents remain in historical file                |
| Legal hold blocks deletion       | Any investigation/audit flag prevents deletion             |
| Every view/export logged         | Especially sensitive licences, contracts, staff IDs        |
| Document status changes audited  | Old/new status, user, reason                               |

## 8.2 Document metadata

| Field                   |    Required |
| ----------------------- | ----------: |
| `document_type`         |         Yes |
| `linked_entity_type`    |         Yes |
| `linked_entity_id`      |         Yes |
| `file_name`             |         Yes |
| `file_mime_type`        |         Yes |
| `file_size`             |         Yes |
| `file_hash`             |         Yes |
| `version_number`        |         Yes |
| `issue_date`            | Conditional |
| `expiry_date`           | Conditional |
| `uploaded_by`           |         Yes |
| `uploaded_at`           |         Yes |
| `verified_by`           | Conditional |
| `verified_at`           | Conditional |
| `status`                |         Yes |
| `visibility_class`      |         Yes |
| `retention_policy_code` |         Yes |
| `legal_hold`            |         Yes |
| `notes`                 |    Optional |

## 8.3 Visibility classes

```text
public_business
internal_business
confidential_business
sensitive_professional
sensitive_health_admin
sensitive_contract
identity_document
data_protection_document
```

## 8.4 Retention policy codes

These are implementation defaults. They should be configurable per customer and validated before go-live.

| Policy code                     | Applies to                                     | Default retention               |
| ------------------------------- | ---------------------------------------------- | ------------------------------- |
| `ORG_LIFETIME_PLUS_7`           | Business registration, ownership records       | Organisation lifetime + 7 years |
| `BRANCH_LIFETIME_PLUS_7`        | Branch licences, county permits, lease records | Branch lifetime + 7 years       |
| `LICENCE_HISTORY_PLUS_7`        | Superseded/expired licences                    | Expiry/supersession + 7 years   |
| `CONTRACT_END_PLUS_7`           | SHA/private insurer contracts                  | Contract end + 7 years          |
| `PROF_ASSIGNMENT_PLUS_7`        | Professional assignment records                | Assignment end + 7 years        |
| `AUDIT_LOG_7`                   | Compliance and verification logs               | Minimum 7 years                 |
| `DATA_PROTECTION_ACTIVE_PLUS_7` | ODPC, DPO, privacy governance docs             | Active period + 7 years         |
| `LEGAL_HOLD_INDEFINITE`         | Any investigation, dispute, audit hold         | Until legal hold removed        |

## 8.5 Deletion policy

The system should not hard-delete compliance documents through the normal UI.

```text
User action: Archive
System action: Soft-delete only if retention expired and no legal hold
Admin action: Permanent purge only through controlled backend archival process
Audit: Always retained
```

---

## 9. Master-data setup screens

This closes the “master-data setup screens” gap.

## 9.1 Regulator setup screen

Used by super-admin/compliance admin.

Sections:

| Section            | Fields                              |
| ------------------ | ----------------------------------- |
| Regulator identity | Code, name, country, regulator type |
| URLs               | Website, portal, verification page  |
| Verification       | Manual/API/source unavailable       |
| Document rules     | Required evidence types             |
| Status             | Active/inactive                     |
| Notes              | Internal guidance                   |

Actions:

```text
Create regulator
Edit regulator
Deactivate regulator
Add verification source
View linked licence types
```

---

## 9.2 Licence-type setup screen

Sections:

| Section            | Fields                                               |
| ------------------ | ---------------------------------------------------- |
| Basic details      | Code, name, regulator, class                         |
| Scope              | Applies to organisation/branch/professional/contract |
| Requirements       | Required for which service codes                     |
| Blocking rules     | Blocks workflow? Warning only?                       |
| Dates              | Has issue date, has expiry date                      |
| Renewal            | Alert days, renewal allowed                          |
| Documents          | Required document types                              |
| Verification       | Default method, source URL                           |
| Responsible person | Requires professional assignment?                    |
| Status             | Active/inactive                                      |

Actions:

```text
Create licence type
Map to service permission
Set alert schedule
Set workflow blocking level
Set required documents
Deactivate licence type
```

---

## 9.3 Service-permission setup screen

Sections:

| Section                     | Fields                          |
| --------------------------- | ------------------------------- |
| Service                     | Code, name, description         |
| Module controlled           | POS, pharmacy, EMR, lab, claims |
| Required licences           | Licence types                   |
| Required professional roles | Cadres                          |
| Required contracts          | Payer contract rules            |
| Blocking level              | Block/warn/manual override      |
| Override rules              | Who can approve override        |
| Status                      | Active/inactive                 |

Example:

```text
Service: prescription_dispensing
Required:
  PPB_PREMISE_RETAIL_PHARMACY active
  PPB_SUPERINTENDENT_ASSIGNMENT active
  PPB_PRACTICE_LICENCE active
Blocks:
  Pharmacy dispensing
  POS sale of prescription-only medicines
```

---

## 9.4 Document-type setup screen

Sections:

| Section           | Fields                                                |
| ----------------- | ----------------------------------------------------- |
| Document type     | Code, name                                            |
| Applies to        | Organisation, branch, licence, professional, contract |
| Required metadata | Issue date, expiry date, number                       |
| Visibility        | Public/internal/confidential/sensitive                |
| Retention         | Policy code                                           |
| Verification      | Required/not required                                 |
| File rules        | PDF/image, max size                                   |
| Status            | Active/inactive                                       |

---

## 9.5 Professional-cadre setup screen

Sections:

| Section                          | Fields                                             |
| -------------------------------- | -------------------------------------------------- |
| Cadre                            | Code, name                                         |
| Regulator                        | PPB, KMPDC, COC, NCK, KMLTTB                       |
| Required credential fields       | Registration number, licence number, expiry        |
| Allowed services                 | Consultation, triage, dispensing, lab verification |
| Can be superintendent?           | Yes/no                                             |
| Can sign clinical note?          | Yes/no                                             |
| Can verify lab result?           | Yes/no                                             |
| Can approve controlled medicine? | Yes/no                                             |

---

## 9.6 Branch onboarding checklist setup screen

Sections:

| Section               | Fields                        |
| --------------------- | ----------------------------- |
| Branch type           | Clinic, pharmacy, retail, lab |
| Required documents    | Licence types/documents       |
| Required staff        | Cadres and minimum count      |
| Required contracts    | SHA/private if claims enabled |
| Required integrations | eTIMS, M-Pesa, claims         |
| Required approvals    | Manager/compliance/owner      |
| Blocking rules        | What cannot go live           |
| Checklist order       | Step sequence                 |

---

## 10. Exact onboarding checklists

## 10.1 Organisation onboarding checklist

| Step                             |         Required? | Completion condition               |
| -------------------------------- | ----------------: | ---------------------------------- |
| Create legal entity              |               Yes | Organisation record saved          |
| Add legal name and trading name  |               Yes | Required fields valid              |
| Select entity type               |               Yes | Enum selected                      |
| Add business registration number |               Yes | Unique and valid format            |
| Upload registration certificate  |               Yes | Document uploaded                  |
| Add KRA PIN                      |               Yes | Valid format                       |
| Upload KRA PIN certificate       |       Recommended | Document uploaded                  |
| Add owner/director records       |               Yes | At least one active owner/director |
| Add primary contact              |               Yes | Phone/email                        |
| Add head-office address          |               Yes | County/sub-county/town             |
| Verify business registration     | Yes before active | Verification log created           |
| Verify KRA PIN                   |  Yes before eTIMS | Verification log created           |
| Mark organisation active         |               Yes | Compliance approval                |

## 10.2 Retail branch checklist

| Step                 |     Required? | Completion condition            |
| -------------------- | ------------: | ------------------------------- |
| Create branch        |           Yes | Branch code generated           |
| Select branch type   |           Yes | `retail_shop`                   |
| Add physical address |           Yes | County/sub-county/town/building |
| Add manager          |           Yes | Active user assigned            |
| Add county permit    |  Configurable | Active or warning               |
| Add eTIMS setup      | Yes for sales | eTIMS config active/manual mode |
| Add payment accounts |   Recommended | M-Pesa/cash/card config         |
| Enable retail sales  |           Yes | Rules passed                    |

## 10.3 Pharmacy branch checklist

| Step                                       |         Required? | Completion condition                  |
| ------------------------------------------ | ----------------: | ------------------------------------- |
| Create branch                              |               Yes | Branch profile complete               |
| Select pharmacy branch type                |               Yes | `chemist` or `retail_pharmacy`        |
| Add PPB premise licence/application        |               Yes | Licence record created                |
| Upload PPB premise licence                 | Yes before active | Document verified                     |
| Assign superintendent                      |               Yes | Active branch-professional assignment |
| Verify superintendent PPB practice licence |               Yes | Credential active                     |
| Add other pharmacy staff                   |       Recommended | Staff assigned                        |
| Add county permit                          |      Configurable | Active/warning                        |
| Configure pharmacy services                |               Yes | OTC/prescription flags                |
| Compliance approval                        |               Yes | Pharmacy active                       |
| Enable dispensing                          |               Yes | Permission engine passes              |

## 10.4 Clinic branch checklist

| Step                           |   Required? | Completion condition          |
| ------------------------------ | ----------: | ----------------------------- |
| Create branch                  |         Yes | Branch profile complete       |
| Select clinic branch type      |         Yes | `clinic`/`medical_centre`     |
| Add KMPDC facility certificate |         Yes | Active verified licence       |
| Add facility level/type        |         Yes | Structured field              |
| Add approved services          |         Yes | Services selected             |
| Assign clinical lead           | Recommended | Active clinician/professional |
| Add clinicians                 |         Yes | At least one active clinician |
| Verify professional licences   |         Yes | Active credentials            |
| Configure service catalogue    |         Yes | Consultations/procedures      |
| Configure billing/eTIMS        |         Yes | Billing enabled               |
| Enable EMR                     |         Yes | Rule engine passes            |

## 10.5 Clinic + pharmacy checklist

| Step                                    | Required? | Completion condition            |
| --------------------------------------- | --------: | ------------------------------- |
| Complete clinic checklist               |       Yes | Clinic active                   |
| Complete pharmacy checklist             |       Yes | Pharmacy active                 |
| Configure internal prescription routing |       Yes | EMR → pharmacy queue            |
| Configure shared patient account        |       Yes | Patient master enabled          |
| Configure integrated billing            |       Yes | Visit + prescription billing    |
| Enable combined workflow                |       Yes | Clinic and pharmacy both active |

## 10.6 Claims checklist

| Step                               |   Required? | Completion condition        |
| ---------------------------------- | ----------: | --------------------------- |
| Branch has active facility licence |         Yes | KMPDC active                |
| Add payer                          |         Yes | Payer active                |
| Add contract                       |         Yes | Contract active             |
| Add provider/facility code         |         Yes | Provider code present       |
| Upload contract/empanelment letter |         Yes | Document verified           |
| Add tariff                         |         Yes | Active tariff               |
| Add benefit rules                  |         Yes | Covered services configured |
| Add pre-auth rules                 | Recommended | Rules configured            |
| Add attachment rules               | Recommended | Rules configured            |
| Enable claims                      |         Yes | Claims permission passes    |

---

## 11. Field validation rules

This closes the “exact field validation” gap.

## 11.1 Organisation fields

| Field                 | Validation                                                     |
| --------------------- | -------------------------------------------------------------- |
| `legal_name`          | Required, 2–255 chars                                          |
| `trading_name`        | Required, 2–255 chars                                          |
| `entity_type`         | Required enum                                                  |
| `registration_number` | Required, unique per country/entity type                       |
| `kra_pin`             | Required for eTIMS; format `^[A-Z][0-9]{9}[A-Z]$` configurable |
| `phone`               | Kenyan/international phone format                              |
| `email`               | Valid email                                                    |
| `status`              | Enum                                                           |
| `owners`              | At least one owner/director before active                      |

## 11.2 Branch fields

| Field                    | Validation                           |
| ------------------------ | ------------------------------------ |
| `branch_code`            | Required, unique within organisation |
| `branch_name`            | Required                             |
| `branch_type`            | Required enum                        |
| `county`                 | Required                             |
| `sub_county`             | Required                             |
| `town`                   | Required                             |
| `physical_address`       | Required                             |
| `gps_lat/gps_lng`        | Optional, valid coordinate range     |
| `branch_manager_user_id` | Required before active               |
| `operating_hours`        | Required before active               |
| `status`                 | Enum                                 |

## 11.3 Licence fields

| Field                 | Validation                                              |
| --------------------- | ------------------------------------------------------- |
| `licence_type_id`     | Required                                                |
| `licence_number`      | Required unless status is draft/pending                 |
| `name_on_document`    | Required                                                |
| `issue_date`          | Required if `licence_type.has_expiry = true` and active |
| `expiry_date`         | Required if `licence_type.has_expiry = true`            |
| `expiry_date`         | Must be after issue date                                |
| `status`              | Enum                                                    |
| `document_id`         | Required where licence type requires document           |
| `verification_status` | Required                                                |
| `verified_by`         | Required when status becomes verified                   |
| `verified_at`         | Required when status becomes verified                   |

## 11.4 Professional fields

| Field                       | Validation                                      |
| --------------------------- | ----------------------------------------------- |
| `full_name`                 | Required                                        |
| `cadre`                     | Required enum                                   |
| `regulator_code`            | Required enum                                   |
| `registration_number`       | Required                                        |
| `practising_licence_number` | Required for active professional                |
| `licence_expiry_date`       | Required                                        |
| `phone`                     | Required                                        |
| `email`                     | Recommended                                     |
| `status`                    | Enum                                            |
| `branch assignment`         | Required before performing branch-scoped action |

## 11.5 Branch-professional assignment

| Field               | Validation                                           |
| ------------------- | ---------------------------------------------------- |
| `branch_id`         | Required                                             |
| `professional_id`   | Required                                             |
| `role_at_branch`    | Required                                             |
| `start_date`        | Required                                             |
| `end_date`          | Must be after start date                             |
| `is_superintendent` | Only allowed for PPB-regulated pharmacy professional |
| `is_clinical_lead`  | Only allowed for configured clinical cadres          |
| `status`            | Enum                                                 |

## 11.6 Payer contract fields

| Field                  | Validation                        |
| ---------------------- | --------------------------------- |
| `payer_name`           | Required                          |
| `payer_type`           | Required enum                     |
| `contract_number`      | Required                          |
| `provider_code`        | Required for claims               |
| `branch_id`            | Required                          |
| `start_date`           | Required                          |
| `end_date`             | Required                          |
| `end_date`             | Must be after start date          |
| `tariff_document_id`   | Required before claims activation |
| `contract_document_id` | Required                          |
| `status`               | Enum                              |

---

## 12. UI flow: exact screens for developer handoff

## 12.1 Organisation setup wizard

```text
Step 1: Legal identity
Step 2: Owners/directors
Step 3: Tax/KRA/eTIMS readiness
Step 4: Documents
Step 5: Verification
Step 6: Branch creation
```

### Step 1: Legal identity

Fields:

```text
Legal name
Trading name
Entity type
Registration number
Date registered
Country
KRA PIN
VAT status
Phone
Email
Physical address
Postal address
```

Buttons:

```text
Save draft
Save and continue
Check duplicates
```

## 12.2 Branch setup wizard

```text
Step 1: Branch identity
Step 2: Branch type and services
Step 3: Location and contacts
Step 4: Required licences
Step 5: Responsible professionals
Step 6: Payments/eTIMS
Step 7: Compliance review
Step 8: Activate branch
```

The branch type selected in Step 2 should generate the checklist in Step 4.

## 12.3 Licence upload flow

```text
Select licence type
  ↓
Enter licence number/application reference
  ↓
Enter issue/expiry dates
  ↓
Upload document
  ↓
System validates required fields
  ↓
Submit for verification
  ↓
Verifier reviews document and source
  ↓
Mark verified / rejected / needs correction
  ↓
Rule engine re-evaluates branch permissions
```

## 12.4 Professional assignment flow

```text
Create/select professional
  ↓
Add cadre and regulator
  ↓
Add registration/licence number
  ↓
Upload practice licence
  ↓
Verify licence
  ↓
Assign to branch
  ↓
Select role:
    superintendent
    clinical lead
    clinician
    nurse
    lab in-charge
    pharmacist
  ↓
System checks role eligibility
  ↓
Assignment becomes active
  ↓
Branch permissions re-evaluate
```

## 12.5 Compliance review screen

The reviewer sees:

```text
Branch: AfyaCare Rongai
Requested services:
  retail_sales
  prescription_dispensing
  clinic_consultation
  sha_claims

Compliance status:
  retail_sales: allowed
  prescription_dispensing: blocked - PPB premise licence not verified
  clinic_consultation: allowed
  sha_claims: warning - tariff missing

Required actions:
  Verify PPB premise licence
  Upload SHA tariff
  Assign active superintendent
```

Actions:

```text
Approve activation
Reject activation
Request correction
Approve warning-only activation
Approve temporary override
```

---

## 13. API endpoints for Module 1

## Organisation

| Endpoint                            | Purpose                     |
| ----------------------------------- | --------------------------- |
| `POST /organisations`               | Create organisation         |
| `GET /organisations/{id}`           | Get organisation            |
| `PATCH /organisations/{id}`         | Update organisation         |
| `POST /organisations/{id}/verify`   | Verify organisation records |
| `POST /organisations/{id}/activate` | Activate organisation       |

## Branches

| Endpoint                                  | Purpose                     |
| ----------------------------------------- | --------------------------- |
| `POST /organisations/{id}/branches`       | Create branch               |
| `GET /branches/{id}`                      | Get branch                  |
| `PATCH /branches/{id}`                    | Update branch               |
| `POST /branches/{id}/request-services`    | Request service permissions |
| `GET /branches/{id}/onboarding-checklist` | Get generated checklist     |
| `POST /branches/{id}/activate`            | Activate branch             |
| `GET /branches/{id}/compliance-status`    | Get compliance status       |

## Licences

| Endpoint                                  | Purpose                 |
| ----------------------------------------- | ----------------------- |
| `POST /licences`                          | Create licence instance |
| `PATCH /licences/{id}`                    | Update licence          |
| `POST /licences/{id}/documents`           | Upload document         |
| `POST /licences/{id}/submit-verification` | Submit verification     |
| `POST /licences/{id}/verify`              | Verify licence          |
| `POST /licences/{id}/reject`              | Reject licence          |
| `POST /licences/{id}/renewal`             | Start renewal           |
| `GET /licences/expiring`                  | Expiry report           |

## Professionals

| Endpoint                                     | Purpose                       |
| -------------------------------------------- | ----------------------------- |
| `POST /professionals`                        | Create professional           |
| `PATCH /professionals/{id}`                  | Update professional           |
| `POST /professionals/{id}/credentials`       | Add credential/licence        |
| `POST /professionals/{id}/verify-credential` | Verify credential             |
| `POST /branches/{id}/professionals`          | Assign professional to branch |
| `PATCH /branch-professionals/{id}`           | Update assignment             |
| `POST /branch-professionals/{id}/end`        | End assignment                |

## Payer contracts

| Endpoint                               | Purpose                 |
| -------------------------------------- | ----------------------- |
| `POST /payer-contracts`                | Create contract         |
| `PATCH /payer-contracts/{id}`          | Update contract         |
| `POST /payer-contracts/{id}/documents` | Upload contract/tariff  |
| `POST /payer-contracts/{id}/activate`  | Activate payer contract |
| `GET /payer-contracts/expiring`        | Expiring contracts      |

## Master data

| Endpoint                            | Purpose                  |
| ----------------------------------- | ------------------------ |
| `GET /master/regulators`            | List regulators          |
| `POST /master/regulators`           | Create regulator         |
| `GET /master/licence-types`         | List licence types       |
| `POST /master/licence-types`        | Create licence type      |
| `GET /master/service-permissions`   | List services            |
| `POST /master/document-types`       | Create document type     |
| `GET /master/onboarding-checklists` | List checklist templates |

---

## 14. Compliance score calculation

## 14.1 Branch compliance score

The score should be calculated against required items for the selected branch type.

```text
compliance_score =
  completed_required_items / total_required_items × 100
```

But blocking items should override score.

Example:

```text
Score: 88%
Status: Blocked
Reason: PPB premise licence expired
```

## 14.2 Compliance status enum

```text
not_configured
incomplete
active
active_with_warnings
blocked
suspended
expired
closed
```

## 14.3 Blocking logic

| Condition                                       | Status                                    |
| ----------------------------------------------- | ----------------------------------------- |
| Required blocking licence missing               | `blocked`                                 |
| Required blocking licence expired               | `blocked`                                 |
| Professional licence expired for active service | `blocked` for that service                |
| Optional document missing                       | `active_with_warnings`                    |
| Contract expired                                | Claims service blocked only               |
| eTIMS not configured                            | Invoicing blocked/warning depending setup |
| ODPC missing                                    | Warning or block based on customer policy |
| County permit missing                           | Configurable warning/block                |

---

## 15. Developer-ready acceptance criteria

## 15.1 Master-data acceptance

| Test                         | Expected result                                 |
| ---------------------------- | ----------------------------------------------- |
| Create regulator             | Regulator appears in licence-type setup         |
| Create licence type          | Licence type can be mapped to branch service    |
| Mark licence type blocking   | Missing licence blocks service                  |
| Configure alert days         | Alerts fire based on configured schedule        |
| Add document type            | Document upload uses correct metadata/retention |
| Create branch-type checklist | Branch setup generates correct checklist        |

## 15.2 Organisation acceptance

| Test                            | Expected result                                  |
| ------------------------------- | ------------------------------------------------ |
| Create organisation             | Organisation saved with legal identity           |
| Duplicate registration number   | System blocks duplicate                          |
| Missing KRA PIN                 | Organisation can save draft, eTIMS blocked       |
| Upload registration certificate | Document version 1 created                       |
| Replace certificate             | Document version 2 created; version 1 superseded |
| Verify organisation             | Verification log created                         |
| Activate organisation           | Only allowed after required fields complete      |

## 15.3 Branch acceptance

| Test                     | Expected result                           |
| ------------------------ | ----------------------------------------- |
| Create retail branch     | Retail checklist generated                |
| Create pharmacy branch   | PPB + superintendent checklist generated  |
| Create clinic branch     | KMPDC + clinician checklist generated     |
| Create clinic+pharmacy   | Both KMPDC and PPB requirements generated |
| Missing required licence | Service permission blocked                |
| Licence verified         | Permission re-evaluates automatically     |
| Branch activated         | Only allowed if blocking items cleared    |
| Branch closed            | Services disabled but history retained    |

## 15.4 Licence acceptance

| Test                                             | Expected result                                |
| ------------------------------------------------ | ---------------------------------------------- |
| Add licence                                      | Licence instance created                       |
| Expiry before issue date                         | Validation error                               |
| Required document missing                        | Cannot submit for verification                 |
| Verify licence                                   | Status becomes verified; audit log created     |
| Reject licence                                   | Reason required                                |
| Licence expires                                  | Alerts trigger and linked service blocks/warns |
| Renew licence                                    | New version/instance linked to old record      |
| Licence number duplicate in same regulator/scope | System warns/blocks based on config            |

## 15.5 Professional acceptance

| Test                           | Expected result                                |
| ------------------------------ | ---------------------------------------------- |
| Add pharmacist                 | PPB credential required                        |
| Assign superintendent          | Only allowed if cadre/regulator eligible       |
| Superintendent licence expired | Pharmacy service blocked                       |
| Add clinician                  | Professional regulator required                |
| Clinician licence expired      | Cannot sign clinical notes                     |
| End staff assignment           | Branch permissions re-evaluate                 |
| Staff leaves                   | Login disabled but historical records retained |

## 15.6 Claims contract acceptance

| Test                            | Expected result                           |
| ------------------------------- | ----------------------------------------- |
| Add SHA contract                | Provider code and contract dates required |
| Contract expired                | SHA claims blocked                        |
| Tariff missing                  | Claim activation blocked/warning          |
| Private insurer contract active | Only that payer enabled                   |
| Contract renewed                | New version retained                      |
| Contract terminated             | New claims blocked, old claims retained   |

---

## 16. Final developer implementation sequence

## Phase 1: Core schema and master data

Build:

```text
regulators
licence_types
document_types
organisations
organisation_owners
branches
professionals
professional_credentials
branch_professionals
licence_instances
documents
verification_logs
branch_service_permissions
```

## Phase 2: Rules engine

Build:

```text
required licence evaluation
expiry evaluation
professional assignment evaluation
contract evaluation
service-permission evaluation
compliance score
blocking/warning reasons
```

## Phase 3: UI wizards

Build:

```text
organisation setup wizard
branch setup wizard
licence upload/verification flow
professional assignment flow
payer contract setup flow
compliance review dashboard
```

## Phase 4: Alerts and audit

Build:

```text
licence expiry alerts
professional licence expiry alerts
contract expiry alerts
missing-document alerts
verification overdue alerts
audit log
document versioning
```

## Phase 5: Integration gates

Expose permission checks to:

```text
POS
Pharmacy
EMR
Lab
Claims
eTIMS
M-Pesa/payment setup
Reporting
```

---

## 17. Final handoff summary

Module 1 is now developer-ready if implemented with these final decisions:

| Decision             | Final position                                                      |
| -------------------- | ------------------------------------------------------------------- |
| Licence modelling    | Normalized, catalogue-driven                                        |
| Regulators           | Stored as master data                                               |
| Branch requirements  | Generated from branch type and requested services                   |
| Verification         | Manual-first, API-ready                                             |
| Document storage     | Versioned, hash-tracked, retention-coded                            |
| Service activation   | Controlled by rule engine                                           |
| Professional scope   | Cadre + regulator + active credential + branch assignment           |
| Claims activation    | Facility licence + contract + provider code + tariff                |
| County permits       | Configurable, because counties differ                               |
| ODPC/data protection | Included as compliance record, block/warn configurable              |
| Developer readiness  | Ready for schema, UI, workflow, API, and rule-engine implementation |

The closed Module 1 design should now be treated as the **system gatekeeper**:

```text
No branch should sell medicines, dispense prescriptions, run clinic consultations, verify lab results, submit claims, or issue regulated workflows unless the organisation, branch, licence, professional, contract, and document rules are satisfied.
```
