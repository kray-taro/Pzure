import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AllergyBanner } from './AllergyBanner';
import { MedicationWarningPanel } from './MedicationWarningPanel';
import { BatchExpirySelector } from './BatchExpirySelector';
import { ControlledMedicineRow } from './ControlledMedicineRow';
import { RecalledBatchAlert } from './RecalledBatchAlert';
import { OfflineSyncBanner } from './OfflineSyncBanner';
import { checkA11y } from '../../test/axe';

describe('AllergyBanner', () => {
  it('lists allergies as an assertive alert', () => {
    render(<AllergyBanner allergies={['Penicillin', 'Latex']} />);
    const el = screen.getByRole('alert');
    expect(el).toHaveAttribute('aria-live', 'assertive');
    expect(el).toHaveTextContent('Penicillin, Latex');
  });
  it('renders a safe empty state', () => {
    render(<AllergyBanner allergies={[]} />);
    expect(screen.getByText('No known allergies')).toBeInTheDocument();
  });
  it('has no axe violations', async () => {
    const { container } = render(<AllergyBanner allergies={['Aspirin']} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe('MedicationWarningPanel', () => {
  it('escalates live region when a critical warning exists', () => {
    render(
      <MedicationWarningPanel
        warnings={[{ id: '1', severity: 'critical', message: 'Interaction' }]}
      />,
    );
    expect(screen.getByLabelText('Medication warnings')).toHaveAttribute('aria-live', 'assertive');
  });
  it('renders empty state', () => {
    render(<MedicationWarningPanel warnings={[]} />);
    expect(screen.getByText('No medication warnings.')).toBeInTheDocument();
  });
  it('has no axe violations', async () => {
    const { container } = render(
      <MedicationWarningPanel warnings={[{ id: '1', severity: 'warning', message: 'Reduce dose' }]} />,
    );
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe('BatchExpirySelector', () => {
  const batches = [
    { batchNo: 'A1', expiry: '2027-01-01', state: 'available', quantity: 10 },
    { batchNo: 'X9', expiry: '2020-01-01', state: 'expired', quantity: 5 },
  ] as const;

  it('selects a selectable batch', async () => {
    const onSelect = vi.fn();
    render(<BatchExpirySelector batches={batches} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /A1/ }));
    expect(onSelect).toHaveBeenCalledWith('A1');
  });
  it('disables expired batches', () => {
    render(<BatchExpirySelector batches={batches} />);
    expect(screen.getByRole('button', { name: /X9/ })).toBeDisabled();
  });
  it('renders empty state', () => {
    render(<BatchExpirySelector batches={[]} />);
    expect(screen.getByText('No batches in stock.')).toBeInTheDocument();
  });
  it('has no axe violations', async () => {
    const { container } = render(<BatchExpirySelector batches={batches} value="A1" />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe('ControlledMedicineRow', () => {
  function wrap(ui: React.ReactNode) {
    return render(<table><tbody>{ui}</tbody></table>);
  }
  it('flags unwitnessed rows', () => {
    wrap(
      <ControlledMedicineRow drug="Morphine" schedule="CD2" balance={4} dispensedBy="RN A" witnessed={false} />,
    );
    expect(screen.getByText('not witnessed')).toBeInTheDocument();
  });
  it('has no axe violations', async () => {
    const { container } = wrap(
      <ControlledMedicineRow drug="Diazepam" schedule="CD4" balance={9} dispensedBy="RN B" witnessed />,
    );
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe('RecalledBatchAlert', () => {
  it('announces the recall assertively', () => {
    render(<RecalledBatchAlert drug="Drug X" batchNo="B7" reason="contamination" />);
    const el = screen.getByRole('alert');
    expect(el).toHaveAttribute('aria-live', 'assertive');
    expect(el).toHaveTextContent('B7');
  });
  it('has no axe violations', async () => {
    const { container } = render(<RecalledBatchAlert drug="Drug Y" batchNo="B8" reason="label error" />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});

describe('OfflineSyncBanner', () => {
  it.each(['online', 'offline', 'queued', 'conflict'] as const)('renders %s state', (state) => {
    render(<OfflineSyncBanner state={state} pending={state === 'offline' ? 3 : 0} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('escalates live region on conflict', () => {
    render(<OfflineSyncBanner state="conflict" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
  });
  it('has no axe violations', async () => {
    const { container } = render(<OfflineSyncBanner state="offline" pending={2} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
