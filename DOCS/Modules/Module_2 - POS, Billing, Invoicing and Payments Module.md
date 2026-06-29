# Module 2: POS, Billing, Invoicing and Payments Module

This module is the **commercial engine** of the system. It handles everything involving money:

```text
Sale → bill/invoice → payment → receipt → eTIMS → stock movement → accounting → shift close → reporting
```

For Kenya, this module must be designed around four realities:

1. **eTIMS compliance is mandatory for businesses issuing taxable business invoices.** KRA says all persons engaged in business are required to onboard eTIMS and issue electronic tax invoices. ([Kenya Revenue Authority][1])
2. **M-Pesa is a primary payment rail**, not an optional add-on. Safaricom’s Daraja platform exposes APIs for M-Pesa payment integration, including C2B, reversals, and transaction-status queries. ([developer.safaricom.co.ke][2])
3. **Pharmacy, clinic, lab, and retail sales are different transaction types** and should not all be treated as ordinary shop sales.
4. **Cash leakage and stock leakage are major risks**, so cashier shifts, approvals, audit logs, and stock-to-sale reconciliation are core features.

---

## 1. Purpose of the module

The POS and Billing Module should:

| Purpose                      | Practical meaning                                                   |
| ---------------------------- | ------------------------------------------------------------------- |
| Sell products and services   | Drugs, OTC items, retail goods, consultation, lab tests, procedures |
| Generate compliant invoices  | eTIMS-ready invoice data and credit notes                           |
| Receive payments             | M-Pesa, cash, card, bank, credit, insurer, split payments           |
| Control discounts            | Prevent unauthorized price cutting                                  |
| Control cash                 | Cashier shifts, float, expected cash, variances                     |
| Update stock                 | Medicine and retail stock reduce correctly                          |
| Support claims               | Patient/insurer portions separated                                  |
| Support multiple price lists | Retail, wholesale, insurer, corporate, branch-specific              |
| Support receipts             | Thermal receipt, A4 invoice, WhatsApp/SMS/email                     |
| Support audit                | Every sale, void, return, discount, payment, and edit is traceable  |

---

## 2. Core principle: separate sale, invoice, receipt, and payment

Many weak POS systems mix these together. A proper system should treat them separately.

| Object             | Meaning                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| **Cart / bill**    | Draft list of items/services before finalization                          |
| **Sale**           | Completed commercial transaction                                          |
| **Invoice**        | Tax/commercial document issued for the sale                               |
| **eTIMS invoice**  | KRA-recognized electronic tax invoice                                     |
| **Receipt**        | Evidence given to customer showing what was sold and how payment was made |
| **Payment**        | Cash, M-Pesa, card, insurer, credit, or mixed settlement                  |
| **Credit note**    | Reversal/correction linked to original invoice                            |
| **Refund**         | Money returned to customer                                                |
| **Stock movement** | Inventory deduction, return, adjustment, or transfer                      |

This matters because a customer can receive an invoice before full payment, an insurer can pay later, and a return may require a credit note rather than deleting the original sale.

---

## 3. Main users

| User           | Main actions                                                   |
| -------------- | -------------------------------------------------------------- |
| Cashier        | Sell items, receive payment, print receipt                     |
| Pharmacist     | Approve/dispense medicine sale, override pharmacy restrictions |
| Receptionist   | Bill consultation, register patient payments                   |
| Lab cashier    | Bill tests and packages                                        |
| Clinician      | Add billable services, procedures, prescription items          |
| Branch manager | Approve discounts, voids, refunds, shift variances             |
| Owner          | View sales, cash, profit, stock, branch performance            |
| Accountant     | Reconcile eTIMS, payments, credit notes, taxes                 |
| Claims officer | Split bill between patient and insurer/SHA                     |
| Auditor        | Review all transaction logs                                    |

---

## 4. Core transaction types

The system should support different transaction categories.

| Transaction type           | Example                           |      Stock affected? |      Patient record? |                        eTIMS? |
| -------------------------- | --------------------------------- | -------------------: | -------------------: | ----------------------------: |
| Retail goods sale          | Soap, glucose, cosmetics          |                  Yes |             Optional |         Yes, where applicable |
| OTC medicine sale          | Paracetamol, ORS                  |                  Yes | Optional/recommended |                           Yes |
| Prescription medicine sale | Antibiotic, chronic medicine      |                  Yes |      Yes/recommended |                           Yes |
| Consultation               | Doctor/clinical officer visit     |                   No |                  Yes | Yes, unless excluded/exempted |
| Lab test                   | Malaria test, CBC, urinalysis     | Consumables optional |                  Yes |                           Yes |
| Procedure                  | Dressing, injection, nebulization | Consumables optional |                  Yes |                           Yes |
| Package sale               | Consultation + lab + medicine     |                Mixed |                  Yes |                           Yes |
| Wholesale sale             | Bulk medicines/retail items       |                  Yes |             Optional |                           Yes |
| Insurance/SHA bill         | Insurer pays part/all             |                Mixed |                  Yes |                  Claim-linked |
| Credit customer sale       | Employer/corporate account        |                Mixed |         Optional/yes |                           Yes |
| Return                     | Customer returns item             |                  Yes |             Optional |                   Credit note |
| Void/cancel                | Mistaken sale before finalization |       No or reversed |             Optional |       Depends on eTIMS status |

---

## 5. Feature-by-feature design

## A. Fast checkout

The checkout screen should work quickly for both touchscreen and keyboard users.

### Required features

| Feature             | Requirement                                                    |
| ------------------- | -------------------------------------------------------------- |
| Product search      | Search by brand, generic, barcode, SKU, category               |
| Keyboard shortcuts  | New sale, quantity, discount, payment, hold bill, print        |
| Touch buttons       | Common items, categories, payment buttons                      |
| Customer lookup     | Phone, name, patient number, insurer membership                |
| Hold/resume bill    | Useful when customer pauses to get money                       |
| Quick quantity edit | `2x`, pack split, unit selection                               |
| Fast payment        | Cash, M-Pesa, card, split                                      |
| Repeat last sale    | Useful for common services/products                            |
| Offline checkout    | Continue selling when internet is down                         |
| Role-aware checkout | Cashier sees sale functions; pharmacist sees dispense controls |

### Recommended checkout layout

```text
LEFT: product/service search + cart
RIGHT: customer/patient + price list + payment
BOTTOM: total, tax, discount, eTIMS status, print/send buttons
TOP: cashier, branch, shift, online/offline status
```

### Keyboard shortcuts

| Shortcut | Action               |
| -------- | -------------------- |
| F1       | Search item          |
| F2       | Add customer/patient |
| F3       | Hold bill            |
| F4       | Resume bill          |
| F5       | Apply discount       |
| F6       | Cash payment         |
| F7       | M-Pesa payment       |
| F8       | Card payment         |
| F9       | Print receipt        |
| F10      | Complete sale        |
| Ctrl + R | Return/credit note   |
| Ctrl + V | Void draft bill      |
| Ctrl + L | Lock POS             |

---

## B. Barcode scanning

Barcode scanning must support both retail goods and medicine stock.

### Barcode types

| Barcode type         | Use                                                           |
| -------------------- | ------------------------------------------------------------- |
| Internal SKU barcode | Locally generated code for items without manufacturer barcode |
| Manufacturer barcode | Retail goods and packaged medicines                           |
| GS1 GTIN             | Standard product identification                               |
| QR/DataMatrix-ready  | Future medicine traceability and serialization                |
| Batch barcode        | Warehouse/pharmacy stock receiving                            |
| Patient barcode      | Clinic/patient file lookup                                    |
| Receipt barcode/QR   | Return lookup and invoice verification                        |

### Barcode behaviour

| Scenario                       | System behaviour                                 |
| ------------------------------ | ------------------------------------------------ |
| Product barcode found          | Add item to cart                                 |
| Multiple products share code   | Ask user to select                               |
| Product found but stock zero   | Warn or block depending on settings              |
| Product expired                | Block sale                                       |
| Product near expiry            | Warn before sale                                 |
| Prescription-only item scanned | Require prescription/pharmacist approval         |
| Batch-controlled item scanned  | Ask/select batch                                 |
| Serial-controlled item scanned | Capture serial number                            |
| Unknown barcode                | Allow “create product” only for authorized staff |

---

## C. Item and service sale

The POS must sell both physical products and services.

### Product/service classification

| Type                  | Examples                               | Special handling             |
| --------------------- | -------------------------------------- | ---------------------------- |
| Retail product        | Soap, lotion, tissue                   | Normal stock                 |
| OTC medicine          | ORS, painkillers                       | Stock + medicine category    |
| Prescription medicine | Antibiotics, antihypertensives         | Prescription workflow        |
| Controlled medicine   | Narcotic/psychotropic where applicable | Strict register and approval |
| Consultation          | General consultation, review           | Patient/clinician link       |
| Lab test              | Malaria, CBC, pregnancy test           | Lab order/result link        |
| Procedure             | Dressing, injection                    | Clinical note/procedure link |
| Package               | Consultation + test + medicine         | Bundle pricing               |
| Non-stock service     | Registration, certificate              | No inventory                 |
| Stock-linked service  | Injection using syringe/drug           | Consumes stock               |

### Required line-item fields

| Field                     | Notes                                           |
| ------------------------- | ----------------------------------------------- |
| Item/service code         | Internal code                                   |
| Description               | Receipt/eTIMS description                       |
| Category                  | Retail, medicine, lab, procedure, consultation  |
| Quantity                  | Units sold                                      |
| Unit of measure           | Tablet, bottle, pack, service, test             |
| Batch                     | For medicine/controlled stock                   |
| Expiry date               | For medicine/perishable stock                   |
| Unit price                | Before discount                                 |
| Discount                  | Amount/percentage                               |
| Tax code/rate             | VAT/exempt/non-VAT depending on product/service |
| Gross amount              | Line total                                      |
| Net amount                | After discount                                  |
| Patient link              | Required for clinical/pharmacy workflows        |
| Prescriber/clinician link | Where relevant                                  |
| Cost price                | For margin reporting                            |
| Price list used           | Retail, wholesale, insurer, etc.                |
| Approval status           | For restricted line items                       |

---

## D. eTIMS invoice

This is one of the most important Kenya-specific parts.

KRA’s eTIMS page states that eTIMS is a software solution for electronic invoicing and that all persons engaged in business are required to onboard and issue electronic tax invoices. ([Kenya Revenue Authority][1]) The Electronic Tax Invoice Regulations require each sale to be recorded in the system, an invoice generated for each sale, invoice details transmitted to the Commissioner, and stock-in/stock-out records maintained where applicable. ([Kenya Law][3])

### eTIMS invoice data requirements

The regulations specify that an electronic tax invoice should contain items such as the seller’s PIN, date and time, serial number, buyer PIN where the buyer intends to claim the expense or input tax, gross amount, tax amount where applicable, item code, goods/services description, quantity, unit of measure, tax rate, unique system identifier, unique invoice identifier, QR code, and any other information specified by the Commissioner. ([Kenya Law][3])

### Required eTIMS fields in the system

| Field                    | Source                                                                       |
| ------------------------ | ---------------------------------------------------------------------------- |
| Seller KRA PIN           | Organisation/branch tax setup                                                |
| Branch/outlet identifier | Branch setup                                                                 |
| Invoice date and time    | POS transaction                                                              |
| Invoice serial number    | System sequence                                                              |
| Buyer PIN                | Customer/patient/company profile, optional unless needed for claim/input tax |
| Buyer name               | Customer/patient/company profile                                             |
| Item code                | Product/service master                                                       |
| Description              | Product/service master                                                       |
| Quantity                 | Cart                                                                         |
| Unit of measure          | Product/service master                                                       |
| Unit price               | Price list                                                                   |
| Tax rate                 | Tax mapping                                                                  |
| Gross amount             | POS calculation                                                              |
| Tax amount               | POS calculation                                                              |
| Discount                 | POS calculation                                                              |
| Unique invoice ID        | eTIMS response/system                                                        |
| QR code                  | eTIMS response/system                                                        |
| Credit note reference    | Original invoice                                                             |
| Transmission status      | Pending, submitted, accepted, rejected                                       |
| Error message            | If rejected                                                                  |
| Retry count              | For offline/sync                                                             |

### eTIMS workflow

```text
1. Cashier builds bill
2. System validates item tax codes and customer details
3. User confirms sale
4. System generates internal sale number
5. System sends invoice data to eTIMS or queues it if offline
6. eTIMS returns/accepts invoice identifiers and QR details
7. Receipt is printed/sent with invoice details
8. Stock and financial records are finalized
9. Accountant can reconcile eTIMS status later
```

### eTIMS status model

| Status         | Meaning                                  |
| -------------- | ---------------------------------------- |
| Not required   | Internal transaction not requiring eTIMS |
| Draft          | Bill not finalized                       |
| Pending        | Invoice waiting to be sent               |
| Queued offline | Internet/eTIMS unavailable               |
| Submitted      | Sent to eTIMS                            |
| Accepted       | eTIMS accepted invoice                   |
| Rejected       | eTIMS rejected invoice                   |
| Retrying       | System retrying                          |
| Cancelled      | Voided before final tax invoice          |
| Credit-noted   | Corrected/reversed using credit note     |

### Offline eTIMS handling

The regulations require system continuity and state that where a user cannot use the system, the user should notify the Commissioner within twenty-four hours and record sales using other specified means; once use is restored, the sales recorded during the outage should be entered into the system. ([Kenya Law][3])

System behaviour should therefore be:

| Scenario              | System behaviour                                           |
| --------------------- | ---------------------------------------------------------- |
| Internet down         | Allow sale, mark eTIMS status as queued offline            |
| eTIMS service down    | Allow sale if configured, queue invoice                    |
| eTIMS rejection       | Show reason and block final “compliant” status until fixed |
| Offline queue too old | Escalate to accountant/admin                               |
| Reconnected           | Auto-sync pending invoices                                 |
| Sale synced later     | Preserve original sale time and sync time                  |
| Manual outage         | Generate outage report for compliance/admin use            |

### eTIMS audit requirements

The regulations require systems to be secure, tamper-proof, capable of integrating with KRA systems, transmitting data, recording and storing required information, maintaining data integrity, authenticating authorized users, logging all activities, and assigning a unique identifier to each invoice. ([Kenya Law][3])

So the POS must log:

| Event              | Logged data                    |
| ------------------ | ------------------------------ |
| Invoice created    | User, branch, time, device     |
| Invoice submitted  | Payload reference, time        |
| Invoice accepted   | eTIMS ID/QR/status             |
| Invoice rejected   | Error and correction           |
| Credit note issued | Original invoice reference     |
| Invoice reprint    | User and reason                |
| Tax code changed   | Old value, new value, approver |
| eTIMS retry        | Retry time and response        |

---

## E. Multiple payment methods

The system must support Kenya’s real payment reality: one bill can be paid partly by M-Pesa, partly by cash, partly by insurer, and partly on credit.

### Payment methods

| Method                  | Required fields                                                    |
| ----------------------- | ------------------------------------------------------------------ |
| Cash                    | Amount tendered, change, cashier, drawer                           |
| M-Pesa                  | Phone, Till/Paybill, receipt code, transaction ID, callback status |
| Card                    | Terminal ID, authorization code, masked card reference             |
| Bank transfer           | Bank, reference, date, amount                                      |
| Credit/customer account | Customer/company account, due date, credit limit                   |
| Insurer/SHA             | Payer, member number, authorization, patient co-pay                |
| Voucher/loyalty         | Voucher code, balance, approval                                    |
| Split payment           | Multiple payment lines against one bill                            |

### M-Pesa integration

Safaricom’s Daraja platform connects web/mobile applications to M-Pesa APIs. Safaricom’s business developer portal describes exposed APIs including C2B, reversals, and transaction status queries. ([developer.safaricom.co.ke][2])

Recommended M-Pesa flows:

| Flow                             | Use case                                      |
| -------------------------------- | --------------------------------------------- |
| STK Push / Lipa na M-Pesa Online | Cashier initiates prompt to customer phone    |
| C2B confirmation                 | Customer pays Till/Paybill manually           |
| Transaction status query         | Confirm payment not received through callback |
| Reversal                         | Refund or wrong payment handling              |
| Reconciliation                   | Match M-Pesa statement to POS payments        |

### M-Pesa payment states

| Status                     | Meaning                                           |
| -------------------------- | ------------------------------------------------- |
| Initiated                  | STK/C2B request started                           |
| Pending customer action    | Customer has not entered PIN                      |
| Paid                       | Callback/confirmation received                    |
| Failed                     | Customer cancelled, timeout, insufficient funds   |
| Manual verification needed | Customer claims paid but no callback              |
| Reversed                   | Payment reversed                                  |
| Partially allocated        | Payment received but not fully matched to invoice |
| Overpaid                   | Payment exceeds invoice                           |
| Underpaid                  | Payment less than invoice                         |

### Split payment example

```text
Bill total: KES 3,800

M-Pesa: KES 2,000
Cash: KES 500
Insurer: KES 1,000
Patient credit: KES 300

Balance: KES 0
```

The system should not finalize the bill as fully paid until allocated payments equal the payable amount, unless it is intentionally posted to credit.

---

## F. Credit notes

Credit notes are required for returns and invoice corrections after a tax invoice has already been issued. The Electronic Tax Invoice Regulations state that where a credit note or debit note is issued, it should reference the original invoice number to which the supply relates. ([Kenya Law][3])

### Credit note reasons

| Reason               | Example                                  |
| -------------------- | ---------------------------------------- |
| Customer return      | Wrong item bought                        |
| Damaged product      | Returned due to defect                   |
| Pricing error        | Wrong price charged                      |
| Quantity error       | Sold 10 instead of 1                     |
| Duplicate invoice    | Same sale billed twice                   |
| Insurance correction | Wrong payer/patient split                |
| Prescription change  | Clinician changed drug before dispensing |
| Service cancellation | Lab/procedure cancelled before delivery  |

