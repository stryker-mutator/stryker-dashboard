/// <reference types="vitest" />

export default {
  server: {
    host: 'localhost',
    port: 4200
  },
  test: {
    include: ['test/**/*.spec.ts'],
    setupFiles: ['./test/setup.ts'],
  }
}
