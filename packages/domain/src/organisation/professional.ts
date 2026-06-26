import { AggregateRoot } from '../base/aggregate-root.js';
import { Licence } from './licence.js';

export type ProfessionalRole = 'PHARMACIST' | 'CLINICIAN' | 'LAB_OFFICER';

/**
 * Professional aggregate (#15). Holds a practising licence. An expired
 * professional licence blocks regulated sign-off — enforced via assertActive.
 * Optimistic-locked (CONCURRENCY §1).
 */
export class Professional extends AggregateRoot<string> {
  constructor(
    id: string,
    readonly role: ProfessionalRole,
    private readonly licence: Licence,
    version = 0,
  ) {
    super(id, version);
  }

  isActiveAt(at: Date): boolean {
    return this.licence.isValidAt(at);
  }

  assertActive(at: Date): void {
    if (!this.isActiveAt(at)) {
      throw new ProfessionalLicenceExpiredError(this.id);
    }
  }
}

import { DomainError } from '../base/errors.js';

export class ProfessionalLicenceExpiredError extends DomainError {
  readonly code = 'PROFESSIONAL_LICENCE_EXPIRED';
  constructor(professionalId: string) {
    super(`Professional ${professionalId} has no valid practising licence`);
  }
}
