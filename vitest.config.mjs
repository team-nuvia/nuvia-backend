import swc from 'unplugin-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['default'],
    provide: 'v8',
    coverage: {
      enabled: true,
      reportOnFailure: true,
      exclude: ['**/*.entity.ts', ...coverageConfigDefaults.exclude],
    },
    include: ['**/*.spec.ts'],
    environment: 'node',
    hookTimeout: 50000,
  },
  plugins: [
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
    viteTsconfigPaths(),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
});