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
      ['patient_demographics', 'national_id'],
      ['patient_demographics', 'phone_primary'],
      ['emr_clinical_notes', 'note_text'],
    ] as const;
    for (const [table, column] of required) {
      const found = COLUMN_CLASSIFICATIONS.find((c) => c.table === table && c.column === column);
      expect(found, `missing classification for ${table}.${column}`).toBeDefined();
      expect(found?.fieldEncrypted).toBe(true);
    }
  });

  it('requires an HMAC search hash on encrypted columns used for lookup', () => {
    // national_id and phone_primary are searched by exact match, so per ADR-003
    // they must carry a deterministic search hash.
    for (const column of ['national_id', 'phone_primary']) {
      const c = COLUMN_CLASSIFICATIONS.find(
        (x) => x.table === 'patient_demographics' && x.column === column,
      );
      expect(c?.searchHash, `${column} needs a search hash`).toBe(true);
    }
  });

  it('does not over-encrypt non-sensitive columns', () => {
    const overEncrypted = COLUMN_CLASSIFICATIONS.filter(
      (c) => !isSensitive(c) && c.fieldEncrypted,
    );
    expect(overEncrypted).toEqual([]);
  });
});
