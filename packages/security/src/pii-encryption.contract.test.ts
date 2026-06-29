/**
 * Gate 0B (#55) encryption-scope contract test.
 *
 * Asserts the security invariant from ADR-003 / ADR-007: every PII/PHI column
 * - and specifically every `patient_*` / `emr_clinical_notes` column - is
 * flagged for field-level encryption. If a future migration adds a sensitive
 * column without flagging it, this test fails the pipeline (reliability via
 * automation), rather than relying on a reviewer noticing.
 */
import { describe, it, expect } from 'vitest';
import {
  COLUMN_CLASSIFICATIONS,
  isSensitive,
  isSensitiveByConvention,
} from './pii-registry';
import { ERD_SENSITIVE_COLUMNS } from './erd-schema';

describe('ADR-003/ADR-007 PII/PHI field-encryption scope', () => {
  it('flags every PII/PHI column for field-level encryption', () => {
    const unencrypted = COLUMN_CLASSIFICATIONS.filter(
      (c) => isSensitive(c) && !c.fieldEncrypted,
    );
    expect(
      unencrypted,
      `sensitive columns missing field encryption: ${unencrypted
        .map((c) => `${c.table}.${c.column}`)
        .join(', ')}`,
    ).toEqual([]);
  });

  // The core gap fix: the registry must cover every sensitive column the ERD
  // actually declares. A new sensitive column in Unified_ERD.md that nobody
  // registers must FAIL here, instead of silently passing.
  it('classifies every ERD sensitive column as encrypted (no unregistered column)', () => {
    // Derived *_hash columns hold a non-reversible keyed HMAC, not plaintext
    // PII, so they are intentionally not field-encrypted; the dedicated
    // hash<->searchHash invariant test covers them instead.
    const missing = ERD_SENSITIVE_COLUMNS.filter((erd) => !erd.derivedHash).filter((erd) => {
      const c = COLUMN_CLASSIFICATIONS.find(
        (x) => x.table === erd.table && x.column === erd.column,
      );
      return !c || !isSensitive(c) || !c.fieldEncrypted;
    });
    expect(
      missing,
      `ERD sensitive columns not registered+classified+encrypted: ${missing
        .map((c) => `${c.table}.${c.column}`)
        .join(', ')}`,
    ).toEqual([]);
  });

  it('flags every patient_* / emr_clinical_notes column as encrypted PII/PHI', () => {
    const offenders = COLUMN_CLASSIFICATIONS.filter(
      (c) => isSensitiveByConvention(c.table) && (!isSensitive(c) || !c.fieldEncrypted),
    );
    expect(
      offenders,
      `patient_*/emr_clinical_notes columns not classified+encrypted: ${offenders
        .map((c) => `${c.table}.${c.column}`)
        .join(', ')}`,
    ).toEqual([]);
  });

  it('covers the ADR-003 designated columns explicitly', () => {
    const required = [
      ['patient_patients', 'patient_number'],
      ['patient_patients', 'phone_primary'],
      ['emr_clinical_notes', 'note_text'],
    ] as const;
    for (const [table, column] of required) {
      const found = COLUMN_CLASSIFICATIONS.find((c) => c.table === table && c.column === column);
      expect(found, `missing classification for ${table}.${column}`).toBeDefined();
      expect(found?.fieldEncrypted).toBe(true);
    }
  });

  it('requires an HMAC search hash on encrypted columns used for lookup', () => {
    // patient_number, phone_primary and dob are searched by exact match, so per
    // ADR-003 they must carry a deterministic search hash. dob is included
    // because name + DOB disambiguation is a standard patient-lookup path; a
    // missing hash here would invite a later plaintext DOB index.
    // national_id and birth_cert_no are searched too: national-ID lookup is a
    // ratified MVP requirement (#65) and birth_cert_no is its minor equivalent.
    for (const column of [
      'patient_number',
      'phone_primary',
      'dob',
      'national_id',
      'birth_cert_no',
    ]) {
      const c = COLUMN_CLASSIFICATIONS.find(
        (x) => x.table === 'patient_patients' && x.column === column,
      );
      expect(c?.searchHash, `${column} needs a search hash`).toBe(true);
    }
  });

  it('keeps national_id / birth_cert_no as encrypted PII with a (keyed-pepper) search hash (#65)', () => {
    // Ratified in #65 (ADR-003 §4.1 / ADR-007 §6): national_id and the minor
    // equivalent birth_cert_no are searched by exact match, so they carry a
    // search hash - but ONLY because that hash is a keyed HMAC-SHA256 with a
    // secret pepper held outside the DB, defeating offline enumeration of these
    // low-entropy identifiers. They remain field-encrypted PII regardless.
    for (const column of ['national_id', 'birth_cert_no']) {
      const c = COLUMN_CLASSIFICATIONS.find(
        (x) => x.table === 'patient_patients' && x.column === column,
      );
      expect(c, `${column} must be classified`).toBeDefined();
      expect(c?.dataClass).toBe('pii');
      expect(c?.fieldEncrypted).toBe(true);
      expect(c?.searchHash).toBe(true);
    }
  });

  it('records a derived *_hash column in the ERD for every searchable identifier, and vice versa (#65)', () => {
    // Invariant tying the ERD to the registry: every ERD `<col>_hash` derived
    // column must have a base column flagged `searchHash: true`, and every
    // `searchHash: true` identifier that the ERD declares must have a matching
    // `<col>_hash` derived column. This stops the manifest and the registry
    // drifting on the keyed-HMAC lookup columns (ADR-003 §4.1 / ADR-007 §6).
    const hashCols = ERD_SENSITIVE_COLUMNS.filter((c) => c.derivedHash);

    // (a) every derived hash column resolves to a base column with searchHash.
    const orphanHashes = hashCols.filter((h) => {
      const base = h.column.replace(/_hash$/, '');
      const c = COLUMN_CLASSIFICATIONS.find(
        (x) => x.table === h.table && x.column === base,
      );
      return !h.column.endsWith('_hash') || !c || c.searchHash !== true;
    });
    expect(
      orphanHashes,
      `ERD *_hash columns with no searchHash base column: ${orphanHashes
        .map((h) => `${h.table}.${h.column}`)
        .join(', ')}`,
    ).toEqual([]);

    // (b) every ERD-declared searchable identifier has a derived *_hash column.
    const erdSearchable = COLUMN_CLASSIFICATIONS.filter(
      (c) =>
        c.searchHash === true &&
        ERD_SENSITIVE_COLUMNS.some(
          (e) => !e.derivedHash && e.table === c.table && e.column === c.column,
        ),
    );
    const missingHashCols = erdSearchable.filter(
      (c) =>
        !hashCols.some(
          (h) => h.table === c.table && h.column === `${c.column}_hash`,
        ),
    );
    expect(
      missingHashCols,
      `searchable identifiers in the ERD with no derived *_hash column: ${missingHashCols
        .map((c) => `${c.table}.${c.column}`)
        .join(', ')}`,
    ).toEqual([]);
  });

  it('does NOT put a deterministic search hash on free-text PHI', () => {
    // Deterministic HMAC of free-text clinical content leaks equality and
    // frequency, so free-text PHI must never be searchHash'd (ADR-003).
    const freeText = [
      ['emr_clinical_notes', 'note_text'],
      ['lab_results', 'text_value'],
    ] as const;
    for (const [table, column] of freeText) {
      const c = COLUMN_CLASSIFICATIONS.find((x) => x.table === table && x.column === column);
      expect(c?.searchHash ?? false, `${table}.${column} must not be deterministically hashed`).toBe(false);
    }
  });

  it('classifies core_users.full_name as encrypted PII (regression: review !12)', () => {
    // full_name is a person's name (PII) but sits outside the patient_*
    // convention; it previously escaped every gate. Lock it in.
    const c = COLUMN_CLASSIFICATIONS.find(
      (x) => x.table === 'core_users' && x.column === 'full_name',
    );
    expect(c, 'core_users.full_name must be classified').toBeDefined();
    expect(c?.dataClass).toBe('pii');
    expect(c?.fieldEncrypted).toBe(true);
  });

  it('classifies lab_samples.specimen_type as encrypted PHI (regression: review !12)', () => {
    // specimen_type is clinical content tied to a patient but sits outside the
    // patient_* convention and the lab_results table; it previously escaped
    // every gate. Lock it in so the lab schema can't ship sensitive content
    // unguarded.
    const c = COLUMN_CLASSIFICATIONS.find(
      (x) => x.table === 'lab_samples' && x.column === 'specimen_type',
    );
    expect(c, 'lab_samples.specimen_type must be classified').toBeDefined();
    expect(c?.dataClass).toBe('phi');
    expect(c?.fieldEncrypted).toBe(true);
  });

  it('does not over-encrypt non-sensitive columns', () => {
    const overEncrypted = COLUMN_CLASSIFICATIONS.filter(
      (c) => !isSensitive(c) && c.fieldEncrypted,
    );
    expect(overEncrypted).toEqual([]);
  });
});
