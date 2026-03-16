import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const SOURCE_DIR = resolve(__dirname, 'src');
const BUILD_DIR = resolve(__dirname, 'dist');
const TYPES_DIR = resolve(__dirname, 'dist');
// const TYPES_DIR = resolve(__dirname, 'types'); /* This is kind of better, but the node resolution angular project does not support it */
// const TYPES_DIR = BUILD_DIR;

export default defineConfig({
  plugins: [
    tailwindcss(),
    dts({
      outDir: TYPES_DIR,
    }),
  ],
  css: {
    transformer: 'lightningcss',
  },
  build: {
    target: 'esnext',
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
          entryFileNames: '[name].js',
          inlineDynamicImports: false,
        },
      ],
    },
  },
});
