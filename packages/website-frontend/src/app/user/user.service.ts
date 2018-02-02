import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Login, Repository } from 'stryker-dashboard-website-contract';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserService {

  public constructor(private http: HttpClient) { }

  public currentUser: Observable<Login | null> = this.http
    .get<Login>('api/user')
    .catch((httpErr: HttpErrorResponse) => {
      if (httpErr.status === 401) {
        return Observable.of(null);
      } else {
        return Observable.throw(httpErr);
      }
    }).share();

  public logout() {
    return this.http.get('auth/github/logout');
  }

  public organizations(): Observable<Login[]> {
    return this.http
      .get<Login[]>('api/user/organizations');
  }

  public getRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>('api/user/repositories');
  }
}
