import tailwindcss from '@tailwindcss/vite';
import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), dts()],
  css: {
    transformer: 'lightningcss',
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    minify: false,
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/main.ts',
    },
    rolldownOptions: {
      external: [/^lit/, /^@stryker-mutator/],
      output: [
        {
          format: 'es',
          preserveModules: true,
          entryFileNames: '[name].js',
        },
      ],
    },
  },
});
