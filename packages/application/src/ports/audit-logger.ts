/**
 * AuditLogger port (CONCURRENCY §5, COMPLIANCE.md). Append-only and immutable.
 * Every PHI/PII read or write emits an event. Emitted from a cross-cutting
 * interceptor, not per-handler, so it cannot be skipped by business code.
 */
export interface AuditEvent {
  readonly actorId: string;
  readonly action: string;
  readonly subjectType: string;
  readonly subjectId: string;
  readonly branchId: string;
  readonly occurredAt: Date;
  /** Set when a pharmacist PIN authorized the action (ADR-004). */
  readonly authorizedByPin?: string;
}

export interface AuditLogger {
  record(event: AuditEvent): Promise<void>;
}
