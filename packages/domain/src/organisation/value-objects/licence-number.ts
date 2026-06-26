import { ValueObject } from '../../base/value-object.js';

/** Regulator-issued licence number (PPB, KMPDC, KMLTTB, professional bodies). */
export class LicenceNumber extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  static of(value: string): LicenceNumber {
    const trimmed = (value ?? '').trim();
    if (trimmed.length === 0) {
      throw new Error('LicenceNumber must be a non-empty string');
    }
    return new LicenceNumber(trimmed);
  }

  get value(): string {
    return this.props.value;
  }
}
