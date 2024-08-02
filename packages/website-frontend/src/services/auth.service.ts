import {
  AuthenticateResponse,
  Login,
} from '@stryker-mutator/dashboard-contract';

const AUTH_TOKEN_SESSION_KEY = 'authToken';

export class AuthService {
  #user: Login | null = null;

  public get currentBearerToken(): string | null {
    return window.sessionStorage.getItem(AUTH_TOKEN_SESSION_KEY);
  }

  public get currentUser(): Login | null {
    return this.#user;
  }

  public logOut() {
    window.sessionStorage.removeItem(AUTH_TOKEN_SESSION_KEY);
  }

  public async getUser(): Promise<Login | null> {
    if (!this.currentBearerToken) {
      return null;
    }

    if (this.#user !== null) {
      return this.#user;
    }

    const response = await fetch('http://localhost:1337/api/user', { 
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
    const response = await fetch(`http://localhost:1337/api/auth/${provider}?code=${code}`, { method: "POST" });
    const json = await response.json() as AuthenticateResponse;
    window.sessionStorage.setItem(AUTH_TOKEN_SESSION_KEY, json.jwt);

    const user = await this.getUser();
    if (user) {
      this.#user = user;
      return user;
    } else {
      throw new Error('User could not be retrieved after authentication');
    }
  }
}

// We will use typed-inject for this, but for now I need to use it with this.
export const TheAuthService = new AuthService();
