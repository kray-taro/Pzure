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
// The authenticated user, set per request from the JWT (ADR-002). Required to
// scope a table by the user's GRANT SET (e.g. core_branches), which spans
// multiple branches and therefore cannot key on the single session branch.
export const SESSION_USER_ID = "CONVERT(uniqueidentifier, SESSION_CONTEXT(N'user_id'))";
export const SESSION_ORG = "CONVERT(uniqueidentifier, SESSION_CONTEXT(N'organisation_id'))";

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
 *     (so the row already carries the correct branch_id when it lands),
 *   - REJECT inside that trigger any derived branch_id that differs from the
 *     session branch unless the audited bypass flag is set (this is the
 *     primary cross-branch write defence: a branch-A session must not be able
 *     to inject a child of a branch-B parent), and
 *   - apply the FILTER predicate + AFTER INSERT and AFTER UPDATE BLOCK
 *     predicates. The AFTER INSERT block is safe here because the INSTEAD OF
 *     trigger has already populated branch_id before the inner INSERT's AFTER
 *     predicate evaluates; it is a DB backstop to the in-trigger guard.
 * Re-pointing the FK is guarded by buildDenormBranchTrigger (AFTER UPDATE),
 * which keeps branch_id consistent and is itself subject to the UPDATE block.
 *
 * This builder is intentionally NOT an alias of buildDirectPolicy: a direct
 * table receives branch_id from the caller, a denorm table derives it, and the
 * two have different INSERT contracts (SOLID/ISP).
 *
 * `columns` MUST list every insertable column on the table EXCEPT branchColumn
 * (which is derived from the parent). Because the trigger is INSTEAD OF, it is
 * the only insert that runs, so every caller-supplied column must be carried
 * through or it is silently lost. `id` and `fkColumn` are included if omitted.
 *
 * @param {{ schema?: string, table: string, columns: string[], pkColumn?: string, branchColumn?: string, fkColumn: string, parentTable: string, parentKey?: string, parentBranchColumn?: string }} opts
 */
export function buildInheritanceDenormPolicy({
  schema = 'dbo',
  table,
  columns,
  pkColumn = 'id',
  branchColumn = 'branch_id',
  fkColumn,
  parentTable,
  parentKey = 'id',
  parentBranchColumn = 'branch_id',
}) {
  for (const [v, role] of [
    [schema, 'schema'], [table, 'table'], [pkColumn, 'pkColumn'], [branchColumn, 'branchColumn'],
    [fkColumn, 'fkColumn'], [parentTable, 'parentTable'], [parentKey, 'parentKey'],
    [parentBranchColumn, 'parentBranchColumn'],
  ]) assertIdent(v, role);
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new Error(`buildInheritanceDenormPolicy: 'columns' (the table's insertable columns, excluding ${branchColumn}) is required for ${table}`);
  }
  // Carry through every supplied column; ensure pk + fk are present; never the
  // derived branch column (it comes from the parent). De-dup, preserve order.
  const carried = [];
  for (const c of [pkColumn, fkColumn, ...columns]) {
    assertIdent(c, 'column');
    if (c !== branchColumn && !carried.includes(c)) carried.push(c);
  }
  const insertCols = [...carried, branchColumn];
  const selectCols = [...carried.map((c) => `i.${c}`), `p.${parentBranchColumn}`];
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
    // ALL caller columns are carried through; a missing parent FAILS LOUDLY
    // (LEFT JOIN + THROW) rather than silently dropping the row.
    `CREATE TRIGGER ${insTrg} ON ${schema}.${table} INSTEAD OF INSERT AS`,
    `BEGIN`,
    `    SET NOCOUNT ON;`,
    `    IF EXISTS (SELECT 1 FROM inserted AS i`,
    `               LEFT JOIN ${schema}.${parentTable} AS p ON p.${parentKey} = i.${fkColumn}`,
    `               WHERE p.${parentKey} IS NULL)`,
    `        THROW 50001, 'denorm insert: FK parent not found (cannot derive ${branchColumn})', 1;`,
    // Primary cross-branch write defence: the branch_id derived from the parent
    // MUST equal the session branch, unless this is the audited bypass path
    // (ADR-020). A NULL session branch matches nothing, so it is fail-closed.
    // Set-based (EXISTS over the join) so it holds for multi-row inserts.
    `    IF (${SESSION_BYPASS} IS NULL OR ${SESSION_BYPASS} = 0)`,
    `       AND EXISTS (SELECT 1 FROM inserted AS i`,
    `                   JOIN ${schema}.${parentTable} AS p ON p.${parentKey} = i.${fkColumn}`,
    `                   WHERE p.${parentBranchColumn} <> ${SESSION_BRANCH}`,
    `                      OR ${SESSION_BRANCH} IS NULL)`,
    `        THROW 53000, 'cross-branch write blocked: derived ${branchColumn} <> session branch', 1;`,
    `    INSERT INTO ${schema}.${table} (${insertCols.join(', ')})`,
    `    SELECT ${selectCols.join(', ')}`,
    `    FROM inserted AS i`,
    `    JOIN ${schema}.${parentTable} AS p ON p.${parentKey} = i.${fkColumn};`,
    `END;`,
    `GO`,
    // FILTER on read; BLOCK on INSERT and UPDATE. The AFTER INSERT block is a
    // DB backstop to the in-trigger guard above: the INSTEAD OF trigger has
    // already populated branch_id, so by the time the inner INSERT's AFTER
    // predicate evaluates the row carries the derived value and a legitimate
    // same-branch insert passes while a cross-branch one is rejected.
    `CREATE SECURITY POLICY ${schema}.sp_${table}`,
    `    ADD FILTER PREDICATE ${fn}(${branchColumn}) ON ${schema}.${table},`,
    `    ADD BLOCK PREDICATE ${fn}(${branchColumn}) ON ${schema}.${table} AFTER INSERT,`,
    `    ADD BLOCK PREDICATE ${fn}(${branchColumn}) ON ${schema}.${table} AFTER UPDATE`,
    `    WITH (STATE = ON);`,
    `GO`,
  ].join('\n');
}

