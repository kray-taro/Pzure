import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import { checkA11y } from '../test/axe';

describe('Button', () => {
  it('renders children and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled and busy while loading', () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('blocks interaction and explains when permission denied', async () => {
    const onClick = vi.fn();
    render(<Button permissionDenied onClick={onClick}>Approve</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('title', expect.stringContaining('permission'));
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('pos size keeps a large touch target class', () => {
    render(<Button size="pos">Pay</Button>);
    expect(screen.getByRole('button').className).toContain('min-h-pos-button');
  });

  it.each(['primary', 'secondary', 'danger', 'ghost', 'approval'] as const)(
    'has no axe violations for variant %s',
    async (variant) => {
      const { container } = render(<Button variant={variant}>Action</Button>);
      expect(await checkA11y(container)).toHaveNoViolations();
    },
  );
});
