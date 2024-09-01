/// <reference types="vitest" />

export default {
  build: {
    target: 'esnext',
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
      name: 'chromium',
      enabled: true,
      provider: 'playwright',
      headless: Boolean(process.env.CI || process.env.HEADLESS),
      screenshotFailures: false,
    },
  },
};
