import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorage {
  setItem(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
  }
  removeItem(key: string) {
    window.sessionStorage.removeItem(key);
  }
  getItem(key: string): string | null {
    return window.sessionStorage.getItem(key);
  }
}
