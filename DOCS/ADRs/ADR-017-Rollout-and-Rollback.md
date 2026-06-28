# ADR-017: Rollout and Rollback Strategy

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** Release Manager

> Gate 0 baseline. Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Pilot waves map to Sprint 34-37 ([#44](https://gitlab.com/cricketaustin-group/Pzure/-/issues/44)-[#47](https://gitlab.com/cricketaustin-group/Pzure/-/issues/47)).

## 1. Context and Problem Statement

10 branches must go live in waves, not big-bang, with safe rollback.

## 4. Decision Outcome

**Chosen (Approved):** Wave-based, flag-gated rollout with tested rollback.

- **Feature flags** per branch/module (ties to `packages/feature-flags`, Module 10).
- **Backend rollback** via blue-green / Container Apps revision swap.
- **Frontend rollback** via versioned static artefacts.
- **Migrations:** backward-compatible (expand/contract) only; no destructive migration in business hours; no migration without a tested rollback or forward-fix.
- **Branch-wave canary:** wave 1 = 2 branches ([#44](https://gitlab.com/cricketaustin-group/Pzure/-/issues/44)) -> wave 2 = +3 ([#45](https://gitlab.com/cricketaustin-group/Pzure/-/issues/45)) -> wave 3 = +5 ([#46](https://gitlab.com/cricketaustin-group/Pzure/-/issues/46)) -> stabilisation ([#47](https://gitlab.com/cricketaustin-group/Pzure/-/issues/47)).

## 5. Consequences

Blast radius limited to a wave; quick rollback per branch. Requires disciplined expand/contract migration practice and flag hygiene (flags removed after rollout).

## 6. Implementation Notes

- Each wave gated by go/no-go checklist; DR runbook (ADR-016) verified before wave 1; per-branch enablement audit-logged.
