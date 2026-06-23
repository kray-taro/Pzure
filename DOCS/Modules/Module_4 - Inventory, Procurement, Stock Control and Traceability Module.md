# Module 4: Inventory, Procurement, Stock Control and Traceability Module

This module is the **stock integrity engine** of the whole system.

Modules 1–3 answer:

```text
Module 1: Is the branch/professional licensed?
Module 2: Was the item billed, paid, invoiced, and receipted?
Module 3: Was the medicine dispensed safely and professionally?
Module 4: Did the business buy, receive, store, move, count, quarantine, and issue stock correctly?
```

For Kenya, this module is especially important because pharmacies and clinics do not only manage “items.” They manage **health products**, many of which require batch, expiry, storage-condition, supplier, recall, and traceability controls.

PPB’s Good Storage and Distribution Practices guidance emphasizes that pharmaceuticals require specialized handling to maintain quality throughout the distribution chain and avoid exposing the public to unsafe medicines. PPB’s authentication and traceability standards also describe traceability as important for patient safety, supply-chain integrity, and protection against substandard or falsified health products. KRA’s Electronic Tax Invoice Regulations require system users to maintain stock-in and stock-out records, including local purchases and imports, where applicable. ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/guidelines-for-good-storage-and-distribution-practices-for-health-products-and-technologies-in-kenya/)) ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/standards-for-authentication-and-traceability-of-health-products-and-technologies/)) ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/64/eng@2024-03-28))

---

# 1. Purpose of the module

The Inventory and Procurement Module should:

| Purpose                         | Practical meaning                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| Control purchasing              | Avoid random buying, overstocking, duplicate orders, and supplier abuse                        |
| Confirm stock received          | Goods received should match purchase order, delivery note, supplier invoice, batch, and expiry |
| Protect medicine quality        | Track batch, expiry, storage condition, quarantine, recall, and cold chain                     |
| Maintain accurate stock         | Every sale, dispense, return, transfer, adjustment, and count affects stock                    |
| Prevent theft and shrinkage     | Stock count, adjustment approval, variance reports, and audit logs                             |
| Avoid stockouts                 | Reorder levels, minimum/maximum stock, supplier lead time                                      |
| Reduce expiries                 | Near-expiry reports, FEFO picking, expiry-based purchasing                                     |
| Support multi-branch operations | Transfers, central buying, branch stock visibility                                             |
| Support tax and audit           | Stock-in/stock-out records, supplier invoices, landed costs                                    |
| Support recalls                 | Identify affected branches, stock balances, and patients supplied from a batch                 |
| Support profitability           | Supplier price history, cost tracking, gross margin reports                                    |
| Support working capital control | Dead stock, slow movers, overstock reports                                                     |

---

# 2. Core users

| User                      | Main actions                                                               |
| ------------------------- | -------------------------------------------------------------------------- |
| Procurement officer       | Creates purchase orders, compares supplier prices                          |
| Pharmacist/superintendent | Approves medicine suppliers, batch/expiry acceptance, quarantine decisions |
| Storekeeper               | Receives goods, records batches, manages stock locations                   |
| Branch manager            | Approves orders, transfers, adjustments, stock counts                      |
| Cashier                   | Triggers stock-out through sales                                           |
| Dispenser/pharmacist      | Selects batch during dispensing                                            |
| Accountant                | Matches supplier invoices, payables, taxes, landed costs                   |
| Owner                     | Reviews stock value, margins, dead stock, shrinkage                        |
| Auditor                   | Reviews stock movement, adjustments, variances, supplier history           |
| Warehouse manager         | Manages central stock and branch replenishment                             |

---

# 3. Relationship with modules 1, 2, and 3

## Module 1 dependency: Organisation and Licensing

Inventory must know whether a branch is legally allowed to store, sell, transfer, or dispense certain items.

| From Module 1            | Inventory effect                                                                 |
| ------------------------ | -------------------------------------------------------------------------------- |
| Branch type              | Retail, pharmacy, clinic, warehouse                                              |
| PPB premise licence      | Enables medicine stock handling                                                  |
| Superintendent           | Required for pharmacy stock governance                                           |
| KMPDC facility licence   | Enables clinic/lab consumable workflows                                          |
| Branch permissions       | Controls whether branch can receive, transfer, dispense, or quarantine medicines |
| Supplier/licence records | Supplier qualification and audit                                                 |

## Module 2 dependency: POS and Billing

POS creates stock movements.

| POS event              | Inventory effect                  |
| ---------------------- | --------------------------------- |
| Sale                   | Stock out                         |
| Return                 | Stock in or quarantine            |
| Credit note            | May reverse stock or service only |
| Void before completion | Releases reserved stock           |
| Shift close            | Stock-to-sales reconciliation     |
| eTIMS                  | Stock-out and invoice alignment   |
| Discount               | Margin analysis                   |

## Module 3 dependency: Pharmacy Dispensing

Dispensing requires medicine-specific inventory controls.

| Dispensing event             | Inventory effect                         |
| ---------------------------- | ---------------------------------------- |
| Batch selected               | Reserve or issue stock                   |
| Medicine handed over         | Final stock-out                          |
| Partial dispense             | Stock out only actual quantity           |
| Substitution                 | Stock out actual dispensed product       |
| Controlled medicine dispense | Stock out plus controlled register       |
| Recall                       | Block batch and find affected patients   |
| Return                       | Usually quarantine, not automatic resale |

---

# 4. Core inventory transaction types

| Transaction type          | Example                                       | Stock direction                                 |
| ------------------------- | --------------------------------------------- | ----------------------------------------------- |
| Purchase order            | Order 100 packs from supplier                 | No stock movement                               |
| Goods received note       | Receive 90 of 100 ordered packs               | Stock in                                        |
| Supplier invoice          | Supplier bills for received goods             | No direct stock movement, affects cost/payables |
| Supplier return           | Return damaged/expired/wrong item to supplier | Stock out                                       |
| Sale                      | Sell item at POS                              | Stock out                                       |
| Dispense                  | Dispense medicine to patient                  | Stock out                                       |
| Patient return            | Medicine returned                             | Stock in quarantine or rejected                 |
| Stock adjustment          | Correct stock due to loss/damage/error        | Stock in/out                                    |
| Stock count               | Physical count compared to system             | No movement until approved variance             |
| Inter-branch transfer out | Branch A sends to Branch B                    | Stock out from origin/in-transit                |
| Inter-branch transfer in  | Branch B receives                             | Stock in destination                            |
| Quarantine                | Stock blocked from sale                       | Status change                                   |
| Recall                    | Recalled batch blocked                        | Status change/stock out if removed              |
| Expiry write-off          | Expired stock removed                         | Stock out                                       |
| Conversion/repack         | Pack split into units                         | Stock transformation                            |
| Clinic consumption        | Syringe, gloves, reagent used                 | Stock out                                       |
| Cold-chain excursion      | Fridge temperature failure                    | Quarantine/status change                        |

---

# 5. Feature-by-feature design

## A. Purchase orders

Purchase orders create buying discipline. They prevent staff from buying randomly, overpaying, buying from unapproved suppliers, or ordering items already overstocked.

### Purchase order types

| Type                   | Use                                              |
| ---------------------- | ------------------------------------------------ |
| Branch PO              | One branch orders directly from supplier         |
| Central PO             | Head office/warehouse buys for multiple branches |
| Emergency PO           | Urgent stockout order                            |
| Reorder-generated PO   | Auto-created from reorder levels                 |
| Supplier quote PO      | Created after comparing supplier quotations      |
| Import PO              | For import-related workflows                     |
| Controlled medicine PO | Requires stricter approval                       |
| Cold-chain PO          | Requires cold-chain receiving checks             |

### Purchase order fields

| Field                  |      Required? | Notes                                                                          |
| ---------------------- | -------------: | ------------------------------------------------------------------------------ |
| PO number              |            Yes | Auto-generated                                                                 |
| Branch/warehouse       |            Yes | Destination                                                                    |
| Supplier               |            Yes | Must be approved for medicine items                                            |
| Order date             |            Yes |                                                                                |
| Expected delivery date |    Recommended | Used for lead-time tracking                                                    |
| Requested by           |            Yes | Audit                                                                          |
| Approved by            | Based on limit | Approval workflow                                                              |
| Currency               |            Yes | KES/default, foreign if import                                                 |
| Payment terms          |    Recommended | Cash, credit, 30 days                                                          |
| Delivery terms         |       Optional | Supplier delivery, pickup                                                      |
| PO status              |            Yes | Draft, pending approval, approved, sent, partially received, closed, cancelled |
| Notes                  |       Optional |                                                                                |
| Attachment             |       Optional | Supplier quotation/proforma                                                    |

### PO line fields

| Field                    |               Required? | Notes                                     |
| ------------------------ | ----------------------: | ----------------------------------------- |
| Product/service code     |                     Yes | Product master                            |
| Description              |                     Yes |                                           |
| Generic/brand            |           For medicines |                                           |
| Pack size                |                     Yes | Pack/unit conversion                      |
| Quantity ordered         |                     Yes |                                           |
| Unit cost quoted         |                     Yes | Supplier price                            |
| Discount                 |                Optional | Supplier discount                         |
| Tax                      |                Optional | Depending invoice/tax setup               |
| Expected batch/expiry    |                Optional | Useful for tender/supplier confirmation   |
| Storage condition        | For medicine/cold-chain |                                           |
| Last purchase price      |                    Auto | For comparison                            |
| Current stock            |                    Auto | Buying context                            |
| Reorder level            |                    Auto | Buying context                            |
| Average monthly usage    |                    Auto | Buying context                            |
| Suggested order quantity |                    Auto | Reorder logic                             |
| Approval status          |                     Yes | Especially for controlled/high-cost items |

### Purchase order rules

| Rule                         | System behaviour                                              |
| ---------------------------- | ------------------------------------------------------------- |
| Supplier not approved        | Block or require owner/pharmacist approval                    |
| Product overstocked          | Warn before order                                             |
| Product below reorder level  | Suggest order                                                 |
| Unit cost above last price   | Warn or require approval                                      |
| Order value above user limit | Manager/owner approval required                               |
| Controlled medicine          | Superintendent/pharmacist approval required                   |
| Cold-chain item              | Require cold-chain receiving checklist                        |
| Expired supplier licence     | Block medicine PO if supplier compliance module is configured |
| Duplicate PO                 | Warn if same supplier/item has open PO                        |
| PO closed                    | Cannot receive more unless reopened by authorized user        |

---

## B. Goods received notes

A Goods Received Note confirms what actually arrived. It should not simply copy the PO blindly.

### GRN types

| Type                          | Use                                   |
| ----------------------------- | ------------------------------------- |
| PO-based GRN                  | Receive against purchase order        |
| Direct GRN                    | Receive without PO, if allowed        |
| Partial GRN                   | Supplier delivers part of order       |
| Excess GRN                    | Supplier delivers more than ordered   |
| Return replacement GRN        | Replacement for returned goods        |
| Inter-branch transfer receipt | Receiving stock from another branch   |
| Donation GRN                  | Donated stock, common in some clinics |
| Opening stock GRN             | Initial migration stock               |

### GRN header fields

| Field                       |      Required? | Notes                                                     |
| --------------------------- | -------------: | --------------------------------------------------------- |
| GRN number                  |            Yes | Auto-generated                                            |
| PO number                   |    If PO-based | Link                                                      |
| Supplier                    |            Yes |                                                           |
| Branch/warehouse            |            Yes | Receiving location                                        |
| Delivery note number        |    Recommended | Supplier document                                         |
| Received date/time          |            Yes |                                                           |
| Received by                 |            Yes | Audit                                                     |
| Checked by                  |    Recommended | Second person for high-risk stock                         |
| Vehicle/transport reference |       Optional | Useful for cold chain/traceability                        |
| Temperature received        | For cold-chain |                                                           |
| Receiving status            |            Yes | Draft, pending QA, accepted, partially accepted, rejected |
| Notes                       |       Optional |                                                           |
| Delivery note attachment    |    Recommended | Upload                                                    |
| Photos                      |       Optional | Damaged goods evidence                                    |

### GRN line fields

| Field                    |               Required? | Notes                      |
| ------------------------ | ----------------------: | -------------------------- |
| Product                  |                     Yes |                            |
| Quantity ordered         |             If PO-based |                            |
| Quantity received        |                     Yes |                            |
| Quantity accepted        |                     Yes |                            |
| Quantity rejected        |                  If any |                            |
| Unit of measure          |                     Yes | Pack/unit                  |
| Batch/lot number         |  Required for medicines |                            |
| Expiry date              |  Required for medicines |                            |
| Manufacture date         |                Optional |                            |
| Supplier batch document  |                Optional |                            |
| Storage condition        | For medicine/cold-chain |                            |
| Temperature on receipt   |              Cold-chain |                            |
| Rejection reason         |             If rejected |                            |
| Quarantine flag          |              If suspect |                            |
| Cost price               |                     Yes | From PO/invoice            |
| Landed cost              |                Optional | Freight/import/other costs |
| Selling price suggestion |                Optional | Based on margin            |
| Shelf/bin location       |             Recommended |                            |

### GRN rules

| Rule                             | System behaviour                                      |
| -------------------------------- | ----------------------------------------------------- |
| Medicine without batch           | Block acceptance                                      |
| Medicine without expiry          | Block acceptance                                      |
| Expired item received            | Reject or quarantine                                  |
| Near-expiry item received        | Warn; require approval                                |
| Quantity exceeds PO              | Require approval                                      |
| Wrong item delivered             | Reject or receive as substitute with approval         |
| Damaged packaging                | Quarantine or reject                                  |
| Cold-chain temperature excursion | Quarantine pending pharmacist/superintendent decision |
| Supplier invoice mismatch        | Flag for accountant                                   |
| Direct GRN without PO            | Allow only authorized users                           |
| Controlled medicine received     | Update controlled register/controlled stock balance   |

---

## C. Supplier invoices

Supplier invoices connect stock to cost, payables, margin, and tax records.

### Supplier invoice fields

| Field                   |            Required? | Notes                                            |
| ----------------------- | -------------------: | ------------------------------------------------ |
| Supplier invoice number |                  Yes | Must be unique per supplier                      |
| Supplier                |                  Yes |                                                  |
| Invoice date            |                  Yes |                                                  |
| Received date           |                  Yes |                                                  |
| Linked PO               |          Recommended |                                                  |
| Linked GRN              | Recommended/required |                                                  |
| Currency                |                  Yes |                                                  |
| Subtotal                |                  Yes |                                                  |
| Tax amount              |        If applicable |                                                  |
| Discount                |             Optional |                                                  |
| Freight/handling        |             Optional | Landed cost                                      |
| Total payable           |                  Yes |                                                  |
| Payment terms           |             Optional | Due date                                         |
| Due date                |          Recommended | Payables                                         |
| Invoice document        |          Recommended | Upload                                           |
| Status                  |                  Yes | Draft, matched, approved, disputed, posted, paid |

