import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Package unit tests AND the cross-cutting guards/tests under tests/**.
    // The tenancy scoping guard (tests/tenancy/scoping-guard.test.ts) must run
    // in `npm test` so the §6.4 invariant is enforced on every pipeline.
    include: ['packages/**/*.test.ts', 'tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      include: ['packages/**/src/**'],
    },
  },
});
