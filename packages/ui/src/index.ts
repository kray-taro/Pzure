/**
 * @pzure/ui public API.
 *
 * Components consume semantic tokens via the shared Tailwind preset only
 * (ADR-026). One component = one file = one responsibility (SRP). New variants
 * are added through the token preset / variant maps, not by editing call sites (OCP).
 */

// primitives / shared
export * from './lib/cn';
export * from './lib/intent';
export * from './lib/state';

// core components
export * from './components/Button';
export * from './components/Badge';
export * from './components/Alert';
export * from './components/Input';
export * from './components/StatusChip';

// healthcare components (Module_10 §9-10)
export * from './components/health/AllergyBanner';
export * from './components/health/MedicationWarningPanel';
export * from './components/health/BatchExpirySelector';
export * from './components/health/ControlledMedicineRow';
export * from './components/health/RecalledBatchAlert';
export * from './components/health/OfflineSyncBanner';
