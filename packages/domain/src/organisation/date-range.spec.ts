import { DateRange } from './value-objects/date-range.js';

describe('DateRange', () => {
  const from = new Date('2026-01-01T00:00:00Z');
  const to = new Date('2026-12-31T00:00:00Z');

  it('rejects from after to', () => {
    expect(() => DateRange.of(to, from)).toThrow();
  });

  it('includes boundaries inclusively', () => {
    const r = DateRange.of(from, to);
    expect(r.includes(from)).toBe(true);
    expect(r.includes(to)).toBe(true);
    expect(r.includes(new Date('2027-01-01T00:00:00Z'))).toBe(false);
  });

  it('detects expiry within a horizon', () => {
    const r = DateRange.of(from, new Date('2026-07-10T00:00:00Z'));
    const at = new Date('2026-06-26T00:00:00Z');
    expect(r.expiresWithin(at, 30)).toBe(true);
    expect(r.expiresWithin(at, 5)).toBe(false);
  });
});
