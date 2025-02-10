import type { Login, Repository } from '@stryker-mutator/dashboard-contract';

import { authService } from './auth.service';

export class UserService {
  public async organizations(): Promise<Login[]> {
    const response = await fetch(`/api/user/organizations`, {
      headers: { Authorization: `Bearer ${authService.currentBearerToken}` },
    });
    if (!response.ok) {
      return Promise.reject(new Error(`Failed to fetch user organizations: ${response.statusText}`));
    }
    return response.json() as Promise<Login[]>;
  }

  public async getRepositories(): Promise<Repository[]> {
    const response = await fetch(`/api/user/repositories`, {
      headers: { Authorization: `Bearer ${authService.currentBearerToken}` },
    });
    if (!response.ok) {
      return Promise.reject(new Error(`Failed to fetch user repositories: ${response.statusText}`));
    }
    return response.json() as Promise<Repository[]>;
  }
}

export const userService = new UserService();
