// Single source of truth for the tenancy scoping classes (DRY). Imported by the
// guard, its tests, and the JSON schema description so the set is defined once.

/** A `master` table is org-scoped reference data: never branch-partitioned. */
export const MASTER = 'master';
/** A `direct` table owns a branch column scoped by SESSION_CONTEXT('branch_id'). */
export const DIRECT = 'direct';
/** An `inheritance` table reaches a branch via a documented FK chain. */
export const INHERITANCE = 'inheritance';

/** All valid scoping classes. */
export const VALID_CLASSES = new Set([MASTER, DIRECT, INHERITANCE]);
/** Classes whose tables carry tenant data and therefore require RLS. */
export const TRANSACTIONAL_CLASSES = new Set([DIRECT, INHERITANCE]);

/** @param {string} cls @returns {boolean} */
export function isTransactional(cls) {
  return TRANSACTIONAL_CLASSES.has(cls);
}
