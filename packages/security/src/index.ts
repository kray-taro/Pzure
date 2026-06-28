/** @pzure/security public API: PII/PHI classification registry (ADR-003/007, #55). */
export {
  COLUMN_CLASSIFICATIONS,
  isSensitive,
  isSensitiveByConvention,
} from './pii-registry';
export type { ColumnClassification, DataClass } from './pii-registry';
export { ERD_SENSITIVE_COLUMNS, isSensitiveTableByConvention } from './erd-schema';
export type { ErdColumn } from './erd-schema';
