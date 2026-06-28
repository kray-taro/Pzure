/**
 * ERD sensitive-column manifest (authoritative source of truth for the gate).
 *
 * Transcribed from `DOCS/Unified_ERD.md`. The PII/PHI encryption gate must be
 * checked against the *actual* schema, not against whatever happens to be in
 * the hand-written registry - otherwise a new sensitive column can ship
 * unguarded while the test stays green (the failure mode this gate exists to
 * prevent).
 *
 * Scope: this manifest lists EVERY PII/PHI column the project recognises in
 * `Unified_ERD.md` - not only the `patient_*` / `emr_clinical_notes`
 * convention tables, but also the sensitive columns on `core_users`,
 * `billing_payments` and `lab_results`. Every column listed here MUST appear
 * in COLUMN_CLASSIFICATIONS and be field-encrypted; the contract test enforces
 * that. Enumerating the full set (not just the convention tables) is what
 * stops a sensitive column on a non-`patient_*` table shipping unguarded.
 *
 * Maintenance: when `Unified_ERD.md` changes, update this manifest. The
 * follow-up (#40 hardening lane) replaces this hand-transcription with an
 * introspector that derives the manifest directly from the SQL migrations
 * (delivered in Phase 1 / !1), at which point this file becomes generated.
 */

export interface ErdColumn {
  table: string;
  column: string;
  /** Why it is sensitive - documentation only, not used by the gate. */
  note?: string;
}

/**
 * Every PII/PHI column the ERD declares. PK/FK/uuid linkage columns are
 * intentionally excluded - they are identifiers, not protected content.
 * Anything carrying a person's identity, contact, demographic or clinical
 * content is listed, across ALL tables (not just the convention tables).
 */
export const ERD_SENSITIVE_COLUMNS: readonly ErdColumn[] = [
  // patient_patients (PII) - the real ERD patient table.
  { table: 'patient_patients', column: 'patient_number', note: 'direct patient identifier' },
  { table: 'patient_patients', column: 'national_id', note: 'national ID (high-sensitivity PII), searchable' },
  { table: 'patient_patients', column: 'first_name', note: 'name' },
  { table: 'patient_patients', column: 'last_name', note: 'name' },
  { table: 'patient_patients', column: 'dob', note: 'date of birth' },
  { table: 'patient_patients', column: 'phone_primary', note: 'contact, searchable' },

  // patient_allergies (PHI) - clinical content tied to a patient.
  { table: 'patient_allergies', column: 'severity', note: 'allergy severity (clinical)' },

  // emr_clinical_notes (PHI).
  { table: 'emr_clinical_notes', column: 'note_text', note: 'free-text clinical note' },

  // Sensitive columns OUTSIDE the convention tables - in encryption scope too.
  { table: 'core_users', column: 'full_name', note: 'staff name (PII)' },
  { table: 'core_users', column: 'email', note: 'staff contact (PII), searchable' },
  { table: 'billing_payments', column: 'mpesa_receipt_number', note: 'financial identifier (PII), searchable' },
  { table: 'lab_results', column: 'numeric_value', note: 'clinical result (PHI)' },
  { table: 'lab_results', column: 'text_value', note: 'clinical result (PHI)' },
] as const;

/**
 * Naming convention: `patient_*` tables and `emr_clinical_notes` are sensitive
 * by location. Single source of truth for the convention - imported by the
 * registry so the gate and the registry cannot drift (DRY).
 */
export function isSensitiveTableByConvention(table: string): boolean {
  return table.startsWith('patient_') || table === 'emr_clinical_notes';
}
