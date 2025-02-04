import { Injectable } from '@nestjs/common';
import {
  createMutationTestingMetricsMapper,
  createProjectMapper,
  MutationTestingMetricsMapper,
  MutationTestingReportService,
  ProjectMapper,
  RealTimeMutantsBlobService,
} from '@stryker-mutator/dashboard-data-access';

@Injectable()
export default class DataAccess {
  public readonly repositoryMapper: ProjectMapper;
  public readonly mutationTestingMetricsMapper : MutationTestingMetricsMapper;
  public readonly mutationTestingReportService: MutationTestingReportService;
  public readonly blobService: RealTimeMutantsBlobService;

  constructor() {
    this.repositoryMapper = createProjectMapper();
    this.mutationTestingMetricsMapper = createMutationTestingMetricsMapper();
    this.mutationTestingReportService = new MutationTestingReportService();
    this.blobService = new RealTimeMutantsBlobService();
  }
}
