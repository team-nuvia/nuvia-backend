import swc from 'unplugin-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['default'],
    provide: 'v8',
    coverage: {
      enabled: false,
      reportOnFailure: true,
      exclude: ['**/*.entity.ts', ...coverageConfigDefaults.exclude],
    },
    root: './test',
    include: ['**/*.e2e-spec.ts'],
    environment: 'node',
    hookTimeout: 50000,
  },
  plugins: [
    viteTsconfigPaths(),
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
});
