import { MutantStatus } from 'mutation-testing-report-schema';
import type { Report } from '@stryker-mutator/dashboard-common';

export function scoreOnlyReport(
  projectName: string,
  version: string,
  mutationScore: number
): Report {
  return {
    mutationScore,
    moduleName: undefined,
    projectName,
    version,
  };
}

export function simpleReport(
  projectName: string,
  version: string,
  moduleName?: string,
  states = [MutantStatus.Survived, MutantStatus.Survived, MutantStatus.Killed]
): Report {
  return {
    projectName,
    version,
    moduleName,
    schemaVersion: '1.1',
    thresholds: {
      high: 80,
      low: 60,
    },
    mutationScore: 33.33,
    files: {
      'test.js': {
        language: 'javascript',
        source: '"use strict";\nfunction add(a, b) {\n  return a + b;\n}',
        mutants: [
          {
            id: '3',
            location: {
              start: {
                column: 1,
                line: 1,
              },
              end: {
                column: 13,
                line: 1,
              },
            },
            replacement: '""',
            mutatorName: 'String Literal',
            status: states[0],
          },
          {
            id: '1',
            mutatorName: 'Arithmetic Operator',
            replacement: '-',
            location: {
              start: {
                line: 3,
                column: 12,
              },
              end: {
                line: 3,
                column: 13,
              },
            },
            status: states[1],
          },
          {
            id: '2',
            mutatorName: 'Block Statement',
            replacement: '{}',
            location: {
              start: {
                line: 2,
                column: 20,
              },
              end: {
                line: 4,
                column: 1,
              },
            },
            status: states[2],
          },
        ],
      },
    },
  };
}
