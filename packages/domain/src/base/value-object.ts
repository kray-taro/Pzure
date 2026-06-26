/**
 * Base ValueObject: structural equality, immutable by convention.
 *
 * SRP: models a descriptive concept with no identity (e.g. Money, BranchId,
 * Quantity). Equality is by value, not reference.
 */
export abstract class ValueObject<TProps extends object> {
  protected readonly props: Readonly<TProps>;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  equals(other?: ValueObject<TProps>): boolean {
    if (other === undefined || other === null) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
