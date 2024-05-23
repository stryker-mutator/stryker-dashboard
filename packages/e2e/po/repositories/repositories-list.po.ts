import { PageObject } from '../shared/page-object.js';
import { RepositorySwitchPageObject } from './repository-switch.po.js';

export class RepositoriesListPageObject extends PageObject {
  private repositoriesLocator = this.host.locator('stryker-repository');
  public repositoryNamesLocator = this.repositoriesLocator.locator('.repo-slug');

  public repository(name: string): RepositorySwitchPageObject {
    const host = this.repositoriesLocator.locator(`:has(.repo-slug:has-text("${name}"))`);
    return new RepositorySwitchPageObject(host);
  }

  public all(expectedCount: number): Promise<RepositorySwitchPageObject[]> {
    return PageObject.selectAll(
      this.repositoriesLocator,
      RepositorySwitchPageObject,
      expectedCount,
    );
  }
}
