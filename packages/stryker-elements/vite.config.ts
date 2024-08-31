import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const SOURCE_DIR = resolve(__dirname, 'src');
const BUILD_DIR = resolve(__dirname, 'dist');
const TYPES_DIR = resolve(__dirname, 'dist');
// const TYPES_DIR = resolve(__dirname, 'types'); /* This is kind of better, but the node resolution angular project does not support it */
// const TYPES_DIR = BUILD_DIR;

export default defineConfig({
  plugins: [
    dts({
      outDir: TYPES_DIR,
    }),
  ],
  build: {
    target: 'ESNext',
    sourcemap: true,
    minify: false,
    outDir: BUILD_DIR,
    emptyOutDir: true,
    lib: {
      entry: resolve(SOURCE_DIR, 'main.ts'),
    },
    rollupOptions: {
      external: /^lit/,
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: SOURCE_DIR,
          entryFileNames: '[name].mjs',
          inlineDynamicImports: false,
        },
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: SOURCE_DIR,
          entryFileNames: '[name].cjs',
          inlineDynamicImports: false,
        },
      ],
    },
  },
});
