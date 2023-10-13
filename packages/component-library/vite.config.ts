import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    target: "ES2020",
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'StrykerComponentLib',
      fileName: 'str-comp-lib',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: /^lit/,
      
    },
  },
})