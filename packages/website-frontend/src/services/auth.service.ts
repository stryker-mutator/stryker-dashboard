import {
  AuthenticateResponse,
  Login,
} from '@stryker-mutator/dashboard-contract';

import { sessionStorageService, SessionStorageService } from './session-storage.service';

const AUTH_TOKEN_SESSION_KEY = 'authToken';

export class AuthService {
  #sessionStorageService;
  #user: Login | null = null;

  constructor(sessionStorageService: SessionStorageService) {
    this.#sessionStorageService = sessionStorageService;
  }

  public get currentBearerToken(): string | null {
    return this.#sessionStorageService.getItem(AUTH_TOKEN_SESSION_KEY);
  }

  public get currentUser(): Login | null {
    return this.#user;
  }

  public signOut() {
    this.#sessionStorageService.removeItem(AUTH_TOKEN_SESSION_KEY);
  }

  public async getUser(): Promise<Login | null> {
    if (!this.currentBearerToken) {
      return null;
    }

    if (this.#user !== null) {
      return this.#user;
    }

    const response = await fetch(`/api/user`, { 
      headers: {
        Authorization: `Bearer ${this.currentBearerToken}`
      }
    });
    if (response.status != 200) {
      return null;
    }

    return response.json() as Promise<Login>;
  }

  public async authenticate(provider: string, code: string) {
    const response = await fetch(`/api/auth/${provider}?code=${code}`, { method: "POST" });
    const json = await response.json() as AuthenticateResponse;
    this.#sessionStorageService.setItem(AUTH_TOKEN_SESSION_KEY, json.jwt);
    const user = await this.getUser();
    if (user) {
      this.#user = user;
      return user;
    } else {
      throw new Error('User could not be retrieved after authentication');
    }
  }
}

export const authService = new AuthService(sessionStorageService);
