-- Baseline migration (Phase 1). Establishes audit + outbox infrastructure that
-- every aggregate depends on. Business tables arrive per module in later phases.
--
-- Conventions enforced from here on:
--   * Every branch-scoped table has a NOT NULL branch_id (ADR-001).
--   * Every mutable aggregate table has a [version] INT NOT NULL (CONCURRENCY §1).
--   * Replay/dedup stores carry expires_at + a cleanup index so they do not
--     grow unbounded as offline writes are replayed (CONCURRENCY §3).

SET XACT_ABORT ON;
GO

-- Transactional outbox (ADR-005). Written in the same tx as the business change.
CREATE TABLE dbo.outbox_message (
    message_id      UNIQUEIDENTIFIER    NOT NULL PRIMARY KEY,
    topic           NVARCHAR(200)       NOT NULL,
    payload         NVARCHAR(MAX)       NOT NULL,
    branch_id       NVARCHAR(64)        NOT NULL,
    created_at      DATETIME2(3)        NOT NULL CONSTRAINT DF_outbox_created DEFAULT SYSUTCDATETIME(),
    published_at    DATETIME2(3)        NULL,
    attempts        INT                 NOT NULL CONSTRAINT DF_outbox_attempts DEFAULT 0
);
GO
CREATE INDEX IX_outbox_unpublished ON dbo.outbox_message (published_at) WHERE published_at IS NULL;
GO

-- Consumer dedup store (CONCURRENCY §3): at-least-once delivery -> dedupe by id.
-- expires_at bounds retention; IX supports the scheduled purge of expired rows.
CREATE TABLE dbo.processed_message (
    message_id      UNIQUEIDENTIFIER    NOT NULL,
    consumer        NVARCHAR(200)       NOT NULL,
    branch_id       NVARCHAR(64)        NOT NULL,
    processed_at    DATETIME2(3)        NOT NULL CONSTRAINT DF_processed_at DEFAULT SYSUTCDATETIME(),
    expires_at      DATETIME2(3)        NOT NULL,
    CONSTRAINT PK_processed_message PRIMARY KEY (message_id, consumer)
);
GO
CREATE INDEX IX_processed_message_expires ON dbo.processed_message (expires_at);
GO

-- Idempotency keys for offline-capable write endpoints (ADR-006, CONCURRENCY §3).
-- expires_at bounds retention; IX supports the scheduled purge of expired rows.
CREATE TABLE dbo.idempotency_key (
    idempotency_key NVARCHAR(128)       NOT NULL PRIMARY KEY,
    response_hash   NVARCHAR(128)       NOT NULL,
    created_at      DATETIME2(3)        NOT NULL CONSTRAINT DF_idem_created DEFAULT SYSUTCDATETIME(),
    expires_at      DATETIME2(3)        NOT NULL
);
GO
CREATE INDEX IX_idempotency_key_expires ON dbo.idempotency_key (expires_at);
GO

-- Immutable audit log (CONCURRENCY §5, COMPLIANCE.md). Append-only.
-- Unified audit sink for the platform: supersedes ADR-004 §5's
-- `audit_security_events`. Records BOTH successful PIN authorizations and
-- FAILED PIN attempts (brute-force/lockout signal, ADR-004). Never stores the
-- PIN or its hash. Role/grant DDL lives in 0001b_roles_grants.sql (#69).
CREATE TABLE dbo.audit_event (
    audit_id        BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    actor_id        NVARCHAR(64)        NOT NULL,
    action          NVARCHAR(120)       NOT NULL,
    subject_type    NVARCHAR(120)       NOT NULL,
    subject_id      NVARCHAR(128)       NOT NULL,
    branch_id       NVARCHAR(64)        NOT NULL,
    authorized_by_subject_id NVARCHAR(128) NULL,  -- subject who PIN-authorized (ADR-004); never the PIN/hash. Width matches subject_id.
    outcome         NVARCHAR(20)        NOT NULL CONSTRAINT DF_audit_outcome DEFAULT 'success'
                        CONSTRAINT CK_audit_outcome CHECK (outcome IN ('success','failure')),
    occurred_at     DATETIME2(3)        NOT NULL CONSTRAINT DF_audit_occurred DEFAULT SYSUTCDATETIME()
);
GO
-- Failed-PIN-attempt query path (brute-force / lockout detection, ADR-004):
-- failed authorization events are rows with outcome='failure'; this index makes
-- the lockout window query (by actor + recent time) cheap.
CREATE INDEX IX_audit_event_failed_auth
    ON dbo.audit_event (actor_id, occurred_at)
    WHERE outcome = 'failure';
GO

-- Error catalogue (#69): THROW codes are documented, not magic numbers, so they
-- are diagnosable in prod. 50001 = audit immutability violation.
-- Single source of truth for application-defined (>= 50000) error codes.
CREATE TABLE dbo.error_catalogue (
    error_number    INT                 NOT NULL PRIMARY KEY,
    symbol          NVARCHAR(80)        NOT NULL,
    description     NVARCHAR(400)       NOT NULL
);
GO
INSERT INTO dbo.error_catalogue (error_number, symbol, description) VALUES
    (50001, 'AUDIT_EVENT_IMMUTABLE', 'audit_event is append-only; UPDATE/DELETE is not permitted.');
GO

-- Layer 2 — defense-in-depth trigger. INSTEAD OF intercepts UPDATE/DELETE before
-- any row changes. The sanctioned, audited retention purge is the ONLY exception:
-- a purge sets SESSION_CONTEXT('audit_purge') and the purge principal logs its
-- own action; see 0001b_roles_grants.sql for the dedicated purge role/grant.
CREATE TRIGGER dbo.trg_audit_event_immutable
ON dbo.audit_event
INSTEAD OF UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    -- Sanctioned, audited retention purge: only DELETE, only when the dedicated
    -- purge principal has opened a SESSION_CONTEXT purge window. UPDATE is never
    -- permitted (append-only). The purge job is responsible for writing its own
    -- audit_event row recording the retention action (auditable purge path, #69).
    IF (
        EXISTS (SELECT 1 FROM deleted)
        AND NOT EXISTS (SELECT 1 FROM inserted)        -- DELETE, not UPDATE
        AND CAST(SESSION_CONTEXT(N'audit_purge') AS BIT) = 1
    )
    BEGIN
        DELETE a FROM dbo.audit_event a
        INNER JOIN deleted d ON d.audit_id = a.audit_id;
        RETURN;
    END;
    THROW 50001, 'audit_event is append-only; UPDATE/DELETE is not permitted.', 1;
END;
GO
