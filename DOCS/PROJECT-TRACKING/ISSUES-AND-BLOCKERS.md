# Issues & Blockers

Log every blocker here and review weekly. Mirror the legacy `Module_X - Blockers Resolutions` doc here going forward. Status: 🔴 Open · 🟡 In review · 🟢 Resolved.

| ID | Title | Area | Severity | Status | Owner | Notes / Resolution |
| --- | --- | --- | --- | --- | --- | --- |
| B-001 | Stack discrepancy: Service Bus vs BullMQ/Redis | Architecture | High | 🔴 Open | Solution Architect | Tracked in [#48](https://gitlab.com/cricketaustin-group/Pzure/-/issues/48). Master Plan says Azure Service Bus; ADR-005 says BullMQ/Redis. Decide authoritative source. |
| B-002 | Stack discrepancy: generic RBAC vs Keycloak | Architecture | Medium | 🔴 Open | Solution Architect | Tracked in [#49](https://gitlab.com/cricketaustin-group/Pzure/-/issues/49). ADR-002 specifies Keycloak; confirm and align Master Plan. |
| B-003 | eTIMS implementation path undecided | Integration | High | 🔴 Open | Tech Lead | Tracked in [#50](https://gitlab.com/cricketaustin-group/Pzure/-/issues/50). Direct API / VSCU / OSCU / certified middleware to be confirmed in Sprint 0. |
| B-004 | Azure tenant/subscription ownership | Infrastructure | High | 🔴 Open | PM / Client | Tracked in [#51](https://gitlab.com/cricketaustin-group/Pzure/-/issues/51). Production must run in client-owned Azure tenant. |
| B-005 | SMS & WhatsApp providers not selected | Communication | Medium | 🔴 Open | BA | Tracked in [#52](https://gitlab.com/cricketaustin-group/Pzure/-/issues/52). Africa's Talking referenced in ADR-005; confirm + WhatsApp BSP. |
| B-006 | Key management upgrade path | Security | Medium | 🔴 Open | Security Lead | Tracked in [#53](https://gitlab.com/cricketaustin-group/Pzure/-/issues/53). MVP uses env-based AES key (ADR-003); plan envelope encryption / Key Vault for Phase 3. |

> Review the existing `DOCS/Modules/Module_X - Blockers Resolutions` document and migrate any open items here.
