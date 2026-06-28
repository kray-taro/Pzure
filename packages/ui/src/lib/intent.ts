/**
 * Maps a semantic intent to Tailwind utility classes that resolve to
 * design-token colours via the shared preset. This is the ONE place intents
 * become classes (DRY); components depend on the intent abstraction, never on
 * concrete colours (Dependency Inversion, ADR-026).
 *
 * Class names reference the semantic colour groups exposed by the preset
 * (status.*, clinical.*, finance.*, inventory.*, claims.*, sync.*) and the
 * role tokens (bg.*, text.*, border.*). No raw hex appears anywhere.
 */
export type Intent =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface IntentClasses {
  readonly text: string;
  readonly bgSoft: string;
  readonly border: string;
  readonly solid: string;
}

export const intentClasses: Record<Intent, IntentClasses> = {
  neutral: {
    text: 'text-status-neutral',
    bgSoft: 'bg-bg-muted',
    border: 'border-border-default',
    solid: 'bg-status-neutral text-text-inverse',
  },
  success: {
    text: 'text-status-success',
    bgSoft: 'bg-bg-surface',
    border: 'border-status-success',
    solid: 'bg-status-success text-text-inverse',
  },
  warning: {
    text: 'text-status-warning',
    bgSoft: 'bg-bg-surface',
    border: 'border-status-warning',
    solid: 'bg-status-warning text-text-inverse',
  },
  danger: {
    text: 'text-status-danger',
    bgSoft: 'bg-bg-surface',
    border: 'border-status-danger',
    solid: 'bg-status-danger text-text-inverse',
  },
  info: {
    text: 'text-status-info',
    bgSoft: 'bg-bg-surface',
    border: 'border-status-info',
    solid: 'bg-status-info text-text-inverse',
  },
};
