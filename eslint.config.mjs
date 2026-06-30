// Flat ESLint config (ESLint 9). Single source of truth for lint policy across
// the monorepo. Two enforcement arms, both fail the build (they never warn):
//
//   1. Clean-architecture layer boundaries (@nx/enforce-module-boundaries):
//      domain <- application <- infrastructure <- app; contracts is a leaf.
//   2. Design-token discipline (ADR-026): no raw hex in components and no
//      import of the primitive `palette` outside the token source.
//
// Replaces the legacy .eslintrc.json (ESLint 8) and develop's eslint.config.js,
// unifying both rule sets so neither invariant is lost on merge.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nx from '@nx/eslint-plugin';

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
    ignores: ['**/dist/**', '**/.npm/**', '**/node_modules/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Layer-boundary enforcement (DIP / clean architecture).
    plugins: { '@nx': nx },
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          depConstraints: [
            { sourceTag: 'layer:domain', onlyDependOnLibsWithTags: ['layer:domain'] },
            { sourceTag: 'layer:application', onlyDependOnLibsWithTags: ['layer:application', 'layer:domain'] },
            { sourceTag: 'layer:infrastructure', onlyDependOnLibsWithTags: ['layer:infrastructure', 'layer:application', 'layer:domain', 'layer:contracts'] },
            { sourceTag: 'layer:app', onlyDependOnLibsWithTags: ['layer:application', 'layer:domain', 'layer:infrastructure', 'layer:contracts'] },
            { sourceTag: 'layer:contracts', onlyDependOnLibsWithTags: ['layer:contracts'] },
            { sourceTag: 'layer:design-tokens', onlyDependOnLibsWithTags: [] },
          ],
        },
      ],
    },
  },
  {
    // The palette source is the ONE place raw hex is allowed.
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
);
