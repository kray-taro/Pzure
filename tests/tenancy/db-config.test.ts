// Guards the 'never silently pass' contract: when DB creds are absent,
// dbConfigured() must be false (so the live suite skips) and the absence is
// observable. No DB connection is made here.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { dbConfigured } from './db';

const SAVED = { ...process.env };
afterEach(() => {
  process.env = { ...SAVED };
  vi.restoreAllMocks();
});

describe('dbConfigured()', () => {
  it('is false when DB_HOST is unset (live suite will skip, not pass)', () => {
    delete process.env.DB_HOST;
    expect(dbConfigured()).toBe(false);
  });

  it('is false when a password is present but DB_HOST is not', () => {
    delete process.env.DB_HOST;
    process.env.CI_MSSQL_SA_PASSWORD = 'x';
    expect(dbConfigured()).toBe(false);
  });

  it('is true only when host AND a password are present', () => {
    process.env.DB_HOST = 'mssql';
    process.env.CI_MSSQL_SA_PASSWORD = 'x';
    expect(dbConfigured()).toBe(true);
  });
});
