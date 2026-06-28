import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * StatusChip. SRP: render a domain status (eTIMS / M-Pesa / consent and other
 * Module_10 §10 chips) using semantic colour groups. The domain -> intent class
 * mapping lives here only (DRY); adding a status value never touches call sites.
 */
export type ChipDomain = 'etims' | 'mpesa' | 'consent' | 'claim' | 'sync';

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  domain: ChipDomain;
  status: string;
}

// Each map value is a Tailwind class resolving to a semantic token via the preset.
const chipClass: Record<ChipDomain, Record<string, string>> = {
  etims: {
    transmitted: 'text-status-success border-status-success',
    pending: 'text-status-warning border-status-warning',
    failed: 'text-status-danger border-status-danger',
  },
  mpesa: {
    paid: 'text-finance-paid border-finance-paid',
    unpaid: 'text-finance-unpaid border-finance-unpaid',
    refunded: 'text-finance-refunded border-finance-refunded',
  },
  consent: {
    granted: 'text-clinical-normal border-clinical-normal',
    withdrawn: 'text-clinical-critical border-clinical-critical',
    required: 'text-clinical-warning border-clinical-warning',
  },
  claim: {
    ready: 'text-claims-ready border-claims-ready',
    submitted: 'text-claims-submitted border-claims-submitted',
    rejected: 'text-claims-rejected border-claims-rejected',
    paid: 'text-claims-paid border-claims-paid',
    draft: 'text-claims-draft border-claims-draft',
  },
  sync: {
    online: 'text-sync-online border-sync-online',
    offline: 'text-sync-offline border-sync-offline',
    queued: 'text-sync-queued border-sync-queued',
    conflict: 'text-sync-conflict border-sync-conflict',
  },
};

const domainLabel: Record<ChipDomain, string> = {
  etims: 'eTIMS',
  mpesa: 'M-Pesa',
  consent: 'Consent',
  claim: 'Claim',
  sync: 'Sync',
};

export const StatusChip = React.forwardRef<HTMLSpanElement, StatusChipProps>(function StatusChip(
  { domain, status, className, ...rest },
  ref,
) {
  const tone = chipClass[domain][status] ?? 'text-status-neutral border-border-default';
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border bg-bg-surface px-2 py-1 text-xs font-medium',
        tone,
        className,
      )}
      aria-label={`${domainLabel[domain]} status: ${status}`}
      {...rest}
    >
      <span className="text-text-muted">{domainLabel[domain]}</span>
      <span>{status}</span>
    </span>
  );
});
