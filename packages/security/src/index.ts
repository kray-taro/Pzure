/**
 * @pzure/security barrel.
 *
 * Public surface for the ADR-001 branch-tenancy invariants. Keep this thin: it
 * re-exports the scoping-class registry (the single source of truth) and the
 * pure chain resolver. The SQL RLS policies and the NestJS session-context
 * plumbing live in the backend package delivered under #70 and consume these
 * declarations so the application and the database agree on one classification.
 */
export * from './scope-registry';
export * from './resolve-chain';
