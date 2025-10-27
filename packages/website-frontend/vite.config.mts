/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    cssMinify: 'lightningcss',
    target: 'esnext',
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist()),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  server: {
    host: 'localhost',
    port: 4200,
    proxy: {
      '/api': 'http://localhost:1337',
    },
  },
  test: {
    onConsoleLog(log) {
      // ignore the dev mode warning in test logs
      if (log.includes('Lit is in dev mode.')) return false;
      if (log.includes('Multiple versions of Lit loaded.')) return false;

      return true;
    },
    ...(process.env.CI ? { retry: 2 } : {}),
    restoreMocks: true,
    unstubGlobals: true,
    globals: true,
    include: ['test/unit/**/*.spec.ts'],
    browser: {
      enabled: true,
      provider: playwright({}),
      instances: [
        {
          browser: 'chromium',
          headless: Boolean(process.env.CI || process.env.HEADLESS),
          screenshotFailures: false,
        },
      ],
    },
  },
});
