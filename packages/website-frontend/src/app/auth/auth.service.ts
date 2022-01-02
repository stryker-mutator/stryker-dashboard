import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticateResponse, Login } from '@stryker-mutator/dashboard-contract';
import { Subject, Observable, merge, lastValueFrom } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { SessionStorage } from '../shared/services/session-storage.service';

const AUTH_TOKEN_SESSION_KEY = 'authToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private session: SessionStorage) {
  }

  public get currentBearerToken(): string | null {
    return this.session.getItem(AUTH_TOKEN_SESSION_KEY);
  }

  public get currentUser$(): Observable<Login | null> {
    if (!this._currentUser) {
      this._currentUser = merge(
        this.getUser(),
        this.currentUserSubject$
      ).pipe(
        shareReplay(1),
      );
    }
    return this._currentUser;
  }
  private currentUserSubject$ = new Subject<Login | null>();

  private _currentUser: Observable<Login | null> | undefined;

  public logOut() {
    this.session.removeItem(AUTH_TOKEN_SESSION_KEY);
    this.currentUserSubject$.next(null);
  }

  private async getUser(): Promise<Login | null> {
    try {
      if (this.currentBearerToken) {
        return await lastValueFrom(this.http.get<Login>('api/user'));
      } else {
        return null;
      }
    } catch (httpErr) {
      if ((httpErr as HttpErrorResponse).status === 401) {
        this.session.removeItem(AUTH_TOKEN_SESSION_KEY);
        return null;
      } else {
        throw httpErr;
      }
    }
  }

  public async authenticate(provider: string, code: string): Promise<Login> {
    const response = await lastValueFrom(this.http.post<AuthenticateResponse>(`/api/auth/${provider}?code=${code}`, undefined));
    this.session.setItem(AUTH_TOKEN_SESSION_KEY, response.jwt);
    const user = await this.getUser();
    this.currentUserSubject$.next(user);
    if (user) {
      return user;
    } else {
      throw new Error('User could not be retrieved after authentication');
    }
  }

}
