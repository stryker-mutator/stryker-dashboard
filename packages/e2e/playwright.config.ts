import { expect, PlaywrightTestConfig } from "@playwright/test";

import { matchers } from "./helpers/custom-matchers";
expect.extend(matchers);

const config: PlaywrightTestConfig = {
  testDir: "spec",
  workers: 1,
  globalSetup: require.resolve("./spec/global-setup"),
  use: {
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "acceptance",
      use: {
        baseURL: "https://stryker-dashboard-acceptance.azurewebsites.net",
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
