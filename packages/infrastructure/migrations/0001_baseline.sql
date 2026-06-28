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

-- Immutable audit log (CONCURRENCY §5, COMPLIANCE.md). Append-only; no UPDATE/DELETE grants.
CREATE TABLE dbo.audit_event (
    audit_id        BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    actor_id        NVARCHAR(64)        NOT NULL,
    action          NVARCHAR(120)       NOT NULL,
    subject_type    NVARCHAR(120)       NOT NULL,
    subject_id      NVARCHAR(128)       NOT NULL,
    branch_id       NVARCHAR(64)        NOT NULL,
    authorized_by_subject_id NVARCHAR(64) NULL,  -- pharmacist who PIN-authorized (ADR-004); never the PIN/hash
    occurred_at     DATETIME2(3)        NOT NULL CONSTRAINT DF_audit_occurred DEFAULT SYSUTCDATETIME()
);
GO
