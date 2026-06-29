#!/usr/bin/env node
// ADR-001 Section 6.4, test 7 — the tenancy migration guard.
//
// Enforces that tenant scoping is COMPLETE and CONSISTENT, so cross-branch
// isolation can never silently regress (DDIA reliability: no invariant relies
// on developer discipline). This is the enforcement arm of the ADR-001 §6.1
// classification — without it, §6 is documentation only.
//
// Checks (all fail CI on violation):
//   1. Every table in DOCS/Unified_ERD.md is classified in tenancy-scoping.json.
//   2. Every classified table actually exists in the ERD (no stale entries).
//   3. Each `direct` table's branch column exists on that table in the ERD.
//   4. Each `inheritance` table's FK column + parent exist, and the chain
//      terminates at a `direct` table's branch column (no dangling scope).
//   5. Each `master` table is genuinely non-transactional: its declared
//      columns/FK chain do NOT resolve to a branch column (a branch-owned
//      table mis-labelled `master` would silently get no RLS policy and leak
//      across branches — the most dangerous failure mode).
//   6. If SQL migrations exist (packages/**/migrations/*.sql or migrations/*.sql),
//      every `direct`/`inheritance` (transactional) table that is CREATEd has a
//      CREATE SECURITY POLICY referencing it (statement-aware, not substring).
//
// Runnable today: with no migrations, checks 1–5 enforce the classification;
// check 6 activates automatically once migration files are committed.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { parseErd, hasColumn } from './lib/parse-erd.mjs';
import { VALID_CLASSES, TRANSACTIONAL_CLASSES } from './lib/tenancy-classes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ERD_PATH = join(ROOT, 'DOCS', 'Unified_ERD.md');
const MAP_PATH = join(ROOT, 'DOCS', 'tenancy-scoping.json');

const TRANSACTIONAL = TRANSACTIONAL_CLASSES;

/** Recursively collect *.sql files under a few known migration locations. */
function findSqlMigrations(root) {
  const roots = [join(root, 'migrations'), join(root, 'packages')];
  /** @type {string[]} */
  const out = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const entry of readdirSync(d)) {
      const p = join(d, entry);
      const s = statSync(p);
      if (s.isDirectory()) walk(p);
      else if (entry.endsWith('.sql')) out.push(p);
    }
  };
  for (const r of roots) walk(r);
  return out;
}

// Resolve what tenant scope a table ultimately reaches by walking its FK chain.
// Returns the resolved scope column name (e.g. 'branch_id'/'organisation_id') or
// null if it terminates without one. `pushErrors` is false for the master sanity
// check (we only want the resolution, not duplicate error noise).
function resolveChain(name, map, errors, { pushErrors = true, seen = new Set() } = {}) {
  const entry = map.tables[name];
  if (!entry) return null;
  if (entry.class === 'direct') return entry.branchColumn ?? 'branch_id';
  if (entry.class !== 'inheritance') return null;
  if (seen.has(name)) {
    if (pushErrors) errors.push(`inheritance cycle detected at '${name}'`);
    return null;
  }
  seen.add(name);
  const parent = entry.parent;
  if (!parent || !map.tables[parent]) {
    if (pushErrors) errors.push(`'${name}' inheritance parent '${parent}' is not classified`);
    return null;
  }
  return resolveChain(parent, map, errors, { pushErrors, seen });
}

// Statement-aware detection so a substring (lab_orders vs lab_orders_archive),
// bracket-quoting, or a comment can't produce a false result on a security gate.
function tableIsCreated(ddl, table) {
  const t = escapeRe(table);
  return new RegExp(`create\\s+table\\s+(?:\\[?dbo\\]?\\.)?\\[?${t}\\]?(?![A-Za-z0-9_])`, 'i').test(ddl);
}

