// Unit tests for the RLS generator (ADR-001 §6.4). No DB needed: they assert
// the SQL shape and, critically, the fail-closed identifier validation that
// protects this security-boundary generator from unsafe interpolation.
import { describe, it, expect } from 'vitest';
import {
  buildDirectPolicy,
  buildInheritanceDenormPolicy,
  buildInheritanceTvfPredicate,
  buildDenormBranchTrigger,
  buildBranchSetPolicy,
  assertIdent,
  SESSION_BRANCH,
  SESSION_BYPASS,
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

  it('tvf predicate joins through the parent and uses the session constant', () => {
    const sql = buildInheritanceTvfPredicate({
      table: 'billing_invoices', fkColumn: 'sale_id', parentTable: 'billing_sales',
    });
    expect(sql).toMatch(/FROM dbo\.billing_sales AS p/);
    // Assert against the exported constant, not a re-typed copy of the SQL.
    expect(sql).toContain(`p.branch_id = ${SESSION_BRANCH}`);
    expect(sql).toContain(SESSION_BYPASS);
  });

  it('denorm policy derives branch_id via INSTEAD OF INSERT (no AFTER INSERT block)', () => {
    const sql = buildInheritanceDenormPolicy({
      table: 'billing_invoices', fkColumn: 'sale_id', parentTable: 'billing_sales',
    });
    expect(sql).toMatch(/INSTEAD OF INSERT/);
    expect(sql).toMatch(/INSERT INTO dbo\.billing_invoices/);
    // Critical: must NOT add an AFTER INSERT block predicate (would reject all
    // inserts because branch_id is NULL when an AFTER predicate evaluates).
    expect(sql).not.toMatch(/BLOCK PREDICATE .*AFTER INSERT/);
    expect(sql).toMatch(/ADD BLOCK PREDICATE .*AFTER UPDATE/);
  });

  it('denorm UPDATE trigger re-derives branch_id only when the FK changes', () => {
    const sql = buildDenormBranchTrigger({
      table: 'billing_invoices', fkColumn: 'sale_id', parentTable: 'billing_sales',
    });
    expect(sql).toMatch(/CREATE TRIGGER dbo\.trg_denorm_upd_billing_invoices/);
    expect(sql).toMatch(/AFTER UPDATE/);
    expect(sql).not.toMatch(/AFTER INSERT/);
    expect(sql).toMatch(/IF UPDATE\(sale_id\)/);
  });

  it('branch-set policy scopes by the grant table, not the single session branch', () => {
    const sql = buildBranchSetPolicy({ table: 'core_branches' });
    expect(sql).toMatch(/FROM dbo\.core_branch_users AS g/);
    expect(sql).toContain(SESSION_BRANCH);
    expect(sql).toMatch(/ADD BLOCK PREDICATE .*AFTER UPDATE/);
  });
});
