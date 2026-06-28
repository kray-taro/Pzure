/**
 * Tailwind config for @pzure/ui (Storybook + consuming app shells).
 *
 * OCP: the theme is extended ONLY through the shared design-tokens preset.
 * New tokens flow in by changing the preset, not by editing components.
 * ADR-026: every utility class resolves to a semantic token; no raw hex here.
 */
import type { Config } from 'tailwindcss';
import preset from '@pzure/design-tokens/tailwind';

const config: Config = {
  presets: [preset as unknown as Config],
  content: [
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
};

export default config;
