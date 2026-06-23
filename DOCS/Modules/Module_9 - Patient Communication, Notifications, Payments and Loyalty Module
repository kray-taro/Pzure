# Module 9: Patient Communication, Notifications, Payments and Loyalty Module

This module is the **patient engagement and communication control layer** of the system.

Modules 1–8 generate actions that often need patient communication:

```text
Module 1: licence/branch identity appears in messages
Module 2: payment links, receipts, invoice notifications
Module 3: refill reminders, dispensing instructions, medicine safety follow-up
Module 4: recall notifications and stock-related patient contact
Module 5: appointment reminders, visit summaries, referral follow-up
Module 6: lab result readiness notifications
Module 7: claim status, pre-authorisation, patient balance notifications
Module 8: communication reports, consent reports, audit logs
Module 9: sends the right message, to the right person, through the right channel, with consent and audit
```

For Kenya, this module must be designed carefully because patient communication often involves **personal data, health data, direct marketing, payment requests, and regulated health-product advertising**. Kenya’s Data Protection Act defines consent as express, unequivocal, free, specific and informed, and defines health data as data about a person’s physical or mental health, including data collected during registration for or provision of health services. The Act also says personal data should not be used for commercial purposes unless express consent has been obtained or the use is authorised by law and the data subject was informed at collection. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/2019/24/eng%402022-12-31))

---

# 1. Purpose of the module

The Patient Communication Module should:

| Purpose                        | Practical meaning                                                      |
| ------------------------------ | ---------------------------------------------------------------------- |
| Send useful reminders          | Refills, appointments, follow-ups, vaccinations, chronic reviews       |
| Protect privacy                | Do not expose sensitive health data in SMS/WhatsApp                    |
| Manage consent                 | Patients choose channels and message types                             |
| Support opt-out                | Patients can stop marketing or non-essential messages                  |
| Support payments               | Send M-Pesa/STK/payment prompts linked to invoices                     |
| Improve clinic attendance      | Appointment reminders and missed-visit follow-up                       |
| Improve chronic-care adherence | Refill and review reminders                                            |
| Improve lab workflow           | Notify patients that results are ready without exposing result details |
| Support safe health education  | Education without unlawful medicine promotion                          |
| Support loyalty carefully      | Retail-only or tightly controlled pharmacy loyalty                     |
| Support audit                  | Every message sent, failed, opened, opted out, or escalated is logged  |

---

# 2. Kenya-specific design basis

## A. Consent and direct marketing

The Data Protection General Regulations state that a data subject has an absolute right to object to processing for direct marketing, and where the person objects, their personal data should not be processed for that purpose. The regulations also require direct marketing to have consent, to provide a simplified opt-out mechanism, and to include clear opt-out instructions. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2021/263/eng%402022-01-14))

Software implication:

| Requirement                            | System behaviour                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| Consent must be specific               | Separate consent for appointment reminders, refill reminders, marketing, WhatsApp, SMS |
| Opt-out must be easy                   | STOP, unsubscribe link, preference centre                                              |
| Marketing consent is separate          | A patient can accept appointment reminders but reject promotions                       |
| Sensitive data needs caution           | Health details should be minimized in messages                                         |
| Children/minors need guardian controls | Send to guardian where appropriate                                                     |
| Consent withdrawal must work           | Stop future non-essential messages immediately or within configured SLA                |
| Evidence must be stored                | Consent source, date, wording, channel, user                                           |

---

## B. Health-product advertising restrictions

PPB’s advertisement and promotion guideline page says the guideline provides minimum requirements for authorization to advertise and promote health products and technologies in Kenya, including restrictions and application procedures for approval. The Pharmacy and Poisons Act also prohibits misleading advertisements referring to drugs, medicines, medical appliances or similar articles where the Board considers the claims extravagant or unrelated to pharmacological properties or action. ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/guideline-for-advertisement-and-promotion-of-health-products-and-technologies/)) ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/1956/17/eng%402023-12-11))

Software implication:

| Requirement                                | System behaviour                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| Health education ≠ medicine advertising    | Education content should avoid promoting prescription medicines                 |
| Prescription medicine promotions are risky | Block marketing campaigns for prescription-only medicines unless approved/legal |
| Claims must be controlled                  | No exaggerated cure claims                                                      |
| Content approval needed                    | Pharmacist/compliance approval for health-product messages                      |
| Record campaign evidence                   | Template, approver, audience, date, consent, opt-out                            |

---

## C. M-Pesa payment prompts

