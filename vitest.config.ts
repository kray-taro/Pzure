import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['packages/ui/src/test/setup.ts'],
    include: ['packages/**/*.{test,smoke.test}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      include: ['packages/**/src/**'],
      // Stories are executable documentation, not units under test.
      exclude: ['**/*.stories.tsx', '**/test/**', 'packages/**/.storybook/**'],
      // Acceptance: coverage >= 85%.
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
});
