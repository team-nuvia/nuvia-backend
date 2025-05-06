import { resolve } from 'path';
import swc from 'unplugin-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    environment: 'node',
    // alias: {
    //   // Ensure Vitest correctly resolves TypeScript path aliases
    //   '@util': resolve(__dirname, './../src/util'),
    //   '@users': resolve(__dirname, './../src/users'),
    //   '@types': resolve(__dirname, './../src/types'),
    //   '@logger': resolve(__dirname, './../src/logger'),
    //   '@database': resolve(__dirname, './../src/database'),
    //   '@config': resolve(__dirname, './../src/config'),
    //   '@common': resolve(__dirname, './../src/common'),
    //   '@auth': resolve(__dirname, './../src/auth'),
    //   '@': resolve(__dirname, './../src'),
    // },
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // module:{type:'es6'}
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          decoratorMetadata: true,
          legacyDecorator: true,
        },
        target: 'es2020',
      },
      module: {
        type: 'commonjs', // 또는 'es6'
      },
    }),
    viteTsconfigPaths(),
  ],
  // esbuild: {
  //   target: 'es2021',
  // },
  // resolve: {
  //   alias: {
  //     // Ensure Vitest correctly resolves TypeScript path aliases
  //     '@util': resolve(__dirname, './../src/util'),
  //     '@users': resolve(__dirname, './../src/users'),
  //     '@types': resolve(__dirname, './../src/types'),
  //     '@logger': resolve(__dirname, './../src/logger'),
  //     '@database': resolve(__dirname, './../src/database'),
  //     '@config': resolve(__dirname, './../src/config'),
  //     '@common': resolve(__dirname, './../src/common'),
  //     '@auth': resolve(__dirname, './../src/auth'),
  //     '@': resolve(__dirname, './../src'),
  //   },
  // },
});
