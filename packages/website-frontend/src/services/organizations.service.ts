import { Repository } from "@stryker-mutator/dashboard-contract";
import { authService } from "./auth.service";
import { baseUrl } from "../contract/constants";

export class OrganizationsService {
  public async getRepositories(organizationName: string): Promise<Repository[]> {
    const response = await fetch(
      `${baseUrl}/api/organizations/${organizationName}/repositories`,
      {       headers: {
        Authorization: `Bearer ${authService.currentBearerToken}`
      }}
    );
    return await response.json();
  }
}

export const organizationsService = new OrganizationsService();
