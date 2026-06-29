# ADR-016: Backup and Disaster Recovery

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** DevOps / Cloud Engineer

> Resolves B-006 ([#53](https://gitlab.com/cricketaustin-group/Pzure/-/issues/53)) backup/DR aspects and the DR posture from B-004 ([#51](https://gitlab.com/cricketaustin-group/Pzure/-/issues/51)). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.
>
> **Authoritative DR target (canonical):** `RPO <= 15 min / RTO <= 4h`. This exact token is mirrored verbatim in the Gate 0 checklist and the B-004 row of `ISSUES-AND-BLOCKERS.md`; `scripts/check-dr-consistency.sh` fails CI if the three drift.

## 1. Context and Problem Statement

A regulated health platform needs defined RPO/RTO and tested restores before pilot.

## 4. Decision Outcome

**Chosen (Approved — authoritative DR targets):**

- **RPO ≤ 15 min** via Azure SQL point-in-time restore.
- **RTO ≤ 4h** for production restoration.
- Automated SQL backups; **PITR retention ≥ 35 days** (longer if compliance requires); **geo-redundant** backup storage.
- Documents/files on Storage with **versioning + soft delete**; Key Vault **soft delete + purge protection**.
- App containers rebuilt from registry/pipeline; append-only, backup-protected audit logs.
- **DR runbook mandatory before production go-live**; restore drills before pilot and quarterly; branch offline-continuity SOP.

> These targets are authoritative and **supersede** the looser MVP figures (RPO 24h / RTO 8-24h) discussed during B-004 triage.

## 7. Ratification Addendum (Gate 0C) - DR contradiction resolved

**Ratification status:** Ratified for Gate 0C  
**Ratification date:** 2026-06-28  
**Owning work item:** [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C (blocker B-007)

The project previously held two conflicting DR targets: ADR-016 + the Gate 0 checklist stated `RPO <= 15 min / RTO <= 4h`, while the B-004 row in `ISSUES-AND-BLOCKERS.md` still carried the looser triage figures (RPO 24h / RTO 8-24h). DDIA reliability requires a single, testable target, not two.

**Resolution:** `RPO <= 15 min / RTO <= 4h` is the single authoritative target. It is justified for a regulated health platform: Azure SQL point-in-time restore already provides effectively continuous (sub-15-minute) recovery points, so the stricter RPO costs nothing extra, and a 4-hour RTO bounds clinical/pharmacy downtime to within one branch operating session. The looser figures were triage placeholders, not an engineering decision, and are explicitly superseded.

**Enforcement:** the canonical token `RPO <= 15 min / RTO <= 4h` now appears verbatim in exactly three places - this ADR, the Gate 0 checklist, and the B-004 row - and `scripts/check-dr-consistency.sh` (wired into DOCS CI) greps all three and fails if they are not identical. The contradiction therefore cannot silently reappear.

**Restore-drill runbook:** see `DOCS/PROJECT-TRACKING/DR-RESTORE-RUNBOOK.md` (mandatory before production go-live; drills before pilot and quarterly per Section 4).
