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
  verifyPharmacistPin(subjectId: string, pin: string): Promise<boolean>;
}
