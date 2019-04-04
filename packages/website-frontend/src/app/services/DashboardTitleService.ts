import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class DashboardTitleService {
  constructor(private titleService: Title) { }

  setTitlePrefix(prefix: string) {
    this.titleService.setTitle(`${prefix} - Stryker Dashboard`);
  }
}
