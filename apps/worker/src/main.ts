/**
 * Worker entrypoint (ADR-005): runs the outbox relay (publishes committed
 * outbox rows to the bus) and idempotent, DLQ-backed consumers. Phase 1 shell;
 * relay loop + consumer registration implemented in Phase 4.
 */
export async function bootstrap(): Promise<void> {
  // Phase 1 seam only.
}

if (process.env.NODE_ENV !== 'test') {
  void bootstrap();
}
