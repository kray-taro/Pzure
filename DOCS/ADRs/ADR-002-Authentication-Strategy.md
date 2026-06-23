# ADR-002: Authentication & Token Strategy

**Status:** Approved  
**Date:** 2026-05-22  
**Author(s):** Solutions Architect

## 1. Context and Problem Statement

The Pzure platform requires robust identity management for branch staff, clinical professionals, and system administrators. The system handles sensitive PHI (Protected Health Information) governed by the Kenya Data Protection Act. 

We need to select an authentication provider and define the token lifecycle, balancing security, developer experience, and the requirement to keep MVP infrastructure costs near zero.

## 2. Decision Drivers

* **Zero Licensing Cost MVP:** The client explicitly mandated open-source/free-tier services only.
* **OIDC Compliance:** The system must use standard OAuth2/OIDC flows for security and future interoperability.
* **Role-Based Access Control (RBAC):** Needs to map users to roles (Pharmacist, Cashier, Doctor, Admin) and specific branches.
* **Regulated Actions:** Actions like dispensing controlled medicines require a "PIN override" or secondary verification step.

## 3. Considered Options

1. **Azure Entra ID B2C:** Managed service, excellent security, but incurs costs past the free tier and can be complex to heavily customize.
2. **Keycloak:** Self-hosted, free, open-source, full-featured IAM solution. High operational burden but zero software cost.
3. **Custom JWT Implementation:** Hand-rolled auth in NestJS. Lowest infra overhead but highest security risk.

## 4. Decision Outcome

**Chosen option:** Option 2 (Keycloak).

Keycloak provides enterprise-grade OIDC, RBAC, and session management out-of-the-box with no licensing costs, perfectly aligning with the MVP budget constraints. While it requires self-hosting and management, it prevents the security risks of hand-rolling auth and avoids vendor lock-in or surprise billing.

### Positive Consequences

* **Zero Licensing Cost:** 100% free and open-source.
* **Standard Protocols:** Fully supports OIDC, SAML, and OAuth2.
* **Custom Mappers:** We can easily map custom claims like `active_branch_id` and `allowed_branches` into the JWT payload.

### Negative Consequences

* **Operational Overhead:** Requires running a Keycloak container, managing a dedicated PostgreSQL database for it, and handling version upgrades.
* **Resource Usage:** Keycloak is Java-based and requires a reasonable amount of memory to run smoothly.

## 5. Token Lifecycle & Implementation Notes

### Token Configuration
* **Access Token:** Short-lived JWT (e.g., 15 minutes). Contains user identity, roles, and branch scopes.
* **Refresh Token:** Long-lived (e.g., 8 hours), rotating. Kept in an `HttpOnly` secure cookie.
* **Storage:** The frontend SPA (React) must store the Access Token in memory, NOT in `localStorage`. 

### Multi-Branch Context
* A user may have access to Branch A and Branch B.
* Upon login, they select their active branch context.
* The frontend requests a token from Keycloak. The NestJS backend extracts the `branch_id` claim to apply global tenant scoping to all database queries.

### Pharmacist PIN Override
* For controlled actions (e.g., overriding a drug interaction warning), the system requires a 4-digit PIN.
* This is a local verification implemented in the `core.users` table, not handled by Keycloak, to keep the UX fast and avoid full re-authentication flows.
