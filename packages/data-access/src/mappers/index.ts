import TableStorageMapper from './TableStorageMapper';
import { MutationTestingReport, Project } from '..';
import { Mapper } from './Mapper';

export interface MutationTestingReportMapper extends Mapper<MutationTestingReport, 'projectName' | 'version', 'moduleName'> { }

export interface ProjectMapper extends Mapper<Project, 'owner', 'name'> { }

export function createMutationTestingReportMapper(): MutationTestingReportMapper {
  return new TableStorageMapper(MutationTestingReport);
}

export function createProjectMapper(): ProjectMapper {
  return new TableStorageMapper(Project);
}
