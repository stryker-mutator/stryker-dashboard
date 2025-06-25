import { Controller, Get } from '@nestjs/common';
import { version as frontendVersion } from '@stryker-mutator/dashboard-frontend';

import pkg from '../../package.json' with { type: 'json' };

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
