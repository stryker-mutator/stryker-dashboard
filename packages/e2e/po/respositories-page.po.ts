import { browser, $ } from 'protractor';
import { RepositoriesListPageObject } from './repositories-list.po';
import { RepositoryModalDialogPageObject } from './repository-modal-dialog.po';

export class RepositoriesPage {
  public async navigate() {
    return browser.get('/repositories');
  }

  public get repositoryList() {
    return new RepositoriesListPageObject($('stryker-repository-list'));
  }

  public get modalDialog() {
    return new RepositoryModalDialogPageObject($('ngb-modal-window'));
  }
}
