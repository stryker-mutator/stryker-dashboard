import { Controller, Get, Param } from '@nestjs/common';
import { createMutationTestingMetricsMapper, DashboardQuery, MutationTestingMetricsMapper } from '@stryker-mutator/dashboard-data-access';
import { MutationTestingMetric } from '@stryker-mutator/dashboard-data-access/src/models/MutationTestingMetrics.js';

import { parseSlug } from '../utils/utils.js';

@Controller('/metrics')
export default class MetricsController {
  constructor(
    private readonly mutationMetricsMapper: MutationTestingMetricsMapper = createMutationTestingMetricsMapper(),
  ) {}

  @Get('/:slug(*)')
  public async get(
    @Param('slug') slug: string,
  ): Promise<MutationTestingMetric[]> {
    const { project } = parseSlug(slug);

    const metricResults = await this.mutationMetricsMapper.findAll(
      DashboardQuery.create(MutationTestingMetric)
      .wherePartitionKeyEquals({ project })
    )

    return metricResults.map((metricResult) => metricResult.model as MutationTestingMetric);
  }
}
