import * as React from 'react';
import { cn } from '../../lib/cn';

export interface AllergyBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  allergies: readonly string[];
}

/**
 * AllergyBanner (Module_10 §9). SRP: surface a patient's active allergies as a
 * high-visibility clinical-critical banner. Empty list renders a safe "no known
 * allergies" state rather than nothing.
 */
export const AllergyBanner = React.forwardRef<HTMLDivElement, AllergyBannerProps>(
  function AllergyBanner({ allergies, className, ...rest }, ref) {
    const hasAllergies = allergies.length > 0;
    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        className={cn(
          'rounded-md border-2 p-3 font-medium',
          hasAllergies ? 'border-clinical-critical text-clinical-critical' : 'border-clinical-normal text-clinical-normal',
          'bg-bg-surface',
          className,
        )}
        {...rest}
      >
        {hasAllergies ? (
          <>
            <span className="uppercase">Allergies: </span>
            <span>{allergies.join(', ')}</span>
          </>
        ) : (
          <span>No known allergies</span>
        )}
      </div>
    );
  },
);
