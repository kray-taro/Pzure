// Canonical Row-Level Security DDL generator (ADR-001 Section 6.4).
//
// ONE generator is the single source of truth for the RLS policies, used by
// BOTH the migration that creates them and the integration tests that assert
// they isolate correctly (DRY). SQL Server RLS predicates evaluate over the
// row's own columns, so the two scoping classes need different SQL:
//
//   * direct       -> predicate directly on the table's branch column.
//   * inheritance  -> predicate on a denormalised branch_id column populated at
//                     write time. (The join-based table-valued-function variant
//                     is supported by buildInheritanceTvfPredicate for tables
//                     that opt out of denormalisation; the migration records
//                     the per-table choice.)
//
// The session's branch is supplied via SESSION_CONTEXT('branch_id'), set by the
// application per request from the JWT (ADR-002). A NULL/empty session context
// matches no rows (fail-closed), except for the audited corporate-bypass path
// which sets SESSION_CONTEXT('tenancy_bypass') = '1' (ADR-020).

export const SESSION_BRANCH = "CONVERT(uniqueidentifier, SESSION_CONTEXT(N'branch_id'))";
export const SESSION_BYPASS = "CONVERT(bit, SESSION_CONTEXT(N'tenancy_bypass'))";

// Fail-closed identifier validation. RLS DDL cannot be parameterised (object
// names are not bindable), so every schema/table/column name interpolated below
// MUST be a plain SQL identifier. Anything else (quoting, spaces, separators)
// is rejected rather than emitted — this generator feeds a security boundary.
const IDENT_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
/** @param {string} name @param {string} role @returns {string} */
export function assertIdent(name, role) {
  if (typeof name !== 'string' || !IDENT_RE.test(name)) {
    throw new Error(`Unsafe SQL identifier for ${role}: ${JSON.stringify(name)}`);
  }
  return name;
}

/** Predicate body shared by FILTER and BLOCK predicates for a branch column. */
function branchPredicateBody(branchColumn) {
  // Corporate bypass is explicit and intended to be paired with an audit event
  // by the caller (ADR-020); it is never the default.
  return `${branchColumn} = ${SESSION_BRANCH} OR ${SESSION_BYPASS} = 1`;
}

/**
 * RLS DDL for a directly-scoped table (owns a branch column).
 * @param {{ schema?: string, table: string, branchColumn?: string }} opts
 */
export function buildDirectPolicy({ schema = 'dbo', table, branchColumn = 'branch_id' }) {
  assertIdent(schema, 'schema');
  assertIdent(table, 'table');
  assertIdent(branchColumn, 'branchColumn');
  const fn = `${schema}.fn_rls_${table}`;
  const body = branchPredicateBody(`@${branchColumn}`);
  return [
    `CREATE FUNCTION ${fn}(@${branchColumn} uniqueidentifier)`,
    `    RETURNS TABLE WITH SCHEMABINDING`,
    `AS RETURN SELECT 1 AS rls_ok WHERE ${body};`,
    `GO`,
    `CREATE SECURITY POLICY ${schema}.sp_${table}`,
    `    ADD FILTER PREDICATE ${fn}(${branchColumn}) ON ${schema}.${table},`,
    `    ADD BLOCK PREDICATE ${fn}(${branchColumn}) ON ${schema}.${table} AFTER INSERT,`,
    `    ADD BLOCK PREDICATE ${fn}(${branchColumn}) ON ${schema}.${table} AFTER UPDATE`,
    `    WITH (STATE = ON);`,
    `GO`,
  ].join('\n');
}

/**
 * RLS DDL for an inheritance-scoped table using a denormalised branch_id column
 * (the preferred approach: simple, indexable, and identical predicate to direct
 * tables). The migration is responsible for populating/maintaining branch_id
 * from the FK parent at write time (trigger or app-layer).
 * @param {{ schema?: string, table: string, branchColumn?: string }} opts
 */
export function buildInheritanceDenormPolicy(opts) {
  return buildDirectPolicy(opts);
}

/**
 * Write-time maintenance for the denormalised branch_id on an inheritance table:
 * a trigger that derives branch_id from the FK parent on INSERT/UPDATE. This is
 * the mechanism the denormalised RLS path relies on, so it ships from the same
 * generator and is exercised by the live tests (no developer-discipline gap).
 * @param {{ schema?: string, table: string, branchColumn?: string, fkColumn: string, parentTable: string, parentKey?: string, parentBranchColumn?: string }} o
 */
export function buildDenormBranchTrigger({
  schema = 'dbo',
  table,
  branchColumn = 'branch_id',
  fkColumn,
  parentTable,
  parentKey = 'id',
  parentBranchColumn = 'branch_id',
}) {
  for (const [v, role] of [
    [schema, 'schema'], [table, 'table'], [branchColumn, 'branchColumn'],
    [fkColumn, 'fkColumn'], [parentTable, 'parentTable'], [parentKey, 'parentKey'],
    [parentBranchColumn, 'parentBranchColumn'],
  ]) assertIdent(v, role);
  const trg = `${schema}.trg_denorm_${table}`;
  return [
    `CREATE TRIGGER ${trg} ON ${schema}.${table} AFTER INSERT, UPDATE AS`,
    `BEGIN`,
    `    SET NOCOUNT ON;`,
    `    UPDATE t SET t.${branchColumn} = p.${parentBranchColumn}`,
    `    FROM ${schema}.${table} AS t`,
    `    JOIN inserted AS i ON i.id = t.id`,
    `    JOIN ${schema}.${parentTable} AS p ON p.${parentKey} = t.${fkColumn};`,
    `END;`,
    `GO`,
  ].join('\n');
}

/**
 * RLS DDL for an inheritance-scoped table WITHOUT denormalisation: a join-based
 * predicate that resolves the branch through the FK chain. Provided for tables
 * that deliberately opt out of a denormalised column.
 * @param {{ schema?: string, table: string, fkColumn: string, parentTable: string, parentKey?: string, parentBranchColumn?: string }} o
 */
export function buildInheritanceTvfPredicate({
  schema = 'dbo',
  table,
  fkColumn,
  parentTable,
  parentKey = 'id',
  parentBranchColumn = 'branch_id',
}) {
  for (const [v, role] of [
    [schema, 'schema'], [table, 'table'], [fkColumn, 'fkColumn'],
    [parentTable, 'parentTable'], [parentKey, 'parentKey'], [parentBranchColumn, 'parentBranchColumn'],
  ]) assertIdent(v, role);
  const fn = `${schema}.fn_rls_${table}`;
  return [
    `CREATE FUNCTION ${fn}(@${fkColumn} uniqueidentifier)`,
    `    RETURNS TABLE WITH SCHEMABINDING`,
    `AS RETURN`,
    `    SELECT 1 AS rls_ok`,
    `    FROM ${schema}.${parentTable} AS p`,
    `    WHERE p.${parentKey} = @${fkColumn}`,
    `      AND (p.${parentBranchColumn} = ${SESSION_BRANCH} OR ${SESSION_BYPASS} = 1);`,
    `GO`,
    `CREATE SECURITY POLICY ${schema}.sp_${table}`,
    `    ADD FILTER PREDICATE ${fn}(${fkColumn}) ON ${schema}.${table},`,
    `    ADD BLOCK PREDICATE ${fn}(${fkColumn}) ON ${schema}.${table} AFTER INSERT,`,
    `    ADD BLOCK PREDICATE ${fn}(${fkColumn}) ON ${schema}.${table} AFTER UPDATE`,
    `    WITH (STATE = ON);`,
    `GO`,
  ].join('\n');
}
