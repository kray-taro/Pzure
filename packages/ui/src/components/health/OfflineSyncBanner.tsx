import * as React from 'react';
import { cn } from '../../lib/cn';

export type SyncState = 'online' | 'offline' | 'queued' | 'conflict';

export interface OfflineSyncBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  state: SyncState;
  pending?: number;
}

const syncClass: Record<SyncState, string> = {
  online: 'text-sync-online border-sync-online',
  offline: 'text-sync-offline border-sync-offline',
  queued: 'text-sync-queued border-sync-queued',
  conflict: 'text-sync-conflict border-sync-conflict',
};

const syncMessage: Record<SyncState, string> = {
  online: 'Online – all changes synced',
  offline: 'Offline – changes are stored locally',
  queued: 'Reconnecting – syncing queued changes',
  conflict: 'Sync conflict – review required',
};

/**
 * OfflineSyncBanner (Module_10 §10). SRP: communicate offline/sync status and
 * the count of pending local changes. Colour comes from the sync.* token group.
 */
export const OfflineSyncBanner = React.forwardRef<HTMLDivElement, OfflineSyncBannerProps>(
  function OfflineSyncBanner({ state, pending = 0, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="status"
        aria-live={state === 'conflict' ? 'assertive' : 'polite'}
        className={cn('rounded-md border bg-bg-surface p-2 text-sm', syncClass[state], className)}
        {...rest}
      >
        <span className="font-medium">{syncMessage[state]}</span>
        {pending > 0 ? <span className="text-text-muted"> ({pending} pending)</span> : null}
      </div>
    );
  },
);
