/**
 * Cache port. No direct cache calls in business logic — always behind this
 * abstraction. TTL/invalidation strategy is defined per use case in Phase 4.
 */
export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}
