import type { APIRequestContext } from '@playwright/test';
import type { Report } from '@stryker-mutator/dashboard-common';
import type { EnableRepositoryResponse, PutReportResponse, Repository } from '@stryker-mutator/dashboard-contract';
import { generateAuthToken } from '../../actions/auth.action.js';
import type { MutantResult } from 'mutation-testing-report-schema';

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
          const response = await this.request.patch(`/api/repositories/${slug}`, {
            failOnStatusCode: true,
            data: patchBody,
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const body = (await response.json()) as EnableRepositoryResponse;
          return body.apiKey;
        }),
      );
      return this.projectApiKeys.get(slug)!;
    }
  }

  async disableRepository(slug: string): Promise<void> {
    const patchBody: Partial<Repository> = { enabled: true };
    const authToken = generateAuthToken();
    await this.request.patch(`/api/repositories/${slug}`, {
      failOnStatusCode: true,
      data: patchBody,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  async getUserRepositories(): Promise<Repository[]> {
    const auth = generateAuthToken();
    const response = await this.request.get('api/user/repositories', {
      failOnStatusCode: true,
      headers: { Authorization: `Bearer ${auth}` },
    });
    return response.json() as Promise<Repository[]>;
  }

  async uploadReport(result: Report): Promise<PutReportResponse> {
    const apiKey = await this.enableRepository(result.projectName);
    const response = await this.request.put(this.#getUrl('/api/reports', result), {
      failOnStatusCode: true,
      data: result,
      headers: {
        ['X-Api-Key']: apiKey,
      },
    });
    return response.json() as Promise<PutReportResponse>;
  }

  async uploadPendingReport(result: Report): Promise<PutReportResponse> {
    const apiKey = await this.enableRepository(result.projectName);
    const response = await this.request.put(this.#getUrl('/api/real-time', result), {
      failOnStatusCode: true,
      data: result,
      headers: {
        ['X-Api-Key']: apiKey,
      },
    });
    return response.json() as Promise<PutReportResponse>;
  }

  async postMutantBatch(result: Report, mutants: Partial<MutantResult>[]) {
    const apiKey = await this.enableRepository(result.projectName);
    return await this.request.post(this.#getUrl('/api/real-time', result), {
      data: mutants,
      headers: {
        ['X-Api-Key']: apiKey,
      },
    });
  }

  async deletePendingReport(result: Report) {
    const apiKey = await this.enableRepository(result.projectName);
    return await this.request.delete(this.#getUrl('/api/real-time', result), {
      failOnStatusCode: true,
      headers: {
        ['X-Api-Key']: apiKey,
      },
    });
  }

  #getUrl(base: string, result: Report) {
    return `${base}/${result.projectName}/${result.version}${result.moduleName ? `?module=${result.moduleName}` : ''}`;
  }
}
