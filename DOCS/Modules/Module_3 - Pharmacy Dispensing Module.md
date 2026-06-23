# Module 3: Pharmacy Dispensing Module

This module is the **clinical and compliance heart** of the pharmacy/chemist system.

Modules 1 and 2 answer:

```text
Module 1: Is this branch and professional legally allowed to dispense?
Module 2: How is the sale billed, paid, invoiced, receipted, and reconciled?
Module 3: Was the medicine dispensed safely, legally, traceably, and by the right person?
```

For Kenya, this module must be designed around four realities:

1. **Pharmacy is regulated professional practice**, not ordinary retail. PPB regulates pharmacy personnel, premises, practices, sale, distribution, post-market surveillance, pharmacovigilance, and licit use of narcotic and psychotropic substances. The Pharmacy and Poisons Act requires practising pharmacists and pharmaceutical technologists to hold valid practising licences when engaging in dispensing, compounding, pharmaceutical care, or pharmaceutical services in Kenya. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/1956/17/eng%402023-12-11))
2. **Prescription-only medicines must not be sold like normal retail goods.** The system must force prescription capture, prescriber details, patient details, pharmacist approval, and dispensing audit.
3. **Batch, expiry, traceability, and recalls are critical.** PPB’s authentication and traceability standards emphasize supply-chain integrity, patient safety, and traceability technologies to monitor health products across the supply chain. ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/standards-for-authentication-and-traceability-of-health-products-and-technologies/))
4. **Controlled medicines require stricter handling.** Kenya’s Narcotic Drugs and Psychotropic Substances framework allows regulation of prescription, dispensing, supplying, sale, records, and conditions for narcotic and psychotropic substances. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/1994/4/eng%402022-12-31))

---

# 1. Purpose of the module

The Pharmacy Dispensing Module should:

| Purpose                              | Practical meaning                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| Validate prescriptions               | Ensure prescription-only medicines are linked to valid prescription evidence |
| Capture patient safety data          | Allergies, age, pregnancy, chronic disease, weight where needed              |
| Support pharmacist review            | Prevent cashier-only dispensing of restricted medicines                      |
| Control batch and expiry             | Ensure correct batch, expiry, recall readiness                               |
| Support partial dispensing           | Handle real Kenyan affordability and stock-availability realities            |
| Record substitutions                 | Brand/generic changes must be documented                                     |
| Track refills/repeats                | Chronic-care continuity                                                      |
| Print medicine labels                | Reduce medication-use errors                                                 |
| Support controlled medicine register | High-risk medicines require stricter accountability                          |
| Support pharmacovigilance            | Capture adverse drug reaction and poor-quality medicine reports              |
| Feed POS and inventory               | Dispensing creates billable stock movement                                   |
| Preserve audit trail                 | Who prescribed, reviewed, dispensed, sold, and from which batch              |

---

# 2. Core users

| User                        | Main actions                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------- |
| Pharmacist                  | Reviews prescription, approves dispensing, substitutes, counsels, signs off         |
| Pharmaceutical technologist | Dispensing workflow depending on scope and branch policy                            |
| Cashier                     | Bills approved medicine items, receives payment                                     |
| Pharmacy assistant          | May prepare items but cannot approve restricted dispensing unless legally permitted |
| Superintendent              | Oversees branch pharmacy compliance and controlled registers                        |
| Clinician                   | Sends internal prescription from clinic EMR                                         |
| Patient/customer            | Provides prescription, receives medicine and label                                  |
| Branch manager              | Reviews stock, expiry, returns, discounts, operational issues                       |
| Auditor/compliance officer  | Reviews dispensing logs, controlled medicines, expiry, substitutions                |
| Owner                       | Views business and compliance reports                                               |

---

# 3. Relationship with modules 1 and 2

## Module 1 dependency: organisation and licensing

Before dispensing is allowed, the Pharmacy Dispensing Module should check:

| Required from Module 1                              | Why                                                      |
| --------------------------------------------------- | -------------------------------------------------------- |
| Active PPB premise licence                          | Branch must be licensed for pharmacy activity            |
| Active superintendent pharmacist/technologist       | Pharmacy supervision                                     |
| Active professional licence                         | Dispensing approval must be tied to a valid professional |
| Branch service permissions                          | Branch must be configured to dispense medicines          |
| Controlled medicine authorization, where applicable | Required for high-risk medicine categories               |
| ODPC/privacy setup                                  | Patient health data is sensitive                         |

## Module 2 dependency: POS and billing

After dispensing is approved, Module 2 handles:

| POS/billing function             | Pharmacy link                               |
| -------------------------------- | ------------------------------------------- |
| Sale line creation               | Dispensed medicine becomes billable item    |
| Price list                       | Retail, insurer, branch, chronic-care price |
| eTIMS invoice                    | Medicine sale is invoiced                   |
| M-Pesa/cash/card/insurer payment | Payment captured                            |
| Credit note/return               | Medicine return rules applied               |
| Shift close                      | Cashier accountability                      |
| Discount approval                | Prevent margin leakage on medicines         |

## Module 4 dependency: inventory

The dispensing module must depend heavily on stock data:

| Inventory data    | Why                                       |
| ----------------- | ----------------------------------------- |
| Batch number      | Recall and traceability                   |
| Expiry date       | Patient safety                            |
| Supplier          | Quality and accountability                |
| Quantity on hand  | Prevent false dispensing                  |
| Cost price        | Margin and replacement planning           |
| Storage condition | Cold-chain/high-risk handling             |
| Quarantine status | Prevent dispensing recalled/damaged stock |

---

# 4. Core pharmacy transaction types

| Transaction                  | Description                                     | POS involved? | Stock involved? | Patient involved? |
| ---------------------------- | ----------------------------------------------- | ------------: | --------------: | ----------------: |
| OTC sale                     | Non-prescription medicine sale                  |           Yes |             Yes |          Optional |
| Prescription dispense        | Prescription medicine dispensed                 |           Yes |             Yes |               Yes |
| Internal clinic prescription | Prescription from clinic EMR                    |           Yes |             Yes |               Yes |
| External prescription        | Patient uploads/brings prescription             |           Yes |             Yes |               Yes |
| Partial dispense             | Only part of prescribed quantity supplied       |           Yes |             Yes |               Yes |
| Refill/repeat dispense       | Repeat supply for chronic prescription          |           Yes |             Yes |               Yes |
| Substitution                 | Dispensed product differs from prescribed brand |           Yes |             Yes |               Yes |
| Controlled medicine dispense | Narcotic/psychotropic/high-risk item            |           Yes |             Yes |               Yes |
| Emergency supply/exception   | Limited exceptional dispense by policy          |           Yes |             Yes |               Yes |
| Return/reversal              | Dispense reversed or returned                   |           Yes |  Yes/quarantine |               Yes |
| Adverse event report         | Safety report after medicine use                |   No/optional |              No |               Yes |

---

# 5. Feature-by-feature design

## A. Prescription entry/upload

Prescription entry is required for prescription-only medicines. PPB’s pharmacy-practice guidance framework includes pharmacy practice, premises licensing, practice licences, pharmaceutical services, internet pharmacy services, and CPD; the Good Pharmacy Practice guideline page states that the guideline was developed to promote quality pharmaceutical care and is used by pharmacists, pharmaceutical technologists, pharmacy specialists, and other healthcare professionals providing pharmaceutical services. ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/pharmacy-practice-guidelines/))

### Prescription sources

| Source                          | Example                                                  |
| ------------------------------- | -------------------------------------------------------- |
| Internal clinic EMR             | Doctor in same clinic prescribes digitally               |
| External paper prescription     | Patient brings handwritten/printed prescription          |
| External digital prescription   | WhatsApp/PDF/photo/email                                 |
| Refill prescription             | Previous prescription reused within allowed repeat rules |
| Telemedicine prescription       | From approved clinician/platform                         |
| Hospital discharge prescription | Patient discharged from hospital                         |
| Chronic-care prescription       | Hypertension, diabetes, asthma, epilepsy, etc.           |

### Prescription entry fields

| Field                                |                                   Required? | Notes                                                                      |
| ------------------------------------ | ------------------------------------------: | -------------------------------------------------------------------------- |
| Prescription number/reference        |                                         Yes | Internal or external                                                       |
| Prescription source                  |                                         Yes | Internal, external, telemedicine, refill                                   |
| Prescription date                    |                                         Yes | Prevent outdated prescriptions                                             |
| Prescription expiry/valid-until date |                                 Recommended | Especially for repeats                                                     |
| Patient                              |                                         Yes | Link to patient profile                                                    |
| Prescriber                           |                                         Yes | Name and professional details                                              |
| Facility/clinic                      |                                 Recommended | External prescription source                                               |
| Diagnosis/indication                 |                        Optional/recommended | Useful for safety checks                                                   |
| Uploaded document/photo              |          Required for external prescription | Image/PDF                                                                  |
| Prescription status                  |                                         Yes | Draft, pending review, approved, dispensed, partially dispensed, cancelled |
| Entered by                           |                                        Auto | Audit                                                                      |
| Reviewed by pharmacist               | Required before dispensing restricted items |                                                                            |
| Review notes                         |            Optional/required if issue found |                                                                            |
| Original retained?                   |                                    Optional | For paper prescription policy                                              |
| Repeat/refill allowed                |                                      Yes/no | Chronic care                                                               |
| Number of repeats                    |                                      Number | If applicable                                                              |

### Prescription item fields

| Field                   |      Required? | Notes                                  |
| ----------------------- | -------------: | -------------------------------------- |
| Medicine prescribed     |            Yes | Brand or generic                       |
| Strength                |            Yes | Example: 500 mg                        |
| Dosage form             |            Yes | Tablet, capsule, syrup, injection      |
| Dose                    |            Yes | Example: 1 tablet                      |
| Frequency               |            Yes | Example: twice daily                   |
| Duration                |            Yes | Example: 5 days                        |
| Quantity prescribed     |            Yes | Example: 10 tablets                    |
| Route                   |    Recommended | Oral, topical, IM, IV                  |
| Instructions            |            Yes | Before food, after food, etc.          |
| Refill quantity         |      If repeat | Chronic care                           |
| Substitution allowed    | Yes/no/unknown | Where captured                         |
| Priority                |       Optional | Urgent, routine                        |
| Clinical warning status |           Auto | Allergy/interactions/duplicate therapy |
| Dispensed item          |          Later | Actual product supplied                |
| Quantity dispensed      |          Later | May differ from prescribed             |
| Batch selected          |          Later | From stock                             |
| Pharmacist decision     |          Later | Approved, changed, rejected            |

---

## B. Prescriber details

Prescriber details provide audit and professional accountability.

### Prescriber fields

| Field                       |                      Required? | Notes                                   |
| --------------------------- | -----------------------------: | --------------------------------------- |
| Prescriber full name        |                            Yes | As written or selected                  |
| Professional cadre          |                            Yes | Doctor, dentist, clinical officer, etc. |
| Registration/licence number | Recommended/required by policy | Important for audit                     |
| Prescriber facility         |                    Recommended | Hospital/clinic name                    |
| Facility address/contact    |                       Optional | Useful for verification                 |
| Phone/email                 |                       Optional | For clarification                       |
| Signature/stamp present     |                         Yes/no | For scanned prescriptions               |
| Prescriber verified?        |                         Yes/no | Manual or registry lookup               |
| Verification date           |                       Optional | Audit                                   |
| Verification notes          |                       Optional | Example: called clinic                  |
| Internal prescriber user ID |                    If internal | Links to EMR clinician                  |

### Prescriber validation rules

| Rule                                          | System behaviour                                                |
| --------------------------------------------- | --------------------------------------------------------------- |
| Internal prescription                         | Prescriber must be active clinician in Module 1                 |
| External prescription missing prescriber name | Block until captured                                            |
| High-risk medicine                            | Require prescriber licence number or pharmacist override reason |
| Suspicious prescription                       | Mark as “requires verification”                                 |
| Repeat prescription                           | Ensure repeat period and remaining refills are valid            |
| Prescriber not verified                       | Allow or block depending on medicine risk category              |

---

## C. Patient profile

The patient profile is not only for marketing or receipts. It supports safe dispensing.

### Patient safety fields

| Field                      | Why it matters                                                         |
| -------------------------- | ---------------------------------------------------------------------- |
| Full name                  | Label and audit                                                        |
| Date of birth/age          | Paediatric/elderly dosing                                              |
| Sex                        | Clinical relevance                                                     |
| Weight                     | Paediatric and dose-sensitive medicines                                |
| Pregnancy status           | Pregnancy contraindications                                            |
| Breastfeeding status       | Medicine safety                                                        |
| Allergies                  | Prevent allergic reactions                                             |
| Chronic conditions         | Diabetes, hypertension, asthma, epilepsy, renal disease, liver disease |
| Current medicines          | Interaction and duplicate therapy checks                               |
| Previous adverse reactions | Safety                                                                 |
| Phone                      | Refill reminders and follow-up                                         |
| Guardian/caregiver         | Children/elderly                                                       |
| SHA/private insurer        | Billing/claims                                                         |
| Consent preferences        | SMS/WhatsApp/refill reminders                                          |
| Patient notes              | Special instructions                                                   |

### Patient profile rules

| Rule                                      | System behaviour                      |
| ----------------------------------------- | ------------------------------------- |
| Paediatric patient                        | Require age and preferably weight     |
| Pregnancy flag                            | Trigger pregnancy safety warnings     |
| Allergy recorded                          | Warn or block matching medicine/class |
| Chronic patient                           | Enable refill/repeat tracking         |
| Missing patient for prescription medicine | Block dispensing                      |
| Anonymous sale                            | Allowed only for configured OTC items |
| Consent missing                           | Do not send refill/marketing messages |

---

## D. Dosage instructions

Dosage instructions are central to patient safety and label printing.

### Dosage fields

| Field                   | Example                                           |
| ----------------------- | ------------------------------------------------- |
| Dose                    | 1 tablet                                          |
| Frequency               | Twice daily                                       |
| Duration                | 5 days                                            |
| Route                   | Oral                                              |
| Timing                  | After meals                                       |
| Quantity                | 10 tablets                                        |
| Special instructions    | Complete the course                               |
| Language                | English/Kiswahili/custom                          |
| Warning stickers        | May cause drowsiness, keep refrigerated           |
| Counselling notes       | Avoid alcohol, take with water                    |
| Missed dose instruction | Optional                                          |
| Storage instruction     | Store below 25°C, refrigerate, protect from light |

### Standard sig builder

The system should support a structured “sig” builder:

```text
Take [dose] by [route] [frequency] for [duration] [timing] [special instruction].
```

Example:

```text
Take 1 tablet by mouth twice daily for 5 days after meals. Complete the full course.
```

### Dosage rules

| Rule                          | System behaviour                          |
| ----------------------------- | ----------------------------------------- |
| Dose missing                  | Block label printing and dispensing       |
| Frequency missing             | Block pharmacist approval                 |
| Duration missing              | Warn/block depending on item              |
| Paediatric medicine           | Ask for weight if dose depends on weight  |
| Antibiotic                    | Prompt “complete full course” counselling |
| Sedating medicine             | Add drowsiness warning where configured   |
| Refrigerated medicine         | Add storage warning                       |
| External prescription unclear | Pharmacist marks “clarified” or rejects   |

---

## E. Partial dispensing

Partial dispensing is common where the patient cannot afford the full quantity, the pharmacy has limited stock, or the patient wants a few days’ supply.

### Partial dispense reasons

| Reason                    | Example                               |
| ------------------------- | ------------------------------------- |
| Patient affordability     | Patient buys 3 days instead of 7 days |
| Stock shortage            | Pharmacy has only 10 tablets          |
| Clinical decision         | Trial supply                          |
| Insurance limit           | Payer covers only part                |
| Controlled medicine limit | Restricted quantity                   |
| Patient preference        | Patient wants smaller quantity        |

### Partial dispensing fields

| Field                         | Notes                       |
| ----------------------------- | --------------------------- |
| Quantity prescribed           | From prescription           |
| Quantity dispensed now        | Actual supply               |
| Balance remaining             | Auto-calculated             |
| Reason for partial dispensing | Mandatory                   |
| Patient informed?             | Yes/no                      |
| Next expected refill date     | Optional                    |
| Balance expiry                | Date                        |
| Pharmacist approval           | Required                    |
| Label adjusted?               | Yes                         |
| Payment amount                | Based on quantity dispensed |
| Prescription status           | Partially dispensed         |

### Partial dispensing rules

| Rule                                    | System behaviour                                              |
| --------------------------------------- | ------------------------------------------------------------- |
| Dispensed quantity less than prescribed | Require reason                                                |
| Balance remaining                       | Create refill/balance record                                  |
| Antibiotic partial supply               | Warn strongly due to adherence risk                           |
| Controlled medicine partial             | Record in controlled register                                 |
| Patient returns for balance             | System retrieves original prescription and remaining quantity |
| Balance expired                         | Block or require pharmacist review                            |
| Stock arrives later                     | Notify patient if consent exists                              |

---

## F. Substitution

Substitution happens when the prescribed brand is unavailable, too expensive, or a generic equivalent is preferred.

### Substitution types

| Type                     | Example                                                   |
| ------------------------ | --------------------------------------------------------- |
| Brand to generic         | Branded amoxicillin to generic amoxicillin                |
| Generic to brand         | Generic prescribed, brand dispensed                       |
| Brand to brand           | Brand A replaced with Brand B                             |
| Strength substitution    | 500 mg x 1 replaced with 250 mg x 2                       |
| Dosage form substitution | Tablet to capsule, if appropriate                         |
| Therapeutic substitution | Different active ingredient; should be tightly controlled |

