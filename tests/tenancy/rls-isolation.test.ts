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
  buildBranchSetPolicy,
  buildOrgInheritanceTvfPredicate,
  buildOrgScopedPolicy,
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
      IF OBJECT_ID('dbo.trg_denorm_ins_t_denorm','TR') IS NOT NULL DROP TRIGGER dbo.trg_denorm_ins_t_denorm;
      IF OBJECT_ID('dbo.trg_denorm_upd_t_denorm','TR') IS NOT NULL DROP TRIGGER dbo.trg_denorm_upd_t_denorm;
      IF OBJECT_ID('dbo.fn_rls_t_child','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_child;
      IF OBJECT_ID('dbo.fn_rls_t_denorm','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_denorm;
      IF OBJECT_ID('dbo.fn_rls_t_direct','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_direct;
      IF OBJECT_ID('dbo.sp_t_branches','SP') IS NOT NULL DROP SECURITY POLICY dbo.sp_t_branches;
      IF OBJECT_ID('dbo.sp_t_allergy','SP') IS NOT NULL DROP SECURITY POLICY dbo.sp_t_allergy;
      IF OBJECT_ID('dbo.fn_rls_t_branches','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_branches;
      IF OBJECT_ID('dbo.fn_rls_t_allergy','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_allergy;
      IF OBJECT_ID('dbo.t_child','U') IS NOT NULL DROP TABLE dbo.t_child;
      IF OBJECT_ID('dbo.t_denorm','U') IS NOT NULL DROP TABLE dbo.t_denorm;
      IF OBJECT_ID('dbo.sp_t_orgmaster','SP') IS NOT NULL DROP SECURITY POLICY dbo.sp_t_orgmaster;
      IF OBJECT_ID('dbo.fn_rls_t_orgmaster','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_orgmaster;
      IF OBJECT_ID('dbo.t_orgmaster','U') IS NOT NULL DROP TABLE dbo.t_orgmaster;
      IF OBJECT_ID('dbo.t_allergy','U') IS NOT NULL DROP TABLE dbo.t_allergy;
      IF OBJECT_ID('dbo.t_patients','U') IS NOT NULL DROP TABLE dbo.t_patients;
      IF OBJECT_ID('dbo.t_branch_users','U') IS NOT NULL DROP TABLE dbo.t_branch_users;
      IF OBJECT_ID('dbo.t_branches','U') IS NOT NULL DROP TABLE dbo.t_branches;
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
        // Every insertable column except the derived branch_id must be carried.
        columns: ['parent_id', 'label'],
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
    // The non-key column MUST survive the INSTEAD OF insert (data-loss guard),
    // and branch_id must have been derived from the parent.
    const aRead = await db.asBranch(
      BRANCH_A,
      `SELECT label, branch_id FROM dbo.t_denorm WHERE label = 'good-denorm';`,
    );
    expect(aRead.recordset.length).toBe(1);
    expect(aRead.recordset[0].label).toBe('good-denorm');
    expect(String(aRead.recordset[0].branch_id).toLowerCase()).toBe(BRANCH_A);
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

  it('T8 branch grant set: a multi-branch user sees ALL granted branches, not just the session branch', async () => {
    // core_branches-style grant-set scoping. A user granted both branches must
    // see both core_branches rows even while their session branch is A — the
    // defect the single-branch predicate would hide.
    const USER = '33333333-3333-3333-3333-333333333333';
    await db.raw(`
      CREATE TABLE dbo.t_branches (id uniqueidentifier NOT NULL PRIMARY KEY, label nvarchar(50) NULL);
      CREATE TABLE dbo.t_branch_users (user_id uniqueidentifier NOT NULL, branch_id uniqueidentifier NOT NULL);
      INSERT INTO dbo.t_branches (id, label) VALUES ('${BRANCH_A}', 'branch-A'), ('${BRANCH_B}', 'branch-B');
      INSERT INTO dbo.t_branch_users (user_id, branch_id) VALUES ('${USER}', '${BRANCH_A}'), ('${USER}', '${BRANCH_B}');
    `);
    await db.raw(
      buildBranchSetPolicy({ table: 't_branches', grantTable: 't_branch_users', grantBranchColumn: 'branch_id', grantUserColumn: 'user_id' }),
    );
    // Session branch is A, but the user is granted A and B -> sees both.
    const seen = await db.asBranch(BRANCH_A, 'SELECT label FROM dbo.t_branches ORDER BY label;', { userId: USER });
    expect(seen.recordset.map((x: { label: string }) => x.label)).toEqual(['branch-A', 'branch-B']);
    // A user with no grants sees none (fail-closed), regardless of session branch.
    const none = await db.asBranch(BRANCH_A, 'SELECT COUNT(*) AS n FROM dbo.t_branches;', { userId: '44444444-4444-4444-4444-444444444444' });
    expect(none.recordset[0].n).toBe(0);
    // A NULL user_id (dropped/unauth JWT claim) must also see zero (fail-closed),
    // never widen visibility to the session branch.
    const nullUser = await db.asBranch(BRANCH_A, 'SELECT COUNT(*) AS n FROM dbo.t_branches;', { userId: null });
    expect(nullUser.recordset[0].n).toBe(0);
  });

  it('T9 org-scoped inheritance: a child with no org column is isolated by org via its FK parent', async () => {
    // patient_allergies-style: t_allergy (FK patient_id) reaches organisation_id
    // through t_patients. Two orgs; a session scoped to org-1 sees only its row.
    const ORG1 = '55555555-5555-5555-5555-555555555555';
    const ORG2 = '66666666-6666-6666-6666-666666666666';
    await db.raw(`
      CREATE TABLE dbo.t_patients (id uniqueidentifier NOT NULL PRIMARY KEY, organisation_id uniqueidentifier NOT NULL);
      CREATE TABLE dbo.t_allergy  (id uniqueidentifier NOT NULL PRIMARY KEY, patient_id uniqueidentifier NOT NULL REFERENCES dbo.t_patients(id), label nvarchar(50) NULL);
      DECLARE @p1 uniqueidentifier = NEWID(), @p2 uniqueidentifier = NEWID();
      INSERT INTO dbo.t_patients (id, organisation_id) VALUES (@p1, '${ORG1}'), (@p2, '${ORG2}');
      INSERT INTO dbo.t_allergy (id, patient_id, label) VALUES (NEWID(), @p1, 'org1-allergy'), (NEWID(), @p2, 'org2-allergy');
    `);
    await db.raw(
      buildOrgInheritanceTvfPredicate({ table: 't_allergy', fkColumn: 'patient_id', parentTable: 't_patients', parentKey: 'id', parentOrgColumn: 'organisation_id' }),
    );
    // Route through the parameterised asOrg helper (no interpolated SQL).
    const r1 = await db.asOrg(ORG1, 'SELECT label FROM dbo.t_allergy;');
    expect(r1.recordset.map((x: { label: string }) => x.label)).toEqual(['org1-allergy']);
    // No org context -> fail-closed (zero rows), never cross-org leak.
    const none = await db.asOrg(null, 'SELECT COUNT(*) AS n FROM dbo.t_allergy;');
    expect(none.recordset[0].n).toBe(0);
  });

  it('T10 org-private master: org-scoped reference PII (e.g. patient_patients/core_users) is NOT cross-org readable', async () => {
    // The leak finding: a `master` table that OWNS organisation_id must carry an
    // org RLS policy, not be globally visible. t_orgmaster models that.
    const ORG1 = '77777777-7777-7777-7777-777777777777';
    const ORG2 = '88888888-8888-8888-8888-888888888888';
    await db.raw(`
      IF OBJECT_ID('dbo.sp_t_orgmaster','SP') IS NOT NULL DROP SECURITY POLICY dbo.sp_t_orgmaster;
      IF OBJECT_ID('dbo.fn_rls_t_orgmaster','IF') IS NOT NULL DROP FUNCTION dbo.fn_rls_t_orgmaster;
      IF OBJECT_ID('dbo.t_orgmaster','U') IS NOT NULL DROP TABLE dbo.t_orgmaster;
      CREATE TABLE dbo.t_orgmaster (id uniqueidentifier NOT NULL PRIMARY KEY, organisation_id uniqueidentifier NOT NULL, label nvarchar(50) NULL);
      INSERT INTO dbo.t_orgmaster (id, organisation_id, label) VALUES (NEWID(), '${ORG1}', 'org1-pii'), (NEWID(), '${ORG2}', 'org2-pii');
    `);
    // It OWNS organisation_id, so it uses buildOrgScopedPolicy (not a TVF).
    await db.raw(buildOrgScopedPolicy({ table: 't_orgmaster', orgColumn: 'organisation_id' }));
    const seen = await db.asOrg(ORG1, 'SELECT label FROM dbo.t_orgmaster;');
    expect(seen.recordset.map((x: { label: string }) => x.label)).toEqual(['org1-pii']);
    // Org-2 must see zero of org-1's rows (no cross-org leak).
    const cross = await db.asOrg(ORG1, `SELECT COUNT(*) AS n FROM dbo.t_orgmaster WHERE label = 'org2-pii';`);
    expect(cross.recordset[0].n).toBe(0);
    const nullOrg = await db.asOrg(null, 'SELECT COUNT(*) AS n FROM dbo.t_orgmaster;');
    expect(nullOrg.recordset[0].n).toBe(0);
  });
});
