import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Repository, EnableRepositoryResponse } from 'stryker-dashboard-website-contract';

/**
 * Provides methods to easily make HTTP requests to `api/repositories`.
 */
@Injectable()
export class RepositoryService {

  public constructor(private http: HttpClient) {}

  /**
   * Retrieve all repositories of a user.
   * @returns An array of all repositories belonging to the logged-in user.
   */
  // TODO: This method could be moved to the UserService,
  // because it retrieves the Repositories of a User.
  public getRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>('api/user/repositories');
  }

  /**
   * Enables or disables a repository.
   * @param slug The slug identifying the repository to enable/disable.
   * @param enabled True if the repository should be enabled, otherwise false.
   * @returns The generated api key for this repository if enabled, otherwise null.
   */
  public enableRepository(slug: string, enabled: boolean): Observable<EnableRepositoryResponse> {
    return this.http.patch<EnableRepositoryResponse>(`api/repositories/${slug}`, { enabled: enabled });
  }
}
