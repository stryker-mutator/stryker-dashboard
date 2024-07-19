import { Login, Repository } from "@stryker-mutator/dashboard-contract";
import { authService } from "./auth.service";
import { baseUrl } from "../contract/constants";

export class UserService {
  public async organizations(): Promise<Login[]> {
    const response = await fetch(`${baseUrl}/api/user/organizations`, { headers: { Authorization: `Bearer ${authService.currentBearerToken}` } });
    return response.json();
  }

  public async getRepositories(): Promise<Repository[]> {
    const response = await fetch(`${baseUrl}/api/user/repositories`, { headers: { Authorization: `Bearer ${authService.currentBearerToken}` } });
    return response.json();
  }
}

export const userService = new UserService();
