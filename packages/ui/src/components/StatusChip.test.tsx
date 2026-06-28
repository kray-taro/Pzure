import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusChip } from './StatusChip';
import { checkA11y } from '../test/axe';

describe('StatusChip', () => {
  it('renders an accessible domain + status label', () => {
    render(<StatusChip domain="etims" status="transmitted" />);
    expect(screen.getByLabelText('eTIMS status: transmitted')).toBeInTheDocument();
  });

  it('falls back to neutral tone for unknown status', () => {
    render(<StatusChip domain="mpesa" status="weird" />);
    expect(screen.getByText('weird').closest('span')?.className).toContain('text-status-neutral');
  });

  it.each([
    ['etims', 'pending'],
    ['mpesa', 'paid'],
    ['consent', 'granted'],
    ['claim', 'rejected'],
    ['sync', 'offline'],
  ] as const)('has no axe violations for %s/%s', async (domain, status) => {
    const { container } = render(<StatusChip domain={domain} status={status} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
