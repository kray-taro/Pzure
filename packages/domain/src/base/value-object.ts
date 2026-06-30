/**
 * Base ValueObject: structural equality, immutable by convention.
 *
 * SRP: models a descriptive concept with no identity (e.g. Money, BranchId,
 * Quantity). Equality is by value, not reference.
 *
 * Equality is key-order-insensitive: two value objects with the same logical
 * props compare equal regardless of the key insertion order they were built
 * with (e.g. one from a factory, another rehydrated from a DB row).
 */
export abstract class ValueObject<TProps extends object> {
  protected readonly props: Readonly<TProps>;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  equals(other?: ValueObject<TProps>): boolean {
    if (other === undefined || other === null) return false;
    if (this === other) return true;
    return (
      ValueObject.canonicalize(this.props) === ValueObject.canonicalize(other.props)
    );
  }

  /**
   * Stable, order-insensitive serialization: object keys are sorted recursively
   * before stringifying so structurally identical props produce identical
   * strings. Arrays keep their order (order is significant for sequences).
   */
  private static canonicalize(value: unknown): string {
    return JSON.stringify(ValueObject.sortDeep(value));
  }

  private static sortDeep(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => ValueObject.sortDeep(item));
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => [k, ValueObject.sortDeep(v)]),
      );
    }
    return value;
  }
}
