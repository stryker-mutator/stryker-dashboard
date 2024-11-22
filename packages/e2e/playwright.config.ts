import { expect, defineConfig, devices } from '@playwright/test';
import { matchers } from './helpers/custom-matchers.js';
expect.extend(matchers);

export default defineConfig({
  testDir: 'spec',
  workers: 1,
  globalSetup: './spec/global-setup.ts',
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html']] : [['list'], ['html']],
  use: {
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'acceptance',
      use: {
        baseURL: 'https://stryker-dashboard-acceptance.azurewebsites.net',
        trace: 'on-first-retry',
      },
    },
    {
      name: 'local',
      use: {
        headless: false,
        baseURL: 'http://localhost:4200',
        trace: 'retain-on-failure',
      },
    },
  ],
});
