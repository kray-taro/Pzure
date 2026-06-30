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
  /**
   * Set when a pharmacist PIN step-up authorized the action (ADR-004).
   * Holds the authorizing pharmacist's subject id (a non-secret reference) —
   * NEVER the PIN or its hash. The PIN exists only as a bcrypt `pin_hash` in
   * `core_users`; the audit log records the fact of authorization, not the
   * secret, so the append-only log can never leak a credential.
   */
  readonly authorizedBySubjectId?: string;
  /** Whether the action succeeded or failed (e.g. failed PIN attempt). Defaults to 'success'. */
  readonly outcome: 'success' | 'failure';
}
export interface AuditLogger {
  record(event: AuditEvent): Promise<void>;
}
