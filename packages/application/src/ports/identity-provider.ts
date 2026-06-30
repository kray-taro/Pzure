/**
 * IdentityProvider port (ADR-002, D-005). Backed by Keycloak in infrastructure.
 * Swappable (e.g. Entra ID B2C) without touching application/domain.
 */
export interface AuthenticatedPrincipal {
  readonly subjectId: string;
  readonly roles: readonly string[];
  readonly activeBranchId: string;
  readonly allowedBranchIds: readonly string[];
}

export interface IdentityProvider {
  verifyAccessToken(token: string): Promise<AuthenticatedPrincipal>;
  /** Pharmacist PIN step-up authorization for regulated actions (ADR-004). */
  /**
   * Verifies a pharmacist PIN for step-up authorization (ADR-004).
   * SECURITY: `pin` is a raw secret — implementations MUST NOT log, serialize,
   * or include it in error messages or traces. Compare via constant-time bcrypt
   * verify only; discard immediately after comparison.
   */
  verifyPharmacistPin(subjectId: string, pin: string): Promise<boolean>;
}
