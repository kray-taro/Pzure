# ADR-001: Branch-Aware Multi-Tenancy

**Status:** Approved  
**Date:** 2026-05-22  
**Author(s):** Solutions Architect

## 1. Context and Problem Statement

Pzure will launch with 10 branches (starting with a 2-branch pilot) and aims to scale further. The system must support corporate-level reporting, cross-branch patient visits, branch-specific stock management, and strict data access controls per branch.

The key question is how to physically and logically isolate data between branches to ensure security, performance, and operational flexibility without introducing unnecessary maintenance overhead.

## 2. Decision Drivers

- **Consolidated Reporting:** Management needs real-time views across all branches without complex ETL pipelines.
- **Patient Mobility:** A patient registered at Branch A may visit Branch B. Their EMR must be accessible, subject to consent rules.
- **Low Operational Overhead:** The MVP must be built on free-tier/open-source tools; managing 10 separate databases is too costly and operationally complex for a greenfield startup.
- **Data Privacy:** Branch staff must only see data for the branch they are currently logged into, unless explicitly authorised otherwise.

## 3. Considered Options

1. **Database-per-branch:** Each branch has its own physical SQL Server database.
2. **Schema-per-branch:** All branches share a database, but each gets its own schema (e.g., `branch1.sales`, `branch2.sales`).
3. **Shared Database, Shared Schema (Row-Level Tenancy):** All branches share the same tables. Every operational table includes an `organisation_id` and `branch_id` column to scope the data.

## 4. Decision Outcome

**Chosen option:** Option 3 (Shared Database, Shared Schema with Row-Level Tenancy).

For a 10-branch health retail platform, row-level scoping using `organisation_id` and `branch_id` is the industry standard for multi-tenant SaaS and enterprise chains. It allows effortless cross-branch reporting, shared patient records, and shared master data (tariffs, products, ICD-10) while isolating transactional data (sales, stock, dispenses) at the query level.

### Positive Consequences

- **Simplified Master Data:** Product catalogues, KEML lists, and ICD-10 codes only need to be imported once.
- **Unified Patient Record:** A single `patient.patients` record exists, preventing dangerous duplicate clinical histories.
- **Ease of Deployment:** One set of database migrations. CI/CD pipelines remain simple.

### Negative Consequences

- **Query Risk:** Developers must never forget to append `WHERE branch_id = X` in queries. A forgotten filter could leak data across branches.
- **Blast Radius:** If the database goes down, all 10 branches go down simultaneously.

## 5. Implementation Notes

- **Mandatory Columns:** Every transactional table must include `branch_id (UNIQUEIDENTIFIER)`. Every top-level master data table must include `organisation_id (UNIQUEIDENTIFIER)`.
- **ORM/Query Builder Enforcement:** The backend (NestJS) must use global query scopes or interceptors to automatically inject the user's current `branch_id` from their JWT token into all read and write queries.
- **Cross-Branch Operations:** For inter-branch transfers or corporate reporting, a specific `Corporate` role or system service account will bypass the branch scope.