/**
 * RLS DDL for a table that OWNS an organisation_id column and is scoped to the
 * session org (NOT a branch). Use this only when the table actually has the
 * organisation_id column on the row; an inheritance table that merely *reaches*
 * organisation_id through an FK chain must use buildOrgInheritanceTvfPredicate
 * instead (it has no such column to bind).
 * @param {{ schema?: string, table: string, orgColumn?: string }} opts
 */
export function buildOrgScopedPolicy({ schema = 'dbo', table, orgColumn = 'organisation_id' }) {
  for (const [v, role] of [[schema, 'schema'], [table, 'table'], [orgColumn, 'orgColumn']]) assertIdent(v, role);
  const fn = `${schema}.fn_rls_${table}`;
  return [
    `CREATE FUNCTION ${fn}(@${orgColumn} uniqueidentifier)`,
    `    RETURNS TABLE WITH SCHEMABINDING`,
    `AS RETURN SELECT 1 AS rls_ok WHERE @${orgColumn} = ${SESSION_ORG} OR ${SESSION_BYPASS} = 1;`,
    `GO`,
    `CREATE SECURITY POLICY ${schema}.sp_${table}`,
    `    ADD FILTER PREDICATE ${fn}(${orgColumn}) ON ${schema}.${table},`,
    `    ADD BLOCK PREDICATE ${fn}(${orgColumn}) ON ${schema}.${table} AFTER INSERT,`,
    `    ADD BLOCK PREDICATE ${fn}(${orgColumn}) ON ${schema}.${table} AFTER UPDATE`,
    `    WITH (STATE = ON);`,
    `GO`,
  ].join('\n');
}

/**
 * RLS DDL for an ORG-scoped INHERITANCE table (e.g. patient_allergies): it has
 * NO organisation_id column and reaches the org through its FK parent
 * (patient_id -> patient_patients.organisation_id). The predicate binds the FK
 * column the row DOES have and joins the parent to reach organisation_id,
 * mirroring buildInheritanceTvfPredicate but resolving to the session org.
 * @param {{ schema?: string, table: string, fkColumn: string, parentTable: string, parentKey?: string, parentOrgColumn?: string }} o
 */
export function buildOrgInheritanceTvfPredicate({
  schema = 'dbo',
  table,
  fkColumn,
  parentTable,
  parentKey = 'id',
  parentOrgColumn = 'organisation_id',
}) {
  return buildInheritanceTvf({
    schema, table, fkColumn, parentTable, parentKey,
    parentScopeColumn: parentOrgColumn, sessionFn: SESSION_ORG,
  });
}

/**
 * AFTER UPDATE maintenance for the denormalised branch_id: if a row's FK parent
 * changes, re-derive branch_id so it stays consistent. Set-based and multi-row
 * safe. NOTE: re-homing a row across branches via parent_id change is itself
 * subject to the AFTER UPDATE block predicate, so it can only succeed within the
 * session branch (or audited bypass). Migrations SHOULD also index
 * (${fkColumn}) on hot tables; the trigger joins the parent on every update.
 * @param {{ schema?: string, table: string, pkColumn?: string, branchColumn?: string, fkColumn: string, parentTable: string, parentKey?: string, parentBranchColumn?: string }} o
 */
