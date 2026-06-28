// Test-only SQL Server helper. Connects when DB credentials are present;
// otherwise reports unavailable so suites can SKIP EXPLICITLY (never silently
// pass). No application code depends on this.
import sql from 'mssql';

export interface Db {
  pool: sql.ConnectionPool;
  /** Run a statement under a given branch session context (or bypass). */
  asBranch<T = unknown>(
    branchId: string | null,
    query: string,
    opts?: { bypass?: boolean },
  ): Promise<sql.IResult<T>>;
  raw(query: string): Promise<sql.IResult<unknown>>;
}

export function dbConfigured(): boolean {
  return Boolean(process.env.DB_HOST && (process.env.CI_MSSQL_SA_PASSWORD || process.env.MSSQL_SA_PASSWORD));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function connect(): Promise<Db> {
  const config: sql.config = {
    server: process.env.DB_HOST as string,
    user: 'sa',
    password: (process.env.CI_MSSQL_SA_PASSWORD || process.env.MSSQL_SA_PASSWORD) as string,
    options: { trustServerCertificate: true, encrypt: false },
    pool: { max: 4, min: 0 },
  };

  // SQL Server containers take time to accept connections on cold start. Retry
  // with backoff (~60s budget) so this security gate is reliable, not flaky.
  const deadline = Date.now() + 60_000;
  let lastErr: unknown;
  let pool: sql.ConnectionPool | undefined;
  while (Date.now() < deadline) {
    try {
      pool = await new sql.ConnectionPool(config).connect();
      await pool.request().query('SELECT 1;');
      break;
    } catch (err) {
      lastErr = err;
      if (pool) {
        try { await pool.close(); } catch { /* ignore */ }
        pool = undefined;
      }
      await sleep(2_000);
    }
  }
  if (!pool) {
    throw new Error(`SQL Server not reachable within 60s: ${String(lastErr)}`);
  }

  async function asBranch<T>(branchId: string | null, query: string, opts?: { bypass?: boolean }) {
    // SESSION_CONTEXT must be set on the same connection/request that runs the
    // query. Use a dedicated request and a single batch.
    const setBranch = branchId
      ? `EXEC sp_set_session_context @key=N'branch_id', @value='${branchId}';`
      : `EXEC sp_set_session_context @key=N'branch_id', @value=NULL;`;
    const setBypass = `EXEC sp_set_session_context @key=N'tenancy_bypass', @value=${opts?.bypass ? '1' : 'NULL'};`;
    return pool.request().query<T>(`${setBranch}\n${setBypass}\n${query}`);
  }

  return {
    pool,
    asBranch,
    raw: (query: string) => pool.request().query(query),
  };
}
