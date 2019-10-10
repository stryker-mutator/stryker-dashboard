import { ElementFinder } from 'protractor';
import { RepositorySwitchPageObject } from './repository-switch.po';

export class RepositoriesListPageObject {
  constructor(private readonly host: ElementFinder) { }

  public async allRepositoryNames(): Promise<string[]> {
    const repos = await this.all();
    return Promise.all(repos.map(repo => repo.name()));
  }

  public async all(): Promise<RepositorySwitchPageObject[]> {
    const elements = await this.host.$$('stryker-repository') as ElementFinder[];
    return elements.map(el => new RepositorySwitchPageObject(el));
  }
}
