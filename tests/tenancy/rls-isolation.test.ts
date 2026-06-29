// ADR-001 §6.4 — live RLS isolation tests (T1–T6).
//
// These run against a REAL SQL Server and exercise the REAL RLS DDL produced by
// scripts/lib/rls-sql.mjs (the same generator the production migration uses).
// A self-contained fixture schema lets them verify the isolation MECHANISM now,
// without waiting for the full business schema. If no database is configured
// they skip explicitly with a logged reason — they never silently pass.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  buildDirectPolicy,
  buildInheritanceDenormPolicy,
  buildInheritanceTvfPredicate,
  buildDenormBranchTrigger,
} from '../../scripts/lib/rls-sql.mjs';
import { connect, dbConfigured, type Db } from './db';

const BRANCH_A = '11111111-1111-1111-1111-111111111111';
const BRANCH_B = '22222222-2222-2222-2222-222222222222';

const run = dbConfigured() ? describe : describe.skip;
if (!dbConfigured()) {
  // Visible, intentional skip — not a silent pass.
  console.warn(
    '[tenancy] SKIPPING live RLS isolation tests T1\u2013T6: set DB_HOST and ' +
      'CI_MSSQL_SA_PASSWORD to run them against a SQL Server service.',
  );
}

run('ADR-001 §6.4 RLS isolation (live SQL Server)', () => {
  let db: Db;

  beforeAll(async () => {
    db = await connect();
    // Fixture schema mirrors the scoping classes from ADR-001 §6.1:
    //   t_direct      -> owns branch_id (like emr_visits/billing_sales)
    //   t_child       -> inheritance via JOIN predicate (parent_id -> t_direct)
    //   t_denorm      -> inheritance via DENORMALISED branch_id maintained by a
    //                    write-time trigger (the PREFERRED, shipping path)
    //   t_master      -> org-scoped reference data (no branch_id)
    await db.raw(`
      IF OBJECT_ID('dbo.sp_t_child','SP') IS NOT NULL DROP SECURITY POLICY dbo.sp_t_child;
      IF OBJECT_ID('dbo.sp_t_denorm','SP') IS NOT NULL DROP SECURITY POLICY dbo.sp_t_denorm;
      IF OBJECT_ID('dbo.sp_t_direct','SP') IS NOT NULL DROP SECURITY POLICY dbo.sp_t_direct;
      IF OBJECT_ID('dbo.trg_denorm_t_denorm','TR') IS NOT NULL DROP TRIGGER dbo.trg_denorm_t_denorm;
      IF OBJECT_ID('dbo.fn_rls_t_child','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_child;
      IF OBJECT_ID('dbo.fn_rls_t_denorm','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_denorm;
      IF OBJECT_ID('dbo.fn_rls_t_direct','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_direct;
      IF OBJECT_ID('dbo.t_child','U') IS NOT NULL DROP TABLE dbo.t_child;
      IF OBJECT_ID('dbo.t_denorm','U') IS NOT NULL DROP TABLE dbo.t_denorm;
      IF OBJECT_ID('dbo.t_direct','U') IS NOT NULL DROP TABLE dbo.t_direct;
      IF OBJECT_ID('dbo.t_master','U') IS NOT NULL DROP TABLE dbo.t_master;
    `);
    await db.raw(`
      CREATE TABLE dbo.t_direct (id uniqueidentifier NOT NULL PRIMARY KEY, branch_id uniqueidentifier NOT NULL, label nvarchar(50) NULL);
      CREATE TABLE dbo.t_child  (id uniqueidentifier NOT NULL PRIMARY KEY, parent_id uniqueidentifier NOT NULL REFERENCES dbo.t_direct(id), label nvarchar(50) NULL);
      CREATE TABLE dbo.t_denorm (id uniqueidentifier NOT NULL PRIMARY KEY, parent_id uniqueidentifier NOT NULL REFERENCES dbo.t_direct(id), branch_id uniqueidentifier NULL, label nvarchar(50) NULL);
      CREATE TABLE dbo.t_master (id uniqueidentifier NOT NULL PRIMARY KEY, organisation_id uniqueidentifier NOT NULL, label nvarchar(50) NULL);
    `);
    // Seed rows for both branches BEFORE policies are enabled (bypass via raw).
    // branch_id on t_denorm is populated explicitly here (pre-policy) so seed
    // rows exist; post-policy inserts go through the INSTEAD OF trigger.
    await db.raw(`
      INSERT INTO dbo.t_direct (id, branch_id, label) VALUES
        (NEWID(), '${BRANCH_A}', 'A-row'),
        (NEWID(), '${BRANCH_B}', 'B-row');
      INSERT INTO dbo.t_child (id, parent_id, label)
        SELECT NEWID(), id, 'child-of-' + label FROM dbo.t_direct;
      INSERT INTO dbo.t_denorm (id, parent_id, branch_id, label)
        SELECT NEWID(), id, branch_id, 'denorm-of-' + label FROM dbo.t_direct;
    `);
    await db.raw(`INSERT INTO dbo.t_master (id, organisation_id, label) VALUES (NEWID(), NEWID(), 'shared-ref');`);
    // Apply the REAL generated policies.
    await db.raw(buildDirectPolicy({ table: 't_direct', branchColumn: 'branch_id' }));
    await db.raw(
      buildInheritanceTvfPredicate({
        table: 't_child',
        fkColumn: 'parent_id',
        parentTable: 't_direct',
        parentKey: 'id',
        parentBranchColumn: 'branch_id',
      }),
    );
    // Denormalised inheritance: INSTEAD OF INSERT derives branch_id (the real
    // shipping mechanism), FILTER on read, BLOCK on UPDATE. Plus the UPDATE
    // maintenance trigger for FK re-pointing.
    await db.raw(
      buildInheritanceDenormPolicy({
        table: 't_denorm',
        branchColumn: 'branch_id',
        fkColumn: 'parent_id',
        parentTable: 't_direct',
        parentKey: 'id',
        parentBranchColumn: 'branch_id',
      }),
    );
    await db.raw(
      buildDenormBranchTrigger({
        table: 't_denorm',
        branchColumn: 'branch_id',
        fkColumn: 'parent_id',
        parentTable: 't_direct',
        parentKey: 'id',
        parentBranchColumn: 'branch_id',
      }),
    );
  }, 60_000);

  afterAll(async () => {
    if (db) await db.pool.close();
  });

  it('T1 positive scope: Branch A sees only its own rows', async () => {
    const r = await db.asBranch(BRANCH_A, 'SELECT label FROM dbo.t_direct;');
    expect(r.recordset.map((x: { label: string }) => x.label)).toEqual(['A-row']);
  });

  it('T2 negative cross-branch read: Branch A sees zero Branch B rows (no existence leak)', async () => {
    const r = await db.asBranch(
      BRANCH_A,
      `SELECT COUNT(*) AS n FROM dbo.t_direct WHERE label = 'B-row';`,
    );
    expect(r.recordset[0].n).toBe(0);
  });

  it('T3 negative cross-branch write: BLOCK predicate rejects writing another branch', async () => {
    // direct: insert claiming Branch B while scoped to A -> blocked.
    await expect(
      db.asBranch(BRANCH_A, `INSERT INTO dbo.t_direct (id, branch_id, label) VALUES (NEWID(), '${BRANCH_B}', 'evil');`),
    ).rejects.toThrow();
    // inheritance: child whose parent is a Branch B row, while scoped to A -> blocked.
    const parentB = (await db.raw(`SELECT TOP 1 id FROM dbo.t_direct WHERE branch_id = '${BRANCH_B}';`)).recordset[0]
      .id as string;
    await expect(
      db.asBranch(BRANCH_A, `INSERT INTO dbo.t_child (id, parent_id, label) VALUES (NEWID(), '${parentB}', 'evil-child');`),
    ).rejects.toThrow();
  });

  it('T4 forgotten-filter backstop: unscoped SELECT is still branch-isolated by RLS', async () => {
    // No WHERE branch_id = ... ; the RLS filter predicate must still restrict.
    const r = await db.asBranch(BRANCH_B, 'SELECT label FROM dbo.t_direct;');
    expect(r.recordset.map((x: { label: string }) => x.label)).toEqual(['B-row']);
  });

  it('T5 corporate bypass only via explicit, auditable session flag', async () => {
    // Without bypass: scoped. With explicit bypass flag: sees all (caller must
    // pair this with an audit event — ADR-020). Proves bypass is never default.
    const scoped = await db.asBranch(BRANCH_A, 'SELECT COUNT(*) AS n FROM dbo.t_direct;');
    expect(scoped.recordset[0].n).toBe(1);
    const bypass = await db.asBranch(BRANCH_A, 'SELECT COUNT(*) AS n FROM dbo.t_direct;', { bypass: true });
    expect(bypass.recordset[0].n).toBe(2);
  });

  it('T6 master vs transactional: org-scoped reference data is not branch-filtered', async () => {
    // t_master has no RLS policy (org-scoped); visible regardless of branch ctx.
    const a = await db.asBranch(BRANCH_A, 'SELECT COUNT(*) AS n FROM dbo.t_master;');
    const b = await db.asBranch(BRANCH_B, 'SELECT COUNT(*) AS n FROM dbo.t_master;');
    expect(a.recordset[0].n).toBe(1);
    expect(b.recordset[0].n).toBe(1);
  });

  it('T7 denormalised inheritance read isolation: Branch A sees only its row', async () => {
    const aRead = await db.asBranch(BRANCH_A, 'SELECT label FROM dbo.t_denorm;');
    expect(aRead.recordset.map((x: { label: string }) => x.label)).toEqual(['denorm-of-A-row']);
  });

  it('T7a denormalised inheritance POSITIVE write: a same-branch insert SUCCEEDS', async () => {
    // Regression guard for the AFTER-INSERT-block ordering bug: the INSTEAD OF
    // trigger must derive branch_id from the (Branch A) parent so the insert is
    // accepted. If the denorm policy ever reverts to an AFTER INSERT block, the
    // row's branch_id is NULL at predicate time and THIS insert fails.
    const parentA = (await db.raw(`SELECT TOP 1 id FROM dbo.t_direct WHERE branch_id = '${BRANCH_A}';`))
      .recordset[0].id as string;
    await expect(
      db.asBranch(BRANCH_A, `INSERT INTO dbo.t_denorm (id, parent_id, label) VALUES (NEWID(), '${parentA}', 'good-denorm');`),
    ).resolves.toBeDefined();
    const aRead = await db.asBranch(BRANCH_A, `SELECT COUNT(*) AS n FROM dbo.t_denorm WHERE label = 'good-denorm';`);
    expect(aRead.recordset[0].n).toBe(1);
  });

  it('T7b denormalised inheritance NEGATIVE write: a cross-branch insert is rejected', async () => {
    // Parent is a Branch B row; under Branch A the INSTEAD OF trigger derives
    // branch_id = B, which the write path must reject (not the NULL backstop).
    const parentB = (await db.raw(`SELECT TOP 1 id FROM dbo.t_direct WHERE branch_id = '${BRANCH_B}';`))
      .recordset[0].id as string;
    await expect(
      db.asBranch(BRANCH_A, `INSERT INTO dbo.t_denorm (id, parent_id, label) VALUES (NEWID(), '${parentB}', 'evil-denorm');`),
    ).rejects.toThrow();
    // And the evil row must not be visible to anyone scoped to A.
    const aRead = await db.asBranch(BRANCH_A, `SELECT COUNT(*) AS n FROM dbo.t_denorm WHERE label = 'evil-denorm';`);
    expect(aRead.recordset[0].n).toBe(0);
  });
});
