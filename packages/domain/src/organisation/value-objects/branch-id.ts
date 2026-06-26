import { ValueObject } from '../../base/value-object.js';

/** Stable identifier for a branch (ADR-001 branch scoping). */
export class BranchId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  static of(value: string): BranchId {
    if (!value || value.trim().length === 0) {
      throw new Error('BranchId must be a non-empty string');
    }
    return new BranchId(value.trim());
  }

  get value(): string {
    return this.props.value;
  }
}
