import { AggregateRoot } from '../base/aggregate-root.js';
import { DomainError } from '../base/errors.js';
import { BranchId } from './value-objects/branch-id.js';
import { Licence, LicenceType } from './licence.js';

/**
 * Capabilities a branch may exercise. Each is gated by a specific regulator
 * licence per #15 acceptance rules.
 */
export type BranchCapability = 'DISPENSE' | 'SIGN_CONSULT' | 'LAB_SIGN_OFF';

export type BranchType = 'CHEMIST' | 'CLINIC' | 'CLINIC_WITH_PHARMACY' | 'RETAIL';

export class CapabilityBlockedError extends DomainError {
  readonly code = 'CAPABILITY_BLOCKED';
  constructor(branchId: string, capability: BranchCapability) {
    super(`Branch ${branchId} is not licensed for ${capability}`);
  }
}

/**
 * Branch aggregate root (ADR-001). Optimistic-locked via the inherited
 * `version` (CONCURRENCY §1): licence changes from concurrent admins or offline
 * sync (ADR-006) cannot silently overwrite each other.
 *
 * Single responsibility: model a branch's identity, type, and its regulatory
 * capability gating. It does NOT know how dispensing works — only whether the
 * branch is *permitted* to dispense at a given time.
 *
 * Capability → required licence mapping (#15):
 *   DISPENSE       requires a valid PPB licence
 *   SIGN_CONSULT   requires a valid KMPDC facility licence
 *   LAB_SIGN_OFF   requires a valid KMLTTB lab licence
 */
const CAPABILITY_LICENCE: Record<BranchCapability, LicenceType> = {
  DISPENSE: 'PPB',
  SIGN_CONSULT: 'KMPDC',
  LAB_SIGN_OFF: 'KMLTTB',
};

export class Branch extends AggregateRoot<string> {
  private constructor(
    readonly branchId: BranchId,
    readonly type: BranchType,
    readonly name: string,
    private readonly licences: ReadonlyMap<LicenceType, Licence>,
    version = 0,
  ) {
    super(branchId.value, version);
  }

  static register(params: {
    branchId: BranchId;
    type: BranchType;
    name: string;
    licences?: readonly Licence[];
  }): Branch {
    if (!params.name || params.name.trim().length === 0) {
      throw new Error('Branch name is required');
    }
    const map = new Map<LicenceType, Licence>();
    for (const lic of params.licences ?? []) {
      map.set(lic.type, lic);
    }
    return new Branch(params.branchId, params.type, params.name.trim(), map);
  }

  /** True if the branch holds a currently-valid licence for the capability. */
  can(capability: BranchCapability, at: Date): boolean {
    const required = CAPABILITY_LICENCE[capability];
    const licence = this.licences.get(required);
    return licence !== undefined && licence.isValidAt(at);
  }

  /**
   * Guard used by regulated workflows. Throws a CapabilityBlockedError when the
   * branch lacks a valid licence — e.g. "pharmacy without PPB blocks dispensing".
   */
  assertCan(capability: BranchCapability, at: Date): void {
    if (!this.can(capability, at)) {
      throw new CapabilityBlockedError(this.branchId.value, capability);
    }
  }

  /** Licences expiring within `days` of `at` — source for expiry alerts (#15). */
  expiringLicences(at: Date, days: number): readonly Licence[] {
    return [...this.licences.values()].filter((l) => l.isExpiringWithin(at, days));
  }
}
