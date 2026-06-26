/**
 * SearchIndex port. Index updates are event-driven via the message bus to keep
 * the index eventually consistent with the source of truth (Phase 4).
 */
export interface SearchIndex {
  index(id: string, document: Record<string, unknown>): Promise<void>;
  remove(id: string): Promise<void>;
  search(query: string): Promise<readonly string[]>;
}
