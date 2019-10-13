import { Get, Controller } from '@tsed/common';
import { version } from '@stryker-mutator/dashboard-frontend';

const dashboardVersion = require('../../../package.json').version;

@Controller('/version')
export default class VersionController {

  /**
   * Gets the current version of the dashboard
   */
  @Get('/')
  public get() {
    return {
      dashboard: dashboardVersion,
      frontend: version
    };
  }

}