### Three-way matching

The system should compare:

```text
Purchase Order ↔ Goods Received Note ↔ Supplier Invoice
```

| Match area         | Example                    |
| ------------------ | -------------------------- |
| Quantity ordered   | PO says 100                |
| Quantity received  | GRN says 90                |
| Quantity invoiced  | Invoice says 100           |
| Unit cost ordered  | PO says KES 250            |
| Unit cost invoiced | Invoice says KES 270       |
| Product delivered  | Same product or substitute |
| Tax/discount       | Matches invoice            |

### Invoice rules

| Rule                                       | System behaviour                       |
| ------------------------------------------ | -------------------------------------- |
| Invoice quantity exceeds received quantity | Flag dispute                           |
| Invoice price higher than PO               | Require approval                       |
| Duplicate supplier invoice number          | Block                                  |
| GRN not approved                           | Do not post invoice                    |
| Supplier return pending                    | Hold invoice payment                   |
| Tax mismatch                               | Accountant review                      |
| Landed cost added                          | Recalculate stock cost if configured   |
| Paid invoice                               | Lock edits; use adjustment/credit note |

---

## D. Batch and expiry

Batch and expiry tracking is non-negotiable for medicines. It supports patient safety, recalls, expiry control, and traceability.

### Batch fields

| Field                    |         Required? | Notes                                    |
| ------------------------ | ----------------: | ---------------------------------------- |
| Product ID               |               Yes |                                          |
| Batch/lot number         | Yes for medicines |                                          |
| Expiry date              | Yes for medicines |                                          |
| Manufacture date         |          Optional |                                          |
| Supplier                 |               Yes |                                          |
| GRN                      |               Yes |                                          |
| Quantity received        |               Yes |                                          |
| Quantity available       |              Auto |                                          |
| Quantity reserved        |              Auto |                                          |
| Quantity quarantined     |              Auto |                                          |
| Quantity sold/dispensed  |              Auto |                                          |
| Cost price               |               Yes |                                          |
| Selling price            |          Optional |                                          |
| Storage location         |       Recommended | Shelf/bin/fridge                         |
| Recall status            |               Yes | Clear, recalled, withdrawn               |
| Quality status           |               Yes | Sellable, quarantined, rejected, expired |
| GTIN/serial-ready fields |       Recommended | Traceability-ready                       |
| Temperature status       |    For cold-chain |                                          |

### Expiry rules

| Rule                            | System behaviour                              |
| ------------------------------- | --------------------------------------------- |
| Expired batch                   | Block sale/dispensing                         |
| Near-expiry batch               | Warn and prioritize FEFO where appropriate    |
| Batch has no expiry             | Block if item category requires expiry        |
| Batch recalled                  | Block and create recall task                  |
| Batch quarantined               | Block sale/dispensing                         |
| Dispensing module selects batch | Inventory reserves/issues exact batch         |
| Return by batch                 | Return to quarantine by default for medicines |
| Expiry write-off                | Requires approval and reason                  |

### FEFO

For medicines, the system should default to:

```text
FEFO = First Expiry, First Out
```

Example:

| Batch | Expiry        | System recommendation |
| ----- | ------------- | --------------------- |
| A     | July 2026     | Pick first            |
| B     | December 2026 | Pick later            |

---

## E. Stock count

Stock count protects against theft, shrinkage, data errors, expired stock, and poor receiving/selling discipline.

### Count types

| Count type                    | Use                       |
| ----------------------------- | ------------------------- |
| Full stock count              | Entire branch/warehouse   |
| Cycle count                   | Selected items/categories |
| High-value count              | Expensive/high-risk items |
| Controlled medicine count     | Strict reconciliation     |
| Near-expiry count             | Expiry-focused check      |
| Random spot check             | Fraud detection           |
| Opening stock count           | System migration          |
| Closing/branch handover count | Staff/branch transition   |
| Cold-chain count              | Fridge/freezer stock      |

### Stock count fields

| Field               |                         Required? |
| ------------------- | --------------------------------: |
| Count number        |                               Yes |
| Branch/warehouse    |                               Yes |
| Count type          |                               Yes |
| Count date/time     |                               Yes |
| Counted by          |                               Yes |
| Supervisor          |                       Recommended |
| Product             |                               Yes |
| System quantity     | Hidden or shown depending setting |
| Physical quantity   |                               Yes |
| Variance            |                              Auto |
| Batch               |                      For medicine |
| Expiry              |                      For medicine |
| Location            |                       Recommended |
| Reason for variance |              Required if variance |
| Approval status     |                               Yes |
| Adjustment posted?  |                            Yes/no |

### Blind count versus assisted count

| Mode             | Meaning                            | Best use                    |
| ---------------- | ---------------------------------- | --------------------------- |
| Blind count      | Counter cannot see system quantity | Fraud-resistant             |
| Assisted count   | Counter sees expected quantity     | Faster but weaker           |
| Two-person count | Two people verify                  | Controlled/high-value stock |

### Stock count rules

| Rule                         | System behaviour                                    |
| ---------------------------- | --------------------------------------------------- |
| Count in progress            | Freeze or warn on sale/receiving for counted items  |
| Variance above threshold     | Manager approval required                           |
| Controlled medicine variance | Superintendent approval and incident log            |
| Batch mismatch               | Require correction by batch, not only product total |
| Expired stock found          | Move to quarantine/write-off workflow               |
| Count posted                 | Creates approved stock adjustment                   |
| Count rejected               | No stock movement                                   |
| Recount required             | Create recount task                                 |

---

## F. Stock adjustment approval

Stock adjustments are a major fraud risk. They should never be casual.

### Adjustment types

| Type                           | Example                           |
| ------------------------------ | --------------------------------- |
| Positive adjustment            | Found extra stock                 |
| Negative adjustment            | Missing stock                     |
| Damage                         | Broken bottle                     |
| Expiry write-off               | Expired medicine                  |
| Theft/loss                     | Missing items                     |
| Data correction                | Migration or unit error           |
| Quarantine movement            | Suspect item blocked              |
| Recall removal                 | Recalled batch removed            |
| Conversion                     | Pack split/repack                 |
| Cold-chain excursion           | Temperature failure stock blocked |
| Controlled medicine correction | High-risk adjustment              |

### Adjustment fields

| Field               |                           Required? |
| ------------------- | ----------------------------------: |
| Adjustment number   |                                 Yes |
| Branch              |                                 Yes |
| Product             |                                 Yes |
| Batch/expiry        |                        For medicine |
| Quantity before     |                                Auto |
| Quantity adjusted   |                                 Yes |
| Quantity after      |                                Auto |
| Adjustment reason   |                                 Yes |
| Evidence attachment | Recommended/required for high-value |
| Requested by        |                                 Yes |
| Approved by         |                            Required |
| Approval date       |                            Required |
| Financial value     |                                Auto |
| Stock status        |       Sellable/quarantine/write-off |
| Notes               |                         Recommended |

### Adjustment approval rules

| Rule                                  | System behaviour                        |
| ------------------------------------- | --------------------------------------- |
| Cashier adjustment                    | Not allowed                             |
| Small variance                        | Branch manager approval                 |
| Large variance                        | Owner/senior approval                   |
| Controlled medicine                   | Superintendent plus senior approval     |
| Negative adjustment above value limit | Mandatory evidence                      |
| Expired medicine write-off            | Requires expiry/write-off workflow      |
| Recalled stock                        | Requires recall/quarantine workflow     |
| Adjustment after approval             | Cannot edit; create reversal/correction |
| Frequent adjustments by same user     | Flag suspicious activity                |

---

## G. Near-expiry report

Near-expiry control reduces losses and protects patients.

### Expiry windows

Recommended default windows:

| Window   | Meaning                                     |
| -------- | ------------------------------------------- |
| 180 days | Early warning for slow movers               |
| 90 days  | Procurement/branch action                   |
| 60 days  | Transfer/discount/return-to-supplier review |
| 30 days  | Critical action                             |
| 0 days   | Expired; block sale                         |

### Near-expiry report fields

| Field                       |
| --------------------------- |
| Branch                      |
| Product                     |
| Generic/brand               |
| Batch                       |
| Expiry date                 |
| Days to expiry              |
| Quantity on hand            |
| Average monthly sales       |
| Estimated months to clear   |
| Cost value at risk          |
| Supplier                    |
| Return-to-supplier eligible |
| Suggested action            |
| Responsible user            |

### Suggested actions

| Situation                   | Suggested action                                              |
| --------------------------- | ------------------------------------------------------------- |
| Fast mover, 90 days left    | Keep selling FEFO                                             |
| Slow mover, 180 days left   | Transfer to faster branch                                     |
| Supplier accepts returns    | Start supplier return                                         |
| Expiring in 30 days         | Manager/pharmacist review                                     |
| Expired                     | Block sale and quarantine/write-off                           |
| Cold-chain item near expiry | Prioritize clinical use if appropriate, no unsafe discounting |

### Near-expiry rules

| Rule                          | System behaviour                                     |
| ----------------------------- | ---------------------------------------------------- |
| Expiry threshold reached      | Alert branch manager/procurement                     |
| Near-expiry batch selected    | Warn dispenser/cashier                               |
| Expired item                  | Block sale/dispense                                  |
| Near-expiry clearance         | Discount requires approval and patient-safety policy |
| Branch has slow movement      | Suggest transfer                                     |
| Supplier return deadline near | Alert procurement                                    |

---

## H. Reorder levels

Reorder levels prevent stockouts without overstocking.

### Reorder fields

| Field                       | Notes                               |
| --------------------------- | ----------------------------------- |
| Minimum stock               | Lowest safe level                   |
| Maximum stock               | Avoid overstock                     |
| Reorder point               | Trigger level                       |
| Reorder quantity            | Suggested buy quantity              |
| Average daily/monthly usage | Calculated                          |
| Supplier lead time          | Days from order to delivery         |
| Safety stock                | Buffer                              |
| Pack size                   | Order multiples                     |
| Seasonality factor          | Malaria season, school season, etc. |
| Branch-specific level       | Different branches move differently |
| Critical item flag          | Higher priority                     |
| Controlled item flag        | Stricter procurement                |
| Cold-chain capacity         | Fridge limit                        |

### Reorder calculation

Basic formula:

```text
Reorder point = average daily usage × supplier lead time + safety stock
```

Example:

```text
Average daily sales: 5 packs
Supplier lead time: 4 days
Safety stock: 20 packs

Reorder point = 5 × 4 + 20 = 40 packs
```

When stock reaches 40 packs, the system suggests reordering.

### Reorder rules

| Rule                        | System behaviour                              |
| --------------------------- | --------------------------------------------- |
| Stock below reorder point   | Add to reorder report                         |
| Stock below minimum         | Urgent reorder alert                          |
| Stock above maximum         | Block/review new purchase                     |
| Supplier lead time changes  | Recalculate reorder point                     |
| Seasonal item               | Adjust suggested quantity                     |
| Dead/slow item              | Do not auto-reorder                           |
| Near-expiry stock exists    | Avoid reordering unless needed                |
| Central warehouse has stock | Suggest inter-branch transfer before purchase |

---

## I. Inter-branch transfer

Inter-branch transfer supports chains, groups, franchises, central warehouses, and stock balancing.

### Transfer types

| Type                         | Use                                       |
| ---------------------------- | ----------------------------------------- |
| Branch-to-branch             | Rongai sends to Kitengela                 |
| Warehouse-to-branch          | Central stock replenishment               |
| Branch-to-warehouse          | Return excess/dead stock                  |
| Emergency transfer           | Urgent stockout                           |
| Near-expiry transfer         | Move stock to faster branch               |
| Controlled medicine transfer | Strict approval                           |
| Cold-chain transfer          | Temperature-controlled movement           |
| Recall return transfer       | Move recalled stock to central quarantine |

### Transfer header fields

| Field                 |                          Required? |
| --------------------- | ---------------------------------: |
| Transfer number       |                                Yes |
| Origin branch         |                                Yes |
| Destination branch    |                                Yes |
| Requested by          |                                Yes |
| Approved by           |                           Required |
| Picked by             |                                Yes |
| Dispatched by         |                                Yes |
| Received by           |                                Yes |
| Transfer date         |                                Yes |
| Expected arrival      |                        Recommended |
| Transporter           | Recommended for medicine transfers |
| Temperature condition |                         Cold-chain |
| Status                |                                Yes |
| Notes                 |                           Optional |

### Transfer line fields

| Field                    |     Required? |
| ------------------------ | ------------: |
| Product                  |           Yes |
| Batch                    | For medicines |
| Expiry                   | For medicines |
| Quantity requested       |           Yes |
| Quantity dispatched      |           Yes |
| Quantity received        |           Yes |
| Quantity damaged/missing |        If any |
| Storage condition        | If applicable |
| Unit cost                |          Auto |
| Transfer value           |          Auto |

### Transfer statuses

```text
Draft → Requested → Approved → Picked → Dispatched → In transit → Received → Closed
```

Exception statuses:

```text
Partially received
Rejected
Cancelled
Lost in transit
Quarantined on receipt
```

### Transfer rules

| Rule                                  | System behaviour                                                      |
| ------------------------------------- | --------------------------------------------------------------------- |
| Destination not licensed for medicine | Block medicine transfer                                               |
| Origin stock insufficient             | Block or partial transfer                                             |
| Medicine transfer                     | Batch and expiry mandatory                                            |
| Cold-chain transfer                   | Require temperature packaging and receiving check                     |
| Controlled medicine transfer          | Superintendent approval at both ends                                  |
| In-transit stock                      | Removed from origin available stock, not yet available at destination |
| Quantity received differs             | Create variance and investigation task                                |
| Near-expiry transfer                  | Destination must have expected sales before expiry                    |
| Transfer cancelled after dispatch     | Requires return workflow                                              |

The Pharmacy and Poisons Transportation Rules define cold chain as maintaining a product within 2°C to 8°C or the manufacturer’s recommended conditions until administration; the same rules define consignments and product recalls, and apply to persons authorized to store, distribute, or transport pharmaceuticals. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2022/97/eng%402022-12-31))

---

## J. Quarantine stock

Quarantine stock is stock that exists physically but must not be sold, dispensed, transferred normally, or counted as available.

### Quarantine reasons

| Reason                    | Example                                  |
| ------------------------- | ---------------------------------------- |
| Expired                   | Past expiry date                         |
| Near-expiry under review  | Very short shelf life                    |
| Recalled                  | Supplier/PPB recall                      |
| Damaged                   | Broken seal, torn packaging              |
| Suspected counterfeit     | Unusual packaging or failed verification |
| Cold-chain excursion      | Temperature breach                       |
| Wrong delivery            | Supplier sent wrong product              |
| Pending quality check     | Awaiting pharmacist approval             |
| Patient return            | Medicine returned after leaving pharmacy |
| Controlled medicine issue | Balance discrepancy                      |
| Regulatory hold           | Directed by regulator/supplier           |

