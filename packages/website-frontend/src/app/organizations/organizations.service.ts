import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Repository } from 'stryker-dashboard-website-contract';

@Injectable()
export class OrganizationsService {

  constructor(private http: HttpClient) { }

  public getRepositories(organizationName: string) {
    return this.http.get<Repository[]>(`/api/organizations/${organizationName}/repositories`);
  }
}
