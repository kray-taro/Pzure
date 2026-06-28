// Minimal mermaid-erDiagram parser for DOCS/Unified_ERD.md (no dependencies).
// Extracts table names, their columns, and the relationship edges so the
// tenancy guard can cross-check the classification against the real ERD.
//
// It intentionally parses only what the guard needs (table -> columns, and
// `A ||--o{ B` style relationships); it is not a general mermaid parser.
import { readFileSync } from 'node:fs';

/**
 * @typedef {{ columns: Array<{ type: string, name: string, key: string }> }} Table
 * @typedef {{ from: string, to: string }} Relationship
 * @typedef {{ tables: Record<string, Table>, relationships: Relationship[] }} Erd
 */

const REL_RE = /^([A-Za-z0-9_]+)\s*\|\|--o\{\s*([A-Za-z0-9_]+)\s*:/;
const TABLE_OPEN_RE = /^([A-Za-z0-9_]+)\s*\{$/;
const COLUMN_RE = /^([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)(?:\s+(PK|FK|UK))?\s*$/;

/** @param {string} path @returns {Erd} */
export function parseErd(path) {
  const text = readFileSync(path, 'utf8');
  /** @type {Record<string, Table>} */
  const tables = {};
  /** @type {Relationship[]} */
  const relationships = [];

  let current = null; // table name while inside a `{ ... }` block

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;

    if (current) {
      if (line === '}') {
        current = null;
        continue;
      }
      const col = line.match(COLUMN_RE);
      if (col) {
        tables[current].columns.push({ type: col[1], name: col[2], key: col[3] ?? '' });
      }
      continue;
    }

    const open = line.match(TABLE_OPEN_RE);
    if (open) {
      current = open[1];
      if (!tables[current]) tables[current] = { columns: [] };
      continue;
    }

    const rel = line.match(REL_RE);
    if (rel) {
      relationships.push({ from: rel[1], to: rel[2] });
      // Ensure both endpoints exist even if declared only via a relationship.
      for (const t of [rel[1], rel[2]]) if (!tables[t]) tables[t] = { columns: [] };
    }
  }

  return { tables, relationships };
}

/** @param {Table} table @param {string} columnName */
export function hasColumn(table, columnName) {
  return table.columns.some((c) => c.name === columnName);
}
