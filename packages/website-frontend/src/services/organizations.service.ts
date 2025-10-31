import type { Repository } from '@stryker-mutator/dashboard-contract';

import { authService } from './auth.service.ts';

export class OrganizationsService {
  public async getRepositories(organizationName: string): Promise<Repository[]> {
    const response = await fetch(`/api/organizations/${organizationName}/repositories`, {
      headers: {
        Authorization: `Bearer ${authService.currentBearerToken}`,
      },
    });
    if (!response.ok) {
      return Promise.reject(
        new Error(`Failed to fetch repositories for organization ${organizationName}: ${response.statusText}`),
      );
    }
    return response.json() as Promise<Repository[]>;
  }
}

export const organizationsService = new OrganizationsService();