### Quarantine fields

| Field                    |                                                      Required? |
| ------------------------ | -------------------------------------------------------------: |
| Quarantine record number |                                                            Yes |
| Product                  |                                                            Yes |
| Batch/expiry             |                                                   For medicine |
| Quantity                 |                                                            Yes |
| Branch/location          |                                                            Yes |
| Reason                   |                                                            Yes |
| Quarantine date          |                                                            Yes |
| Quarantined by           |                                                            Yes |
| Evidence/photo           |                                                    Recommended |
| Decision owner           |                              Pharmacist/superintendent/manager |
| Status                   | Open, under review, released, returned, destroyed, written off |
| Final decision           |                                                       Required |
| Final decision date      |                                                       Required |
| Approved by              |                                                       Required |
| Disposal/return evidence |                                      Required where applicable |

### Quarantine rules

| Rule                      | System behaviour                            |
| ------------------------- | ------------------------------------------- |
| Quarantined stock         | Not available for sale/dispense             |
| Release from quarantine   | Requires pharmacist/superintendent approval |
| Expired medicine          | Cannot be released to sellable stock        |
| Patient-returned medicine | Default quarantine                          |
| Recalled batch            | Block across all branches                   |
| Cold-chain breach         | Quarantine until quality decision           |
| Disposal/write-off        | Requires stock adjustment and evidence      |
| Supplier return           | Creates supplier return transaction         |

---

## K. Supplier price history

Supplier price history protects margins and supports better procurement decisions.

### Price history fields

| Field                     |
| ------------------------- |
| Supplier                  |
| Product                   |
| Brand/generic             |
| Pack size                 |
| Date                      |
| Quoted price              |
| Invoice price             |
| Discount                  |
| Tax                       |
| Landed cost               |
| Quantity purchased        |
| Payment terms             |
| Delivery lead time        |
| Expiry supplied           |
| Branch/warehouse          |
| Buyer                     |
| PO/GRN/invoice references |

### Price comparison report

| Product                | Supplier A | Supplier B | Supplier C | Last buy | Best current |
| ---------------------- | ---------: | ---------: | ---------: | -------: | -----------: |
| Amoxicillin 500mg caps |        300 |        285 |        310 |      295 |          285 |
| Paracetamol 500mg tabs |        120 |        118 |        125 |      121 |          118 |

### Price rules

| Rule                                     | System behaviour     |
| ---------------------------------------- | -------------------- |
| Supplier price increases above threshold | Alert procurement    |
| New purchase price above selling price   | Alert margin risk    |
| Supplier gives shorter expiry than usual | Warn                 |
| Supplier consistently late               | Lower supplier score |
| Supplier price low but quality issues    | Flag supplier risk   |
| High-margin item suddenly low margin     | Alert owner          |

---

## L. Dead stock report

Dead stock locks working capital and increases expiry risk.

### Dead stock definition

Configurable examples:

| Type               | Definition                                       |
| ------------------ | ------------------------------------------------ |
| No movement        | No sale/dispense in 90/180 days                  |
| Slow movement      | Stock cover above 6 months                       |
| Overstock          | Quantity above maximum level                     |
| Expiry risk        | Cannot clear before expiry at current sales rate |
| Wrong branch stock | Moves in one branch but dead in another          |
| Obsolete item      | Product discontinued/replaced                    |

### Dead stock report fields

| Field                     |
| ------------------------- |
| Branch                    |
| Product                   |
| Batch                     |
| Expiry                    |
| Quantity on hand          |
| Cost value                |
| Last sale/dispense date   |
| Days since last movement  |
| Average monthly usage     |
| Months of stock cover     |
| Supplier                  |
| Suggested action          |
| Potential write-off value |

### Suggested actions

| Situation                           | Action                        |
| ----------------------------------- | ----------------------------- |
| Dead in branch but active elsewhere | Transfer                      |
| Supplier accepts returns            | Supplier return               |
| Near expiry                         | Controlled clearance/transfer |
| Obsolete                            | Stop reorder and write down   |
| Incorrect product master            | Merge/fix product data        |
| High-value dead stock               | Owner review                  |

---

## M. Cold-chain flag

Cold-chain items require stricter storage and transport controls. Kenya’s Transportation of Pharmaceuticals Rules define cold chain as maintaining products within 2°C to 8°C or manufacturer-recommended storage conditions from manufacture until administration. They also require cold-chain transport systems with monitoring, recording, and alarm/alert capability for relevant vehicles. ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2022/97/eng%402022-12-31))

### Cold-chain product fields

| Field                          |           Required? |
| ------------------------------ | ------------------: |
| Cold-chain required            |              Yes/no |
| Temperature range minimum      |   Yes if cold-chain |
| Temperature range maximum      |   Yes if cold-chain |
| Manufacturer storage condition |         Recommended |
| Fridge/freezer location        | Required if stocked |
| Excursion allowed?             |        Configurable |
| Excursion review required      |                 Yes |
| Sensor/device ID               |         Recommended |
| Temperature log required       |                 Yes |
| Transport packaging required   |                 Yes |
| Stability notes                |            Optional |

### Cold-chain workflows

| Workflow              | Control                                             |
| --------------------- | --------------------------------------------------- |
| Receiving             | Record temperature at receipt                       |
| Storage               | Link stock to fridge/location                       |
| Transfer              | Require cold-chain packaging and temperature record |
| Dispensing            | Warn if item must remain refrigerated               |
| Temperature excursion | Auto-quarantine affected stock                      |
| Power outage          | Record incident and affected fridge                 |
| Disposal/release      | Pharmacist/superintendent decision                  |

### Temperature log fields

| Field                 |
| --------------------- |
| Branch                |
| Storage unit/fridge   |
| Date/time             |
| Temperature           |
| Recorded by or device |
| Status                |
| Alarm triggered       |
| Corrective action     |
| Affected stock        |
| Reviewed by           |

### Cold-chain rules

| Rule                       | System behaviour                     |
| -------------------------- | ------------------------------------ |
| Cold-chain item received   | Require temperature check            |
| Temperature outside range  | Quarantine stock                     |
| Fridge alarm               | Create incident                      |
| Power outage               | Prompt affected stock review         |
| Transfer cold-chain item   | Require cold-chain transport details |
| Dispensing cold-chain item | Print storage warning                |
| Temperature log missing    | Compliance warning                   |

---

# 6. Required screens

## Screen 1: Inventory dashboard

The owner/manager should see stock health immediately.

Cards:

```text
Stock value
Low-stock items
Out-of-stock items
Near-expiry value
Expired stock value
Dead stock value
Quarantined stock
Open purchase orders
Pending GRNs
Unmatched supplier invoices
Inter-branch transfers in transit
Stock adjustment requests
Cold-chain incidents
```

---

## Screen 2: Product master

A strong inventory module depends on a strong product master.

### Product master sections

| Section        | Contents                                                 |
| -------------- | -------------------------------------------------------- |
| Identity       | Brand, generic, SKU, barcode, GTIN                       |
| Classification | Medicine, retail, lab consumable, procedure consumable   |
| Regulatory     | PPB registration, prescription category, controlled flag |
| Pack/unit      | Pack size, unit conversion                               |
| Tax            | Tax code/eTIMS item mapping                              |
| Stock control  | Batch, expiry, serial, FEFO                              |
| Storage        | Room temp, cold-chain, controlled cabinet                |
| Pricing        | Cost, retail price, price lists                          |
| Reorder        | Min/max/reorder point                                    |
| Supplier       | Approved suppliers                                       |
| Status         | Active, discontinued, blocked                            |

---

## Screen 3: Purchase order screen

Sections:

| Section           | Contents                                   |
| ----------------- | ------------------------------------------ |
| Supplier          | Supplier, payment terms, lead time         |
| Destination       | Branch/warehouse                           |
| Suggested reorder | Items below reorder level                  |
| Order lines       | Item, quantity, unit cost, expected expiry |
| Price history     | Last purchase prices                       |
| Approval          | Requested by, approved by                  |
| Attachments       | Quotation/proforma                         |
| Status            | Draft, approved, sent, received            |

---

## Screen 4: Goods received screen

Sections:

| Section             | Contents                                   |
| ------------------- | ------------------------------------------ |
| Supplier and PO     | PO/delivery note                           |
| Receiving checklist | Delivery condition, temperature, documents |
| Product lines       | Quantity, batch, expiry, accepted/rejected |
| Variances           | Short, excess, wrong item                  |
| Quarantine          | Damaged/suspect/cold-chain issue           |
| Cost update         | Actual cost/landed cost                    |
| Approval            | Receiver/checker/pharmacist                |

---

## Screen 5: Supplier invoice matching

Shows:

```text
PO quantity and cost
GRN quantity accepted
Supplier invoice quantity and cost
Variance
Approval/dispute status
```

Actions:

| Action             |
| ------------------ |
| Match invoice      |
| Flag dispute       |
| Approve payable    |
| Post to accounting |
| Link credit note   |
| Upload invoice     |

---

## Screen 6: Stock count screen

Modes:

| Mode                      |
| ------------------------- |
| Full count                |
| Cycle count               |
| Blind count               |
| Controlled medicine count |
| Cold-chain count          |
| Batch-specific count      |

Must support mobile/tablet scanning for shelves.

---

## Screen 7: Stock adjustment screen

Sections:

| Section               | Contents                         |
| --------------------- | -------------------------------- |
| Product/batch         | Item being adjusted              |
| Current balance       | System quantity                  |
| New/adjusted quantity | Proposed adjustment              |
| Reason                | Loss, damage, expiry, correction |
| Evidence              | Photo/document                   |
| Financial impact      | Cost value                       |
| Approval              | Manager/owner/superintendent     |
| Audit                 | History                          |

---

## Screen 8: Transfer screen

Sections:

| Section     | Contents                                  |
| ----------- | ----------------------------------------- |
| Origin      | Sending branch                            |
| Destination | Receiving branch                          |
| Items       | Product, batch, expiry, quantity          |
| Approval    | Origin and destination approvals          |
| Dispatch    | Picked, packed, sent                      |
| Transport   | Courier/driver, temperature if cold-chain |
| Receipt     | Quantity received, damaged, missing       |
| Variance    | Investigation if mismatch                 |

---

## Screen 9: Quarantine screen

Sections:

| Section           | Contents                            |
| ----------------- | ----------------------------------- |
| Quarantined stock | Product, batch, quantity            |
| Reason            | Expiry, recall, damage, cold-chain  |
| Evidence          | Photos/documents                    |
| Decision workflow | Release, return, destroy, write-off |
| Approval          | Pharmacist/superintendent/manager   |
| Status            | Open, under review, closed          |

---

## Screen 10: Expiry and dead stock screen

Filters:

| Filter              |
| ------------------- |
| Branch              |
| Product category    |
| Supplier            |
| Expiry window       |
| Stock value         |
| Last movement date  |
| Batch               |
| Storage condition   |
| Dead/slow/overstock |

Actions:

| Action             |
| ------------------ |
| Transfer           |
| Supplier return    |
| Discount request   |
| Quarantine         |
| Write-off request  |
| Stop reorder       |
| Notify procurement |

---

## Screen 11: Cold-chain screen

Sections:

| Section              | Contents                            |
| -------------------- | ----------------------------------- |
| Cold-chain products  | Stock requiring temperature control |
| Storage units        | Fridges/freezers                    |
| Temperature logs     | Manual or device-based              |
| Incidents            | Excursions/power outage             |
| Affected batches     | Stock linked to incident            |
| Quarantine decisions | Release/write-off/return            |
| Reports              | Compliance log                      |

---

# 7. Workflows

## A. Normal procurement workflow

```text
1. System identifies low-stock items
2. Procurement creates purchase order
3. Manager/owner approves PO
4. PO is sent to approved supplier
5. Supplier delivers goods
6. Storekeeper creates GRN
7. Batch and expiry are captured
8. Damaged/short/near-expiry items are rejected or quarantined
9. Accepted stock becomes available
10. Supplier invoice is matched to PO and GRN
11. Accountant approves payable
12. Supplier price history updates
```

---

## B. Direct purchase without PO

Some small businesses buy urgently without formal PO. The system may allow it, but with controls.

```text
1. Authorized user creates direct GRN
2. Supplier and invoice are captured
3. Reason for no PO is required
4. Batch/expiry captured
5. Manager approval required
6. Stock becomes available after approval
7. Purchase appears in no-PO procurement report
```

Rule:

```text
Direct GRN should be allowed for operational reality, but reported as an exception.
```

---

## C. Medicine receiving workflow

```text
1. Supplier delivers medicines
2. Receiver selects PO or creates authorized direct GRN
3. Product, quantity, batch, expiry, and supplier are captured
4. System checks expiry threshold and product status
5. Cold-chain products require temperature record
6. Controlled medicines require stricter approval
7. Accepted stock is posted by batch
8. Rejected/suspect stock is quarantined
9. Supplier invoice is matched later
```

---

## D. Stock count workflow

```text
1. Manager creates count session
2. Count scope is selected: full, category, batch, controlled, cold-chain
3. System freezes or flags selected stock
4. Staff count physical stock
5. Variances are calculated
6. Recount is requested if needed
7. Manager/superintendent approves variances
8. System posts stock adjustments
9. Variance report is stored for audit
```

---

## E. Near-expiry management workflow

```text
1. System runs expiry report daily
2. Items within threshold are flagged
3. Manager reviews quantity, movement, and value
4. Suggested action is generated
5. Action is selected: sell FEFO, transfer, return, quarantine, write-off
6. Action is approved
7. Stock movement or status change is posted
8. Report tracks financial loss avoided or incurred
```

---

## F. Inter-branch transfer workflow

```text
1. Destination branch requests stock
2. Origin branch checks availability by batch/expiry
3. Manager approves transfer
4. Origin picks and dispatches stock
5. Stock becomes in-transit
6. Destination receives and verifies quantity/batch/expiry
7. Any variance is recorded
8. Accepted stock becomes available at destination
9. Transfer is closed
```

---

## G. Quarantine workflow

```text
1. Staff identifies suspect stock
2. Stock is moved to quarantine status
3. Reason and evidence are recorded
4. Pharmacist/superintendent reviews
5. Decision is made: release, return to supplier, destroy, write off
6. Approved action posts stock movement/status update
7. Audit trail remains permanently
```

---

## H. Recall workflow

```text
1. Recall notice is received from supplier/regulator/internal quality review
2. User searches affected product and batch
3. System blocks sale/dispensing of affected batch
4. Current stock is moved to quarantine
5. System identifies branches holding the batch
6. System identifies patients/customers supplied from the batch
7. Recall tasks are assigned
8. Supplier return/disposal is recorded
9. Recall report is exported
```

---

## I. Cold-chain incident workflow

