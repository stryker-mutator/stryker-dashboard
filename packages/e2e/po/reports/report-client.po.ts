import type { APIRequestContext } from '@playwright/test';
import type { Report } from '@stryker-mutator/dashboard-common';
import type {
  EnableRepositoryResponse,
  PutReportResponse,
  Repository,
} from '@stryker-mutator/dashboard-contract';
import { generateAuthToken } from '../../actions/auth.action.js';

export class ReportClient {
  private projectApiKeys = new Map<string, Promise<string>>();

  constructor(private request: APIRequestContext) {}

  async enableRepository(slug: string): Promise<string> {
    if (this.projectApiKeys.has(slug)) {
      return this.projectApiKeys.get(slug)!;
    } else {
      this.projectApiKeys.set(
        slug,
        Promise.resolve().then(async () => {
          const patchBody: Partial<Repository> = { enabled: true };
          const authToken = generateAuthToken();
          const response = await this.request.patch(
            `/api/repositories/${slug}`,
            {
              data: patchBody,
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          const body: EnableRepositoryResponse = await response.json();
          return body.apiKey;
        })
      );
      return this.projectApiKeys.get(slug)!;
    }
  }

  async getUserRepositories(): Promise<Repository[]> {
    const auth = generateAuthToken();
    const response = await this.request.get('api/user/repositories', {
      headers: { Authorization: `Bearer ${auth}` },
    });
    const body = await response.json();
    return body;
  }

  async uploadReport(result: Report): Promise<PutReportResponse> {
    const apiKey = await this.enableRepository(result.projectName);
    const response = await this.request.put(
      `/api/reports/${result.projectName}/${result.version}${
        result.moduleName ? `?module=${result.moduleName}` : ''
      }`,
      {
        data: result,
        headers: {
          ['X-Api-Key']: apiKey,
        },
      }
    );
    const body = await response.json();
    return body;
  }
}
