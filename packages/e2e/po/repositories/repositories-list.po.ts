import { PageObject } from '../shared/page-object';
import { RepositorySwitchPageObject } from './repository-switch.po';

export class RepositoriesListPageObject extends PageObject{

  public async allRepositoryNames(): Promise<string[]> {
    const repos = await this.all();
    return Promise.all(repos.map(repo => repo.name()));
  }

  public async all(): Promise<RepositorySwitchPageObject[]> {
    const elements = await this.host.$$('stryker-repository');
    return elements.map(el => new RepositorySwitchPageObject(el));
  }
}
