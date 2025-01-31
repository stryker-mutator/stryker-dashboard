import { MutationTestingReport, Project } from '../models/index.js';
import { MutationTestingMetrics } from '../models/MutationTestingMetrics.js';
import type { Mapper } from './Mapper.js';
import TableStorageMapper from './TableStorageMapper.js';

export type MutationTestingReportMapper = Mapper<MutationTestingReport, 'projectName' | 'version', 'moduleName'>;

export type MutationTestingMetricsMapper = Mapper<MutationTestingMetrics, 'project', 'version'>;

export type ProjectMapper = Mapper<Project, 'owner', 'name'>;

export function createMutationTestingReportMapper(): MutationTestingReportMapper {
  return new TableStorageMapper(MutationTestingReport);
}

export function createMutationTestingMetricsMapper(): MutationTestingMetricsMapper {
  return new TableStorageMapper(MutationTestingMetrics);
}

export function createProjectMapper(): ProjectMapper {
  return new TableStorageMapper(Project);
}
