/**
 * Shell import smoke test.
 *
 * Stands in for an app shell consuming @pzure/ui via its public barrel: if the
 * package's entry point or any re-export breaks, this fails. It also renders a
 * tiny composite "shell" to prove the components mount together and stay
 * accessible (acceptance: imported by at least one app shell).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as UI from './index';
import { checkA11y } from './test/axe';

describe('@pzure/ui shell import smoke test', () => {
  it('exposes core + healthcare components from the barrel', () => {
    for (const name of [
      'Button',
      'Badge',
      'Alert',
      'Input',
      'StatusChip',
      'AllergyBanner',
      'MedicationWarningPanel',
      'BatchExpirySelector',
      'ControlledMedicineRow',
      'RecalledBatchAlert',
      'OfflineSyncBanner',
    ] as const) {
      expect(UI, `missing export: ${name}`).toHaveProperty(name);
    }
  });

  it('mounts a minimal shell using the public API', async () => {
    const { AllergyBanner, OfflineSyncBanner, Button, StatusChip } = UI;
    const { container } = render(
      <main aria-label="Pzure shell">
        <OfflineSyncBanner state="online" />
        <AllergyBanner allergies={['Penicillin']} />
        <StatusChip domain="mpesa" status="paid" />
        <Button>Dispense</Button>
      </main>,
    );
    expect(screen.getByRole('main', { name: 'Pzure shell' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dispense' })).toBeInTheDocument();
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