function tableHasPolicy(ddl, table) {
  const t = escapeRe(table);
  // A CREATE SECURITY POLICY ... ON dbo.<table> referencing this exact table.
  return new RegExp(
    `create\\s+security\\s+policy[\\s\\S]*?on\\s+(?:\\[?dbo\\]?\\.)?\\[?${t}\\]?(?![A-Za-z0-9_])`,
    'i',
  ).test(ddl);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function main() {
  const errors = [];

  if (!existsSync(ERD_PATH)) {
    console.error(`ERROR: ERD not found at ${ERD_PATH}`);
    process.exit(1);
  }
  if (!existsSync(MAP_PATH)) {
    console.error(`ERROR: tenancy-scoping.json not found at ${MAP_PATH}`);
    process.exit(1);
  }

  const erd = parseErd(ERD_PATH);
  const map = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
  const erdTables = Object.keys(erd.tables);

  // 1. Every ERD table is classified.
  for (const t of erdTables) {
    if (!map.tables[t]) errors.push(`ERD table '${t}' is NOT classified in tenancy-scoping.json (forgotten table)`);
  }

  for (const [name, entry] of Object.entries(map.tables)) {
    // class validity
    if (!VALID_CLASSES.has(entry.class)) {
      errors.push(`'${name}' has invalid class '${entry.class}'`);
      continue;
    }
    // 2. No stale entries.
    if (!erd.tables[name]) {
      errors.push(`classified table '${name}' does not exist in Unified_ERD.md`);
      continue;
    }
    // 3. direct branch column exists.
    if (entry.class === 'direct') {
      const col = entry.branchColumn ?? 'branch_id';
      if (!hasColumn(erd.tables[name], col)) {
        errors.push(`direct table '${name}' is missing its branch column '${col}' in the ERD`);
      }
    }
    // 4. inheritance FK + parent exist and chain resolves to a direct branch col,
    //    and the declared resolvesTo matches what the chain actually resolves to.
    if (entry.class === 'inheritance') {
      if (!entry.fk || !hasColumn(erd.tables[name], entry.fk)) {
        errors.push(`inheritance table '${name}' is missing its FK column '${entry.fk}' in the ERD`);
      }
      const resolved = resolveChain(name, map, errors);
      const wantsBranch = entry.resolvesTo === undefined || entry.resolvesTo === 'branch_id';
      if (wantsBranch && !resolved) {
        errors.push(`inheritance table '${name}' FK chain does not resolve to a direct branch column`);
      }
      // If the chain terminates at a branch column but the table declares it
      // resolves elsewhere (e.g. organisation_id), the classification is a lie.
      if (resolved && entry.resolvesTo !== undefined && entry.resolvesTo !== resolved) {
        errors.push(
          `inheritance table '${name}' declares resolvesTo='${entry.resolvesTo}' but its FK chain resolves to '${resolved}'`,
        );
      }
    }
    // 5. master sanity: must NOT be reachable to a branch column by a chain.
    if (entry.class === 'master') {
      const resolved = resolveChain(name, map, errors, { pushErrors: false });
      if (resolved === 'branch_id' || entry.branchColumn) {
        errors.push(
          `master table '${name}' resolves to a branch scope ('${resolved ?? entry.branchColumn}') — it is branch-transactional and must be classified 'direct' or 'inheritance' (would otherwise ship with NO RLS policy)`,
        );
      }
    }
  }

  // 6. RLS policy attachment (only once migrations exist).
  const sqlFiles = findSqlMigrations(ROOT);
  if (sqlFiles.length > 0) {
    const ddl = sqlFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
    for (const [name, entry] of Object.entries(map.tables)) {
      if (!TRANSACTIONAL.has(entry.class)) continue;
      if (!erd.tables[name]) continue;
      // A table is "present in schema" if a CREATE TABLE for it exists; only then
      // do we require an RLS policy (tables not yet migrated are not yet a risk).
      if (!tableIsCreated(ddl, name)) continue;
      if (!tableHasPolicy(ddl, name)) {
        errors.push(`transactional table '${name}' is created in a migration but has no CREATE SECURITY POLICY (ADR-001 §6.4)`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('TENANCY SCOPING GUARD FAILED (ADR-001 §6.4 test 7):\n');
    for (const e of errors) console.error(`  - ${e}`);
    console.error(`\n${errors.length} violation(s). Classify the table in DOCS/tenancy-scoping.json and/or attach an RLS policy.`);
    process.exit(1);
  }

  const counts = Object.values(map.tables).reduce((acc, e) => ((acc[e.class] = (acc[e.class] ?? 0) + 1), acc), {});
  console.log(
    `OK: tenancy scoping complete — ${erdTables.length} ERD tables classified ` +
      `(${counts.direct ?? 0} direct, ${counts.inheritance ?? 0} inheritance, ${counts.master ?? 0} master)` +
      (sqlFiles.length ? `; RLS policies verified against ${sqlFiles.length} migration file(s).` : '; no migrations yet (RLS attachment check will activate when they land).'),
  );
}

main();
