# Unified Entity Relationship Diagram (ERD)

This document provides the foundational Data Architecture for the Pzure platform. To prevent diagram rendering limits, the ERD is split by schema groups. All tables adhere to the branch-aware multi-tenancy model where applicable.

## 1. Core & Patient Schemas

```mermaid
erDiagram
    core_organisations {
        uuid id PK
        string name
        boolean is_active
    }
    core_branches {
        uuid id PK
        uuid organisation_id FK
        string branch_code
        string name
        int facility_level
    }
    core_users {
        uuid id PK
        uuid organisation_id FK
        string keycloak_sub
        string email
        string full_name
        boolean is_active
    }
    core_roles {
        uuid id PK
        string role_name
    }
    core_user_roles {
        uuid user_id FK
        uuid role_id FK
    }
    core_branch_users {
        uuid user_id FK
        uuid branch_id FK
        boolean is_primary_branch
    }
    patient_patients {
        uuid id PK
        uuid organisation_id FK
        string patient_number
        string first_name
        string last_name
        date dob
        string phone_primary
    }
    patient_allergies {
        uuid id PK
        uuid patient_id FK
        uuid ingredient_id FK
        string severity
    }

    core_organisations ||--o{ core_branches : "has"
    core_organisations ||--o{ core_users : "employs"
    core_organisations ||--o{ patient_patients : "registers"
    core_branches ||--o{ core_branch_users : "assigns"
    core_users ||--o{ core_branch_users : "works_at"
    core_users ||--o{ core_user_roles : "has"
    core_roles ||--o{ core_user_roles : "assigned_to"
    patient_patients ||--o{ patient_allergies : "has"
```

## 2. Terminology & Master Data

```mermaid
erDiagram
    terminology_code_systems {
        uuid id PK
        string code_system_key
        string version
    }
    terminology_diagnosis_codes {
        uuid id PK
        uuid code_system_id FK
        string code
        string title
        boolean selectable_flag
    }
    pharmacy_drug_ingredients {
        uuid id PK
        string ingredient_name
        string rxnorm_rxcui
    }
    inventory_products {
        uuid id PK
        string product_code
        string name
        string product_type
        boolean is_active
    }
    pharmacy_product_ingredient_map {
        uuid id PK
        uuid product_id FK
        uuid ingredient_id FK
    }
    
    terminology_code_systems ||--o{ terminology_diagnosis_codes : "contains"
    inventory_products ||--o{ pharmacy_product_ingredient_map : "contains"
    pharmacy_drug_ingredients ||--o{ pharmacy_product_ingredient_map : "maps_to"
```

## 3. Clinical & EMR Schemas

```mermaid
erDiagram
    emr_visits {
        uuid id PK
        uuid patient_id FK
        uuid branch_id FK
        datetime start_time
        datetime end_time
        string status
    }
    emr_clinical_notes {
        uuid id PK
        uuid visit_id FK
        uuid clinician_id FK
        string note_text
    }
    emr_diagnoses {
        uuid id PK
        uuid visit_id FK
        uuid patient_id FK
        uuid diagnosis_code_id FK
        boolean primary_flag
    }
    pharmacy_prescriptions {
        uuid id PK
        uuid visit_id FK
        uuid patient_id FK
        uuid prescriber_id FK
        datetime prescribed_at
    }
    pharmacy_dispenses {
        uuid id PK
        uuid prescription_id FK
        uuid branch_id FK
        uuid product_id FK
        int quantity
    }

    patient_patients ||--o{ emr_visits : "has"
    emr_visits ||--o{ emr_clinical_notes : "contains"
    emr_visits ||--o{ emr_diagnoses : "records"
    emr_visits ||--o{ pharmacy_prescriptions : "generates"
    pharmacy_prescriptions ||--o{ pharmacy_dispenses : "fulfilled_by"
```

## 4. Lab Schema

```mermaid
erDiagram
    lab_tests {
        uuid id PK
        string test_code
        string test_name
        string category
    }
    lab_orders {
        uuid id PK
        uuid visit_id FK
        uuid patient_id FK
        string status
    }
    lab_samples {
        uuid id PK
        uuid order_id FK
        string sample_barcode
        string specimen_type
    }
    lab_results {
        uuid id PK
        uuid sample_id FK
        uuid lab_test_id FK
        string numeric_value
        string text_value
        boolean abnormal_flag
    }

    emr_visits ||--o{ lab_orders : "creates"
    lab_orders ||--o{ lab_samples : "requires"
    lab_samples ||--o{ lab_results : "yields"
    lab_tests ||--o{ lab_results : "defines"
```

## 5. Billing & Claims

```mermaid
erDiagram
    billing_sales {
        uuid id PK
        uuid branch_id FK
        uuid patient_id FK
        datetime sale_date
        decimal total_amount
    }
    billing_invoices {
        uuid id PK
        uuid sale_id FK
        string etims_invoice_number
        string etims_status
    }
    billing_payments {
        uuid id PK
        uuid sale_id FK
        string payment_method
        string mpesa_receipt_number
    }
    claims_tariffs {
        uuid id PK
        uuid payer_id FK
        string version_code
    }
    claims_claims {
        uuid id PK
        uuid visit_id FK
        uuid payer_id FK
        decimal total_claimed
        string sha_claim_reference
    }

    patient_patients ||--o{ billing_sales : "makes"
    billing_sales ||--o{ billing_invoices : "generates"
    billing_sales ||--o{ billing_payments : "paid_via"
    emr_visits ||--o{ claims_claims : "billed_to"
```

## 6. Inventory & Supply Chain

```mermaid
erDiagram
    inventory_suppliers {
        uuid id PK
        string name
    }
    inventory_purchase_orders {
        uuid id PK
        uuid branch_id FK
        uuid supplier_id FK
        string status
    }
    inventory_stock_batches {
        uuid id PK
        uuid product_id FK
        uuid branch_id FK
        string batch_number
        date expiry_date
        int quantity_on_hand
    }
    inventory_stock_movements {
        uuid id PK
        uuid batch_id FK
        string movement_type
        int quantity
        datetime movement_at
    }

    inventory_suppliers ||--o{ inventory_purchase_orders : "receives"
    inventory_products ||--o{ inventory_stock_batches : "stored_as"
    inventory_stock_batches ||--o{ inventory_stock_movements : "tracks"
```