```text
1. Temperature log or staff records fridge excursion
2. System identifies affected products and batches
3. Affected stock is auto-quarantined
4. Pharmacist/superintendent reviews stability/incident details
5. Decision is made: release, keep quarantined, return, destroy
6. Decision and evidence are stored
7. Incident report is generated
```

---

# 8. Rules engine

## Purchase order approval

```text
RULE: PO approval required
IF purchase_order.total_value > user.approval_limit
OR item.controlled = true
OR supplier.status != approved
OR item.cold_chain = true
THEN require manager/pharmacist/superintendent approval
ELSE allow PO approval
```

## Goods receiving

```text
RULE: Medicine receiving
IF item.category = medicine
THEN batch_number is required
AND expiry_date is required
AND supplier is required
AND expired items are rejected or quarantined
```

## Stock availability

```text
RULE: Sellable stock
IF stock.status = sellable
AND quantity_available > 0
AND expiry_date > today
AND recall_status != recalled
AND quarantine_status != quarantined
THEN stock may be sold/dispensed
ELSE block
```

## FEFO picking

```text
RULE: FEFO selection
IF item.batch_controlled = true
THEN recommend earliest expiry batch first
AND require reason if user selects later-expiring batch
```

## Stock adjustment

```text
RULE: Adjustment approval
IF adjustment.quantity_value > threshold
OR item.controlled = true
OR reason in [loss, theft, expiry, cold_chain_excursion]
THEN approval is required before posting
```

## Inter-branch transfer

```text
RULE: Transfer medicine
IF item.category = medicine
AND destination_branch.pharmacy_permission = active
AND batch_number exists
AND expiry_date exists
THEN allow transfer approval
ELSE block
```

## Quarantine

```text
RULE: Quarantine stock
IF stock.status = quarantined
THEN stock cannot be sold, dispensed, transferred normally, or used in claims
```

## Cold-chain

```text
RULE: Cold-chain receipt
IF item.cold_chain = true
THEN temperature_at_receipt is required
AND if temperature outside allowed range
THEN stock status = quarantined
```

## Reorder

```text
RULE: Reorder suggestion
IF available_stock + on_order_stock - reserved_stock <= reorder_point
AND item.status = active
AND item.dead_stock_flag = false
THEN add to reorder list
```

## Dead stock

```text
RULE: Dead stock
IF days_since_last_sale > configured_dead_stock_days
OR months_of_stock_cover > configured_max_cover
THEN flag as dead_or_slow_moving
```

---

# 9. Data model

## Main tables

### `products`

| Field                 |
| --------------------- |
| id                    |
| sku                   |
| barcode               |
| gtin                  |
| brand_name            |
| generic_name          |
| description           |
| category              |
| dosage_form           |
| strength              |
| pack_size             |
| unit_of_measure       |
| prescription_required |
| controlled_flag       |
| batch_controlled      |
| expiry_controlled     |
| cold_chain_required   |
| storage_condition     |
| tax_code_id           |
| status                |
| created_at            |

### `suppliers`

| Field              |
| ------------------ |
| id                 |
| supplier_name      |
| supplier_type      |
| kra_pin            |
| ppb_licence_number |
| contact_person     |
| phone              |
| email              |
| address            |
| payment_terms      |
| lead_time_days     |
| status             |
| last_verified_at   |
| notes              |

### `supplier_products`

| Field                   |
| ----------------------- |
| id                      |
| supplier_id             |
| product_id              |
| supplier_product_code   |
| last_purchase_price     |
| last_purchase_date      |
| minimum_order_quantity  |
| usual_lead_time_days    |
| preferred_supplier_flag |
| status                  |

### `purchase_orders`

| Field                  |
| ---------------------- |
| id                     |
| po_number              |
| organisation_id        |
| branch_id              |
| supplier_id            |
| order_date             |
| expected_delivery_date |
| status                 |
| requested_by           |
| approved_by            |
| approved_at            |
| currency               |
| subtotal               |
| tax_total              |
| discount_total         |
| total                  |
| notes                  |

### `purchase_order_lines`

| Field                |
| -------------------- |
| id                   |
| purchase_order_id    |
| product_id           |
| quantity_ordered     |
| unit_of_measure      |
| pack_size            |
| unit_cost            |
| discount_amount      |
| tax_amount           |
| line_total           |
| expected_expiry_date |
| status               |

### `goods_received_notes`

| Field                  |
| ---------------------- |
| id                     |
| grn_number             |
| purchase_order_id      |
| supplier_id            |
| branch_id              |
| delivery_note_number   |
| received_at            |
| received_by            |
| checked_by             |
| status                 |
| temperature_at_receipt |
| notes                  |
| document_id            |

### `goods_received_lines`

| Field               |
| ------------------- |
| id                  |
| grn_id              |
| product_id          |
| quantity_ordered    |
| quantity_received   |
| quantity_accepted   |
| quantity_rejected   |
| unit_cost           |
| batch_number        |
| expiry_date         |
| manufacture_date    |
| storage_location_id |
| rejection_reason    |
| quarantine_flag     |
| cold_chain_status   |
| status              |

### `supplier_invoices`

| Field             |
| ----------------- |
| id                |
| supplier_id       |
| invoice_number    |
| invoice_date      |
| received_date     |
| purchase_order_id |
| grn_id            |
| currency          |
| subtotal          |
| tax_total         |
| discount_total    |
| freight_total     |
| total_payable     |
| due_date          |
| status            |
| document_id       |
| approved_by       |
| posted_at         |

### `stock_batches`

| Field                |
| -------------------- |
| id                   |
| product_id           |
| branch_id            |
| grn_line_id          |
| supplier_id          |
| batch_number         |
| expiry_date          |
| manufacture_date     |
| quantity_received    |
| quantity_available   |
| quantity_reserved    |
| quantity_quarantined |
| unit_cost            |
| landed_cost          |
| storage_location_id  |
| recall_status        |
| quality_status       |
| cold_chain_status    |
| created_at           |

### `stock_movements`

| Field           |
| --------------- |
| id              |
| movement_number |
| branch_id       |
| product_id      |
| batch_id        |
| movement_type   |
| quantity_in     |
| quantity_out    |
| balance_after   |
| reference_type  |
| reference_id    |
| unit_cost       |
| total_cost      |
| performed_by    |
| approved_by     |
| movement_at     |
| notes           |

### `stock_counts`

| Field        |
| ------------ |
| id           |
| count_number |
| branch_id    |
| count_type   |
| status       |
| started_by   |
| started_at   |
| completed_by |
| completed_at |
| approved_by  |
| approved_at  |
| notes        |

### `stock_count_lines`

| Field             |
| ----------------- |
| id                |
| stock_count_id    |
| product_id        |
| batch_id          |
| system_quantity   |
| counted_quantity  |
| variance_quantity |
| variance_value    |
| reason            |
| recount_required  |
| adjustment_posted |
| status            |

### `stock_adjustments`

| Field                |
| -------------------- |
| id                   |
| adjustment_number    |
| branch_id            |
| product_id           |
| batch_id             |
| adjustment_type      |
| quantity_before      |
| quantity_adjusted    |
| quantity_after       |
| reason               |
| evidence_document_id |
| requested_by         |
| approved_by          |
| approved_at          |
| status               |
| posted_at            |

### `stock_transfers`

| Field                 |
| --------------------- |
| id                    |
| transfer_number       |
| origin_branch_id      |
| destination_branch_id |
| requested_by          |
| approved_by           |
| dispatched_by         |
| received_by           |
| requested_at          |
| approved_at           |
| dispatched_at         |
| received_at           |
| status                |
| transport_reference   |
| cold_chain_required   |
| notes                 |

### `stock_transfer_lines`

| Field               |
| ------------------- |
| id                  |
| transfer_id         |
| product_id          |
| batch_id            |
| quantity_requested  |
| quantity_dispatched |
| quantity_received   |
| quantity_damaged    |
| quantity_missing    |
| status              |
| notes               |

### `quarantine_records`

| Field                |
| -------------------- |
| id                   |
| quarantine_number    |
| branch_id            |
| product_id           |
| batch_id             |
| quantity             |
| reason               |
| quarantined_by       |
| quarantined_at       |
| evidence_document_id |
| decision             |
| decision_by          |
| decision_at          |
| final_stock_action   |
| status               |
| notes                |

### `reorder_settings`

| Field                   |
| ----------------------- |
| id                      |
| branch_id               |
| product_id              |
| minimum_stock           |
| maximum_stock           |
| reorder_point           |
| reorder_quantity        |
| safety_stock            |
| average_daily_usage     |
| supplier_lead_time_days |
| preferred_supplier_id   |
| status                  |

### `temperature_logs`

| Field               |
| ------------------- |
| id                  |
| branch_id           |
| storage_location_id |
| device_id           |
| recorded_at         |
| temperature         |
| recorded_by         |
| status              |
| alarm_triggered     |
| corrective_action   |
| reviewed_by         |
| reviewed_at         |

### `supplier_price_history`

| Field               |
| ------------------- |
| id                  |
| supplier_id         |
| product_id          |
| purchase_order_id   |
| supplier_invoice_id |
| purchase_date       |
| unit_cost           |
| discount            |
| tax                 |
| landed_cost         |
| quantity            |
| expiry_supplied     |
| lead_time_days      |
| branch_id           |

---

# 10. API design

## Product and supplier endpoints

| Endpoint                            | Purpose                     |
| ----------------------------------- | --------------------------- |
| `POST /products`                    | Create product              |
| `GET /products/search`              | Search product master       |
| `PATCH /products/{id}`              | Update product              |
| `POST /suppliers`                   | Add supplier                |
| `POST /suppliers/{id}/products`     | Link supplier product       |
| `GET /suppliers/{id}/price-history` | View supplier price history |

## Purchase order endpoints

| Endpoint                             | Purpose               |
| ------------------------------------ | --------------------- |
| `POST /purchase-orders`              | Create PO             |
| `POST /purchase-orders/{id}/submit`  | Submit for approval   |
| `POST /purchase-orders/{id}/approve` | Approve PO            |
| `POST /purchase-orders/{id}/send`    | Mark sent to supplier |
| `POST /purchase-orders/{id}/cancel`  | Cancel PO             |
| `GET /purchase-orders/search`        | Search POs            |

## Receiving endpoints

| Endpoint                          | Purpose                |
| --------------------------------- | ---------------------- |
| `POST /grns`                      | Create GRN             |
| `POST /grns/{id}/lines`           | Add received line      |
| `POST /grns/{id}/approve`         | Approve received goods |
| `POST /grns/{id}/reject-line`     | Reject line            |
| `POST /grns/{id}/quarantine-line` | Quarantine line        |
| `GET /grns/search`                | Search GRNs            |

## Supplier invoice endpoints

| Endpoint                               | Purpose              |
| -------------------------------------- | -------------------- |
| `POST /supplier-invoices`              | Add supplier invoice |
| `POST /supplier-invoices/{id}/match`   | Match PO-GRN-invoice |
| `POST /supplier-invoices/{id}/approve` | Approve payable      |
| `POST /supplier-invoices/{id}/dispute` | Flag dispute         |

## Stock endpoints

| Endpoint                               | Purpose              |
| -------------------------------------- | -------------------- |
| `GET /stock/balances`                  | View stock balances  |
| `GET /stock/batches`                   | View batch stock     |
| `GET /stock/movements`                 | View stock ledger    |
| `POST /stock/adjustments`              | Request adjustment   |
| `POST /stock/adjustments/{id}/approve` | Approve adjustment   |
| `POST /stock/counts`                   | Create stock count   |
| `POST /stock/counts/{id}/post`         | Post count variances |
| `GET /stock/near-expiry`               | Near-expiry report   |
| `GET /stock/dead-stock`                | Dead stock report    |
| `GET /stock/reorder`                   | Reorder report       |

## Transfer endpoints

| Endpoint                              | Purpose           |
| ------------------------------------- | ----------------- |
| `POST /stock-transfers`               | Create transfer   |
| `POST /stock-transfers/{id}/approve`  | Approve transfer  |
| `POST /stock-transfers/{id}/dispatch` | Dispatch transfer |
| `POST /stock-transfers/{id}/receive`  | Receive transfer  |
| `POST /stock-transfers/{id}/variance` | Record variance   |

## Quarantine and recall endpoints

| Endpoint                                | Purpose                |
| --------------------------------------- | ---------------------- |
| `POST /quarantine`                      | Quarantine stock       |
| `POST /quarantine/{id}/release`         | Release stock          |
| `POST /quarantine/{id}/write-off`       | Write off stock        |
| `POST /quarantine/{id}/return-supplier` | Return to supplier     |
| `POST /recalls`                         | Create recall notice   |
| `GET /recalls/{id}/affected-stock`      | Find affected stock    |
| `GET /recalls/{id}/affected-patients`   | Find affected patients |

## Cold-chain endpoints

| Endpoint                                   | Purpose                               |
| ------------------------------------------ | ------------------------------------- |
| `POST /temperature-logs`                   | Add temperature reading               |
| `POST /cold-chain/incidents`               | Create excursion incident             |
| `GET /cold-chain/affected-stock`           | Identify affected stock               |
| `POST /cold-chain/incidents/{id}/decision` | Release/write-off/quarantine decision |

---

# 11. Integration points

| Integration                 | Purpose                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| Organisation/licensing      | Branch permissions, supplier compliance, warehouse/branch legality |
| POS/billing                 | Sale stock-out, returns, credit notes, eTIMS stock records         |
| Pharmacy dispensing         | Batch selection, controlled medicines, recalls                     |
| Clinic EMR                  | Consumable use, procedure stock, lab supplies                      |
| Lab module                  | Reagent and consumable stock                                       |
| Claims module               | Stock cost and medicine claim validation                           |
| Accounting                  | Supplier invoices, payables, COGS, stock valuation                 |
| eTIMS/KRA                   | Stock-in/stock-out alignment where required                        |
| PPB/PRIMS/product catalogue | Product registration and traceability readiness                    |
| Barcode/GS1 scanners        | Product, batch, serial, and transfer scanning                      |
| Notifications               | Low stock, expiry, quarantine, recall alerts                       |
| Cold-chain sensors          | Temperature logs and excursion alerts                              |

---

# 12. Permissions

