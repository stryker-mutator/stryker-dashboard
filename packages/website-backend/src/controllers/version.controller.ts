import fs from 'fs';
import { version } from '@stryker-mutator/dashboard-frontend';
import { Controller, Get } from '@nestjs/common';

const dashboardVersion = JSON.parse(
  fs.readFileSync(new URL('../../../package.json', import.meta.url), 'utf-8'),
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
      frontend: version,
    };
  }
}