### Credit note rules

| Rule                                    | System behaviour                                |
| --------------------------------------- | ----------------------------------------------- |
| Must reference original invoice         | Block standalone credit note                    |
| Cannot credit more than original amount | Block excess credit                             |
| Medicine return may be restricted       | Require pharmacist approval                     |
| Controlled medicine return              | Require strict audit and stock decision         |
| Expired/damaged return                  | Return to quarantine, not sellable stock        |
| Cash refund                             | Manager approval required                       |
| M-Pesa/card refund                      | Link to original payment and reversal/reference |
| Insurer claim affected                  | Flag claim for correction                       |
| eTIMS invoice already accepted          | Issue eTIMS credit note, do not delete invoice  |

### Return stock handling

| Returned item condition | Stock action                                      |
| ----------------------- | ------------------------------------------------- |
| Unopened, acceptable    | Return to sellable stock if policy allows         |
| Opened medicine         | Quarantine/dispose                                |
| Cold-chain item         | Quarantine unless temperature integrity confirmed |
| Expired item            | Quarantine/write-off                              |
| Controlled item         | Pharmacist/superintendent approval                |
| Service return          | No stock movement                                 |

---

## G. Cashier shift close

Shift close is essential for fraud and cash control.

### Shift lifecycle

```text
Open shift → sell/receive payments → cash drops/expenses → close shift → manager review → post to accounts
```

### Opening shift fields

| Field               | Notes              |
| ------------------- | ------------------ |
| Cashier             | User opening shift |
| Branch              | Outlet             |
| Terminal/device     | POS terminal       |
| Opening float       | Starting cash      |
| Open time           | Timestamp          |
| Supervisor approval | Optional           |
| Expected drawer     | Calculated         |

### Closing shift fields

| Field            | Notes                                        |
| ---------------- | -------------------------------------------- |
| Cash sales       | System calculated                            |
| Cash refunds     | System calculated                            |
| Cash expenses    | Petty cash if allowed                        |
| Cash drops       | Money removed from drawer                    |
| Expected cash    | Opening float + cash sales - refunds - drops |
| Counted cash     | Cashier-entered                              |
| Variance         | Counted minus expected                       |
| M-Pesa expected  | System total                                 |
| M-Pesa confirmed | Callback/statement total                     |
| Card expected    | System total                                 |
| Card settlement  | Terminal batch total                         |
| Credit sales     | Posted to accounts                           |
| Insurer sales    | Claim receivables                            |
| Closing notes    | Reason for variance                          |
| Manager approval | Required above variance limit                |

### Shift close rules

| Rule                                      | System behaviour                                     |
| ----------------------------------------- | ---------------------------------------------------- |
| Cashier cannot close with open held bills | Require bill resolution                              |
| Variance above threshold                  | Manager approval required                            |
| Missing M-Pesa confirmations              | Flag reconciliation issue                            |
| Refunds in shift                          | Require refund report                                |
| Voids in shift                            | Require void report                                  |
| Discounts in shift                        | Require discount report                              |
| Unsubmitted eTIMS invoices                | Warn before close                                    |
| Offline shift                             | Close locally, sync later, manager sees offline flag |

---

## H. Receipt printer

The POS should support 58mm and 80mm thermal printers because these are common in small Kenyan retail and pharmacy environments.

### Printer types

| Printer                     | Use                                               |
| --------------------------- | ------------------------------------------------- |
| 58mm thermal                | Small shops, low-cost setups                      |
| 80mm thermal                | Pharmacies and busy outlets                       |
| A4 printer                  | Insurance invoices, clinic bills, formal invoices |
| Label printer               | Pharmacy labels                                   |
| PDF receipt                 | WhatsApp/email download                           |
| Kitchen-style order printer | Optional for procedure/lab collection points      |

### Receipt content

| Receipt section | Content                                     |
| --------------- | ------------------------------------------- |
| Header          | Business name, branch, KRA PIN, contacts    |
| Licence info    | Optional PPB/KMPDC line for pharmacy/clinic |
| Invoice details | Invoice number, date, cashier               |
| Customer        | Name/phone/PIN if captured                  |
| Items           | Description, quantity, price, discount, tax |
| Payments        | Cash/M-Pesa/card/credit/insurer             |
| eTIMS details   | QR/unique invoice details where available   |
| Return policy   | Especially for medicines                    |
| Footer          | Thank you, support contact                  |

### Pharmacy receipt additions

| Field                    | Purpose                                                         |
| ------------------------ | --------------------------------------------------------------- |
| Patient name             | Dispensing accountability                                       |
| Prescription reference   | Links to prescription                                           |
| Pharmacist initials/name | Accountability                                                  |
| Batch/expiry optional    | Useful for recall, may be hidden by default on customer receipt |
| Medicine return warning  | Safety and legal control                                        |

---

## I. Discount controls

Discounts are a major leakage point. The system should control who can discount what.

### Discount types

| Type                        | Example                     |
| --------------------------- | --------------------------- |
| Line discount               | 5% off one item             |
| Bill discount               | KES 100 off full bill       |
| Promotion                   | Buy 2 get 1                 |
| Staff discount              | Employee benefit            |
| Corporate discount          | Employer scheme             |
| Insurance tariff adjustment | Contracted payer price      |
| Expiry discount             | Near-expiry stock clearance |
| Manager goodwill discount   | Complaint resolution        |
| Rounding discount           | Small rounding adjustment   |

### Discount rules

| Rule                                | System behaviour                          |
| ----------------------------------- | ----------------------------------------- |
| Cashier discount limit              | Example: max 2% or KES 50                 |
| Manager approval threshold          | Required above configured limit           |
| No discount below cost              | Block or require owner approval           |
| No discount on controlled medicines | Block unless allowed by policy            |
| No discount on insurer-tariff items | Use contracted tariff                     |
| Expiry discount                     | Require batch selection and expiry reason |
| Promotion discount                  | Auto-applied, not manually edited         |
| Discount reason required            | Mandatory for audit                       |
| Approval audit                      | Store approver, time, reason              |

### Sensitive discount categories

| Category               | Recommended control               |
| ---------------------- | --------------------------------- |
| Prescription medicines | Pharmacist/manager approval       |
| Controlled medicines   | Block or strict approval          |
| High-value items       | Manager approval                  |
| Insurance/SHA bills    | Contract tariff only              |
| Lab packages           | Manager/clinic admin approval     |
| Wholesale prices       | Customer account must be eligible |

---

## J. Multi-price lists

The same item can have different prices depending on branch, customer, payer, or channel.

### Price list types

| Price list         | Use                              |
| ------------------ | -------------------------------- |
| Retail cash        | Default walk-in customer         |
| Wholesale          | Bulk buyers                      |
| Branch-specific    | Different rent/competition/costs |
| Insurer tariff     | Private insurer contract price   |
| SHA tariff         | SHA contract/benefit pricing     |
| Corporate/employer | Staff/company accounts           |
| Online price       | E-commerce/online pharmacy       |
| Promotion price    | Campaigns                        |
| Staff price        | Internal staff purchases         |
| Chronic-care price | Repeat patient programmes        |

### Price selection hierarchy

Recommended order:

```text
1. Explicit payer contract tariff
2. Customer/corporate contract price
3. Branch-specific price
4. Active promotion price
5. Default retail price
6. Fallback base price
```

### Price-list fields

| Field             | Notes                                 |
| ----------------- | ------------------------------------- |
| Price list name   | Retail, wholesale, AAR, SHA, Branch A |
| Applies to        | Branch/customer/payer/channel         |
| Effective date    | Start                                 |
| Expiry date       | End                                   |
| Item/service code | Product/service                       |
| Unit price        | Selling price                         |
| Minimum quantity  | For wholesale tiers                   |
| Approval status   | Draft/approved                        |
| Approved by       | Manager/owner                         |
| Version           | Historical pricing                    |
| Margin check      | Warn below cost                       |

### Price rules

| Rule                 | System behaviour                                 |
| -------------------- | ------------------------------------------------ |
| Price expired        | Fall back to next valid price                    |
| Price below cost     | Warn/block                                       |
| Wrong payer selected | Do not apply insurer tariff                      |
| Branch override      | Use branch-specific price if active              |
| Price changed        | Log old price, new price, user, reason           |
| Backdated price      | Owner/admin only                                 |
| Wholesale price      | Requires eligible customer or quantity threshold |

---

## 6. Screens required

## Screen 1: Main POS checkout

Key panels:

| Panel            | Contents                                                     |
| ---------------- | ------------------------------------------------------------ |
| Header           | Branch, terminal, cashier, shift, online/eTIMS/M-Pesa status |
| Search           | Barcode/product/service search                               |
| Cart             | Line items, quantities, discounts, tax, batch                |
| Customer/patient | Walk-in, patient, company, insurer                           |
| Price list       | Active price list and override warning                       |
| Payment          | Cash, M-Pesa, card, credit, insurer                          |
| Actions          | Hold, void, discount, complete, print, send receipt          |

Must show:

```text
Subtotal
Discount
Tax
Total
Paid
Balance
eTIMS status
Stock warning
Approval warning
```

---

## Screen 2: Service billing screen

For clinics/labs.

Sections:

| Section         | Purpose                               |
| --------------- | ------------------------------------- |
| Patient details | Patient/account/insurer               |
| Visit/encounter | Links bill to clinical visit          |
| Services        | Consultation, procedure, lab, imaging |
| Prescriptions   | Pulls billable medicines              |
| Claim split     | Patient vs insurer                    |
| Payment         | Co-pay, cash, M-Pesa, insurer credit  |
| Invoice         | eTIMS/commercial invoice              |

---

## Screen 3: Payment screen

Must support split payments.

Example layout:

```text
Bill total:       KES 5,250
Amount paid:      KES 3,000
Balance:          KES 2,250

[Cash] [M-Pesa] [Card] [Insurer] [Credit] [Bank]
```

Payment line table:

| Method  | Amount | Reference    | Status        |
| ------- | -----: | ------------ | ------------- |
| M-Pesa  |  2,000 | QF45...      | Confirmed     |
| Cash    |    500 | Drawer 1     | Confirmed     |
| Insurer |  2,750 | Preauth #123 | Pending claim |

---

## Screen 4: Returns and credit notes

Required fields:

| Field                    | Notes                                |
| ------------------------ | ------------------------------------ |
| Original invoice number  | Mandatory                            |
| Item selection           | Cannot exceed original sale          |
| Reason                   | Mandatory                            |
| Return condition         | Sellable/quarantine/damaged/expired  |
| Refund method            | Cash/M-Pesa/card/credit account      |
| Approval                 | Manager/pharmacist depending on item |
| eTIMS credit note status | Pending/accepted/rejected            |

---

## Screen 5: Shift close

Sections:

| Section       | Shows                         |
| ------------- | ----------------------------- |
| Shift summary | Opening/closing time, cashier |
| Cash          | Expected vs counted           |
| M-Pesa        | Expected vs confirmed         |
| Card          | Expected vs terminal batch    |
| Credit        | Customer account sales        |
| Insurer       | Claims receivable             |
| Discounts     | Total and approvals           |
| Voids         | Count and value               |
| Refunds       | Count and value               |
| eTIMS         | Submitted, queued, rejected   |
| Variance      | Difference and explanation    |
| Approval      | Manager sign-off              |

---

## Screen 6: Sales history

Search by:

| Search key       |
| ---------------- |
| Receipt number   |
| Invoice number   |
| eTIMS identifier |
| M-Pesa code      |
| Customer phone   |
| Patient number   |
| Product          |
| Batch            |
| Cashier          |
| Date/time        |
| Branch           |
| Payment method   |

Actions:

| Action             | Control             |
| ------------------ | ------------------- |
| Reprint receipt    | Logged              |
| Send receipt       | Logged              |
| View invoice       | Role-based          |
| Create credit note | Permission required |
| Refund             | Permission required |
| View audit trail   | Manager/auditor     |
| Link payment       | Accountant/manager  |
| Export             | Permission required |

---

## 7. Workflows

## A. Retail cash sale

```text
1. Cashier scans/searches item
2. System checks stock and price
3. Cashier confirms quantity
4. Customer pays cash/M-Pesa/card
5. System finalizes sale
6. eTIMS invoice generated/submitted
7. Receipt printed/sent
8. Stock decremented
9. Sale appears in shift close
```

---

## B. Prescription medicine sale

```text
1. Cashier/pharmacist searches medicine
2. System detects prescription-only category
3. Patient and prescription are required
4. Pharmacist validates prescription
5. Batch/expiry selected
6. Price/tax calculated
7. Payment taken
8. eTIMS invoice generated/submitted
9. Receipt and medicine label printed
10. Stock decremented
11. Dispensing audit recorded
```

The sale should not behave like an ordinary retail item. It should be connected to the dispensing module.

---

## C. Clinic consultation billing

```text
1. Patient is registered
2. Reception selects consultation type
3. System applies price list
4. Patient pays or insurer/SHA is selected
5. Invoice generated
6. Patient joins queue
7. Consultation service is marked as paid or billable
```

Configuration option:

| Setting                 | Behaviour                                       |
| ----------------------- | ----------------------------------------------- |
| Pay before consultation | Common in outpatient clinics                    |
| Pay after consultation  | Useful where clinician adds services            |
| Mixed                   | Consultation paid first, lab/drugs after review |

---

## D. Lab test billing

```text
1. Clinician or reception orders test
2. Billing confirms price
3. Patient/insurer pays or bill is posted
4. Lab receives paid/pending order
5. Result is entered later
6. Bill and result remain linked
```

Important rule:

```text
A lab result should not be detached from the bill, patient, and visit.
```

---

## E. Insurer/SHA split bill

```text
1. Patient selected
2. Payer selected
3. Eligibility/preauth captured
4. Services/items priced by payer tariff
5. Patient co-pay calculated
6. Patient pays co-pay
7. Insurer portion posted to claims receivable
8. Claim record created
9. Invoice/receipt issued according to configured policy
```

### Bill split example

| Line         |     Total | Patient |   Insurer |
| ------------ | --------: | ------: | --------: |
| Consultation |     1,000 |     200 |       800 |
| Lab          |       700 |       0 |       700 |
| Medicine     |     1,500 |     300 |     1,200 |
| **Total**    | **3,200** | **500** | **2,700** |

---

## F. Credit customer sale

```text
1. Customer/company account selected
2. System checks credit limit
3. Sale is completed
4. eTIMS invoice generated
5. Amount posted to accounts receivable
6. Payment collected later
7. Receipt issued for payment allocation
```

Controls:

| Rule                          | Behaviour                             |
| ----------------------------- | ------------------------------------- |
| Customer exceeds credit limit | Block or manager approval             |
| Customer overdue              | Block new credit sale                 |
| Credit sale to walk-in        | Not allowed                           |
| Payment received later        | Allocate against outstanding invoices |

---

## G. Return and refund

```text
1. Search original invoice
2. Select item/service to return
3. System validates return eligibility
4. User enters reason
5. Manager/pharmacist approves if needed
6. Credit note issued referencing original invoice
7. Stock returned/quarantined where applicable
8. Refund or account credit processed
9. Shift and reports updated
```

---

## 8. Rules engine

The module should expose pricing, tax, payment, and compliance rules to other modules.

## Example rules

```text
RULE: Complete sale
IF cart has at least one line
AND all restricted items are approved
AND all stock-controlled lines have available stock
AND all required customer/patient fields are present
AND payment status is valid or sale is allowed on credit
THEN allow sale completion
ELSE show blocker list
```

```text
RULE: Prescription medicine sale
IF item.category = prescription_medicine
AND prescription_reference exists
AND pharmacist_approval = true
AND batch is selected
AND batch.expiry_date > today
THEN allow dispensing sale
ELSE block sale
```

```text
RULE: eTIMS invoice
IF transaction.requires_etims = true
AND seller_kra_pin exists
AND all line items have tax codes
AND invoice total is valid
THEN generate/send eTIMS invoice
ELSE block final compliant invoice
```

```text
RULE: Credit note
IF original_invoice.status = accepted
AND credit_amount <= original_invoice_remaining_amount
AND reason is provided
THEN issue credit note referencing original invoice
ELSE block credit note
```

```text
RULE: Discount
IF requested_discount <= user.discount_limit
THEN allow
ELSE require manager approval
```

```text
RULE: Shift close
IF counted_cash variance <= allowed_threshold
AND all critical payments reconciled
THEN allow cashier close
ELSE require manager approval
```

---

## 9. Tax and item-code configuration

The system should not hard-code tax treatment carelessly. It should allow tax configuration by product/service category, branch, and effective date.

## Tax configuration fields

| Field             | Notes                                  |
| ----------------- | -------------------------------------- |
| Tax code          | Internal/KRA mapping                   |
| Tax name          | VAT, exempt, zero-rated, non-VAT, etc. |
| Rate              | Percentage                             |
| Effective date    | Start date                             |
| End date          | End date                               |
| Applies to        | Product/service/category               |
| KRA item code     | Where applicable                       |
| Editable by       | Accountant/admin only                  |
| Approval required | Yes                                    |
| Audit log         | Mandatory                              |

## Product/service tax rules

| Item type          | Requirement                                |
| ------------------ | ------------------------------------------ |
| Retail item        | Tax code required                          |
| Medicine           | Tax code required                          |
| Consultation       | Tax code required                          |
| Lab test           | Tax code required                          |
| Procedure          | Tax code required                          |
| Insurance bill     | Tax rules still need clear mapping         |
| Exempt transaction | Must be explicitly configured, not assumed |

---

## 10. Stock integration

The POS must never sell stock without writing inventory movements.

## Stock movements triggered by POS

