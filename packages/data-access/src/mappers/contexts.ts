import TableStorageMapper from './TableStorageMapper';
import { MutationTestingReport, Project } from '..';
import { Mapper } from './Mapper';
import { MutationTestingReportMapperProxy } from './MutationTestingReportMapperProxy';

export interface MutationTestingReportMapper extends Mapper<MutationTestingReport, 'projectName' | 'version', 'moduleName'> { }

export interface ProjectMapper extends Mapper<Project, 'owner', 'name'> { }

export function createMutationTestingReportMapper(): MutationTestingReportMapperProxy {
  return new MutationTestingReportMapperProxy();
}

export function createMutationTestingReportMapperWithoutReportJson(): MutationTestingReportMapper {
  return new TableStorageMapper(MutationTestingReport);
}

export function createProjectMapper(): ProjectMapper {
  return new TableStorageMapper(Project);
}
