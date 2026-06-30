/**
 * Structured logging + distributed tracing bootstrap (Phase 1 requirement:
 * "from day one"). No PHI/PII may appear in logs or traces (COMPLIANCE.md).
 * Concrete OTEL/exporter wiring uses OTEL_EXPORTER_OTLP_ENDPOINT / LOG_LEVEL.
 */
export interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

export function initObservability(): void {
  // Phase 1 seam. Real OTEL SDK + structured JSON logger initialized here.
}
