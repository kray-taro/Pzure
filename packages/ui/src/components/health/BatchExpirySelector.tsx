import * as React from 'react';
import { cn } from '../../lib/cn';

export interface BatchOption {
  batchNo: string;
  expiry: string; // ISO date
  /** inventory state drives the colour token. */
  state: 'available' | 'low' | 'expired' | 'quarantined' | 'recalled';
  quantity: number;
}

export interface BatchExpirySelectorProps {
  label?: string;
  batches: readonly BatchOption[];
  value?: string;
  onSelect?: (batchNo: string) => void;
  disabled?: boolean;
}

const stateClass: Record<BatchOption['state'], string> = {
  available: 'text-inventory-available border-inventory-available',
  low: 'text-inventory-low border-inventory-low',
  expired: 'text-inventory-expired border-inventory-expired',
  quarantined: 'text-inventory-quarantined border-inventory-quarantined',
  recalled: 'text-inventory-recalled border-inventory-recalled',
};

/**
 * BatchExpirySelector (Module_10 §10). SRP: choose a dispensable batch by
 * expiry/state. Expired, quarantined and recalled batches are non-selectable
 * (clinical safety) and announced as such.
 */
export function BatchExpirySelector({
  label = 'Select batch',
  batches,
  value,
  onSelect,
  disabled = false,
}: BatchExpirySelectorProps) {
  return (
    <fieldset disabled={disabled} className="flex flex-col gap-2">
      <legend className="text-sm text-text-default">{label}</legend>
      {batches.length === 0 ? (
        <p className="text-text-muted text-sm">No batches in stock.</p>
      ) : (
        batches.map((b) => {
          const selectable = b.state === 'available' || b.state === 'low';
          const selected = b.batchNo === value;
          return (
            <button
              key={b.batchNo}
              type="button"
              disabled={!selectable}
              aria-pressed={selected}
              onClick={() => selectable && onSelect?.(b.batchNo)}
              className={cn(
                'min-h-touch-targetMin rounded-md border bg-bg-surface px-3 text-left',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                stateClass[b.state],
                selected && 'ring-2 ring-border-focus',
              )}
            >
              <span className="font-medium">{b.batchNo}</span>{' '}
              <span className="text-text-muted">exp {b.expiry} · qty {b.quantity} · {b.state}</span>
            </button>
          );
        })
      )}
    </fieldset>
  );
}
