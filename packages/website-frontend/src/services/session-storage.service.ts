export class SessionStorageService {
  public setItem(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
  }

  public removeItem(key: string) {
    window.sessionStorage.removeItem(key);
  }

  public getItem(key: string): string | null {
    return window.sessionStorage.getItem(key);
  }
}

export const sessionStorageService = new SessionStorageService();
