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
