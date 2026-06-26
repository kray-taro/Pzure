// Infrastructure: concrete adapters implementing domain/application ports (DIP).
// Phase 1 provides wiring shells only; real adapters arrive in Phase 2+.
export * from './messaging/bullmq-message-bus.js';
export * from './persistence/transaction.js';