### Substitution fields

| Field                         |                              Required? |
| ----------------------------- | -------------------------------------: |
| Prescribed item               |                                    Yes |
| Dispensed item                |                                    Yes |
| Substitution type             |                                    Yes |
| Reason                        |                                    Yes |
| Equivalent strength confirmed |                                    Yes |
| Patient informed              |                                    Yes |
| Prescriber contacted          | For high-risk/therapeutic substitution |
| Pharmacist approval           |                                    Yes |
| Price difference              |                                   Auto |
| Notes                         |                            Recommended |

### Substitution reasons

| Reason                        |
| ----------------------------- |
| Prescribed brand out of stock |
| Generic equivalent available  |
| Patient affordability         |
| Insurance formulary           |
| Prescriber approved           |
| Medicine recalled/unavailable |
| Better pack size              |
| Clinical safety concern       |

### Substitution rules

| Rule                                | System behaviour                                                  |
| ----------------------------------- | ----------------------------------------------------------------- |
| Same active ingredient and strength | Allow pharmacist approval                                         |
| Different strength                  | Require dose equivalence check                                    |
| Different active ingredient         | Require prescriber approval or strict override                    |
| Controlled medicine                 | Restrict substitution                                             |
| Patient not informed                | Block final approval                                              |
| Substitution changes price          | Update POS before payment                                         |
| Substitution after payment          | Requires invoice correction/credit note if sale already finalized |

---

## G. Refill and repeat tracking

Refill tracking is essential for chronic care and repeat prescriptions.

### Refill fields

| Field                    | Notes                                 |
| ------------------------ | ------------------------------------- |
| Original prescription ID | Link                                  |
| Medicine                 | Chronic item                          |
| Total repeats allowed    | From prescription/policy              |
| Repeats used             | Auto                                  |
| Remaining repeats        | Auto                                  |
| Last dispensed date      | Auto                                  |
| Next refill date         | Auto                                  |
| Days supplied            | Auto/manual                           |
| Early refill reason      | Required if early                     |
| Late refill flag         | Useful for adherence                  |
| Patient contacted        | Optional                              |
| Refill reminder consent  | Required for SMS/WhatsApp             |
| Refill status            | Active, completed, expired, cancelled |

### Refill rules

| Rule                  | System behaviour                         |
| --------------------- | ---------------------------------------- |
| No repeat allowed     | Block repeat dispense                    |
| Repeat exhausted      | Require new prescription                 |
| Refill too early      | Warn/block unless pharmacist approves    |
| Prescription expired  | Block or require new prescription        |
| Chronic care patient  | Show adherence/refill timeline           |
| Medicine changed      | Close old refill plan and create new one |
| Patient missed refill | Generate reminder task if consent exists |

### Chronic care use cases

| Condition     | Useful features                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Hypertension  | Monthly refill reminders, adherence history                                                                         |
| Diabetes      | Medicine and test strip refill tracking                                                                             |
| Asthma        | Inhaler refill monitoring                                                                                           |
| Epilepsy      | Missed refill alerts                                                                                                |
| HIV/TB        | Usually program-specific; system should support referral/program flags rather than mishandling restricted workflows |
| Mental health | Controlled/psychotropic caution                                                                                     |

---

## H. Controlled medicine register

Controlled medicines need special treatment because they carry higher diversion, abuse, dependency, and regulatory risk. Kenya’s narcotic and psychotropic framework allows regulation of prescribing, dispensing, supplying, quantities, conditions, records, and persons authorized to deal with such substances. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/1994/4/eng%402022-12-31))

### Controlled medicine register fields

| Field                          |                        Required? |
| ------------------------------ | -------------------------------: |
| Register entry number          |                              Yes |
| Date/time                      |                              Yes |
| Branch                         |                              Yes |
| Medicine                       |                              Yes |
| Strength/form                  |                              Yes |
| Batch number                   |                              Yes |
| Opening balance                |                              Yes |
| Quantity received              |                       If receipt |
| Quantity dispensed             |                      If dispense |
| Quantity returned              |                        If return |
| Quantity destroyed/quarantined |                    If applicable |
| Closing balance                |                              Yes |
| Prescription reference         |                 Yes for dispense |
| Patient name/ID                |                              Yes |
| Prescriber details             |                              Yes |
| Pharmacist approving           |                              Yes |
| Witness/counter-signature      | Configurable for high-risk items |
| Reason/notes                   |                              Yes |
| Stock location                 |                              Yes |
| Adjustment reason              |                        Mandatory |
| Audit status                   |          Open/reconciled/flagged |

### Controlled medicine workflows

| Workflow             | Control                                             |
| -------------------- | --------------------------------------------------- |
| Receive stock        | Superintendent/pharmacist approval                  |
| Dispense             | Prescription + pharmacist approval + register entry |
| Return               | Quarantine or controlled return workflow            |
| Stock count          | Frequent reconciliation                             |
| Adjustment           | Requires reason and senior approval                 |
| Destruction/disposal | Requires formal record and witness                  |
| Transfer             | Requires origin and destination authorization       |
| Report               | Exportable controlled register                      |

### Controlled register rules

| Rule                          | System behaviour                               |
| ----------------------------- | ---------------------------------------------- |
| Controlled item scanned       | Trigger controlled workflow                    |
| No prescription               | Block                                          |
| No patient                    | Block                                          |
| No prescriber                 | Block                                          |
| No pharmacist approval        | Block                                          |
| Quantity exceeds prescription | Block                                          |
| Balance mismatch              | Flag discrepancy                               |
| Manual adjustment             | Require two-level approval                     |
| Register entry edit           | Do not overwrite; create correction entry      |
| Return                        | Do not return to normal stock without approval |
| Expired controlled stock      | Move to controlled quarantine                  |

---

## I. Batch and expiry selection

Batch and expiry selection supports recall, patient safety, and product quality.

### Batch selection fields

| Field              | Notes                       |
| ------------------ | --------------------------- |
| Product            | Medicine                    |
| Batch/lot number   | Supplier/manufacturer batch |
| Expiry date        | Mandatory                   |
| Supplier           | From GRN                    |
| Quantity available | Current stock               |
| Storage location   | Shelf/fridge/cabinet        |
| Cost price         | Margin                      |
| Selling price      | POS                         |
| Recall status      | Clear, recalled, suspended  |
| Quarantine status  | Sellable/quarantined        |
| GTIN/serial        | Traceability-ready          |
| Received date      | Stock age                   |
| FEFO rank          | First-expiry-first-out      |

### Batch selection rules

| Rule                           | System behaviour                             |
| ------------------------------ | -------------------------------------------- |
| Expired batch                  | Block dispensing                             |
| Recalled batch                 | Block dispensing                             |
| Quarantined batch              | Block dispensing                             |
| Near-expiry batch              | Warn and require patient-safety policy       |
| Multiple batches               | Recommend FEFO                               |
| Cashier selects non-FEFO batch | Require reason/permission                    |
| Batch missing for medicine     | Block if item is batch-controlled            |
| Stock insufficient             | Offer partial dispensing or alternate branch |
| Cold-chain item                | Require storage-status confirmation          |

### Recall use case

If PPB or supplier recalls batch `ABC123`, the system should answer:

```text
How many units are still in stock?
Which branches have them?
Which patients received them?
Who dispensed them?
When were they dispensed?
How do we contact affected patients?
Were any adverse reactions reported?
```

This is why batch is not optional for a serious pharmacy system.

---

## J. Label printing

Label printing reduces medication errors and improves patient understanding.

### Label types

| Label                     | Use                                        |
| ------------------------- | ------------------------------------------ |
| Medicine label            | Attached to medicine pack                  |
| Auxiliary warning label   | Drowsiness, refrigeration, complete course |
| Reconstitution label      | Syrups requiring water                     |
| Cold-chain label          | Keep refrigerated                          |
| Controlled medicine label | High-risk internal handling                |
| Patient bag label         | Multiple medicines in one bag              |
| Refill label              | Next refill date                           |
| Barcode label             | Internal stock/prescription tracking       |

### Medicine label fields

| Field                         |                                     Required? |
| ----------------------------- | --------------------------------------------: |
| Pharmacy name                 |                                           Yes |
| Branch contact                |                                           Yes |
| Patient name                  |                                           Yes |
| Medicine name                 |                                           Yes |
| Strength/form                 |                                           Yes |
| Dose                          |                                           Yes |
| Frequency                     |                                           Yes |
| Duration                      |                                           Yes |
| Route                         |                                   Recommended |
| Quantity dispensed            |                                           Yes |
| Date dispensed                |                                           Yes |
| Pharmacist/dispenser initials |                                   Recommended |
| Prescription reference        |                                   Recommended |
| Batch/expiry                  | Optional on patient label, mandatory in audit |
| Storage instruction           |                                   If relevant |
| Warning text                  |                                   If relevant |
| Refill date                   |                                   If relevant |

### Label printing rules

| Rule                                  | System behaviour                                      |
| ------------------------------------- | ----------------------------------------------------- |
| Missing dosage                        | Block label printing                                  |
| Missing patient for prescription item | Block                                                 |
| Paediatric patient                    | Print age/weight where configured                     |
| Multiple medicines                    | Print separate label per medicine                     |
| Partial dispense                      | Label quantity actually dispensed                     |
| Substitution                          | Label actual dispensed medicine, not prescribed brand |
| Language preference                   | Print English/Kiswahili/custom text                   |
| Reprint label                         | Log reprint reason and user                           |

---

## K. Clinical warnings

Clinical warnings improve safety but must be practical. A small Kenyan chemist may not afford advanced drug database licensing at first, so the system should support levels.

### Warning levels

| Level                 | Capability                                                                   |
| --------------------- | ---------------------------------------------------------------------------- |
| Level 1: Basic        | Allergy, age, pregnancy, duplicate medicine, expiry                          |
| Level 2: Intermediate | Drug class allergy, chronic disease warnings, therapeutic duplication        |
| Level 3: Advanced     | Drug-drug interactions, renal/hepatic dose warnings, paediatric dose checks  |
| Level 4: Integrated   | EMR/lab-linked warnings, eGFR-based dosing, pharmacogenomics where available |

### Warning categories

| Warning             | Example                           |
| ------------------- | --------------------------------- |
| Allergy             | Penicillin allergy + amoxicillin  |
| Age                 | Adult-only medicine for child     |
| Pregnancy           | Contraindicated medicine          |
| Breastfeeding       | Medicine caution                  |
| Duplicate therapy   | Two NSAIDs                        |
| Interaction         | Warfarin + interacting antibiotic |
| Dose range          | Paediatric dose too high          |
| Chronic disease     | NSAID caution in renal disease    |
| Route mismatch      | Injectable billed as oral         |
| Duration mismatch   | Antibiotic duration unusual       |
| Stock issue         | Expired/recalled batch            |
| Controlled medicine | High-risk approval required       |
| Refill too early    | Possible misuse/diversion         |
| Refill too late     | Poor adherence                    |

PPB’s pharmacovigilance page describes pharmacovigilance as detection, assessment, understanding, and prevention of adverse effects and drug-related problems; it also lists goals including rational and safe use of medicines and educating/informing patients. ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/pharmacovigilance/))

### Warning actions

| Severity   | Behaviour                           |
| ---------- | ----------------------------------- |
| Info       | Show message                        |
| Warning    | Pharmacist must acknowledge         |
| High       | Requires pharmacist override reason |
| Critical   | Block unless senior override        |
| Regulatory | Block completely                    |

### Warning override fields

| Field                 |   Required? |
| --------------------- | ----------: |
| Warning type          |        Auto |
| Severity              |        Auto |
| User decision         |         Yes |
| Override reason       |         Yes |
| Pharmacist            |         Yes |
| Date/time             |         Yes |
| Patient counselled?   |      Yes/no |
| Prescriber contacted? | If required |
| Follow-up needed?     |    Optional |

---

## L. Pharmacist approval

Pharmacist approval prevents cashier-only dispensing.

### Approval triggers

| Trigger                              | Approval required                      |
| ------------------------------------ | -------------------------------------- |
| Prescription-only medicine           | Yes                                    |
| Controlled medicine                  | Yes, stricter                          |
| Substitution                         | Yes                                    |
| Partial dispensing                   | Yes                                    |
| Clinical warning                     | Yes                                    |
| Early refill                         | Yes                                    |
| Expired/near-expiry policy exception | Yes                                    |
| High discount on medicine            | Manager/pharmacist depending on policy |
| External prescription unclear        | Yes                                    |
| Telemedicine prescription            | Yes                                    |
| Patient allergy warning              | Yes                                    |
| Manual batch override                | Yes                                    |

### Approval states

| State                 | Meaning                                   |
| --------------------- | ----------------------------------------- |
| Pending review        | Pharmacist has not reviewed               |
| Needs clarification   | Prescription/patient issue                |
| Approved              | Ready for billing/dispensing              |
| Approved with changes | Substitution/partial/dosage clarification |
| Rejected              | Cannot dispense                           |
| Cancelled             | Prescription withdrawn                    |
| Dispensed             | Medicine supplied                         |
| Partially dispensed   | Balance remains                           |
| Reversed              | Dispense corrected/reversed               |

### Approval data captured

| Field                        | Notes                            |
| ---------------------------- | -------------------------------- |
| Pharmacist/professional ID   | From Module 1                    |
| Approval date/time           | Audit                            |
| Approval decision            | Approved/rejected/changed        |
| Reason                       | Mandatory for changes/rejections |
| Warnings reviewed            | Link                             |
| Patient counselled           | Yes/no                           |
| Prescriber contacted         | Yes/no                           |
| Prescription document viewed | Yes/no                           |
| Digital signature/PIN        | Recommended                      |
| Device/terminal              | Audit                            |
| Branch                       | Audit                            |

---

## M. Dispense audit

The audit trail must show exactly what happened.

### Dispense audit questions

The system must answer:

| Question                          | Why                         |
| --------------------------------- | --------------------------- |
| Who entered the prescription?     | Data-entry accountability   |
| Who reviewed it?                  | Professional accountability |
| Who approved it?                  | Compliance                  |
| Who billed it?                    | Financial audit             |
| Who received payment?             | Cash control                |
| Who handed over the medicine?     | Dispensing accountability   |
| What medicine was prescribed?     | Clinical audit              |
| What medicine was dispensed?      | Substitution audit          |
| Which batch and expiry?           | Recall                      |
| What quantity was dispensed?      | Stock and patient safety    |
| Was it partial?                   | Refill/balance              |
| Were warnings shown?              | Clinical safety             |
| Were warnings overridden?         | Risk management             |
| Was the patient counselled?       | Professional care           |
| Was label printed?                | Safety                      |
| Was receipt/eTIMS invoice issued? | Tax/commercial audit        |

### Audit events

| Event                   | Logged                    |
| ----------------------- | ------------------------- |
| Prescription created    | User, time, source        |
| Prescription uploaded   | File hash, user           |
| Prescription edited     | Old/new values            |
| Prescriber changed      | Old/new values and reason |
| Patient allergy updated | User/time                 |
| Warning generated       | Warning details           |
| Warning overridden      | Reason and pharmacist     |
| Substitution made       | From/to item and reason   |
| Partial dispense        | Quantity and reason       |
| Batch selected          | Batch/expiry/user         |
| Pharmacist approved     | Decision/time             |
| POS bill created        | Sale reference            |
| Payment completed       | Payment reference         |
| Label printed/reprinted | User/reason               |
| Dispense completed      | Final stock movement      |
| Return/reversal         | Reason and approver       |

---

# 6. Required screens

## Screen 1: Prescription intake

Used when receiving external prescriptions.

Sections:

| Section             | Contents                              |
| ------------------- | ------------------------------------- |
| Patient             | Search/create patient                 |
| Prescription source | External/internal/telemedicine/refill |
| Upload              | Photo/PDF/scanned document            |
| Prescriber          | Name, cadre, facility, licence number |
| Medicine entry      | Prescribed items                      |
| Notes               | Clarification, special instructions   |
| Status              | Pending pharmacist review             |

Key buttons:

```text
Upload prescription
Add medicine
Send to pharmacist review
Mark needs clarification
Reject prescription
```

---

## Screen 2: Dispensing queue

This is the pharmacist’s worklist.

Filters:

| Filter                       |
| ---------------------------- |
| Pending review               |
| Approved but not billed      |
| Paid but not handed over     |
| Partially dispensed          |
| Controlled medicine          |
| Clinical warning             |
| External prescription        |
| Internal clinic prescription |
| Refill due                   |
| Rejected/cancelled           |

Columns:

| Column              |
| ------------------- |
| Queue number        |
| Patient             |
| Prescription source |
| Prescriber          |
| Items               |
| Risk level          |
| Payment status      |
| Dispense status     |
| Waiting time        |
| Assigned pharmacist |

---

## Screen 3: Patient medication profile

This is the safety screen.

Sections:

| Section            | Contents                      |
| ------------------ | ----------------------------- |
| Demographics       | Age, sex, weight              |
| Allergies          | Known allergies               |
| Conditions         | Chronic conditions            |
| Current medicines  | Active medicine list          |
| Previous dispenses | History                       |
| ADR history        | Reported reactions            |
| Refill plans       | Active repeats                |
| Warnings           | Current safety warnings       |
| Consent            | SMS/WhatsApp/refill reminders |

