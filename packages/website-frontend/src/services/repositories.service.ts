import { EnableRepositoryResponse } from "@stryker-mutator/dashboard-contract";
import { authService } from "./auth.service";
import { baseUrl } from "../contract/constants";

export class RepositoriesService {

  async enableRepository(slug: string, enabled: boolean): Promise<EnableRepositoryResponse | null> {
    const response = await fetch(`${baseUrl}/api/repositories/${slug}`, 
      { method: 'PATCH', body: JSON.stringify({ enabled: enabled }),       headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.currentBearerToken}`
      } });

    if (response.status === 204) {
      return null
    }
    
    return await response.json();
  }
}

export const repositoriesService = new RepositoriesService();
