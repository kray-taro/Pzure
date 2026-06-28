import * as React from 'react';
import { cn } from '../../lib/cn';

export interface RecalledBatchAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  batchNo: string;
  drug: string;
  reason: string;
}

/**
 * RecalledBatchAlert (Module_10 §10). SRP: announce that a specific batch is
 * recalled and must not be dispensed. Uses the inventory.recalled token and
 * assertive live semantics (highest clinical severity).
 */
export const RecalledBatchAlert = React.forwardRef<HTMLDivElement, RecalledBatchAlertProps>(
  function RecalledBatchAlert({ batchNo, drug, reason, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        className={cn(
          'rounded-md border-2 border-inventory-recalled bg-bg-surface p-3 text-inventory-recalled',
          className,
        )}
        {...rest}
      >
        <p className="font-semibold uppercase">Recalled batch – do not dispense</p>
        <p className="text-sm">
          {drug} · batch {batchNo}: {reason}
        </p>
      </div>
    );
  },
);
