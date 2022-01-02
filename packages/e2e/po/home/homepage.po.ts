import { DashboardPage } from '../shared/dashboard-page.po';

export class Homepage extends DashboardPage {

  async slogan() {
    const header = await this.page.$('h1');
    return header!.innerText();
  }

  public async navigate() {
    return this.page.goto('/');
  }

  public async title() {
    return this.page.title();
  }
}
