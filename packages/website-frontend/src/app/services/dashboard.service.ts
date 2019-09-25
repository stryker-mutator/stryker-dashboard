import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private titleService: Title) { }

  setTitlePrefix(prefix: string) {
    this.titleService.setTitle(`${prefix} - Stryker Dashboard`);
  }
}
