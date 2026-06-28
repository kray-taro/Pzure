import * as React from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Validation message; presence flips the field into the error state. */
  errorMessage?: string;
  hideLabel?: boolean;
}

let uid = 0;

/** Input. SRP: a single labelled text/numeric field with accessible error wiring. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, errorMessage, hideLabel = false, id, className, disabled, ...rest },
  ref,
) {
  const reactId = React.useId ? React.useId() : `pz-input-${++uid}`;
  const inputId = id ?? reactId;
  const errorId = `${inputId}-error`;
  const invalid = Boolean(errorMessage);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className={cn('text-sm text-text-default', hideLabel && 'sr-only')}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        className={cn(
          'min-h-touch-targetMin rounded-md border bg-bg-surface px-3 text-text-default',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          invalid ? 'border-border-danger' : 'border-border-default',
          className,
        )}
        {...rest}
      />
      {invalid ? (
        <p id={errorId} className="text-status-danger text-xs">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
});
