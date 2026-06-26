// Application layer: cross-cutting service ports + use-case base.
// Phase 1 defines interfaces only; concrete use cases arrive in Phase 2.
export * from './ports/identity-provider.js';
export * from './ports/encryption-service.js';
export * from './ports/audit-logger.js';
export * from './ports/message-bus.js';
export * from './ports/cache.js';
export * from './ports/search-index.js';
export * from './use-case.js';
export * from './organisation/register-branch.js';