| Transaction                      | Stock movement                                |
| -------------------------------- | --------------------------------------------- |
| Sale                             | Stock out                                     |
| Return to sellable stock         | Stock in                                      |
| Return to quarantine             | Stock in quarantine                           |
| Credit note for service          | No stock                                      |
| Void before finalization         | No stock or reverse reservation               |
| Prescription dispense            | Stock out by batch                            |
| Package/service with consumables | Stock out for consumables                     |
| Stock unavailable                | Block or backorder depending on configuration |

## FEFO for medicine stock

For medicines, the POS should recommend **FEFO: first-expiry, first-out**.

```text
If two batches exist:
Batch A expires in July 2026
Batch B expires in December 2026

System recommends Batch A first.
```

The user may override only with reason and permission.

---

## 11. Customer, patient, and buyer PIN handling

The POS should support anonymous walk-in retail sales but also structured customer/patient billing.

## Customer types

| Type               | Use                                 |
| ------------------ | ----------------------------------- |
| Walk-in            | Quick OTC/retail sale               |
| Patient            | Clinic/pharmacy patient             |
| Corporate customer | Employer/company account            |
| Wholesale buyer    | Bulk pricing                        |
| Insurer/SHA member | Claims workflow                     |
| Staff member       | Staff purchases                     |
| Supplier           | Supplier return/contra transactions |

## Buyer PIN

The Electronic Tax Invoice Regulations include buyer PIN where the buyer intends to claim an expense or input tax. ([Kenya Law][3])

System behaviour:

| Scenario                              | Buyer PIN requirement                  |
| ------------------------------------- | -------------------------------------- |
| Walk-in patient buying medicine       | Optional unless required by policy     |
| Company buying supplies               | Required/recommended                   |
| Employer/corporate account            | Required                               |
| Insurer/corporate payer               | Required/recommended                   |
| Patient wants invoice for tax/expense | Capture buyer PIN                      |
| Buyer PIN missing                     | Warn if invoice is corporate/claimable |

---

## 12. Audit logs

Every financially sensitive action must be logged.

| Action                | Log details                     |
| --------------------- | ------------------------------- |
| Sale created          | User, branch, terminal, time    |
| Sale completed        | Amount, payment, invoice        |
| Price changed         | Old/new price, reason, approver |
| Discount applied      | Amount, reason, approver        |
| Item removed          | Item, user, reason              |
| Bill voided           | User, reason                    |
| Refund issued         | User, amount, method, approver  |
| Credit note issued    | Original invoice, reason        |
| eTIMS submission      | Status, response, error         |
| M-Pesa payment linked | Code, amount, user              |
| Shift opened/closed   | Cashier, float, variance        |
| Cash drawer opened    | User, reason                    |
| Receipt reprinted     | User, reason                    |
| Offline sale synced   | Original time, sync time        |

---

## 13. Reports

## Daily business reports

| Report                    | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| Daily sales summary       | Total revenue by branch/date                |
| Sales by cashier          | Staff performance/control                   |
| Sales by payment method   | Cash, M-Pesa, card, credit, insurer         |
| Sales by category         | Drugs, retail, consultation, lab, procedure |
| Gross margin report       | Revenue minus cost                          |
| Discount report           | Detect leakage                              |
| Void/cancellation report  | Fraud control                               |
| Refund/credit note report | Returns monitoring                          |
| Cashier shift report      | Expected vs counted cash                    |
| eTIMS status report       | Submitted, queued, rejected                 |
| M-Pesa reconciliation     | Expected vs confirmed payments              |
| Credit customer ageing    | Outstanding balances                        |
| Insurer receivables       | Claims pending/payment                      |
| Price override report     | Unauthorized price changes                  |
| Stock sold by batch       | Recall and traceability                     |
| Near-expiry sales         | Monitor expiry clearance                    |
| Branch comparison         | Chain/franchise performance                 |

## Owner dashboard

Recommended cards:

```text
Today’s sales
Today’s cash expected
M-Pesa confirmed
eTIMS pending/rejected
Gross margin
Top-selling products
Low-stock fast movers
Discounts today
Refunds today
Open shifts
Unreconciled payments
Claims receivable
```

---

## 14. Database design

## Main tables

### `pos_terminals`

| Field               |
| ------------------- |
| id                  |
| branch_id           |
| terminal_name       |
| device_identifier   |
| printer_config_json |
| cash_drawer_enabled |
| status              |
| last_seen_at        |

### `shifts`

| Field               |
| ------------------- |
| id                  |
| branch_id           |
| terminal_id         |
| cashier_user_id     |
| opened_at           |
| opening_float       |
| closed_at           |
| expected_cash       |
| counted_cash        |
| variance            |
| manager_approved_by |
| status              |
| notes               |

### `sales`

| Field             |
| ----------------- |
| id                |
| organisation_id   |
| branch_id         |
| terminal_id       |
| shift_id          |
| sale_number       |
| sale_type         |
| customer_id       |
| patient_id        |
| visit_id          |
| payer_contract_id |
| price_list_id     |
| subtotal          |
| discount_total    |
| tax_total         |
| gross_total       |
| amount_paid       |
| balance_due       |
| payment_status    |
| invoice_status    |
| etims_status      |
| status            |
| created_by        |
| completed_by      |
| completed_at      |
| created_at        |

### `sale_lines`

| Field           |
| --------------- |
| id              |
| sale_id         |
| line_number     |
| item_type       |
| product_id      |
| service_id      |
| description     |
| quantity        |
| unit_of_measure |
| unit_price      |
| discount_amount |
| tax_code_id     |
| tax_rate        |
| tax_amount      |
| line_total      |
| cost_amount     |
| batch_id        |
| expiry_date     |
| prescription_id |
| clinician_id    |
| approval_status |
| approved_by     |
| notes           |

### `payments`

| Field                   |
| ----------------------- |
| id                      |
| sale_id                 |
| branch_id               |
| shift_id                |
| payment_method          |
| amount                  |
| currency                |
| status                  |
| reference_number        |
| mpesa_receipt_code      |
| card_authorization_code |
| payer_contract_id       |
| customer_account_id     |
| received_by             |
| received_at             |
| reconciled_at           |
| reversal_status         |
| notes                   |

### `invoices`

| Field                   |
| ----------------------- |
| id                      |
| sale_id                 |
| invoice_number          |
| invoice_type            |
| buyer_name              |
| buyer_pin               |
| seller_pin              |
| issue_datetime          |
| subtotal                |
| tax_total               |
| gross_total             |
| status                  |
| etims_unique_identifier |
| etims_qr_code           |
| etims_response_json     |
| submitted_at            |
| accepted_at             |
| rejected_at             |
| rejection_reason        |

### `credit_notes`

| Field               |
| ------------------- |
| id                  |
| original_invoice_id |
| credit_note_number  |
| reason_code         |
| reason_text         |
| subtotal            |
| tax_total           |
| gross_total         |
| refund_method       |
| status              |
| approved_by         |
| etims_status        |
| created_by          |
| created_at          |

### `credit_note_lines`

| Field                 |
| --------------------- |
| id                    |
| credit_note_id        |
| original_sale_line_id |
| quantity              |
| amount                |
| tax_amount            |
| stock_action          |
| return_condition      |

### `price_lists`

| Field             |
| ----------------- |
| id                |
| name              |
| type              |
| branch_id         |
| customer_group_id |
| payer_contract_id |
| effective_from    |
| effective_to      |
| status            |
| approved_by       |

### `price_list_items`

| Field            |
| ---------------- |
| id               |
| price_list_id    |
| product_id       |
| service_id       |
| unit_price       |
| minimum_quantity |
| maximum_quantity |
| margin_rule      |
| effective_from   |
| effective_to     |

### `tax_codes`

| Field          |
| -------------- |
| id             |
| code           |
| name           |
| rate           |
| applies_to     |
| effective_from |
| effective_to   |
| kra_mapping    |
| status         |

### `mpesa_transactions`

| Field                 |
| --------------------- |
| id                    |
| branch_id             |
| sale_id               |
| checkout_request_id   |
| merchant_request_id   |
| phone_number          |
| amount                |
| mpesa_receipt_code    |
| transaction_date      |
| result_code           |
| result_description    |
| callback_payload_json |
| status                |
| reconciled_by         |
| reconciled_at         |

### `audit_logs`

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
| terminal_id    |
| created_at     |

---

## 15. API design

## POS endpoints

| Endpoint                               | Purpose                    |
| -------------------------------------- | -------------------------- |
| `POST /pos/sales`                      | Create draft sale          |
| `POST /pos/sales/{id}/lines`           | Add item/service           |
| `PATCH /pos/sales/{id}/lines/{lineId}` | Edit quantity/discount     |
| `POST /pos/sales/{id}/hold`            | Hold bill                  |
| `POST /pos/sales/{id}/resume`          | Resume bill                |
| `POST /pos/sales/{id}/complete`        | Finalize sale              |
| `POST /pos/sales/{id}/void`            | Void draft or allowed sale |
| `GET /pos/sales/search`                | Search sales history       |
| `POST /pos/sales/{id}/print`           | Print receipt              |
| `POST /pos/sales/{id}/send-receipt`    | SMS/email/WhatsApp receipt |

## Payment endpoints

| Endpoint                          | Purpose                  |
| --------------------------------- | ------------------------ |
| `POST /payments/cash`             | Record cash payment      |
| `POST /payments/mpesa/stk`        | Initiate M-Pesa prompt   |
| `POST /payments/mpesa/callback`   | Receive M-Pesa callback  |
| `GET /payments/mpesa/status/{id}` | Query payment status     |
| `POST /payments/card`             | Record card payment      |
| `POST /payments/credit`           | Post to customer account |
| `POST /payments/refund`           | Process refund           |
| `POST /payments/reconcile`        | Reconcile payment        |

## Invoice/eTIMS endpoints

| Endpoint                               | Purpose               |
| -------------------------------------- | --------------------- |
| `POST /invoices`                       | Create invoice        |
| `POST /invoices/{id}/submit-etims`     | Submit invoice        |
| `GET /invoices/{id}/etims-status`      | Check status          |
| `POST /credit-notes`                   | Create credit note    |
| `POST /credit-notes/{id}/submit-etims` | Submit credit note    |
| `GET /etims/queue`                     | View pending invoices |
| `POST /etims/retry`                    | Retry failed invoices |

## Shift endpoints

| Endpoint                      | Purpose                               |
| ----------------------------- | ------------------------------------- |
| `POST /shifts/open`           | Open cashier shift                    |
| `POST /shifts/{id}/cash-drop` | Record cash drop                      |
| `POST /shifts/{id}/expense`   | Record petty cash expense, if allowed |
| `POST /shifts/{id}/close`     | Close shift                           |
| `POST /shifts/{id}/approve`   | Manager approval                      |
| `GET /shifts/{id}/summary`    | Shift report                          |

---

## 16. Integration points

| Integration                   | Purpose                                                  |
| ----------------------------- | -------------------------------------------------------- |
| Organisation/licensing module | Confirms branch can sell medicines, consult, bill claims |
| Inventory module              | Stock availability, batch, expiry, cost                  |
| Pharmacy module               | Prescription validation and dispensing                   |
| Clinic EMR                    | Consultation, procedure, prescription billing            |
| Lab module                    | Test billing and payment status                          |
| Claims module                 | Insurer/SHA split, preauth, claim receivable             |
| eTIMS                         | Tax invoice and credit note submission                   |
| M-Pesa Daraja                 | STK, C2B, transaction status, reversal                   |
| Accounting                    | Revenue, VAT/tax, receivables, cash, bank                |
| Notifications                 | Send receipt/payment reminders                           |
| User management               | Cashier, manager, pharmacist, accountant permissions     |

---

## 17. Permissions

| Permission             |    Cashier |   Pharmacist |    Reception |      Manager |   Accountant |        Owner |
| ---------------------- | ---------: | -----------: | -----------: | -----------: | -----------: | -----------: |
| Create sale            |        Yes |          Yes |          Yes |          Yes |           No |          Yes |
| Sell OTC item          |        Yes |          Yes | Configurable |          Yes |           No |          Yes |
| Sell prescription item | No/limited |          Yes |           No | Configurable |           No | Configurable |
| Apply small discount   |        Yes |          Yes |          Yes |          Yes |           No |          Yes |
| Approve large discount |         No | Configurable |           No |          Yes |           No |          Yes |
| Void sale              | No/limited |   No/limited |   No/limited |          Yes |           No |          Yes |
| Issue refund           |         No |   No/limited |           No |          Yes | Configurable |          Yes |
| Issue credit note      |         No | Configurable |           No |          Yes |          Yes |          Yes |
| Open/close own shift   |        Yes |          Yes |          Yes |          Yes |           No |          Yes |
| Approve shift variance |         No |           No |           No |          Yes |          Yes |          Yes |
| Change tax code        |         No |           No |           No |           No |          Yes |          Yes |
| Change price list      |         No |           No |           No |      Limited |          Yes |          Yes |
| View all branch sales  |         No |      Limited |      Limited |          Yes |          Yes |          Yes |

---

## 18. Edge cases the system must handle

| Edge case                                | Correct handling                                               |
| ---------------------------------------- | -------------------------------------------------------------- |
| Customer pays M-Pesa but callback delays | Mark payment pending; allow status query/manual reconciliation |
| Customer overpays M-Pesa                 | Mark overpayment; allocate/refund/hold as customer credit      |
| Sale completed while offline             | Queue eTIMS and sync later                                     |
| eTIMS rejects invoice                    | Keep sale, flag invoice as rejected, require correction/retry  |
| Cashier sells wrong item                 | Use credit note/return, not database deletion                  |
| Medicine returned after leaving pharmacy | Quarantine or block resale depending on policy                 |
| Insurer rejects claim                    | Move balance to patient/receivable workflow                    |
| Price changed during sale                | Lock price once bill is created unless refreshed               |
| Batch sold out before finalization       | Ask user to select another batch                               |
| Shift closed with pending M-Pesa         | Show unreconciled payment report                               |
| Receipt printer fails                    | Save sale and allow reprint/send digital receipt               |
| Customer has no phone                    | Allow cash sale but no SMS receipt                             |
| Corporate buyer needs PIN                | Capture buyer PIN before invoice finalization                  |
| Power outage                             | Local recovery from last saved draft/transaction queue         |

---

## 19. MVP versus later versions

### MVP

Build these first:

| Feature                                   | Reason                        |
| ----------------------------------------- | ----------------------------- |
| Fast POS checkout                         | Daily operations              |
| Product/service sale                      | Retail, medicine, clinic, lab |
| Cash and M-Pesa recording                 | Kenya payment reality         |
| Basic M-Pesa confirmation/manual matching | Prevent fake payment claims   |
| eTIMS-ready invoice data                  | Compliance foundation         |
| Receipt printing                          | Customer proof                |
| Credit notes/returns                      | Corrections                   |
| Cashier shift close                       | Fraud control                 |
| Discounts with approval                   | Margin protection             |
| Retail and branch price lists             | Pricing flexibility           |
| Basic reports                             | Owner visibility              |
| Stock decrement                           | Inventory accuracy            |
| Audit logs                                | Accountability                |

## Version 2

Add:

| Feature                            | Reason                            |
| ---------------------------------- | --------------------------------- |
| Full Daraja STK/C2B integration    | Better payment automation         |
| eTIMS system-to-system integration | Reduce manual invoicing           |
| Advanced split payments            | Insurance/corporate workflows     |
| Customer credit accounts           | Corporate/employer billing        |
| Insurer/SHA tariff pricing         | Claims accuracy                   |
| Label printing                     | Pharmacy workflow                 |
| Barcode batch scanning             | Faster pharmacy/warehouse control |
| Refund/reversal automation         | Cleaner reconciliation            |
| Offline sync dashboard             | Compliance visibility             |
| Advanced cash drawer controls      | Better anti-fraud                 |

## Version 3

Add:

| Feature                         | Reason                               |
| ------------------------------- | ------------------------------------ |
| AI margin/discount alerts       | Detect suspicious discounts          |
| Dynamic price optimization      | Branch and competition pricing       |
| Loyalty wallet                  | Retail retention                     |
| Customer portal invoices        | Self-service                         |
| Automated bank reconciliation   | Accounting efficiency                |
| Multi-branch treasury dashboard | Chain management                     |
| Advanced fraud analytics        | Detect cashier/stock/payment leakage |
| Full accounting integration     | ERP readiness                        |

---

## 20. Acceptance criteria

The module is ready when it passes these tests:

| Test              | Expected result                                                            |
| ----------------- | -------------------------------------------------------------------------- |
| Fast retail sale  | Cashier scans item, takes payment, prints receipt, stock reduces           |
| OTC sale          | Item sells normally with stock and invoice update                          |
| Prescription sale | System requires prescription/pharmacist approval before completion         |
| Clinic billing    | Consultation bill links to patient visit                                   |
| Lab billing       | Lab test bill creates payable/paid lab order                               |
| M-Pesa payment    | Payment is recorded with reference and matched to sale                     |
| Split payment     | One bill can be paid by M-Pesa + cash + insurer                            |
| eTIMS invoice     | Sale generates required invoice data and stores eTIMS status               |
| Offline sale      | Sale completes locally and queues invoice/payment sync                     |
| Credit note       | Credit note references original invoice and updates return/refund          |
| Shift close       | Expected cash and counted cash are compared                                |
| Discount approval | Cashier cannot exceed discount limit without approval                      |
| Multi-price       | Correct price list applies by branch/customer/payer                        |
| Return medicine   | Return requires reason and correct stock action                            |
| Audit trail       | Sale edits, voids, refunds, discounts, and reprints are logged             |
| Owner dashboard   | Owner sees sales, cash, M-Pesa, eTIMS, discounts, refunds, and open shifts |

---

## 21. Final product behaviour

The POS and Billing Module should not be a generic supermarket till. It should behave like a **Kenya-ready health retail billing engine**:

| Situation                  | Correct behaviour                                              |
| -------------------------- | -------------------------------------------------------------- |
| Retail item sold           | Fast POS, stock out, receipt, eTIMS                            |
| Medicine sold              | Stock, batch, expiry, pharmacy controls                        |
| Prescription medicine sold | Prescription and pharmacist approval required                  |
| Clinic service billed      | Patient visit and clinician workflow linked                    |
| Lab test billed            | Lab order and payment status linked                            |
| Insurer involved           | Patient/insurer split and claim receivable created             |
| M-Pesa used                | Payment matched, reconciled, and auditable                     |
| Cash used                  | Shift close controls expected cash                             |
| Return happens             | Credit note, original invoice reference, stock/refund handling |
| Discount applied           | Approval and reason captured                                   |
| Internet fails             | Sales continue, eTIMS/payment sync queued                      |
| Owner reviews business     | Clear sales, margin, payment, stock, and compliance reports    |

The key design principle is:

**Every shilling, every invoice, every stock movement, and every cashier action must be traceable.**

[1]: https://www.kra.go.ke/online-services/etims " eTIMS - KRA "
[2]: https://developer.safaricom.co.ke/ "Daraja Developer Portal | Safaricom"
[3]: https://new.kenyalaw.org/akn/ke/act/ln/2024/64 "
      The Tax Procedures (Electronic Tax Invoice) Regulations
    - Kenya Law"

Correct. Barcode choice must be formalised because **one barcode format cannot serve every workflow well**.

I would close this as:

```text
ADR-025: Barcode, QR, DataMatrix, GS1, Sample Label and Internal Identifier Strategy
```

## 1. Architecture decision

Use a **multi-symbology barcode strategy**, not one universal barcode.

| Use case                                           | Recommended barcode                                                    |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| Retail products with existing manufacturer barcode | **EAN-13 / UPC / GS1 barcode as supplied**                             |
| Internal products without manufacturer barcode     | **Code 128**                                                           |
| Medicines with GTIN + batch + expiry + serial      | **GS1 DataMatrix preferred**                                           |
| Pharmacy dispensed medicine label                  | **Code 128 for internal dispense ID; optional QR for patient link**    |
| Lab sample labels                                  | **Code 128 for sample ID in MVP; GS1 DataMatrix or QR optional later** |
| Prescription number                                | **Code 128**                                                           |
| Patient card/wristband/card sticker                | **Code 128 or QR depending hardware**                                  |
| Invoice/receipt lookup                             | **QR code or Code 128**                                                |
| Delivery package                                   | **Code 128 or QR**                                                     |
| Branch/internal asset tags                         | **QR or Code 128**                                                     |
| Future pharmaceutical traceability                 | **GS1 DataMatrix**                                                     |

The principle:

```text
EAN-13 for retail manufacturer product identity.
Code 128 for internal operational IDs.
GS1 DataMatrix for healthcare product traceability where GTIN/batch/expiry/serial matter.
QR for patient-facing links and mobile scanning.
```

