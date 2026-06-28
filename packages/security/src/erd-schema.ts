/**
 * ERD sensitive-column manifest (authoritative source of truth for the gate).
 *
 * Transcribed from `DOCS/Unified_ERD.md`. The PII/PHI encryption gate must be
 * checked against the *actual* schema, not against whatever happens to be in
 * the hand-written registry - otherwise a new sensitive column can ship
 * unguarded while the test stays green (the failure mode this gate exists to
 * prevent).
 *
 * Scope: this manifest lists the columns that are sensitive *by convention*
 * (the `patient_*` tables and `emr_clinical_notes`), i.e. the tables Gate 0B
 * (#55) designates as holding the most sensitive PII/PHI. Every column listed
 * here MUST appear in COLUMN_CLASSIFICATIONS and be field-encrypted; the
 * contract test enforces that.
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
 * Columns in `patient_*` and `emr_clinical_notes` that carry PII/PHI per the
 * ERD. PK/FK/uuid linkage columns are intentionally excluded - they are
 * identifiers, not protected content. Anything carrying a person's identity,
 * contact, demographic or clinical content is listed.
 */
export const ERD_SENSITIVE_COLUMNS: readonly ErdColumn[] = [
  // patient_patients (PII) - the real ERD patient table.
  { table: 'patient_patients', column: 'patient_number', note: 'direct patient identifier' },
  { table: 'patient_patients', column: 'first_name', note: 'name' },
  { table: 'patient_patients', column: 'last_name', note: 'name' },
  { table: 'patient_patients', column: 'dob', note: 'date of birth' },
  { table: 'patient_patients', column: 'phone_primary', note: 'contact, searchable' },

  // patient_allergies (PHI) - clinical content tied to a patient.
  { table: 'patient_allergies', column: 'severity', note: 'allergy severity (clinical)' },

  // emr_clinical_notes (PHI).
  { table: 'emr_clinical_notes', column: 'note_text', note: 'free-text clinical note' },
] as const;

/**
 * Naming convention: `patient_*` tables and `emr_clinical_notes` are sensitive
 * by location. Kept here next to the manifest so the registry and the gate
 * agree on one definition.
 */
export function isSensitiveTableByConvention(table: string): boolean {
  return table.startsWith('patient_') || table === 'emr_clinical_notes';
}
