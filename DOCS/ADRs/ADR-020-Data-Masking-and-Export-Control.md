# ADR-020: Patient Data Masking and Export Control

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Security / Privacy Lead

> Stub created to close B-007 (Gate 0). Owning work item: [#55](https://gitlab.com/cricketaustin-group/Pzure/-/issues/55) Sprint 0B.

## 1. Context and Problem Statement
Sensitive patient data must be masked for unauthorised roles, and exports of sensitive reports must be controlled and logged.

## 4. Decision Outcome
**Chosen (proposed):** Role/report-based masking; sensitive-report export requires permission + reason and is logged to the data-access log; bulk export triggers approval workflow; break-glass access raises a critical audit event.
