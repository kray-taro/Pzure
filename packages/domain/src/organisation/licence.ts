import { DateRange } from './value-objects/date-range.js';
import { LicenceNumber } from './value-objects/licence-number.js';

/**
 * Regulator licence types relevant to Module 1 (#15):
 *  - PPB: Pharmacy & Poisons Board premise licence (gates dispensing)
 *  - KMPDC: facility licence (gates consult signing)
 *  - KMLTTB: lab licence (gates lab sign-off)
 *  - BUSINESS: business registration
 */
export type LicenceType = 'PPB' | 'KMPDC' | 'KMLTTB' | 'BUSINESS';

/**
 * Licence value object. Validity is a pure function of the licence's date range
 * and the evaluation time — no hidden state, no clock reads inside the model
 * (the caller supplies `at`, sourced from the Clock port). This keeps the
 * invariants in #15 deterministic and unit-testable.
 */
export class Licence {
  constructor(
    readonly type: LicenceType,
    readonly number: LicenceNumber,
    readonly validity: DateRange,
  ) {}

  isValidAt(at: Date): boolean {
    return this.validity.includes(at);
  }

  isExpiringWithin(at: Date, days: number): boolean {
    return this.validity.expiresWithin(at, days);
  }
}
