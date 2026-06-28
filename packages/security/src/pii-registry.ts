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
 * The classified columns. Tables prefixed `patient_*` and the
 * `emr_clinical_notes` table hold the most sensitive PII/PHI and are the focus
 * of the Gate 0B (#55) encryption-scope assertion.
 */
export const COLUMN_CLASSIFICATIONS: readonly ColumnClassification[] = [
  // patient_* (PII)
  { table: 'patient_demographics', column: 'national_id', dataClass: 'pii', fieldEncrypted: true, searchHash: true },
  { table: 'patient_demographics', column: 'phone_primary', dataClass: 'pii', fieldEncrypted: true, searchHash: true },
  { table: 'patient_demographics', column: 'full_name', dataClass: 'pii', fieldEncrypted: true },
  { table: 'patient_demographics', column: 'date_of_birth', dataClass: 'pii', fieldEncrypted: true },
  { table: 'patient_contacts', column: 'email', dataClass: 'pii', fieldEncrypted: true, searchHash: true },
  { table: 'patient_contacts', column: 'physical_address', dataClass: 'pii', fieldEncrypted: true },
  { table: 'patient_next_of_kin', column: 'phone', dataClass: 'pii', fieldEncrypted: true, searchHash: true },

  // emr_clinical_notes (PHI)
  { table: 'emr_clinical_notes', column: 'note_text', dataClass: 'phi', fieldEncrypted: true },
  { table: 'emr_clinical_notes', column: 'diagnosis_summary', dataClass: 'phi', fieldEncrypted: true },

  // non-sensitive examples (must NOT be over-encrypted: keeps the test honest)
  { table: 'patient_demographics', column: 'preferred_language', dataClass: 'internal', fieldEncrypted: false },
  { table: 'branch', column: 'name', dataClass: 'public', fieldEncrypted: false },
] as const;

/** A column is in PII/PHI scope when classified as `pii` or `phi`. */
export function isSensitive(c: ColumnClassification): boolean {
  return c.dataClass === 'pii' || c.dataClass === 'phi';
}

/** Naming convention: patient_* tables and emr_clinical_notes are sensitive by location. */
export function isSensitiveByConvention(table: string): boolean {
  return table.startsWith('patient_') || table === 'emr_clinical_notes';
}