---

## Screen 4: Dispensing workstation

This is where the pharmacist reviews and approves.

Panels:

| Panel                   | Contents                                      |
| ----------------------- | --------------------------------------------- |
| Prescription image/text | Uploaded or internal prescription             |
| Prescriber details      | Name, facility, licence                       |
| Patient safety          | Allergies, age, pregnancy, chronic conditions |
| Prescribed items        | Medicine, dose, duration                      |
| Available stock         | Batch, expiry, quantity, price                |
| Warnings                | Allergy, interaction, duplicate, stock        |
| Decisions               | Approve, substitute, partial, reject          |
| Label preview           | Patient instructions                          |
| POS link                | Bill status and payment                       |

---

## Screen 5: Substitution and partial dispense dialog

Required fields:

| Field                             |
| --------------------------------- |
| Prescribed medicine               |
| Selected replacement              |
| Reason                            |
| Dose equivalence                  |
| Quantity prescribed               |
| Quantity dispensed                |
| Balance remaining                 |
| Patient informed                  |
| Prescriber contacted              |
| Pharmacist approval PIN/signature |

---

## Screen 6: Controlled medicine register

Sections:

| Section          | Contents                                    |
| ---------------- | ------------------------------------------- |
| Stock balance    | Opening, received, dispensed, closing       |
| Dispense entries | Patient, prescription, prescriber, quantity |
| Adjustments      | Corrections, losses, quarantine             |
| Reconciliation   | Physical vs system balance                  |
| Approvals        | Pharmacist/superintendent                   |
| Export           | PDF/Excel controlled register               |

---

## Screen 7: Label printing screen

Features:

| Feature             |
| ------------------- |
| Label preview       |
| Language selection  |
| Warning stickers    |
| Batch/expiry toggle |
| Reprint reason      |
| Printer selection   |
| Print history       |

---

## Screen 8: Recall and batch lookup

Search by:

| Search key            |
| --------------------- |
| Product               |
| Batch                 |
| Supplier              |
| Patient               |
| Prescription          |
| Sale/invoice          |
| Dispensing pharmacist |
| Date range            |
| Branch                |

Must show:

```text
Stock remaining
Patients supplied
Quantities dispensed
Invoice references
Contact details
Recall action status
```

---

## Screen 9: Dispense audit screen

Shows timeline:

```text
Prescription uploaded → pharmacist reviewed → substitution approved → batch selected → paid → label printed → medicine handed over
```

Each step should show:

| Field     |
| --------- |
| User      |
| Role      |
| Date/time |
| Device    |
| Branch    |
| Action    |
| Reason    |
| Approval  |

---

# 7. Workflows

## A. External prescription workflow

```text
1. Patient presents paper/photo/PDF prescription
2. Cashier/pharmacy assistant captures patient
3. Prescription is uploaded or entered
4. Prescriber details are captured
5. Prescription enters pharmacist review queue
6. Pharmacist checks patient profile, medicine, dose, warnings
7. Pharmacist selects available stock batch/expiry
8. Pharmacist approves, substitutes, partially dispenses, or rejects
9. Approved items are sent to POS
10. Patient pays
11. eTIMS invoice/receipt is generated in Module 2
12. Label is printed
13. Medicine is handed over
14. Dispense audit is completed
```

---

## B. Internal clinic prescription workflow

```text
1. Clinician prescribes in EMR
2. Prescription appears in pharmacy queue
3. Pharmacist reviews patient profile and warnings
4. Pharmacist selects actual medicine and batch
5. Substitution or partial dispense is recorded if needed
6. Prescription is sent to billing
7. Patient pays or insurer/SHA split is applied
8. Medicine label is printed
9. Dispense is completed
10. EMR medication history updates automatically
```

---

## C. Prescription-only medicine scanned at POS

```text
1. Cashier scans medicine
2. System detects prescription-only category
3. POS blocks direct sale
4. System asks for patient and prescription
5. Prescription is sent to pharmacist review
6. Only approved dispense returns to POS for payment
```

Correct behaviour:

```text
Cashier cannot bypass pharmacist approval for configured prescription-only medicines.
```

---

## D. Partial dispensing workflow

```text
1. Prescription requires 30 tablets
2. Patient can afford 10 or stock only has 10
3. Pharmacist chooses partial dispense
4. System records reason
5. Balance of 20 remains on prescription
6. Label prints for 10 tablets only
7. POS bills 10 tablets only
8. Patient can later return for remaining balance if prescription remains valid
```

---

## E. Substitution workflow

```text
1. Prescription says Brand A
2. Brand A is out of stock or too expensive
3. Pharmacist selects equivalent Brand B/generic
4. System records substitution reason
5. Patient is informed
6. Prescriber approval is captured if required
7. Label prints actual dispensed product
8. Audit shows prescribed vs dispensed medicine
```

---

## F. Refill workflow

```text
1. Patient has chronic prescription with 3 repeats
2. First dispense creates refill plan
3. System calculates next refill date
4. Reminder is sent only if patient consent exists
5. Patient returns
6. Pharmacist reviews remaining repeats
7. Refill is approved and dispensed
8. Repeats remaining reduce by 1
9. When repeats are exhausted, system requires new prescription
```

---

## G. Controlled medicine workflow

```text
1. Controlled medicine is prescribed
2. System requires patient, prescriber, prescription, and pharmacist approval
3. System checks controlled stock balance
4. Dispense creates controlled register entry
5. POS bills medicine
6. Stock balance updates
7. Register closing balance updates
8. Any correction requires formal adjustment and approval
```

---

## H. Adverse drug reaction workflow

