import { AggregateRoot } from '../base/aggregate-root.js';

/**
 * Generic repository port (DIP + ISP).
 *
 * The domain depends on this abstraction; concrete SQL Server repositories live
 * in `infrastructure`. `save` MUST enforce the optimistic-lock version
 * assertion (CONCURRENCY policy §1) and throw ConcurrencyConflictError on
 * mismatch. Implementations MUST apply branch scoping (ADR-001) via BranchScope.
 */
export interface Repository<T extends AggregateRoot<TId>, TId = string> {
  findById(id: TId): Promise<T | null>;
  save(aggregate: T): Promise<void>;
}
