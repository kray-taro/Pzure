// Flat ESLint config. The custom rules below are the enforcement arm of
// ADR-026 and the DDIA maintainability goal: they fail the build, they do not
// merely warn.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const NO_RAW_HEX = {
  selector: "Literal[value=/#[0-9a-fA-F]{3,8}/]",
  message:
    'Raw hex colour is not allowed here. Use a semantic token from @pzure/design-tokens (ADR-026).',
};

const NO_PALETTE_IMPORT = {
  selector:
    "ImportDeclaration[source.value=/colors(\\.js|\\.ts)?$/] > ImportSpecifier[imported.name='palette']",
  message:
    'Do not import the primitive `palette`. Components must use semantic groups (status, clinical, finance, inventory, claims, sync) - ADR-026.',
};

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/.npm/**', '**/node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // The palette source is the ONE place hex is allowed.
    files: ['packages/design-tokens/src/colors.ts'],
    rules: {
      'no-restricted-syntax': ['error', NO_PALETTE_IMPORT],
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['packages/design-tokens/src/colors.ts'],
    rules: {
      'no-restricted-syntax': ['error', NO_RAW_HEX, NO_PALETTE_IMPORT],
    },
  },
  {
    // Drift-test palette = parity oracle reference data; literal hex is required.
    // Only no-restricted-syntax is off here — no-explicit-any stays enabled.
    files: ['packages/design-tokens/src/tokens.drift.test.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },  
);
