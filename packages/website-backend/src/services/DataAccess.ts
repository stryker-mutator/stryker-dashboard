import { Service } from '@tsed/common';
import {
  ProjectMapper,
  createProjectMapper,
  MutationTestingReportService,
  RealTimeMutantsBlobService,
} from '@stryker-mutator/dashboard-data-access';

@Service()
export default class DataAccess {
  public readonly repositoryMapper: ProjectMapper;
  public readonly mutationTestingReportService: MutationTestingReportService;
  public readonly blobService: RealTimeMutantsBlobService;

  constructor() {
    this.repositoryMapper = createProjectMapper();
    this.mutationTestingReportService = new MutationTestingReportService();
    this.blobService = new RealTimeMutantsBlobService();
  }
}
