/**
 * Token contract test - guarantees ADR-026's required semantic surface exists.
 * Protects against a refactor accidentally dropping a domain group or a touch
 * target, which would silently weaken accessibility / clinical safety.
 */
import { colors, status, clinical, finance, inventory, claims, sync } from './colors.js';
import { touch } from './touch.js';

describe('ADR-026 required semantic colour groups', () => {
  it('exposes all six domain groups via the barrel', () => {
    for (const g of ['status', 'clinical', 'finance', 'inventory', 'claims', 'sync']) {
      expect(colors).toHaveProperty(g);
    }
  });
  it('status has success/warning/danger/info/neutral', () => {
    expect(Object.keys(status).sort()).toEqual(
      ['danger', 'info', 'neutral', 'success', 'warning'],
    );
  });
  it('clinical has critical/warning/normal/sensitive', () => {
    expect(Object.keys(clinical).sort()).toEqual(
      ['critical', 'normal', 'sensitive', 'warning'],
    );
  });
  it('finance has paid/unpaid/refunded/credit', () => {
    expect(Object.keys(finance).sort()).toEqual(
      ['credit', 'paid', 'refunded', 'unpaid'],
    );
  });
  it('inventory has available/low/expired/quarantined/recalled', () => {
    expect(Object.keys(inventory).sort()).toEqual(
      ['available', 'expired', 'low', 'quarantined', 'recalled'],
    );
  });
  it('claims has draft/ready/submitted/rejected/paid', () => {
    expect(Object.keys(claims).sort()).toEqual(
      ['draft', 'paid', 'ready', 'rejected', 'submitted'],
    );
  });
  it('sync has online/offline/queued/conflict', () => {
    expect(Object.keys(sync).sort()).toEqual(
      ['conflict', 'offline', 'online', 'queued'],
    );
  });
});

describe('ADR-026 / ADR-018 touch targets (accessibility safety)', () => {
  it('minimum touch target is at least 48px', () => {
    expect(parseInt(touch.targetMin, 10)).toBeGreaterThanOrEqual(48);
  });
  it('POS button and keypad are at least 64px', () => {
    expect(parseInt(touch.posButtonHeight, 10)).toBeGreaterThanOrEqual(64);
    expect(parseInt(touch.posKeypadButton, 10)).toBeGreaterThanOrEqual(64);
  });
});