GS1 describes EAN-13 as the most commonly used GS1 symbol and typically found on items sold at retail point of sale. GS1 also describes GS1 DataMatrix as suitable for healthcare because it can encode data such as GTIN, batch/lot number, expiry date, and serial number in a small symbol. ([gs1ie.org](https://www.gs1ie.org/standards/data-carriers/barcodes/ean-13/)) ([gs1.org](https://www.gs1.org/docs/healthcare/MC07_GS1_Datamatrix.pdf))

---

## 2. Barcode strategy by entity

## 2.1 Product barcode

### A. Manufacturer barcode

| Product type      | Barcode                                           |
| ----------------- | ------------------------------------------------- |
| Retail goods      | EAN-13 / UPC if already printed                   |
| OTC medicine      | EAN-13 / UPC / GS1 if already printed             |
| Packaged medicine | Existing manufacturer GS1 barcode where available |
| Medical device    | Existing GS1 barcode / UDI where available        |

Rule:

```text
If the product already has a valid manufacturer barcode, store and scan it.
Do not re-label unnecessarily.
```

### B. Internal product barcode

For products without barcodes:

```text
Use Code 128 with internal SKU code.
```

Example:

```text
PRD-000000123
```

Code 128 is good for internal alphanumeric identifiers and is widely supported by normal barcode scanners and thermal printers.

### C. Medicine traceability barcode

For future-ready pharmaceutical traceability:

```text
Use GS1 DataMatrix where GTIN + batch + expiry + serial are available.
```

GS1 DataMatrix is specifically useful in healthcare because it can carry multiple attributes such as GTIN, batch/lot, expiry, and serial number. ([gs1.org](https://www.gs1.org/docs/healthcare/MC07_GS1_Datamatrix.pdf))

Example GS1 Application Identifier structure:

```text
(01)09506000134352
(17)260630
(10)BATCH123
(21)SERIAL789
```

Where:

| AI   | Meaning       |
| ---- | ------------- |
| `01` | GTIN          |
| `17` | Expiry date   |
| `10` | Batch/lot     |
| `21` | Serial number |

---

## 2.2 Stock batch barcode

For internal stock handling:

| Scenario                     | Barcode                  |
| ---------------------------- | ------------------------ |
| GRN batch label              | Code 128                 |
| Warehouse shelf label        | Code 128 or QR           |
| Batch with GTIN/batch/expiry | GS1 DataMatrix preferred |
| Stock count label            | Code 128                 |
| Transfer label               | Code 128 or QR           |

Internal batch barcode example:

```text
BAT-BR001-000045678
```

The barcode should resolve to:

```text
product_id
branch_id
batch_id
expiry_date
quantity_on_hand
storage_condition
quarantine_status
```

Do not encode all of that in Code 128. Encode the ID and look up the data in the system.

---

## 2.3 Pharmacy dispense label

Use:

```text
Code 128 for internal dispense line ID
Optional QR code for patient instructions / secure refill link
```

Example:

```text
DSP-2026-000012345-L01
```

This should resolve to:

```text
patient
prescription
dispense
medicine
batch
dosage instructions
pharmacist
date/time
branch
```

Do **not** put sensitive patient information directly inside the barcode. Store only an opaque identifier.

---

## 2.4 Prescription barcode

Use:

```text
Code 128
```

Example:

```text
RX-2026-000001234
```

Purpose:

| Use                           |
| ----------------------------- |
| Scan prescription at pharmacy |
| Retrieve EMR prescription     |
| Link prescription to dispense |
| Link prescription to claim    |
| Audit prescription processing |

For external uploaded prescriptions, assign an internal prescription ID and print/use that barcode.

---

## 2.5 Lab sample barcode

For MVP:

```text
Code 128 for sample ID
```

Example:

```text
SMP-BR003-20260522-000012
```

Why Code 128 first:

| Reason                                                 |
| ------------------------------------------------------ |
| Works on cheap scanners                                |
| Easy to print on thermal label printers                |
| Good for short alphanumeric IDs                        |
| Reliable for small clinic labs                         |
| Simpler than implementing GS1 specimen standards early |

For Version 2/3:

```text
Add DataMatrix or QR option for small tubes, multi-field labels, or external lab interoperability.
```

The sample barcode should resolve to:

```text
sample_id
patient_id
lab_order_id
test_id
specimen_type
collection_time
status
```

Again, encode only the sample ID, not full patient details.

---

## 2.6 Lab result / report barcode

Use:

```text
QR code for report verification link
Code 128 for internal result/report ID
```

Example report ID:

```text
LABREP-2026-0000456
```

QR code should point to a secure verification endpoint, not raw result text.

```text
https://portal.example.com/verify/lab/LABREP-2026-0000456?token=...
```

Security rule:

```text
QR verification must not expose lab result content without authentication/OTP or access control.
```

---

## 2.7 Patient barcode

Use:

```text
Code 128 for internal patient number
Optional QR for patient portal link
```

Example:

```text
PT-000012345
```

For small clinics:

| Use                  | Barcode        |
| -------------------- | -------------- |
| Patient card         | Code 128       |
| Appointment check-in | QR or Code 128 |
| Clinic file sticker  | Code 128       |
| Patient portal       | QR             |

Do not encode ID number, phone number, diagnosis, or insurance details directly.

---

## 2.8 Invoice and receipt barcode

Use:

```text
QR code for patient/customer scan
Code 128 for cashier/internal lookup
```

Receipt QR can support:

| Use                 |
| ------------------- |
| Verify receipt      |
| Open payment link   |
| Download receipt    |
| View invoice status |
| Customer support    |

Receipt Code 128 can support:

| Use                |
| ------------------ |
| Refund lookup      |
| Credit note lookup |
| Shift audit        |
| Return processing  |

Example:

```text
INV-2026-BR001-0003456
```

---

## 2.9 Delivery barcode

Use:

```text
Code 128 for package/dispatch ID
QR code for rider/mobile workflow
```

Example:

```text
DEL-BR002-20260522-000088
```

Delivery barcode should resolve to:

```text
delivery_id
order_id
invoice_id
patient/customer
branch
dispatch status
proof of handover
```

Do not encode medicine names or sensitive medical details.

---

## 3. Recommended symbology matrix

| Entity                            | MVP barcode      | Version 2/3 option                 | Notes                                  |
| --------------------------------- | ---------------- | ---------------------------------- | -------------------------------------- |
| Manufacturer retail item          | EAN-13/UPC       | GS1 Digital Link later             | Use existing barcode                   |
| Internal SKU                      | Code 128         | QR optional                        | Use internal SKU                       |
| Medicine pack                     | Existing GS1/EAN | GS1 DataMatrix                     | Scan GTIN/batch/expiry where available |
| Stock batch                       | Code 128         | GS1 DataMatrix                     | Internal batch ID                      |
| Shelf/bin                         | Code 128/QR      | QR                                 | For stock count                        |
| Prescription                      | Code 128         | QR optional                        | Internal prescription ID               |
| Dispense label                    | Code 128         | QR for refill/instructions         | Internal dispense line ID              |
| Controlled medicine register item | Code 128         | GS1 DataMatrix if product supports | Strong audit                           |
| Lab sample                        | Code 128         | DataMatrix/QR                      | Sample ID                              |
| Lab result/report                 | QR + Code 128    | QR secure verification             | No raw sensitive data                  |
| Patient card                      | Code 128         | QR patient portal                  | Internal patient number                |
| Invoice/receipt                   | QR + Code 128    | QR secure receipt                  | eTIMS ID still stored separately       |
| Delivery package                  | Code 128/QR      | QR mobile flow                     | Internal delivery ID                   |
| Asset/device                      | QR               | Code 128 optional                  | Device registry                        |

---

## 4. Internal identifier design

Barcode symbology is separate from the identifier format.

## Use opaque internal IDs

Do **not** encode meaningful sensitive data in the barcode.

Good:

```text
PT-00012345
RX-2026-000456
SMP-BR002-000000789
DSP-2026-000234-L01
INV-BR001-2026-000098
```

Bad:

```text
MARY-WANJIKU-HIV-RESULT-POSITIVE
ID12345678-DIABETES
AMOXICILLIN-FOR-JOHN-PHONE0722...
```

## Recommended prefixes

| Prefix   | Entity              |
| -------- | ------------------- |
| `ORG`    | Organisation        |
| `BR`     | Branch              |
| `USR`    | User/staff          |
| `PT`     | Patient             |
| `PRD`    | Product             |
| `BAT`    | Stock batch         |
| `PO`     | Purchase order      |
| `GRN`    | Goods received note |
| `STK`    | Stock movement      |
| `RX`     | Prescription        |
| `DSP`    | Dispense            |
| `VIS`    | Visit               |
| `ORD`    | Clinical/lab order  |
| `SMP`    | Lab sample          |
| `LABR`   | Lab result          |
| `LABREP` | Lab report          |
| `CLM`    | Claim               |
| `INV`    | Invoice             |
| `PAY`    | Payment             |
| `DEL`    | Delivery            |
| `MSG`    | Communication event |

---

## 5. Label content standards

## 5.1 Product/internal stock label

| Field         | Include?       |
| ------------- | -------------- |
| Product name  | Yes            |
| Internal SKU  | Yes            |
| Barcode       | Yes            |
| Strength/form | For medicines  |
| Pack size     | Yes            |
| Price         | Optional       |
| Branch/bin    | Optional       |
| Batch         | If batch label |
| Expiry        | If batch label |

---

## 5.2 Pharmacy medicine label

| Field                | Include?                    |
| -------------------- | --------------------------- |
| Patient name         | Yes                         |
| Medicine name        | Yes                         |
| Strength/form        | Yes                         |
| Directions           | Yes                         |
| Quantity             | Yes                         |
| Date dispensed       | Yes                         |
| Branch/facility      | Yes                         |
| Pharmacist/dispenser | Optional/required by policy |
| Batch                | Recommended                 |
| Expiry               | Recommended                 |
| Dispense barcode     | Yes                         |
| QR patient link      | Optional                    |
| Sensitive diagnosis  | No                          |

---

## 5.3 Lab sample label

Minimum:

| Field                    | Include?                  |
| ------------------------ | ------------------------- |
| Sample barcode           | Yes                       |
| Sample ID human-readable | Yes                       |
| Patient name             | Yes, if label size allows |
| Patient number           | Yes                       |
| Age/sex                  | Recommended               |
| Test/order               | Recommended               |
| Specimen type            | Yes                       |
| Collection date/time     | Yes                       |
| Collector initials       | Optional                  |
| Branch                   | Yes                       |

For small tubes, use a compact label:

```text
SMP-BR003-000012
PT-000123 | MW | F/34
Blood | 22-May 09:42
[Code128]
```

---

## 5.4 Prescription label/sticker

| Field               | Include? |
| ------------------- | -------- |
| Prescription ID     | Yes      |
| Patient number/name | Yes      |
| Prescriber          | Yes      |
| Date                | Yes      |
| Barcode             | Yes      |
| Branch              | Yes      |

---

## 5.5 Receipt/invoice barcode

| Field                        | Include?                                                  |
| ---------------------------- | --------------------------------------------------------- |
| Invoice number               | Yes                                                       |
| eTIMS identifier             | Yes, where available                                      |
| QR verification/payment link | Yes                                                       |
| Code 128 invoice lookup      | Optional                                                  |
| Patient diagnosis            | No                                                        |
| Medicine details             | Only normal receipt line items, per business/legal policy |

---

## 6. Scanner and printer support

## Scanner requirements

Buy scanners that can read:

```text
EAN-13
UPC-A
Code 128
Code 39
QR Code
DataMatrix / GS1 DataMatrix
```

Even if MVP mostly uses EAN-13 and Code 128, the scanner should support 2D from the start to avoid replacing devices later.

## Printer requirements

| Printer                           | Use                          |
| --------------------------------- | ---------------------------- |
| 58mm/80mm thermal receipt printer | POS receipts                 |
| Direct thermal label printer      | Pharmacy and lab labels      |
| Barcode-capable label printer     | Code 128, QR, DataMatrix     |
| Network/USB/Bluetooth support     | Branch environment dependent |

## Label sizes to standardise

| Label                               | Suggested size               |
| ----------------------------------- | ---------------------------- |
| Pharmacy medicine bottle/pack label | 50mm × 30mm or 60mm × 40mm   |
| Lab sample label                    | 40mm × 20mm or tube-specific |
| Shelf/bin label                     | 50mm × 25mm                  |
| Delivery label                      | 80mm × 50mm                  |
| Patient card sticker                | 50mm × 25mm                  |

---

## 7. Data model additions

## `core.barcode_symbologies`

| Field          | Purpose                                             |
| -------------- | --------------------------------------------------- |
| id             | Internal ID                                         |
| symbology_code | EAN13, UPC, CODE128, DATAMATRIX, GS1_DATAMATRIX, QR |
| display_name   | Human-readable                                      |
| active_flag    | Enabled/disabled                                    |
| notes          | Usage notes                                         |

---

## `core.barcodes`

| Field           | Purpose                                                  |
| --------------- | -------------------------------------------------------- |
| id              | Internal ID                                              |
| entity_type     | product, batch, sample, prescription, invoice            |
| entity_id       | Linked record                                            |
| barcode_value   | Encoded value                                            |
| symbology       | EAN13, CODE128, QR, GS1_DATAMATRIX                       |
| barcode_purpose | retail_scan, internal_lookup, sample_label, verification |
| source          | manufacturer, internal, external_lab, supplier           |
| active_flag     | Active/inactive                                          |
| primary_flag    | Primary barcode for entity                               |
| created_at      | Timestamp                                                |
| created_by      | User                                                     |

---

## `inventory.product_barcodes`

| Field         | Purpose                                    |
| ------------- | ------------------------------------------ |
| id            | ID                                         |
| product_id    | Product                                    |
| barcode_value | Manufacturer/internal barcode              |
| symbology     | EAN13, UPC, CODE128, GS1_DATAMATRIX        |
| barcode_type  | manufacturer, internal, pack, carton, unit |
| pack_size     | Optional                                   |
| gtin          | If GS1                                     |
| active_flag   | Active                                     |
| verified_by   | User                                       |
| verified_at   | Time                                       |

---

## `inventory.batch_barcodes`

| Field           | Purpose                   |
| --------------- | ------------------------- |
| id              | ID                        |
| stock_batch_id  | Batch                     |
| barcode_value   | Internal batch barcode    |
| symbology       | CODE128 or GS1_DATAMATRIX |
| gtin            | Optional                  |
| batch_number    | Optional                  |
| expiry_date     | Optional                  |
| serial_number   | Optional                  |
| encoded_payload | For GS1 payload           |
| active_flag     | Active                    |

---

## `lab.sample_barcodes`

| Field             | Purpose   |
| ----------------- | --------- |
| id                | ID        |
| sample_id         | Sample    |
| barcode_value     | Sample ID |
| symbology         | CODE128   |
| label_print_count | Audit     |
| last_printed_at   | Audit     |
| last_printed_by   | Audit     |

---

## `core.label_templates`

| Field                    | Purpose                        |
| ------------------------ | ------------------------------ |
| id                       | ID                             |
| template_code            | PHARMACY_LABEL, SAMPLE_LABEL   |
| entity_type              | dispense, sample, batch, shelf |
| label_size               | 50x30, 40x20                   |
| printer_type             | thermal_label                  |
| template_definition_json | Layout                         |
| active_flag              | Active                         |
| version                  | Version                        |

---

## `core.label_print_events`

| Field        | Purpose                               |
| ------------ | ------------------------------------- |
| id           | ID                                    |
| template_id  | Template                              |
| entity_type  | Entity                                |
| entity_id    | Record                                |
| printer_id   | Printer                               |
| printed_by   | User                                  |
| printed_at   | Time                                  |
| print_reason | initial, reprint, damaged, correction |
| print_count  | Count                                 |
| branch_id    | Branch                                |

---

## 8. Barcode validation rules

## EAN-13

| Rule                 | Behaviour                                          |
| -------------------- | -------------------------------------------------- |
| Must be 13 digits    | Reject otherwise                                   |
| Check digit valid    | Validate                                           |
| Duplicate barcode    | Block duplicate active mapping unless pack variant |
| Manufacturer barcode | Mark source as manufacturer                        |
| Price-embedded codes | Treat separately if used                           |

## Code 128

| Rule                     | Behaviour                       |
| ------------------------ | ------------------------------- |
| Internal prefix required | `PT`, `RX`, `SMP`, etc.         |
| Unique by entity type    | No duplicate active barcode     |
| Human-readable printed   | Always print text below barcode |
| Opaque ID                | Do not encode sensitive data    |

## GS1 DataMatrix

| Rule                      | Behaviour                           |
| ------------------------- | ----------------------------------- |
| Parse GS1 AIs             | GTIN, batch, expiry, serial         |
| Validate GTIN check digit | Required                            |
| Expiry parse              | Required if encoded                 |
| Batch parse               | Required if encoded                 |
| Serial parse              | Optional                            |
| Store raw payload         | Required                            |
| Map to product/batch      | Required for receiving/traceability |

## QR

| Rule                            | Behaviour                             |
| ------------------------------- | ------------------------------------- |
| Use secure link or opaque token | Do not encode raw sensitive data      |
| Expiry for patient links        | Required                              |
| Access control                  | Required for result/summary links     |
| Audit scan/access               | Required where patient data displayed |

---

## 9. Workflow impact

## Product receiving

```text
Scan manufacturer barcode
    ↓
Find product
    ↓
If GS1 DataMatrix, parse GTIN/batch/expiry
    ↓
Create or select batch
    ↓
Receive stock
    ↓
Print internal batch label if needed
```

## POS

```text
Scan EAN-13/UPC/Code128
    ↓
Find product or service
    ↓
Add to cart
    ↓
For prescription-only item, route to pharmacy approval
```

## Pharmacy dispensing

```text
Scan prescription barcode
    ↓
Open prescription
    ↓
Scan medicine barcode
    ↓
Select/confirm batch
    ↓
Run medication safety check
    ↓
Print dispense label with Code128
    ↓
Dispense and audit
```

## Lab

```text
Lab order created
    ↓
Sample collected
    ↓
Print sample label with Code128
    ↓
Scan sample at result entry
    ↓
Enter/verify result
    ↓
Print report with QR verification
```

## Delivery

```text
Order packed
    ↓
Print delivery label
    ↓
Rider scans package
    ↓
Status changes to dispatched
    ↓
Patient handover proof captured
```

---

## 10. Versioned rollout

## MVP

```text
EAN-13/UPC scan for existing retail products
Code 128 for:
    internal products
    prescriptions
    dispense labels
    lab samples
    stock batches
    invoices
    deliveries
QR for:
    receipts/payment links
    lab report verification
```

## Version 2

```text
GS1 DataMatrix parsing for medicine packs where available
Barcode stock count
Barcode GRN
QR patient portal
QR delivery workflow
Printer/device management
```

## Version 3

```text
GS1 DataMatrix as preferred medicine traceability carrier
GTIN + batch + expiry + serial workflows
GS1 Digital Link support
EPCIS-ready traceability events
External lab/device barcode interoperability
```

GS1 notes that two-dimensional barcodes can encode data beyond GTIN, such as expiration dates, batch and serial numbers, and identifies GS1 DataMatrix among the promoted 2D codes for this purpose. ([gs1.se](https://gs1.se/en/identify/global-trade-item-number-gtin/gtin-in-barcodes/))

---

## 11. Acceptance criteria

| Test                                 | Expected result                                   |
| ------------------------------------ | ------------------------------------------------- |
| Scan EAN-13 retail product           | Product found and added to POS cart               |
| Scan unknown barcode                 | User gets product mapping/create workflow         |
| Print internal product barcode       | Code 128 label generated                          |
| Receive medicine with GS1 DataMatrix | GTIN, batch, expiry parsed where encoded          |
| Scan prescription barcode            | Prescription opens                                |
| Print pharmacy label                 | Code 128 dispense ID printed                      |
| Scan dispense label                  | Dispense record opens                             |
| Print sample label                   | Code 128 sample label generated                   |
| Scan sample                          | Lab sample/order opens                            |
| Reprint sample label                 | Reason captured and print audit logged            |
| Print receipt QR                     | Opens secure receipt/payment/verification flow    |
| QR lab report link                   | Does not expose result without access control     |
| Duplicate barcode assigned           | Blocked or requires approved pack-variant mapping |
| Expired batch scanned                | Sale/dispense blocked                             |
| Recalled batch scanned               | Sale/dispense blocked                             |
| Delivery barcode scanned             | Delivery status updates                           |

---

## 12. Final recommendation

For your platform:

```text
Use EAN-13/UPC for retail manufacturer products.
Use Code 128 for internal operational identifiers.
Use GS1 DataMatrix for pharmaceutical traceability where GTIN/batch/expiry/serial are available.
Use QR codes for patient-facing secure links, receipts, payment links, report verification, and mobile delivery workflows.
```

The key architecture rule is:

**Barcodes should encode stable opaque identifiers or recognised GS1 payloads, never sensitive clinical or patient data directly. The system should resolve the barcode to controlled records, enforce permissions, and audit every print, scan, reprint, and traceability event.**

# Module 2 Gap Closure: POS, Billing, Invoicing and Payments — Developer Handoff Addendum

## Updated handoff status

| Area                      |                                          Previous status |                                                                                      After this closure |
| ------------------------- | -------------------------------------------------------: | ------------------------------------------------------------------------------------------------------: |
| Completeness              |                                                     High |                                                                                           **Very high** |
| Developer readiness       |                                              Medium-high |                 **High for POS domain; medium-high for live integrations until credentials are issued** |
| Accuracy confidence       | Good business logic; eTIMS technical confirmation needed |                                       **Good, with clear adapter contracts and integration guardrails** |
| Developer start readiness |      Developers could model POS but wait on integrations | **Developers can now model POS, billing, payments, accounting, tax, devices, and integration adapters** |

The updated design principle is:

```text
The POS must finalize commercial transactions internally, but external fiscal/payment integrations must be adapter-driven, idempotent, retry-safe, and never allowed to corrupt the sale, invoice, payment, or stock ledger.
```

Developers can start building Module 2 now. They should **not** connect to live eTIMS or live M-Pesa until KRA/Safaricom onboarding, sandbox credentials, callback URLs, test cases, and certification requirements are confirmed.

---

## 1. Final developer decisions

| Gap                        | Final decision                                                                                                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| eTIMS integration contract | Build an internal `TaxInvoiceAdapter` with modes: `manual_etims`, `oscu_api`, `vscu_api`, `certified_middleware`. Do not hard-code one KRA pathway.                                                                             |
| OSCU vs VSCU               | Default to **OSCU API** for cloud/online businesses; support **VSCU** for high-volume or not-always-online deployments after KRA onboarding confirms taxpayer type.                                                             |
| Daraja flow                | Use **STK Push** for cashier-initiated invoice payments, **C2B confirmation/validation** for manual Till/Paybill payments, **Transaction Status Query** for disputed/pending payments, and **Reversal** for controlled refunds. |
| Accounting rules           | Use double-entry posting events for sales, tax, payments, receivables, credit notes, refunds, inventory, COGS, discounts, and write-offs.                                                                                       |
| Printer/hardware           | Use device abstraction: ESC/POS receipt printing, barcode scanner HID mode, cash drawer via printer kick, label printer support, optional local print bridge.                                                                   |
| Tax-code catalogue         | Seed Kenya tax types: standard 16%, zero-rated 0%, exempt, non-VAT, legacy 8% disabled unless explicitly enabled. Keep KRA tax-type code configurable.                                                                          |
| Item-code catalogue        | Store internal item code, KRA/eTIMS item code, UNSPSC/item classification code, package unit, quantity unit, tax type, barcode, and item status.                                                                                |
| Developer implementation   | Build internal ledgers first, then plug eTIMS and Daraja adapters.                                                                                                                                                              |

---

## 2. Regulatory and technical anchor summary

KRA states that eTIMS is the electronic Tax Invoice Management System and that all persons engaged in business are required to onboard eTIMS and issue electronic tax invoices. KRA’s system-to-system integration page says taxpayers with invoicing systems can integrate through an API, either through VSCU or OSCU; KRA describes VSCU as suitable for bulk invoicing and not-always-online taxpayers, while OSCU is suitable for taxpayers whose invoicing is always online. ([kra.go.ke](https://www.kra.go.ke/online-services/etims)) ([kra.go.ke](https://www.kra.go.ke/business/etims-electronic-tax-invoice-management-system/learn-about-etims/etims-system-to-system-integration))

Kenya’s Electronic Tax Invoice Regulations require each sale to be recorded in the system, an invoice to be generated for each sale, invoice details to be transmitted to the Commissioner, and stock-in/stock-out records to be maintained where applicable. The same regulations specify invoice contents such as seller PIN, date/time, serial number, buyer PIN where applicable, gross amount, tax amount, item code, description, quantity, unit of measure, tax rate, unique system identifier, unique invoice identifier, and QR code; credit and debit notes must reference the original invoice number. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/64/eng@2024-03-28))

Safaricom’s Daraja platform provides access to Safaricom and M-Pesa APIs for payment integration into web and mobile apps. M-Pesa’s developer information portal states that exposed API endpoints include Customer-to-Business, reversals, and transaction-status queries, with sandbox testing and go-live workflow. ([developer.safaricom.co.ke](https://developer.safaricom.co.ke/)) ([business.m-pesa.com](https://business.m-pesa.com/developers/))

---

## 3. Final normalized POS model

The domain model should separate commercial, fiscal, payment, stock, and accounting objects.

```text
cart / draft sale
    ↓
sale
    ↓
invoice
    ↓
eTIMS submission
    ↓
receipt
    ↓
payment allocation
    ↓
stock movement
    ↓
accounting journal
    ↓
shift close
```

## 3.1 Core entities

| Entity                    | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `sales`                   | Commercial transaction header                        |
| `sale_lines`              | Products/services sold                               |
| `invoices`                | Fiscal/commercial invoice header                     |
| `invoice_lines`           | Invoice line details                                 |
| `tax_invoice_submissions` | eTIMS adapter submission records                     |
| `payments`                | Payment records: cash, M-Pesa, card, insurer, credit |
| `payment_allocations`     | Which payment settled which invoice                  |
| `credit_notes`            | Invoice correction/return records                    |
| `refunds`                 | Money returned to customer                           |
| `shifts`                  | Cashier cash-control sessions                        |
| `cash_movements`          | Float, cash drop, petty cash, cash drawer movement   |
| `stock_movements`         | Stock-out/in triggered by POS                        |
| `accounting_journals`     | Double-entry postings                                |
| `device_sessions`         | POS terminal/printer/scanner sessions                |
| `audit_logs`              | All sensitive actions                                |

---

## 4. eTIMS integration contract

## 4.1 Final eTIMS integration strategy

The system should implement an internal adapter boundary.

```text
POS Invoice Engine
    ↓
TaxInvoiceAdapter
    ├── Manual eTIMS mode
    ├── OSCU API adapter
    ├── VSCU API adapter
    └── Certified middleware adapter
```

This lets the product go live in phases:

| Phase        | Mode                                              | Use                                                                |
| ------------ | ------------------------------------------------- | ------------------------------------------------------------------ |
| MVP internal | `manual_etims`                                    | Generate complete invoice data and allow manual eTIMS entry/export |
| Sandbox      | `oscu_api` or `vscu_api`                          | Test KRA integration using taxpayer/sandbox credentials            |
| Production   | `oscu_api`, `vscu_api`, or `certified_middleware` | Based on taxpayer onboarding and KRA approval                      |
| Fallback     | `manual_etims`                                    | Used during KRA/API outage or before certification                 |

KRA’s own materials show multiple eTIMS solution types, including VSCU, OSCU, eTIMS Client, and eTIMS Online; KRA describes VSCU as client-side and suitable for high-volume invoicing, while OSCU is hosted at KRA and suitable for online systems. ([kra.go.ke](https://www.kra.go.ke/images/publications/OSCU_VSCU_Step-by-Step_Guide-on-how-to-sign-up.pdf))

---

## 4.2 OSCU versus VSCU decision matrix

| Business type                                 | Recommended mode                           | Reason                                                 |
| --------------------------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| Single small clinic with few invoices         | Manual eTIMS or OSCU, depending onboarding | Simpler operational burden                             |
| Cloud POS pharmacy/clinic                     | OSCU                                       | Always-online cloud architecture                       |
| Chain with many invoices and offline branches | VSCU or certified middleware               | Better for high-volume/not-always-online patterns      |
| High-volume pharmacy chain                    | VSCU                                       | Local-side control unit may suit bulk/faster invoicing |
| Early MVP before KRA certification            | Manual eTIMS export mode                   | Avoid blocking product development                     |
| Customer already has eTIMS middleware         | Certified middleware adapter               | Integrate through chosen provider                      |

The product should not force every customer into one eTIMS route. The organisation/branch setup from Module 1 should store the selected eTIMS mode.

---

## 4.3 eTIMS configuration table

### `etims_configurations`

| Field                     |       Type |    Required | Notes                                                          |
| ------------------------- | ---------: | ----------: | -------------------------------------------------------------- |
| `id`                      |       UUID |         Yes |                                                                |
| `organisation_id`         |         FK |         Yes |                                                                |
| `branch_id`               |         FK |    Optional | Branch-specific if needed                                      |
| `mode`                    |       Enum |         Yes | `manual_etims`, `oscu_api`, `vscu_api`, `certified_middleware` |
| `kra_pin`                 |     String |         Yes | From Module 1                                                  |
| `branch_id_code`          |     String | Conditional | KRA/eTIMS branch ID where issued                               |
| `control_unit_id`         |     String | Conditional | CU/SCU identifier where applicable                             |
| `environment`             |       Enum |         Yes | `sandbox`, `production`                                        |
| `api_base_url`            |     String | Conditional | Stored securely                                                |
| `client_id`               | Secret ref | Conditional | Do not store raw secret in app table                           |
| `client_secret`           | Secret ref | Conditional | Use vault/secret manager                                       |
| `certificate_ref`         | Secret ref | Conditional | If required                                                    |
| `middleware_vendor`       |     String |    Optional |                                                                |
| `middleware_account_ref`  |     String |    Optional |                                                                |
| `status`                  |       Enum |         Yes | `draft`, `testing`, `active`, `suspended`, `retired`           |
| `last_successful_sync_at` |   DateTime |    Optional |                                                                |
| `last_error`              |       Text |    Optional |                                                                |
| `created_at`              |   DateTime |         Yes |                                                                |
| `updated_at`              |   DateTime |         Yes |                                                                |

---

## 4.4 Internal eTIMS adapter interface

Developers should implement this internal contract before wiring KRA live APIs.

```text
TaxInvoiceAdapter
    registerItem()
    syncItem()
    submitInvoice()
    submitCreditNote()
    submitDebitNote()
    submitStockMovement()
    queryInvoiceStatus()
    queryControlUnitStatus()
    retrySubmission()
```

## 4.5 `submitInvoice()` internal request

### `EtimsInvoiceRequest`

| Field               |    Required | Source                                                  |
| ------------------- | ----------: | ------------------------------------------------------- |
| `request_id`        |         Yes | UUID, idempotency key                                   |
| `organisation_id`   |         Yes | Module 1                                                |
| `branch_id`         |         Yes | Module 1                                                |
| `kra_pin`           |         Yes | Module 1                                                |
| `branch_etims_code` | Conditional | eTIMS config                                            |
| `sale_id`           |         Yes | POS                                                     |
| `invoice_number`    |         Yes | Invoice engine                                          |
| `invoice_datetime`  |         Yes | POS                                                     |
| `buyer_name`        |    Optional | Customer/patient/company                                |
| `buyer_pin`         | Conditional | Required where buyer intends to claim expense/input tax |
| `currency`          |         Yes | `KES` default                                           |
| `invoice_type`      |         Yes | `normal_sale`                                           |
| `payment_summary`   |         Yes | Cash/M-Pesa/card/credit/insurer                         |
| `subtotal`          |         Yes | Invoice engine                                          |
| `discount_total`    |         Yes | Invoice engine                                          |
| `tax_total`         |         Yes | Invoice engine                                          |
| `gross_total`       |         Yes | Invoice engine                                          |
| `lines`             |         Yes | Invoice lines                                           |
| `stock_movements`   | Conditional | Required for stock-tracked items                        |
| `metadata`          |    Optional | Branch/device/user                                      |

### `EtimsInvoiceLine`

| Field                      |    Required | Source                 |
| -------------------------- | ----------: | ---------------------- |
| `line_number`              |         Yes | POS                    |
| `internal_item_id`         |         Yes | Product/service master |
| `internal_item_code`       |         Yes | Product/service master |
| `etims_item_code`          | Conditional | eTIMS item registry    |
| `item_classification_code` | Conditional | UNSPSC/KRA item class  |
| `description`              |         Yes | Product/service        |
| `quantity`                 |         Yes | Sale line              |
| `unit_of_measure`          |         Yes | Product/service        |
| `unit_price`               |         Yes | Price list             |
| `discount_amount`          |         Yes | Sale line              |
| `tax_code`                 |         Yes | Tax catalogue          |
| `kra_tax_type_code`        | Conditional | eTIMS tax mapping      |
| `tax_rate`                 |         Yes | Tax code               |
| `taxable_amount`           |         Yes | Calculated             |
| `tax_amount`               |         Yes | Calculated             |
| `line_total`               |         Yes | Calculated             |
| `batch_number`             | Conditional | Medicines              |
| `expiry_date`              | Conditional | Medicines              |

KRA’s technical specification for trader invoicing systems includes receipt data such as date/time, PIN, optional buyer PIN, receipt number, receipt/transaction type, tax rates, total amounts with tax, and tax amounts. It also shows item synchronization fields such as item code, item classification code, item name, item type, origin country, packaging unit, quantity unit, initial unit price, stock quantity, sale price, tax type code, and item usage flag. ([kra.go.ke](https://www.kra.go.ke/images/publications/TIS-for-OSCU--VSCU-Technical-Specifications-v2.0.pdf))

---

## 4.6 eTIMS response contract

### `EtimsInvoiceResponse`

| Field                         |    Required | Notes                                                |
| ----------------------------- | ----------: | ---------------------------------------------------- |
| `request_id`                  |         Yes | Matches request                                      |
| `status`                      |         Yes | `accepted`, `rejected`, `pending`, `retryable_error` |
| `etims_invoice_id`            | Conditional | Unique invoice identifier                            |
| `control_unit_id`             | Conditional | CU/SCU ID                                            |
| `control_unit_invoice_number` | Conditional | CU invoice number                                    |
| `qr_code_payload`             | Conditional | QR data or URL                                       |
| `receipt_signature`           | Conditional | Signature/internal data                              |
| `internal_data`               | Conditional | Returned fiscal data                                 |
| `accepted_at`                 | Conditional |                                                      |
| `rejection_code`              | Conditional |                                                      |
| `rejection_message`           | Conditional |                                                      |
| `raw_response_json`           |         Yes | Store full response                                  |
| `retry_after_seconds`         |    Optional |                                                      |
| `adapter_name`                |         Yes | OSCU/VSCU/middleware/manual                          |

The KRA technical specification shows receipt output with SCU information, CU ID, CU invoice number, internal data, receipt signature, and QR code on receipts. ([kra.go.ke](https://www.kra.go.ke/images/publications/TIS-for-OSCU--VSCU-Technical-Specifications-v2.0.pdf))

---

## 4.7 eTIMS invoice status lifecycle

```text
not_required
draft
ready_for_etims
queued
submitted
accepted
rejected
retrying
manual_action_required
credit_noted
cancelled_before_submission
```

## 4.8 eTIMS submission table

### `tax_invoice_submissions`

| Field                         |     Type | Required |
| ----------------------------- | -------: | -------: |
| `id`                          |     UUID |      Yes |
| `invoice_id`                  |       FK |      Yes |
| `request_id`                  |     UUID |      Yes |
| `adapter_mode`                |     Enum |      Yes |
| `environment`                 |     Enum |      Yes |
| `submission_payload_json`     |     JSON |      Yes |
| `response_payload_json`       |     JSON | Optional |
| `status`                      |     Enum |      Yes |
| `external_invoice_id`         |   String | Optional |
| `control_unit_id`             |   String | Optional |
| `control_unit_invoice_number` |   String | Optional |
| `qr_code_payload`             |     Text | Optional |
| `receipt_signature`           |     Text | Optional |
| `internal_data`               |     Text | Optional |
| `error_code`                  |   String | Optional |
| `error_message`               |     Text | Optional |
| `retry_count`                 |  Integer |      Yes |
| `next_retry_at`               | DateTime | Optional |
| `submitted_at`                | DateTime | Optional |
| `accepted_at`                 | DateTime | Optional |
| `created_at`                  | DateTime |      Yes |

## 4.9 eTIMS idempotency rules

| Rule                              | Requirement                                        |
| --------------------------------- | -------------------------------------------------- |
| One invoice, one idempotency key  | `request_id` must be stable per invoice submission |
| Do not duplicate fiscal invoice   | Retrying must use same request/invoice reference   |
| Accepted invoice is immutable     | Corrections through credit/debit note              |
| Rejected invoice can be corrected | Only if not accepted by KRA/eTIMS                  |
| Submission payload stored         | Preserve exact payload sent                        |
| Raw response stored               | Preserve audit evidence                            |
| Manual correction logged          | Accountant/admin reason required                   |

---

## 4.10 Credit note contract

The regulations require credit and debit notes to reference the original invoice. KRA’s technical specification also treats credit notes as separate transaction types and shows credit-note receipts referencing the original CU invoice number. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/64/eng@2024-03-28)) ([kra.go.ke](https://www.kra.go.ke/images/publications/TIS-for-OSCU--VSCU-Technical-Specifications-v2.0.pdf))

### `EtimsCreditNoteRequest`

| Field                                  |    Required | Notes                                                        |
| -------------------------------------- | ----------: | ------------------------------------------------------------ |
| `request_id`                           |         Yes | Idempotency                                                  |
| `credit_note_id`                       |         Yes | Internal                                                     |
| `original_invoice_id`                  |         Yes | Internal invoice                                             |
| `original_etims_invoice_id`            |         Yes | From accepted invoice                                        |
| `original_control_unit_invoice_number` | Conditional | If returned                                                  |
| `credit_note_number`                   |         Yes | Internal                                                     |
| `credit_note_datetime`                 |         Yes |                                                              |
| `reason_code`                          |         Yes | Return, pricing error, correction                            |
| `reason_text`                          |         Yes | Human-readable                                               |
| `buyer_pin`                            | Conditional | If original had buyer PIN or buyer needs claim               |
| `lines`                                |         Yes | Negative or credit quantities/amounts as required by adapter |
| `subtotal`                             |         Yes | Negative/credit amount                                       |
| `tax_total`                            |         Yes | Negative/credit tax                                          |
| `gross_total`                          |         Yes | Negative/credit total                                        |

## 4.11 Credit note rules

| Rule                                                 | System behaviour                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| Original invoice not accepted                        | Use internal void/correction, not eTIMS credit note              |
| Original invoice accepted                            | Issue credit note, never delete invoice                          |
| Credit amount exceeds original remaining             | Block                                                            |
| Credit line quantity exceeds original line remaining | Block                                                            |
| Medicine return                                      | Route to pharmacy return/quarantine rules                        |
| Cash refund                                          | Separate refund transaction after credit note approval           |
| M-Pesa reversal                                      | Separate reversal transaction linked to payment                  |
| Credit note reason missing                           | Block                                                            |
| Credit note after KRA/VAT time limits                | Warn/block according to accountant policy and current tax advice |
| Credit note rejected                                 | Keep pending correction; do not alter original sale              |

---

## 5. eTIMS item-code and tax-code catalogue

## 5.1 Item classification and registration

The system needs an item-code layer because eTIMS requires item codes and item-classification mapping. KRA’s eTIMS online portal guide shows item classification search using UNSPSC and item registration before sales receipt processing. ([kra.go.ke](https://www.kra.go.ke/images/publications/eTIMS-Onlineportal-User-guide-2024.pdf))

### `item_tax_profiles`

| Field                       |    Required | Notes                                                  |
| --------------------------- | ----------: | ------------------------------------------------------ |
| `id`                        |         Yes |                                                        |
| `product_id` / `service_id` |         Yes | One of them                                            |
| `internal_item_code`        |         Yes | Local SKU/service code                                 |
| `etims_item_code`           | Conditional | KRA/eTIMS item code                                    |
| `item_classification_code`  | Conditional | UNSPSC/eTIMS classification                            |
| `item_type_code`            | Conditional | KRA/eTIMS system code                                  |
| `item_name_for_invoice`     |         Yes | Printed/submitted                                      |
| `origin_country_code`       | Recommended | `KE` default where applicable                          |
| `package_unit_code`         | Conditional | KRA/eTIMS code                                         |
| `quantity_unit_code`        | Conditional | KRA/eTIMS code                                         |
| `tax_code_id`               |         Yes | Internal tax code                                      |
| `kra_tax_type_code`         | Conditional | eTIMS mapping                                          |
| `registered_in_etims`       |     Boolean | Yes                                                    |
| `etims_registration_status` |        Enum | `not_registered`, `registered`, `rejected`, `inactive` |
| `active`                    |     Boolean | Yes                                                    |

## 5.2 Seed tax-code catalogue

KRA’s VAT page currently lists 16% as the general VAT rate and 0% as the zero rate, notes that the former 8% “other rate” for some petroleum products was deleted by Finance Act 2023, and states that exempt supplies are not taxable supplies. KRA’s technical specification examples show tax components for exempt, 16%, zero-rated, non-VAT, and 8%, so the application should keep 8% as a disabled/legacy code unless a taxpayer’s current KRA configuration requires it. ([kra.go.ke](https://www.kra.go.ke/individual/filing-paying/types-of-taxes/value-added-tax)) ([kra.go.ke](https://www.kra.go.ke/images/publications/TIS-for-OSCU--VSCU-Technical-Specifications-v2.0.pdf))

| Internal code  | Label                     |     Rate | Default active? | Use                                                       |
| -------------- | ------------------------- | -------: | --------------: | --------------------------------------------------------- |
| `VAT_16`       | VAT 16%                   |      16% |             Yes | Standard taxable goods/services                           |
| `VAT_0`        | Zero-rated                |       0% |             Yes | Zero-rated supplies                                       |
| `VAT_EXEMPT`   | Exempt                    |       0% |             Yes | Exempt supplies                                           |
| `NON_VAT`      | Non-VAT / out of scope    |       0% |             Yes | Non-vatable/out-of-scope items                            |
| `VAT_8_LEGACY` | VAT 8% legacy             |       8% |              No | Only if current KRA/tax advisor configuration requires it |
| `VAT_CUSTOM`   | Custom/regulator-specific | Variable |              No | Super-admin only                                          |

## 5.3 Important tax-code implementation rule

Do **not** hard-code the KRA tax-type letters such as `A`, `B`, `C`, `D`, `E` into business logic. Store them as master data in `kra_tax_type_code`.

```text
Internal tax logic:
  VAT_16
  VAT_0
  VAT_EXEMPT
  NON_VAT

External eTIMS mapping:
  kra_tax_type_code = configured from KRA sandbox/system codes
```

This prevents a bad integration if KRA’s system-code mapping changes or differs between environments.

---

## 6. Daraja / M-Pesa integration contract

## 6.1 Final Daraja flow decision

| Flow                        | MVP decision                   | Purpose                                             |
| --------------------------- | ------------------------------ | --------------------------------------------------- |
| STK Push / M-Pesa Express   | **Yes, primary**               | Cashier-initiated payment request linked to invoice |
| C2B validation/confirmation | **Yes, primary**               | Manual Till/Paybill payments and reconciliation     |
| Transaction Status Query    | **Yes**                        | Resolve pending/disputed payments                   |
| Reversal                    | **Yes, controlled**            | Refunds/wrong payment correction                    |
| B2C                         | **No for MVP unless required** | Customer payouts/refunds; higher operational risk   |
| B2B                         | No MVP                         | Supplier/business transfers                         |
| Account balance             | Optional V2                    | Treasury/reconciliation                             |
| Dynamic QR                  | Optional V2                    | Faster customer checkout                            |

## 6.2 Recommended production pattern

```text
Cashier asks customer how they want to pay:

Option 1: STK Push
  System sends prompt
  Customer enters M-Pesa PIN
  Callback confirms success/failure
  Invoice marked paid

Option 2: Manual Till/Paybill
  Customer pays manually
  C2B confirmation arrives
  System matches AccountReference / phone / amount / time
  Invoice marked paid or payment held for manual allocation

Option 3: Customer says “I paid”
  System queries status or searches C2B callbacks
  If match found, allocate payment
  If not found, keep unpaid/pending
```

---

## 6.3 M-Pesa configuration table

### `mpesa_configurations`

| Field                 |       Type |    Required | Notes                                             |
| --------------------- | ---------: | ----------: | ------------------------------------------------- |
| `id`                  |       UUID |         Yes |                                                   |
| `organisation_id`     |         FK |         Yes |                                                   |
| `branch_id`           |         FK |    Optional | Branch-specific Till/Paybill                      |
| `environment`         |       Enum |         Yes | `sandbox`, `production`                           |
| `shortcode`           |     String |         Yes | Till/Paybill/shortcode                            |
| `shortcode_type`      |       Enum |         Yes | `paybill`, `buy_goods_till`, `store_number`       |
| `consumer_key_ref`    | Secret ref | Conditional | Stored securely                                   |
| `consumer_secret_ref` | Secret ref | Conditional | Stored securely                                   |
| `passkey_ref`         | Secret ref | Conditional | For STK where applicable                          |
| `callback_base_url`   |     String |         Yes | Public HTTPS                                      |
| `validation_url`      |     String | Conditional | For C2B                                           |
| `confirmation_url`    |     String | Conditional | For C2B                                           |
| `stk_callback_url`    |     String | Conditional |                                                   |
| `result_url`          |     String | Conditional | Status/reversal                                   |
| `timeout_url`         |     String | Conditional |                                                   |
| `status`              |       Enum |         Yes | `draft`, `sandbox_testing`, `active`, `suspended` |
| `created_at`          |   DateTime |         Yes |                                                   |
| `updated_at`          |   DateTime |         Yes |                                                   |

## 6.4 STK Push request contract

### `MpesaStkRequest`

| Field                     |    Required | Source                              |
| ------------------------- | ----------: | ----------------------------------- |
| `request_id`              |         Yes | UUID idempotency key                |
| `invoice_id`              |         Yes | Billing                             |
| `sale_id`                 |         Yes | POS                                 |
| `branch_id`               |         Yes | POS                                 |
| `shortcode`               |         Yes | M-Pesa config                       |
| `amount`                  |         Yes | Invoice balance                     |
| `customer_phone`          |         Yes | Patient/customer                    |
| `account_reference`       |         Yes | Invoice number or compact reference |
| `transaction_description` |         Yes | Neutral description                 |
| `callback_url`            |         Yes | Config                              |
| `initiated_by`            |         Yes | User                                |
| `expires_at`              | Recommended |                                     |

### STK states

```text
created
submitted
pending_customer
success
failed
cancelled_by_customer
timeout
query_required
manually_reconciled
reversed
```

## 6.5 C2B callback contract

### `mpesa_c2b_transactions`

| Field                  | Required | Notes                                                       |
| ---------------------- | -------: | ----------------------------------------------------------- |
| `id`                   |      Yes |                                                             |
| `mpesa_receipt_number` |      Yes | Unique idempotency key                                      |
| `transaction_type`     |      Yes | Paybill/Till                                                |
| `shortcode`            |      Yes |                                                             |
| `amount`               |      Yes |                                                             |
| `msisdn`               | Optional | Customer phone                                              |
| `account_reference`    | Optional | Invoice/reference if Paybill                                |
| `transaction_datetime` |      Yes |                                                             |
| `raw_callback_json`    |      Yes |                                                             |
| `match_status`         |      Yes | `unmatched`, `matched`, `overpaid`, `underpaid`, `suspense` |
| `matched_invoice_id`   | Optional |                                                             |
| `matched_by`           | Optional | Auto/user                                                   |
| `matched_at`           | Optional |                                                             |
| `created_at`           |      Yes |                                                             |

## 6.6 Payment matching rules

| Scenario                                      | Rule                                                             |
| --------------------------------------------- | ---------------------------------------------------------------- |
| STK success callback matches request          | Allocate to invoice automatically                                |
| C2B account reference exactly matches invoice | Allocate automatically if amount matches                         |
| C2B amount less than invoice                  | Mark partial payment                                             |
| C2B amount greater than invoice               | Allocate invoice amount, move excess to customer credit/suspense |
| C2B account reference missing                 | Hold in unmatched queue                                          |
| Same M-Pesa receipt received twice            | Ignore duplicate but log duplicate callback                      |
| STK request timeout                           | Query status before retrying                                     |
| Customer claims payment but no callback       | Use transaction status query or manual reconciliation            |
| Payment reversed                              | Reverse allocation and reopen invoice balance                    |

## 6.7 M-Pesa idempotency rules

| Rule                                     | Requirement                                        |
| ---------------------------------------- | -------------------------------------------------- |
| `mpesa_receipt_number` unique            | Prevent duplicate payment posting                  |
| `checkout_request_id` unique             | Prevent duplicate STK posting                      |
| Callback raw payload stored              | Preserve evidence                                  |
| Payment allocation separate from payment | One payment can be split, corrected, or reversed   |
| Reversal separate from credit note       | Fiscal correction and money movement are different |
| Never mark paid on prompt submission     | Only on confirmed success/callback/manual approval |

---

## 7. Accounting posting rules

Module 2 should generate accounting events. It does not need to be a full accounting system in MVP, but it must produce clean journals for export.

## 7.1 Chart of accounts seed

| Code   | Account                         | Type           |
| ------ | ------------------------------- | -------------- |
| `1000` | Cash on hand                    | Asset          |
| `1010` | M-Pesa clearing                 | Asset          |
| `1020` | Card clearing                   | Asset          |
| `1030` | Bank                            | Asset          |
| `1100` | Patient/customer receivables    | Asset          |
| `1110` | Insurer/SHA receivables         | Asset          |
| `1200` | Inventory                       | Asset          |
| `2000` | Output VAT payable              | Liability      |
| `2100` | Customer deposits/overpayments  | Liability      |
| `4000` | Sales revenue - retail          | Revenue        |
| `4010` | Sales revenue - medicines       | Revenue        |
| `4020` | Consultation revenue            | Revenue        |
| `4030` | Lab revenue                     | Revenue        |
| `4040` | Procedure revenue               | Revenue        |
| `4050` | Delivery/service fee revenue    | Revenue        |
| `4090` | Sales discounts                 | Contra-revenue |
| `4100` | Sales returns/allowances        | Contra-revenue |
| `5000` | Cost of goods sold              | Expense        |
| `5100` | Inventory write-off/expiry loss | Expense        |
| `5200` | Payment charges                 | Expense        |
| `5300` | Claim write-offs                | Expense        |

---

## 7.2 Sale posting: cash/M-Pesa fully paid

Example: medicine sale KES 1,160 inclusive of VAT 16%, cost KES 700.

| Entry                | Debit | Credit |
| -------------------- | ----: | -----: |
| Cash/M-Pesa clearing | 1,160 |        |
| Medicine revenue     |       |  1,000 |
| Output VAT payable   |       |    160 |
| Cost of goods sold   |   700 |        |
| Inventory            |       |    700 |

## 7.3 Sale posting: insurance/SHA split

Example: total KES 3,000; patient co-pay KES 500 paid by M-Pesa; payer portion KES 2,500.

| Entry                  | Debit |                             Credit |
| ---------------------- | ----: | ---------------------------------: |
| M-Pesa clearing        |   500 |                                    |
| Insurer/SHA receivable | 2,500 |                                    |
| Revenue accounts       |       | 3,000 less tax split as configured |
| Output VAT payable     |       |                   Where applicable |

## 7.4 Credit customer sale

| Entry               |                Debit |               Credit |
| ------------------- | -------------------: | -------------------: |
| Customer receivable | Gross invoice amount |                      |
| Revenue             |                      |            Net sales |
| Output VAT payable  |                      | VAT where applicable |

## 7.5 Credit note posting

Credit note reverses revenue and tax, but money refund is a separate posting.

| Entry                                                |             Debit |              Credit |
| ---------------------------------------------------- | ----------------: | ------------------: |
| Sales returns/allowances                             | Net credit amount |                     |
| Output VAT payable                                   |      VAT reversal |                     |
| Customer receivable / cash payable / customer credit |                   | Gross credit amount |

## 7.6 Cash refund posting

| Entry                                            |         Debit |        Credit |
| ------------------------------------------------ | ------------: | ------------: |
| Customer refund liability / receivable reduction | Refund amount |               |
| Cash on hand                                     |               | Refund amount |

## 7.7 M-Pesa reversal posting

| Entry                                            |           Debit |          Credit |
| ------------------------------------------------ | --------------: | --------------: |
| Customer refund liability / receivable reduction | Reversal amount |                 |
| M-Pesa clearing                                  |                 | Reversal amount |

## 7.8 Discount posting

Two acceptable methods should be supported.

| Method                | Posting                                                       |
| --------------------- | ------------------------------------------------------------- |
| Net revenue method    | Revenue recorded net of discount                              |
| Contra-revenue method | Gross revenue credited; discount debited to `Sales discounts` |

Recommended default: **contra-revenue method** for management visibility.

## 7.9 Shift cash movement postings

| Event                |                                       Debit |                        Credit |
| -------------------- | ------------------------------------------: | ----------------------------: |
| Opening float issued |                                 Cash drawer | Cash control/head office cash |
| Cash drop to safe    |                                   Safe cash |                   Cash drawer |
| Petty cash expense   |                                     Expense |                   Cash drawer |
| Cash shortage        | Cash shortage expense/receivable from staff |                   Cash drawer |
| Cash excess          |                                 Cash drawer |  Cash overage income/suspense |

## 7.10 Accounting event table

### `accounting_events`

| Field                  |    Required |
| ---------------------- | ----------: |
| `id`                   |         Yes |
| `event_type`           |         Yes |
| `source_module`        |         Yes |
| `source_record_id`     |         Yes |
| `branch_id`            |         Yes |
| `event_datetime`       |         Yes |
| `status`               |         Yes |
| `posted_by`            | Auto/system |
| `reversal_of_event_id` |    Optional |
| `created_at`           |         Yes |

### `accounting_journal_lines`

| Field                 |       Required |
| --------------------- | -------------: |
| `id`                  |            Yes |
| `accounting_event_id` |            Yes |
| `account_code`        |            Yes |
| `debit_amount`        | Yes, default 0 |
| `credit_amount`       | Yes, default 0 |
| `currency`            |            Yes |
| `memo`                |       Optional |
| `entity_type`         |       Optional |
| `entity_id`           |       Optional |

## 7.11 Accounting posting rules

| Rule                   | System behaviour                                                 |
| ---------------------- | ---------------------------------------------------------------- |
| Sale completed         | Create revenue/tax/payment/receivable journal                    |
| Stock item sold        | Create COGS/inventory journal                                    |
| Service sold           | No inventory journal unless service consumes stock               |
| Credit note issued     | Reverse revenue/tax/receivable using credit note                 |
| Refund issued          | Separate cash/M-Pesa/card refund event                           |
| Claim paid             | Reduce insurer receivable and increase bank/M-Pesa/bank clearing |
| Claim denied/write-off | Move receivable to write-off only after approval                 |
| Overpayment            | Post to customer deposits/overpayments                           |
| Journal posted         | Immutable; corrections use reversal journal                      |

---

## 8. Hardware and printer integration specs

## 8.1 Hardware abstraction

Build a `DeviceService` abstraction. The POS should not call printer/scanner APIs directly.

```text
POS UI
  ↓
DeviceService
  ├── ReceiptPrinterDriver
  ├── LabelPrinterDriver
  ├── BarcodeScannerInput
  ├── CashDrawerDriver
  ├── CardTerminalReference
  └── LocalPrintBridge / AndroidPrintBridge / BrowserPrint
```

## 8.2 Supported hardware v1

| Device                       |         MVP support | Notes                            |
| ---------------------------- | ------------------: | -------------------------------- |
| 58mm thermal receipt printer |                 Yes | Low-cost shops                   |
| 80mm thermal receipt printer |                 Yes | Recommended for pharmacy/clinic  |
| USB barcode scanner          |                 Yes | HID keyboard mode                |
| Bluetooth barcode scanner    |                 Yes | Treated as HID keyboard          |
| Network receipt printer      |                 Yes | Through local print bridge       |
| Cash drawer                  |                 Yes | Via receipt printer kick command |
| Label printer                |                 Yes | Pharmacy labels                  |
| A4 printer                   |                 Yes | Invoices, claims, lab results    |
| Card terminal                | Manual reference v1 | Integration later                |
| Customer display             |         Optional v2 |                                  |
| Weighing scale               |         Optional v2 |                                  |

## 8.3 Printer protocol

| Printer type        | Protocol                                      |
| ------------------- | --------------------------------------------- |
| Receipt printer     | ESC/POS                                       |
| Label printer       | ZPL, TSPL, ESC/POS label mode depending model |
| A4 printer          | Browser/system PDF print                      |
| Android POS printer | Android print bridge or native SDK            |
| Browser-only mode   | PDF/HTML receipt fallback                     |

## 8.4 Receipt printer requirements

| Requirement        | Detail                                            |
| ------------------ | ------------------------------------------------- |
| Paper width        | 58mm and 80mm                                     |
| Character encoding | UTF-8 where supported; fallback ASCII             |
| Logo               | Optional bitmap logo                              |
| QR code            | Required for eTIMS output where returned          |
| Barcode            | Optional sale/invoice barcode                     |
| Reprint watermark  | “COPY” on reprints                                |
| Offline print      | Allowed with invoice pending status clearly shown |
| Printer failure    | Sale remains completed; reprint allowed           |
| Cash drawer kick   | Configurable on cash payment only                 |
| Print audit        | Every print/reprint logged                        |

## 8.5 Label printer requirements

| Requirement    | Detail                                             |
| -------------- | -------------------------------------------------- |
| Common sizes   | 40×30mm, 50×25mm, 70×40mm                          |
| Content        | Patient, medicine, dose, frequency, duration, date |
| Barcode        | Optional prescription/dispense barcode             |
| Reprint reason | Required                                           |
| Language       | English/Kiswahili/custom                           |
| Batch/expiry   | Configurable visible/hidden                        |

## 8.6 Device registry

### `pos_devices`

| Field             | Required |
| ----------------- | -------: |
| `id`              |      Yes |
| `branch_id`       |      Yes |
| `terminal_id`     | Optional |
| `device_type`     |      Yes |
| `device_name`     |      Yes |
| `connection_type` |      Yes |
| `driver_type`     |      Yes |
| `vendor`          | Optional |
| `model`           | Optional |
| `serial_number`   | Optional |
| `paper_width`     | Optional |
| `default_flag`    |      Yes |
| `status`          |      Yes |
| `last_seen_at`    | Optional |
| `config_json`     |      Yes |

## 8.7 Hardware failure rules

| Failure                     | System behaviour                                                                 |
| --------------------------- | -------------------------------------------------------------------------------- |
| Receipt printer offline     | Complete sale, mark receipt not printed                                          |
| Label printer offline       | Pharmacy handover blocked or override required                                   |
| Cash drawer failure         | Log exception; manager review                                                    |
| Barcode scanner unavailable | Manual search allowed                                                            |
| eTIMS QR not returned yet   | Print interim receipt only if configured; final receipt reprint after acceptance |
| Browser print blocked       | Use PDF download fallback                                                        |
| Device changes              | Admin permission and audit required                                              |

---

## 9. Final POS workflow rules

## 9.1 Sale lifecycle

```text
draft
held
pending_pharmacy_approval
pending_clinician_order
pending_payment
completed
partially_refunded
fully_refunded
credit_noted
voided_before_invoice
cancelled
```

## 9.2 Invoice lifecycle

```text
draft
issued_internal
ready_for_etims
submitted_to_etims
accepted_by_etims
rejected_by_etims
credit_noted
cancelled_before_submission
manual_review
```

## 9.3 Payment lifecycle

```text
created
pending
confirmed
partially_allocated
allocated
failed
reversed
refunded
suspense
```

## 9.4 Credit note lifecycle

```text
draft
pending_approval
approved
submitted_to_etims
accepted_by_etims
rejected_by_etims
refund_pending
closed
cancelled
```

---

## 10. Final field validation rules

## 10.1 Sale header

| Field             | Validation                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| `branch_id`       | Required                                                                |
| `terminal_id`     | Required                                                                |
| `shift_id`        | Required unless non-cash back-office invoice                            |
| `cashier_user_id` | Required                                                                |
| `sale_type`       | Enum                                                                    |
| `customer_id`     | Optional for walk-in retail, required for credit/insurance/prescription |
| `patient_id`      | Required for clinic, prescription, lab, claim-linked sale               |
| `status`          | Enum                                                                    |
| `currency`        | Default `KES`                                                           |
| `subtotal`        | Must equal sum of line subtotals                                        |
| `discount_total`  | Must equal sum of discounts                                             |
| `tax_total`       | Must equal sum of line taxes                                            |
| `gross_total`     | Must equal subtotal - discount + tax depending tax-inclusive config     |

## 10.2 Sale line

| Field                   | Validation                                       |
| ----------------------- | ------------------------------------------------ |
| `item_type`             | Product/service                                  |
| `product_id/service_id` | Required                                         |
| `quantity`              | Greater than zero                                |
| `unit_price`            | Non-negative                                     |
| `discount`              | Within user approval limits                      |
| `tax_code_id`           | Required                                         |
| `batch_id`              | Required for batch-controlled medicine           |
| `expiry_date`           | Required for expiry-controlled medicine          |
| `prescription_id`       | Required for prescription-only medicines         |
| `clinician_order_id`    | Required for clinic/lab service where configured |
| `price_list_id`         | Required                                         |
| `line_total`            | Calculated, not manually entered                 |

## 10.3 Invoice

| Field                       | Validation                                              |
| --------------------------- | ------------------------------------------------------- |
| `invoice_number`            | Unique per branch/organisation                          |
| `seller_pin`                | Required                                                |
| `buyer_pin`                 | Required for corporate/claimable buyer where configured |
| `issue_datetime`            | Required                                                |
| `gross_total`               | Must match sale total                                   |
| `tax_total`                 | Must match line tax                                     |
| `etims_status`              | Enum                                                    |
| `qr_code`                   | Required after eTIMS acceptance where returned          |
| `unique_invoice_identifier` | Required after eTIMS acceptance                         |

## 10.4 Payment

| Field                  | Validation                                                |
| ---------------------- | --------------------------------------------------------- |
| `payment_method`       | Enum                                                      |
| `amount`               | Greater than zero                                         |
| `reference`            | Required for M-Pesa/card/bank/insurer                     |
| `cash_drawer_id`       | Required for cash                                         |
| `mpesa_receipt_number` | Unique if M-Pesa confirmed                                |
| `card_auth_code`       | Required if card                                          |
| `payer_contract_id`    | Required for insurer/SHA payment allocation               |
| `allocation_amount`    | Cannot exceed invoice balance unless overpayment handling |

## 10.5 Credit note

| Field                 | Validation                                      |
| --------------------- | ----------------------------------------------- |
| `original_invoice_id` | Required                                        |
| `reason_code`         | Required                                        |
| `reason_text`         | Required                                        |
| `credit_amount`       | Cannot exceed uncredited original amount        |
| `line_quantity`       | Cannot exceed uncredited original quantity      |
| `approval_user_id`    | Required above threshold or any medicine return |
| `refund_method`       | Required if money returned                      |
| `etims_credit_status` | Required if original invoice accepted           |

---

## 11. Final tax and pricing rules

## 11.1 Tax calculation modes

The system should support both:

| Mode                  | Use                                     |
| --------------------- | --------------------------------------- |
| Tax-inclusive pricing | Common retail/POS display               |
| Tax-exclusive pricing | Corporate/wholesale/accounting invoices |

Recommended default for walk-in POS:

```text
Display price tax-inclusive
Store net, tax, gross separately
```

## 11.2 Tax calculation formula

For tax-inclusive price:

```text
net_amount = gross_amount / (1 + tax_rate)
tax_amount = gross_amount - net_amount
```

For tax-exclusive price:

```text
tax_amount = net_amount × tax_rate
gross_amount = net_amount + tax_amount
```

## 11.3 Rounding

| Rule               | Requirement                                     |
| ------------------ | ----------------------------------------------- |
| Currency precision | 2 decimal places                                |
| Line rounding      | Round line tax and totals consistently          |
| Invoice rounding   | Difference posted to rounding account if needed |
| M-Pesa amount      | Integer KES where required by payment provider  |
| eTIMS amount       | Must match submitted line totals                |
| Rounding discount  | Separate line/field, not hidden                 |

## 11.4 Price-list hierarchy

```text
1. Payer/insurer tariff
2. Customer/corporate contract price
3. Branch-specific price
4. Active promotion price
5. Default retail price
6. Fallback base price
```

## 11.5 Discount approval

| Discount condition          | Required approval                           |
| --------------------------- | ------------------------------------------- |
| Within cashier limit        | Cashier                                     |
| Above cashier limit         | Manager                                     |
| Below cost                  | Owner                                       |
| Prescription medicine       | Pharmacist/manager based on policy          |
| Controlled medicine         | Block or superintendent approval            |
| Insurer tariff item         | No manual discount unless payer rule allows |
| Credit note due to discount | Manager/accountant                          |

---

## 12. Updated database tables for Module 2

## 12.1 `sales`

| Field               |
| ------------------- |
| `id`                |
| `sale_number`       |
| `organisation_id`   |
| `branch_id`         |
| `terminal_id`       |
| `shift_id`          |
| `sale_type`         |
| `customer_id`       |
| `patient_id`        |
| `visit_id`          |
| `payer_contract_id` |
| `price_list_id`     |
| `currency`          |
| `subtotal`          |
| `discount_total`    |
| `tax_total`         |
| `gross_total`       |
| `amount_paid`       |
| `balance_due`       |
| `payment_status`    |
| `invoice_status`    |
| `stock_status`      |
| `status`            |
| `created_by`        |
| `completed_by`      |
| `completed_at`      |
| `created_at`        |

## 12.2 `sale_lines`

| Field                |
| -------------------- |
| `id`                 |
| `sale_id`            |
| `line_number`        |
| `item_type`          |
| `product_id`         |
| `service_id`         |
| `description`        |
| `quantity`           |
| `unit_of_measure`    |
| `unit_price`         |
| `price_includes_tax` |
| `discount_type`      |
| `discount_amount`    |
| `discount_reason`    |
| `tax_code_id`        |
| `tax_rate`           |
| `net_amount`         |
| `tax_amount`         |
| `gross_amount`       |
| `cost_amount`        |
| `batch_id`           |
| `expiry_date`        |
| `prescription_id`    |
| `order_id`           |
| `approval_status`    |
| `approved_by`        |
| `status`             |

## 12.3 `invoices`

| Field                         |
| ----------------------------- |
| `id`                          |
| `sale_id`                     |
| `invoice_number`              |
| `invoice_type`                |
| `seller_pin`                  |
| `buyer_pin`                   |
| `buyer_name`                  |
| `issue_datetime`              |
| `currency`                    |
| `subtotal`                    |
| `discount_total`              |
| `tax_total`                   |
| `gross_total`                 |
| `etims_status`                |
| `etims_unique_identifier`     |
| `control_unit_id`             |
| `control_unit_invoice_number` |
| `qr_code_payload`             |
| `receipt_signature`           |
| `internal_data`               |
| `status`                      |
| `created_at`                  |

## 12.4 `payments`

| Field                       |
| --------------------------- |
| `id`                        |
| `payment_number`            |
| `branch_id`                 |
| `shift_id`                  |
| `payment_method`            |
| `amount`                    |
| `currency`                  |
| `status`                    |
| `payer_type`                |
| `reference_number`          |
| `mpesa_receipt_number`      |
| `card_auth_code`            |
| `bank_reference`            |
| `received_by`               |
| `received_at`               |
| `reversed_at`               |
| `reversal_reference`        |
| `raw_provider_payload_json` |
| `notes`                     |

## 12.5 `payment_allocations`

| Field              |
| ------------------ |
| `id`               |
| `payment_id`       |
| `invoice_id`       |
| `sale_id`          |
| `allocated_amount` |
| `allocated_by`     |
| `allocated_at`     |
| `status`           |

## 12.6 `credit_notes`

| Field                 |
| --------------------- |
| `id`                  |
| `credit_note_number`  |
| `original_invoice_id` |
| `original_sale_id`    |
| `reason_code`         |
| `reason_text`         |
| `subtotal`            |
| `tax_total`           |
| `gross_total`         |
| `approval_status`     |
| `approved_by`         |
| `approved_at`         |
| `etims_status`        |
| `refund_status`       |
| `status`              |
| `created_by`          |
| `created_at`          |

## 12.7 `refunds`

| Field                |
| -------------------- |
| `id`                 |
| `refund_number`      |
| `credit_note_id`     |
| `payment_id`         |
| `refund_method`      |
| `amount`             |
| `reason`             |
| `approval_status`    |
| `approved_by`        |
| `provider_reference` |
| `status`             |
| `created_by`         |
| `created_at`         |

---

## 13. API endpoints for Module 2

## 13.1 POS sale endpoints

| Endpoint                               | Purpose                         |
| -------------------------------------- | ------------------------------- |
| `POST /pos/sales`                      | Create draft sale               |
| `POST /pos/sales/{id}/lines`           | Add line                        |
| `PATCH /pos/sales/{id}/lines/{lineId}` | Edit line                       |
| `POST /pos/sales/{id}/hold`            | Hold sale                       |
| `POST /pos/sales/{id}/resume`          | Resume sale                     |
| `POST /pos/sales/{id}/validate`        | Validate sale before completion |
| `POST /pos/sales/{id}/complete`        | Complete sale                   |
| `POST /pos/sales/{id}/void`            | Void draft/unsubmitted sale     |
| `GET /pos/sales/search`                | Search sales                    |

## 13.2 Invoice/eTIMS endpoints

| Endpoint                               | Purpose                              |
| -------------------------------------- | ------------------------------------ |
| `POST /invoices/from-sale/{saleId}`    | Create invoice                       |
| `POST /invoices/{id}/submit-etims`     | Submit through selected adapter      |
| `POST /invoices/{id}/retry-etims`      | Retry failed/queued submission       |
| `GET /invoices/{id}/etims-status`      | Check status                         |
| `GET /etims/queue`                     | View queue                           |
| `POST /etims/items/sync`               | Sync item master                     |
| `POST /etims/stock/sync`               | Sync stock movement where applicable |
| `POST /credit-notes`                   | Create credit note                   |
| `POST /credit-notes/{id}/submit-etims` | Submit credit note                   |

## 13.3 Payment endpoints

| Endpoint                                | Purpose                       |
| --------------------------------------- | ----------------------------- |
| `POST /payments/cash`                   | Record cash payment           |
| `POST /payments/card`                   | Record card payment reference |
| `POST /payments/credit`                 | Post to customer/payer credit |
| `POST /payments/allocate`               | Allocate payment to invoice   |
| `POST /payments/mpesa/stk`              | Initiate STK prompt           |
| `POST /payments/mpesa/stk-callback`     | Receive STK result            |
| `POST /payments/mpesa/c2b-validation`   | C2B validation URL            |
| `POST /payments/mpesa/c2b-confirmation` | C2B confirmation URL          |
| `POST /payments/mpesa/query-status`     | Query transaction status      |
| `POST /payments/mpesa/reversal`         | Request reversal              |
| `GET /payments/unmatched`               | Unmatched payments queue      |

## 13.4 Shift endpoints

| Endpoint                      | Purpose           |
| ----------------------------- | ----------------- |
| `POST /shifts/open`           | Open shift        |
| `POST /shifts/{id}/cash-drop` | Record cash drop  |
| `POST /shifts/{id}/expense`   | Record petty cash |
| `POST /shifts/{id}/close`     | Close shift       |
| `POST /shifts/{id}/approve`   | Approve variance  |
| `GET /shifts/{id}/summary`    | Shift report      |

## 13.5 Device endpoints

| Endpoint                        | Purpose             |
| ------------------------------- | ------------------- |
| `POST /devices`                 | Register POS device |
| `PATCH /devices/{id}`           | Update device       |
| `POST /devices/{id}/test-print` | Test print          |
| `POST /receipts/{id}/print`     | Print receipt       |
| `POST /receipts/{id}/reprint`   | Reprint with reason |
| `POST /labels/print`            | Print label         |
| `GET /devices/status`           | Device health       |

---

## 14. Exact POS workflows for developers

## 14.1 Fast retail sale

```text
1. Cashier opens active shift
2. Scans/searches product
3. System validates stock, tax code, price
4. Product added to cart
5. Cashier selects payment
6. Payment confirmed
7. Sale completed
8. Invoice generated
9. eTIMS submitted or queued
10. Receipt printed
11. Stock movement posted
12. Accounting event posted
```

## 14.2 Pharmacy prescription sale

```text
1. Prescription-only item detected
2. POS blocks normal sale
3. Prescription/dispense workflow required
4. Pharmacist approves dispense
5. Dispense lines return to POS
6. Batch and expiry locked
7. Patient pays
8. Invoice/eTIMS generated
9. Label and receipt printed
10. Stock and accounting posted
```

## 14.3 Clinic service sale

```text
1. Patient visit created in EMR
2. Consultation/lab/procedure order created
3. Billing pulls service line
4. Payer or cash price applied
5. Patient pays or insurer portion posted
6. Invoice generated
7. Service marked paid/covered
8. Claim bundle receives billing evidence
```

## 14.4 Return and credit note

```text
1. User searches original invoice
2. Selects line and quantity to credit
3. System validates remaining creditable amount
4. Reason captured
5. Approval required
6. Credit note generated
7. eTIMS credit note submitted if original was accepted
8. Stock return/quarantine action applied
9. Refund/customer credit handled separately
10. Accounting reversal posted
```

## 14.5 M-Pesa STK payment

```text
1. Invoice created with balance
2. Cashier confirms customer phone
3. System sends STK prompt
4. Payment status = pending_customer
5. Callback received
6. If success: payment confirmed and allocated
7. If failed: invoice remains unpaid
8. If timeout: transaction status query or retry
```

## 14.6 Manual Till/Paybill C2B payment

```text
1. Customer pays manually
2. C2B confirmation callback arrives
3. System matches account reference/invoice
4. If exact match: allocate automatically
5. If partial/over/unmatched: move to reconciliation queue
6. Cashier/manager resolves unmatched items
```

---

## 15. Error and retry handling

## 15.1 eTIMS errors

| Error type              | Behaviour                                       |
| ----------------------- | ----------------------------------------------- |
| Network timeout         | Queue and retry                                 |
| Authentication failure  | Stop retries, alert admin                       |
| Validation error        | Mark `manual_action_required`                   |
| Duplicate invoice       | Query status, do not resubmit blindly           |
| KRA service unavailable | Queue and retry                                 |
| Item code rejected      | Block affected invoice until item mapping fixed |
| Tax mismatch            | Accountant review                               |
| Credit note rejected    | Keep original invoice unchanged and flag        |

## 15.2 M-Pesa errors

| Error type                 | Behaviour                             |
| -------------------------- | ------------------------------------- |
| Customer cancels           | Payment failed, invoice unpaid        |
| Timeout                    | Query status before retry             |
| Insufficient funds         | Payment failed                        |
| Duplicate callback         | Ignore duplicate posting              |
| Callback delayed           | Keep pending                          |
| Amount mismatch            | Reconciliation queue                  |
| Account reference mismatch | Unmatched payment                     |
| Reversal failure           | Keep refund pending and alert manager |

## 15.3 Hardware errors

| Error type              | Behaviour                                   |
| ----------------------- | ------------------------------------------- |
| Printer offline         | Save sale, mark receipt not printed         |
| Cash drawer not opening | Log exception                               |
| Barcode not found       | Manual search                               |
| Label printer failure   | Block pharmacy handover or require override |
| Device unregistered     | Block device-specific operations            |

---

## 16. Security and audit controls

| Action              | Required audit                           |
| ------------------- | ---------------------------------------- |
| Sale completed      | User, branch, terminal, shift            |
| Price override      | Old/new price, reason, approver          |
| Discount            | Amount, reason, approver                 |
| Tax code change     | Old/new, accountant/admin approval       |
| Credit note         | Original invoice, reason, approver       |
| Refund              | Method, amount, approver                 |
| M-Pesa manual match | Payment, invoice, user, reason           |
| eTIMS retry         | Payload reference, response, user/system |
| Receipt reprint     | Reason and user                          |
| Shift close         | Variance and approval                    |
| Device change       | Old/new config, admin user               |
| Cash drawer open    | User and reason                          |
| Stock movement      | Product, batch, quantity, source sale    |

---

## 17. Integration readiness checklist

## 17.1 Before eTIMS sandbox

| Requirement                              | Status needed             |
| ---------------------------------------- | ------------------------- |
| KRA PIN stored in Module 1               | Required                  |
| eTIMS mode selected                      | Required                  |
| Sandbox credentials issued               | Required                  |
| Branch ID/control-unit details           | Required where applicable |
| Tax-code mapping configured              | Required                  |
| Item classification codes configured     | Required                  |
| Test products/services registered        | Required                  |
| Invoice payload validated internally     | Required                  |
| Credit note test cases prepared          | Required                  |
| Retry/idempotency implemented            | Required                  |
| Raw payload/response storage implemented | Required                  |

## 17.2 Before Daraja sandbox

| Requirement                           | Status needed               |
| ------------------------------------- | --------------------------- |
| Daraja developer account              | Required                    |
| App created                           | Required                    |
| Sandbox credentials                   | Required                    |
| Public HTTPS callback URL             | Required                    |
| STK callback endpoint                 | Required                    |
| C2B validation/confirmation endpoints | Required                    |
| Transaction status endpoint           | Required                    |
| Reversal endpoint                     | Required if refunds enabled |
| Idempotency by receipt/checkout ID    | Required                    |
| Unmatched payment queue               | Required                    |
| Test cases documented                 | Required                    |

## 17.3 Before production

| Integration    | Production requirement                                     |
| -------------- | ---------------------------------------------------------- |
| eTIMS          | KRA approval/certification/onboarding completed            |
| M-Pesa         | Safaricom go-live approval and live shortcode/Till/Paybill |
| Callback URLs  | Public HTTPS, stable, monitored                            |
| Secrets        | Stored in vault, not source code                           |
| Monitoring     | Alerts for failures/delays                                 |
| Logs           | Raw request/response retained securely                     |
| Reconciliation | Accountant workflow tested                                 |
| Fallback       | Manual process documented                                  |

---

## 18. MVP versus later versions

### MVP

Build these first:

| Feature                          | Reason                        |
| -------------------------------- | ----------------------------- |
| POS sale and sale lines          | Core workflow                 |
| Invoice model                    | Fiscal/commercial separation  |
| Internal tax calculation         | Required before eTIMS         |
| Manual eTIMS-ready export/status | Allows early operation        |
| Cash payment                     | Basic operation               |
| M-Pesa manual reference capture  | Kenya reality                 |
| M-Pesa STK adapter interface     | Prepare integration           |
| C2B callback model               | Prepare reconciliation        |
| Credit note model                | Returns/corrections           |
| Shift close                      | Cash control                  |
| Receipt printing                 | Customer proof                |
| Discount approval                | Leakage control               |
| Price-list hierarchy             | Retail/insurer/branch pricing |
| Stock movement event             | Inventory accuracy            |
| Accounting journal export        | Accountant readiness          |
| Audit logs                       | Fraud control                 |
| Device registry                  | Hardware management           |

## Version 2

Add:

| Feature                           | Reason                             |
| --------------------------------- | ---------------------------------- |
| Full Daraja STK                   | Automated payment                  |
| Full Daraja C2B                   | Manual Paybill/Till reconciliation |
| Transaction status query          | Pending payment resolution         |
| Reversal API                      | Controlled refunds                 |
| OSCU/VSCU sandbox adapter         | eTIMS automation                   |
| Item-code sync                    | eTIMS item readiness               |
| Stock sync                        | eTIMS stock readiness              |
| Label printer bridge              | Pharmacy workflow                  |
| Card terminal integration         | Faster checkout                    |
| Advanced accounting export        | ERP integration                    |
| Automated M-Pesa statement import | Reconciliation                     |
| Offline sync dashboard            | Branch reliability                 |

## Version 3

Add:

| Feature                                | Reason                                   |
| -------------------------------------- | ---------------------------------------- |
| Certified eTIMS middleware marketplace | Wider client onboarding                  |
| Dynamic QR M-Pesa                      | Faster checkout                          |
| B2C refunds                            | Automated customer payouts               |
| Full accounting integration            | ERP maturity                             |
| Fraud analytics                        | Discounts, refunds, voids, payment abuse |
| Multi-currency                         | Import/wholesale use                     |
| Advanced promotion engine              | Retail growth                            |
| Self-checkout/payment links            | Patient convenience                      |
| Offline local device agent             | Stronger rural branch support            |

---

## 19. Developer acceptance criteria

## 19.1 POS acceptance

| Test                      | Expected result                                                       |
| ------------------------- | --------------------------------------------------------------------- |
| Create draft sale         | Sale and lines saved                                                  |
| Hold/resume sale          | Sale returns unchanged                                                |
| Complete sale             | Invoice, payment allocation, stock movement, accounting event created |
| Prescription item scanned | Sale blocked until pharmacy approval                                  |
| Lab service billed        | Billing line links to lab order                                       |
| Insurer split             | Patient and payer portions calculated                                 |
| Discount above limit      | Manager approval required                                             |
| Price below cost          | Owner approval or block                                               |
| Receipt printed           | Receipt event logged                                                  |
| Receipt reprinted         | COPY watermark and reason required                                    |

## 19.2 eTIMS acceptance

| Test                                             | Expected result                                                  |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| Invoice has required fields                      | Seller PIN, date/time, serial, item codes, quantity, tax, totals |
| Buyer PIN required for company/claimable invoice | Missing buyer PIN warns/blocks based on policy                   |
| Submit invoice via adapter                       | Submission record created                                        |
| Accepted response                                | eTIMS identifiers and QR stored                                  |
| Rejected response                                | Status rejected and reason visible                               |
| Retry                                            | Same request ID used                                             |
| Offline                                          | Invoice queued                                                   |
| Credit note                                      | References original accepted invoice                             |
| Original accepted invoice edit                   | Blocked; requires credit note                                    |
| Raw payload/response                             | Stored for audit                                                 |

## 19.3 M-Pesa acceptance

| Test                 | Expected result                                |
| -------------------- | ---------------------------------------------- |
| Send STK             | Prompt record created and linked to invoice    |
| STK success callback | Payment confirmed and invoice allocated        |
| STK failure          | Invoice remains unpaid                         |
| STK timeout          | Query-required status                          |
| C2B exact match      | Auto-allocated                                 |
| C2B unmatched        | Suspense queue                                 |
| Duplicate callback   | No duplicate payment                           |
| Overpayment          | Excess to customer credit/suspense             |
| Reversal             | Payment reversed and invoice reopened/adjusted |
| Manual match         | Reason and user logged                         |

## 19.4 Accounting acceptance

| Test               | Expected result                      |
| ------------------ | ------------------------------------ |
| Cash sale          | Dr Cash, Cr Revenue/VAT              |
| Stock sale         | Dr COGS, Cr Inventory                |
| Insurance sale     | Dr Insurer receivable                |
| Credit note        | Revenue/tax reversed                 |
| Refund             | Separate cash/M-Pesa reversal posted |
| Overpayment        | Customer deposit liability created   |
| Claim payment      | Receivable reduced                   |
| Journal correction | Reversal journal, not edit           |

## 19.5 Hardware acceptance

| Test             | Expected result                               |
| ---------------- | --------------------------------------------- |
| 58mm print       | Receipt fits                                  |
| 80mm print       | Receipt fits with eTIMS QR                    |
| Printer offline  | Sale saved; reprint allowed                   |
| Barcode scan     | Item added to cart                            |
| Cash drawer kick | Opens on cash payment only                    |
| Label print      | Medicine label printed from approved dispense |
| Reprint label    | Reason required                               |
| Device change    | Admin/audit required                          |

---

## 20. Final handoff summary

Module 2 is now developer-ready with these final decisions:

| Area                | Final state                                                |
| ------------------- | ---------------------------------------------------------- |
| POS domain          | Ready                                                      |
| Invoice model       | Ready                                                      |
| Payment model       | Ready                                                      |
| eTIMS model         | Adapter-ready; live integration pending KRA onboarding     |
| M-Pesa model        | Adapter-ready; live integration pending Daraja credentials |
| Credit notes        | Ready                                                      |
| Returns/refunds     | Ready                                                      |
| Accounting postings | Ready                                                      |
| Shift controls      | Ready                                                      |
| Hardware specs      | Ready                                                      |
| Tax/item catalogue  | Ready                                                      |
| Developer risk      | Mostly integration certification, not domain modelling     |

The closed Module 2 rule is:

```text
No sale should complete unless the system can explain:
what was sold,
who sold it,
where it was sold,
which tax code applied,
which invoice was issued,
how it was paid or posted to receivable,
which stock moved,
which journal was posted,
which receipt was printed,
and whether eTIMS/M-Pesa accepted, rejected, queued, or requires manual action.
```
