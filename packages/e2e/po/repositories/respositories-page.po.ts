import { browser, $ } from 'protractor';
import { RepositoriesListPageObject } from './repositories-list.po';
import { RepositoryModalDialogPageObject } from './repository-modal-dialog.po';
import { OwnerSelectorPageObject } from './owner-selector.po';

export class RepositoriesPage {
  public async navigate() {
    return browser.get('/repos');
  }

  public get repositoryList() {
    return new RepositoriesListPageObject($('stryker-repository-list'));
  }

  public get modalDialog() {
    return new RepositoryModalDialogPageObject($('ngb-modal-window'));
  }

  public get ownerSelector() {
    return new OwnerSelectorPageObject($('stryker-owner-selector'));
  }
}
