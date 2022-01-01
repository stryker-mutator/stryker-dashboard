import { PlaywrightTestConfig } from "@playwright/test";
const config: PlaywrightTestConfig = {
  testDir: "spec",
  workers: 1,
  projects: [
    {
      name: "acceptance",
      use: {
        baseURL: "https://stryker-dashboard-acceptance.azurewebsites.net",
        video: 'retain-on-failure',
      },
    },
    {
      name: "local",
      use: {
        baseURL: "http://localhost:4200",
      },
    },
  ],
};
export default config;
