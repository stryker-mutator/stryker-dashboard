import { MutationTestingReport, Project } from '../models/index.js';
import { MutationTestingMetric } from '../models/MutationTestingMetrics.js';
import type { Mapper } from './Mapper.js';
import TableStorageMapper from './TableStorageMapper.js';

export type MutationTestingReportMapper = Mapper<MutationTestingReport, 'projectName' | 'version', 'moduleName'>;

export type MutationTestingMetricsMapper = Mapper<MutationTestingMetric, 'project', 'version'>;

export type ProjectMapper = Mapper<Project, 'owner', 'name'>;

export function createMutationTestingReportMapper(): MutationTestingReportMapper {
  return new TableStorageMapper(MutationTestingReport);
}

export function createMutationTestingMetricsMapper(): MutationTestingMetricsMapper {
  return new TableStorageMapper(MutationTestingMetric);
}

export function createProjectMapper(): ProjectMapper {
  return new TableStorageMapper(Project);
}
