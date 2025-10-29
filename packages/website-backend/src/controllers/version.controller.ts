import { Controller, Get } from '@nestjs/common';
import frontendPkg from '@stryker-mutator/dashboard-frontend/package.json' with { type: 'json' };

import pkg from '../../package.json' with { type: 'json' };

const frontendVersion = frontendPkg.version;
const dashboardVersion = pkg.version;

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
