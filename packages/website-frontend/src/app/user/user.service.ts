import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Login } from 'stryker-dashboard-website-contract';

@Injectable()
export class UserService {

  public constructor(private http: HttpClient) { }

  public login(): Observable<Login> {
    return this.http.get<Login>('api/user');
  }

}
