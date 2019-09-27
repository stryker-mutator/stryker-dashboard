import { Service } from '@tsed/common';
import { ProjectMapper, MutationTestingReportMapper, createMutationTestingReportMapper, createProjectMapper } from '@stryker-mutator/dashboard-data-access';

@Service()
export default class DataAccess {

  public readonly repositoryMapper: ProjectMapper;
  public readonly mutationTestingReportMapper: MutationTestingReportMapper;

  constructor() {
    this.repositoryMapper = createProjectMapper();
    this.mutationTestingReportMapper = createMutationTestingReportMapper();
  }
}
