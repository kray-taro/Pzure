# Risk Register

From the Master Plan risk register. Review at every steering committee. Severity: High / Medium / Low.

| ID | Risk | Severity | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| R-01 | 10 branches increase complexity (stock, staff, prices, devices, licences) | High | Wave rollout, branch readiness checklist | PM |
| R-02 | No existing data — clean data must be created from scratch | High | Master-data factory from Sprint 6 | Data Lead |
| R-03 | eTIMS new setup may delay/block go-live | High | Start eTIMS track early; queue/manual fallback | Tech Lead |
| R-04 | All-claims scope (SHA/private/employer rules differ) | High | Generic configurable payer engine | Claims SME |
| R-05 | Controlled medicines compliance risk | High | Controlled register in MVP, strict RBAC | Pharmacy SME |
| R-06 | Online pharmacy + delivery regulatory/safety risk | High | Pharmacist review, prescription controls, delivery audit | Pharmacy SME |
| R-07 | SMS + WhatsApp consent/privacy risk | Medium | Consent engine before messaging | DPO |
| R-08 | SQL Server performance under reporting load | Medium | Reporting views/snapshots, indexing, warehouse later | DB Engineer |
| R-09 | Internal team learning curve (NestJS/Vite/SQL/Azure) | Medium | Architecture standards, code reviews, DevOps | Tech Lead |
| R-10 | Device variability (printers/scanners/tablets) | Medium | Hardware test matrix and branch kit | DevOps |
| R-11 | Offline sync complexity / data conflicts | High | Event queue, conflict handling, sync dashboard | Tech Lead |
| R-12 | Branch user adoption / workflow resistance | Medium | Super-user model, SOPs, hypercare | Change Lead |
| R-13 | Claims denials — revenue loss | High | Claim validation before submission | Claims SME |
| R-14 | Stock mismatch at go-live | High | Mandatory physical opening count | Data Lead |
| R-15 | Patient data leakage | High | RBAC, masking, access logs, export controls | Security Lead |
| R-16 | Scope sprawl | Medium | Release gates and change-control board | PM |
