/**
 * PII/PHI data-classification registry (single source of truth).
 *
 * ADR-003 designates field-level AES-256-GCM encryption for selected PII/PHI;
 * ADR-007 carries that into the Key Vault envelope upgrade. This registry makes
 * the *scope* of that decision machine-checked instead of an asserted ADR
 * checkbox: any column tagged `pii` or `phi` MUST be flagged for field
 * encryption, and the contract test fails the build if one is not.
 *
 * `searchHash` records columns that also need a deterministic HMAC-SHA256 hash
 * for exact-match lookup (encrypted fields cannot be queried directly).
 */

import { isSensitiveTableByConvention } from './erd-schema';

export type DataClass = 'pii' | 'phi' | 'internal' | 'public';

export interface ColumnClassification {
  /** Logical table name (snake_case, as in the ERD). */
  table: string;
  /** Column name. */
  column: string;
  /** Data-protection classification. */
  dataClass: DataClass;
  /** True when the column must be field-level encrypted (ADR-003/ADR-007). */
  fieldEncrypted: boolean;
  /** True when an HMAC search hash is required for equality lookup. */
  searchHash?: boolean;
}

/**
 * The classified columns. Table/column names match `DOCS/Unified_ERD.md`
 * exactly (see `erd-schema.ts`). Tables prefixed `patient_*` and the
 * `emr_clinical_notes` table hold the most sensitive PII/PHI and are the focus
 * of the Gate 0B (#55) encryption-scope assertion; other tables with PII/PHI
 * (e.g. `core_users`, `billing_payments`, `lab_results`) are classified too.
 */
export const COLUMN_CLASSIFICATIONS: readonly ColumnClassification[] = [
  // patient_patients (PII) - the real ERD patient table.
  { table: 'patient_patients', column: 'patient_number', dataClass: 'pii', fieldEncrypted: true, searchHash: true },
  { table: 'patient_patients', column: 'national_id', dataClass: 'pii', fieldEncrypted: true, searchHash: true },
  { table: 'patient_patients', column: 'phone_primary', dataClass: 'pii', fieldEncrypted: true, searchHash: true },
  { table: 'patient_patients', column: 'first_name', dataClass: 'pii', fieldEncrypted: true },
  { table: 'patient_patients', column: 'last_name', dataClass: 'pii', fieldEncrypted: true },
  { table: 'patient_patients', column: 'dob', dataClass: 'pii', fieldEncrypted: true },

  // patient_allergies (PHI) - clinical content tied to a patient.
  { table: 'patient_allergies', column: 'severity', dataClass: 'phi', fieldEncrypted: true },

  // emr_clinical_notes (PHI).
  { table: 'emr_clinical_notes', column: 'note_text', dataClass: 'phi', fieldEncrypted: true },

  // Other PII/PHI outside the convention tables (still in encryption scope).
  { table: 'core_users', column: 'full_name', dataClass: 'pii', fieldEncrypted: true },
  { table: 'core_users', column: 'email', dataClass: 'pii', fieldEncrypted: true, searchHash: true },
  { table: 'billing_payments', column: 'mpesa_receipt_number', dataClass: 'pii', fieldEncrypted: true, searchHash: true },
  { table: 'lab_results', column: 'numeric_value', dataClass: 'phi', fieldEncrypted: true },
  { table: 'lab_results', column: 'text_value', dataClass: 'phi', fieldEncrypted: true },

  // Non-sensitive columns (must NOT be over-encrypted: keeps the test honest).
  { table: 'core_branches', column: 'name', dataClass: 'public', fieldEncrypted: false },
  { table: 'inventory_products', column: 'name', dataClass: 'public', fieldEncrypted: false },
] as const;

/** A column is in PII/PHI scope when classified as `pii` or `phi`. */
export function isSensitive(c: ColumnClassification): boolean {
  return c.dataClass === 'pii' || c.dataClass === 'phi';
}

/**
 * Naming convention: patient_* tables and emr_clinical_notes are sensitive by
 * location. Re-exported from the single definition in `erd-schema.ts` so the
 * registry and the manifest cannot drift (DRY).
 */
export function isSensitiveByConvention(table: string): boolean {
  return isSensitiveTableByConvention(table);
}