PPB runs PvERS, the Pharmacovigilance Electronic Reporting System, and its guest/provider pages show reporting routes for suspected adverse drug reactions, poor-quality health products, medication errors, medical devices, and other safety issues. ([pv.pharmacyboardkenya.org](https://pv.pharmacyboardkenya.org/users/guest))

```text
1. Patient reports reaction or poor-quality medicine
2. Pharmacist opens ADR/PQMP record
3. System captures patient, medicine, batch, dates, symptoms
4. System links report to original dispense
5. Pharmacist submits through PvERS or exports required details
6. Follow-up is recorded
```

---

# 8. Rules engine

## Dispensing allowed

```text
RULE: Dispense prescription medicine
IF branch.PPB_licence = active
AND branch.superintendent = active
AND pharmacist.practising_licence = active
AND prescription.exists = true
AND patient.exists = true
AND medicine.prescription_required = true
AND pharmacist_approval = approved
AND batch.status = sellable
AND batch.expiry_date > today
THEN allow dispense
ELSE block and show missing requirements
```

## OTC medicine sale

```text
RULE: OTC sale
IF medicine.category = OTC
AND batch.status = sellable
AND batch.expiry_date > today
THEN allow POS sale
ELSE block or require pharmacist review
```

## Controlled medicine

```text
RULE: Controlled medicine dispense
IF medicine.controlled = true
AND prescription.exists = true
AND patient.exists = true
AND prescriber.details_complete = true
AND pharmacist_approval = approved
AND controlled_register_entry_created = true
THEN allow dispense
ELSE block
```

## Partial dispense

```text
RULE: Partial dispensing
IF quantity_dispensed < quantity_prescribed
THEN require reason
AND create balance record
AND pharmacist approval
```

## Substitution

```text
RULE: Substitution
IF dispensed_product != prescribed_product
THEN require substitution_type
AND reason
AND patient_informed = true
AND pharmacist approval
AND prescriber approval if configured
```

## Clinical warning

```text
RULE: Critical warning
IF warning.severity = critical
THEN block dispense
UNLESS senior pharmacist override is allowed
AND reason is captured
```

## Batch and expiry

```text
RULE: Batch selection
IF product.batch_controlled = true
THEN batch_number and expiry_date are mandatory
AND expired/recalled/quarantined batches are blocked
```

## Refill

```text
RULE: Refill dispense
IF prescription.repeat_allowed = true
AND repeats_remaining > 0
AND prescription.valid_until >= today
THEN allow pharmacist review
ELSE require new prescription
```

---

# 9. Data model

## Main tables

### `patients`

| Field                   |
| ----------------------- |
| id                      |
| patient_number          |
| full_name               |
| date_of_birth           |
| age_estimated           |
| sex                     |
| phone                   |
| guardian_name           |
| weight                  |
| pregnancy_status        |
| breastfeeding_status    |
| chronic_conditions_json |
| consent_sms             |
| consent_whatsapp        |
| status                  |
| created_at              |

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

### `prescribers`

| Field               |
| ------------------- |
| id                  |
| full_name           |
| cadre               |
| registration_number |
| licence_number      |
| facility_name       |
| phone               |
| email               |
| verification_status |
| verified_at         |
| notes               |

### `prescriptions`

| Field                |
| -------------------- |
| id                   |
| prescription_number  |
| source               |
| patient_id           |
| prescriber_id        |
| internal_visit_id    |
| prescription_date    |
| valid_until          |
| uploaded_document_id |
| diagnosis_text       |
| status               |
| repeat_allowed       |
| total_repeats        |
| repeats_used         |
| entered_by           |
| reviewed_by          |
| reviewed_at          |
| review_notes         |
| created_at           |

### `prescription_items`

| Field                   |
| ----------------------- |
| id                      |
| prescription_id         |
| prescribed_product_id   |
| prescribed_generic_name |
| strength                |
| dosage_form             |
| dose                    |
| frequency               |
| duration                |
| route                   |
| quantity_prescribed     |
| instructions            |
| substitution_allowed    |
| status                  |
| warning_status          |

### `dispenses`

| Field             |
| ----------------- |
| id                |
| prescription_id   |
| patient_id        |
| branch_id         |
| dispense_number   |
| dispense_type     |
| status            |
| pharmacist_id     |
| approved_at       |
| handed_over_by    |
| handed_over_at    |
| sale_id           |
| invoice_id        |
| counselling_done  |
| counselling_notes |
| created_at        |

### `dispense_lines`

| Field                   |
| ----------------------- |
| id                      |
| dispense_id             |
| prescription_item_id    |
| prescribed_product_id   |
| dispensed_product_id    |
| quantity_prescribed     |
| quantity_dispensed      |
| balance_quantity        |
| batch_id                |
| expiry_date             |
| substitution_flag       |
| substitution_reason     |
| partial_dispense_flag   |
| partial_dispense_reason |
| label_printed           |
| label_printed_at        |
| status                  |

### `controlled_medicine_register`

| Field                 |
| --------------------- |
| id                    |
| branch_id             |
| register_entry_number |
| medicine_id           |
| batch_id              |
| transaction_type      |
| prescription_id       |
| dispense_id           |
| patient_id            |
| prescriber_id         |
| opening_balance       |
| quantity_in           |
| quantity_out          |
| quantity_adjusted     |
| closing_balance       |
| pharmacist_id         |
| witness_user_id       |
| reason                |
| entry_datetime        |
| status                |

### `clinical_warnings`

| Field               |
| ------------------- |
| id                  |
| patient_id          |
| prescription_id     |
| dispense_id         |
| warning_type        |
| severity            |
| message             |
| medicine_id         |
| related_medicine_id |
| status              |
| generated_at        |
| acknowledged_by     |
| overridden_by       |
| override_reason     |
| overridden_at       |

### `refill_plans`

| Field                |
| -------------------- |
| id                   |
| patient_id           |
| prescription_id      |
| prescription_item_id |
| medicine_id          |
| start_date           |
| next_refill_date     |
| last_refill_date     |
| days_supply          |
| total_repeats        |
| repeats_used         |
| repeats_remaining    |
| status               |

### `medicine_labels`

| Field               |
| ------------------- |
| id                  |
| dispense_line_id    |
| patient_id          |
| label_text          |
| language            |
| warning_labels_json |
| printed_by          |
| printed_at          |
| reprint_count       |
| last_reprint_reason |

### `dispense_audit_logs`

| Field          |
| -------------- |
| id             |
| dispense_id    |
| entity_type    |
| entity_id      |
| action         |
| old_value_json |
| new_value_json |
| reason         |
| performed_by   |
| approved_by    |
| branch_id      |
| device_id      |
| created_at     |

### `adr_reports`

| Field                |
| -------------------- |
| id                   |
| patient_id           |
| dispense_id          |
| medicine_id          |
| batch_id             |
| report_type          |
| reaction_description |
| onset_date           |
| seriousness          |
| outcome              |
| reporter_user_id     |
| pvers_reference      |
| submitted_at         |
| status               |

---

# 10. API design

## Prescription endpoints

| Endpoint                                 | Purpose                       |
| ---------------------------------------- | ----------------------------- |
| `POST /prescriptions`                    | Create prescription           |
| `POST /prescriptions/{id}/upload`        | Upload prescription image/PDF |
| `POST /prescriptions/{id}/items`         | Add prescribed medicine       |
| `POST /prescriptions/{id}/submit-review` | Send to pharmacist queue      |
| `POST /prescriptions/{id}/review`        | Pharmacist review             |
| `POST /prescriptions/{id}/reject`        | Reject prescription           |
| `GET /prescriptions/search`              | Search prescriptions          |

## Dispensing endpoints

| Endpoint                          | Purpose                 |
| --------------------------------- | ----------------------- |
| `GET /dispensing/queue`           | Pharmacist queue        |
| `POST /dispenses`                 | Create dispense record  |
| `POST /dispenses/{id}/approve`    | Pharmacist approval     |
| `POST /dispenses/{id}/substitute` | Record substitution     |
| `POST /dispenses/{id}/partial`    | Record partial dispense |
| `POST /dispenses/{id}/complete`   | Complete dispense       |
| `POST /dispenses/{id}/reverse`    | Reverse dispense        |
| `GET /dispenses/{id}/audit`       | View audit trail        |

## Warning endpoints

| Endpoint                                   | Purpose              |
| ------------------------------------------ | -------------------- |
| `POST /clinical-warnings/check`            | Run warning checks   |
| `POST /clinical-warnings/{id}/acknowledge` | Acknowledge warning  |
| `POST /clinical-warnings/{id}/override`    | Override with reason |

## Refill endpoints

| Endpoint                           | Purpose             |
| ---------------------------------- | ------------------- |
| `POST /refill-plans`               | Create refill plan  |
| `GET /patients/{id}/refills`       | View active refills |
| `POST /refill-plans/{id}/dispense` | Dispense refill     |
| `POST /refill-plans/{id}/cancel`   | Cancel refill plan  |

## Controlled register endpoints

| Endpoint                               | Purpose               |
| -------------------------------------- | --------------------- |
| `GET /controlled-register`             | View register         |
| `POST /controlled-register/entry`      | Create register entry |
| `POST /controlled-register/reconcile`  | Reconcile balance     |
| `POST /controlled-register/adjustment` | Controlled adjustment |
| `GET /controlled-register/export`      | Export report         |

## Label endpoints

| Endpoint               | Purpose                |
| ---------------------- | ---------------------- |
| `POST /labels/preview` | Generate label preview |
| `POST /labels/print`   | Print label            |
| `POST /labels/reprint` | Reprint with reason    |

## ADR/pharmacovigilance endpoints

| Endpoint                        | Purpose                 |
| ------------------------------- | ----------------------- |
| `POST /adr-reports`             | Create ADR/PQMP report  |
| `POST /adr-reports/{id}/submit` | Mark submitted/exported |
| `GET /adr-reports/search`       | Search reports          |

---

# 11. Integration points

| Integration             | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| Organisation/licensing  | Verify PPB branch licence and professional licence     |
| POS/billing             | Bill approved medicines and handle payment/eTIMS       |
| Inventory               | Batch, expiry, stock, recalls, FEFO                    |
| Clinic EMR              | Receive internal prescriptions                         |
| Lab module              | Link medicine decisions to lab results where available |
| Claims module           | Price medicines under insurer/SHA benefit rules        |
| Notifications           | Refill reminders and follow-up                         |
| Pharmacovigilance/PvERS | ADR/PQMP reporting support                             |
| Traceability/GS1        | GTIN, batch, serial, scan events                       |
| Reporting               | Compliance, safety, revenue, margin, stock movement    |

---

# 12. Permissions

| Permission                    |            Cashier |          Assistant | Pharmacist/Technologist | Superintendent | Manager | Auditor |
| ----------------------------- | -----------------: | -----------------: | ----------------------: | -------------: | ------: | ------: |
| Create patient                |                Yes |                Yes |                     Yes |            Yes |     Yes |    View |
| Upload prescription           |                Yes |                Yes |                     Yes |            Yes |      No |    View |
| Enter prescription item       |            Limited |                Yes |                     Yes |            Yes |      No |    View |
| Approve prescription dispense |                 No |                 No |                     Yes |            Yes |      No |    View |
| Override clinical warning     |                 No |                 No |                     Yes |            Yes |      No |    View |
| Dispense controlled medicine  |                 No |                 No |            Configurable |            Yes |      No |    View |
| Substitute medicine           |                 No |                 No |                     Yes |            Yes |      No |    View |
| Partial dispense              |                 No |                 No |                     Yes |            Yes |      No |    View |
| Print label                   | Yes after approval | Yes after approval |                     Yes |            Yes |      No |    View |
| Reverse dispense              |                 No |                 No |                 Limited |            Yes |     Yes |    View |
| Adjust controlled register    |                 No |                 No |              No/limited |            Yes |      No |    View |
| View controlled register      |                 No |                 No |                     Yes |            Yes | Limited |     Yes |
| Export audit report           |                 No |                 No |                      No |            Yes |     Yes |     Yes |

---

# 13. Reports

## Operational reports

| Report                            | Purpose                           |
| --------------------------------- | --------------------------------- |
| Daily dispensing report           | All medicines dispensed           |
| Prescription-only dispense report | Compliance                        |
| Controlled medicine register      | High-risk medicine accountability |
| Partial dispense report           | Patient balances and stock issues |
| Substitution report               | Brand/generic changes             |
| Refill due report                 | Chronic care                      |
| Refill missed report              | Adherence follow-up               |
| Pharmacist activity report        | Professional accountability       |
| Dispense by batch report          | Recall readiness                  |
| Near-expiry dispensed report      | Safety and policy review          |
| Rejected prescription report      | Quality control                   |
| Clinical warning override report  | Risk management                   |
| Label reprint report              | Safety audit                      |
| ADR/PQMP report                   | Pharmacovigilance support         |

## Owner dashboard cards

```text
Prescriptions pending review
Prescriptions dispensed today
Prescription-only sales
Controlled medicine balance alerts
Partial dispenses pending balance
Substitutions today
Near-expiry medicine dispensed
Clinical warnings overridden
Top dispensed medicines
Gross margin on dispensed medicines
Rejected/unclear prescriptions
ADR/PQMP reports opened
```

---

# 14. Edge cases

| Edge case                                               | Correct handling                                                                               |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Patient brings unclear prescription                     | Mark “needs clarification”; do not dispense until resolved                                     |
| Prescription photo is blurry                            | Require re-upload or pharmacist override                                                       |
| Patient cannot afford full prescription                 | Partial dispensing with reason and balance                                                     |
| Prescribed brand out of stock                           | Substitution workflow                                                                          |
| Medicine has no batch in stock                          | Block if batch-controlled                                                                      |
| Batch expired                                           | Block                                                                                          |
| Batch recalled                                          | Block and alert                                                                                |
| Patient has allergy                                     | Critical warning                                                                               |
| Patient pays before pharmacist approval                 | Configure either block payment or hold bill pending approval                                   |
| Pharmacist approves but patient does not pay            | Dispense remains approved-not-handed-over; stock not finalized or reserved depending on policy |
| Label printer fails                                     | Allow reprint; medicine should not be handed over without label unless override                |
| Prescription item already dispensed elsewhere in branch | Warn duplicate dispense                                                                        |
| Refill too early                                        | Require pharmacist review                                                                      |
| Controlled stock balance mismatch                       | Freeze controlled dispensing until reconciled or senior override                               |
| Return of medicine                                      | Quarantine by default unless policy and pharmacist allow resale                                |
| Wrong medicine dispensed                                | Incident workflow, reversal, patient contact, possible ADR/medication error report             |

---

# 15. MVP versus later versions

## MVP

Build these first:

| Feature                           | Reason                             |
| --------------------------------- | ---------------------------------- |
| Prescription entry/upload         | Core compliance                    |
| Patient profile                   | Safety and history                 |
| Prescriber details                | Accountability                     |
| Pharmacist approval               | Prevent cashier-only dispensing    |
| Batch/expiry selection            | Recall and quality                 |
| Dosage instructions               | Label and safety                   |
| Label printing                    | Patient safety                     |
| Partial dispensing                | Kenyan affordability reality       |
| Substitution logging              | Audit and stock reality            |
| Basic refill tracking             | Chronic-care support               |
| Dispense audit                    | Compliance                         |
| POS integration                   | Billing/payment                    |
| Inventory integration             | Stock decrement                    |
| Basic clinical warnings           | Allergy, duplicate, age, pregnancy |
| Controlled medicine flag/register | High-risk compliance               |

## Version 2

Add:

| Feature                                    | Reason                    |
| ------------------------------------------ | ------------------------- |
| Advanced drug interaction database         | Better clinical safety    |
| Prescriber verification workflow           | Reduce fake prescriptions |
| Patient medication history across branches | Continuity                |
| SMS/WhatsApp refill reminders              | Chronic-care adherence    |
| Medicine counselling checklist             | Professional quality      |
| ADR/PQMP export to PvERS                   | Pharmacovigilance support |
| Barcode/DataMatrix batch scanning          | Faster, safer dispensing  |
| Cold-chain checks                          | Vaccine/insulin safety    |
| Controlled register reconciliation         | Stronger compliance       |
| Insurance formulary rules                  | Claims accuracy           |

## Version 3

Add:

| Feature                                        | Reason                                  |
| ---------------------------------------------- | --------------------------------------- |
| National e-prescription integration            | Future Digital Health Agency readiness  |
| PPB/PRIMS product validation                   | Product authenticity                    |
| GS1 serialization                              | Full traceability                       |
| AI-assisted safety screening                   | Risk detection                          |
| Patient app medication wallet                  | Refills and instructions                |
| Remote pharmacist review                       | Chain/telepharmacy support where lawful |
| Advanced pharmacovigilance                     | Signal detection and follow-up          |
| FHIR MedicationRequest/MedicationDispense APIs | Interoperability                        |

---

# 16. Acceptance criteria

The module is ready when it passes these tests:

| Test                           | Expected result                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------- |
| External prescription uploaded | Prescription enters pharmacist queue                                             |
| Prescription-only item scanned | POS blocks direct sale and requires prescription workflow                        |
| Pharmacist approval            | Only licensed pharmacy user can approve dispensing                               |
| Patient allergy warning        | System warns or blocks medicine                                                  |
| Partial dispensing             | System records reason, quantity supplied, and balance                            |
| Substitution                   | System records prescribed item, dispensed item, reason, and approver             |
| Refill                         | System tracks repeats used and remaining                                         |
| Controlled medicine            | Register entry is created with patient, prescriber, quantity, batch, and balance |
| Batch selection                | Expired/recalled/quarantined batch cannot be dispensed                           |
| Label printing                 | Label includes patient, medicine, dosage, date, and instructions                 |
| Dispense-to-POS                | Approved dispense creates billable POS line                                      |
| Payment complete               | Dispense links to sale/invoice/payment                                           |
| Recall lookup                  | System identifies all patients supplied from a batch                             |
| Audit                          | System shows who entered, approved, billed, dispensed, and handed over medicine  |
| ADR report                     | System can create report linked to patient, medicine, batch, and dispense        |

---

# 17. Final product behaviour

The Pharmacy Dispensing Module should behave like this:

| Situation                           | Correct behaviour                                   |
| ----------------------------------- | --------------------------------------------------- |
| OTC medicine                        | Allow fast sale with stock and expiry checks        |
| Prescription medicine               | Require patient, prescription, pharmacist approval  |
| Controlled medicine                 | Require stricter register and approval              |
| External prescription               | Upload, capture prescriber, pharmacist review       |
| Internal clinic prescription        | Flow directly from EMR to pharmacy queue            |
| Patient cannot afford full quantity | Partial dispense with balance tracking              |
| Brand unavailable                   | Substitution with reason and approval               |
| Chronic patient                     | Refill plan and medication history                  |
| Allergy or warning                  | Alert, block, or require override                   |
| Batch recalled                      | Block and find affected patients                    |
| Medicine handed over                | Label, audit, stock movement, POS invoice complete  |
| Patient reports reaction            | Create ADR/PQMP record linked to batch and dispense |

The key design principle is:

**No prescription medicine should leave the pharmacy without a patient, a prescription, a responsible professional, a batch, instructions, and an audit trail.**

You are exactly right. **Module 3 currently has a clinical-decision-support gap.** Allergy checks, drug–drug interactions, pregnancy warnings, duplicate therapy detection, antibiotic stewardship, and contraindication checks cannot be implemented safely from ordinary product-master data alone.

They require a **drug knowledge base**, terminology mapping, evidence governance, update cycles, pharmacist review, and alert-fatigue controls.

I would close this as a new architecture decision:

```text
ADR-021: Medication Safety Knowledge Base and Clinical Decision Support Strategy
```

---

# 1. Architecture decision

For this Kenyan 10-branch enterprise rollout, I recommend a **hybrid staged approach**, not a purely manual table and not an immediate fully commercial dependency.

## Recommended path

| Stage                           | Recommendation                                                                               | Why                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| MVP / Version 1                 | **Kenya KEML + local formulary + RxNorm/ATC mapping + curated safety tables**                | Kenya-local, controllable, affordable, auditable      |
| Version 2                       | **Add open knowledge sources and structured update process**                                 | Improves safety coverage without vendor lock-in       |
| Version 3 / Enterprise maturity | **Integrate commercial drug knowledge base such as FDB, Medi-Span, DrugBank, or equivalent** | Needed for robust enterprise-grade clinical screening |

The MVP should **not pretend to be a full clinical decision support engine**. It should clearly implement:

```text
Level 1 safety checks:
    allergy ingredient/class checks
    duplicate therapy by therapeutic class
    pregnancy/breastfeeding caution flags
    paediatric/age flags
    controlled medicine flags
    antibiotic AWaRe category flags
    selected high-risk drug-drug interactions
    local formulary/KEPH-level restrictions
```

Then Version 2/3 expands to deeper interaction, contraindication, dose, disease, renal, hepatic, pregnancy, and lactation intelligence.

---

# 2. Why KEML alone is not enough

KEML is essential but it is **not a drug interaction database**.

The Kenya Essential Medicines List 2023 is intended to guide access to essential medicines and lists medicines by therapeutic category, INN, dosage form, strength, and level of use; it also includes AWaRe classification for antibiotics. That makes it a strong local formulary base, but not sufficient for automated interaction, pregnancy, allergy, and duplicate-therapy screening by itself. ([kemsa.go.ke](https://www.kemsa.go.ke/download/file/8e7d9c438ecc1a468d9d7615a87688df.pdf))

So the knowledge architecture should separate:

| Knowledge area                   | Best source                                                 |
| -------------------------------- | ----------------------------------------------------------- |
| Kenya formulary and level-of-use | KEML                                                        |
| Local therapeutic categories     | KEML + local pharmacy formulary                             |
| Antibiotic stewardship           | KEML AWaRe + WHO AWaRe                                      |
| Ingredient terminology           | RxNorm/UMLS mapping                                         |
| Drug–drug interactions           | Curated local table initially; commercial/open source later |
| Allergy matching                 | Ingredient/class table                                      |
| Pregnancy/lactation warnings     | Curated local table initially; SPL/commercial later         |
| Duplicate therapy                | ATC/RxNorm ingredient/class grouping                        |
| Patient-friendly information     | MedlinePlus or curated local templates                      |
| Pharmacovigilance                | PPB PvERS workflow                                          |

WHO’s Model Lists of Essential Medicines are updated every two years, and the current versions were updated in September 2025; WHO’s AWaRe classification groups antibiotics into Access, Watch, and Reserve categories to support antibiotic stewardship and is also updated every two years. ([who.int](https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines/essential-medicines-lists)) ([who.int](https://www.who.int/publications/i/item/B09489))

---

# 3. Corrected Module 3 design: Medication Safety Knowledge Base

Add this as a new submodule under Module 3:

```text
Module 3A: Medication Safety Knowledge Base and Clinical Decision Support
```

It serves:

```text
EMR prescription
Pharmacy dispensing
Online pharmacy prescription upload
Refill/repeat review
Controlled medicine review
Claims drug validation
Patient counselling
ADR/pharmacovigilance
```

---

# 4. Recommended MVP knowledge stack

## 4.1 Core local formulary

Use KEML 2023 as the Kenya-local starting point.

| Data                     | Source/use                                 |
| ------------------------ | ------------------------------------------ |
| INN/generic name         | KEML                                       |
| Dosage form              | KEML                                       |
| Strength                 | KEML                                       |
| Therapeutic category     | KEML                                       |
| KEPH/facility level      | KEML                                       |
| AWaRe classification     | KEML and WHO AWaRe                         |
| Local product mapping    | Internal product catalogue                 |
| Branch formulary         | Which branches stock/dispense what         |
| Prescription category    | Internal/PPB-aligned configuration         |
| Controlled medicine flag | Internal controlled register configuration |

---

## 4.2 Terminology backbone

Use RxNorm as the terminology bridge where possible.

RxNorm provides normalized names for clinical drugs and links names to many drug vocabularies used in pharmacy management and drug-interaction software; the National Library of Medicine provides RxNorm files and APIs for accessing RxNorm data. ([nlm.nih.gov](https://www.nlm.nih.gov/research/umls/rxnorm/index.html)) ([lhncbc.nlm.nih.gov](https://lhncbc.nlm.nih.gov/RxNav/APIs/RxNormAPIs.html))

| Terminology        | Use                                            |
| ------------------ | ---------------------------------------------- |
| RxNorm RxCUI       | Ingredient/clinical drug identity where mapped |
| ATC code           | Duplicate therapy and therapeutic class        |
| Local product code | POS/inventory/dispensing                       |
| INN/generic name   | Kenya formulary                                |
| Brand name         | Product master                                 |
| Strength/form      | Dispensing and equivalence                     |
| Route              | Clinical safety and label                      |
| Pack size          | Inventory/POS                                  |

MVP should not require every local brand to map perfectly to RxNorm. Instead, the **generic ingredient** should be the safety anchor.

Example:

```text
Local brand: Amoxil 500mg capsule
Generic ingredient: amoxicillin
RxNorm ingredient: amoxicillin
ATC: J01CA04
KEML category: anti-infective
AWaRe: Access
```

---

## 4.3 Safety rules table

Create curated local tables for the first version.

| Rule type              | MVP implementation                                                     |
| ---------------------- | ---------------------------------------------------------------------- |
| Allergy                | Ingredient and drug-class matching                                     |
| Duplicate therapy      | ATC/class matching                                                     |
| Pregnancy              | Contraindicated/caution/unknown flags                                  |
| Breastfeeding          | Caution/avoid/unknown flags                                            |
| Drug–drug interaction  | Curated high-risk list only                                            |
| Age restriction        | Paediatric/elderly warnings                                            |
| Antibiotic stewardship | AWaRe category display                                                 |
| Controlled medicines   | Controlled flag and approval workflow                                  |
| Refill risk            | Early refill/duplicate active therapy                                  |
| Disease caution        | Optional selected rules: asthma, hypertension, diabetes, renal disease |

---

# 5. Clinical decision support levels

## Level 1: MVP safety checks

This is what should ship first.

| Safety check             | MVP behaviour                                                          |
| ------------------------ | ---------------------------------------------------------------------- |
| Allergy ingredient match | Alert if prescribed/dispensed ingredient matches recorded allergy      |
| Allergy class match      | Alert if allergy class matches medicine class                          |
| Duplicate therapy        | Alert if patient already has active medicine in same therapeutic class |
| Pregnancy warning        | Alert if medicine is contraindicated/caution in pregnancy              |
| Breastfeeding warning    | Alert if medicine has breastfeeding caution                            |
| Paediatric warning       | Alert if age below configured minimum                                  |
| Elderly caution          | Alert for selected high-risk medicines                                 |
| Interaction check        | Alert for curated high-severity pairs                                  |
| Antibiotic AWaRe         | Show Access/Watch/Reserve category                                     |
| Controlled medicine      | Require controlled register workflow                                   |
| Refill too early         | Require pharmacist review                                              |
| Substitution risk        | Check ingredient equivalence and class                                 |

---

## Level 2: Enhanced open-source safety

Add after MVP.

| Capability                     | Source/approach                                  |
| ------------------------------ | ------------------------------------------------ |
| Broader RxNorm mapping         | RxNorm files/API                                 |
| Structured drug labeling       | DailyMed/FDA SPL                                 |
| Pregnancy/lactation expansion  | FDA SPL/PLLR-based structured mapping            |
| Patient education              | MedlinePlus-style patient-friendly content       |
| More interaction rules         | Curated open datasets plus pharmacist validation |
| ATC-based grouping             | WHO/ATC mapping where licensed/available         |
| Antibiotic stewardship reports | AWaRe analytics                                  |
| ADR reporting support          | PPB PvERS workflow                               |

FDA’s Structured Product Labeling is an HL7-approved document markup standard adopted by FDA for exchanging product and facility information, and DailyMed provides SPL label downloads including product and ingredient indexing resources. FDA’s pregnancy and lactation labeling resources describe PLLR content intended to help healthcare providers assess benefit versus risk and counsel pregnant or breastfeeding patients. ([fda.gov](https://www.fda.gov/industry/fda-data-standards-advisory-board/structured-product-labeling-resources)) ([dailymed.nlm.nih.gov](https://dailymed.nlm.nih.gov/dailymed/spl-resources.cfm)) ([fda.gov](https://www.fda.gov/drugs/labeling-information-drug-products/pregnancy-and-lactation-labeling-resources))

---

## Level 3: Commercial enterprise CDS

Use when the organisation is ready to pay for, govern, and clinically validate vendor-provided rules.

| Vendor type      | Value                                                                         |
| ---------------- | ----------------------------------------------------------------------------- |
| First Databank   | Deep medication screening and clinical rules                                  |
| Medi-Span        | Mature interaction, allergy, duplicate therapy and contraindication screening |
| DrugBank         | API-first structured drug knowledge                                           |
| Micromedex/other | Enterprise clinical pharmacy reference                                        |

For this project, I would not hard-code a commercial vendor into the base product. I would create a **Drug Knowledge Provider Interface** so the system can start with local tables and later switch to or augment with a vendor.

---

# 6. Proposed CDS architecture

## 6.1 High-level architecture

```text
Prescription / Dispense Request
        ↓
Medication Safety Service
        ↓
Patient context
    - age
    - sex
    - pregnancy/breastfeeding
    - allergies
    - active medicines
    - chronic conditions
        ↓
Drug knowledge base
    - local formulary
    - ingredients
    - ATC/classes
    - KEML/KEPH level
    - AWaRe
    - interaction rules
    - pregnancy rules
    - allergy class rules
        ↓
Rules engine
        ↓
Safety alerts
    - informational
    - warning
    - high
    - critical/blocking
        ↓
Pharmacist/clinician action
    - accept
    - change
    - override with reason
    - reject
    - contact prescriber
```

---

## 6.2 Service boundary

Add a dedicated service/module:

```text
medication-safety
```

Responsibilities:

| Responsibility                    |
| --------------------------------- |
| Drug normalization                |
| Ingredient mapping                |
| Allergy matching                  |
| Duplicate therapy screening       |
| DDI screening                     |
| Pregnancy/breastfeeding screening |
| AWaRe antibiotic flagging         |
| Controlled medicine flagging      |
| Safety alert generation           |
| Alert severity ranking            |
| Override capture                  |
| Knowledge-base versioning         |
| Safety-rule governance            |
| Audit and reporting               |

---

# 7. Data model additions

Add these tables to the SQL Server model.

## 7.1 Drug knowledge source tables

### `pharmacy.drug_knowledge_sources`

| Field            | Purpose                                     |
| ---------------- | ------------------------------------------- |
| id               | Source ID                                   |
| source_name      | KEML, WHO EML, RxNorm, Local, DrugBank, FDB |
| source_type      | formulary, terminology, safety, interaction |
| version          | Source version                              |
| effective_from   | Start date                                  |
| effective_to     | End date                                    |
| licence_type     | public, open, commercial, internal          |
| update_frequency | manual/monthly/quarterly/API                |
| status           | active/inactive                             |
| approved_by      | Governance                                  |
| approved_at      | Governance                                  |

---

### `pharmacy.drug_ingredients`

| Field                | Purpose                               |
| -------------------- | ------------------------------------- |
| id                   | Ingredient ID                         |
| ingredient_name      | Generic ingredient                    |
| normalized_name      | Search/mapping                        |
| rxnorm_rxcui         | RxNorm concept where available        |
| atc_code             | ATC where available                   |
| therapeutic_class_id | Local class                           |
| keml_flag            | In KEML yes/no                        |
| aware_category       | Access/Watch/Reserve where antibiotic |
| status               | Active/inactive                       |

---

### `pharmacy.product_ingredient_map`

| Field                  | Purpose                |
| ---------------------- | ---------------------- |
| id                     | Mapping ID             |
| product_id             | Local product          |
| ingredient_id          | Active ingredient      |
| strength_value         | Strength               |
| strength_unit          | mg, mL, %, etc.        |
| dosage_form            | Tablet/capsule/syrup   |
| route                  | Oral/topical/injection |
| mapping_confidence     | high/manual/unknown    |
| mapped_by              | User/source            |
| mapped_at              | Date                   |
| verified_by_pharmacist | Governance             |
| status                 | Active/inactive        |

This table is critical. Without it, brand-name products cannot be safely screened.

---

### `pharmacy.therapeutic_classes`

| Field                | Purpose                            |
| -------------------- | ---------------------------------- |
| id                   | Class ID                           |
| class_name           | NSAID, ACE inhibitor, beta blocker |
| parent_class_id      | Hierarchy                          |
| atc_prefix           | ATC grouping                       |
| duplicate_check_flag | Whether duplicate warning applies  |
| status               | Active/inactive                    |

---

## 7.2 Safety rule tables

### `pharmacy.drug_interaction_rules`

| Field                    | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| id                       | Rule ID                                       |
| ingredient_a_id          | First ingredient/class                        |
| ingredient_b_id          | Second ingredient/class                       |
| class_a_id               | Optional class-level rule                     |
| class_b_id               | Optional class-level rule                     |
| severity                 | info, minor, moderate, major, contraindicated |
| clinical_effect          | What may happen                               |
| mechanism                | Optional                                      |
| recommendation           | Avoid, monitor, adjust, counsel               |
| evidence_source          | KEML/local/FDA/commercial/etc.                |
| source_version           | Rule version                                  |
| active_flag              | Active/inactive                               |
| requires_override_reason | Yes/no                                        |
| block_dispense           | Yes/no                                        |
| reviewed_by              | Pharmacist/clinical reviewer                  |
| reviewed_at              | Date                                          |

---

### `pharmacy.allergy_cross_sensitivity_rules`

| Field                   | Purpose                        |
| ----------------------- | ------------------------------ |
| id                      | Rule ID                        |
| allergy_term            | Penicillin, sulfonamide, NSAID |
| ingredient_id           | Specific ingredient            |
| therapeutic_class_id    | Class                          |
| cross_sensitivity_group | Beta-lactam, NSAID, etc.       |
| severity                | warning/high/critical          |
| recommendation          | Avoid/verify/counsel           |
| source                  | Evidence                       |
| status                  | Active/inactive                |

---

### `pharmacy.pregnancy_lactation_rules`

| Field                       | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| id                          | Rule ID                                    |
| ingredient_id               | Medicine                                   |
| pregnancy_risk_level        | safe/caution/avoid/contraindicated/unknown |
| trimester_specific_flag     | Yes/no                                     |
| trimester_notes             | Optional                                   |
| breastfeeding_risk_level    | safe/caution/avoid/unknown                 |
| reproductive_potential_note | Optional                                   |
| recommendation              | Message                                    |
| source                      | Local/FDA/commercial                       |
| source_version              | Version                                    |
| reviewed_by                 | Clinical reviewer                          |
| reviewed_at                 | Date                                       |
| status                      | Active/inactive                            |

---

### `pharmacy.duplicate_therapy_rules`

| Field                          | Purpose                             |
| ------------------------------ | ----------------------------------- |
| id                             | Rule ID                             |
| therapeutic_class_id           | Class                               |
| duplicate_window_days          | Active medication window            |
| severity                       | info/warning/high                   |
| recommendation                 | Review therapy                      |
| exclude_same_prescription_flag | Whether combination therapy allowed |
| status                         | Active/inactive                     |

---

### `pharmacy.age_restriction_rules`

| Field          | Purpose               |
| -------------- | --------------------- |
| id             | Rule ID               |
| ingredient_id  | Medicine              |
| min_age_days   | Minimum age           |
| max_age_days   | Maximum age           |
| severity       | warning/high/critical |
| recommendation | Message               |
| source         | Evidence              |
| status         | Active/inactive       |

---

### `pharmacy.condition_caution_rules`

| Field          | Purpose                                       |
| -------------- | --------------------------------------------- |
| id             | Rule ID                                       |
| ingredient_id  | Medicine                                      |
| condition_code | Asthma, renal disease, hypertension, diabetes |
| severity       | info/warning/high/critical                    |
| recommendation | Message                                       |
| source         | Evidence                                      |
| status         | Active/inactive                               |

---

## 7.3 Alert and override tables

### `pharmacy.medication_safety_checks`

| Field                  | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| id                     | Check ID                                  |
| patient_id             | Patient                                   |
| visit_id               | EMR visit                                 |
| prescription_id        | Prescription                              |
| dispense_id            | Dispense                                  |
| check_context          | prescribe, dispense, refill, online_order |
| knowledge_base_version | Version used                              |
| checked_by             | System/user                               |
| checked_at             | Time                                      |
| status                 | passed, warnings, blocked                 |

---

### `pharmacy.medication_safety_alerts`

| Field                 | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| id                    | Alert ID                                           |
| safety_check_id       | Parent check                                       |
| alert_type            | allergy, ddi, pregnancy, duplicate, age, condition |
| severity              | info, warning, high, critical                      |
| ingredient_id         | Ingredient involved                                |
| related_ingredient_id | For DDI                                            |
| product_id            | Product involved                                   |
| message               | Display message                                    |
| recommendation        | What to do                                         |
| source                | Rule/source                                        |
| blocking_flag         | Blocks action                                      |
| acknowledged_by       | User                                               |
| acknowledged_at       | Time                                               |
| override_required     | Yes/no                                             |
| status                | open, acknowledged, overridden, resolved           |

---

### `pharmacy.medication_safety_overrides`

| Field                  | Purpose              |
| ---------------------- | -------------------- |
| id                     | Override ID          |
| alert_id               | Alert                |
| override_by            | Pharmacist/clinician |
| override_role          | Role                 |
| override_pin_verified  | Yes/no               |
| override_reason        | Required             |
| prescriber_contacted   | Yes/no               |
| patient_counselled     | Yes/no               |
| alternative_considered | Yes/no               |
| created_at             | Time                 |
| audit_event_id         | Link to audit        |

---

# 8. CDS provider abstraction

Build the rules engine so sources can change.

## Interface

```text
DrugKnowledgeProvider
    normalizeDrug(product)
    getIngredients(product)
    getTherapeuticClasses(ingredient)
    checkAllergy(patient, medication)
    checkInteractions(activeMedications, newMedication)
    checkPregnancy(patient, medication)
    checkDuplicateTherapy(activeMedications, newMedication)
    checkAge(patient, medication)
    checkConditionCautions(patient, medication)
```

## Providers

| Provider              | Use                                         |
| --------------------- | ------------------------------------------- |
| LocalKEMLProvider     | MVP formulary, local ingredient/class rules |
| RxNormProvider        | Ingredient and terminology mapping          |
| OpenLabelProvider     | SPL/pregnancy/label information later       |
| CommercialCDSProvider | FDB/Medi-Span/DrugBank later                |
| CompositeProvider     | Combines local and external sources         |

MVP uses:

```text
CompositeProvider
    ├── LocalKEMLProvider
    ├── LocalSafetyRulesProvider
    └── RxNormMappingProvider
```

Version 3 can add:

```text
CommercialCDSProvider
```

without rewriting pharmacy workflow.

---

# 9. Safety alert severity model

Alert severity must be strict enough for safety but not so noisy that pharmacists ignore it.

| Severity   | Meaning                         | Behaviour                                  |
| ---------- | ------------------------------- | ------------------------------------------ |
| Info       | Useful context                  | Show only                                  |
| Warning    | Review needed                   | Acknowledge                                |
| High       | Significant risk                | Pharmacist override reason                 |
| Critical   | Contraindicated/unsafe          | Block unless senior override is configured |
| Regulatory | Legally/procedurally prohibited | Hard block                                 |

Example:

| Alert                            | Severity                     | Behaviour                         |
| -------------------------------- | ---------------------------- | --------------------------------- |
| Duplicate NSAID                  | Warning/high                 | Pharmacist review                 |
| Penicillin allergy + amoxicillin | Critical                     | Block/override only by pharmacist |
| Pregnancy caution                | High                         | Pharmacist/clinician review       |
| Warfarin + NSAID                 | High/critical depending rule | Review/override                   |
| Reserve antibiotic               | Warning/high                 | Stewardship prompt                |
| Controlled medicine              | Regulatory workflow          | Controlled register               |

---

# 10. Alert-fatigue controls

This is important. A noisy CDS engine is unsafe.

| Control                 | Behaviour                                                              |
| ----------------------- | ---------------------------------------------------------------------- |
| Tiered severity         | Do not interrupt for low-value info                                    |
| Context-aware alerts    | Different behaviour for OTC, prescription, refill, chronic repeat      |
| Suppression rules       | Do not repeat same warning endlessly in same visit unless changed      |
| Override memory         | Store previous override but do not blindly suppress future risk        |
| Pharmacist dashboard    | Review override patterns                                               |
| Rule governance         | Disable/adjust noisy rules after review                                |
| High-risk always active | Allergy, critical DDI, controlled medicine, pregnancy contraindication |
| Audit override rates    | Detect unsafe bypassing                                                |

---

# 11. Kenya-localization rules

## 11.1 KEML and KEPH level check

The system should warn if a medicine is outside the configured branch/facility level or local formulary.

| Rule                                       | Behaviour                            |
| ------------------------------------------ | ------------------------------------ |
| Product not mapped to KEML/local formulary | Warn procurement/pharmacist          |
| Product not allowed at branch level        | Warn/block depending facility policy |
| Medicine not stocked at branch             | Suggest transfer/substitution        |
| Reserve antibiotic                         | Stewardship review                   |
| Non-formulary medicine                     | Pharmacist/manager approval          |

---

## 11.2 Antibiotic stewardship

Use AWaRe in MVP.

| AWaRe category | Behaviour                                                     |
| -------------- | ------------------------------------------------------------- |
| Access         | Normal antibiotic workflow                                    |
| Watch          | Stewardship warning and diagnosis required                    |
| Reserve        | Senior clinician/pharmacist approval and strict documentation |
| Unmapped       | Pharmacist review                                             |

WHO’s AWaRe classification was developed to support antibiotic stewardship and classifies antibiotics into Access, Watch, and Reserve groups based on resistance impact and appropriate use considerations. ([who.int](https://www.who.int/publications/i/item/B09489))

---

## 11.3 Local disease context

Add curated high-priority Kenya-relevant safety rules.

| Area         | Example controls                                     |
| ------------ | ---------------------------------------------------- |
| Malaria      | Antimalarial pregnancy/age cautions                  |
| HIV/TB       | Interaction caution and referral/program sensitivity |
| Hypertension | Duplicate antihypertensive class warnings            |
| Diabetes     | Hypoglycaemia risk and refill adherence              |
| Asthma       | NSAID/beta-blocker cautions where configured         |
| Pregnancy    | Reproductive health medicine warnings                |
| Antibiotics  | AWaRe and duplicate antibiotic therapy               |

This does not replace national treatment guidelines. It provides structured warning prompts and documentation.

---

# 12. Pharmacovigilance integration

The system should support ADR and medication-error capture linked to dispense, product, batch, and patient.

PPB’s PvERS allows reporting of suspected adverse drug reactions, poor-quality health products, medication errors, medical devices, and other safety issues; it indicates that healthcare providers and pharmaceutical companies can report medicine, product, and vaccine safety issues. ([pv.pharmacyboardkenya.org](https://pv.pharmacyboardkenya.org/users/guest))

## ADR workflow

```text
Patient reports reaction
    ↓
Pharmacist opens ADR record
    ↓
System pulls patient, medicine, batch, dispense, prescriber
    ↓
Reaction details captured
    ↓
Report exported/submitted through PPB PvERS workflow
    ↓
Follow-up task created
```

## ADR data fields

| Field                |
| -------------------- |
| Patient              |
| Medicine/product     |
| Ingredient           |
| Batch/expiry         |
| Dispense date        |
| Reaction date        |
| Reaction description |
| Seriousness          |
| Outcome              |
| Reporter             |
| Prescriber           |
| PvERS reference      |
| Follow-up action     |

---

# 13. Implementation plan addition

Add a new sprint before building full Module 3 pharmacy safety.

## New Sprint: Medication Knowledge Base and CDS Foundation

Place this before the existing pharmacy dispensing sprint.

```text
Insert after Product Master / before Module 3 advanced dispensing
```

## Sprint scope

| Workstream              | Deliverable                             |
| ----------------------- | --------------------------------------- |
| Knowledge architecture  | ADR-021 approved                        |
| KEML import             | KEML-based formulary table              |
| Ingredient mapping      | Product-to-ingredient table             |
| Therapeutic classes     | Local class/ATC grouping                |
| AWaRe mapping           | Antibiotic stewardship flags            |
| Allergy rules           | Ingredient/class allergy rules          |
| Duplicate therapy rules | Therapeutic class checks                |
| Pregnancy rules v1      | Curated high-risk medicine list         |
| DDI rules v1            | Curated high-severity interaction pairs |
| Safety service          | Medication Safety API                   |
| Alert UI                | Pharmacist/clinician warning display    |
| Override workflow       | PIN + reason + audit                    |
| Governance workflow     | Rule review and approval                |
| Reports                 | Safety alert and override reports       |

---

# 14. MVP acceptance criteria for medication safety

| Test                                                      | Expected result                                           |
| --------------------------------------------------------- | --------------------------------------------------------- |
| Product has no ingredient mapping                         | Prescription/dispense warns “safety screening incomplete” |
| Patient has penicillin allergy and amoxicillin prescribed | Critical allergy alert                                    |
| Patient has active ibuprofen and diclofenac is added      | Duplicate NSAID/therapy alert                             |
| Pregnant patient gets configured high-risk medicine       | Pregnancy warning                                         |
| Reserve antibiotic selected                               | AWaRe stewardship warning and approval                    |
| High-risk DDI pair prescribed                             | Interaction alert                                         |
| Pharmacist overrides warning                              | PIN and reason required                                   |
| Override report opened                                    | Shows user, alert, reason, patient, medicine              |
| ADR created from dispense                                 | Pulls patient, product, batch, dispense                   |
| Knowledge rule edited                                     | Versioned and approved before active                      |
| Unmapped brand product                                    | Cannot be considered fully screened                       |
| Alert generated                                           | Source/version of rule is stored                          |

---

# 15. Governance model

Medication safety content must be governed like clinical content.

## Medication Safety Committee

For a 10-branch system, create a small internal group:

| Role                          | Responsibility                        |
| ----------------------------- | ------------------------------------- |
| Superintendent pharmacist     | Owns pharmacy safety rules            |
| Clinician lead                | Owns clinical acceptability           |
| Lab/diagnostic representative | Advises lab-linked rules where needed |
| Claims/billing representative | Ensures payer/formulary alignment     |
| Data/IT lead                  | Owns implementation and versioning    |
| Compliance/DPO                | Ensures privacy and audit controls    |

## Rule lifecycle

```text
Draft rule
    ↓
Clinical/pharmacy review
    ↓
Test in staging
    ↓
Approve
    ↓
Activate with effective date
    ↓
Monitor overrides/noise
    ↓
Revise or retire
```

## Required governance fields

| Field               |
| ------------------- |
| Rule author         |
| Evidence/source     |
| Clinical reviewer   |
| Approval date       |
| Effective date      |
| Review date         |
| Severity            |
| Override policy     |
| Version             |
| Change reason       |
| Deactivation reason |

---

# 16. Data quality requirements

Medication safety only works if product data is clean.

## Mandatory product mapping before go-live

| Product type          | Required mapping                                    |
| --------------------- | --------------------------------------------------- |
| Prescription medicine | Ingredient, strength, form, route, class            |
| Controlled medicine   | Ingredient, controlled flag, register category      |
| Antibiotic            | Ingredient, class, AWaRe category                   |
| OTC medicine          | Ingredient and class where safety rules apply       |
| Combination product   | All active ingredients                              |
| Supplements           | Ingredient/category where interactions are relevant |
| Retail goods          | No CDS mapping required unless health product       |

## Blocking rule

```text
Prescription-only medicines should not be activated for dispensing until product-to-ingredient mapping is complete and pharmacist-verified.
```

---

# 17. Commercial vendor readiness

Even if you do not buy a commercial knowledge base immediately, design for it.

## Vendor evaluation criteria

| Criterion                            |
| ------------------------------------ |
| Kenya/Africa formulary relevance     |
| API availability                     |
| Ingredient and brand mapping support |
| DDI severity tiers                   |
| Allergy cross-reactivity             |
| Duplicate therapy support            |
| Pregnancy/lactation support          |
| Paediatric warnings                  |
| Renal/hepatic dosing support         |
| Update frequency                     |
| Licensing cost                       |
| Offline/local cache rights           |
| Auditability of rule source          |
| Integration support                  |
| Liability terms                      |

## Vendor integration architecture

```text
Prescription event
    ↓
MedicationSafetyService
    ↓
CommercialCDSProvider adapter
    ↓
Vendor API / local dataset
    ↓
Normalized safety alerts
    ↓
Same alert UI and override workflow
```

This prevents the UI and pharmacy workflow from being rewritten if the knowledge provider changes.

---

# 18. Update to the risk register

Add these risks.

| Risk                                  | Severity | Mitigation                                                                  |
| ------------------------------------- | -------- | --------------------------------------------------------------------------- |
| No drug knowledge base                | Critical | Add KEML + RxNorm + curated safety tables + vendor-ready provider interface |
| Product ingredient mapping incomplete | Critical | Block prescription medicine activation until verified                       |
| Manual rules clinically incomplete    | High     | Limit MVP claims: “basic safety screening,” governance review               |
| Alert fatigue                         | High     | Severity tiers, suppression, override analytics                             |
| Outdated safety rules                 | High     | Versioning and review cycle                                                 |
| Commercial vendor dependency later    | Medium   | Provider abstraction                                                        |
| False negative warning                | High     | Disclaimers, pharmacist responsibility, rule source display                 |
| False positive warning                | Medium   | Override with reason, noise monitoring                                      |
| Pregnancy data mismatch               | High     | Use caution flags; require clinician/pharmacist judgement                   |
| Local brand not mapped to ingredient  | High     | Mapping workflow and unmapped product report                                |

---

# 19. Corrected Module 3 principle

Replace the previous principle:

```text
No prescription medicine should leave the pharmacy without a patient, a prescription, a responsible professional, a batch, instructions, and an audit trail.
```

With the stronger version:

```text
No prescription medicine should leave the pharmacy without a patient, prescription evidence, responsible professional approval, batch/expiry traceability, label instructions, audit trail, and a documented medication-safety screen based on an approved drug knowledge base.
```

---

# 20. Final recommendation

For this project, implement:

```text
MVP:
    KEML 2023 formulary foundation
    product-to-ingredient mapping
    RxNorm-ready identifiers
    ATC/local therapeutic classes
    AWaRe antibiotic flags
    curated allergy rules
    curated duplicate therapy rules
    curated pregnancy/breastfeeding warnings
    curated high-risk DDI rules
    pharmacist override workflow
    ADR/PvERS support

Version 2:
    broader open knowledge imports
    structured SPL/label-based warnings
    richer patient education
    expanded DDI and contraindication tables
    advanced alert analytics

Version 3:
    commercial CDS provider integration
    full enterprise-grade interaction/allergy/pregnancy/duplicate therapy engine
```

The important architectural rule is:

**The pharmacy system must not claim to perform medication safety checks unless it stores the source, version, mapping, rule, severity, alert, override, and responsible clinician/pharmacist decision behind every warning.**

# Module 3 Gap Closure: Pharmacy Dispensing — Developer Handoff Addendum

## Updated handoff status

| Area                      |                                         Previous status |                                                                                        After this closure |
| ------------------------- | ------------------------------------------------------: | --------------------------------------------------------------------------------------------------------: |
| Completeness              |                                                    High |                                                                                             **Very high** |
| Developer readiness       |                                                  Medium |                           **High for MVP dispensing; medium-high for advanced clinical decision support** |
| Accuracy confidence       | Good directionally; pharmacy-regulatory sign-off needed |                      **Good, with conservative defaults and explicit pharmacist/legal governance points** |
| Developer start readiness |                              Safe initial workflow only | **Ready for data modelling, workflows, label templates, audit, register, and rule engine implementation** |

The key decision is:

```text
Developers can build the dispensing engine now using conservative pharmacy-safe rules.
Advanced clinical interaction databases, controlled-medicine final register wording, and substitution policy should be approved by the superintendent pharmacist / PPB-facing legal or regulatory advisor before production.
```

---

# 1. Regulatory anchor summary

The Pharmacy and Poisons Act defines “dispense” as supplying a medicine or poison on and in accordance with a prescription duly given by a duly qualified medical practitioner, dentist, or veterinary surgeon. The Pharmacy and Poisons registration rules expose the medicine sale-class vocabulary developers should use: **prescription-only medicine (POM), over-the-counter medicine (OTC), pharmacy medicine (P), and general sales (GS)**. PPB’s PRIMS public product register should be treated as a verification source for registered products and marketing-authorisation status where available. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/1956/17/eng@2023-12-11)) ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/1981/147/eng%402022-12-31)) ([prims.pharmacyboardkenya.org](https://prims.pharmacyboardkenya.org/pharma_register_public/))

Controlled-medicine handling needs stricter governance. Kenya’s Narcotic Drugs and Psychotropic Substances framework allows regulations on conditions for sale or supply, prescribing, dispensing, record keeping, labelling, storage, disposal, and furnishing information for narcotic and psychotropic substances. PPB’s 2026 guidelines for narcotics, psychotropics, and precursor chemicals state that they cover handling, storage, dispensing, record keeping, prescription compliance, and mandatory record retention of at least five years for those substances. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/1994/4/eng@2022-12-31)) ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/guidelines-for-management-of-narcotics-psychotropics-and-precursor-chemical-substances/))

The Pharmacy and Poisons Rules require certain prescription details for Part I poisons and state that, unless a prescription may be dispensed again, it should be retained on the premises for two years; the Rules also state that prescribed books and records for Part III sales should be preserved on the premises for two years from the last entry. These are minimum legal anchors; the software should retain pharmacy records longer where business, claims, controlled-medicine, data-protection, or litigation risk requires. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/1957/186/eng%402022-12-31))

---

# 2. Final developer decisions

| Gap                                 | Final decision                                                                                                                                                                                                                                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Final medicine classification model | Use a **multi-axis medicine classification model**: PPB regulatory sale class, controlled-substance class, product type, therapeutic class, clinical-risk flags, dispensing workflow class, stock/traceability controls, payer/formulary status.                                                                         |
| Drug database / warning rules       | MVP uses a **configurable clinical rules engine** with local product flags, allergy classes, duplicate active ingredient checks, pregnancy/age flags, paediatric-weight prompts, high-alert flags, AWaRe antibiotic classification, and batch/expiry/recall rules. V2 can add a licensed interaction/monograph database. |
| Substitution governance             | Allow pharmacist-approved **same active ingredient** substitution by default; require stronger approval for strength/form changes; require prescriber approval for different active ingredient/therapeutic substitution; block or tightly control controlled-medicine substitution.                                      |
| Controlled medicine handling        | Build a conservative controlled-register model with opening/closing balance, prescription, patient, prescriber, batch, quantity, pharmacist, witness where required, correction entries, reconciliation, and export.                                                                                                     |
| Register retention                  | Default retention: **general prescriptions and poisons records at least 2 years**, controlled NPP records at least **5 years**, and system default **7 years or longer** unless customer policy/regulator says otherwise.                                                                                                |
| Label templates                     | Ship fixed MVP label templates: medicine label, auxiliary warning label, partial-dispense label, substituted medicine label, cold-chain label, controlled-internal handling label, refill label.                                                                                                                         |
| Production governance               | Require superintendent pharmacist/compliance approval for classification seed data, substitution policy, controlled-medicine list, warning severity, and label wording before go-live.                                                                                                                                   |

---

# 3. Final medicine classification model

Do **not** classify medicines using one field such as `medicine_type = prescription`. That is too weak.

Use multiple classification layers.

```text
Product identity
    ↓
Regulatory sale class
    ↓
Controlled-substance class
    ↓
Clinical risk class
    ↓
Stock/traceability class
    ↓
Dispensing workflow class
    ↓
Billing/claims/formulary class
```

---

## 3.1 Product identity classification

| Field                            |    Type | Example                                                                                             |
| -------------------------------- | ------: | --------------------------------------------------------------------------------------------------- |
| `product_type`                   |    Enum | `human_medicine`, `vaccine`, `biological`, `medical_device`, `diagnostic`, `supplement`, `cosmetic` |
| `brand_name`                     |    Text | Augmentin                                                                                           |
| `generic_name`                   |    Text | Amoxicillin + clavulanic acid                                                                       |
| `inn_name`                       |    Text | Amoxicillin; clavulanic acid                                                                        |
| `active_ingredients_json`        |    JSON | Ingredient, strength, unit                                                                          |
| `strength`                       |    Text | 625 mg                                                                                              |
| `dosage_form`                    |    Enum | tablet, capsule, syrup, injection, cream                                                            |
| `route`                          |    Enum | oral, topical, IV, IM, inhalation                                                                   |
| `pack_size`                      |    Text | 10 tablets                                                                                          |
| `manufacturer`                   |    Text |                                                                                                     |
| `country_of_origin`              |    Text |                                                                                                     |
| `ppb_registration_number`        |    Text |                                                                                                     |
| `marketing_authorisation_status` |    Enum | registered, expired, suspended, unknown                                                             |
| `gtin`                           |    Text | GS1-ready                                                                                           |
| `barcode`                        |    Text | Local/manufacturer barcode                                                                          |
| `atc_code`                       |    Text | Optional                                                                                            |
| `keml_flag`                      | Boolean | Essential medicine flag                                                                             |
| `keml_level_of_use`              |    Text | Where configured                                                                                    |
| `active_status`                  |    Enum | active, blocked, discontinued                                                                       |

PPB states that all human medicinal products, including prescription medicines, OTC drugs, vaccines, herbal and complementary products, biosimilars, and biologicals, require marketing authorization before being sold or distributed in Kenya. The system should therefore store PPB registration/marketing-authorisation fields even when verification is manual at MVP stage. ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/faq-marketing-authorization/))

---

## 3.2 Regulatory sale class

This is the main POS/dispensing gate.

| Code      | Meaning                    | POS behaviour                                            | Dispensing behaviour                                            |
| --------- | -------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| `POM`     | Prescription-only medicine | Block direct cashier sale                                | Requires patient, prescription, prescriber, pharmacist approval |
| `P`       | Pharmacy medicine          | Require pharmacist/pharmacy-staff review based on policy | Patient profile recommended; pharmacist approval configurable   |
| `OTC`     | Over-the-counter medicine  | Allow normal pharmacy sale with stock/expiry checks      | Patient optional; safety prompts where configured               |
| `GS`      | General sales              | Allow normal retail sale                                 | No dispensing workflow unless configured                        |
| `UNKNOWN` | Classification missing     | Block medicine sale or require pharmacist classification | Must be resolved before active sale                             |

The official registration rules explicitly include POM, OTC, P, and GS as product classifications in the drug-registration form notes, so these should be first-class enums in the product master. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/1981/147/eng%402022-12-31))

---

## 3.3 Controlled-substance class

| Code           | Meaning                                | Behaviour                           |
| -------------- | -------------------------------------- | ----------------------------------- |
| `NONE`         | Not controlled                         | Normal rules                        |
| `NARCOTIC`     | Narcotic drug                          | Controlled workflow                 |
| `PSYCHOTROPIC` | Psychotropic substance                 | Controlled workflow                 |
| `PRECURSOR`    | Precursor chemical                     | Controlled/procurement workflow     |
| `NPP_UNKNOWN`  | Suspected controlled but not confirmed | Block until classification reviewed |

Controlled classes should be maintained in a **controlled substance catalogue** approved by the superintendent pharmacist or compliance admin. The software should not let ordinary product-entry users mark items as uncontrolled if they have controlled-substance flags.

---

## 3.4 Clinical risk flags

These are independent boolean or enum flags.

| Flag                           | Purpose                                        |
| ------------------------------ | ---------------------------------------------- |
| `high_alert_medicine`          | Requires pharmacist warning or double-check    |
| `antibiotic`                   | Enables antimicrobial stewardship rules        |
| `aware_class`                  | Access, Watch, Reserve, Other                  |
| `pregnancy_caution`            | Warn if pregnancy flag exists                  |
| `breastfeeding_caution`        | Warn if breastfeeding flag exists              |
| `paediatric_weight_required`   | Requires weight before dispensing for children |
| `elderly_caution`              | Warn for elderly patients                      |
| `sedating`                     | Auxiliary label: drowsiness                    |
| `renal_caution`                | Warn if renal disease/eGFR risk field exists   |
| `hepatic_caution`              | Warn if liver disease flag exists              |
| `cold_chain_required`          | Storage and label warning                      |
| `cytotoxic_or_hazardous`       | Handling warning                               |
| `look_alike_sound_alike`       | LASA warning                                   |
| `narrow_therapeutic_index`     | Pharmacist review                              |
| `duplicate_therapy_sensitive`  | Duplicate class warning                        |
| `controlled_refill_sensitive`  | Early refill warning                           |
| `requires_patient_counselling` | Counselling checkbox required                  |

The Kenya Essential Medicines List 2023 includes therapeutic categories and AWaRe classification for antibiotics, while WHO describes AWaRe as a tool for monitoring antibiotic consumption and stewardship. The software should store AWaRe as a stewardship/reporting field rather than relying on a generic “antibiotic” flag only. ([kemsa.go.ke](https://www.kemsa.go.ke/download/file/8e7d9c438ecc1a468d9d7615a87688df.pdf)) ([who.int](https://www.who.int/publications/i/item/B09489))

---

## 3.5 Stock and traceability class

| Field                           | Behaviour                                   |
| ------------------------------- | ------------------------------------------- |
| `batch_controlled`              | Batch required before sale/dispense         |
| `expiry_controlled`             | Expiry required and expired stock blocked   |
| `serial_controlled`             | Unit serial capture where applicable        |
| `cold_chain_required`           | Temperature controls                        |
| `recall_sensitive`              | Recall workflow enabled                     |
| `quarantine_required_on_return` | Returned stock goes to quarantine           |
| `controlled_cabinet_required`   | Secure storage flag                         |
| `fefo_required`                 | First-expiry-first-out recommended/enforced |

---

## 3.6 Dispensing workflow class

| Code                    | Meaning                              | Workflow                              |
| ----------------------- | ------------------------------------ | ------------------------------------- |
| `FAST_RETAIL`           | General retail item                  | POS only                              |
| `OTC_PHARMACY`          | OTC medicine                         | POS + stock/expiry warnings           |
| `PHARMACIST_REVIEW`     | Pharmacy medicine/high-risk OTC      | Pharmacist review before sale         |
| `PRESCRIPTION_REQUIRED` | POM                                  | Full prescription workflow            |
| `CONTROLLED_REQUIRED`   | Narcotic/psychotropic/precursor      | Prescription + controlled register    |
| `CLINIC_ADMINISTERED`   | Injection/vaccine/procedure medicine | EMR/procedure administration workflow |
| `PROGRAM_RESTRICTED`    | HIV/TB/program medicine              | Sensitive/program workflow            |
| `BLOCKED`               | Not saleable                         | Cannot sell/dispense                  |

---

# 4. Product classification master-data tables

## 4.1 `medicine_products`

| Field                            |
| -------------------------------- |
| `id`                             |
| `product_id`                     |
| `brand_name`                     |
| `generic_name`                   |
| `inn_name`                       |
| `active_ingredients_json`        |
| `strength`                       |
| `dosage_form`                    |
| `route`                          |
| `pack_size`                      |
| `manufacturer`                   |
| `ppb_registration_number`        |
| `marketing_authorisation_status` |
| `regulatory_sale_class`          |
| `controlled_substance_class`     |
| `dispensing_workflow_class`      |
| `atc_code`                       |
| `keml_flag`                      |
| `keml_level_of_use`              |
| `aware_class`                    |
| `high_alert_flag`                |
| `lasa_flag`                      |
| `cold_chain_required`            |
| `batch_controlled`               |
| `expiry_controlled`              |
| `serial_controlled`              |
| `return_to_quarantine_required`  |
| `active_status`                  |
| `classification_review_status`   |
| `classified_by`                  |
| `classified_at`                  |
| `classification_source`          |
| `review_due_date`                |

## 4.2 `active_ingredients`

| Field                        |
| ---------------------------- |
| `id`                         |
| `ingredient_name`            |
| `inn_name`                   |
| `ingredient_code`            |
| `atc_code`                   |
| `allergy_group_id`           |
| `therapeutic_class_id`       |
| `controlled_substance_class` |
| `aware_class`                |
| `status`                     |

## 4.3 `medicine_classification_audit`

| Field                 |
| --------------------- |
| `id`                  |
| `medicine_product_id` |
| `field_changed`       |
| `old_value`           |
| `new_value`           |
| `reason`              |
| `changed_by`          |
| `approved_by`         |
| `changed_at`          |

## 4.4 Classification approval rule

```text
RULE: Activate medicine for sale
IF regulatory_sale_class != UNKNOWN
AND product_type is valid
AND tax_code exists
AND stock_control flags are configured
AND classification_review_status = approved
THEN product may be active
ELSE block sale/dispense
```

---

# 5. Clinical warning engine

## 5.1 Final approach

Use two levels:

| Level | Decision                       | Developer action                            |
| ----- | ------------------------------ | ------------------------------------------- |
| MVP   | Configurable rules engine      | Build local warning rules and product flags |
| V2    | External drug database adapter | Add interaction/monograph vendor later      |

Do not build the MVP around a specific commercial drug database. Build an adapter interface.

```text
ClinicalWarningEngine
    ├── LocalRuleEngine
    ├── AllergyRuleSet
    ├── DuplicateTherapyRuleSet
    ├── ProductRiskFlagRuleSet
    ├── RefillRuleSet
    ├── BatchExpiryRecallRuleSet
    └── ExternalDrugDatabaseAdapter, V2
```

---

## 5.2 MVP warning categories

| Warning                        | Required MVP? | Data needed                                |
| ------------------------------ | ------------: | ------------------------------------------ |
| Allergy to ingredient          |           Yes | Patient allergy + ingredient allergy group |
| Allergy to therapeutic class   |           Yes | Allergy group/class                        |
| Duplicate active ingredient    |           Yes | Current meds + new ingredient              |
| Duplicate therapeutic class    |           Yes | Therapeutic class                          |
| Prescription required          |           Yes | Regulatory sale class                      |
| Controlled medicine            |           Yes | Controlled class                           |
| Early refill                   |           Yes | Last dispense + days supply                |
| Paediatric weight missing      |           Yes | Age + weight + product flag                |
| Pregnancy caution              |           Yes | Pregnancy flag + product flag              |
| Breastfeeding caution          |           Yes | Breastfeeding flag + product flag          |
| Sedation warning               |           Yes | Product flag                               |
| Antibiotic AWaRe class         |           Yes | AWaRe class                                |
| High-alert medicine            |           Yes | Product flag                               |
| LASA warning                   |           Yes | Product flag                               |
| Expired batch                  |           Yes | Batch expiry                               |
| Recalled batch                 |           Yes | Recall status                              |
| Quarantined batch              |           Yes | Quarantine status                          |
| Near-expiry warning            |           Yes | Expiry threshold                           |
| Renal/hepatic caution          |          V1.5 | Patient condition flag                     |
| Dose range check               |            V2 | Dose database                              |
| Advanced drug-drug interaction |            V2 | Licensed interaction database              |
| Lab-linked safety              |            V3 | EMR/lab integration                        |

---

## 5.3 Warning severity enum

```text
info
counselling
warning
requires_pharmacist_acknowledgement
requires_override_reason
requires_prescriber_clarification
hard_stop
```

## 5.4 Warning action matrix

| Severity                              | UI behaviour                                     | Can continue? |
| ------------------------------------- | ------------------------------------------------ | ------------- |
| `info`                                | Show message                                     | Yes           |
| `counselling`                         | Add counselling prompt                           | Yes           |
| `warning`                             | Pharmacist sees warning                          | Yes           |
| `requires_pharmacist_acknowledgement` | Pharmacist must acknowledge                      | Yes           |
| `requires_override_reason`            | Pharmacist must give reason                      | Yes, logged   |
| `requires_prescriber_clarification`   | Requires contacted prescriber or senior override | Conditional   |
| `hard_stop`                           | Blocks dispense                                  | No            |

---

## 5.5 Warning rule examples

### Allergy rule

```text
IF patient_allergy.allergy_group_id = medicine_ingredient.allergy_group_id
THEN warning.severity = hard_stop OR requires_override_reason
```

### Duplicate active ingredient

```text
IF active_ingredient in patient.current_active_medicines
THEN warning.severity = requires_pharmacist_acknowledgement
```

### POM rule

```text
IF medicine.regulatory_sale_class = POM
AND prescription_id IS NULL
THEN hard_stop
```

### Controlled medicine rule

```text
IF medicine.controlled_substance_class IN [NARCOTIC, PSYCHOTROPIC, PRECURSOR]
THEN require:
  prescription_id
  patient_id
  prescriber_id
  pharmacist_approval
  controlled_register_entry
```

### AWaRe antibiotic rule

```text
IF medicine.aware_class IN [WATCH, RESERVE]
THEN show antimicrobial stewardship warning
AND require diagnosis/indication if configured
```

### Pregnancy caution

```text
IF patient.pregnancy_status IN [pregnant, possible]
AND medicine.pregnancy_caution = true
THEN requires_pharmacist_acknowledgement OR prescriber clarification
```

---

## 5.6 Warning tables

### `clinical_warning_rules`

| Field                         |
| ----------------------------- |
| `id`                          |
| `rule_code`                   |
| `rule_name`                   |
| `rule_category`               |
| `description`                 |
| `trigger_condition_json`      |
| `severity`                    |
| `requires_acknowledgement`    |
| `requires_override_reason`    |
| `requires_prescriber_contact` |
| `hard_stop`                   |
| `active`                      |
| `approved_by`                 |
| `approved_at`                 |

### `clinical_warnings`

| Field                      |
| -------------------------- |
| `id`                       |
| `patient_id`               |
| `prescription_id`          |
| `dispense_id`              |
| `medicine_product_id`      |
| `rule_id`                  |
| `warning_type`             |
| `severity`                 |
| `message`                  |
| `status`                   |
| `acknowledged_by`          |
| `acknowledged_at`          |
| `override_reason`          |
| `overridden_by`            |
| `overridden_at`            |
| `prescriber_contacted`     |
| `prescriber_contact_notes` |

---

# 6. Substitution governance

## 6.1 Final substitution policy

| Substitution type                                              | Default decision | Required approval                                         |
| -------------------------------------------------------------- | ---------------- | --------------------------------------------------------- |
| Same active ingredient, same strength, same dosage form        | Allow            | Pharmacist approval + patient informed                    |
| Same active ingredient, different brand                        | Allow            | Pharmacist approval + reason                              |
| Same active ingredient, different pack size                    | Allow            | Pharmacist approval                                       |
| Same active ingredient, different strength but equivalent dose | Conditional      | Pharmacist approval + equivalence note                    |
| Same active ingredient, different dosage form                  | Conditional      | Pharmacist approval; prescriber contact if clinical risk  |
| Different active ingredient, same therapeutic class            | Block by default | Prescriber approval required                              |
| Different therapeutic class                                    | Block            | New prescription required                                 |
| Controlled medicine substitution                               | Block by default | Superintendent + prescriber approval if ever allowed      |
| Insurer formulary substitution                                 | Conditional      | Pharmacist approval + payer rule + patient informed       |
| Paediatric formulation substitution                            | Conditional      | Pharmacist approval + dose check                          |
| Antibiotic substitution                                        | Conditional      | Pharmacist approval; prescriber contact for class changes |

---

## 6.2 Substitution fields

| Field                           |    Required |
| ------------------------------- | ----------: |
| `prescription_item_id`          |         Yes |
| `prescribed_product_id`         |         Yes |
| `dispensed_product_id`          |         Yes |
| `substitution_type`             |         Yes |
| `substitution_reason`           |         Yes |
| `same_active_ingredient`        |         Yes |
| `same_strength`                 |         Yes |
| `same_dosage_form`              |         Yes |
| `dose_equivalence_note`         | Conditional |
| `patient_informed`              |         Yes |
| `patient_acceptance`            | Recommended |
| `prescriber_contacted`          | Conditional |
| `prescriber_contact_method`     | Conditional |
| `prescriber_approval_reference` | Conditional |
| `pharmacist_id`                 |         Yes |
| `approved_at`                   |         Yes |
| `payer_formulary_reason`        |    Optional |
| `price_difference`              |        Auto |
| `audit_note`                    |         Yes |

## 6.3 Substitution reason enum

```text
prescribed_brand_out_of_stock
generic_available
patient_affordability
payer_formulary
better_pack_size
medicine_recalled
clinical_safety_concern
prescriber_authorised
patient_requested
other
```

## 6.4 Substitution rule

```text
RULE: Substitution allowed
IF substitution.same_active_ingredient = true
AND substitution.same_strength = true
AND substitution.same_dosage_form = true
AND patient_informed = true
AND pharmacist_approval = true
THEN allow

ELSE IF different_active_ingredient = true
THEN require prescriber_approval
AND block unless approval captured
```

---

# 7. Controlled medicine register

## 7.1 Final conservative register model

The system should maintain a controlled register that is stricter than ordinary stock movement.

### `controlled_medicine_register`

| Field                              |       Required | Notes                                                        |
| ---------------------------------- | -------------: | ------------------------------------------------------------ |
| `id`                               |            Yes |                                                              |
| `register_entry_number`            |            Yes | Sequential per branch/register                               |
| `branch_id`                        |            Yes |                                                              |
| `medicine_product_id`              |            Yes |                                                              |
| `controlled_substance_class`       |            Yes | Narcotic/psychotropic/precursor                              |
| `strength`                         |            Yes |                                                              |
| `dosage_form`                      |            Yes |                                                              |
| `batch_id`                         |            Yes |                                                              |
| `batch_number`                     |            Yes |                                                              |
| `expiry_date`                      |            Yes |                                                              |
| `transaction_type`                 |            Yes | receive, dispense, return, transfer, adjustment, destruction |
| `transaction_datetime`             |            Yes |                                                              |
| `opening_balance`                  |            Yes |                                                              |
| `quantity_in`                      | Yes, default 0 |                                                              |
| `quantity_out`                     | Yes, default 0 |                                                              |
| `quantity_adjusted`                | Yes, default 0 |                                                              |
| `closing_balance`                  |            Yes | Calculated                                                   |
| `unit_of_measure`                  |            Yes | tablet, vial, ampoule, ml                                    |
| `prescription_id`                  |    Conditional | Required for dispense                                        |
| `prescription_number`              |    Conditional |                                                              |
| `prescription_date`                |    Conditional |                                                              |
| `patient_id`                       |    Conditional | Required for dispense                                        |
| `patient_name_snapshot`            |    Conditional | Immutable snapshot                                           |
| `patient_identifier_snapshot`      |    Conditional | ID/patient number where policy allows                        |
| `prescriber_id`                    |    Conditional | Required for dispense                                        |
| `prescriber_name_snapshot`         |    Conditional |                                                              |
| `prescriber_registration_snapshot` |    Conditional |                                                              |
| `pharmacist_id`                    |            Yes |                                                              |
| `pharmacist_name_snapshot`         |            Yes |                                                              |
| `witness_user_id`                  |    Conditional | For destruction/adjustment/high-risk                         |
| `reason`                           |    Conditional | Required for adjustment/return/destruction                   |
| `source_document_id`               |       Optional | Prescription, invoice, DDA/permit, destruction evidence      |
| `correction_of_entry_id`           |       Optional | If correcting prior entry                                    |
| `entry_status`                     |            Yes | active, corrected, reversed, reconciled                      |
| `created_by`                       |            Yes |                                                              |
| `created_at`                       |            Yes |                                                              |
| `locked_at`                        |       Optional | After review/period close                                    |

---

## 7.2 Controlled medicine transaction types

```text
opening_balance
purchase_receipt
supplier_return
dispense_to_patient
patient_return_quarantine
inter_branch_transfer_out
inter_branch_transfer_in
stock_count_variance
damage_loss
expiry_quarantine
destruction_disposal
regulator_seizure
correction_entry
```

## 7.3 Controlled medicine rules

| Rule                              | System behaviour                                               |
| --------------------------------- | -------------------------------------------------------------- |
| Controlled item received          | Create controlled-register receipt entry                       |
| Controlled item dispensed         | Require prescription, patient, prescriber, pharmacist approval |
| Controlled item returned          | Quarantine, not automatic resale                               |
| Controlled stock adjusted         | Requires superintendent approval and reason                    |
| Controlled stock destroyed        | Requires witness and evidence                                  |
| Register entry edited             | Block direct edit; create correction entry                     |
| Physical count mismatch           | Critical alert and reconciliation task                         |
| Early refill                      | Warning/override required                                      |
| Duplicate controlled prescription | Warning                                                        |
| Missing prescriber licence        | Block or require senior override based on policy               |
| Stock balance negative            | Hard stop                                                      |

---

## 7.4 Retention policy

| Record type                                        |                           Minimum system default |
| -------------------------------------------------- | -----------------------------------------------: |
| Ordinary prescription records                      |                                 At least 2 years |
| Poisons Book / Part III records                    |                                 At least 2 years |
| Controlled narcotic/psychotropic/precursor records |                                 At least 5 years |
| Dispensing audit trail                             |                                  7 years default |
| Patient-linked medication history                  | 7 years default or customer health-record policy |
| Controlled destruction records                     |                                  7 years default |
| Recall-affected dispense records                   |                    7 years default or legal hold |
| Legal/investigation hold                           |                        Indefinite until released |

This retention design uses the two-year prescription/poisons-record anchor in the Pharmacy and Poisons Rules and the five-year controlled NPP anchor from PPB’s 2026 NPP guideline page, while using seven years as a safer business-system default for audit, claims, and dispute handling. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/1957/186/eng%402022-12-31)) ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/guidelines-for-management-of-narcotics-psychotropics-and-precursor-chemical-substances/))

