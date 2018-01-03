import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Repository } from 'stryker-dashboard-website-contract';

@Injectable()
export class RepositoryService {

  public constructor(private http: HttpClient) {}

  public getRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>('api/user/repositories');
  }
}
