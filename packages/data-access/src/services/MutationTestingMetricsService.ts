import { DashboardQuery } from "../mappers/DashboardQuery.js";
import type { MutationTestingMetricsMapper } from "../mappers/factories.js";
import { createMutationTestingMetricsMapper } from "../mappers/factories.js";
import { MutationTestingMetric } from "../models/MutationTestingMetrics.js";

export class MutationTestingMetricsService {
  constructor(
    private readonly mutationMetricsMapper: MutationTestingMetricsMapper = createMutationTestingMetricsMapper(),
  ) {}


  public async getMetrics(project: string): Promise<MutationTestingMetric[]> {
    const metricResults = await this.mutationMetricsMapper.findAll(
      DashboardQuery.create(MutationTestingMetric)
      .wherePartitionKeyEquals({ project })
    )

    return metricResults.map((metricResult) => metricResult.model);
  }
}
