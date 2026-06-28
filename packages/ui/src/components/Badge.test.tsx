import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { Alert } from './Alert';
import { checkA11y } from '../test/axe';

describe('Badge', () => {
  it('renders content', () => {
    render(<Badge intent="success">3</Badge>);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  it.each(['neutral', 'success', 'warning', 'danger', 'info'] as const)(
    'has no axe violations for intent %s',
    async (intent) => {
      const { container } = render(<Badge intent={intent}>label</Badge>);
      expect(await checkA11y(container)).toHaveNoViolations();
    },
  );
});

describe('Alert', () => {
  it('uses assertive live region when high risk', () => {
    render(<Alert highRisk title="Critical">message</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });
  it('has no axe violations', async () => {
    const { container } = render(<Alert intent="warning" title="Heads up">body</Alert>);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
