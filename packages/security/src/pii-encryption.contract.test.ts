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
    const missing = ERD_SENSITIVE_COLUMNS.filter((erd) => {
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
    // patient_number and phone_primary are searched by exact match, so per
    // ADR-003 they must carry a deterministic search hash.
    for (const column of ['patient_number', 'phone_primary']) {
      const c = COLUMN_CLASSIFICATIONS.find(
        (x) => x.table === 'patient_patients' && x.column === column,
      );
      expect(c?.searchHash, `${column} needs a search hash`).toBe(true);
    }
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

  it('does not over-encrypt non-sensitive columns', () => {
    const overEncrypted = COLUMN_CLASSIFICATIONS.filter(
      (c) => !isSensitive(c) && c.fieldEncrypted,
    );
    expect(overEncrypted).toEqual([]);
  });
});
