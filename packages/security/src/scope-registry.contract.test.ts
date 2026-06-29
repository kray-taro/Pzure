/**
 * ADR-001 §6.4 - test 7 (migration guard), buildable today.
 *
 * Asserts that every table in `DOCS/Unified_ERD.md` is classified into exactly
 * one scoping class and that every inheritance chain terminates at a directly-
 * scoped table's branch_id. A new ERD table that is not added to the registry,
 * or an inheritance chain that does not resolve, fails CI - making the tenancy
 * scope claim enforceable rather than asserted.
 *
 * The ERD table list below is mirrored from `DOCS/Unified_ERD.md`; the
 * `erd-parity` test ties the two together so the registry cannot silently fall
 * behind the ERD. (When a backend exists under #70, this list is replaced by a
 * parser that reads the ERD / live schema directly.)
 */
import { describe, it, expect } from 'vitest';
import { SCOPE_REGISTRY, directlyScopedBranchTables } from './scope-registry';
import { resolveBranchTerminal } from './resolve-chain';

/** Tables declared in DOCS/Unified_ERD.md (all schema groups). */
const ERD_TABLES = [
  // Core & Patient
  'core_organisations', 'core_branches', 'core_users', 'core_roles',
  'core_user_roles', 'core_branch_users', 'patient_patients', 'patient_allergies',
  // Terminology & Master
  'terminology_code_systems', 'terminology_diagnosis_codes',
  'pharmacy_drug_ingredients', 'inventory_products', 'pharmacy_product_ingredient_map',
  // Clinical & EMR
  'emr_visits', 'emr_clinical_notes', 'emr_diagnoses', 'pharmacy_prescriptions',
  'pharmacy_dispenses',
  // Lab
  'lab_tests', 'lab_orders', 'lab_samples', 'lab_results',
  // Billing & Claims
  'billing_sales', 'billing_invoices', 'billing_payments', 'claims_tariffs',
  'claims_claims',
  // Inventory & Supply Chain
  'inventory_suppliers', 'inventory_purchase_orders', 'inventory_stock_batches',
  'inventory_stock_movements',
].sort();

describe('ADR-001 §6.4 test 7 - migration guard (scope-class completeness)', () => {
  it('every ERD table is classified in the registry', () => {
    const missing = ERD_TABLES.filter((t) => !(t in SCOPE_REGISTRY));
    expect(missing, `unclassified ERD tables: ${missing.join(', ')}`).toEqual([]);
  });

  it('registry has no entries that are absent from the ERD (no drift)', () => {
    const extra = Object.keys(SCOPE_REGISTRY).filter((t) => !ERD_TABLES.includes(t));
    expect(extra, `registry tables not in ERD: ${extra.join(', ')}`).toEqual([]);
  });

  it('every table has a valid, known scope class', () => {
    for (const [table, entry] of Object.entries(SCOPE_REGISTRY)) {
      expect(
        ['directly-scoped', 'inheritance-scoped', 'org-scoped'],
        `bad scope for ${table}`,
      ).toContain(entry.scope);
    }
  });
});

describe('ADR-001 §6.4 - inheritance chains terminate at a directly-scoped branch_id', () => {
  const inheritance = Object.entries(SCOPE_REGISTRY)
    .filter(([, e]) => e.scope === 'inheritance-scoped')
    .map(([t]) => t);

  it.each(inheritance)('chain for %s resolves to a branch_id terminal', (table) => {
    const res = resolveBranchTerminal(table);
    expect(res.ok, res.reason).toBe(true);
    expect(directlyScopedBranchTables()).toContain(res.terminal);
  });

  it('the multi-hop lab chain resolves lab_results -> emr_visits', () => {
    const res = resolveBranchTerminal('lab_results');
    expect(res.ok).toBe(true);
    expect(res.terminal).toBe('emr_visits');
    expect(res.path).toEqual(['lab_results', 'lab_samples', 'lab_orders', 'emr_visits']);
  });

  it('inventory_stock_movements resolves to inventory_stock_batches (third terminal)', () => {
    const res = resolveBranchTerminal('inventory_stock_movements');
    expect(res.terminal).toBe('inventory_stock_batches');
  });
});

describe('ADR-001 §6.4 - directly-scoped predicate columns', () => {
  it('core_branches keys on id, never on a branch_id column', () => {
    const entry = SCOPE_REGISTRY['core_branches'];
    expect(entry.scope).toBe('directly-scoped');
    if (entry.scope === 'directly-scoped') {
      expect(entry.predicateColumn).toBe('id');
    }
  });

  it('all six ERD branch_id-bearing tables are directly-scoped on branch_id', () => {
    expect(directlyScopedBranchTables()).toEqual(
      [
        'billing_sales', 'emr_visits', 'inventory_purchase_orders',
        'inventory_stock_batches', 'pharmacy_dispenses',
      ].sort(),
    );
  });
});

describe('ADR-001 §6.4 - org-scoped PHI is consent-gated', () => {
  it('patient_patients is org-scoped PHI flagged consent-gated', () => {
    const entry = SCOPE_REGISTRY['patient_patients'];
    expect(entry.scope).toBe('org-scoped');
    if (entry.scope === 'org-scoped') {
      expect(entry.phiConsentGated).toBe(true);
    }
  });
});