---

# 8. Final label templates

PPB’s SmPC/PIL/labelling guideline states that product information should be scientifically accurate, consistent, user-friendly, and support safe and effective medicine use; it covers indications, dosage, contraindications, warnings, pharmacology, storage, patient information leaflets, and primary/secondary packaging labelling. For dispensing labels, the system should use conservative patient-safety labels that complement, not replace, manufacturer labels and patient information leaflets. ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/guideline-on-summary-of-product-characteristics-patient-information-leaflet-and-labelling/))

## 8.1 Label template catalogue

| Code                    | Label name                         | Use                                     |
| ----------------------- | ---------------------------------- | --------------------------------------- |
| `MEDICINE_STANDARD`     | Standard medicine label            | Normal dispensed medicine               |
| `MEDICINE_PARTIAL`      | Partial-dispense label             | Quantity supplied less than prescribed  |
| `MEDICINE_SUBSTITUTED`  | Substituted medicine label         | Product differs from prescribed item    |
| `MEDICINE_REFILL`       | Refill label                       | Chronic/repeat prescription             |
| `COLD_CHAIN`            | Cold-chain label                   | Refrigerated/temperature-sensitive item |
| `AUX_DROWSINESS`        | Drowsiness warning                 | Sedating medicine                       |
| `AUX_COMPLETE_COURSE`   | Complete course                    | Antibiotics                             |
| `AUX_EXTERNAL_USE`      | External use only                  | Topicals                                |
| `AUX_SHAKE_WELL`        | Shake well                         | Suspensions                             |
| `AUX_KEEP_OUT_OF_REACH` | Keep away from children            | General safety                          |
| `CONTROLLED_INTERNAL`   | Controlled internal handling label | Internal stock/register use             |
| `RECONSTITUTION`        | Reconstitution label               | Syrups requiring reconstitution         |

