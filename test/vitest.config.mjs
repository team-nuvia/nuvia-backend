/// <reference types="vitest" />

import swc from 'unplugin-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite(),
    viteTsconfigPaths(),
  ],
  // resolve: {
  //   alias: {
  //     // Ensure Vitest correctly resolves TypeScript path aliases
  //     src: resolve(__dirname, './src'),
  //   },
  // },
});
