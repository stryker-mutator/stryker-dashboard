import { Mapper } from './Mapper';
import { MutationTestingReport, Project } from '../models';
import TableStorageMapper from './TableStorageMapper';

export interface MutationTestingReportMapper extends Mapper<MutationTestingReport, 'projectName' | 'version', 'moduleName'> { }

export interface ProjectMapper extends Mapper<Project, 'owner', 'name'> { }

export function createMutationTestingReportMapper(): MutationTestingReportMapper {
  return new TableStorageMapper(MutationTestingReport);
}

export function createProjectMapper(): ProjectMapper {
  return new TableStorageMapper(Project);
}
