// Unit tests for the RLS generator (ADR-001 §6.4). No DB needed: they assert
// the SQL shape and, critically, the fail-closed identifier validation that
// protects this security-boundary generator from unsafe interpolation.
import { describe, it, expect } from 'vitest';
import {
  buildDirectPolicy,
  buildInheritanceTvfPredicate,
  buildDenormBranchTrigger,
  assertIdent,
} from '../../scripts/lib/rls-sql.mjs';

describe('rls-sql identifier validation (fail-closed)', () => {
  it('accepts plain identifiers', () => {
    expect(assertIdent('emr_visits', 'table')).toBe('emr_visits');
  });

  it.each([
    'emr;DROP TABLE x',
    'foo bar',
    'dbo.emr_visits',
    '[emr_visits]',
    "x' OR '1'='1",
    '',
  ])('rejects unsafe identifier %j', (bad) => {
    expect(() => assertIdent(bad, 'table')).toThrow(/Unsafe SQL identifier/);
  });

  it('buildDirectPolicy refuses an injected table name', () => {
    expect(() => buildDirectPolicy({ table: 'x; DROP TABLE y' })).toThrow(/Unsafe SQL identifier/);
  });
});

describe('rls-sql generated DDL', () => {
  it('direct policy emits filter + block predicates and a security policy', () => {
    const sql = buildDirectPolicy({ table: 'emr_visits', branchColumn: 'branch_id' });
    expect(sql).toMatch(/CREATE SECURITY POLICY dbo\.sp_emr_visits/);
    expect(sql).toMatch(/ADD FILTER PREDICATE/);
    expect(sql).toMatch(/ADD BLOCK PREDICATE .*AFTER INSERT/);
    expect(sql).toMatch(/ADD BLOCK PREDICATE .*AFTER UPDATE/);
  });

  it('tvf predicate joins through the parent to the branch column', () => {
    const sql = buildInheritanceTvfPredicate({
      table: 'billing_invoices', fkColumn: 'sale_id', parentTable: 'billing_sales',
    });
    expect(sql).toMatch(/FROM dbo\.billing_sales AS p/);
    expect(sql).toMatch(/p\.branch_id = CONVERT\(uniqueidentifier/);
  });

  it('denorm trigger derives branch_id from the FK parent on write', () => {
    const sql = buildDenormBranchTrigger({
      table: 'billing_invoices', fkColumn: 'sale_id', parentTable: 'billing_sales',
    });
    expect(sql).toMatch(/CREATE TRIGGER dbo\.trg_denorm_billing_invoices/);
    expect(sql).toMatch(/AFTER INSERT, UPDATE/);
    expect(sql).toMatch(/SET t\.branch_id = p\.branch_id/);
  });
});