| Permission               | Cashier | Storekeeper |        Pharmacist | Branch manager |  Procurement | Accountant |   Owner | Auditor |
| ------------------------ | ------: | ----------: | ----------------: | -------------: | -----------: | ---------: | ------: | ------: |
| View stock               | Limited |         Yes |               Yes |            Yes |          Yes |        Yes |     Yes |     Yes |
| Create PO                |      No |     Request |           Request |            Yes |          Yes |         No |     Yes |    View |
| Approve PO               |      No |          No |      Configurable |            Yes | Configurable |         No |     Yes |      No |
| Receive goods            |      No |         Yes |               Yes |            Yes |           No |         No |     Yes |    View |
| Approve medicine GRN     |      No |          No |               Yes |            Yes |           No |         No |     Yes |    View |
| Add supplier invoice     |      No |          No |                No |             No |           No |        Yes |     Yes |    View |
| Approve supplier invoice |      No |          No |                No |             No |           No |        Yes |     Yes |    View |
| Adjust stock             |      No |     Request |           Request |        Approve |           No |         No | Approve |    View |
| Count stock              |      No |         Yes |               Yes |            Yes |           No |         No |     Yes |    View |
| Post count variance      |      No |          No |                No |            Yes |           No |         No |     Yes |    View |
| Transfer stock           |      No |     Prepare | Approve medicines |            Yes |          Yes |         No |     Yes |    View |
| Quarantine stock         |      No |     Request |               Yes |            Yes |           No |         No |     Yes |    View |
| Release quarantine       |      No |          No |               Yes |   Configurable |           No |         No |     Yes |    View |
| Write off stock          |      No |          No |           Request |        Approve |           No |     Review |     Yes |    View |
| View cost prices         |      No |     Limited |           Limited |            Yes |          Yes |        Yes |     Yes |     Yes |
| Export reports           |      No |          No |           Limited |            Yes |          Yes |        Yes |     Yes |     Yes |

---

# 13. Reports

## Inventory control reports

| Report                       | Purpose                              |
| ---------------------------- | ------------------------------------ |
| Stock balance report         | Current stock by branch/product      |
| Batch stock report           | Stock by batch and expiry            |
| Stock movement ledger        | Every stock in/out/status change     |
| Low-stock report             | Reorder planning                     |
| Out-of-stock report          | Urgent procurement                   |
| Reorder report               | Suggested purchase quantities        |
| Near-expiry report           | Expiry loss prevention               |
| Expired stock report         | Write-off/quarantine                 |
| Dead stock report            | Working capital control              |
| Overstock report             | Avoid excess buying                  |
| Stock count variance report  | Shrinkage/theft/data errors          |
| Stock adjustment report      | Fraud and governance                 |
| Quarantine report            | Suspect/recalled/expired stock       |
| Recall report                | Affected stock and patients          |
| Supplier price history       | Procurement and margin control       |
| Supplier performance report  | Price, lead time, rejection rates    |
| GRN variance report          | Short/excess/wrong deliveries        |
| PO status report             | Open/partial/closed orders           |
| Unmatched supplier invoices  | Accounting control                   |
| Inter-branch transfer report | In-transit and branch stock movement |
| Cold-chain incident report   | Temperature breach control           |
| Gross margin by batch        | Detect cost/price problems           |

## Owner dashboard cards

```text
Total stock value
Stock value by branch
Low-stock fast movers
Out-of-stock critical items
Near-expiry value
Expired stock value
Dead stock value
Stock adjustment value
Stock count variance
Quarantined stock
Supplier price increases
Open POs
Pending GRNs
Transfers in transit
Cold-chain incidents
```

---

# 14. Stock valuation

The system should support multiple valuation methods, but for small Kenyan pharmacy/clinic operations, **weighted average cost** is usually practical. Larger businesses may prefer FIFO.

| Method                | Use                                                         |
| --------------------- | ----------------------------------------------------------- |
| Weighted average cost | Simple and practical for small/mid-size businesses          |
| FIFO                  | Useful where accounting requires first-in-first-out costing |
| Batch actual cost     | Best for medicine batch-level margin                        |
| Landed cost           | Useful for imports or central procurement                   |

Recommended design:

```text
Operational stock picking: FEFO
Accounting valuation: weighted average or batch actual cost
```

This means the system can sell the batch expiring first while still valuing stock correctly.

---

# 15. Product categories and control levels

Not all stock needs the same strictness.

| Category                    | Control level                                  |
| --------------------------- | ---------------------------------------------- |
| Retail goods                | Basic stock, barcode, price                    |
| OTC medicines               | Batch/expiry recommended or required by policy |
| Prescription medicines      | Batch/expiry mandatory                         |
| Controlled medicines        | Batch/expiry + controlled register             |
| Vaccines/insulin/cold-chain | Batch/expiry + temperature logs                |
| Lab reagents                | Batch/expiry + storage condition               |
| Medical devices             | Serial/batch where applicable                  |
| Consumables                 | Stock and expiry where applicable              |
| Cosmetics/supplements       | Expiry where applicable                        |
| Office/admin items          | Simple stock optional                          |

---

# 16. Audit logs

Every stock-sensitive action must be logged.

| Event                    | Logged data                       |
| ------------------------ | --------------------------------- |
| Product created/edited   | Old/new values, user              |
| Supplier created/edited  | Old/new values, user              |
| PO created               | User, branch, supplier            |
| PO approved              | Approver, time                    |
| GRN created              | Receiver, supplier, delivery note |
| Batch added              | Batch, expiry, quantity           |
| Supplier invoice matched | Accountant, variances             |
| Stock sold               | Sale, batch, user                 |
| Stock dispensed          | Patient, batch, pharmacist        |
| Stock adjusted           | Reason, approver                  |
| Stock counted            | Counter, variance                 |
| Transfer dispatched      | Origin, destination, batch        |
| Transfer received        | Quantity received, variance       |
| Quarantine created       | Reason, evidence                  |
| Quarantine released      | Approver, reason                  |
| Recall action            | Affected batch, action            |
| Cold-chain incident      | Temperature, affected stock       |
| Report exported          | User, date, report type           |

---

# 17. Edge cases

| Edge case                          | Correct handling                                                        |
| ---------------------------------- | ----------------------------------------------------------------------- |
| Supplier delivers without PO       | Direct GRN with reason and approval                                     |
| Supplier delivers short quantity   | Partial GRN; PO remains open                                            |
| Supplier delivers excess quantity  | Require approval before acceptance                                      |
| Supplier invoice differs from GRN  | Flag invoice dispute                                                    |
| Medicine received without expiry   | Reject or quarantine                                                    |
| Medicine batch duplicated          | Merge only if same product, supplier, batch, expiry, cost policy allows |
| Wrong batch selected at dispensing | Correct through reversal/adjustment, not silent edit                    |
| Item sold while count in progress  | Warn or freeze item depending policy                                    |
| Stock goes negative                | Block by default; allow only controlled admin correction                |
| Returned medicine                  | Quarantine by default                                                   |
| Expired item found on shelf        | Block, quarantine, investigate                                          |
| Cold-chain fridge fails overnight  | Quarantine affected stock and create incident                           |
| Transfer lost in transit           | Variance investigation and adjustment approval                          |
| Branch closes                      | Produce stock report and transfer/closure records                       |
| Supplier recall issued             | Block batch across all branches                                         |
| Same product created twice         | Product merge workflow with audit                                       |
| Unit conversion error              | Correction workflow with approval                                       |
| Stock adjustment abuse             | Suspicious adjustment report                                            |

---

# 18. MVP versus later versions

## MVP

Build these first:

| Feature                     | Reason                               |
| --------------------------- | ------------------------------------ |
| Product master              | Foundation                           |
| Supplier master             | Procurement accountability           |
| Purchase orders             | Buying discipline                    |
| Goods received notes        | Stock-in control                     |
| Supplier invoices           | Cost and payables                    |
| Batch and expiry            | Critical for medicines               |
| Stock balances              | Day-to-day operations                |
| Stock movement ledger       | Audit                                |
| POS stock-out integration   | Accurate inventory                   |
| Dispensing batch selection  | Pharmacy compliance                  |
| Stock count                 | Theft/shrinkage/data quality         |
| Stock adjustment approval   | Fraud control                        |
| Near-expiry report          | Reduce losses                        |
| Reorder levels              | Avoid stockouts                      |
| Basic inter-branch transfer | Chains/groups                        |
| Quarantine stock            | Recalled/suspect/expired stock       |
| Supplier price history      | Margin control                       |
| Dead stock report           | Working capital control              |
| Basic cold-chain flag       | Identify temperature-sensitive stock |

## Version 2

Add:

| Feature                                  | Reason                          |
| ---------------------------------------- | ------------------------------- |
| Barcode receiving                        | Faster GRNs                     |
| Mobile stock count                       | Shelf scanning                  |
| Advanced reorder forecasting             | Better buying                   |
| Supplier scorecards                      | Better supplier selection       |
| Landed cost allocation                   | Better costing                  |
| Product merge tools                      | Clean product master            |
| Recall workflow                          | Patient and branch traceability |
| Cold-chain temperature logs              | Compliance and quality          |
| Transfer variance workflow               | Chain control                   |
| Controlled medicine stock reconciliation | High-risk compliance            |
| Warehouse replenishment                  | Multi-branch scaling            |
| Purchase approval limits                 | Governance                      |
| Supplier return workflow                 | Recover value                   |

## Version 3

Add:

| Feature                                 | Reason                            |
| --------------------------------------- | --------------------------------- |
| GS1/DataMatrix scanning                 | Traceability                      |
| Unit-level serialization                | Future PPB traceability alignment |
| IoT fridge integration                  | Automated cold-chain monitoring   |
| AI demand forecasting                   | Smarter procurement               |
| Automated supplier quotation comparison | Procurement efficiency            |
| Full ERP/accounting integration         | Finance maturity                  |
| Vendor-managed inventory                | Chain/pharma partnerships         |
| National product catalogue integration  | Product verification              |
| Automated recall alerts                 | Patient safety                    |
| Advanced shrinkage analytics            | Fraud detection                   |

---

# 19. Acceptance criteria

The module is ready when it passes these tests:

| Test                     | Expected result                                                     |
| ------------------------ | ------------------------------------------------------------------- |
| Create PO                | PO captures supplier, branch, items, quantities, cost, approval     |
| Receive goods            | GRN records actual quantity, batch, expiry, accepted/rejected stock |
| Medicine without expiry  | System blocks or quarantines receiving                              |
| Supplier invoice match   | System compares PO, GRN, and invoice                                |
| Sell item                | POS reduces correct stock                                           |
| Dispense medicine        | Pharmacy module selects exact batch and expiry                      |
| Stock count              | Variance is calculated and approval required                        |
| Stock adjustment         | Adjustment cannot post without required approval                    |
| Near-expiry report       | Items nearing expiry appear with value and suggested action         |
| Reorder report           | Low-stock items appear with suggested quantity                      |
| Transfer stock           | Origin, in-transit, and destination balances update correctly       |
| Quarantine stock         | Quarantined stock cannot be sold or dispensed                       |
| Supplier price history   | Last and historical purchase prices are visible                     |
| Dead stock report        | Slow/non-moving items and value are visible                         |
| Cold-chain item received | System requires temperature/storage check                           |
| Recall lookup            | System finds all stock and patients/customers linked to a batch     |
| Audit trail              | Every stock movement, approval, and adjustment is traceable         |

---

# 20. Final product behaviour

The Inventory and Procurement Module should behave like this:

| Situation                   | Correct behaviour                                         |
| --------------------------- | --------------------------------------------------------- |
| Stock is ordered            | PO controls supplier, quantity, price, approval           |
| Stock arrives               | GRN captures actual quantity, batch, expiry, condition    |
| Supplier bills              | Invoice is matched to PO and GRN                          |
| Medicine is received        | Batch and expiry are mandatory                            |
| Medicine is sold/dispensed  | Correct batch is issued and stock reduces                 |
| Stock is missing            | Count variance and approved adjustment required           |
| Stock is near expiry        | Alert, transfer, supplier return, or controlled clearance |
| Stock is dead               | Report working capital trapped                            |
| Branch needs stock          | Reorder or inter-branch transfer suggested                |
| Stock is suspect            | Quarantine blocks sale/dispense                           |
| Batch is recalled           | Block batch and find affected patients/branches           |
| Supplier price changes      | Margin warning and price history update                   |
| Cold-chain item is affected | Temperature incident and quarantine workflow              |

The key design principle is:

**No medicine stock should enter, move, sell, dispense, return, or disappear without a batch, expiry, source, status, value, and audit trail.**

# Module 4 Gap Closure: Inventory, Procurement and Traceability — Developer Handoff Addendum

## Updated handoff status

| Area                      |                               Previous status |                                                                                                        After this closure |
| ------------------------- | --------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------: |
| Completeness              |                                          High |                                                                                                             **Very high** |
| Developer readiness       |                                   Medium-high |                                                                                                                  **High** |
| Accuracy confidence       |                                          Good |                                                                       **Good, with configurable implementation policies** |
| Biggest previous gap      |            Product master and unit conversion |                                                                                                                **Closed** |
| Developer start readiness | Database design and service logic could begin | **Developers can now implement product master, UOM, costing, stock ledger, returns, write-offs, and traceability phases** |

The updated implementation principle is:

```text
Inventory must not be built around “product name + quantity”.
It must be built around product identity, pack structure, unit conversion, stock lot, batch, expiry, cost layer, storage condition, stock status, movement reason, and audit trail.
```

