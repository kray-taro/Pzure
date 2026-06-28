import * as React from 'react';
import { cn } from '../lib/cn';
import { intentClasses, type Intent } from '../lib/intent';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  intent?: Intent;
}

/** Badge. SRP: compact status/count label. Colour via intent token map. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { intent = 'neutral', className, children, ...rest },
  ref,
) {
  const i = intentClasses[intent];
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        'border', i.border, i.text, 'bg-bg-surface',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});
