/**
 * ADR-001 §6.4 - branch-tenancy scoping-class registry.
 *
 * This is the SINGLE SOURCE OF TRUTH for how each table in `DOCS/Unified_ERD.md`
 * is scoped. The application-layer global query scope, the SQL Server RLS
 * policies (delivered under #70), and the migration-guard test all derive from
 * this one declaration - so the application and the database can never disagree
 * about a table's tenancy class (DRY; SOLID single-responsibility).
 *
 * Why a registry and not two prose lists: ADR-001 originally maintained the
 * directly-scoped set in both §5 and §6.4 and they drifted. Encoding it once,
 * in code, with a test that fails on any unclassified table, makes the scope
 * claim enforceable rather than asserted.
 */

/** How a table reaches the branch it belongs to. */
export type ScopeClass =
  | 'directly-scoped' // owns a branch_id column (RLS predicate on branch_id)
  | 'inheritance-scoped' // reaches branch through an FK chain
  | 'org-scoped'; // organisation_id / global reference data

/** The column an RLS filter/block predicate is written against. */
export interface DirectlyScoped {
  readonly scope: 'directly-scoped';
  /**
   * Column the predicate keys on. Normally `branch_id`; for `core_branches`
   * (which *is* the branch) it is the primary key `id`, so an implementer must
   * not write a `branch_id = ...` predicate there (it would be unsatisfiable).
   */
  readonly predicateColumn: 'branch_id' | 'id';
}

export interface InheritanceScoped {
  readonly scope: 'inheritance-scoped';
  /** FK column on this table used to reach the parent. */
  readonly fkColumn: string;
  /** Parent table the FK points at; the chain is resolved transitively. */
  readonly parent: string;
}

export interface OrgScoped {
  readonly scope: 'org-scoped';
  /**
   * `organisation_id` for tenant-owned org data (e.g. the unified patient
   * record); `global` for pure cross-org reference data (terminology, tariffs).
   */
  readonly kind: 'organisation_id' | 'global';
  /**
   * True for PHI whose cross-branch read must be consent-gated and audited
   * (ADR-020). The DB layer (#70) must not expose these as an open org-wide
   * read.
   */
  readonly phiConsentGated?: boolean;
}

export type ScopeEntry = DirectlyScoped | InheritanceScoped | OrgScoped;

/**
 * Every table in `DOCS/Unified_ERD.md`, classified. Cross-checked against the
 * ERD column lists. When a new table is added to the ERD, it MUST be added here
 * or the migration-guard test fails (ADR-001 §6.4 test 7).
 */
export const SCOPE_REGISTRY: Readonly<Record<string, ScopeEntry>> = {
  // --- Directly-scoped: own a branch_id column ----------------------------
  emr_visits: { scope: 'directly-scoped', predicateColumn: 'branch_id' },
  pharmacy_dispenses: { scope: 'directly-scoped', predicateColumn: 'branch_id' },
  billing_sales: { scope: 'directly-scoped', predicateColumn: 'branch_id' },
  inventory_stock_batches: { scope: 'directly-scoped', predicateColumn: 'branch_id' },
  inventory_purchase_orders: { scope: 'directly-scoped', predicateColumn: 'branch_id' },
  // core_branches IS the branch: predicate keys on its own id, not branch_id.
  core_branches: { scope: 'directly-scoped', predicateColumn: 'id' },

  // --- Inheritance-scoped: reach branch via an FK chain -------------------
  billing_invoices: { scope: 'inheritance-scoped', fkColumn: 'sale_id', parent: 'billing_sales' },
  billing_payments: { scope: 'inheritance-scoped', fkColumn: 'sale_id', parent: 'billing_sales' },
  inventory_stock_movements: { scope: 'inheritance-scoped', fkColumn: 'batch_id', parent: 'inventory_stock_batches' },
  emr_clinical_notes: { scope: 'inheritance-scoped', fkColumn: 'visit_id', parent: 'emr_visits' },
  emr_diagnoses: { scope: 'inheritance-scoped', fkColumn: 'visit_id', parent: 'emr_visits' },
  pharmacy_prescriptions: { scope: 'inheritance-scoped', fkColumn: 'visit_id', parent: 'emr_visits' },
  claims_claims: { scope: 'inheritance-scoped', fkColumn: 'visit_id', parent: 'emr_visits' },
  lab_orders: { scope: 'inheritance-scoped', fkColumn: 'visit_id', parent: 'emr_visits' },
  lab_samples: { scope: 'inheritance-scoped', fkColumn: 'order_id', parent: 'lab_orders' },
  lab_results: { scope: 'inheritance-scoped', fkColumn: 'sample_id', parent: 'lab_samples' },

  // --- Org-scoped: organisation_id-owned or global reference --------------
  // Unified patient record (ADR-001 §4). PHI: cross-branch read is consent-
  // gated + audited (ADR-020), NOT an open org-wide read.
  patient_patients: { scope: 'org-scoped', kind: 'organisation_id', phiConsentGated: true },
  patient_allergies: { scope: 'org-scoped', kind: 'organisation_id', phiConsentGated: true },
  core_organisations: { scope: 'org-scoped', kind: 'organisation_id' },
  core_users: { scope: 'org-scoped', kind: 'organisation_id' },
  // Global cross-org reference data (no row-level tenancy column).
  inventory_products: { scope: 'org-scoped', kind: 'global' },
  inventory_suppliers: { scope: 'org-scoped', kind: 'global' },
  terminology_code_systems: { scope: 'org-scoped', kind: 'global' },
  terminology_diagnosis_codes: { scope: 'org-scoped', kind: 'global' },
  pharmacy_drug_ingredients: { scope: 'org-scoped', kind: 'global' },
  pharmacy_product_ingredient_map: { scope: 'org-scoped', kind: 'global' },
  claims_tariffs: { scope: 'org-scoped', kind: 'global' },
  lab_tests: { scope: 'org-scoped', kind: 'global' },
  core_roles: { scope: 'org-scoped', kind: 'global' },
  // Join tables - membership/assignment, org-scoped via their parents.
  core_user_roles: { scope: 'org-scoped', kind: 'organisation_id' },
  core_branch_users: { scope: 'org-scoped', kind: 'organisation_id' },
} as const;

/** Tables that own a branch_id (predicateColumn === 'branch_id'). */
export function directlyScopedBranchTables(): string[] {
  return Object.entries(SCOPE_REGISTRY)
    .filter(([, e]) => e.scope === 'directly-scoped' && e.predicateColumn === 'branch_id')
    .map(([t]) => t)
    .sort();
}
