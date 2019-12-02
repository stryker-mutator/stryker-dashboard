import { Service } from '@tsed/common';
import { ProjectMapper, createProjectMapper, MutationTestingReportService } from '@stryker-mutator/dashboard-data-access';

@Service()
export default class DataAccess {

  public readonly repositoryMapper: ProjectMapper;
  public readonly mutationTestingReportService: MutationTestingReportService;

  constructor() {
    this.repositoryMapper = createProjectMapper();
    this.mutationTestingReportService = new MutationTestingReportService();
  }
}
