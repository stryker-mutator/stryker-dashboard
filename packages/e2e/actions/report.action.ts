import { MutantStatus } from 'mutation-testing-report-schema';
import { generateAuthToken } from './auth.action';
import { EnableRepositoryResponse, Repository } from '@stryker-mutator/dashboard-contract';
import { Report } from '@stryker-mutator/dashboard-common';
import axios from 'axios';
import { browser } from 'protractor';

const httpClient = axios.create({ baseURL: browser.baseUrl });

const projectApiKeys = new Map<string, Promise<string>>();

async function enableRepository(projectName: string): Promise<string> {
  if (projectApiKeys.has(projectName)) {
    return projectApiKeys.get(projectName)!;
  } else {
    projectApiKeys.set(projectName, Promise.resolve().then(async () => {
      const patchBody: Partial<Repository> = { enabled: true };
      const authToken = generateAuthToken();
      const response = await httpClient.patch<EnableRepositoryResponse>(`/api/repositories/${projectName}`, patchBody, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return response.data.apiKey;
    }));
    return projectApiKeys.get(projectName)!;
  }
}

export async function uploadReport(result: Report) {
  const apiKey = await enableRepository(result.projectName);
  await httpClient.put(`/api/reports/${result.projectName}/${result.version}${result.moduleName ? `?module=${result.moduleName}` : ''}`, result, {
    headers: {
      ['X-Api-Key']: apiKey
    }
  });
}

export function scoreOnlyReport(projectName: string, version: string, mutationScore: number): Report {
  return {
    mutationScore,
    moduleName: undefined,
    projectName,
    version
  };
}

export function simpleReport(projectName: string, version: string, moduleName?: string, states = [MutantStatus.Survived, MutantStatus.Survived, MutantStatus.Killed]): Report {
  return {
    projectName,
    version,
    moduleName,
    schemaVersion: '1.1',
    thresholds: {
      high: 80,
      low: 60
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
                line: 1
              },
              end: {
                column: 13,
                line: 1
              }
            },
            replacement: '""',
            mutatorName: 'String Literal',
            status: states[0]
          },
          {
            id: '1',
            mutatorName: 'Arithmetic Operator',
            replacement: '-',
            location: {
              start: {
                line: 3,
                column: 12
              },
              end: {
                line: 3,
                column: 13
              }
            },
            status: states[1]
          },
          {
            id: '2',
            mutatorName: 'Block Statement',
            replacement: '{}',
            location: {
              start: {
                line: 2,
                column: 20
              },
              end: {
                line: 4,
                column: 1
              }
            },
            status: states[2]
          }
        ]
      }
    }
  };
}
