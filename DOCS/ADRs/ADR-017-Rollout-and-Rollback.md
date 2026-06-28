# ADR-017: Rollout and Rollback Strategy

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Release Manager

> Stub created to close B-007 (Gate 0). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.

## 1. Context and Problem Statement
10 branches must go live in waves, not big-bang, with safe rollback.

## 4. Decision Outcome
**Chosen (proposed):** Feature flags per branch/module; blue-green or slot-swap backend rollback; versioned static frontend rollback; backward-compatible migrations only; branch-wave canary (2 → 3 → 5). No destructive migration in business hours; no migration without tested rollback/forward-fix.
