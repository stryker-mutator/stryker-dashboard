import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const SOURCE_DIR = resolve(__dirname, 'src');
const OUTPUT_DIR = resolve(__dirname, 'dist');
const BUILD_DIR = resolve(OUTPUT_DIR, 'build');
const TYPES_DIR = resolve(OUTPUT_DIR, 'types');

export default defineConfig({
  plugins: [
    dts({
      outDir: TYPES_DIR,
    }),
  ],
  build: {
    target: 'ES2020',
    minify: false,
    outDir: BUILD_DIR,
    emptyOutDir: true,
    lib: {
      entry: resolve(SOURCE_DIR, 'main.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: /^lit/,
      output: {
        preserveModules: true,
        preserveModulesRoot: SOURCE_DIR,
        entryFileNames: '[name].[format].js',
        inlineDynamicImports: false,
      },
    },
  },
});
