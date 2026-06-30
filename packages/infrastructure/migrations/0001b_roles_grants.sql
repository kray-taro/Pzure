-- Role / grant DDL, split from schema DDL (#69) so permission changes are
-- reviewable independently of schema changes. Runs after 0001_baseline.sql.
SET XACT_ABORT ON;
GO

-- Application role: least privilege on the append-only audit log. DENY overrides
-- any future GRANT, so a later change cannot silently re-enable mutation.
IF DATABASE_PRINCIPAL_ID('pzure_app') IS NULL
    CREATE ROLE pzure_app;
GO
GRANT INSERT, SELECT ON dbo.audit_event TO pzure_app;
DENY  UPDATE, DELETE ON dbo.audit_event TO pzure_app;
GO

-- Sanctioned retention-purge role (#69). Separate from pzure_app. May DELETE
-- only through the immutability trigger's audited window (SESSION_CONTEXT
-- 'audit_purge'); still DENIED UPDATE so it can never tamper, only expire.
IF DATABASE_PRINCIPAL_ID('pzure_audit_purge') IS NULL
    CREATE ROLE pzure_audit_purge;
GO
GRANT DELETE, SELECT ON dbo.audit_event TO pzure_audit_purge;
DENY  UPDATE         ON dbo.audit_event TO pzure_audit_purge;
GO
