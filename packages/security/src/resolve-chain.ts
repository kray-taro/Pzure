/**
 * Pure resolver for ADR-001 inheritance-scoped tables.
 *
 * Walks the FK chain declared in the scope registry and proves it terminates at
 * a directly-scoped table's `branch_id`. This is the terminal-agnostic invariant
 * from ADR-001 §6.4 test 7: a chain is valid if it lands on ANY directly-scoped
 * branch_id table - not a hard-coded list of terminals - so the guard stays
 * correct as new chains (e.g. new lab/EMR children) are added.
 *
 * The SQL Server security-predicate functions delivered under #70 implement
 * exactly this resolution (option (b) in ADR-001 §6.4), or denormalise a
 * branch_id (option (a)); either way the chain declared here is the contract.
 */
import { SCOPE_REGISTRY, type ScopeEntry } from './scope-registry';

export interface ChainResolution {
  readonly ok: boolean;
  /** Tables visited from start to terminal (inclusive). */
  readonly path: string[];
  /** The directly-scoped terminal table, when resolved. */
  readonly terminal?: string;
  readonly reason?: string;
}

const MAX_DEPTH = 16; // guards against a mis-declared cyclic chain

/**
 * Resolve a table to the directly-scoped branch_id table that owns its branch.
 * - directly-scoped on branch_id: resolves to itself.
 * - inheritance-scoped: follows `parent` transitively until a branch_id table.
 * - org-scoped or core_branches (predicate on id): not branch-resolvable; the
 *   caller decides whether that is expected for the table's class.
 */
export function resolveBranchTerminal(table: string): ChainResolution {
  const path: string[] = [];
  let current = table;

  for (let depth = 0; depth <= MAX_DEPTH; depth++) {
    const entry: ScopeEntry | undefined = SCOPE_REGISTRY[current];
    if (!entry) {
      return { ok: false, path, reason: `table not in registry: ${current}` };
    }
    path.push(current);

    if (entry.scope === 'directly-scoped') {
      if (entry.predicateColumn === 'branch_id') {
        return { ok: true, path, terminal: current };
      }
      // core_branches: branch identity lives in `id`, not a branch_id chain.
      return { ok: false, path, reason: `${current} is branch-self (predicate on id), not a branch_id terminal` };
    }
    if (entry.scope === 'org-scoped') {
      return { ok: false, path, reason: `${current} is org-scoped, not branch-resolvable` };
    }
    // inheritance-scoped: step to the parent.
    current = entry.parent;
  }

  return { ok: false, path, reason: `chain exceeded max depth (${MAX_DEPTH}); possible cycle from ${table}` };
}
