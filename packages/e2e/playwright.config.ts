import { expect, type PlaywrightTestConfig } from '@playwright/test';
import { matchers } from './helpers/custom-matchers.js';
expect.extend(matchers);

const config: PlaywrightTestConfig = {
  testDir: 'spec',
  workers: 1,
  globalSetup: './spec/global-setup.ts',
  use: {
    video: 'on',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'acceptance',
      use: {
        baseURL: 'https://stryker-dashboard-acceptance.azurewebsites.net',
      },
    },
    {
      name: 'local',
      use: {
        baseURL: 'http://localhost:4200',
      },
    },
  ],
};
export default config;
