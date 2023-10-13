import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const SOURCE_DIR = resolve(__dirname, 'src');

export default defineConfig({
  plugins: [dts()],
  build: {
    target: 'ES2020',
    minify: false,
    lib: {
      entry: resolve(SOURCE_DIR, 'main.ts'),
      fileName: 'ui-components',
      formats: ['es'],
    },
    rollupOptions: {
      external: /^lit/,
      output: {
        preserveModules: true,
        preserveModulesRoot: SOURCE_DIR,
        entryFileNames: '[name].js',
        inlineDynamicImports: false,
      },
    },
  },
});
