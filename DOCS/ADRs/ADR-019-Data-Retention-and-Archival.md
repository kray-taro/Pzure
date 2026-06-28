# ADR-019: Data Retention and Archival Policy

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Security / Privacy Lead

> Stub created to close B-007 (Gate 0). Owning work item: [#54](https://gitlab.com/cricketaustin-group/Pzure/-/issues/54) Sprint 0A.

## 1. Context and Problem Statement
Health data has long retention expectations (Digital Health regs reference ≥20 years) that differ from operational/audit logs.

## 4. Decision Outcome
**Chosen (proposed):** Retention matrix by data class — clinical/health records long-retention (≥20 years), financial/tax per KRA, operational logs shorter, audit append-only and backup-protected. Archival tier for cold data; document-status `legal_hold` honoured.
