import * as React from 'react';
import { cn } from '../lib/cn';
import { intentClasses, type Intent } from '../lib/intent';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'approval';
export type ButtonSize = 'md' | 'pos';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Permission gate: renders disabled with an explanatory accessible label. */
  permissionDenied?: boolean;
}

const variantIntent: Record<ButtonVariant, Intent> = {
  primary: 'info',
  secondary: 'neutral',
  danger: 'danger',
  ghost: 'neutral',
  approval: 'success',
};

/**
 * Button. SRP: a single interactive action control. Variants map to semantic
 * intents (OCP) so new colours arrive via the token preset, not edits here.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, permissionDenied = false, disabled, className, children, ...rest },
  ref,
) {
  const intent = intentClasses[variantIntent[variant]];
  const isDisabled = disabled || loading || permissionDenied;
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      title={permissionDenied ? 'You do not have permission to perform this action' : rest.title}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'pos' ? 'min-h-pos-button min-w-touch-targetMin px-6 text-lg' : 'min-h-touch-targetMin px-4 text-base',
        variant === 'ghost' ? cn('bg-bg-surface', intent.text, 'border', intent.border) : intent.solid,
        className,
      )}
      {...rest}
    >
      {loading ? <span aria-hidden="true">…</span> : null}
      <span>{children}</span>
    </button>
  );
});
