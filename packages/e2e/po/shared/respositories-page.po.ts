import { browser, $ } from 'protractor';
import { RepositoriesListPageObject } from '../repositories/repositories-list.po';
import { RepositoryModalDialogPageObject } from '../repositories/repository-modal-dialog.po';

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
