import type { MutantStatus, MutationTestResult } from 'mutation-testing-report-schema';

export function createMutationTestResult(
  mutantStates: MutantStatus[] = ['Killed', 'Killed', 'Survived'],
): MutationTestResult {
  return {
    files: {
      'a.js': {
        language: 'javascript',
        source: '+',
        mutants: mutantStates.map((status, index) => ({
          id: index.toString(),
          location: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 2 },
          },
          mutatorName: 'BinaryMutator',
          replacement: '-',
          status,
        })),
      },
    },
    schemaVersion: '1',
    thresholds: {
      high: 80,
      low: 70,
    },
  };
}

export function createMutationTestingResult(): MutationTestResult {
  return {
    files: {},
    schemaVersion: '1',
    thresholds: { high: 80, low: 60 },
  };
}