---

## 8.2 Standard medicine label

### Required fields

```text
[PHARMACY NAME]
[BRANCH PHONE]

Patient: [PATIENT NAME]
Medicine: [DISPENSED MEDICINE NAME]
Strength/Form: [STRENGTH] [DOSAGE FORM]
Directions: [DOSE] [ROUTE] [FREQUENCY] for [DURATION]
Quantity: [QUANTITY DISPENSED]
Date: [DATE DISPENSED]
Ref: [PRESCRIPTION/DISPENSE NUMBER]
Dispensed by: [INITIALS/NAME]
Storage: [STORAGE INSTRUCTION]
Warnings: [AUXILIARY WARNINGS]
```

### Optional fields

```text
Batch: [BATCH]
Expiry: [EXPIRY]
Next refill: [REFILL DATE]
Prescriber: [PRESCRIBER NAME]
```

Default: batch/expiry should be stored in audit always; printing batch/expiry on patient label should be configurable.

---

## 8.3 Partial-dispense label

```text
[PHARMACY NAME]

Patient: [PATIENT NAME]
Medicine: [DISPENSED MEDICINE]
Directions: [SIG]
Quantity supplied today: [QTY DISPENSED]
Balance remaining: [BALANCE QTY]
Reason: Partial supply
Next supply/review: [DATE OR “CONTACT PHARMACY”]
Ref: [PRESCRIPTION/DISPENSE NUMBER]
```

