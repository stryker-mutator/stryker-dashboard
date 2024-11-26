import { Controller, Get } from '@nestjs/common';
import { version as frontendVersion } from '@stryker-mutator/dashboard-frontend';
import fs from 'fs/promises';

const dashboardVersion = (
  JSON.parse(await fs.readFile(new URL('../../../package.json', import.meta.url), 'utf-8')) as { version: string }
).version;

@Controller('/version')
export default class VersionController {
  /**
   * Gets the current version of the dashboard
   */
  @Get()
  public get() {
    return {
      dashboard: dashboardVersion,
      frontend: frontendVersion,
    };
  }
}
