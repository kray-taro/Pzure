# ADR-015: Azure Deployment Topology

**Status:** Approved  
**Date:** 2026-06-28  
**Author(s):** DevOps / Cloud Engineer

> Resolves B-004 ([#51](https://gitlab.com/cricketaustin-group/Pzure/-/issues/51)) and closes D-002, D-003. Owning work item: [#56](https://gitlab.com/cricketaustin-group/Pzure/-/issues/56) Sprint 0C.

## 1. Context and Problem Statement
Production must run in the client-owned Azure tenant. Hosting (D-003) and SQL deployment (D-002) models were open.

## 4. Decision Outcome
**Chosen (Approved):**
- **Tenancy/ownership:** client-owned production tenant + dedicated production subscription; separate dev/test/staging subscriptions or RGs. Client owns data, secrets, backups, logs, infra; client-owned billing; client DPO/security accountable. Developer access via least-privilege, time-bound RBAC.
- **SQL (D-002): Azure SQL Database** — private endpoint, **public network access disabled**, TDE, **Microsoft Entra auth preferred**, PITR, geo-redundant backup where budget allows, separate DBs per environment, SQL admin only in Key Vault. SQL Managed Instance only if later needs demand (SQL Agent, cross-DB, legacy compat, CLR, lift-and-shift).
- **Hosting (D-003): Azure Container Apps** — API app + background worker + scheduler/job worker (optional reporting/export worker); private ingress where possible; App Gateway/Front Door if needed; managed identity; secrets from Key Vault. **AKS deferred** until internal capability exists (upgrades, patching, ingress, network/pod policy, observability, incident response, cost control).
- **Networking — private-first landing zone:** VNet + subnets; private endpoints for SQL, Key Vault, Storage; Storage restricted; **no secrets in app settings or repo**; Azure Monitor / Log Analytics; **WAF** via Front Door/App Gateway; least-privilege RBAC.
- **Minimum landing-zone RGs:** `rg-prod-app`, `rg-prod-data`, `rg-prod-network`, `rg-prod-security`, `rg-prod-monitoring`.
- **Core services:** Container Apps, Azure SQL DB, Key Vault, Storage Account, Log Analytics, App Insights, VNet+subnets, Private DNS zones, Private endpoints, Container Registry.
- **IaC** via Bicep/Terraform. Backup/DR per **ADR-016** (authoritative).
