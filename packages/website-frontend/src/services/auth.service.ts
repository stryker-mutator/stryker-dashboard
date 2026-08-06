import type { AuthenticateResponse, Login } from '@stryker-mutator/dashboard-contract';

import type { SessionStorageService } from './session-storage.service.ts';
import { sessionStorageService } from './session-storage.service.ts';

const AUTH_TOKEN_SESSION_KEY = 'authToken';

export class AuthService {
  #sessionStorageService;
  #user: Login | null = null;
  #userPromise: Promise<Login | null> | null = null;

  constructor(sessionStorageService: SessionStorageService) {
    this.#sessionStorageService = sessionStorageService;
  }

  public get currentBearerToken(): string | null {
    return this.#sessionStorageService.getItem(AUTH_TOKEN_SESSION_KEY);
  }

  /**
   * Auth headers if logged in, otherwise empty object
   */
  public get authHeaders(): HeadersInit {
    const token = this.currentBearerToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  public get currentUser(): Login | null {
    return this.#user;
  }

  public signOut() {
    this.#sessionStorageService.removeItem(AUTH_TOKEN_SESSION_KEY);
    this.#user = null;
    this.#userPromise = null;
  }

  public async getUser(): Promise<Login | null> {
    if (!this.currentBearerToken) {
      return null;
    }

    if (this.#user !== null) {
      return this.#user;
    }

    if (this.#userPromise) {
      return this.#userPromise;
    }

    try {
      const userPromise = this.#fetchUser();
      this.#userPromise = userPromise;
      return await userPromise;
    } finally {
      this.#userPromise = null;
    }
  }

  async #fetchUser(): Promise<Login | null> {
    const response = await fetch(`/api/user`, {
      headers: this.authHeaders,
    });
    if (!response.ok) {
      return null;
    }

    this.#user = (await response.json()) as Login;
    return this.#user;
  }

  public async authenticate(provider: string, code: string) {
    const response = await fetch(`/api/auth/${provider}?code=${code}`, { method: 'POST' });
    const json = (await response.json()) as AuthenticateResponse;
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
