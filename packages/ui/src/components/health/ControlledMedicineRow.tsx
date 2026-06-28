import * as React from 'react';
import { cn } from '../../lib/cn';

export interface ControlledMedicineRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  drug: string;
  schedule: string;
  balance: number;
  dispensedBy: string;
  /** Witnessed counts are required for controlled registers; missing = high risk. */
  witnessed: boolean;
}

/**
 * ControlledMedicineRow (Module_10 §10). SRP: one register line for a controlled
 * (scheduled) medicine. Unwitnessed rows are flagged clinical-critical.
 */
export const ControlledMedicineRow = React.forwardRef<HTMLTableRowElement, ControlledMedicineRowProps>(
  function ControlledMedicineRow({ drug, schedule, balance, dispensedBy, witnessed, className, ...rest }, ref) {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b border-border-default text-sm',
          !witnessed && 'text-clinical-critical',
          className,
        )}
        {...rest}
      >
        <td className="px-2 py-2 font-medium">{drug}</td>
        <td className="px-2 py-2">{schedule}</td>
        <td className="px-2 py-2 tabular-nums">{balance}</td>
        <td className="px-2 py-2">{dispensedBy}</td>
        <td className="px-2 py-2">
          {witnessed ? (
            <span className="text-clinical-normal">witnessed</span>
          ) : (
            <span className="text-clinical-critical" role="status">not witnessed</span>
          )}
        </td>
      </tr>
    );
  },
);
