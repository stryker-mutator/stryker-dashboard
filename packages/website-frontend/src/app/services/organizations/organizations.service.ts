import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from '@stryker-mutator/dashboard-contract';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  constructor(private readonly http: HttpClient) {}

  public getRepositories(organizationName: string) {
    return this.http.get<Repository[]>(
      `/api/organizations/${organizationName}/repositories`
    );
  }
}