export function buildDenormBranchTrigger({
  schema = 'dbo',
  table,
  pkColumn = 'id',
  branchColumn = 'branch_id',
  fkColumn,
  parentTable,
  parentKey = 'id',
  parentBranchColumn = 'branch_id',
}) {
  for (const [v, role] of [
    [schema, 'schema'], [table, 'table'], [pkColumn, 'pkColumn'], [branchColumn, 'branchColumn'],
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
    `    JOIN inserted AS i ON i.${pkColumn} = t.${pkColumn}`,
    `    JOIN ${schema}.${parentTable} AS p ON p.${parentKey} = t.${fkColumn};`,
    `END;`,
    `GO`,
  ].join('\n');
}

/**
 * RLS DDL for a table whose visibility is the current USER's BRANCH GRANT SET
 * (e.g. core_branches): a user may legitimately span multiple branches, so the
 * predicate is membership of the keyed branch in THIS USER's grants — keyed by
 * the session user, not by the single session branch. Reads therefore return
 * EVERY branch the user is granted (not just the active one).
 * @param {{ schema?: string, table: string, keyColumn?: string, grantTable?: string, grantBranchColumn?: string, grantUserColumn?: string }} opts
 */
export function buildBranchSetPolicy({
  schema = 'dbo',
  table,
  keyColumn = 'id',
  grantTable = 'core_branch_users',
  grantBranchColumn = 'branch_id',
  grantUserColumn = 'user_id',
}) {
  for (const [v, role] of [
    [schema, 'schema'], [table, 'table'], [keyColumn, 'keyColumn'],
    [grantTable, 'grantTable'], [grantBranchColumn, 'grantBranchColumn'],
    [grantUserColumn, 'grantUserColumn'],
  ]) assertIdent(v, role);
  const fn = `${schema}.fn_rls_${table}`;
  return [
    `CREATE FUNCTION ${fn}(@${keyColumn} uniqueidentifier)`,
    `    RETURNS TABLE WITH SCHEMABINDING`,
    `AS RETURN`,
    `    SELECT 1 AS rls_ok`,
    `    WHERE ${SESSION_BYPASS} = 1`,
    // Membership of the keyed branch in the CURRENT USER's grant set. The user
    // (not the active branch) is the key, so a multi-branch user sees all their
    // granted branches.
    `       OR EXISTS (SELECT 1 FROM ${schema}.${grantTable} AS g`,
    `                  WHERE g.${grantBranchColumn} = @${keyColumn}`,
    `                    AND g.${grantUserColumn} = ${SESSION_USER_ID});`,
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
// Internal: join-based TVF predicate that resolves a scope column on the FK
// parent against a session function. Both the branch and org inheritance TVFs
// are this exact shape; they differ only in the session function and the parent
// scope column, so they share one implementation (SOLID/DRY) and can't drift.
function buildInheritanceTvf({
  schema = 'dbo',
  table,
  fkColumn,
  parentTable,
  parentKey = 'id',
  parentScopeColumn,
  sessionFn,
}) {
  for (const [v, role] of [
    [schema, 'schema'], [table, 'table'], [fkColumn, 'fkColumn'],
    [parentTable, 'parentTable'], [parentKey, 'parentKey'], [parentScopeColumn, 'parentScopeColumn'],
  ]) assertIdent(v, role);
  const fn = `${schema}.fn_rls_${table}`;
  return [
    `CREATE FUNCTION ${fn}(@${fkColumn} uniqueidentifier)`,
    `    RETURNS TABLE WITH SCHEMABINDING`,
    `AS RETURN`,
    `    SELECT 1 AS rls_ok`,
    `    FROM ${schema}.${parentTable} AS p`,
    `    WHERE p.${parentKey} = @${fkColumn}`,
    `      AND (p.${parentScopeColumn} = ${sessionFn} OR ${SESSION_BYPASS} = 1);`,
    `GO`,
    `CREATE SECURITY POLICY ${schema}.sp_${table}`,
    `    ADD FILTER PREDICATE ${fn}(${fkColumn}) ON ${schema}.${table},`,
    `    ADD BLOCK PREDICATE ${fn}(${fkColumn}) ON ${schema}.${table} AFTER INSERT,`,
    `    ADD BLOCK PREDICATE ${fn}(${fkColumn}) ON ${schema}.${table} AFTER UPDATE`,
    `    WITH (STATE = ON);`,
    `GO`,
  ].join('\n');
}

export function buildInheritanceTvfPredicate({
  schema = 'dbo',
  table,
  fkColumn,
  parentTable,
  parentKey = 'id',
  parentBranchColumn = 'branch_id',
}) {
  return buildInheritanceTvf({
    schema, table, fkColumn, parentTable, parentKey,
    parentScopeColumn: parentBranchColumn, sessionFn: SESSION_BRANCH,
  });
}
