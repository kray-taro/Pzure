import { ValueObject } from '../../base/value-object.js';

/**
 * Closed date range [from, to]. Used for licence and contract validity windows.
 * `to` is inclusive. A range with from > to is invalid by construction.
 */
export class DateRange extends ValueObject<{ from: Date; to: Date }> {
  private constructor(from: Date, to: Date) {
    super({ from, to });
  }

  static of(from: Date, to: Date): DateRange {
    if (from.getTime() > to.getTime()) {
      throw new Error('DateRange.from must be on or before DateRange.to');
    }
    return new DateRange(from, to);
  }

  get from(): Date {
    return this.props.from;
  }

  get to(): Date {
    return this.props.to;
  }

  /** True if `at` falls within [from, to] inclusive. */
  includes(at: Date): boolean {
    const t = at.getTime();
    return t >= this.props.from.getTime() && t <= this.props.to.getTime();
  }

  /** True if the range ends within `days` after `at` (for expiry alerts, #15). */
  expiresWithin(at: Date, days: number): boolean {
    const horizon = at.getTime() + days * 24 * 60 * 60 * 1000;
    return this.props.to.getTime() <= horizon && this.props.to.getTime() >= at.getTime();
  }
}
