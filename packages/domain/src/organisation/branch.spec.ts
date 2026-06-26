import { Branch, CapabilityBlockedError } from './branch.js';
import { BranchId } from './value-objects/branch-id.js';
import { Licence } from './licence.js';
import { LicenceNumber } from './value-objects/licence-number.js';
import { DateRange } from './value-objects/date-range.js';

const at = new Date('2026-06-26T00:00:00Z');

function ppb(validTo: string): Licence {
  return new Licence(
    'PPB',
    LicenceNumber.of('PPB-123'),
    DateRange.of(new Date('2026-01-01T00:00:00Z'), new Date(validTo)),
  );
}

describe('Branch capability gating (#15)', () => {
  it('a pharmacy with a valid PPB licence can dispense', () => {
    const b = Branch.register({
      branchId: BranchId.of('br-1'),
      type: 'CHEMIST',
      name: 'Main Chemist',
      licences: [ppb('2026-12-31T00:00:00Z')],
    });
    expect(b.can('DISPENSE', at)).toBe(true);
    expect(() => b.assertCan('DISPENSE', at)).not.toThrow();
  });

  it('a pharmacy without a PPB licence is blocked from dispensing', () => {
    const b = Branch.register({ branchId: BranchId.of('br-2'), type: 'CHEMIST', name: 'No Licence' });
    expect(b.can('DISPENSE', at)).toBe(false);
    expect(() => b.assertCan('DISPENSE', at)).toThrow(CapabilityBlockedError);
  });

  it('an expired PPB licence blocks dispensing', () => {
    const b = Branch.register({
      branchId: BranchId.of('br-3'),
      type: 'CHEMIST',
      name: 'Expired',
      licences: [ppb('2026-05-01T00:00:00Z')],
    });
    expect(b.can('DISPENSE', at)).toBe(false);
  });

  it('reports licences expiring within the alert horizon', () => {
    const b = Branch.register({
      branchId: BranchId.of('br-4'),
      type: 'CHEMIST',
      name: 'Expiring Soon',
      licences: [ppb('2026-07-10T00:00:00Z')],
    });
    expect(b.expiringLicences(at, 30)).toHaveLength(1);
    expect(b.expiringLicences(at, 5)).toHaveLength(0);
  });

  it('starts at version 0 (optimistic locking baseline)', () => {
    const b = Branch.register({ branchId: BranchId.of('br-5'), type: 'RETAIL', name: 'Shop' });
    expect(b.version).toBe(0);
  });
});
