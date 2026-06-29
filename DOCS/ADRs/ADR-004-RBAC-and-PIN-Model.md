# ADR-004: RBAC & Pharmacist PIN Model

**Status:** Approved  
**Date:** 2026-05-22  
**Author(s):** Solutions Architect

## 1. Context and Problem Statement

Pzure handles operations ranging from simple retail sales to clinical prescribing and dispensing of controlled medicines. Access must be restricted based on the user's role (e.g., Cashier vs. Pharmacist).

Furthermore, clinical systems often suffer from "alert fatigue." When a severe drug-drug interaction is flagged, or when dispensing a highly restricted drug, we must verify that the acting pharmacist actively acknowledges the risk. A full OAuth2 login redirect is too slow for a fast-paced pharmacy counter.

## 2. Decision Drivers

- **Regulatory Compliance:** The Pharmacy and Poisons Board (PPB) requires strict audit trails for controlled medicines.
- **User Experience:** Pharmacists cannot wait 5 seconds for an SSO redirect every time they approve a prescription.
- **Security:** Cashiers must not be able to bypass clinical warnings using a shared terminal.

## 3. Considered Options

1. **Keycloak Step-Up Authentication:** Use OIDC "step-up" auth (ACR claims). Secure, but requires browser redirects that interrupt the workflow.
2. **Local JWT Re-authentication:** Prompt for the user's full password in the UI and verify it against Keycloak via a direct grant. Too cumbersome for frequent use.
3. **Application-Layer PIN Hash:** Store a separate hashed 4-digit PIN in the `core_users` table specifically for fast, regulated clinical overrides.

## 4. Decision Outcome

**Chosen option:** Option 3 (Application-Layer PIN Hash).

Keycloak will handle the primary session and coarse-grained Role-Based Access Control (RBAC). For fast clinical verifications, the NestJS backend will manage a secondary 4-digit PIN.

When a pharmacist needs to override an alert, the React frontend displays a modal asking for their 4-digit PIN and a reason. The backend hashes the provided PIN, compares it against the `core_users.pin_hash`, and if valid, logs the override and proceeds with the transaction.

### Positive Consequences

- **Frictionless UX:** 4-digit entry takes < 1 second and doesn't redirect the browser.
- **Strong Auditability:** The specific action is cryptographically tied to the pharmacist who entered the PIN, even if the terminal is shared.
- **Decoupled Architecture:** Keeps Keycloak focused on identity and SSO, while the application handles clinical workflow logic.

### Negative Consequences

- **PIN Management:** Requires building UI screens for users to set, change, and recover their PIN.
- **Brute Force Risk:** 4-digit PINs are susceptible to brute forcing.

## 5. Implementation Notes

- The `core_users` table will add: `pin_hash` (bcrypt), `pin_failed_attempts` (int), `pin_locked_until` (datetime).
- **Lockout Policy:** 5 failed attempts locks the PIN for 15 minutes.
- **Audit Logging:** Every successful and failed PIN entry MUST generate an event in `audit_security_events`.
- **RBAC:** Keycloak roles will be mapped to JWT claims. NestJS will use a custom `@RequireRole('Pharmacist')` decorator on API endpoints.
