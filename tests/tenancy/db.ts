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
    // query. Bind branch_id/bypass as parameters (no string interpolation) so
    // the helper itself models the parameterised pattern the app must use.
    const request = pool.request();
    request.input('p_branch_id', sql.UniqueIdentifier, branchId);
    request.input('p_bypass', sql.Bit, opts?.bypass ? 1 : null);
    const preamble =
      "EXEC sp_set_session_context @key=N'branch_id', @value=@p_branch_id;\n" +
      "EXEC sp_set_session_context @key=N'tenancy_bypass', @value=@p_bypass;\n";
    return request.query<T>(`${preamble}${query}`);
  }

  return {
    pool,
    asBranch,
    raw: (query: string) => pool.request().query(query),
  };
}