Safaricom’s M-Pesa developer portal exposes APIs for Customer-to-Business payments, reversals, and transaction-status queries. This supports payment prompts and reconciliation when tied properly to invoices. ([business.m-pesa.com](https://business.m-pesa.com/developers/))

Software implication:

| Requirement                         | System behaviour                                                          |
| ----------------------------------- | ------------------------------------------------------------------------- |
| Payment prompt must link to invoice | No orphan STK prompts                                                     |
| Amount must match bill              | Prevent wrong or fraudulent payment requests                              |
| Callback must reconcile             | Payment status updates invoice/payment record                             |
| Failed prompt should not mark paid  | Wait for confirmation                                                     |
| Reversal must be traceable          | Link reversal to original transaction                                     |
| Payment message must be safe        | Include amount, facility name, invoice reference, not sensitive diagnosis |

---

## D. WhatsApp templates and governed messaging

If using the WhatsApp Business Platform, the system should support approved message templates and separate message types such as transactional reminders, utility notifications, and marketing messages. Meta’s WhatsApp Business Platform training covers setting up and managing templates and sending different message types through the platform. ([facebookblueprint.com](https://www.facebookblueprint.com/student/path/253055-message-templates))

Software implication:

| Requirement                 | System behaviour                                        |
| --------------------------- | ------------------------------------------------------- |
| Templates are controlled    | Approved templates only for automated outbound WhatsApp |
| Template category matters   | Utility, authentication, marketing                      |
| Consent still required      | WhatsApp consent separate from SMS consent              |
| Sensitive content minimized | Avoid clinical details in WhatsApp body                 |
| Human handoff               | Allow patient reply to staff where appropriate          |
| Template audit              | Store template version and approval status              |

---

# 3. Communication categories

The module should classify messages before sending them.

| Category              | Examples                                        |                            Consent required? | Notes                          |
| --------------------- | ----------------------------------------------- | -------------------------------------------: | ------------------------------ |
| Care reminder         | Appointment, refill, chronic review             | Yes, except essential-care policy exceptions | Keep content minimal           |
| Transactional         | Payment prompt, receipt link, invoice ready     |                Yes/reasonable service notice | Link to invoice                |
| Clinical notification | Lab result ready, visit summary ready           |                                          Yes | Do not expose sensitive result |
| Safety alert          | Medicine recall, urgent follow-up               |                Strongly justified; still log | May be clinically necessary    |
| Marketing             | Offers, loyalty, promotions                     |                   Explicit marketing consent | Must allow opt-out             |
| Health education      | Diabetes tips, BP advice, vaccination education |                          Consent recommended | Avoid drug advertising         |
| Claim/billing         | Pre-auth approved, patient balance              |                       Consent/service notice | Avoid exposing diagnosis       |
| Administrative        | Clinic hours, branch closure                    |                          Consent recommended | Low sensitivity                |
| Security              | OTP, login verification                         |                    Consent/service necessity | No marketing                   |

---

# 4. Core users

| User                    | Main actions                                                         |
| ----------------------- | -------------------------------------------------------------------- |
| Receptionist            | Sends appointment reminders, confirms patient phone, records consent |
| Pharmacist              | Sets refill reminders, medicine counselling messages, recall contact |
| Clinician               | Sets follow-up reminders and safe health education                   |
| Lab user                | Marks result ready, triggers result notification                     |
| Billing officer         | Sends payment prompts and balance reminders                          |
| Claims officer          | Sends pre-auth/claim/patient-balance updates                         |
| Marketing/admin         | Creates campaigns, loyalty messages, education templates             |
| Compliance officer      | Approves health-product content and campaign rules                   |
| Data protection officer | Reviews consent, opt-out, access, export, communication logs         |
| Owner/manager           | Reviews campaign effectiveness and communication costs               |
| System admin            | Configures channels, providers, templates, sender IDs, APIs          |

---

# 5. Relationship with modules 1–8

| Source module            | Communication use                                                         |
| ------------------------ | ------------------------------------------------------------------------- |
| Organisation/licensing   | Branch name, contacts, permitted services, DPO contact                    |
| POS/billing              | Payment prompts, receipts, invoices, balances                             |
| Pharmacy dispensing      | Refills, medication counselling, recalls                                  |
| Inventory                | Batch recalls, stock-arrival notifications, near-expiry caution workflows |
| Clinic EMR               | Appointments, follow-ups, visit summaries, referrals                      |
| Lab-lite                 | Result-ready notifications                                                |
| Claims                   | Pre-auth decisions, claim balances, rejected claim patient portions       |
| Reporting                | Consent reports, delivery reports, campaign reports, opt-out reports      |
| Security/user management | OTP, login alerts, data-access notifications where enabled                |

---

# 6. Feature-by-feature design

## A. Consent management

Consent is the foundation. Without this, the rest of the module becomes risky.

### Consent types

| Consent type                   | Example                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| SMS appointment reminders      | “Send me appointment reminders by SMS”                           |
| WhatsApp appointment reminders | “Send me appointment reminders on WhatsApp”                      |
| SMS refill reminders           | “Remind me when my medicines are due”                            |
| WhatsApp refill reminders      | “Remind me on WhatsApp”                                          |
| Lab result-ready notification  | “Notify me when results are ready”                               |
| Digital receipts               | “Send receipts by SMS/WhatsApp/email”                            |
| Payment prompts                | “Send payment requests to my phone”                              |
| Health education               | “Send general health education messages”                         |
| Marketing/loyalty              | “Send offers and loyalty messages”                               |
| Data sharing/referral          | “Share my information with referral facility/payer where needed” |
| Guardian communication         | For minors or dependent adults                                   |
| Emergency contact              | Contact next of kin in urgent situations                         |

### Consent fields

| Field                   |          Required? | Notes                                                 |
| ----------------------- | -----------------: | ----------------------------------------------------- |
| Patient ID              |                Yes | Link to patient                                       |
| Consent type            |                Yes | Appointment/refill/marketing/etc.                     |
| Channel                 |                Yes | SMS, WhatsApp, email, call                            |
| Consent status          |                Yes | Given, refused, withdrawn, pending                    |
| Consent wording/version |                Yes | Store exact wording                                   |
| Consent source          |                Yes | Registration form, portal, SMS reply, WhatsApp, paper |
| Captured by             |                Yes | User/system                                           |
| Captured date/time      |                Yes |                                                       |
| Expiry/review date      |           Optional | Useful for long-term records                          |
| Withdrawal date         |       If withdrawn |                                                       |
| Withdrawal channel      |       If withdrawn | STOP, portal, staff                                   |
| Guardian/representative | If minor/dependent |                                                       |
| Evidence document       |           Optional | Signed form/screenshot                                |
| Notes                   |           Optional |                                                       |

### Consent rules

| Rule                              | System behaviour                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| No consent for channel            | Do not send non-essential message on that channel                                                 |
| Marketing consent missing         | Block marketing/loyalty messages                                                                  |
| Appointment consent missing       | Do not send automated reminder unless configured as service notice and lawful basis is documented |
| Consent withdrawn                 | Suppress future messages of that type                                                             |
| Patient opts out of all marketing | Block all marketing across channels                                                               |
| Minor patient                     | Use guardian contact and appropriate consent                                                      |
| Sensitive condition               | Require stricter template and channel rules                                                       |
| Consent changed                   | Keep historical versions, do not overwrite                                                        |
| Phone number changed              | Reconfirm communication preferences                                                               |

---

## B. SMS/WhatsApp refill reminders

Refill reminders improve chronic-care adherence and repeat business, but they must not reveal too much.

### Refill reminder sources

| Source                   | Example                                       |
| ------------------------ | --------------------------------------------- |
| Pharmacy refill plan     | Chronic medicine due                          |
| Partial dispense balance | Patient bought part of prescription           |
| EMR chronic-care plan    | Hypertension review due                       |
| Dispensing history       | 30-day supply nearing end                     |
| Patient request          | “Remind me next month”                        |
| Stock arrival            | Previously unavailable medicine now available |

### Refill reminder fields

| Field                | Notes                                           |
| -------------------- | ----------------------------------------------- |
| Patient              | Link                                            |
| Medicine/refill plan | Link                                            |
| Last dispensed date  | Auto                                            |
| Days supplied        | Auto/manual                                     |
| Next refill date     | Auto                                            |
| Reminder schedule    | 7 days before, 3 days before, due date, overdue |
| Channel              | SMS/WhatsApp/call                               |
| Consent status       | Required                                        |
| Message template     | Approved template                               |
| Sensitivity level    | Normal/sensitive                                |
| Branch contact       | Where to refill                                 |
| Status               | Scheduled, sent, failed, cancelled, opted out   |
| Outcome              | Patient came, ignored, rescheduled              |

### Safe refill message examples

Good:

```text
AfyaCare: Your refill is due soon. Please contact Rongai branch on 07XX XXX XXX or visit us. Reply STOP to opt out.
```

Avoid:

```text
Your HIV medicine refill is due tomorrow.
```

Avoid exposing:

| Avoid in SMS/WhatsApp body    |
| ----------------------------- |
| HIV/TB status                 |
| Mental health condition       |
| STI treatment                 |
| Pregnancy test result         |
| Exact sensitive medicine name |
| Controlled medicine details   |
| Full diagnosis                |

### Refill reminder rules

| Rule                       | System behaviour                                    |
| -------------------------- | --------------------------------------------------- |
| No refill consent          | Do not send                                         |
| Sensitive medicine         | Use generic “your medication/refill” wording        |
| Controlled medicine        | Pharmacist approval required before reminder        |
| Refill too early           | Do not send unless plan allows                      |
| Patient opted out          | Suppress                                            |
| Patient has no valid phone | Create manual follow-up task                        |
| Stock unavailable          | Do not promise availability                         |
| Medicine recalled          | Suppress normal refill and route to safety workflow |
| Patient deceased/inactive  | Suppress                                            |
| Patient is minor           | Send to guardian where appropriate                  |

---

## C. Appointment reminders

Appointment reminders reduce no-shows and improve clinic flow.

### Appointment reminder fields

| Field                 | Notes                                                    |
| --------------------- | -------------------------------------------------------- |
| Appointment ID        | Link                                                     |
| Patient               | Link                                                     |
| Clinician/service     | Optional                                                 |
| Branch                | Required                                                 |
| Appointment date/time | Required                                                 |
| Reminder schedule     | 24h before, morning of visit, missed appointment         |
| Channel               | SMS/WhatsApp/call/email                                  |
| Consent               | Required                                                 |
| Template              | Approved                                                 |
| Response options      | Confirm, reschedule, cancel                              |
| Status                | Scheduled, sent, delivered, failed, confirmed, cancelled |
| Follow-up action      | Queue update/reschedule                                  |

### Safe appointment reminder examples

```text
AfyaCare: You have an appointment at Rongai branch on Tue 21 May at 10:00 AM. Reply 1 to confirm, 2 to reschedule, STOP to opt out.
```

For sensitive clinics, avoid naming the specialty or condition:

```text
AfyaCare: Your appointment is scheduled for Tue 21 May at 10:00 AM. Call 07XX XXX XXX for changes.
```

### Appointment reminder rules

| Rule                       | System behaviour                                      |
| -------------------------- | ----------------------------------------------------- |
| Consent missing            | Do not send automated reminder                        |
| Appointment cancelled      | Cancel pending reminders                              |
| Appointment rescheduled    | Cancel old reminder and create new one                |
| Patient confirms           | Update appointment status                             |
| Patient replies reschedule | Create task or self-service link                      |
| Patient no-shows           | Trigger missed-appointment workflow if consent allows |
| Sensitive service          | Use neutral wording                                   |
| Minor patient              | Notify guardian/contact according to policy           |

---

## D. Lab result notification

Lab result notifications must be privacy-first. The safest default is: **notify that the result is ready, not what the result says.**

### Result notification fields

| Field                   | Notes                                            |
| ----------------------- | ------------------------------------------------ |
| Lab order/result ID     | Link                                             |
| Patient                 | Link                                             |
| Result sensitivity      | Normal/sensitive/critical                        |
| Result status           | Verified/released                                |
| Clinician review status | Reviewed/not reviewed                            |
| Notification type       | Ready, clinician review needed, urgent follow-up |
| Channel                 | SMS/WhatsApp/call/portal                         |
| Consent                 | Required                                         |
| Message template        | Approved                                         |
| Secure link             | Optional                                         |
| OTP required            | Recommended for portal link                      |
| Notification status     | Sent/failed/read                                 |
| Follow-up required      | Yes/no                                           |

### Safe lab notification examples

Good:

```text
AfyaCare: Your lab results are ready. Please log in using the secure link or contact Rongai branch. Reply STOP to opt out.
```

For sensitive results:

```text
AfyaCare: Your clinic update is ready. Please contact the clinic on 07XX XXX XXX.
```

For critical results:

```text
AfyaCare: Please contact the clinic urgently about your recent visit. Call 07XX XXX XXX.
```

Avoid:

```text
Your HIV test is positive.
```

```text
Your pregnancy test is positive.
```

```text
Your STI result is ready.
```

### Lab result rules

| Rule                      | System behaviour                                         |
| ------------------------- | -------------------------------------------------------- |
| Result not verified       | Do not send result-ready message                         |
| Clinician review required | Notify clinician first                                   |
| Sensitive result          | Use neutral wording and secure access                    |
| Critical result           | Create urgent clinician task and call workflow           |
| Patient lacks consent     | Do not send automated notification                       |
| Patient portal link       | Require OTP or secure authentication                     |
| Wrong phone risk          | Confirm phone before sending sensitive notifications     |
| Minor patient             | Guardian/contact rule applies                            |
| Result corrected          | Send corrected-result notification using neutral wording |

---

## E. Payment link / STK prompt

Payment requests should be tightly linked to invoices and patient accounts.

### Payment prompt use cases

| Use case                 | Example                                |
| ------------------------ | -------------------------------------- |
| Appointment deposit      | Pay booking fee                        |
| Consultation payment     | Pay before seeing clinician            |
| Lab payment              | Pay before sample collection           |
| Pharmacy payment         | Pay for approved prescription          |
| Patient balance          | Pay insurer co-pay or uncovered amount |
| Corporate/credit balance | Company/staff account payment          |
| Teleconsultation payment | Pay before remote consult              |
| Delivery payment         | Pharmacy delivery where lawful         |

### Payment prompt fields

| Field                      |                         Required? |
| -------------------------- | --------------------------------: |
| Invoice/bill ID            |                               Yes |
| Patient/customer           |                               Yes |
| Phone number               |                               Yes |
| Amount                     |                               Yes |
| Branch Till/Paybill        |                               Yes |
| Payment purpose            |                               Yes |
| Prompt channel             | M-Pesa STK/SMS link/WhatsApp link |
| Expiry time                |                       Recommended |
| Initiated by               |                               Yes |
| Initiated at               |                               Yes |
| M-Pesa checkout/request ID |                            If STK |
| Payment status             |                               Yes |
| Callback response          |                            If API |
| Receipt code               |                           If paid |
| Matched invoice            |                               Yes |
| Failure reason             |                         If failed |
| Retry count                |                               Yes |
| Audit log                  |                               Yes |

### Payment prompt rules

| Rule                                  | System behaviour                                      |
| ------------------------------------- | ----------------------------------------------------- |
| No invoice                            | Do not send STK/payment link                          |
| Amount mismatch                       | Block prompt                                          |
| Invoice already paid                  | Block duplicate prompt                                |
| Prompt expired                        | Require new prompt                                    |
| Patient phone changed                 | Reconfirm before sending                              |
| M-Pesa callback missing               | Keep pending; query status                            |
| Payment received but invoice mismatch | Put in suspense/manual reconciliation                 |
| Payment overpaid                      | Create overpayment/credit/refund workflow             |
| Payment failed                        | Do not mark bill as paid                              |
| Sensitive service                     | Payment message should not expose diagnosis/test name |

### Safe payment message example

```text
AfyaCare Rongai: Payment request of KES 1,500 for Invoice AFY-20391. Confirm on M-Pesa. For help call 07XX XXX XXX.
```

Avoid:

```text
Pay KES 1,500 for HIV test.
```

---

## F. Health education

Health education should help patients without becoming unlawful medicine advertising.

### Health education categories

| Category                           | Example                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| General wellness                   | Hydration, hygiene, sleep, diet                         |
| Chronic care                       | BP control, glucose monitoring, asthma triggers         |
| Medication safety                  | Complete your prescribed course, do not share medicines |
| Vaccination education              | General vaccine schedule reminders                      |
| Maternal/child health              | Danger signs, clinic visits                             |
| Public health                      | Handwashing, malaria prevention                         |
| Clinic service education           | “We offer BP checks” where lawful                       |
| Follow-up education                | After procedure or chronic review                       |
| Non-promotional pharmacy education | Safe storage, expiry awareness                          |

### Content controls

| Control                            | Requirement                                                   |
| ---------------------------------- | ------------------------------------------------------------- |
| Consent                            | Health education consent recommended/required if personalized |
| No prescription medicine promotion | Do not advertise prescription-only medicines to the public    |
| No exaggerated claims              | Avoid “cures all,” “guaranteed,” “instant cure”               |
| Approval workflow                  | Pharmacist/clinician/compliance approval                      |
| Source/version                     | Store source and template version                             |
| Audience rules                     | Avoid targeting sensitive conditions without strong basis     |
| Opt-out                            | Include opt-out for recurring education messages              |
| Language                           | English/Kiswahili/local where needed                          |
| Frequency cap                      | Avoid spam                                                    |
| Review date                        | Medical content should expire/review periodically             |

### Good health education examples

```text
AfyaCare: Remember to check your blood pressure regularly and take medicines exactly as prescribed. For advice, speak to a clinician or pharmacist.
```

```text
AfyaCare: Do not use antibiotics without a valid prescription. Talk to a qualified health professional if symptoms persist.
```

Avoid:

```text
Buy Antibiotic X today and cure infections fast.
```

---

## G. Loyalty program

Loyalty is useful for retail products, but must be tightly controlled in pharmacy.

### Loyalty use cases

| Use case                       | Risk level                                    |
| ------------------------------ | --------------------------------------------- |
| Retail goods loyalty           | Low                                           |
| Cosmetics/personal care        | Low/moderate                                  |
| OTC health products            | Moderate                                      |
| Prescription medicines         | High                                          |
| Controlled medicines           | Do not incentivize                            |
| Clinic services                | Sensitive; use caution                        |
| Lab tests                      | Caution, avoid unnecessary testing incentives |
| Chronic-care adherence support | Can be helpful if not promotional             |

### Loyalty fields

| Field             | Notes                                     |
| ----------------- | ----------------------------------------- |
| Customer/patient  | Link                                      |
| Loyalty ID        | Auto                                      |
| Consent           | Marketing/loyalty consent                 |
| Eligible products | Retail-only by default                    |
| Excluded products | Prescription, controlled, sensitive items |
| Points earned     | By eligible purchase                      |
| Points redeemed   | Discount/benefit                          |
| Expiry            | Optional                                  |
| Tier              | Optional                                  |
| Branch scope      | Single branch/chain                       |
| Audit             | Earn/redeem history                       |

### Loyalty rules

| Rule                      | System behaviour                                          |
| ------------------------- | --------------------------------------------------------- |
| Marketing consent missing | Do not enrol automatically                                |
| Prescription medicines    | Exclude from points/promotions by default                 |
| Controlled medicines      | Always exclude                                            |
| Lab tests                 | Do not incentivize medically unnecessary testing          |
| Clinic consultation       | Use caution; avoid misleading inducement                  |
| OTC products              | Allow only where policy permits                           |
| Loyalty message           | Include opt-out                                           |
| Loyalty discount          | Respect Module 2 discount rules                           |
| Patient opts out          | Stop marketing but retain transaction history as required |

### Recommended default

```text
Loyalty applies only to approved retail goods and selected non-prescription items.
Prescription medicines, controlled medicines, sensitive services, and claim-funded services are excluded unless compliance approves a lawful configuration.
```

---

# 7. Message template governance

The system should not allow staff to freely type bulk messages to patients.

## Template categories

| Category              | Example                                        |
| --------------------- | ---------------------------------------------- |
| Appointment reminder  | “Your appointment is scheduled…”               |
| Refill reminder       | “Your refill is due…”                          |
| Lab result ready      | “Your clinic update is ready…”                 |
| Payment prompt        | “Payment request for invoice…”                 |
| Receipt               | “Your receipt is ready…”                       |
| Claim/pre-auth update | “Your approval is ready…”                      |
| Health education      | “General BP care tip…”                         |
| Loyalty/marketing     | “Retail offer…”                                |
| Recall/safety         | “Please contact us about a medicine supplied…” |
| OTP/security          | “Your verification code is…”                   |

## Template fields

| Field                 |                                 Required? |
| --------------------- | ----------------------------------------: |
| Template name         |                                       Yes |
| Category              |                                       Yes |
| Channel               |                        SMS/WhatsApp/email |
| Language              |                                       Yes |
| Message body          |                                       Yes |
| Variables             |                                       Yes |
| Sensitivity level     |                                       Yes |
| Requires consent type |                                       Yes |
| Requires approval     |                                    Yes/no |
| Approved by           |                               If approved |
| Approval date         |                               If approved |
| Version               |                                       Yes |
| Expiry/review date    |                               Recommended |
| Active status         |                                       Yes |
| Opt-out wording       | Required for marketing/recurring messages |
| Character count       |                          SMS cost control |
| WhatsApp template ID  |                             If applicable |

## Template approval rules

| Rule                           | System behaviour                         |
| ------------------------------ | ---------------------------------------- |
| Health education               | Clinician/pharmacist/compliance approval |
| Medicine-related content       | Pharmacist/compliance approval           |
| Marketing                      | Manager/compliance approval              |
| Prescription product promotion | Block by default                         |
| Sensitive result template      | DPO/clinical approval                    |
| Template changed               | New version and approval required        |
| Template expired               | Cannot send until reviewed               |
| Bulk free-text                 | Restricted                               |

---

# 8. Communication preference centre

Patients should be able to choose what they receive.

## Preference options

| Preference                      |
| ------------------------------- |
| SMS appointment reminders       |
| WhatsApp appointment reminders  |
| SMS refill reminders            |
| WhatsApp refill reminders       |
| Lab result-ready notification   |
| Digital receipts                |
| Payment prompts                 |
| Health education                |
| Loyalty/retail offers           |
| Claim/billing updates           |
| Phone call follow-up            |
| Preferred language              |
| Preferred branch                |
| Quiet hours                     |
| Guardian/contact preferences    |
| Stop all marketing              |
| Stop all non-essential messages |

### Preference rules

| Rule                                           | System behaviour                                           |
| ---------------------------------------------- | ---------------------------------------------------------- |
| Patient opts out of marketing                  | Suppress marketing only                                    |
| Patient opts out of WhatsApp                   | Use SMS only if consent exists                             |
| Patient opts out of all non-essential messages | Allow only essential/legal/urgent messages where justified |
| Patient changes language                       | Use matching templates                                     |
| Patient sets quiet hours                       | Do not send non-urgent messages during quiet hours         |
| Patient has no smartphone                      | Do not use secure portal-only communication                |

---

# 9. Inbox and two-way communication

The module should support replies, not just outbound broadcasts.

## Incoming message types

| Incoming message | Action                                     |
| ---------------- | ------------------------------------------ |
| STOP             | Opt out of marketing or configured channel |
| CONFIRM          | Confirm appointment                        |
| RESCHEDULE       | Create reschedule task                     |
| PAID             | Payment verification task if no callback   |
| REFILL           | Refill request to pharmacy queue           |
| RESULTS          | Result-access support task                 |
| HELP             | Contact task                               |
| Complaint        | Escalate to manager                        |
| Adverse reaction | Route to pharmacist/ADR workflow           |
| Wrong number     | Suppress number and verify patient contact |

### Inbox fields

| Field                  |
| ---------------------- |
| Message ID             |
| Patient/customer match |
| Channel                |
| Sender phone           |
| Message text           |
| Received time          |
| Intent                 |
| Assigned department    |
| Priority               |
| Status                 |
| Response               |
| Resolved by            |
| Resolution time        |

### Human handoff rules

| Rule                               | System behaviour                                            |
| ---------------------------------- | ----------------------------------------------------------- |
| Message mentions severe symptoms   | Escalate to clinician/urgent call                           |
| Message mentions medicine reaction | Escalate to pharmacist                                      |
| Payment dispute                    | Escalate to billing                                         |
| Privacy concern                    | Escalate to DPO/compliance                                  |
| Unmatched phone                    | Do not disclose patient data; ask patient to contact clinic |
| Bot cannot classify                | Send to human queue                                         |

---

# 10. Required screens

## Screen 1: Patient communication profile

Sections:

| Section               | Contents                         |
| --------------------- | -------------------------------- |
| Contact details       | Phone, WhatsApp, email           |
| Consent               | Channel and message-type consent |
| Preferences           | Language, quiet hours, branch    |
| Guardian/contact      | For minors/dependents            |
| Communication history | Sent, failed, replies            |
| Opt-out history       | STOP/withdrawals                 |
| Sensitive flags       | Use neutral wording              |
| Notes                 | Communication restrictions       |

---

## Screen 2: Message template manager

Sections:

| Section             | Contents                               |
| ------------------- | -------------------------------------- |
| Template category   | Appointment/refill/result/payment/etc. |
| Channel             | SMS/WhatsApp/email                     |
| Language            | English/Kiswahili                      |
| Message body        | Template text                          |
| Variables           | Patient name, date, branch, amount     |
| Consent requirement | Which consent required                 |
| Sensitivity         | Normal/sensitive                       |
| Approval            | Draft/review/approved                  |
| Version history     | Previous template versions             |
| Test send           | Internal testing                       |

---

## Screen 3: Campaign manager

Used for health education and loyalty campaigns.

Sections:

| Section         | Contents                                        |
| --------------- | ----------------------------------------------- |
| Campaign type   | Health education, loyalty, recall, announcement |
| Audience        | Filtered patient/customer group                 |
| Consent filter  | Required                                        |
| Exclusion rules | Prescription meds, sensitive patients, opt-outs |
| Template        | Approved only                                   |
| Schedule        | Date/time/frequency                             |
| Frequency cap   | Avoid over-messaging                            |
| Approval        | Compliance/manager approval                     |
| Delivery report | Sent/delivered/failed/opt-out                   |
| Outcome         | Visits/refills/sales where lawful               |

---

## Screen 4: Reminder scheduler

Shows:

| Column         |
| -------------- |
| Patient        |
| Reminder type  |
| Channel        |
| Due date       |
| Template       |
| Consent status |
| Sensitivity    |
| Status         |
| Last sent      |
| Next action    |

---

## Screen 5: Lab result notification screen

Shows:

| Column                  |
| ----------------------- |
| Patient                 |
| Result                  |
| Sensitivity             |
| Verification status     |
| Clinician review status |
| Consent status          |
| Notification template   |
| Send status             |
| Follow-up required      |

---

## Screen 6: Payment prompt screen

Shows:

| Column               |
| -------------------- |
| Invoice              |
| Patient/customer     |
| Amount               |
| Phone                |
| Branch Till/Paybill  |
| STK status           |
| M-Pesa code          |
| Payment match status |
| Retry                |
| Failure reason       |

---

## Screen 7: Communication inbox

Shows:

| Column          |
| --------------- |
| Channel         |
| Sender          |
| Matched patient |
| Message         |
| Intent          |
| Priority        |
| Assigned to     |
| Status          |
| Received time   |
| Last response   |

---

## Screen 8: Consent and opt-out dashboard

Cards:

```text
Patients with SMS consent
Patients with WhatsApp consent
Marketing opt-ins
Marketing opt-outs
Withdrawn consent this month
Messages suppressed due to missing consent
Wrong-number reports
Sensitive-message exceptions
```

---

# 11. Workflows

## A. Consent capture at registration

```text
1. Reception enters patient phone number
2. System asks communication preferences
3. Patient selects SMS/WhatsApp/email/call preferences
4. Patient selects message types: reminders, results, receipts, marketing
5. Consent wording is displayed
6. Patient agrees/refuses
7. System stores consent version, user, time, and channel
8. Patient can change preferences later
```

---

## B. Refill reminder workflow

```text
1. Pharmacy dispenses 30-day chronic medicine
2. Refill plan is created
3. System calculates next refill date
4. Consent and sensitivity are checked
5. Approved reminder template is selected
6. Reminder is scheduled
7. Message is sent
8. Delivery status is recorded
9. Patient reply is processed
10. Refill request appears in pharmacy queue
```

---

## C. Appointment reminder workflow

```text
1. Appointment is booked
2. Consent and preferred channel are checked
3. Reminder is scheduled for configured time
4. Patient receives reminder
5. Patient confirms, cancels, or asks to reschedule
6. Queue/appointment status updates
7. No-show follow-up is scheduled if consent allows
```

---

## D. Lab result-ready workflow

```text
1. Lab result is verified
2. System checks sensitivity and clinician review requirement
3. If clinician review required, clinician is notified first
4. If patient notification allowed, neutral message is selected
5. Patient receives result-ready notification
6. Patient accesses secure portal or contacts clinic
7. Access/share event is logged
```

---

## E. Payment prompt workflow

```text
1. Invoice is created in billing
2. Patient/customer phone is confirmed
3. Billing user sends M-Pesa STK/payment request
4. Prompt is linked to invoice
5. Customer approves payment
6. Callback updates payment status
7. Invoice is marked paid
8. Receipt is sent if consent/preference allows
9. Failed or pending prompt appears in reconciliation queue
```

---

## F. Health education campaign workflow

```text
1. Admin creates health education campaign
2. Approved educational template is selected
3. Audience is filtered by consent and exclusions
4. Compliance/clinical approval is obtained
5. Messages are scheduled
6. Delivery and opt-out are tracked
7. Campaign report is generated
```

---

## G. Loyalty workflow

```text
1. Customer consents to loyalty/marketing
2. Customer buys eligible retail item
3. System awards points
4. Prescription/controlled/sensitive items are excluded
5. Customer receives loyalty update if consent exists
6. Customer redeems points on eligible items
7. Redemption is audited and reported
```

---

# 12. Rules engine

## Consent rule

```text
RULE: Send non-essential message
IF patient.consent[channel][message_type] = given
AND patient.opt_out[message_type] = false
THEN allow send
ELSE suppress message and log reason
```

## Marketing rule

```text
RULE: Send marketing campaign
IF patient.marketing_consent = given
AND template.category = marketing
AND opt_out = false
AND template.status = approved
THEN allow send
ELSE suppress
```

## Lab result privacy rule

```text
RULE: Lab result notification
IF result.status = verified
AND consent.lab_notification = given
AND template.does_not_include_result_value = true
THEN allow result-ready notification
ELSE block
```

## Sensitive result rule

```text
RULE: Sensitive result
IF result.sensitivity = sensitive
THEN message_body must use neutral wording
AND secure_access_required = true
AND direct result value in SMS/WhatsApp is blocked
```

## Payment prompt rule

```text
RULE: Send payment prompt
IF invoice.status IN [unpaid, partially_paid]
AND prompt.amount = invoice.balance_due
AND phone_verified = true
AND invoice.branch_payment_account exists
THEN allow prompt
ELSE block
```

## Health product advertising rule

```text
RULE: Medicine promotion
IF campaign.references_prescription_medicine = true
OR campaign.references_controlled_medicine = true
THEN block by default
AND require compliance approval/legal basis if configurable
```

## Loyalty rule

```text
RULE: Award loyalty points
IF item.category IN eligible_loyalty_categories
AND item.prescription_required = false
AND item.controlled_flag = false
AND customer.loyalty_consent = given
THEN award points
ELSE do not award points
```

## Opt-out rule

```text
RULE: STOP message
IF incoming_message.text matches configured_optout_keywords
THEN update patient preference
AND suppress future messages for selected category/channel
AND send confirmation if allowed
```

---

# 13. Data model

## Main tables

### `communication_consents`

| Field                   |
| ----------------------- |
| id                      |
| patient_id              |
| consent_type            |
| channel                 |
| status                  |
| consent_wording_version |
| source                  |
| captured_by             |
| captured_at             |
| withdrawn_at            |
| withdrawal_channel      |
| guardian_id             |
| evidence_document_id    |
| notes                   |

### `communication_preferences`

| Field                       |
| --------------------------- |
| id                          |
| patient_id                  |
| preferred_language          |
| preferred_channel           |
| quiet_hours_start           |
| quiet_hours_end             |
| allow_sms                   |
| allow_whatsapp              |
| allow_email                 |
| allow_calls                 |
| allow_marketing             |
| allow_health_education      |
| allow_payment_prompts       |
| allow_lab_notifications     |
| allow_refill_reminders      |
| allow_appointment_reminders |
| updated_at                  |

### `message_templates`

| Field                 |
| --------------------- |
| id                    |
| template_code         |
| template_name         |
| category              |
| channel               |
| language              |
| body_text             |
| variables_json        |
| sensitivity_level     |
| required_consent_type |
| requires_approval     |
| approval_status       |
| approved_by           |
| approved_at           |
| version               |
| external_template_id  |
| optout_required       |
| review_due_date       |
| active_status         |

### `communication_events`

| Field               |
| ------------------- |
| id                  |
| patient_id          |
| customer_id         |
| message_type        |
| channel             |
| template_id         |
| recipient_phone     |
| recipient_email     |
| subject             |
| message_body_hash   |
| related_module      |
| related_record_id   |
| sensitivity_level   |
| consent_checked     |
| consent_id          |
| status              |
| provider_message_id |
| sent_at             |
| delivered_at        |
| failed_at           |
| failure_reason      |
| opened_at           |
| replied_at          |
| created_by          |
| branch_id           |

### `message_queue`

| Field              |
| ------------------ |
| id                 |
| scheduled_at       |
| priority           |
| patient_id         |
| template_id        |
| channel            |
| related_module     |
| related_record_id  |
| payload_json       |
| status             |
| retry_count        |
| last_attempt_at    |
| suppression_reason |

### `incoming_messages`

| Field               |
| ------------------- |
| id                  |
| channel             |
| sender_phone        |
| patient_id          |
| raw_message         |
| detected_intent     |
| related_event_id    |
| assigned_department |
| assigned_to         |
| priority            |
| status              |
| received_at         |
| resolved_at         |
| resolution_notes    |

### `refill_reminders`

| Field                  |
| ---------------------- |
| id                     |
| patient_id             |
| refill_plan_id         |
| medicine_id            |
| last_dispensed_at      |
| days_supply            |
| next_refill_date       |
| reminder_schedule_json |
| channel                |
| consent_id             |
| sensitivity_level      |
| status                 |
| last_sent_at           |
| outcome                |

### `appointment_reminders`

| Field             |
| ----------------- |
| id                |
| appointment_id    |
| patient_id        |
| reminder_datetime |
| channel           |
| template_id       |
| consent_id        |
| status            |
| patient_response  |
| sent_at           |
| response_at       |

### `payment_prompts`

| Field               |
| ------------------- |
| id                  |
| invoice_id          |
| patient_id          |
| customer_id         |
| branch_id           |
| amount              |
| phone_number        |
| payment_method      |
| provider            |
| checkout_request_id |
| merchant_request_id |
| payment_reference   |
| status              |
| initiated_by        |
| initiated_at        |
| expires_at          |
| confirmed_at        |
| failure_reason      |
| retry_count         |

### `loyalty_accounts`

| Field          |
| -------------- |
| id             |
| patient_id     |
| customer_id    |
| loyalty_number |
| consent_id     |
| points_balance |
| tier           |
| status         |
| enrolled_at    |
| opted_out_at   |

### `loyalty_transactions`

| Field              |
| ------------------ |
| id                 |
| loyalty_account_id |
| sale_id            |
| transaction_type   |
| points             |
| eligible_amount    |
| excluded_amount    |
| reason             |
| created_at         |
| created_by         |

### `communication_audit_logs`

| Field          |
| -------------- |
| id             |
| entity_type    |
| entity_id      |
| action         |
| old_value_json |
| new_value_json |
| reason         |
| performed_by   |
| approved_by    |
| branch_id      |
| created_at     |

---

# 14. API design

## Consent and preferences endpoints

| Endpoint                                                  | Purpose                 |
| --------------------------------------------------------- | ----------------------- |
| `POST /patients/{id}/communication-consents`              | Capture consent         |
| `PATCH /patients/{id}/communication-consents/{consentId}` | Update/withdraw consent |
| `GET /patients/{id}/communication-preferences`            | View preferences        |
| `PATCH /patients/{id}/communication-preferences`          | Update preferences      |
| `POST /communication/opt-out`                             | Process STOP/opt-out    |
| `GET /communication/consent-report`                       | Consent report          |

## Template endpoints

| Endpoint                                           | Purpose             |
| -------------------------------------------------- | ------------------- |
| `POST /communication/templates`                    | Create template     |
| `POST /communication/templates/{id}/submit-review` | Submit for approval |
| `POST /communication/templates/{id}/approve`       | Approve template    |
| `POST /communication/templates/{id}/deactivate`    | Deactivate template |
| `GET /communication/templates/search`              | Search templates    |

## Message sending endpoints

| Endpoint                                     | Purpose                   |
| -------------------------------------------- | ------------------------- |
| `POST /communication/send`                   | Send single message       |
| `POST /communication/schedule`               | Schedule message          |
| `POST /communication/campaigns`              | Create campaign           |
| `POST /communication/campaigns/{id}/approve` | Approve campaign          |
| `POST /communication/campaigns/{id}/launch`  | Launch campaign           |
| `GET /communication/events`                  | Message history           |
| `POST /communication/webhooks/delivery`      | Delivery callback         |
| `POST /communication/webhooks/incoming`      | Incoming message callback |

## Reminder endpoints

| Endpoint                          | Purpose                     |
| --------------------------------- | --------------------------- |
| `POST /refill-reminders`          | Create refill reminder      |
| `POST /appointment-reminders`     | Create appointment reminder |
| `GET /reminders/due`              | Due reminders               |
| `POST /reminders/{id}/cancel`     | Cancel reminder             |
| `POST /reminders/{id}/reschedule` | Reschedule reminder         |

## Lab notification endpoints

| Endpoint                                 | Purpose                        |
| ---------------------------------------- | ------------------------------ |
| `POST /lab-results/{id}/notify-ready`    | Send result-ready notification |
| `POST /lab-results/{id}/secure-link`     | Generate secure result link    |
| `POST /lab-results/{id}/clinician-alert` | Notify clinician               |

## Payment prompt endpoints

| Endpoint                              | Purpose                  |
| ------------------------------------- | ------------------------ |
| `POST /payment-prompts`               | Create payment prompt    |
| `POST /payment-prompts/{id}/send-stk` | Send STK prompt          |
| `POST /payment-prompts/{id}/status`   | Query status             |
| `POST /payment-prompts/webhook`       | Receive payment callback |
| `POST /payment-prompts/{id}/cancel`   | Cancel prompt            |

## Loyalty endpoints

| Endpoint                     | Purpose              |
| ---------------------------- | -------------------- |
| `POST /loyalty/enrol`        | Enrol customer       |
| `POST /loyalty/earn`         | Award points         |
| `POST /loyalty/redeem`       | Redeem points        |
| `GET /loyalty/{id}`          | View loyalty account |
| `POST /loyalty/{id}/opt-out` | Opt out              |

---

# 15. Integration points

| Integration                         | Purpose                                         |
| ----------------------------------- | ----------------------------------------------- |
| SMS gateway                         | Send SMS and receive delivery reports           |
| WhatsApp Business Platform/provider | Send approved templates and receive replies     |
| M-Pesa Daraja                       | STK prompts, C2B, transaction status, reversals |
| EMR                                 | Appointments, follow-ups, visit summaries       |
| Pharmacy                            | Refill reminders, recall notifications          |
| Lab-lite                            | Result-ready notifications                      |
| Billing/POS                         | Payment prompts, receipts, invoice links        |
| Claims                              | Pre-auth and patient balance notifications      |
| Patient portal                      | Secure result/summary access                    |
| Document storage                    | Secure links to summaries/results               |
| Reporting                           | Delivery, opt-out, campaign, consent reports    |
| Security                            | OTP and access verification                     |
| DPO/compliance                      | Consent and data-access audit                   |

---

# 16. Permissions

| Permission                   | Reception | Pharmacist | Clinician |     Lab | Billing | Marketing/Admin | Manager | DPO/Compliance |
| ---------------------------- | --------: | ---------: | --------: | ------: | ------: | --------------: | ------: | -------------: |
| Capture consent              |       Yes |        Yes |       Yes | Limited |     Yes |              No |     Yes |           View |
| Edit preferences             |       Yes |    Limited |   Limited |      No | Limited |              No |     Yes |           View |
| Send appointment reminder    |       Yes |         No |       Yes |      No |      No |              No |     Yes |           View |
| Send refill reminder         |        No |        Yes |   Limited |      No |      No |              No |     Yes |           View |
| Send lab result-ready notice |        No |         No |       Yes |     Yes |      No |              No |     Yes |           View |
| Send payment prompt          |        No |    Limited |        No |      No |     Yes |              No |     Yes |           View |
| Create health template       |        No |        Yes |       Yes |      No |      No |             Yes |     Yes |           View |
| Approve health template      |        No |        Yes |       Yes |      No |      No |              No |     Yes |            Yes |
| Create marketing campaign    |        No |         No |        No |      No |      No |             Yes |     Yes |           View |
| Approve marketing campaign   |        No |         No |        No |      No |      No |              No |     Yes |            Yes |
| View communication history   |   Limited |    Limited |   Limited | Limited | Limited |             Yes |     Yes |            Yes |
| Export communication logs    |        No |         No |        No |      No |      No |              No | Limited |            Yes |
| Process opt-out              |       Yes |        Yes |       Yes |     Yes |     Yes |             Yes |     Yes |            Yes |

---

# 17. Reports

| Report                             | Purpose                                         |
| ---------------------------------- | ----------------------------------------------- |
| Consent report                     | Who has consented to which channel/message type |
| Opt-out report                     | Patients who opted out and when                 |
| Message delivery report            | Sent, delivered, failed, pending                |
| Failed messages report             | Invalid numbers, gateway errors                 |
| Refill reminder report             | Due, sent, responded, converted                 |
| Appointment reminder report        | Confirmed, cancelled, no-show                   |
| Lab notification report            | Result-ready notices sent and pending           |
| Payment prompt report              | STK sent, paid, failed, expired                 |
| Campaign performance               | Health education/loyalty campaign outcomes      |
| Loyalty report                     | Points earned/redeemed, excluded items          |
| Sensitive message exception report | Any message blocked or sent under special rules |
| Wrong-number report                | Patient contact-quality issue                   |
| Communication cost report          | SMS/WhatsApp cost by branch/campaign            |
| Template approval report           | Draft, approved, expired templates              |
| Data sharing/export report         | Secure links and result/summary sharing         |

---

# 18. Privacy and security controls

| Control                   | Requirement                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| Consent check before send | Mandatory for non-essential messages                                     |
| Sensitive content masking | Use neutral wording                                                      |
| Secure links              | For lab results and visit summaries                                      |
| OTP verification          | For patient portal/result access                                         |
| Channel separation        | SMS consent ≠ WhatsApp consent                                           |
| Opt-out handling          | STOP and preference-centre updates                                       |
| Message body minimization | Avoid diagnosis/result/medicine names where sensitive                    |
| Wrong-number handling     | Suppress and verify phone                                                |
| Audit trail               | Every send, failure, reply, opt-out, export                              |
| Template approval         | Prevent unsafe ad hoc messaging                                          |
| Role-based access         | Staff see only appropriate communication details                         |
| Delivery log retention    | Retain metadata, avoid storing excessive sensitive body text             |
| Human review              | Sensitive/critical messages require staff oversight                      |
| Campaign suppression      | Exclude minors, sensitive patients, opt-outs, deceased/inactive patients |

---

# 19. Edge cases

| Edge case                                      | Correct handling                                            |
| ---------------------------------------------- | ----------------------------------------------------------- |
| Patient gives SMS consent but not WhatsApp     | SMS allowed, WhatsApp suppressed                            |
| Patient opts out of marketing only             | Continue appointment/lab/payment notices if consent exists  |
| Patient sends STOP                             | Update preference and confirm opt-out                       |
| Patient replies with emergency symptoms        | Escalate to clinician/urgent call queue                     |
| Lab result is sensitive                        | Send neutral “clinic update ready” message only             |
| Lab result is critical                         | Notify clinician and create urgent call task                |
| M-Pesa prompt sent to wrong phone              | Cancel/reconcile; verify phone before retry                 |
| Payment made but not matched                   | Hold in suspense and reconcile manually                     |
| Patient changes phone number                   | Reconfirm consent and update contact                        |
| Minor patient has own phone                    | Apply guardian/clinic policy                                |
| Prescription drug included in loyalty campaign | Block                                                       |
| Controlled medicine refill due                 | Pharmacist review before any reminder                       |
| Patient deceased/inactive                      | Suppress messages                                           |
| Branch closed/rescheduled appointment          | Cancel old reminder and send update if consent exists       |
| Campaign template edited after approval        | New approval required                                       |
| Bulk campaign includes opt-outs                | Suppress opt-outs and log count                             |
| WhatsApp template rejected                     | Disable template and use alternative channel/template       |
| SMS gateway fails                              | Retry or failover provider                                  |
| Patient disputes consent                       | Show consent evidence and stop future messages if withdrawn |

---

# 20. MVP versus later versions

## MVP

Build these first:

| Feature                            | Reason                                      |
| ---------------------------------- | ------------------------------------------- |
| Consent management                 | Legal and privacy foundation                |
| Communication preferences          | Patient control                             |
| SMS appointment reminders          | High clinic value                           |
| SMS refill reminders               | Pharmacy/chronic-care value                 |
| Lab result-ready notification      | Practical clinic need                       |
| Payment prompt/STK link to invoice | Revenue collection                          |
| Message templates                  | Prevent unsafe free-text                    |
| Opt-out handling                   | Data protection compliance                  |
| Communication history              | Audit                                       |
| Delivery status                    | Operational control                         |
| Basic health education templates   | Patient engagement                          |
| Retail-only loyalty                | Safer loyalty launch                        |
| Reports                            | Consent, delivery, opt-out, payment prompts |

## Version 2

Add:

| Feature                             | Reason                                  |
| ----------------------------------- | --------------------------------------- |
| WhatsApp Business integration       | Better engagement                       |
| Two-way inbox                       | Patient replies and workflow automation |
| Secure result/summary links         | Privacy                                 |
| OTP verification                    | Safer patient access                    |
| Campaign approval workflow          | Compliance                              |
| Health education segmentation       | Better targeting                        |
| Refill conversion tracking          | Pharmacy analytics                      |
| Appointment confirmation/reschedule | Reduce no-shows                         |
| Loyalty tiers                       | Retail growth                           |
| Communication cost dashboard        | Cost control                            |
| Human handoff routing               | Better patient support                  |

## Version 3

Add:

| Feature                                           | Reason                               |
| ------------------------------------------------- | ------------------------------------ |
| Patient mobile portal                             | Self-service                         |
| AI intent classification                          | Route replies faster                 |
| Personalised chronic-care journeys                | Better adherence                     |
| Omnichannel orchestration                         | SMS/WhatsApp/email/call coordination |
| Automated recall outreach                         | Patient safety                       |
| Advanced consent centre                           | DPO maturity                         |
| Campaign risk scoring                             | Prevent unsafe content               |
| Multilingual library                              | English/Kiswahili/local languages    |
| Chatbot with clinician/pharmacist handoff         | Convenience                          |
| Integration with national digital health services | Future readiness                     |

---

# 21. Acceptance criteria

The module is ready when it passes these tests:

| Test                      | Expected result                                                     |
| ------------------------- | ------------------------------------------------------------------- |
| Capture consent           | Patient consent is stored by channel and message type               |
| Withdraw consent          | Future messages of that type are suppressed                         |
| Send refill reminder      | Message sends only if refill consent exists                         |
| Sensitive refill          | Message avoids medicine/condition details                           |
| Send appointment reminder | Reminder sends and patient can confirm/reschedule                   |
| Cancel appointment        | Pending reminder is cancelled                                       |
| Lab result notification   | Only verified result triggers neutral result-ready message          |
| Sensitive lab result      | No result value/diagnosis appears in SMS/WhatsApp                   |
| Payment prompt            | STK/payment request links to invoice and exact amount               |
| Payment callback          | Payment reconciles to invoice                                       |
| Failed payment            | Invoice remains unpaid                                              |
| Health education          | Only approved template is sent to consented patients                |
| Medicine promotion        | Prescription/controlled medicine campaign is blocked                |
| Loyalty                   | Points apply only to eligible retail/non-restricted items           |
| Opt-out                   | STOP updates preference and logs event                              |
| Inbox reply               | Patient reply creates task or updates workflow                      |
| Audit                     | Every sent/failed/read/replied/opt-out event is logged              |
| Reports                   | Consent, delivery, opt-out, payment, campaign, loyalty reports work |

---

# 22. Final product behaviour

The Patient Communication Module should behave like this:

| Situation                            | Correct behaviour                                                 |
| ------------------------------------ | ----------------------------------------------------------------- |
| Patient registers                    | Consent and preferences are captured                              |
| Appointment is booked                | Reminder scheduled only for allowed channel                       |
| Chronic refill is due                | Safe refill reminder sent if consent exists                       |
| Lab result is ready                  | Neutral result-ready notice sent, not the actual sensitive result |
| Result is critical                   | Clinician alerted and urgent call task created                    |
| Patient owes money                   | Payment prompt sent only if linked to invoice                     |
| Patient pays                         | Payment matches invoice and receipt can be sent                   |
| Health education campaign is created | Uses approved content and consented audience                      |
| Marketing campaign is created        | Opt-outs excluded and prescription medicines blocked by default   |
| Loyalty points are awarded           | Retail-only or controlled by pharmacy-safe rules                  |
| Patient opts out                     | Future messages suppressed and audit updated                      |
| DPO audits communication             | Consent, templates, sends, opt-outs, exports visible              |

The key design principle is:

**No message should be sent unless the system knows why it is being sent, who approved the wording, whether the patient consented, what channel is allowed, what sensitive information must be hidden, and which invoice, visit, prescription, result, or campaign the message belongs to.**

# Module 9 Gap Closure: Patient Communication — Developer Handoff Addendum

## Updated handoff status

| Area                      |                                                                                              Previous status |                                                                                                                                                 After this closure |
| ------------------------- | -----------------------------------------------------------------------------------------------------------: | -----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Completeness              |                                                                                                         Good |                                                                                                                                                      **Very high** |
| Developer readiness       |                                                                                                       Medium |                                                                **High for consent, messaging infrastructure, payment prompts, secure links, audit, and templates** |
| Accuracy confidence       |                                                             Good directionally; needs legal/content approval |                                                                                         **Good, with explicit legal, pharmacist, DPO, and content-approval gates** |
| Main previous gaps        | Consent wording, provider selection, template approval, secure links/OTP, Daraja details, promotional review |                                                                                                                                                         **Closed** |
| Developer start readiness |                                                        Could build consent/preferences/templates/queues/logs | **Can now implement consent, template governance, SMS/WhatsApp adapters, secure links, OTP, STK prompts, campaign approval, loyalty controls, reports, and audit** |

The updated design principle is:

```text
Patient communication must be permissioned, purposeful, channel-aware, privacy-preserving, auditable, and linked to a real business or clinical event.
```

Kenya’s Data Protection Act defines consent as express, unequivocal, free, specific and informed; it also defines health data as data about a person’s physical or mental health, including data collected during registration for or provision of health services. The Data Protection General Regulations give data subjects an absolute right to object to direct marketing, require opt-out handling, and include simplified opt-out requirements for direct-marketing messages. ([Kenya Law][1])

---

# 1. Final developer decisions

| Gap                        | Final decision                                                                                                                                                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Final consent wording      | Use **versioned consent wording** per channel and purpose: appointment, refill, lab result-ready, payment prompt, digital receipts, health education, loyalty/marketing, WhatsApp, SMS, email, phone call, emergency contact, guardian contact. |
| SMS/WhatsApp separation    | Consent must be stored separately by **channel** and **message purpose**. SMS consent does not imply WhatsApp consent. Appointment consent does not imply marketing consent.                                                                    |
| Provider selection         | Implement provider adapters: `SmsProviderAdapter`, `WhatsAppProviderAdapter`, `EmailProviderAdapter`, `VoiceCallTaskAdapter`. Start provider-agnostic; choose vendors through criteria and configuration, not hard-coding.                      |
| WhatsApp template approval | Use a template lifecycle: draft → internal review → DPO/privacy review → clinical/pharmacy review if health-related → Meta/BSP submission → approved → active → retired.                                                                        |
| Lab-result privacy         | Never send actual sensitive lab values/results in SMS/WhatsApp. Send neutral “result/update ready” messages with secure link or clinic contact.                                                                                                 |
| Secure-link/OTP design     | Use expiring secure links with one-time token + OTP verification. Sensitive results require OTP or authenticated patient portal access.                                                                                                         |
| STK/payment prompt         | Payment prompt must be linked to an invoice, exact balance, branch payment account, patient/customer phone, and Daraja request/callback record.                                                                                                 |
| Daraja details             | Use STK Push for invoice-linked prompts, C2B for manual Till/Paybill reconciliation, Transaction Status Query for disputes/timeouts, Reversal for controlled refunds.                                                                           |
| Health education           | Allowed only through approved non-promotional educational templates. Medicine-specific promotional content requires pharmacist/compliance/legal review and PPB-aligned approval rules.                                                          |
| Loyalty                    | Default loyalty applies to retail-only items. Prescription medicines, controlled medicines, sensitive services, and claim-funded services are excluded unless compliance explicitly approves.                                                   |
| Campaigns                  | Campaigns must run through consent filters, opt-out suppression, content approval, frequency caps, and audit logs.                                                                                                                              |
| Production risk            | WhatsApp templates, medicine-related content, loyalty promotions, and health-product campaigns require DPO/pharmacist/legal sign-off before production.                                                                                         |

PPB’s advertisement and promotion guideline provides the current minimum requirements for authorization to advertise and promote health products and technologies in Kenya, including restrictions and application procedures; this is why the system should block or review medicine-related promotional campaigns instead of allowing ordinary marketing users to send them freely. ([Pharmacy Board][2])

---

# 2. Communication classification model

Every outbound communication must have a purpose class before sending.

## 2.1 Message purpose classes

```text
appointment_reminder
appointment_reschedule
appointment_no_show
refill_reminder
partial_dispense_balance
medicine_recall_safety
lab_result_ready
critical_result_followup
visit_summary_ready
referral_followup
payment_prompt
payment_receipt
invoice_ready
claim_preauth_update
patient_balance_notice
health_education
loyalty_retail
marketing_retail
otp_authentication
security_alert
administrative_notice
manual_staff_message
```

## 2.2 Message risk classes

```text
low_risk_admin
transactional_financial
clinical_low_sensitivity
clinical_sensitive
pharmacy_sensitive
marketing
health_product_promotion
security_authentication
urgent_safety
```

## 2.3 Message channel classes

```text
sms
whatsapp
email
voice_call_task
in_app_patient_portal
printed_handout
```

## 2.4 Purpose-to-control matrix

| Message purpose           |                             Consent required |          Template approval | Sensitive-content rule                            |
| ------------------------- | -------------------------------------------: | -------------------------: | ------------------------------------------------- |
| Appointment reminder      |                                          Yes |       Operational approval | Neutral wording if sensitive clinic/service       |
| Refill reminder           |                                          Yes |    Pharmacist/DPO approval | Avoid sensitive medicine/condition names          |
| Lab result ready          |                                          Yes |      DPO/clinical approval | Never include actual result value in SMS/WhatsApp |
| Critical result follow-up |                Clinical safety basis + audit |          Clinical approval | Neutral urgent wording                            |
| Payment prompt            | Service/payment consent or transaction basis |     Billing/admin approval | Must link to invoice; no diagnosis/test names     |
| Receipt/invoice link      |                 Preference/transaction basis |     Billing/admin approval | Link only; avoid clinical details                 |
| Health education          |     Consent recommended/required if targeted | Clinical/pharmacy approval | No medicine promotion                             |
| Loyalty/marketing         |                   Explicit marketing consent |     Manager/DPO/compliance | Exclude prescription/controlled medicines         |
| Medicine recall           |                         Safety communication |        Pharmacist approval | Use neutral wording and call-to-action            |
| OTP/security              |                            Service necessity |          Security approval | No marketing content                              |

---

# 3. Final consent wording

## 3.1 Consent wording design rules

Consent text must be:

```text
specific
channel-specific
purpose-specific
plain-language
versioned
auditable
withdrawable
separate from marketing opt-in
```

The system must store the exact consent wording version accepted by the patient. The Data Protection General Regulations require opt-out mechanisms for direct marketing and state that where a data subject objects to direct marketing, their personal data should not be processed for that purpose. ([Kenya Law][3])

---

## 3.2 Registration consent wording: master statement

Use this as the base registration text:

```text
I agree that [Facility Name] may use my contact details to communicate with me about healthcare services I receive from the facility, according to the choices I select below. I understand that I can change my choices or withdraw consent later.
```

Store as:

```text
CONSENT_MASTER_HEALTHCARE_COMMUNICATION_V1
```

---

## 3.3 Appointment reminder consent

```text
I agree to receive appointment reminders and appointment updates from [Facility Name].
```

Channel options:

```text
[ ] SMS
[ ] WhatsApp
[ ] Phone call
[ ] Email
```

Consent code:

```text
CONSENT_APPOINTMENT_REMINDERS_V1
```

---

## 3.4 Refill reminder consent

```text
I agree to receive reminders from [Facility Name] when my medication refill or pharmacy follow-up may be due. Messages will use general wording and may not include sensitive diagnosis details.
```

Channel options:

```text
[ ] SMS
[ ] WhatsApp
[ ] Phone call
```

Consent code:

```text
CONSENT_REFILL_REMINDERS_V1
```

---

## 3.5 Lab result-ready notification consent

```text
I agree to receive notifications when my lab results or clinic updates are ready. I understand that SMS or WhatsApp messages should not contain sensitive result details and may direct me to contact the clinic or use a secure link.
```

Channel options:

```text
[ ] SMS
[ ] WhatsApp
[ ] Secure patient portal
[ ] Phone call
```

Consent code:

```text
CONSENT_LAB_RESULT_READY_V1
```

---

## 3.6 Digital receipt/invoice consent

```text
I agree to receive digital receipts, invoices, payment confirmations, and account updates from [Facility Name].
```

Channel options:

```text
[ ] SMS
[ ] WhatsApp
[ ] Email
```

Consent code:

```text
CONSENT_DIGITAL_RECEIPTS_V1
```

---

## 3.7 Payment prompt consent

```text
I agree that [Facility Name] may send payment requests or payment links to my phone for bills or invoices connected to services, products, or medicines I have requested.
```

Channel/payment options:

```text
[ ] M-Pesa STK prompt
[ ] SMS payment link
[ ] WhatsApp payment link
```

Consent code:

```text
CONSENT_PAYMENT_PROMPTS_V1
```

---

## 3.8 Health education consent

```text
I agree to receive general health education messages from [Facility Name]. These messages are for education only and do not replace advice from a qualified health professional.
```

Channel options:

```text
[ ] SMS
[ ] WhatsApp
[ ] Email
```

Consent code:

```text
CONSENT_HEALTH_EDUCATION_V1
```

---

## 3.9 Loyalty and marketing consent

```text
I agree to receive retail loyalty updates, offers, and marketing messages from [Facility Name]. I understand I can opt out at any time by replying STOP or by updating my communication preferences.
```

Channel options:

```text
[ ] SMS
[ ] WhatsApp
[ ] Email
```

Consent code:

```text
CONSENT_MARKETING_LOYALTY_V1
```

Critical rule:

```text
Marketing consent must never be bundled with clinical care consent.
```

---

## 3.10 WhatsApp-specific consent

```text
I agree to receive WhatsApp messages from [Facility Name] for the message types I selected. I understand that WhatsApp messages may be sent through WhatsApp Business Platform or an approved messaging provider.
```

Consent code:

```text
CONSENT_WHATSAPP_CHANNEL_V1
```

WhatsApp says businesses can initiate direct conversations with users who have opted in, and Meta’s WhatsApp Business Platform training covers creating, managing, and submitting templates for review. ([WhatsApp for Business][4])

---

## 3.11 Minor/guardian communication consent

```text
I confirm that I am the parent, guardian, or authorized representative for this patient and agree to receive communication about their appointments, clinic updates, payments, and follow-up according to the preferences selected.
```

Consent code:

```text
CONSENT_GUARDIAN_COMMUNICATION_V1
```

Required when:

```text
patient_is_minor = true
OR patient_requires_representative = true
```

---

## 3.12 Emergency contact consent

```text
I agree that [Facility Name] may contact my listed next of kin or emergency contact if there is an urgent health, safety, or follow-up concern.
```

Consent code:

```text
CONSENT_EMERGENCY_CONTACT_V1
```

---

## 3.13 Consent withdrawal wording

When a patient opts out:

```text
You have opted out of [message type] messages from [Facility Name]. You may still receive essential service, safety, or payment messages where applicable. Contact [phone] to update preferences.
```

For marketing:

```text
You have opted out of marketing messages from [Facility Name]. You will no longer receive promotional messages. Contact [phone] to update preferences.
```

---

# 4. Consent data model

## 4.1 `consent_types`

| Field                      | Required | Example                       |
| -------------------------- | -------: | ----------------------------- |
| `id`                       |      Yes |                               |
| `consent_code`             |      Yes | `CONSENT_REFILL_REMINDERS_V1` |
| `consent_name`             |      Yes | Refill reminders              |
| `message_purpose`          |      Yes | refill_reminder               |
| `channel_specific`         |      Yes | true                          |
| `requires_explicit_opt_in` |      Yes | true                          |
| `allows_withdrawal`        |      Yes | true                          |
| `marketing_flag`           |      Yes | false/true                    |
| `sensitive_health_flag`    |      Yes | true/false                    |
| `active`                   |      Yes |                               |

## 4.2 `consent_wording_versions`

| Field                  |    Required |
| ---------------------- | ----------: |
| `id`                   |         Yes |
| `consent_type_id`      |         Yes |
| `version_code`         |         Yes |
| `wording_text`         |         Yes |
| `language`             |         Yes |
| `effective_from`       |         Yes |
| `effective_to`         |    Optional |
| `approved_by_dpo`      | Conditional |
| `approved_by_clinical` | Conditional |
| `approved_at`          | Conditional |
| `status`               |         Yes |

## 4.3 `patient_consents`

| Field                  |                                Required |
| ---------------------- | --------------------------------------: |
| `id`                   |                                     Yes |
| `patient_id`           |                                     Yes |
| `consent_type_id`      |                                     Yes |
| `wording_version_id`   |                                     Yes |
| `channel`              |                                     Yes |
| `status`               | Yes: given, refused, withdrawn, expired |
| `captured_source`      |                                     Yes |
| `captured_by`          |                                     Yes |
| `captured_at`          |                                     Yes |
| `withdrawn_at`         |                                Optional |
| `withdrawal_source`    |                                Optional |
| `guardian_id`          |                             Conditional |
| `evidence_document_id` |                                Optional |
| `notes`                |                                Optional |

## 4.4 Consent status rules

```text
RULE: Consent is active
IF patient_consents.status = given
AND channel matches message channel
AND consent_type matches message purpose
AND consent wording version is active or historically valid
THEN send may proceed
ELSE suppress message.
```

---

# 5. Provider selection and adapter model

## 5.1 Final provider strategy

Do not hard-code one SMS or WhatsApp vendor. Build provider adapters.

```text
CommunicationProviderAdapter
    ├── SmsProviderAdapter
    ├── WhatsAppProviderAdapter
    ├── EmailProviderAdapter
    ├── PaymentProviderAdapter
    └── VoiceCallTaskAdapter
```

## 5.2 Provider selection criteria

| Criterion                              | Required for production        |
| -------------------------------------- | ------------------------------ |
| Kenya delivery reliability             | Yes                            |
| Delivery receipts/webhooks             | Yes                            |
| API documentation                      | Yes                            |
| Sandbox/test environment               | Strongly preferred             |
| Message templates                      | Required for WhatsApp          |
| Opt-out support                        | Required for marketing         |
| Sender ID support                      | Preferred for SMS              |
| Two-way messaging                      | Required for STOP/replies      |
| Data processing agreement              | Required                       |
| Data residency/cross-border disclosure | DPO review                     |
| Cost transparency                      | Required                       |
| Retry/failure codes                    | Required                       |
| Support SLA                            | Preferred                      |
| WhatsApp Business Platform onboarding  | Required for WhatsApp provider |
| Audit/log export                       | Required                       |

## 5.3 `communication_providers`

| Field                                   |                           Required |
| --------------------------------------- | ---------------------------------: |
| `id`                                    |                                Yes |
| `provider_code`                         |                                Yes |
| `provider_name`                         |                                Yes |
| `provider_type`                         | Yes: sms, whatsapp, email, payment |
| `country_support_json`                  |                           Optional |
| `supports_delivery_receipts`            |                                Yes |
| `supports_inbound_messages`             |                                Yes |
| `supports_templates`                    |                                Yes |
| `supports_opt_out`                      |                                Yes |
| `api_base_url`                          |                        Conditional |
| `credentials_secret_ref`                |                        Conditional |
| `webhook_url`                           |                        Conditional |
| `data_processing_agreement_document_id` |                        Recommended |
| `status`                                |                                Yes |
| `created_at`                            |                                Yes |

## 5.4 `branch_channel_configurations`

| Field                        |    Required |
| ---------------------------- | ----------: |
| `id`                         |         Yes |
| `branch_id`                  |         Yes |
| `channel`                    |         Yes |
| `provider_id`                |         Yes |
| `sender_id`                  |    Optional |
| `whatsapp_business_phone_id` | Conditional |
| `default_language`           |         Yes |
| `fallback_channel`           |    Optional |
| `daily_send_limit`           |    Optional |
| `quiet_hours_start`          |    Optional |
| `quiet_hours_end`            |    Optional |
| `status`                     |         Yes |

---

# 6. Template approval process

## 6.1 Template lifecycle

```text
draft
internal_review
privacy_review
clinical_or_pharmacy_review
legal_or_compliance_review
provider_submission_pending
provider_submitted
provider_approved
provider_rejected
active
paused
retired
```

## 6.2 Approval responsibility matrix

| Template type             | Required approval                                                      |
| ------------------------- | ---------------------------------------------------------------------- |
| Appointment reminder      | Operations + DPO                                                       |
| Refill reminder           | Pharmacist + DPO                                                       |
| Lab result-ready          | Clinical/lab lead + DPO                                                |
| Critical result follow-up | Clinical lead + DPO                                                    |
| Payment prompt            | Billing/finance + DPO                                                  |
| Receipt/invoice           | Billing/finance                                                        |
| Health education          | Clinical lead or pharmacist + DPO                                      |
| Loyalty/marketing         | Manager + DPO + compliance                                             |
| Medicine-related content  | Pharmacist + legal/compliance                                          |
| Health-product promotion  | Pharmacist + legal/compliance + PPB approval tracking where applicable |
| Recall/safety notice      | Pharmacist/superintendent + DPO                                        |
| OTP/security              | Security/admin                                                         |

## 6.3 `message_templates`

| Field                         |    Required |
| ----------------------------- | ----------: |
| `id`                          |         Yes |
| `template_code`               |         Yes |
| `template_name`               |         Yes |
| `message_purpose`             |         Yes |
| `risk_class`                  |         Yes |
| `channel`                     |         Yes |
| `language`                    |         Yes |
| `body_text`                   |         Yes |
| `variables_json`              |         Yes |
| `contains_health_content`     |         Yes |
| `contains_medicine_reference` |         Yes |
| `contains_marketing`          |         Yes |
| `contains_sensitive_content`  |         Yes |
| `required_consent_type_id`    |         Yes |
| `approval_status`             |         Yes |
| `internal_approved_by`        | Conditional |
| `dpo_approved_by`             | Conditional |
| `clinical_approved_by`        | Conditional |
| `pharmacy_approved_by`        | Conditional |
| `legal_approved_by`           | Conditional |
| `provider_template_id`        | Conditional |
| `provider_template_status`    | Conditional |
| `version`                     |         Yes |
| `effective_from`              |         Yes |
| `effective_to`                |    Optional |
| `status`                      |         Yes |

## 6.4 WhatsApp template process

```text
1. Create internal template
2. Classify as utility, authentication, or marketing
3. Run privacy and content checks
4. Obtain internal approvals
5. Submit to WhatsApp provider / Meta
6. Store provider template ID and category
7. Store provider approval status
8. Activate only after provider approval
9. Monitor delivery, blocks, opt-outs, quality issues
```

Meta/WhatsApp training materials cover message template categories, managing templates, template basics, components, and submission for review, so the system should store both internal template approval and provider-side approval status. ([Meta Blueprint][5])

## 6.5 Template validation rules

| Rule                                               | Behaviour                                            |
| -------------------------------------------------- | ---------------------------------------------------- |
| Template lacks consent mapping                     | Cannot activate                                      |
| WhatsApp template not provider-approved            | Cannot send outside active patient-initiated session |
| Marketing template lacks opt-out text              | Block                                                |
| Health education lacks clinical/pharmacy approval  | Block                                                |
| Medicine promotion detected                        | Block until legal/compliance review                  |
| Sensitive template includes result value/diagnosis | Block                                                |
| Template edited after approval                     | New version required                                 |
| Expired template                                   | Cannot send                                          |
| Provider rejects template                          | Status becomes provider_rejected; send blocked       |

---

# 7. Secure-link and OTP design

## 7.1 Final secure-access policy

Use secure links for:

```text
lab results
visit summaries
invoices/receipts where sensitive
claim documents
referral documents
certificate downloads
patient portal access
```

Sensitive clinical content must not be sent directly in SMS/WhatsApp.

## 7.2 Secure-link flow

```text
1. Result/summary/document becomes releasable
2. System creates secure access token
3. SMS/WhatsApp sends neutral message with link
4. Patient opens link
5. System asks for OTP or patient verification
6. OTP is sent to verified contact
7. Patient enters OTP
8. System displays/downloads document
9. Access event is logged
10. Link expires after configured time
```

## 7.3 `secure_access_links`

| Field                    |    Required |
| ------------------------ | ----------: |
| `id`                     |         Yes |
| `token_hash`             |         Yes |
| `patient_id`             |         Yes |
| `linked_entity_type`     |         Yes |
| `linked_entity_id`       |         Yes |
| `document_id`            | Conditional |
| `purpose`                |         Yes |
| `sensitivity_level`      |         Yes |
| `requires_otp`           |         Yes |
| `requires_date_of_birth` |    Optional |
| `expires_at`             |         Yes |
| `max_access_count`       |         Yes |
| `access_count`           |         Yes |
| `status`                 |         Yes |
| `created_by`             |  Yes/system |
| `created_at`             |         Yes |
| `revoked_at`             |    Optional |

Store only the token hash, not the raw token.

## 7.4 `otp_challenges`

| Field                   | Required |
| ----------------------- | -------: |
| `id`                    |      Yes |
| `patient_id`            |      Yes |
| `secure_access_link_id` |      Yes |
| `channel`               |      Yes |
| `destination_masked`    |      Yes |
| `otp_hash`              |      Yes |
| `expires_at`            |      Yes |
| `attempt_count`         |      Yes |
| `max_attempts`          |      Yes |
| `status`                |      Yes |
| `verified_at`           | Optional |

## 7.5 Secure-link default settings

| Setting                           | Default      |
| --------------------------------- | ------------ |
| Link expiry                       | 24 hours     |
| Sensitive result link expiry      | 2–6 hours    |
| OTP expiry                        | 5 minutes    |
| Max OTP attempts                  | 3            |
| Max link opens                    | 3            |
| Require OTP for lab results       | Yes          |
| Require OTP for sensitive results | Yes          |
| Allow result download             | Configurable |
| Watermark downloaded PDF          | Yes          |
| Log every access                  | Yes          |

## 7.6 Secure-link rules

| Rule                      | Behaviour                                              |
| ------------------------- | ------------------------------------------------------ |
| Result not verified       | No link                                                |
| Clinician review required | No patient link until reviewed                         |
| Sensitive result          | Neutral message + OTP                                  |
| Link expired              | Require new link                                       |
| Too many OTP attempts     | Lock and create support task                           |
| Phone number changed      | Reconfirm contact before new link                      |
| Wrong-number report       | Revoke active links                                    |
| Patient is minor          | Guardian access rules apply                            |
| Document corrected        | Old link revoked; corrected document requires new link |
| Link accessed             | Data access event logged                               |

---

# 8. Lab result notification templates

## 8.1 Normal result-ready SMS

```text
[Facility Name]: Your clinic update is ready. Please use the secure link or contact [Branch Phone]. Reply STOP to opt out of result-ready notifications.
```

## 8.2 Sensitive result-ready SMS

```text
[Facility Name]: Your clinic update is ready. Please contact [Branch Phone] or use your secure link. Do not share your access code.
```

## 8.3 Critical-result follow-up SMS

```text
[Facility Name]: Please contact the clinic urgently about your recent visit. Call [Branch Phone].
```

## 8.4 WhatsApp result-ready utility template

```text
Hello {{1}}, your clinic update from {{2}} is ready. Use this secure link: {{3}}. For help call {{4}}.
```

Template controls:

```text
channel = whatsapp
purpose = lab_result_ready
category = utility
sensitive_content_allowed = false
requires_otp = true
```

## 8.5 Hard blocks

Do not allow these message bodies:

```text
Your HIV result is positive.
Your pregnancy test is positive.
Your STI result is ready.
Your TB result is positive.
Your blood sugar is dangerously high: [value].
Your mental health report is ready.
```

Instead, use neutral wording and clinician follow-up.

---

# 9. Daraja implementation details for payment prompts

## 9.1 Final payment communication model

Payment prompts belong to both Module 2 and Module 9:

```text
Module 2 owns invoice, payment, allocation, reconciliation.
Module 9 owns communication, consent, template, send log, patient channel.
Daraja adapter writes payment callback to Module 2.
```

## 9.2 Daraja flows to support

| Flow                     | Use                                                    |
| ------------------------ | ------------------------------------------------------ |
| STK Push                 | Patient/customer receives payment prompt               |
| C2B confirmation         | Customer pays manually to Till/Paybill                 |
| Transaction Status Query | Resolve pending/disputed payment                       |
| Reversal                 | Refund/wrong payment, controlled by manager/accountant |

Safaricom’s Daraja platform provides access to M-Pesa APIs for payment integration; M-Pesa’s developer information portal lists API endpoints including Customer-to-Business, reversals, and transaction-status queries. ([Safaricom Developer Portal][6])

---

## 9.3 Payment prompt lifecycle

```text
draft
ready_to_send
sent_to_provider
pending_customer_action
paid
failed
timeout
query_required
cancelled
expired
manually_reconciled
reversed
```

## 9.4 `payment_prompts`

| Field                     |                     Required |
| ------------------------- | ---------------------------: |
| `id`                      |                          Yes |
| `invoice_id`              |                          Yes |
| `sale_id`                 |                  Conditional |
| `patient_id`              |                  Conditional |
| `customer_id`             |                  Conditional |
| `branch_id`               |                          Yes |
| `amount`                  |                          Yes |
| `currency`                |                          Yes |
| `phone_number`            |                          Yes |
| `phone_verified`          |                          Yes |
| `payment_method`          | Yes: mpesa_stk, payment_link |
| `provider_id`             |                          Yes |
| `shortcode`               |                          Yes |
| `account_reference`       |                          Yes |
| `transaction_description` |                          Yes |
| `consent_checked`         |                          Yes |
| `communication_event_id`  |                  Conditional |
| `checkout_request_id`     |                  Conditional |
| `merchant_request_id`     |                  Conditional |
| `mpesa_receipt_number`    |                  Conditional |
| `status`                  |                          Yes |
| `expires_at`              |                          Yes |
| `initiated_by`            |                          Yes |
| `initiated_at`            |                          Yes |
| `confirmed_at`            |                     Optional |
| `failure_reason`          |                     Optional |

## 9.5 STK request payload mapping

| Daraja/STK field        | Internal source                                       |
| ----------------------- | ----------------------------------------------------- |
| Business shortcode      | Branch M-Pesa config                                  |
| Transaction type        | CustomerPayBillOnline / Till equivalent as configured |
| Amount                  | Invoice balance                                       |
| Party A                 | Customer phone                                        |
| Party B                 | Shortcode                                             |
| Phone number            | Customer phone                                        |
| Account reference       | Invoice number                                        |
| Transaction description | Neutral description                                   |
| Callback URL            | Payment callback endpoint                             |

## 9.6 Safe payment prompt template

```text
[Facility Name]: Payment request of KES {{amount}} for Invoice {{invoice_no}}. Confirm on M-Pesa. For help call {{branch_phone}}.
```

Blocked wording:

```text
Pay KES 1,500 for HIV test.
Pay KES 2,000 for pregnancy test.
Pay KES 3,500 for psychiatric consultation.
```

## 9.7 STK prompt rules

| Rule                                | Behaviour                               |
| ----------------------------------- | --------------------------------------- |
| Invoice missing                     | Block prompt                            |
| Invoice already paid                | Block prompt                            |
| Amount differs from invoice balance | Block prompt                            |
| Phone not verified                  | Warn/block based on policy              |
| Consent/payment preference missing  | Warn or block based on policy           |
| Branch payment account missing      | Block                                   |
| STK callback success                | Mark payment confirmed in Module 2      |
| STK failure                         | Invoice remains unpaid                  |
| STK timeout                         | Query status before retry               |
| Duplicate callback                  | Ignore duplicate posting                |
| Overpayment                         | Move excess to suspense/customer credit |
| Reversal                            | Manager/accountant approval required    |

---

# 10. SMS/WhatsApp queue and delivery

## 10.1 Message queue lifecycle

```text
created
suppressed_no_consent
suppressed_opted_out
suppressed_sensitive_content
queued
sent_to_provider
delivered
failed
expired
cancelled
replied
actioned
```

## 10.2 `message_queue`

| Field                |    Required |
| -------------------- | ----------: |
| `id`                 |         Yes |
| `patient_id`         | Conditional |
| `customer_id`        | Conditional |
| `message_purpose`    |         Yes |
| `channel`            |         Yes |
| `template_id`        |         Yes |
| `provider_id`        |         Yes |
| `recipient`          |         Yes |
| `payload_json`       |         Yes |
| `related_module`     |         Yes |
| `related_record_id`  |         Yes |
| `scheduled_at`       |         Yes |
| `priority`           |         Yes |
| `consent_status`     |         Yes |
| `suppression_reason` | Conditional |
| `status`             |         Yes |
| `retry_count`        |         Yes |
| `last_attempt_at`    |    Optional |
| `created_at`         |         Yes |

## 10.3 `communication_events`

| Field                 |    Required |
| --------------------- | ----------: |
| `id`                  |         Yes |
| `message_queue_id`    |    Optional |
| `patient_id`          | Conditional |
| `channel`             |         Yes |
| `template_id`         |         Yes |
| `message_purpose`     |         Yes |
| `risk_class`          |         Yes |
| `recipient_masked`    |         Yes |
| `provider_message_id` |    Optional |
| `message_body_hash`   |         Yes |
| `status`              |         Yes |
| `sent_at`             |    Optional |
| `delivered_at`        |    Optional |
| `failed_at`           |    Optional |
| `failure_reason`      |    Optional |
| `reply_received_at`   |    Optional |
| `related_module`      |         Yes |
| `related_record_id`   |         Yes |
| `created_by`          |  Yes/system |

Store a message body hash and rendered-variable audit. Avoid storing unnecessary sensitive message content where not needed.

---

# 11. Inbound message handling

## 11.1 Inbound intents

```text
opt_out
confirm_appointment
reschedule_appointment
cancel_appointment
refill_request
payment_query
result_query
wrong_number
complaint
adverse_reaction
urgent_symptom
human_help
unknown
```

## 11.2 Inbound routing

| Intent                   | Route                                        |
| ------------------------ | -------------------------------------------- |
| `opt_out`                | Consent/preferences update                   |
| `confirm_appointment`    | Appointment status update                    |
| `reschedule_appointment` | Reception task                               |
| `refill_request`         | Pharmacy queue                               |
| `payment_query`          | Billing task                                 |
| `result_query`           | Lab/reception task; do not disclose by reply |
| `wrong_number`           | Suppress number and verify patient contact   |
| `adverse_reaction`       | Pharmacist/ADR workflow                      |
| `urgent_symptom`         | Clinician/urgent follow-up                   |
| `complaint`              | Manager/compliance                           |
| `unknown`                | Human inbox                                  |

## 11.3 `inbound_messages`

| Field                         |    Required |
| ----------------------------- | ----------: |
| `id`                          |         Yes |
| `channel`                     |         Yes |
| `provider_id`                 |         Yes |
| `sender`                      |         Yes |
| `sender_patient_match_status` |         Yes |
| `matched_patient_id`          |    Optional |
| `raw_message_hash`            |         Yes |
| `detected_intent`             |         Yes |
| `confidence_score`            |    Optional |
| `assigned_department`         | Conditional |
| `assigned_to`                 |    Optional |
| `priority`                    |         Yes |
| `status`                      |         Yes |
| `received_at`                 |         Yes |
| `resolved_at`                 |    Optional |

---

# 12. Health education and promotional-content governance

## 12.1 Content classification

```text
general_health_education
condition_specific_education
medicine_safety_education
service_announcement
retail_offer
loyalty_update
health_product_promotion
prescription_medicine_promotion
controlled_medicine_promotion
```

## 12.2 Default content rules

| Content type                    | Default behaviour                                                           |
| ------------------------------- | --------------------------------------------------------------------------- |
| General health education        | Allow with health education consent and clinical approval                   |
| Condition-specific education    | Allow with caution and consent; avoid exposing condition in shared channels |
| Medicine safety education       | Allow if non-promotional and pharmacist-approved                            |
| Service announcement            | Allow if not misleading and consented audience                              |
| Retail offer                    | Allow with marketing consent                                                |
| OTC/general pharmacy offer      | Compliance review required                                                  |
| Prescription medicine promotion | Block by default                                                            |
| Controlled medicine promotion   | Block always                                                                |
| Health-product campaign         | Legal/compliance/PPB approval tracking required                             |
| Claims of cure/effectiveness    | Block unless approved wording and evidence/legal basis                      |

## 12.3 `content_approval_records`

| Field                    |                              Required |
| ------------------------ | ------------------------------------: |
| `id`                     |                                   Yes |
| `content_entity_type`    | Yes: template, campaign, loyalty_rule |
| `content_entity_id`      |                                   Yes |
| `content_classification` |                                   Yes |
| `risk_level`             |                                   Yes |
| `clinical_reviewer_id`   |                           Conditional |
| `pharmacy_reviewer_id`   |                           Conditional |
| `dpo_reviewer_id`        |                           Conditional |
| `legal_reviewer_id`      |                           Conditional |
| `ppb_approval_required`  |                                   Yes |
| `ppb_approval_reference` |                           Conditional |
| `approval_status`        |                                   Yes |
| `approval_notes`         |                              Optional |
| `approved_at`            |                           Conditional |

## 12.4 PPB/legal approval gate

```text
RULE: Health-product promotion
IF template_or_campaign.content_classification IN [
  health_product_promotion,
  prescription_medicine_promotion,
  controlled_medicine_promotion
]
THEN block by default
AND require pharmacy + legal/compliance approval
AND require PPB approval reference where policy/regulator requires.
```

---

# 13. Loyalty controls

## 13.1 Final loyalty policy

Default:

```text
Retail-only loyalty.
No points, offers, discounts, or rewards for prescription medicines, controlled medicines, sensitive clinical services, lab tests intended to drive unnecessary testing, or insurer/SHA-funded services.
```

## 13.2 Eligible/ineligible matrix

| Item/service                      | Loyalty default                                          |
| --------------------------------- | -------------------------------------------------------- |
| General retail goods              | Eligible                                                 |
| Cosmetics/personal care           | Eligible if allowed                                      |
| Non-medicine retail items         | Eligible                                                 |
| OTC medicines                     | Compliance-configurable                                  |
| Pharmacy medicines                | Restricted                                               |
| POM medicines                     | Excluded                                                 |
| Controlled medicines              | Excluded                                                 |
| Lab tests                         | Excluded by default                                      |
| Consultation                      | Excluded by default                                      |
| Immunisation                      | Excluded                                                 |
| SHA/private insurer paid services | Excluded                                                 |
| Chronic-care adherence support    | Separate non-promotional programme, not ordinary loyalty |

## 13.3 Loyalty rule

```text
RULE: Award loyalty points
IF customer.loyalty_consent = active
AND sale_line.item_id IN loyalty_eligible_items
AND sale_line.product.prescription_required = false
AND sale_line.product.controlled_flag = false
AND sale_line.payer_type NOT IN [SHA, private_insurer]
THEN award points
ELSE do not award points.
```

---

# 14. Campaign engine

## 14.1 Campaign lifecycle

```text
draft
audience_building
content_review
privacy_review
clinical_or_pharmacy_review
legal_review
approved
scheduled
running
paused
completed
cancelled
archived
```

## 14.2 Campaign audience filters

| Filter                                            |
| ------------------------------------------------- |
| Branch                                            |
| Customer type                                     |
| Consent type                                      |
| Channel                                           |
| Language                                          |
| Age band                                          |
| Last visit date                                   |
| Last purchase category                            |
| Chronic-care programme                            |
| Refill due                                        |
| Appointment due                                   |
| Exclude minors                                    |
| Exclude sensitive diagnoses                       |
| Exclude opt-outs                                  |
| Exclude deceased/inactive patients                |
| Exclude insurer/SHA claims patients for marketing |

## 14.3 Campaign suppression rules

| Suppression                       | Rule     |
| --------------------------------- | -------- |
| No consent                        | Suppress |
| Opted out                         | Suppress |
| Wrong number                      | Suppress |
| Deceased/inactive                 | Suppress |
| Minor without guardian consent    | Suppress |
| Sensitive diagnosis and marketing | Suppress |
| Frequency cap exceeded            | Suppress |
| Template not approved             | Suppress |
| Provider template not approved    | Suppress |
| Medicine promotion blocked        | Suppress |

## 14.4 Frequency caps

| Message type          | Default cap                                   |
| --------------------- | --------------------------------------------- |
| Appointment reminders | Per appointment schedule                      |
| Refill reminders      | Max 3 per refill cycle                        |
| Lab result-ready      | Per verified result                           |
| Payment prompts       | Max 3 per invoice unless manual approval      |
| Health education      | Max 1–2 per week                              |
| Marketing/loyalty     | Max 2 per month by default                    |
| Critical/safety       | No marketing cap; clinical safety rules apply |

---

# 15. Final safe template catalogue v1

## 15.1 Appointment reminder

```text
[Facility Name]: You have an appointment at [Branch] on [Date] at [Time]. Reply 1 to confirm, 2 to reschedule, STOP to opt out.
```

## 15.2 Sensitive appointment reminder

```text
[Facility Name]: Your appointment at [Branch] is scheduled for [Date] at [Time]. Call [Phone] for changes.
```

## 15.3 Refill reminder

```text
[Facility Name]: Your refill or pharmacy follow-up may be due. Contact [Branch] on [Phone] or visit us. Reply STOP to opt out.
```

## 15.4 Partial-dispense balance

```text
[Facility Name]: Please contact [Branch] about your pharmacy balance/follow-up. Call [Phone].
```

## 15.5 Lab result ready

```text
[Facility Name]: Your clinic update is ready. Use your secure link or contact [Branch] on [Phone].
```

## 15.6 Critical follow-up

```text
[Facility Name]: Please contact the clinic urgently about your recent visit. Call [Phone].
```

## 15.7 Payment prompt

```text
[Facility Name]: Payment request of KES [Amount] for Invoice [Invoice No]. Confirm on M-Pesa. For help call [Phone].
```

## 15.8 Receipt ready

```text
[Facility Name]: Your receipt for Invoice [Invoice No] is ready. Use this secure link: [Link].
```

## 15.9 Claim/pre-authorisation update

```text
[Facility Name]: Your cover approval/update is ready. Please contact [Branch] on [Phone] for details.
```

## 15.10 Health education

```text
[Facility Name]: Health tip: Take medicines only as prescribed and ask a qualified health professional if symptoms persist. Reply STOP to opt out.
```

## 15.11 Retail loyalty update

```text
[Facility Name]: You have [Points] retail loyalty points. They can be used only on eligible retail items. Reply STOP to opt out.
```

## 15.12 Medicine recall/safety

```text
[Facility Name]: Please contact [Branch] about a medicine supplied to you recently. Call [Phone].
```

---

# 16. Data model additions and refinements

## 16.1 `communication_preferences`

| Field                         | Required |
| ----------------------------- | -------: |
| `id`                          |      Yes |
| `patient_id`                  |      Yes |
| `preferred_language`          |      Yes |
| `preferred_channel`           | Optional |
| `quiet_hours_start`           | Optional |
| `quiet_hours_end`             | Optional |
| `allow_sms`                   |      Yes |
| `allow_whatsapp`              |      Yes |
| `allow_email`                 |      Yes |
| `allow_calls`                 |      Yes |
| `allow_appointment_reminders` |      Yes |
| `allow_refill_reminders`      |      Yes |
| `allow_lab_notifications`     |      Yes |
| `allow_payment_prompts`       |      Yes |
| `allow_health_education`      |      Yes |
| `allow_marketing`             |      Yes |
| `allow_loyalty`               |      Yes |
| `guardian_contact_required`   |      Yes |
| `updated_at`                  |      Yes |

## 16.2 `communication_suppression_list`

| Field                 |                                                   Required |
| --------------------- | ---------------------------------------------------------: |
| `id`                  |                                                        Yes |
| `patient_id`          |                                                   Optional |
| `phone_or_email_hash` |                                                        Yes |
| `channel`             |                                                        Yes |
| `suppression_type`    | Yes: opt_out, wrong_number, bounced, complaint, legal_hold |
| `message_purpose`     |                                                   Optional |
| `reason`              |                                                        Yes |
| `created_at`          |                                                        Yes |
| `created_by`          |                                                 Yes/system |

## 16.3 `campaigns`

| Field                    | Required |
| ------------------------ | -------: |
| `id`                     |      Yes |
| `campaign_code`          |      Yes |
| `campaign_name`          |      Yes |
| `campaign_type`          |      Yes |
| `message_purpose`        |      Yes |
| `template_id`            |      Yes |
| `audience_filter_json`   |      Yes |
| `suppression_rules_json` |      Yes |
| `scheduled_at`           | Optional |
| `frequency_cap_json`     |      Yes |
| `approval_status`        |      Yes |
| `status`                 |      Yes |
| `created_by`             |      Yes |

## 16.4 `campaign_recipients`

| Field                | Required |
| -------------------- | -------: |
| `id`                 |      Yes |
| `campaign_id`        |      Yes |
| `patient_id`         | Optional |
| `customer_id`        | Optional |
| `channel`            |      Yes |
| `recipient_masked`   |      Yes |
| `eligibility_status` |      Yes |
| `suppression_reason` | Optional |
| `message_queue_id`   | Optional |
| `sent_status`        | Optional |
| `created_at`         |      Yes |

---

# 17. API endpoints

## 17.1 Consent and preferences

| Endpoint                                             | Purpose                  |
| ---------------------------------------------------- | ------------------------ |
| `POST /patients/{id}/consents`                       | Capture consent          |
| `PATCH /patients/{id}/consents/{consentId}/withdraw` | Withdraw consent         |
| `GET /patients/{id}/communication-preferences`       | View preferences         |
| `PATCH /patients/{id}/communication-preferences`     | Update preferences       |
| `POST /communication/opt-out`                        | Process STOP/unsubscribe |
| `GET /communication/consent-audit`                   | Consent audit report     |

## 17.2 Templates

| Endpoint                                              | Purpose                   |
| ----------------------------------------------------- | ------------------------- |
| `POST /communication/templates`                       | Create template           |
| `POST /communication/templates/{id}/submit-review`    | Submit internal review    |
| `POST /communication/templates/{id}/approve-dpo`      | DPO approval              |
| `POST /communication/templates/{id}/approve-clinical` | Clinical approval         |
| `POST /communication/templates/{id}/approve-pharmacy` | Pharmacy approval         |
| `POST /communication/templates/{id}/approve-legal`    | Legal/compliance approval |
| `POST /communication/templates/{id}/submit-provider`  | Submit to WhatsApp/BSP    |
| `POST /communication/templates/{id}/activate`         | Activate template         |
| `POST /communication/templates/{id}/retire`           | Retire                    |

## 17.3 Sending and queue

| Endpoint                                        | Purpose                  |
| ----------------------------------------------- | ------------------------ |
| `POST /communication/send`                      | Send single message      |
| `POST /communication/schedule`                  | Schedule message         |
| `GET /communication/queue`                      | Queue view               |
| `POST /communication/provider-webhook/delivery` | Delivery status callback |
| `POST /communication/provider-webhook/inbound`  | Incoming reply callback  |
| `GET /communication/events`                     | Message event history    |

## 17.4 Secure links and OTP

| Endpoint                                | Purpose            |
| --------------------------------------- | ------------------ |
| `POST /secure-links`                    | Create secure link |
| `GET /secure-links/{token}`             | Open secure link   |
| `POST /secure-links/{token}/send-otp`   | Send OTP           |
| `POST /secure-links/{token}/verify-otp` | Verify OTP         |
| `POST /secure-links/{id}/revoke`        | Revoke link        |
| `GET /secure-links/{id}/access-log`     | View access log    |

## 17.5 Payment prompts

| Endpoint                                  | Purpose                       |
| ----------------------------------------- | ----------------------------- |
| `POST /payment-prompts`                   | Create payment prompt         |
| `POST /payment-prompts/{id}/send-stk`     | Send Daraja STK               |
| `POST /payment-prompts/{id}/query-status` | Query payment status          |
| `POST /payment-prompts/{id}/cancel`       | Cancel prompt                 |
| `POST /payment-prompts/daraja-callback`   | Receive callback              |
| `GET /payment-prompts/reconciliation`     | Prompt/payment reconciliation |

## 17.6 Campaigns and loyalty

| Endpoint                              | Purpose                  |
| ------------------------------------- | ------------------------ |
| `POST /campaigns`                     | Create campaign          |
| `POST /campaigns/{id}/build-audience` | Build audience           |
| `POST /campaigns/{id}/submit-review`  | Submit campaign approval |
| `POST /campaigns/{id}/approve`        | Approve campaign         |
| `POST /campaigns/{id}/launch`         | Launch                   |
| `POST /campaigns/{id}/pause`          | Pause                    |
| `POST /loyalty/enrol`                 | Enrol customer           |
| `POST /loyalty/earn`                  | Award points             |
| `POST /loyalty/redeem`                | Redeem points            |

---

# 18. Final workflows

## 18.1 Consent capture workflow

```text
1. Patient registers or updates profile
2. Staff opens communication preferences
3. Patient chooses message purpose and channel
4. System displays exact consent wording
5. Patient accepts/refuses
6. System stores consent version, source, user, time, channel
7. Patient can withdraw later
8. Audit event created
```

## 18.2 Appointment reminder workflow

```text
1. Appointment booked
2. Consent and channel preferences checked
3. Template selected
4. Sensitive-service neutral wording applied if needed
5. Reminder queued
6. Message sent
7. Delivery/reply captured
8. Appointment status updated
```

## 18.3 Refill reminder workflow

```text
1. Dispensing creates refill plan
2. Reminder date calculated
3. System checks refill consent and sensitivity
4. Template selected
5. Pharmacist review required for controlled/high-risk items
6. Reminder sent with neutral wording
7. Patient reply routes to pharmacy queue
```

## 18.4 Lab result secure-link workflow

```text
1. Lab result verified
2. Clinician review rule checked
3. Result sensitivity assessed
4. Secure link created
5. Neutral message sent
6. Patient opens link
7. OTP challenge completed
8. Result displayed/downloaded
9. Data access event logged
```

## 18.5 Payment prompt workflow

```text
1. Invoice created
2. Patient/customer phone confirmed
3. Amount equals invoice balance
4. Payment prompt created
5. STK sent through Daraja adapter
6. Callback updates payment status
7. Module 2 allocates payment to invoice
8. Receipt sent if consent/preference allows
```

## 18.6 Campaign workflow

```text
1. Admin creates campaign
2. Template selected
3. Audience built
4. Suppression rules apply
5. DPO/clinical/pharmacy/legal approval obtained as required
6. Provider approval checked for WhatsApp
7. Campaign scheduled/launched
8. Delivery and opt-outs tracked
9. Campaign report generated
```

---

# 19. Final validation rules

## 19.1 Consent gate

```text
RULE: Outbound message allowed
IF active consent exists for patient + channel + message_purpose
AND patient not suppressed
AND template active
AND template approval complete
AND message does not violate sensitivity rules
THEN queue message
ELSE suppress and log reason.
```

## 19.2 Sensitive content gate

```text
RULE: Sensitive SMS/WhatsApp
IF message.risk_class IN [clinical_sensitive, pharmacy_sensitive]
THEN message_body must not include:
  diagnosis
  actual lab value/result
  sensitive medicine name
  HIV/TB/STI/pregnancy/mental health labels
AND secure link or call instruction must be used.
```

## 19.3 WhatsApp provider gate

```text
RULE: WhatsApp template send
IF channel = whatsapp
AND outbound business-initiated message
THEN provider_template_status must be approved
AND patient WhatsApp consent must be active.
```

## 19.4 Payment prompt gate

```text
RULE: Send payment prompt
IF invoice.status IN [unpaid, partially_paid]
AND prompt.amount = invoice.balance_due
AND branch.payment_account.active = true
AND phone_verified = true
THEN allow STK/payment prompt
ELSE block.
```

## 19.5 Marketing gate

```text
RULE: Marketing send
IF message.contains_marketing = true
THEN marketing consent must be active
AND opt-out text must be present
AND template must be DPO/compliance approved
AND patient not opted out.
```

## 19.6 Medicine promotion gate

```text
RULE: Medicine-related promotion
IF content references prescription medicine
OR content references controlled medicine
OR campaign is classified as health_product_promotion
THEN block by default
AND require pharmacist + legal/compliance review
AND PPB approval reference if required by policy.
```

## 19.7 Secure-link gate

```text
RULE: Open secure link
IF token valid
AND link not expired
AND max access count not exceeded
AND OTP verified when required
THEN allow access
ELSE deny and log.
```

---

# 20. Reports and dashboards

## 20.1 Required reports

| Report                                   | Purpose                                                  |
| ---------------------------------------- | -------------------------------------------------------- |
| Consent report                           | Who consented to what, by channel and purpose            |
| Opt-out report                           | STOP/withdrawals by channel and message type             |
| Suppression report                       | Messages blocked due to no consent, opt-out, sensitivity |
| Template approval report                 | Draft, pending, approved, rejected, expired              |
| Provider delivery report                 | Sent, delivered, failed, bounced                         |
| WhatsApp template status report          | Provider approval and rejection status                   |
| Refill reminder report                   | Due/sent/responded/converted                             |
| Appointment reminder report              | Sent/confirmed/rescheduled/no-show                       |
| Lab notification report                  | Result-ready notifications and secure-link access        |
| Payment prompt report                    | STK sent, paid, failed, timeout, reconciled              |
| Secure-link access report                | Opens, OTP failures, expiries, revoked links             |
| Campaign report                          | Audience, sent, delivered, failed, opt-outs              |
| Loyalty report                           | Points earned/redeemed/excluded lines                    |
| Sensitive communication exception report | Any blocked or reviewed sensitive communication          |
| Wrong-number report                      | Contact quality and suppression                          |

## 20.2 Dashboard cards

```text
Active SMS consents
Active WhatsApp consents
Marketing opt-ins
Marketing opt-outs
Messages sent today
Failed messages
Messages suppressed
STK prompts sent
STK prompts paid
Secure links opened
OTP failures
Templates pending approval
Campaigns pending review
```

---

# 21. Developer acceptance criteria

## 21.1 Consent

| Test                                | Expected result                                           |
| ----------------------------------- | --------------------------------------------------------- |
| Capture SMS appointment consent     | Consent stored with wording version                       |
| Capture WhatsApp refill consent     | WhatsApp channel only active for refill                   |
| Withdraw marketing consent          | Future marketing suppressed                               |
| SMS consent but no WhatsApp consent | WhatsApp message suppressed                               |
| Patient sends STOP                  | Opt-out recorded and future relevant messages suppressed  |
| Minor patient                       | Guardian consent/contact required                         |
| Consent wording updated             | New version used; old consent remains historically linked |

## 21.2 Templates

| Test                                 | Expected result                      |
| ------------------------------------ | ------------------------------------ |
| Create appointment template          | Draft created                        |
| Activate without approval            | Blocked                              |
| Health education template            | Clinical/DPO approval required       |
| Refill template                      | Pharmacist/DPO approval required     |
| WhatsApp template                    | Provider template ID/status required |
| Template edited after approval       | New version created                  |
| Marketing template missing STOP      | Blocked                              |
| Sensitive template with result value | Blocked                              |

## 21.3 Secure links and OTP

| Test                | Expected result                  |
| ------------------- | -------------------------------- |
| Verified lab result | Secure link can be generated     |
| Unverified result   | Link blocked                     |
| Sensitive result    | OTP required                     |
| Expired link        | Access denied                    |
| Wrong OTP 3 times   | Link locked or challenge blocked |
| Result corrected    | Old link revoked                 |
| Secure link opened  | Data access event logged         |
| Minor patient link  | Guardian rule enforced           |

## 21.4 Payment prompt / Daraja

| Test                 | Expected result                       |
| -------------------- | ------------------------------------- |
| Invoice unpaid       | STK prompt can be created             |
| Amount mismatch      | Prompt blocked                        |
| Invoice already paid | Prompt blocked                        |
| STK success callback | Payment posted and invoice allocated  |
| STK failure          | Invoice remains unpaid                |
| STK timeout          | Query-required status                 |
| Duplicate callback   | No duplicate payment                  |
| Manual C2B payment   | Matched or queued for reconciliation  |
| Reversal             | Approval required and reversal logged |

## 21.5 Health education and loyalty

| Test                            | Expected result                            |
| ------------------------------- | ------------------------------------------ |
| General health tip              | Sends only to consented audience           |
| Prescription medicine promo     | Blocked                                    |
| Controlled medicine promo       | Blocked                                    |
| OTC promotion                   | Compliance review required based on policy |
| Loyalty on retail item          | Points awarded                             |
| Loyalty on POM medicine         | Points not awarded                         |
| Loyalty on SHA/insurer item     | Points excluded                            |
| Campaign with opted-out patient | Patient suppressed                         |

## 21.6 Audit and reporting

| Test                     | Expected result                                  |
| ------------------------ | ------------------------------------------------ |
| Message sent             | Communication event logged                       |
| Message failed           | Failure reason stored                            |
| Message suppressed       | Suppression reason stored                        |
| Patient replied          | Inbound message recorded and routed              |
| Secure link accessed     | Data access log created                          |
| Campaign launched        | Audience, suppression, delivery report generated |
| Export communication log | Reason and export audit required if sensitive    |

---

# 22. Implementation sequence

## Phase 1: Consent and preferences

Build:

```text
consent_types
consent_wording_versions
patient_consents
communication_preferences
communication_suppression_list
consent capture UI
opt-out processing
```

## Phase 2: Templates and provider adapters

Build:

```text
communication_providers
branch_channel_configurations
message_templates
template approval workflow
SMS adapter
WhatsApp adapter placeholder
provider webhook endpoints
```

## Phase 3: Queue and message events

Build:

```text
message_queue
communication_events
delivery status updates
inbound messages
human inbox
routing rules
```

## Phase 4: Secure links and OTP

Build:

```text
secure_access_links
otp_challenges
secure document access
result-ready notification
data access logging
```

## Phase 5: Payment prompts

Build:

```text
payment_prompts
STK request flow
Daraja callback handling
C2B matching interface
status query
reversal workflow
Module 2 payment allocation
```

## Phase 6: Campaigns, health education, loyalty

Build:

```text
campaigns
campaign_recipients
content approval records
suppression engine
loyalty accounts
loyalty transactions
campaign reports
```

## Phase 7: Compliance and analytics

Build:

```text
consent report
opt-out report
delivery report
secure-link access report
payment prompt report
campaign report
sensitive exception report
```

---

# 23. Final handoff summary

Module 9 is now developer-ready with these final decisions:

| Area                   | Final state                                                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Consent wording        | Versioned wording defined                                                                                                                                                     |
| Channel separation     | SMS, WhatsApp, email, call stored separately                                                                                                                                  |
| Provider selection     | Adapter model and selection criteria defined                                                                                                                                  |
| WhatsApp templates     | Approval lifecycle and provider-status model defined                                                                                                                          |
| Secure links           | Token + OTP + expiry + access audit defined                                                                                                                                   |
| Lab-result privacy     | Neutral notification templates and hard blocks defined                                                                                                                        |
| Daraja payment prompts | STK/C2B/status/reversal model defined                                                                                                                                         |
| Health education       | Non-promotional approval model defined                                                                                                                                        |
| Loyalty                | Retail-only default with pharmacy exclusions                                                                                                                                  |
| Campaigns              | Consent, suppression, approval, and frequency rules defined                                                                                                                   |
| Data model             | Tables and fields defined                                                                                                                                                     |
| APIs                   | Endpoints defined                                                                                                                                                             |
| Developer readiness    | High                                                                                                                                                                          |
| Production risk        | Final message wording, WhatsApp template submission, medicine-related content, loyalty rules, and health-product promotions need DPO/pharmacist/legal sign-off before go-live |

The closed Module 9 rule is:

```text
No patient message should leave the system unless it can prove:
the patient or guardian consented to that channel and purpose,
the template was approved,
the content is safe for the sensitivity level,
the message is linked to a real visit, invoice, prescription, refill, result, appointment, campaign, or safety event,
the provider accepted or rejected it,
the patient can opt out where applicable,
secure links and OTP protect sensitive documents,
payment prompts match invoices exactly,
and every send, failure, reply, opt-out, access, and export is auditable.
```

[1]: https://new.kenyalaw.org/akn/ke/act/2019/24/eng%402022-12-31?utm_source=chatgpt.com "Data Protection Act - Kenya Law"
[2]: https://web.pharmacyboardkenya.org/download/guideline-for-advertisement-and-promotion-of-health-products-and-technologies/?utm_source=chatgpt.com "Guideline for Advertisement and Promotion of Health Products and ..."
[3]: https://new.kenyalaw.org/akn/ke/act/ln/2021/263/eng%402022-12-31?utm_source=chatgpt.com "The Data Protection (General) Regulations - Kenya Law"
[4]: https://whatsappbusiness.com/blog/manage-message-templates-whatsapp-business-api/?utm_source=chatgpt.com "Managing Message Templates with the WhatsApp Business Platform"
[5]: https://www.facebookblueprint.com/student/path/253055-message-templates?utm_source=chatgpt.com "WhatsApp Business Platform Free Course: Message Templates"
[6]: https://developer.safaricom.co.ke/?utm_source=chatgpt.com "Daraja Developer Portal | Safaricom"
