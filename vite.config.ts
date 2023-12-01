import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    testTimeout: 15000,
    setupFiles: ['test/index.ts'],
    env: {
      NODE_ENV: 'test',
      SUPERTEST: 'true',
    },
    coverage: {
      provider: 'istanbul',
      statements: 20,
      reporter: ['text', 'html', 'lcov'],
      include: ['src/use-cases/**'],
    },
    globals: true,
    environment: 'node',
  },
});
