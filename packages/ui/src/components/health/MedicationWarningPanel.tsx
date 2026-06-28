import * as React from 'react';
import { cn } from '../../lib/cn';

export type WarningSeverity = 'critical' | 'warning' | 'normal';

export interface MedicationWarning {
  id: string;
  severity: WarningSeverity;
  message: string;
}

export interface MedicationWarningPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  warnings: readonly MedicationWarning[];
}

const severityClass: Record<WarningSeverity, string> = {
  critical: 'text-clinical-critical border-clinical-critical',
  warning: 'text-clinical-warning border-clinical-warning',
  normal: 'text-clinical-normal border-clinical-normal',
};

/**
 * MedicationWarningPanel (Module_10 §9). SRP: list interaction / dosage warnings
 * for a prescription, ordered by the caller, each tagged by clinical severity.
 */
export const MedicationWarningPanel = React.forwardRef<HTMLDivElement, MedicationWarningPanelProps>(
  function MedicationWarningPanel({ warnings, className, ...rest }, ref) {
    const critical = warnings.some((w) => w.severity === 'critical');
    return (
      <section
        ref={ref}
        aria-label="Medication warnings"
        aria-live={critical ? 'assertive' : 'polite'}
        className={cn('rounded-md border bg-bg-surface p-3', 'border-border-default', className)}
        {...rest}
      >
        {warnings.length === 0 ? (
          <p className="text-text-muted text-sm">No medication warnings.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {warnings.map((w) => (
              <li key={w.id} className={cn('rounded border-l-4 pl-2 text-sm', severityClass[w.severity])}>
                {w.message}
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  },
);
