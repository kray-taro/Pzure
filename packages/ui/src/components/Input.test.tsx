import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';
import { checkA11y } from '../test/axe';

describe('Input', () => {
  it('associates the label with the control', () => {
    render(<Input label="Patient name" />);
    expect(screen.getByLabelText('Patient name')).toBeInTheDocument();
  });

  it('exposes the error via aria-invalid and aria-describedby', () => {
    render(<Input label="Dose" errorMessage="Dose is required" />);
    const input = screen.getByLabelText('Dose');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Dose is required');
  });

  it('supports a visually hidden label that remains accessible', async () => {
    const { container } = render(<Input label="Search" hideLabel />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(await checkA11y(container)).toHaveNoViolations();
  });

  it('has no axe violations in default and error states', async () => {
    const ok = render(<Input label="Email" />);
    expect(await checkA11y(ok.container)).toHaveNoViolations();
    const err = render(<Input label="Phone" errorMessage="Invalid number" />);
    expect(await checkA11y(err.container)).toHaveNoViolations();
  });
});
