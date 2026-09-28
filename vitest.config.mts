import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    // Integration tests share one real test database (see test/integration/setup.ts) with
    // prefix-based cleanup in afterEach, not per-test transactions — running files in
    // parallel lets one file's cleanup delete rows a concurrently-running file still needs.
    fileParallelism: false,
  },
})
