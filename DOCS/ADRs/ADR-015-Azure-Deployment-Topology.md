# ADR-015: Azure Deployment Topology

**Status:** Draft  
**Date:** 2026-06-28  
**Author(s):** DevOps / Cloud Engineer

> Stub created to close B-007 (Gate 0). Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C. Related blocker: B-004 (#51).

## 1. Context and Problem Statement
Production must run in the client-owned Azure tenant (B-004). Hosting and SQL deployment models are open (D-002, D-003).

## 4. Decision Outcome
**Chosen (proposed):** Containerised NestJS on App Service/Container Apps/AKS (by DevOps capability), SQL Server on Azure SQL MI/DB/VM (by enterprise policy), Blob storage, Redis cache, Key Vault, private endpoints/VNet, WAF/CDN for frontend. IaC via Bicep/Terraform. Environments: Local/Dev/QA/UAT/Staging/Prod/DR. Final choices pending B-004 / #51.
