# ADR-018: Device / Printer / Scanner Support Model

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** Tech Lead

> Stub created to close B-007 (Gate 0). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.

## 1. Context and Problem Statement

Branches use desktops, tablets, Android phones, 58/80mm receipt printers, label printers, barcode scanners. Device variability is an operational risk.

## 4. Decision Outcome

**Chosen (proposed):** Registered branch device registry with revocation; supported printer/scanner/tablet model list; print abstraction for 58mm/80mm/PDF + labels; device testing matrix as a branch-readiness gate.
