import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ReportStatisticsDto } from '@stryker-mutator/dashboard-common';
import {
  createMutationTestingMetricsMapper,
  DashboardQuery,
  MutationTestingMetrics,
  MutationTestingMetricsMapper,
} from '@stryker-mutator/dashboard-data-access';

import { parseSlug } from '../utils/utils.js';

@Controller('/statistics')
export default class StatisticsController {
  #logger = new Logger(StatisticsController.name);
  #mutationMetricsMapper: MutationTestingMetricsMapper;

  constructor() {
    this.#mutationMetricsMapper = createMutationTestingMetricsMapper();
  }

  @Get('/:slug(*)')
  public async get(@Param('slug') slug: string): Promise<ReportStatisticsDto[]> {
    this.#logger.debug(`Fetching statistics for slug: ${slug}`);
    const { project } = parseSlug(slug);

    const metricResults = await this.#mutationMetricsMapper.findAll(
      DashboardQuery.create(MutationTestingMetrics).wherePartitionKeyEquals({ project }),
    );

    return metricResults.map((metricResult) => metricResult.model as ReportStatisticsDto);
  }
}
