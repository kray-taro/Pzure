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
 * RLS DDL for an inheritance-scoped table using a DENORMALISED branch_id column
 * (the preferred approach: simple, indexable).
 *
 * IMPORTANT ordering invariant: a SQL Server `AFTER INSERT` BLOCK predicate
 * evaluates the row's stored columns *before* any AFTER trigger runs, so it
 * cannot be paired with an AFTER trigger that derives branch_id — the column
 * would still be NULL and every insert would be rejected. We therefore:
 *   - DERIVE branch_id from the FK parent in an INSTEAD OF INSERT trigger
 *     (so the row already carries the correct branch_id when it lands), and
 *   - apply the FILTER predicate + an AFTER UPDATE BLOCK predicate only.
 * Re-pointing the FK is guarded by buildDenormBranchTrigger (AFTER UPDATE),
 * which keeps branch_id consistent and is itself subject to the UPDATE block.
 *
 * This builder is intentionally NOT an alias of buildDirectPolicy: a direct
 * table receives branch_id from the caller, a denorm table derives it, and the
 * two have different INSERT contracts (SOLID/ISP).
 *
 * @param {{ schema?: string, table: string, branchColumn?: string, fkColumn: string, parentTable: string, parentKey?: string, parentBranchColumn?: string }} opts
 */
export function buildInheritanceDenormPolicy({
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
  const fn = `${schema}.fn_rls_${table}`;
  const body = branchPredicateBody(`@${branchColumn}`);
  const insTrg = `${schema}.trg_denorm_ins_${table}`;
  return [
    // FILTER/UPDATE-BLOCK predicate function over the denormalised column.
    `CREATE FUNCTION ${fn}(@${branchColumn} uniqueidentifier)`,
    `    RETURNS TABLE WITH SCHEMABINDING`,
    `AS RETURN SELECT 1 AS rls_ok WHERE ${body};`,
    `GO`,
    // INSTEAD OF INSERT derives branch_id from the parent BEFORE the row lands,
    // so the (later) read FILTER and any UPDATE BLOCK see a populated column.
    `CREATE TRIGGER ${insTrg} ON ${schema}.${table} INSTEAD OF INSERT AS`,
    `BEGIN`,
    `    SET NOCOUNT ON;`,
    `    INSERT INTO ${schema}.${table} (id, ${fkColumn}, ${branchColumn})`,
    `    SELECT i.id, i.${fkColumn}, p.${parentBranchColumn}`,
    `    FROM inserted AS i`,
    `    JOIN ${schema}.${parentTable} AS p ON p.${parentKey} = i.${fkColumn};`,
    `END;`,
    `GO`,
    // No AFTER INSERT block predicate (the INSTEAD OF trigger guarantees the
    // derived branch_id); FILTER on read + BLOCK on UPDATE.
    `CREATE SECURITY POLICY ${schema}.sp_${table}`,
    `    ADD FILTER PREDICATE ${fn}(${branchColumn}) ON ${schema}.${table},`,
    `    ADD BLOCK PREDICATE ${fn}(${branchColumn}) ON ${schema}.${table} AFTER UPDATE`,
    `    WITH (STATE = ON);`,
    `GO`,
  ].join('\n');
}

/**
 * AFTER UPDATE maintenance for the denormalised branch_id: if a row's FK parent
 * changes, re-derive branch_id so it stays consistent. Set-based and multi-row
 * safe. NOTE: re-homing a row across branches via parent_id change is itself
 * subject to the AFTER UPDATE block predicate, so it can only succeed within the
 * session branch (or audited bypass). Migrations SHOULD also index
 * (${fkColumn}) on hot tables; the trigger joins the parent on every update.
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
  const trg = `${schema}.trg_denorm_upd_${table}`;
  return [
    `CREATE TRIGGER ${trg} ON ${schema}.${table} AFTER UPDATE AS`,
    `BEGIN`,
    `    SET NOCOUNT ON;`,
    `    IF UPDATE(${fkColumn})`,
    `    UPDATE t SET t.${branchColumn} = p.${parentBranchColumn}`,
    `    FROM ${schema}.${table} AS t`,
    `    JOIN inserted AS i ON i.id = t.id`,
    `    JOIN ${schema}.${parentTable} AS p ON p.${parentKey} = t.${fkColumn};`,
    `END;`,
    `GO`,
  ].join('\n');
}

/**
 * RLS DDL for a table whose visibility is the current user's BRANCH GRANT SET
 * (e.g. core_branches): a user may legitimately span multiple branches, so the
 * predicate is membership in the grant table, not equality to the single
 * session branch. Reads return every branch the user is granted; the session
 * branch still narrows writes via the block predicate on the grant-keyed column.
 * @param {{ schema?: string, table: string, keyColumn?: string, grantTable?: string, grantBranchColumn?: string }} opts
 */
export function buildBranchSetPolicy({
  schema = 'dbo',
  table,
  keyColumn = 'id',
  grantTable = 'core_branch_users',
  grantBranchColumn = 'branch_id',
}) {
  for (const [v, role] of [
    [schema, 'schema'], [table, 'table'], [keyColumn, 'keyColumn'],
    [grantTable, 'grantTable'], [grantBranchColumn, 'grantBranchColumn'],
  ]) assertIdent(v, role);
  const fn = `${schema}.fn_rls_${table}`;
  return [
    `CREATE FUNCTION ${fn}(@${keyColumn} uniqueidentifier)`,
    `    RETURNS TABLE WITH SCHEMABINDING`,
    `AS RETURN`,
    `    SELECT 1 AS rls_ok`,
    `    WHERE ${SESSION_BYPASS} = 1`,
    `       OR EXISTS (SELECT 1 FROM ${schema}.${grantTable} AS g`,
    `                  WHERE g.${grantBranchColumn} = @${keyColumn}`,
    `                    AND g.${grantBranchColumn} = ${SESSION_BRANCH});`,
    `GO`,
    `CREATE SECURITY POLICY ${schema}.sp_${table}`,
    `    ADD FILTER PREDICATE ${fn}(${keyColumn}) ON ${schema}.${table},`,
    `    ADD BLOCK PREDICATE ${fn}(${keyColumn}) ON ${schema}.${table} AFTER UPDATE`,
    `    WITH (STATE = ON);`,
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
