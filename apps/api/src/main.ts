/**
 * NestJS API entrypoint (Phase 3 implements controllers/middleware).
 * Phase 1: bootstrap shell that wires structured logging + tracing on startup.
 * Controllers are thin (no business logic); RBAC + branch scoping (ADR-001/004)
 * and idempotency middleware (ADR-006) are enforced at this boundary.
 */
export async function bootstrap(): Promise<void> {
  // Intentionally minimal in Phase 1. NestModule + adapters added in Phase 3.
  // Observability is initialized before the app starts (see observability.ts).
}

if (process.env.NODE_ENV !== 'test') {
  void bootstrap();
}