## 8.4 Substituted medicine label

```text
[PHARMACY NAME]

Patient: [PATIENT NAME]
Medicine supplied: [DISPENSED MEDICINE]
Prescribed as: [PRESCRIBED MEDICINE]
Directions: [SIG]
Quantity: [QTY]
Date: [DATE]
Note: Supplied medicine approved by pharmacist as recorded.
```

## 8.5 Cold-chain label

```text
KEEP REFRIGERATED
Store at [TEMPERATURE RANGE] or as directed.
Do not freeze unless instructed.
Return to pharmacy/clinic if storage was interrupted.
```

## 8.6 Auxiliary warning examples

```text
May cause drowsiness. Avoid driving or operating machinery.
Complete the full course unless advised otherwise.
For external use only.
Shake well before use.
Take after meals.
Keep out of reach of children.
```

---

# 9. Final prescription intake rules

## 9.1 Prescription source enum

```text
internal_emr
external_paper
external_photo
external_pdf
telemedicine
hospital_discharge
refill_repeat
emergency_supply_record
```

## 9.2 Prescription status enum

```text
draft
pending_pharmacist_review
needs_clarification
approved
approved_with_changes
partially_dispensed
fully_dispensed
rejected
cancelled
expired
reversed
```

## 9.3 Required prescription fields

