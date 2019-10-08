import { ElementFinder } from 'protractor';
import { RepositorySwitchPageObject } from './repository-switch.po';

export class RepositoriesListPageObject {
  constructor(private readonly host: ElementFinder) { }

  public async all(): Promise<RepositorySwitchPageObject[]> {
    const repos: ElementFinder[] = await this.host.$$('stryker-repository');
    return Promise.all(repos.map(repo => new RepositorySwitchPageObject(repo)));
  }
}
