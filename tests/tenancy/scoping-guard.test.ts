// ADR-001 §6.4 test 7 — runs the tenancy migration guard as a required,
// coverage-emitting test, and asserts the highest-value invariants directly so
// failures point at one cause.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { VALID_CLASSES } from '../../scripts/lib/tenancy-classes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..', '..');
const GUARD = join(ROOT, 'scripts', 'check-tenancy-scoping.mjs');
const MAP = JSON.parse(readFileSync(join(ROOT, 'DOCS', 'tenancy-scoping.json'), 'utf8'));

describe('ADR-001 §6.4 tenancy scoping guard (test 7)', () => {
  it('passes the migration guard against the current ERD + classification', () => {
    // Throws (non-zero exit) and fails the test if any table is unclassified or
    // a chain is broken — i.e. the guard is genuinely exercised here.
    const out = execFileSync('node', [GUARD], { cwd: ROOT, encoding: 'utf8' });
    expect(out).toMatch(/OK: tenancy scoping complete/);
  });

  it('only uses known scoping classes', () => {
    for (const [name, entry] of Object.entries<Record<string, string>>(MAP.tables)) {
      expect(VALID_CLASSES.has(entry.class), `${name} has class ${entry.class}`).toBe(true);
    }
  });

  it('every transactional table declares how it reaches a branch', () => {
    for (const [name, entry] of Object.entries<Record<string, string>>(MAP.tables)) {
      if (entry.class === 'direct') {
        expect(entry.branchColumn, `${name} direct needs branchColumn`).toBeTruthy();
      } else if (entry.class === 'inheritance') {
        expect(entry.fk, `${name} inheritance needs fk`).toBeTruthy();
        expect(entry.parent, `${name} inheritance needs parent`).toBeTruthy();
      }
    }
  });
});
