import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EnableRepositoryResponse } from '@stryker-mutator/dashboard-contract';

/**
 * Provides methods to easily make HTTP requests to `api/repositories`.
 */
@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  public constructor(private readonly http: HttpClient) {}

  /**
   * Enables or disables a repository.
   * @param slug The slug identifying the repository to enable/disable.
   * @param enabled True if the repository should be enabled, otherwise false.
   * @returns The generated api key for this repository if enabled, otherwise null.
   */
  public enableRepository(
    slug: string,
    enabled: boolean
  ): Observable<EnableRepositoryResponse> {
    return this.http.patch<EnableRepositoryResponse>(
      `api/repositories/${slug}`,
      { enabled }
    );
  }
}
