import { Controller, Get, Param } from '@nestjs/common';
import {
  createMutationTestingReportMapper,
  DashboardQuery,
  MutationTestingReport,
  MutationTestingReportMapper,
} from '@stryker-mutator/dashboard-data-access';
import { version as frontendVersion } from '@stryker-mutator/dashboard-frontend';
import fs from 'fs/promises';

import { parseSlug } from '../utils/utils.js';

const dashboardVersion = (
  JSON.parse(await fs.readFile(new URL('../../../package.json', import.meta.url), 'utf-8')) as { version: string }
).version;

@Controller('/version')
export default class VersionController {
  #reportMapper: MutationTestingReportMapper;

  constructor() {
    this.#reportMapper = createMutationTestingReportMapper();
  }

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

  @Get('/:slug(*)')
  public async getVersionsForReport(@Param('slug') slug: string): Promise<string[]> {
    const { project } = parseSlug(slug);
    const reports = await this.#reportMapper.findAll(
      DashboardQuery.create(MutationTestingReport).findPartitionKeyRange(project),
    );
    return reports.map((project) => project.model.version);
  }
}
