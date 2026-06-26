/**
 * BranchScope port (ADR-001).
 *
 * Carries the active branch and the set of permitted branches derived from the
 * Keycloak JWT claims (`active_branch_id`, `allowed_branches`). Business code
 * never reads the raw claim; it asks BranchScope. Cross-branch access requires
 * an explicit, audited capability and is not the default.
 */
export interface BranchScope {
  readonly activeBranchId: string;
  readonly allowedBranchIds: readonly string[];
  assertCanAccess(branchId: string): void;
}