| Field                               |                            POM | Controlled |      OTC |
| ----------------------------------- | -----------------------------: | ---------: | -------: |
| Patient                             |                       Required |   Required | Optional |
| Prescriber name                     |                       Required |   Required | Optional |
| Prescriber registration/licence     | Recommended/required by policy |   Required | Optional |
| Prescription date                   |                       Required |   Required | Optional |
| Medicine                            |                       Required |   Required | Optional |
| Dose/frequency/duration             |                       Required |   Required | Optional |
| Quantity                            |                       Required |   Required | Optional |
| Uploaded document or internal order |          Required for external |   Required | Optional |
| Pharmacist review                   |                       Required |   Required | Optional |
| Controlled register entry           |                             No |   Required |       No |

## 9.4 Prescription validation rule

```text
RULE: POM dispense
IF medicine.regulatory_sale_class = POM
THEN patient_id is required
AND prescription_id is required
AND prescriber_id or prescriber_snapshot is required
AND pharmacist_approval is required
AND labelable dosage instructions are required
```

---

# 10. Final partial dispensing rules

## 10.1 Partial dispense reason enum

```text
patient_affordability
stock_shortage
insurance_limit
payer_quantity_limit
clinical_trial_supply
controlled_quantity_limit
patient_preference
pharmacist_decision
other
```

## 10.2 Partial dispense fields

| Field                    |    Required |
| ------------------------ | ----------: |
| `quantity_prescribed`    |         Yes |
| `quantity_dispensed_now` |         Yes |
| `balance_quantity`       |         Yes |
| `partial_reason`         |         Yes |
| `patient_informed`       |         Yes |
| `balance_valid_until`    | Conditional |
| `next_supply_date`       |    Optional |
| `pharmacist_id`          |         Yes |
| `label_adjusted`         |         Yes |

## 10.3 Rule

```text
IF quantity_dispensed_now < quantity_prescribed
THEN partial_reason is required
AND balance_quantity is calculated
AND pharmacist approval is required
AND label must show actual quantity supplied
```

---

# 11. Final refill/repeat rules

## 11.1 Refill status enum

```text
active
due
overdue
early_request
completed
exhausted
expired
cancelled
requires_new_prescription
```

## 11.2 Refill fields

| Field                        |    Required |
| ---------------------------- | ----------: |
| `original_prescription_id`   |         Yes |
| `prescription_item_id`       |         Yes |
| `medicine_product_id`        |         Yes |
| `days_supply`                |         Yes |
| `next_refill_date`           |         Yes |
| `total_repeats_allowed`      |         Yes |
| `repeats_used`               |         Yes |
| `repeats_remaining`          |         Yes |
| `valid_until`                |         Yes |
| `last_dispense_id`           |    Optional |
| `early_refill_reason`        | Conditional |
| `pharmacist_review_required` |         Yes |

## 11.3 Rules

```text
IF repeats_remaining = 0
THEN require new prescription
```

```text
IF refill_date < next_refill_date - allowed_early_window
THEN status = early_request
AND pharmacist override reason required
```

---

# 12. Final dispensing data model

## 12.1 `prescriptions`

| Field                               |
| ----------------------------------- |
| `id`                                |
| `prescription_number`               |
| `source`                            |
| `patient_id`                        |
| `external_patient_name_snapshot`    |
| `prescriber_id`                     |
| `external_prescriber_snapshot_json` |
| `internal_visit_id`                 |
| `prescription_date`                 |
| `valid_until`                       |
| `uploaded_document_id`              |
| `diagnosis_text`                    |
| `diagnosis_code`                    |
| `status`                            |
| `repeat_allowed`                    |
| `total_repeats`                     |
| `entered_by`                        |
| `reviewed_by`                       |
| `reviewed_at`                       |
| `review_notes`                      |
| `created_at`                        |

## 12.2 `prescription_items`

| Field                     |
| ------------------------- |
| `id`                      |
| `prescription_id`         |
| `prescribed_product_id`   |
| `prescribed_generic_name` |
| `strength`                |
| `dosage_form`             |
| `dose`                    |
| `frequency`               |
| `duration`                |
| `route`                   |
| `quantity_prescribed`     |
| `instructions`            |
| `substitution_allowed`    |
| `repeat_allowed`          |
| `status`                  |
| `warning_status`          |

## 12.3 `dispenses`

| Field               |
| ------------------- |
| `id`                |
| `dispense_number`   |
| `prescription_id`   |
| `patient_id`        |
| `branch_id`         |
| `dispense_type`     |
| `status`            |
| `pharmacist_id`     |
| `approved_at`       |
| `handed_over_by`    |
| `handed_over_at`    |
| `sale_id`           |
| `invoice_id`        |
| `counselling_done`  |
| `counselling_notes` |
| `created_at`        |

## 12.4 `dispense_lines`

| Field                     |
| ------------------------- |
| `id`                      |
| `dispense_id`             |
| `prescription_item_id`    |
| `prescribed_product_id`   |
| `dispensed_product_id`    |
| `quantity_prescribed`     |
| `quantity_dispensed`      |
| `balance_quantity`        |
| `batch_id`                |
| `batch_number`            |
| `expiry_date`             |
| `substitution_flag`       |
| `substitution_reason`     |
| `partial_dispense_flag`   |
| `partial_dispense_reason` |
| `label_template_id`       |
| `label_printed`           |
| `label_printed_at`        |
| `status`                  |

---

# 13. Workflow diagrams for developers

## 13.1 POM external prescription

```text
Patient presents prescription
  ↓
Create/select patient
  ↓
Upload prescription image/PDF
  ↓
Capture prescriber details
  ↓
Enter prescription items
  ↓
Run classification check
  ↓
Run clinical warnings
  ↓
Pharmacist review
  ↓
Approve / clarify / substitute / partial / reject
  ↓
Select batch/expiry
  ↓
Send approved lines to POS
  ↓
Payment + eTIMS invoice
  ↓
Print medicine labels
  ↓
Hand over medicine
  ↓
Stock out + dispense audit
```

## 13.2 Controlled medicine dispense

```text
Prescription received
  ↓
System detects controlled class
  ↓
Require patient + prescriber + prescription document
  ↓
Run early refill / duplicate controlled warning
  ↓
Pharmacist/superintendent approval
  ↓
Select controlled batch
  ↓
Create controlled register entry
  ↓
Send to POS
  ↓
Payment/invoice
  ↓
Hand over
  ↓
Close register balance
  ↓
Lock entry for audit
```

## 13.3 Substitution

```text
Prescribed item unavailable/too costly/formulary issue
  ↓
Pharmacist selects alternative
  ↓
System compares active ingredient, strength, form, route
  ↓
If same active + same strength/form:
    require patient informed + reason
  ↓
If strength/form differs:
    require equivalence note
  ↓
If active ingredient differs:
    require prescriber approval
  ↓
If controlled:
    block unless senior policy allows
  ↓
Label actual dispensed medicine
  ↓
Audit prescribed vs dispensed
```

## 13.4 Partial dispense

```text
Quantity prescribed = 30
Quantity supplied = 10
  ↓
System requires partial reason
  ↓
Creates balance = 20
  ↓
Label prints quantity supplied
  ↓
POS bills only quantity supplied
  ↓
Refill/balance task created
  ↓
Next supply uses remaining balance
```

---

# 14. API endpoints

## 14.1 Classification endpoints

| Endpoint                                              | Purpose                        |
| ----------------------------------------------------- | ------------------------------ |
| `POST /medicine-products`                             | Create medicine profile        |
| `PATCH /medicine-products/{id}/classification`        | Update classification          |
| `POST /medicine-products/{id}/approve-classification` | Pharmacist/compliance approval |
| `GET /medicine-products/{id}/dispensing-rules`        | Return effective rules         |
| `GET /medicine-products/search-ppb`                   | Future PRIMS lookup adapter    |

## 14.2 Prescription endpoints

| Endpoint                                 | Purpose             |
| ---------------------------------------- | ------------------- |
| `POST /prescriptions`                    | Create prescription |
| `POST /prescriptions/{id}/upload`        | Upload document     |
| `POST /prescriptions/{id}/items`         | Add medicine        |
| `POST /prescriptions/{id}/submit-review` | Send to pharmacist  |
| `POST /prescriptions/{id}/review`        | Pharmacist decision |
| `POST /prescriptions/{id}/reject`        | Reject prescription |
| `GET /prescriptions/search`              | Search              |

## 14.3 Dispensing endpoints

| Endpoint                              | Purpose               |
| ------------------------------------- | --------------------- |
| `GET /dispensing/queue`               | Work queue            |
| `POST /dispenses`                     | Create dispense       |
| `POST /dispenses/{id}/warnings/check` | Run warnings          |
| `POST /dispenses/{id}/approve`        | Approve               |
| `POST /dispenses/{id}/substitute`     | Substitution          |
| `POST /dispenses/{id}/partial`        | Partial supply        |
| `POST /dispenses/{id}/send-to-pos`    | Create billable lines |
| `POST /dispenses/{id}/complete`       | Complete handover     |
| `POST /dispenses/{id}/reverse`        | Reverse/correct       |

## 14.4 Controlled register endpoints

| Endpoint                                    | Purpose                        |
| ------------------------------------------- | ------------------------------ |
| `POST /controlled-register/entries`         | Create register entry          |
| `POST /controlled-register/{id}/correction` | Correction entry               |
| `POST /controlled-register/reconcile`       | Physical/system reconciliation |
| `GET /controlled-register/export`           | Export register                |
| `GET /controlled-register/variance-report`  | Variance report                |

## 14.5 Label endpoints

| Endpoint                       | Purpose               |
| ------------------------------ | --------------------- |
| `POST /labels/preview`         | Preview               |
| `POST /labels/print`           | Print                 |
| `POST /labels/reprint`         | Reprint with reason   |
| `GET /labels/templates`        | Template catalogue    |
| `PATCH /labels/templates/{id}` | Admin template update |

---

# 15. Final screen changes

## 15.1 Medicine classification screen

Sections:

```text
Identity
Regulatory sale class
Controlled-substance class
Clinical risk flags
Stock/traceability flags
KEML/AWaRe/ATC fields
Dispensing workflow class
Label defaults
Approval status
Audit history
```

## 15.2 Pharmacist review screen

Add a **decision panel**:

```text
Approve as prescribed
Approve with substitution
Approve partial dispense
Needs clarification
Reject
Escalate to superintendent
```

Warnings should show:

```text
Warning type
Severity
Reason
Required action
Override allowed?
Override reason field
```

## 15.3 Controlled register screen

Add:

```text
Opening balance
Receipts
Dispenses
Adjustments
Closing balance
Physical count
Variance
Correction entries
Export
```

---

# 16. Final acceptance criteria

## 16.1 Medicine classification

| Test                          | Expected result                                   |
| ----------------------------- | ------------------------------------------------- |
| Add POM medicine              | POS blocks direct sale                            |
| Add OTC medicine              | POS allows sale with expiry/stock check           |
| Add P medicine                | Pharmacist review required if configured          |
| Classification unknown        | Sale blocked                                      |
| Mark controlled narcotic      | Controlled workflow required                      |
| Mark antibiotic Watch/Reserve | Stewardship warning appears                       |
| Change classification         | Pharmacist/compliance approval and audit required |

## 16.2 Prescription workflow

| Test                            | Expected result                       |
| ------------------------------- | ------------------------------------- |
| External prescription uploaded  | Prescription queue item created       |
| Missing prescriber on POM       | Review blocked or needs clarification |
| Missing patient on POM          | Dispense blocked                      |
| Missing dosage                  | Label and approval blocked            |
| Pharmacist approves             | POS receives approved lines           |
| Pharmacist rejects              | POS cannot bill medicine              |
| Prescription repeated too often | Refill warning/block                  |

## 16.3 Clinical warnings

| Test                               | Expected result              |
| ---------------------------------- | ---------------------------- |
| Patient allergy matches ingredient | Critical warning/hard stop   |
| Duplicate active ingredient        | Warning                      |
| Pregnancy flag + caution medicine  | Warning                      |
| Child + weight-required medicine   | Weight prompt                |
| Controlled medicine                | Controlled workflow          |
| Expired batch                      | Hard stop                    |
| Recalled batch                     | Hard stop                    |
| Warning override                   | Reason and pharmacist logged |

## 16.4 Substitution

| Test                                   | Expected result                                                     |
| -------------------------------------- | ------------------------------------------------------------------- |
| Same active/same strength substitution | Allowed with pharmacist approval                                    |
| Different strength                     | Requires equivalence note                                           |
| Different active ingredient            | Requires prescriber approval                                        |
| Controlled medicine substitution       | Blocked by default                                                  |
| Substitution completed                 | Label shows dispensed medicine, audit shows prescribed vs dispensed |

## 16.5 Partial dispense

| Test                          | Expected result                |
| ----------------------------- | ------------------------------ |
| Dispense less than prescribed | Reason required                |
| Partial label                 | Shows actual supplied quantity |
| Balance remains               | Refill/balance record created  |
| Patient returns for balance   | Remaining quantity enforced    |
| Balance expired               | Pharmacist review required     |

## 16.6 Controlled register

| Test                      | Expected result                                     |
| ------------------------- | --------------------------------------------------- |
| Controlled stock received | Register receipt entry created                      |
| Controlled item dispensed | Register dispense entry created                     |
| Register balance          | Opening and closing balance calculated              |
| Register edit attempted   | Block direct edit                                   |
| Correction needed         | Correction entry created                            |
| Physical mismatch         | Critical variance alert                             |
| Export                    | Register export logged                              |
| Retention                 | Controlled records retained under configured policy |

## 16.7 Labels

| Test                | Expected result                  |
| ------------------- | -------------------------------- |
| Standard dispense   | Standard label prints            |
| Missing dosage      | Label blocked                    |
| Partial dispense    | Partial label prints             |
| Substitution        | Substitution label prints        |
| Cold-chain medicine | Cold-chain warning prints        |
| Reprint             | Reason required and audit logged |

---

# 17. Final developer implementation sequence

## Phase 1: Classification and product master

Build:

```text
medicine_products
active_ingredients
therapeutic_classes
allergy_groups
controlled_substance_catalogue
medicine_classification_audit
```

## Phase 2: Core prescription and dispense

Build:

```text
prescriptions
prescription_items
dispenses
dispense_lines
pharmacist approval workflow
POS handoff
batch/expiry selection
```

## Phase 3: Rules and warnings

Build:

```text
clinical_warning_rules
clinical_warnings
local warning engine
override workflow
warning audit
```

## Phase 4: Substitution, partial, refill

Build:

```text
substitution workflow
partial dispensing workflow
refill plans
balance tracking
```

## Phase 5: Controlled medicines

Build:

```text
controlled register
controlled stock reconciliation
correction entries
exports
retention policies
```

## Phase 6: Labels and reports

Build:

```text
label templates
label print/reprint
dispense audit report
controlled medicine report
prescription audit
batch recall linkage
```

---

# 18. Final handoff summary

Module 3 is now developer-ready with these final decisions:

| Area                    | Final state                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| Medicine classification | Ready: POM, P, OTC, GS plus controlled, clinical, stock, and workflow flags                         |
| Clinical warnings       | Ready for MVP local rules; external interaction database adapter later                              |
| Substitution            | Ready with conservative pharmacist/prescriber approval matrix                                       |
| Controlled medicines    | Ready with conservative register and 5-year controlled-record minimum                               |
| Labels                  | Ready with MVP templates                                                                            |
| Retention               | Ready with configurable policies                                                                    |
| APIs                    | Ready                                                                                               |
| Tables                  | Ready                                                                                               |
| Production risk         | Controlled-medicine and substitution policy must be approved by superintendent/legal before go-live |

The closed Module 3 rule is:

```text
No prescription medicine should leave the pharmacy unless the system can prove:
what class of medicine it is,
who prescribed it,
which patient received it,
who reviewed and approved it,
what warnings appeared,
whether it was substituted or partially dispensed,
which batch and expiry was supplied,
what label was printed,
whether payment/invoice happened,
and what audit/register record was created.
```
