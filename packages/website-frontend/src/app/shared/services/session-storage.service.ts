import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorage {
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