PPB’s Good Storage and Distribution Practices guidance says pharmaceuticals require specialized handling to maintain quality throughout the distribution chain and avoid exposing the public to unsafe medicines. PPB’s authentication and traceability standards also treat traceability as important for patient safety, protection from falsified or substandard health products, and near-real-time supply-chain visibility. KRA’s Electronic Tax Invoice Regulations require applicable users to maintain stock-in and stock-out records, including local purchases and imports. ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/guidelines-for-good-storage-and-distribution-practices-for-health-products-and-technologies-in-kenya/)) ([web.pharmacyboardkenya.org](https://web.pharmacyboardkenya.org/download/standards-for-authentication-and-traceability-of-health-products-and-technologies/)) ([new.kenyalaw.org](https://new.kenyalaw.org/akn/ke/act/ln/2024/64/eng@2024-03-28))

---

# 1. Final developer decisions

| Gap                                  | Final decision                                                                                                                                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit conversion rules                | Use a **base-unit + pack-level conversion model**. Every stock item has a base stock unit, purchase unit, sale unit, and optional dispensing unit. All conversions must be exact, approved, auditable, and product-specific.             |
| Product master normalization         | Use a layered model: `product_family → product_variant/SKU → medicine_profile → packaging_levels → identifiers → inventory_control_profile → stock_lots`.                                                                                |
| Costing policy                       | Use **batch/lot actual cost for batch-controlled health products**, **weighted average cost for non-batch retail/consumables**, and **standard cost for services/procedures** where needed. FEFO controls physical picking, not costing. |
| Serialization/GS1 phase decision     | MVP must be **GS1-ready but not serialization-dependent**. Phase 1 captures GTIN, batch, expiry. Phase 2 parses GS1 DataMatrix. Phase 3 adds unit-level serials. Phase 4 adds regulator/traceability-event integration.                  |
| Supplier return/write-off accounting | Add full accounting event rules for supplier returns, purchase credit notes, expiry write-offs, damage, quarantine release, recall, and disposal.                                                                                        |
| Stock ledger                         | All stock changes must post to an immutable `stock_movements` ledger. No direct quantity edits.                                                                                                                                          |
| Batch merge policy                   | Do not merge lots with different supplier, GRN, cost, expiry, or quality status. Same manufacturer batch can still exist as multiple internal stock lots.                                                                                |
| Negative stock policy                | Block by default. Allow only controlled admin correction during migration or approved exceptional workflow.                                                                                                                              |
| Product master governance            | Product creation, medicine classification, unit conversion, tax mapping, and controlled/cold-chain flags require approval before active sale/dispensing.                                                                                 |

---

# 2. Final normalized product master

## 2.1 Product master hierarchy

Use this hierarchy:

```text
product_family
    └── product_variant / SKU
            ├── medicine_profile, if medicine
            ├── inventory_control_profile
            ├── packaging_levels
            ├── unit_conversions
            ├── identifiers / barcodes / GTIN
            ├── supplier_items
            ├── tax profile
            └── stock_lots
```

## 2.2 Example

```text
Product family:
  Amoxicillin

Product variant / SKU:
  Amoxicillin 500mg capsules, pack of 100

Medicine profile:
  Generic: Amoxicillin
  Strength: 500mg
  Dosage form: Capsule
  Route: Oral
  Regulatory class: POM

Packaging:
  1 carton = 10 packs
  1 pack = 10 strips
  1 strip = 10 capsules
  1 capsule = base unit

Stock lot:
  Supplier: XYZ Pharma
  GRN: GRN-00123
  Batch: AMX2401
  Expiry: 2027-06-30
  Quantity: 5,000 capsules
  Unit cost: KES 4.20 per capsule
```

---

# 3. Product master tables

## 3.1 `product_families`

Represents the broad product concept.

| Field               |    Required | Example                                  |
| ------------------- | ----------: | ---------------------------------------- |
| `id`                |         Yes |                                          |
| `family_code`       |         Yes | `AMOXICILLIN`                            |
| `family_name`       |         Yes | Amoxicillin                              |
| `category`          |         Yes | Medicine, retail, lab consumable, device |
| `generic_name`      | Conditional | Amoxicillin                              |
| `therapeutic_class` |    Optional | Antibiotic                               |
| `active_status`     |         Yes | Active/inactive                          |
| `created_at`        |         Yes |                                          |

## 3.2 `products`

Represents a sellable/stockable SKU.

| Field                          |    Required | Example                               |
| ------------------------------ | ----------: | ------------------------------------- |
| `id`                           |         Yes |                                       |
| `product_family_id`            |         Yes |                                       |
| `sku`                          |         Yes | `AMOX500-CAP-100`                     |
| `display_name`                 |         Yes | Amoxicillin 500mg Capsules 100s       |
| `brand_name`                   |    Optional |                                       |
| `generic_name`                 | Conditional | Amoxicillin                           |
| `strength`                     | Conditional | 500mg                                 |
| `dosage_form`                  | Conditional | Capsule                               |
| `route`                        | Conditional | Oral                                  |
| `pack_description`             |         Yes | Pack of 100 capsules                  |
| `product_type`                 |         Yes | medicine, retail_item, lab_consumable |
| `base_unit_id`                 |         Yes | Capsule                               |
| `default_purchase_unit_id`     |         Yes | Pack                                  |
| `default_sale_unit_id`         |         Yes | Strip or capsule                      |
| `default_dispense_unit_id`     | Conditional | Capsule                               |
| `tax_code_id`                  |         Yes | VAT/exempt/non-VAT                    |
| `inventory_control_profile_id` |         Yes |                                       |
| `medicine_profile_id`          | Conditional |                                       |
| `status`                       |         Yes | draft, active, blocked, discontinued  |
| `created_by`                   |         Yes |                                       |
| `created_at`                   |         Yes |                                       |

## 3.3 `medicine_profiles`

Only for medicine/health-product SKUs.

| Field                            |                                     Required |
| -------------------------------- | -------------------------------------------: |
| `id`                             |                                          Yes |
| `product_id`                     |                                          Yes |
| `ppb_registration_number`        |                                  Recommended |
| `marketing_authorisation_status` |                                  Recommended |
| `regulatory_sale_class`          |                Yes: POM, P, OTC, GS, unknown |
| `controlled_substance_class`     | Yes: none, narcotic, psychotropic, precursor |
| `active_ingredients_json`        |                                          Yes |
| `atc_code`                       |                                     Optional |
| `keml_flag`                      |                                     Optional |
| `aware_class`                    |                                     Optional |
| `prescription_required`          |                                          Yes |
| `pharmacist_review_required`     |                                          Yes |
| `cold_chain_required`            |                                       Yes/no |
| `high_alert_flag`                |                                       Yes/no |
| `lasa_flag`                      |                                       Yes/no |
| `paediatric_weight_required`     |                                       Yes/no |
| `pregnancy_caution`              |                                       Yes/no |
| `breastfeeding_caution`          |                                       Yes/no |

## 3.4 `inventory_control_profiles`

| Field                           | Required | Notes                                    |
| ------------------------------- | -------: | ---------------------------------------- |
| `id`                            |      Yes |                                          |
| `product_id`                    |      Yes |                                          |
| `stock_tracked`                 |      Yes | False for non-stock service              |
| `batch_controlled`              |      Yes | Mandatory for medicines                  |
| `expiry_controlled`             |      Yes | Mandatory for medicines                  |
| `serial_controlled`             |      Yes | GS1/unit serialization                   |
| `cold_chain_required`           |      Yes | Vaccines, insulin, reagents              |
| `fefo_required`                 |      Yes | Medicines                                |
| `negative_stock_allowed`        |      Yes | Default false                            |
| `return_to_quarantine_required` |      Yes | Default true for medicines               |
| `reorder_enabled`               |      Yes |                                          |
| `stock_count_required`          |      Yes |                                          |
| `costing_method`                |      Yes | batch_actual, weighted_average, standard |
| `valuation_account_code`        | Optional | Accounting                               |
| `cogs_account_code`             | Optional | Accounting                               |
| `status`                        |      Yes |                                          |

## 3.5 `product_identifiers`

| Field               | Required | Example                                 |
| ------------------- | -------: | --------------------------------------- |
| `id`                |      Yes |                                         |
| `product_id`        |      Yes |                                         |
| `identifier_type`   |      Yes | internal_sku, barcode, gtin, ppb_reg_no |
| `identifier_value`  |      Yes |                                         |
| `barcode_symbology` | Optional | EAN-13, Code128, GS1 DataMatrix         |
| `is_primary`        |      Yes |                                         |
| `source`            | Optional | Manufacturer, supplier, internal        |
| `active`            |      Yes |                                         |

## 3.6 `packaging_levels`

| Field                   | Required | Example                   |
| ----------------------- | -------: | ------------------------- |
| `id`                    |      Yes |                           |
| `product_id`            |      Yes |                           |
| `level_code`            |      Yes | unit, strip, pack, carton |
| `unit_id`               |      Yes | Capsule, strip, pack      |
| `quantity_in_base_unit` |      Yes | 1, 10, 100, 1000          |
| `barcode`               | Optional |                           |
| `gtin`                  | Optional |                           |
| `can_purchase`          |      Yes |                           |
| `can_sell`              |      Yes |                           |
| `can_dispense`          |      Yes |                           |
| `can_stock_count`       |      Yes |                           |
| `active`                |      Yes |                           |

## 3.7 `supplier_products`

| Field                     | Required |
| ------------------------- | -------: |
| `id`                      |      Yes |
| `supplier_id`             |      Yes |
| `product_id`              |      Yes |
| `supplier_product_code`   | Optional |
| `supplier_product_name`   | Optional |
| `minimum_order_quantity`  | Optional |
| `purchase_unit_id`        |      Yes |
| `usual_pack_size`         | Optional |
| `lead_time_days`          | Optional |
| `last_purchase_price`     | Optional |
| `last_purchase_date`      | Optional |
| `preferred_supplier_flag` |      Yes |
| `status`                  |      Yes |

---

# 4. Unit-of-measure model

## 4.1 Final UOM principle

Every stockable product must have a **base unit**.

```text
All stock ledger balances are stored in base units.
All purchase, sale, dispense, transfer, and count quantities are converted to base units.
```

Example:

```text
1 pack = 100 tablets
Purchase: 5 packs
Base stock movement: +500 tablets

Sale: 2 strips, where 1 strip = 10 tablets
Base stock movement: -20 tablets
```

## 4.2 UOM categories

| Category    | Examples                              | Notes                        |
| ----------- | ------------------------------------- | ---------------------------- |
| Count       | tablet, capsule, vial, ampoule, piece | Usually integer only         |
| Pack        | strip, blister, pack, box, carton     | Converts to count            |
| Volume      | ml, litre                             | Syrups, solutions            |
| Weight      | mg, g, kg                             | Bulk/reagents                |
| Length/area | cm, m, roll                           | Wound care/consumables       |
| Service     | test, visit, procedure                | Non-stock service            |
| Kit         | kit, set                              | Lab or procedure bundles     |
| Dose        | dose                                  | Vaccines, administered items |

## 4.3 `units_of_measure`

| Field             | Required | Example                       |
| ----------------- | -------: | ----------------------------- |
| `id`              |      Yes |                               |
| `unit_code`       |      Yes | `TAB`, `CAP`, `ML`, `PACK`    |
| `unit_name`       |      Yes | Tablet                        |
| `unit_category`   |      Yes | count, volume, pack           |
| `decimal_allowed` |      Yes | False for tablet, true for ml |
| `precision`       |      Yes | 0 for tablet, 2 for ml        |
| `active`          |      Yes |                               |

## 4.4 `product_unit_conversions`

Conversions must be product-specific, not global.

| Field               |    Required | Example                      |
| ------------------- | ----------: | ---------------------------- |
| `id`                |         Yes |                              |
| `product_id`        |         Yes |                              |
| `from_unit_id`      |         Yes | Pack                         |
| `to_unit_id`        |         Yes | Tablet                       |
| `conversion_factor` |         Yes | 100                          |
| `conversion_type`   |         Yes | fixed, variable, approximate |
| `is_exact`          |         Yes | True                         |
| `can_purchase`      |         Yes |                              |
| `can_sell`          |         Yes |                              |
| `can_dispense`      |         Yes |                              |
| `can_stock_count`   |         Yes |                              |
| `requires_approval` |         Yes |                              |
| `approved_by`       | Conditional |                              |
| `effective_from`    |         Yes |                              |
| `effective_to`      |    Optional |                              |
| `status`            |         Yes |                              |

---

# 5. Unit conversion rules

## 5.1 General rules

| Rule                                            | System behaviour                                             |
| ----------------------------------------------- | ------------------------------------------------------------ |
| Every stockable product must have one base unit | Block product activation if missing                          |
| Every purchase unit must convert to base unit   | Block PO/GRN if conversion missing                           |
| Every sale unit must convert to base unit       | Block sale if conversion missing                             |
| Every dispense unit must convert to base unit   | Block dispensing if conversion missing                       |
| Conversion changes require approval             | Product manager/pharmacist/procurement approval              |
| Existing stock lots keep historical conversion  | Do not silently recalculate old movements                    |
| Decimal quantities only where unit allows       | No 0.5 capsule unless unit and product allow                 |
| Pack split must be explicit                     | Selling tablets from pack requires pack-to-tablet conversion |
| Different strengths cannot be converted         | 250mg tablet is not convertible to 500mg tablet as stock     |
| Reconstitution is not normal conversion         | Reconstituted syrups need separate workflow if tracked       |

## 5.2 Pack split rules

| Product            | Allowed split? | Notes                                                      |
| ------------------ | -------------: | ---------------------------------------------------------- |
| Tablet pack        |            Yes | Pack → strip → tablet                                      |
| Capsule pack       |            Yes | Pack → strip → capsule                                     |
| Syrup bottle       |     Usually no | Bottle sold as bottle; ml dispensing only if policy allows |
| Cream/tube         |     Usually no | Tube sold as tube                                          |
| Injection vial     |     Usually no | Dose administration can consume vial                       |
| Vaccine vial       |     Controlled | Dose tracking plus cold-chain/batch                        |
| Lab reagent bottle |     Controlled | Inventory may consume test-based standard quantity         |
| Gloves box         |            Yes | Box → pair/piece                                           |
| Test kits          |            Yes | Box → kit/test                                             |
| Surgical pack      |        Depends | Kit/set logic                                              |

## 5.3 Conversion examples

| Scenario                                              | Conversion                                             |
| ----------------------------------------------------- | ------------------------------------------------------ |
| Buy 10 packs of 100 tablets                           | `10 × 100 = 1,000 tablets`                             |
| Sell 3 strips of 10 tablets                           | `3 × 10 = 30 tablets`                                  |
| Dispense 14 capsules                                  | `14 × 1 = 14 capsules`                                 |
| Receive 5 boxes of 50 malaria RDT kits                | `5 × 50 = 250 tests/kits`                              |
| Use 2 gloves from box of 100                          | `2 pieces` or `1 pair`, depending configured base unit |
| Transfer 4 cartons, each 10 packs, each pack 100 tabs | `4 × 10 × 100 = 4,000 tablets`                         |

---

# 6. Stock lot model

## 6.1 Final decision

Use **stock lots** rather than only `stock_batches`.

A manufacturer batch may be received multiple times from different suppliers, at different costs, or with different quality statuses. Those should be separate internal lots.

```text
Manufacturer batch: ABC123
    ├── Internal lot 1: Supplier A, GRN-001, cost 10.00, qty 100
    ├── Internal lot 2: Supplier B, GRN-009, cost 10.80, qty 200
    └── Internal lot 3: Supplier A, GRN-015, quarantined, qty 50
```

## 6.2 `stock_lots`

| Field                       |               Required | Notes                                    |
| --------------------------- | ---------------------: | ---------------------------------------- |
| `id`                        |                    Yes |                                          |
| `product_id`                |                    Yes |                                          |
| `branch_id`                 |                    Yes |                                          |
| `supplier_id`               |            Conditional |                                          |
| `grn_id`                    |            Conditional |                                          |
| `grn_line_id`               |            Conditional |                                          |
| `manufacturer_batch_number` | Required for medicines |                                          |
| `internal_lot_number`       |                    Yes | System-generated                         |
| `expiry_date`               | Required for medicines |                                          |
| `manufacture_date`          |               Optional |                                          |
| `received_quantity_base`    |                    Yes | Base units                               |
| `available_quantity_base`   |                    Yes |                                          |
| `reserved_quantity_base`    |                    Yes |                                          |
| `quarantined_quantity_base` |                    Yes |                                          |
| `unit_cost_base`            |                    Yes | Cost per base unit                       |
| `landed_cost_base`          |               Optional | Cost after allocation                    |
| `currency`                  |                    Yes |                                          |
| `quality_status`            |                    Yes | sellable, quarantined, rejected, expired |
| `recall_status`             |                    Yes | clear, recalled, withdrawn               |
| `storage_location_id`       |               Optional |                                          |
| `cold_chain_status`         |            Conditional |                                          |
| `created_at`                |                    Yes |                                          |

## 6.3 Stock balance table

`stock_lots` gives exact lot balances. `stock_balances` is a summary table for speed.

### `stock_balances`

| Field                        |    Required |
| ---------------------------- | ----------: |
| `id`                         |         Yes |
| `branch_id`                  |         Yes |
| `product_id`                 |         Yes |
| `available_quantity_base`    |         Yes |
| `reserved_quantity_base`     |         Yes |
| `quarantined_quantity_base`  |         Yes |
| `total_quantity_base`        |         Yes |
| `weighted_average_cost_base` | Conditional |
| `last_movement_at`           |    Optional |
| `stock_status`               |         Yes |

---

# 7. Costing policy decision

## 7.1 Final costing policy

| Product type                  | Default costing method               | Why                                        |
| ----------------------------- | ------------------------------------ | ------------------------------------------ |
| Batch-controlled medicines    | **Batch/lot actual cost**            | Exact batch is selected at dispensing/sale |
| Controlled medicines          | **Batch/lot actual cost**            | Register and accountability                |
| Cold-chain medicines/vaccines | **Batch/lot actual cost**            | Lot-specific accountability                |
| Retail goods                  | **Weighted average cost**            | Simpler and practical                      |
| Lab consumables/test kits     | **Weighted average or batch actual** | Batch actual if expiry-sensitive           |
| Procedure consumables         | **Weighted average**                 | Simpler                                    |
| Services                      | **Standard cost**, optional          | Used for margin analysis                   |
| Packages                      | Component cost roll-up               | Sum of included stock/service costs        |

## 7.2 Important separation

```text
Physical picking method: FEFO
Accounting valuation method: batch actual or weighted average
```

FEFO decides **which stock to issue**. Costing decides **how to value the issue**.

For medicines:

```text
Pick the earliest acceptable expiry lot.
Post COGS using that selected lot’s actual unit cost.
```

For non-batch retail:

```text
Post COGS using current weighted average cost.
```

---

## 7.3 Costing formulas

### Batch/lot actual cost

```text
COGS = quantity_issued_base × stock_lot.unit_cost_base
```

### Weighted average cost

```text
new_average_cost =
  (old_quantity × old_average_cost + received_quantity × received_unit_cost)
  / (old_quantity + received_quantity)
```

### Landed cost allocation

Landed costs include freight, import fees, handling, insurance, and other acquisition costs.

Allocation methods:

| Method            | Use                               |
| ----------------- | --------------------------------- |
| By value          | Default for mixed-value purchases |
| By quantity       | Simple products                   |
| By weight         | Freight-heavy items               |
| By volume         | Bulky items                       |
| Manual allocation | Accountant override               |

Formula by value:

```text
landed_cost_share =
  line_value / total_goods_value × total_landed_cost
```

```text
landed_unit_cost =
  (line_goods_cost + landed_cost_share) / received_base_quantity
```

## 7.4 Costing adjustment rules

| Scenario                                     | System behaviour                                                    |
| -------------------------------------------- | ------------------------------------------------------------------- |
| Supplier invoice arrives after GRN           | Update lot cost if not yet closed, or post purchase price variance  |
| Invoice price differs from PO                | Approval required before cost update                                |
| Stock already sold before invoice correction | Post cost adjustment/price variance; do not rewrite historical sale |
| Supplier credit note                         | Reduce inventory if stock remains; otherwise post purchase variance |
| Expired stock write-off                      | Expense at current lot/average cost                                 |
| Damaged stock                                | Expense or supplier claim depending reason                          |
| Donated stock                                | Cost can be zero or fair value, policy-based                        |
| Opening stock migration                      | Use migration cost and mark source as opening balance               |
| Negative stock correction                    | Manager/owner approval and audit                                    |

---

# 8. Accounting integration for supplier returns and write-offs

## 8.1 Core accounting accounts

| Account code | Account                           | Type                     |
| ------------ | --------------------------------- | ------------------------ |
| `1200`       | Inventory                         | Asset                    |
| `2000`       | Supplier payables                 | Liability                |
| `5000`       | Cost of goods sold                | Expense                  |
| `5100`       | Inventory write-off / expiry loss | Expense                  |
| `5110`       | Damaged stock loss                | Expense                  |
| `5120`       | Stock shrinkage/loss              | Expense                  |
| `5130`       | Recall/withdrawal loss            | Expense                  |
| `5200`       | Purchase price variance           | Expense/income           |
| `1210`       | Inventory quarantine              | Asset/control            |
| `1220`       | Supplier return receivable        | Asset                    |
| `2100`       | Supplier credit note clearing     | Liability/contra-payable |

---

## 8.2 Supplier return before supplier invoice is posted

Example: received goods worth KES 10,000, returned before invoice posting.

| Entry                                           |  Debit | Credit |
| ----------------------------------------------- | -----: | -----: |
| Supplier return clearing / GRN accrual reversal | 10,000 |        |
| Inventory                                       |        | 10,000 |

If GRN was not yet posted to inventory, no accounting journal is needed; just reject the GRN line.

## 8.3 Supplier return after supplier invoice is posted, credit note expected

| Entry                                                 |  Debit | Credit |
| ----------------------------------------------------- | -----: | -----: |
| Supplier return receivable / supplier credit clearing | 10,000 |        |
| Inventory                                             |        | 10,000 |

When supplier credit note is received:

| Entry                      |  Debit | Credit |
| -------------------------- | -----: | -----: |
| Supplier payables          | 10,000 |        |
| Supplier return receivable |        | 10,000 |

## 8.4 Expiry write-off

| Entry                             |      Debit |     Credit |
| --------------------------------- | ---------: | ---------: |
| Inventory write-off / expiry loss | Cost value |            |
| Inventory                         |            | Cost value |

## 8.5 Damaged stock write-off

| Entry              |      Debit |     Credit |
| ------------------ | ---------: | ---------: |
| Damaged stock loss | Cost value |            |
| Inventory          |            | Cost value |

## 8.6 Theft/shrinkage write-off

| Entry                |      Debit |     Credit |
| -------------------- | ---------: | ---------: |
| Stock shrinkage/loss | Cost value |            |
| Inventory            |            | Cost value |

If recoverable from staff or insurer:

| Entry                                          |              Debit |             Credit |
| ---------------------------------------------- | -----------------: | -----------------: |
| Staff/insurance receivable                     | Recoverable amount |                    |
| Stock shrinkage recovery income or loss offset |                    | Recoverable amount |

## 8.7 Quarantine movement

Quarantine is usually a **status movement**, not an expense.

| Entry                |      Debit |     Credit |
| -------------------- | ---------: | ---------: |
| Inventory quarantine | Cost value |            |
| Inventory sellable   |            | Cost value |

If using one inventory account, no accounting entry is required; only stock status changes.

## 8.8 Recall

| Recall outcome              | Accounting treatment                                    |
| --------------------------- | ------------------------------------------------------- |
| Supplier accepts return     | Supplier return receivable                              |
| Supplier replaces goods     | Inventory transfer from recalled lot to replacement lot |
| Destroy/write-off           | Recall loss expense                                     |
| Awaiting decision           | Quarantine status only                                  |
| Insurance/recovery expected | Recovery receivable                                     |

---

# 9. Supplier return workflow

## 9.1 Supplier return statuses

```text
draft
pending_approval
approved
picked
dispatched_to_supplier
supplier_received
credit_note_pending
credit_note_received
replacement_pending
replacement_received
closed
cancelled
```

## 9.2 Supplier return reasons

```text
wrong_item_delivered
excess_delivery
short_expiry
expired_on_arrival
damaged_packaging
temperature_excursion
supplier_recall
regulatory_recall
suspected_counterfeit
quality_complaint
pricing_dispute
other
```

## 9.3 `supplier_returns`

| Field                         |                                    Required |
| ----------------------------- | ------------------------------------------: |
| `id`                          |                                         Yes |
| `supplier_return_number`      |                                         Yes |
| `supplier_id`                 |                                         Yes |
| `branch_id`                   |                                         Yes |
| `grn_id`                      |                                    Optional |
| `supplier_invoice_id`         |                                    Optional |
| `reason`                      |                                         Yes |
| `status`                      |                                         Yes |
| `requested_by`                |                                         Yes |
| `approved_by`                 |                                 Conditional |
| `dispatched_by`               |                                 Conditional |
| `supplier_received_reference` |                                    Optional |
| `expected_resolution`         | Yes: credit, replacement, repair, no_credit |
| `credit_note_id`              |                                    Optional |
| `replacement_grn_id`          |                                    Optional |
| `created_at`                  |                                         Yes |

## 9.4 `supplier_return_lines`

| Field                |                                       Required |
| -------------------- | ---------------------------------------------: |
| `id`                 |                                            Yes |
| `supplier_return_id` |                                            Yes |
| `product_id`         |                                            Yes |
| `stock_lot_id`       |                                            Yes |
| `batch_number`       |                         Required for medicines |
| `expiry_date`        |                         Required for medicines |
| `quantity_base`      |                                            Yes |
| `unit_cost_base`     |                                            Yes |
| `total_cost`         |                                            Yes |
| `return_condition`   |                                            Yes |
| `stock_action`       | Yes: return_to_supplier, quarantine, write_off |
| `notes`              |                                       Optional |

---

# 10. Write-off and disposal workflow

## 10.1 Write-off statuses

```text
draft
pending_approval
approved
pending_disposal
disposed
posted_to_accounting
closed
rejected
cancelled
```

## 10.2 Write-off reasons

```text
expired
damaged
contaminated
cold_chain_excursion
recalled_not_returnable
theft
loss
stock_count_variance
quality_failure
patient_return_not_resellable
controlled_destruction
other
```

## 10.3 `inventory_writeoffs`

| Field                              |    Required |
| ---------------------------------- | ----------: |
| `id`                               |         Yes |
| `writeoff_number`                  |         Yes |
| `branch_id`                        |         Yes |
| `reason`                           |         Yes |
| `status`                           |         Yes |
| `requested_by`                     |         Yes |
| `approved_by`                      | Conditional |
| `approval_date`                    | Conditional |
| `disposal_method`                  | Conditional |
| `disposal_vendor`                  |    Optional |
| `disposal_certificate_document_id` | Conditional |
| `accounting_event_id`              | Conditional |
| `notes`                            |    Optional |
| `created_at`                       |         Yes |

## 10.4 `inventory_writeoff_lines`

| Field             |    Required |
| ----------------- | ----------: |
| `id`              |         Yes |
| `writeoff_id`     |         Yes |
| `product_id`      |         Yes |
| `stock_lot_id`    |         Yes |
| `quantity_base`   |         Yes |
| `unit_cost_base`  |         Yes |
| `total_cost`      |         Yes |
| `batch_number`    | Conditional |
| `expiry_date`     | Conditional |
| `controlled_flag` |         Yes |
| `cold_chain_flag` |         Yes |

## 10.5 Write-off rules

| Rule                            | System behaviour                               |
| ------------------------------- | ---------------------------------------------- |
| Expired medicine                | Block sale, quarantine, write-off workflow     |
| Controlled medicine write-off   | Superintendent/witness approval required       |
| Cold-chain excursion            | Quarantine first, write off only after review  |
| Supplier return possible        | Suggest supplier return before write-off       |
| Write-off above value threshold | Owner approval required                        |
| Disposal evidence required      | Required before closing write-off              |
| Accounting posting              | Only after approval/disposal policy step       |
| Write-off cannot be deleted     | Cancel/reverse only through audited correction |

---

# 11. Serialization and GS1 implementation phase decision

## 11.1 Final decision

MVP must be **GS1-ready**, but not dependent on full unit serialization.

GS1 Application Identifiers define data elements such as AI `01` for GTIN, `10` for batch/lot, `17` for expiration date, and `21` for serial number. GS1 healthcare materials also describe GS1 DataMatrix as carrying GTIN, batch/lot, expiry/manufacturing date, and serial number where relevant. ([ref.gs1.org](https://ref.gs1.org/ai/)) ([gs1.org](https://www.gs1.org/industries/healthcare/2d-barcode-healthcare))

## 11.2 Serialization phases

| Phase   | Name                          | Scope                                      | Developer action           |
| ------- | ----------------------------- | ------------------------------------------ | -------------------------- |
| Phase 0 | Internal barcode readiness    | Internal SKU/barcode scanning              | Product identifiers table  |
| Phase 1 | Batch traceability            | GTIN, batch, expiry stored                 | Product + stock lot fields |
| Phase 2 | GS1 DataMatrix parsing        | Scan `(01)`, `(17)`, `(10)`                | Barcode parser             |
| Phase 3 | Unit-level serialization      | Capture `(21)` serial per unit             | `serial_units` table       |
| Phase 4 | Traceability events           | Receive, transfer, dispense, recall events | `traceability_events`      |
| Phase 5 | Regulator/network integration | PPB/PRIMS/traceability API when available  | Adapter                    |

## 11.3 GS1 data fields

| AI   | Meaning            | System field                       |
| ---- | ------------------ | ---------------------------------- |
| `01` | GTIN               | `gtin`                             |
| `10` | Batch/lot          | `manufacturer_batch_number`        |
| `17` | Expiration date    | `expiry_date`                      |
| `21` | Serial number      | `serial_number`                    |
| `00` | SSCC/logistic unit | `sscc` for cartons/pallets, future |
| `11` | Production date    | `manufacture_date`, optional       |
| `15` | Best before date   | Optional for non-medicine items    |

## 11.4 `serial_units`

| Field               |                                                                          Required |
| ------------------- | --------------------------------------------------------------------------------: |
| `id`                |                                                                               Yes |
| `product_id`        |                                                                               Yes |
| `stock_lot_id`      |                                                                               Yes |
| `gtin`              |                                                                               Yes |
| `serial_number`     |                                                                               Yes |
| `batch_number`      |                                                                               Yes |
| `expiry_date`       |                                                                               Yes |
| `current_branch_id` |                                                                               Yes |
| `current_status`    | Yes: available, reserved, dispensed, transferred, returned, quarantined, recalled |
| `received_at`       |                                                                               Yes |
| `dispensed_at`      |                                                                          Optional |
| `sale_id`           |                                                                          Optional |
| `dispense_id`       |                                                                          Optional |
| `patient_id`        |                                                               Optional/restricted |
| `last_event_id`     |                                                                          Optional |

## 11.5 `traceability_events`

| Field                  |    Required |
| ---------------------- | ----------: |
| `id`                   |         Yes |
| `event_type`           |         Yes |
| `event_datetime`       |         Yes |
| `product_id`           |         Yes |
| `stock_lot_id`         | Conditional |
| `serial_unit_id`       | Conditional |
| `gtin`                 |    Optional |
| `batch_number`         | Conditional |
| `serial_number`        | Conditional |
| `quantity_base`        | Conditional |
| `from_branch_id`       |    Optional |
| `to_branch_id`         |    Optional |
| `location_id`          |    Optional |
| `source_document_type` |         Yes |
| `source_document_id`   |         Yes |
| `performed_by`         |         Yes |
| `event_payload_json`   |    Optional |

## 11.6 Traceability event types

```text
product_registered
item_received
batch_verified
serial_received
stock_quarantined
stock_released
stock_transferred_out
stock_transferred_in
stock_dispensed
stock_sold
patient_returned
supplier_returned
recalled
destroyed
corrected
```

## 11.7 GS1 parser acceptance

| Test                                          | Expected result                  |
| --------------------------------------------- | -------------------------------- |
| Scan internal barcode                         | Product found                    |
| Scan GTIN only                                | Product found if GTIN mapped     |
| Scan GS1 with GTIN + batch + expiry           | Product, batch, expiry populated |
| Scan GS1 with serial                          | Serial unit created/validated    |
| Expiry in barcode differs from selected batch | Block or require review          |
| Unknown GTIN                                  | Product mapping required         |
| Duplicate serial received                     | Block                            |
| Dispensed serial scanned again                | Block or warn duplicate supply   |
| Recalled serial/batch                         | Block sale/dispense              |

---

# 12. Stock movement ledger

## 12.1 Final rule

No stock balance should ever be edited directly.

```text
All stock changes must be generated through stock_movements.
```

## 12.2 `stock_movements`

| Field                  |       Required |
| ---------------------- | -------------: |
| `id`                   |            Yes |
| `movement_number`      |            Yes |
| `movement_datetime`    |            Yes |
| `branch_id`            |            Yes |
| `product_id`           |            Yes |
| `stock_lot_id`         |    Conditional |
| `serial_unit_id`       |    Conditional |
| `movement_type`        |            Yes |
| `movement_reason`      |            Yes |
| `quantity_in_base`     | Yes, default 0 |
| `quantity_out_base`    | Yes, default 0 |
| `balance_after_base`   |            Yes |
| `unit_cost_base`       |            Yes |
| `total_cost`           |            Yes |
| `source_document_type` |            Yes |
| `source_document_id`   |            Yes |
| `performed_by`         |            Yes |
| `approved_by`          |    Conditional |
| `accounting_event_id`  |       Optional |
| `notes`                |       Optional |
| `created_at`           |            Yes |

## 12.3 Movement types

```text
opening_balance
purchase_receipt
sale_issue
dispense_issue
procedure_consumption
lab_consumption
supplier_return
customer_return_sellable
customer_return_quarantine
inter_branch_transfer_out
inter_branch_transfer_in
stock_adjustment_positive
stock_adjustment_negative
stock_count_variance
quarantine_in
quarantine_release
expiry_writeoff
damage_writeoff
recall_quarantine
recall_return
recall_writeoff
cold_chain_quarantine
destruction_disposal
correction_reversal
```

---

# 13. Product master approval workflow

## 13.1 Product status lifecycle

```text
draft
pending_classification
pending_uom_setup
pending_tax_setup
pending_pharmacist_review
pending_procurement_review
active
blocked
discontinued
archived
```

## 13.2 Product activation checklist

| Requirement              |    Medicine |      Retail | Lab consumable |
| ------------------------ | ----------: | ----------: | -------------: |
| SKU                      |         Yes |         Yes |            Yes |
| Display name             |         Yes |         Yes |            Yes |
| Base unit                |         Yes |         Yes |            Yes |
| Purchase/sale conversion |         Yes |         Yes |            Yes |
| Tax code                 |         Yes |         Yes |            Yes |
| Batch flag               |         Yes |    Optional |    Recommended |
| Expiry flag              |         Yes |    Optional |    Recommended |
| Medicine profile         |         Yes |          No |             No |
| Regulatory sale class    |         Yes |          No |             No |
| PPB registration field   | Recommended |          No |             No |
| Storage condition        |         Yes |    Optional |            Yes |
| Supplier link            | Recommended | Recommended |    Recommended |
| Costing method           |         Yes |         Yes |            Yes |
| Pharmacist approval      |         Yes |          No |       Optional |
| Procurement approval     | Recommended | Recommended |    Recommended |

## 13.3 Product approval rules

```text
RULE: Activate medicine product
IF base_unit exists
AND purchase_conversion exists
AND sale_or_dispense_conversion exists
AND tax_code exists
AND regulatory_sale_class != unknown
AND batch_controlled = true
AND expiry_controlled = true
AND pharmacist_approval = approved
THEN activate
ELSE keep blocked
```

---

# 14. API endpoints to add or adjust

## 14.1 Product master endpoints

| Endpoint                                        | Purpose                 |
| ----------------------------------------------- | ----------------------- |
| `POST /product-families`                        | Create product family   |
| `POST /products`                                | Create SKU/product      |
| `PATCH /products/{id}`                          | Update product          |
| `POST /products/{id}/medicine-profile`          | Add medicine profile    |
| `POST /products/{id}/inventory-control-profile` | Add inventory controls  |
| `POST /products/{id}/identifiers`               | Add barcode/GTIN        |
| `POST /products/{id}/packaging-levels`          | Add pack/unit structure |
| `POST /products/{id}/unit-conversions`          | Add conversion          |
| `POST /products/{id}/submit-approval`           | Submit for activation   |
| `POST /products/{id}/approve`                   | Approve product         |
| `POST /products/{id}/block`                     | Block product           |

## 14.2 Stock endpoints

| Endpoint                               | Purpose                 |
| -------------------------------------- | ----------------------- |
| `GET /stock/balances`                  | Stock summary           |
| `GET /stock/lots`                      | Lot-level stock         |
| `GET /stock/movements`                 | Immutable ledger        |
| `POST /stock/opening-balance`          | Migration/opening stock |
| `POST /stock/adjustments`              | Request adjustment      |
| `POST /stock/adjustments/{id}/approve` | Approve adjustment      |
| `POST /stock/quarantine`               | Quarantine stock        |
| `POST /stock/quarantine/{id}/release`  | Release quarantine      |
| `POST /stock/writeoffs`                | Create write-off        |
| `POST /stock/writeoffs/{id}/approve`   | Approve write-off       |
| `POST /stock/writeoffs/{id}/post`      | Post write-off          |

## 14.3 Supplier return endpoints

| Endpoint                                       | Purpose                     |
| ---------------------------------------------- | --------------------------- |
| `POST /supplier-returns`                       | Create supplier return      |
| `POST /supplier-returns/{id}/approve`          | Approve                     |
| `POST /supplier-returns/{id}/dispatch`         | Dispatch to supplier        |
| `POST /supplier-returns/{id}/confirm-received` | Supplier received           |
| `POST /supplier-returns/{id}/credit-note`      | Attach supplier credit note |
| `POST /supplier-returns/{id}/close`            | Close                       |

## 14.4 GS1/serialization endpoints

| Endpoint                                | Purpose                   |
| --------------------------------------- | ------------------------- |
| `POST /barcodes/parse`                  | Parse barcode/GS1 string  |
| `POST /serial-units/receive`            | Receive serialized units  |
| `POST /serial-units/verify`             | Verify serial status      |
| `POST /traceability/events`             | Create traceability event |
| `GET /traceability/product/{productId}` | Trace product             |
| `GET /traceability/batch/{batch}`       | Trace batch               |
| `GET /traceability/serial/{serial}`     | Trace serial              |

---

# 15. Updated workflows

## 15.1 Product creation workflow

```text
1. Create product family
2. Create SKU/product
3. Add base unit
4. Add purchase, sale, and dispense units
5. Add unit conversions
6. Add identifiers/barcodes/GTIN
7. Add medicine profile if medicine
8. Add inventory control profile
9. Add tax profile
10. Add supplier-product links
11. Submit for review
12. Pharmacist/procurement/accountant approvals
13. Product becomes active
```

## 15.2 Goods receiving with unit conversion

```text
1. Select PO
2. Select product
3. Enter received quantity and received unit
4. System converts to base quantity
5. Capture batch and expiry
6. Capture supplier invoice/delivery note
7. Capture cost per purchase unit
8. System calculates cost per base unit
9. Apply landed cost if available
10. Create stock lot
11. Post stock movement
12. Update stock balance
```

## 15.3 Supplier return workflow

```text
1. Identify stock lot
2. Move stock to quarantine if not already blocked
3. Create supplier return
4. Select reason and expected resolution
5. Manager/pharmacist approves
6. Dispatch to supplier
7. Stock movement posts out of inventory or return-control status
8. Supplier confirms receipt
9. Credit note or replacement is recorded
10. Accounting event posts
11. Supplier return closes
```

## 15.4 Write-off workflow

```text
1. Identify expired/damaged/lost stock lot
2. Move to quarantine
3. Create write-off request
4. Add reason, evidence, quantity, cost value
5. Approval required
6. Disposal evidence captured where applicable
7. Stock movement posts write-off
8. Accounting event posts loss
9. Write-off closes
```

## 15.5 GS1 scan receiving workflow

```text
1. User scans GS1 DataMatrix
2. Parser extracts GTIN, batch, expiry, serial if present
3. System maps GTIN to product
4. Batch/expiry populate GRN line
5. If serial exists, serial unit is created
6. Duplicate serial check runs
7. Stock lot/serial is received
8. Traceability event is recorded
```

---

# 16. Developer acceptance criteria

## 16.1 Product master

| Test                                          | Expected result                            |
| --------------------------------------------- | ------------------------------------------ |
| Create product without base unit              | Product cannot activate                    |
| Create medicine without batch/expiry controls | Activation blocked                         |
| Create medicine with unknown regulatory class | Activation blocked                         |
| Add GTIN                                      | Product can be found by GTIN               |
| Add multiple barcodes                         | All map to same product                    |
| Change unit conversion                        | Requires approval and audit                |
| Add supplier product                          | Purchase order can use supplier code       |
| Block product                                 | POS/GRN/dispensing blocked based on policy |

## 16.2 Unit conversion

| Test                           | Expected result                      |
| ------------------------------ | ------------------------------------ |
| Receive 5 packs of 100 tablets | Stock increases by 500 tablets       |
| Sell 2 strips of 10 tablets    | Stock decreases by 20 tablets        |
| Dispense 14 tablets            | Stock decreases by 14 tablets        |
| Try fractional capsule         | Blocked                              |
| Try decimal ml where allowed   | Allowed                              |
| Missing conversion             | PO/GRN/sale blocked                  |
| Historical conversion changed  | Old stock movements remain unchanged |
| Pack split disabled            | Sale in smaller unit blocked         |

## 16.3 Costing

| Test                                         | Expected result                                        |
| -------------------------------------------- | ------------------------------------------------------ |
| Receive batch-controlled medicine            | Lot actual cost stored                                 |
| Sell selected batch                          | COGS uses selected lot cost                            |
| Receive retail item                          | Weighted average recalculates                          |
| Add landed cost                              | Landed cost allocated                                  |
| Supplier invoice price differs               | Approval/variance workflow                             |
| Write off expired batch                      | Expense posts at lot cost                              |
| Supplier credit note                         | Inventory/payables adjusted correctly                  |
| Stock already sold before invoice correction | Purchase price variance posted, not historical rewrite |

## 16.4 Supplier return/write-off

| Test                                  | Expected result                                    |
| ------------------------------------- | -------------------------------------------------- |
| Return wrong item before GRN approval | GRN line rejected, no stock posted                 |
| Return stock after GRN                | Supplier return created, stock removed/quarantined |
| Supplier credit note received         | Payable/return receivable cleared                  |
| Write off expired medicine            | Stock out and expiry loss journal                  |
| Controlled medicine write-off         | Superintendent/witness approval required           |
| Disposal certificate missing          | Write-off cannot close                             |
| Recall return                         | Batch blocked and supplier return workflow starts  |

## 16.5 GS1/serialization

| Test                           | Expected result                                                   |
| ------------------------------ | ----------------------------------------------------------------- |
| Scan internal barcode          | Product selected                                                  |
| Scan GTIN                      | Product selected                                                  |
| Scan GS1 with batch and expiry | Fields populated                                                  |
| Scan GS1 with serial           | Serial record created                                             |
| Duplicate serial               | Blocked                                                           |
| Recalled batch                 | Sale/dispense blocked                                             |
| Serial dispensed twice         | Blocked or critical warning                                       |
| Trace batch                    | Shows GRN, branch, movement, sale/dispense, patient where allowed |

---

# 17. Final developer implementation sequence

## Phase 1: Product master and UOM

Build:

```text
product_families
products
medicine_profiles
inventory_control_profiles
units_of_measure
product_unit_conversions
packaging_levels
product_identifiers
supplier_products
product approval workflow
```

## Phase 2: Stock lot and ledger

Build:

```text
stock_lots
stock_balances
stock_movements
opening balance
GRN posting
POS stock issue
pharmacy dispense issue
stock count variance
```

## Phase 3: Procurement costing

Build:

```text
purchase_orders
goods_received_notes
supplier_invoices
three-way match
lot actual cost
weighted average cost
landed cost allocation
purchase price variance
```

## Phase 4: Returns, quarantine, write-offs

Build:

```text
quarantine_records
supplier_returns
inventory_writeoffs
recall workflow
disposal evidence
accounting events
```

## Phase 5: Transfers and cold chain

Build:

```text
stock_transfers
in-transit stock
transfer variance
cold-chain flags
temperature logs
cold-chain quarantine
```

## Phase 6: GS1 and serialization readiness

Build:

```text
GS1 parser
GTIN mapping
serial_units
traceability_events
batch recall trace
future regulator adapter
```

---

# 18. Final handoff summary

Module 4 is now developer-ready with these final decisions:

| Area                | Final state                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| Product master      | Normalized and ready                                                                   |
| Unit conversion     | Closed with base-unit model                                                            |
| Pack splitting      | Configurable and auditable                                                             |
| Batch/expiry        | Stock-lot model ready                                                                  |
| Costing             | Batch actual for medicines, weighted average for non-batch, standard cost for services |
| FEFO                | Physical picking rule, separate from accounting                                        |
| Serialization       | GS1-ready MVP, phased implementation                                                   |
| Supplier returns    | Workflow and accounting closed                                                         |
| Write-offs          | Workflow and accounting closed                                                         |
| Quarantine          | Status and accounting treatment defined                                                |
| Stock ledger        | Immutable movement ledger required                                                     |
| Developer readiness | High                                                                                   |

The closed Module 4 rule is:

```text
No stock should enter, move, split, sell, dispense, transfer, return, quarantine, serialize, or disappear unless the system can prove:
which product it is,
which unit it was measured in,
how that unit converts to base stock,
which supplier and stock lot it came from,
which batch and expiry it belongs to,
what it cost,
where it is stored,
what its quality status is,
what movement created the change,
what accounting entry was posted,
and who approved the action.
```
