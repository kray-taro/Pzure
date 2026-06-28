import * as React from 'react';
import { cn } from '../lib/cn';
import { intentClasses, type Intent } from '../lib/intent';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  intent?: Intent;
  title?: string;
  /** Critical/high-risk alerts use assertive live semantics. */
  highRisk?: boolean;
}

/** Alert. SRP: communicate a contextual message at a given severity. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { intent = 'info', title, highRisk = false, className, children, ...rest },
  ref,
) {
  const i = intentClasses[intent];
  return (
    <div
      ref={ref}
      role="alert"
      aria-live={highRisk ? 'assertive' : 'polite'}
      className={cn('rounded-md border p-4', i.border, 'bg-bg-surface', className)}
      {...rest}
    >
      {title ? <p className={cn('font-semibold', i.text)}>{title}</p> : null}
      <div className="text-text-default text-sm">{children}</div>
    </div>
  );
});
