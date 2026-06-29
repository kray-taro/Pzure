# Disaster Recovery Restore-Drill Runbook

**Status:** Mandatory before production go-live (ADR-016).  
**Owning work item:** [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.  
**Authoritative DR target:** `RPO <= 15 min / RTO <= 4h` (ADR-016, canonical).

This runbook makes the ADR-016 targets *testable*: a drill is a pass only if a usable production-equivalent service is restored within RTO and loses no more than RPO of data. Drills run **before pilot** and **quarterly** thereafter.

## 1. Scope and roles

| Role | Responsibility |
| --- | --- |
| Incident commander | Declares DR, owns the clock against RTO, calls go/no-go |
| DBA / data | Azure SQL point-in-time / geo-restore, validates RPO |
| Platform / DevOps | Rebuild Container Apps from registry, networking, Key Vault, secrets |
| App lead | Smoke + integrity verification, sign-off |
| Scribe | Timestamps every step for the post-drill report |

## 2. Pre-drill checklist

- [ ] Confirm latest automated SQL backup and PITR window (>= 35 days retention).
- [ ] Confirm geo-redundant backup storage is healthy.
- [ ] Confirm Key Vault soft-delete + purge protection are enabled.
- [ ] Confirm container images for the target release exist in the registry.
- [ ] Identify the restore target (isolated DR resource group / subscription).
- [ ] Record the drill start time (T0) and the RPO/RTO clocks.

## 3. Restore procedure (target: service restored within RTO <= 4h)

1. **T0 - Declare DR.** Incident commander starts the RTO clock.
2. **Database restore.** Azure SQL **point-in-time restore** to the most recent recoverable point (or **geo-restore** if region loss). Record the restore point timestamp; RPO = (incident time - restore point) and must be `<= 15 min`.
3. **Network + secrets.** Recreate/attach VNet, private endpoints, Private DNS; restore Key Vault access via managed identity. No secrets from repo or app settings.
4. **App tier.** Deploy API + worker + scheduler Container Apps revisions from the registry; point them at the restored DB via private endpoint.
5. **Storage + audit.** Verify documents/files (versioning + soft delete) and append-only audit log store are reachable.
6. **Smoke test.** Auth login; POS checkout; pharmacy dispense (no-oversell guard); EMR visit open; outbox worker drains a test integration event.
7. **Integrity test.** Spot-check most-recent transactions against the RPO claim; confirm no committed transaction inside the RPO window is missing.
8. **T_end - Service usable.** Stop the RTO clock. RTO = (T_end - T0) and must be `<= 4h`.

## 4. Pass / fail criteria

| Criterion | Pass condition |
| --- | --- |
| RPO | Data loss <= 15 minutes (restore point within 15 min of incident) |
| RTO | Usable service within 4 hours of DR declaration |
| Integrity | Smoke + integrity tests green; no-oversell and dispense-lock invariants hold |
| Secrets | No secret sourced from repo/app settings; all via Key Vault |

A drill that misses RPO or RTO is a **fail**: raise a corrective action, fix, and re-run before go-live.

## 5. Post-drill report

Record and attach to the steering review: measured RPO, measured RTO, deviations, corrective actions, and next scheduled drill date. File any gap as a blocker in `ISSUES-AND-BLOCKERS.md`.
