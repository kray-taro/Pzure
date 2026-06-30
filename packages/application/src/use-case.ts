/**
 * UseCase base (SRP + ISP): one class per use case, depending only on the
 * ports it needs. Concrete use cases (Phase 2) implement `execute`.
 */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
