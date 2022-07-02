import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

import { Login, Repository } from '@stryker-mutator/dashboard-contract';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public constructor(private readonly http: HttpClient) {}

  public organizations(): Observable<Login[]> {
    return this.http.get<Login[]>('api/user/organizations');
  }

  public getRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>('api/user/repositories');
  }
}
