import { DashboardQuery } from "../mappers/DashboardQuery.js";
import type { MutationTestingMetricsMapper } from "../mappers/factories.js";
import { createMutationTestingMetricsMapper } from "../mappers/factories.js";
import { MutationTestingMetrics } from "../models/MutationTestingMetrics.js";

export class MutationTestingMetricsService {
  constructor(
    private readonly mutationMetricsMapper: MutationTestingMetricsMapper = createMutationTestingMetricsMapper(),
  ) {}


  public async getMetrics(project: string): Promise<MutationTestingMetrics[]> {
    const metricResults = await this.mutationMetricsMapper.findAll(
      DashboardQuery.create(MutationTestingMetrics)
      .wherePartitionKeyEquals({ project })
    )

    return metricResults.map((metricResult) => metricResult.model);
  }
}
