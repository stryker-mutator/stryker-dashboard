import { RepositoriesPage } from '../po/repositories/respositories-page.po';
import { logOn, logOff } from '../actions/logon.action';
import { expect } from 'chai';

// Example: 0527de29-6436-4564-9c5f-34f417ec68c0
const API_KEY_REGEX = /^[0-9a-z]{8}-(?:[0-9a-z]{4}-){3}[0-9a-z]{12}$/;

describe('Repositories page', () => {
  let page: RepositoriesPage;

  before(async () => {
    await logOn();
    page = new RepositoriesPage();
    await page.navigate();
  });

  after(async () => {
    await logOff();
  });

  it('should list all my repos', async () => {
    const repos = await page.repositoryList.all();
    const repoNames = await Promise.all(repos.map(repo => repo.name()));
    expect(repoNames).deep.eq([
      'github.com/strykermutator-test-account/hello-test',
      'github.com/strykermutator-test-account/hello-world'
    ]);
  });

  it('should all be disabled', async () => {
    const repos = await page.repositoryList.all();
    const areEnabled = await Promise.all(repos.map(repo => repo.isEnabled()));
    expect(areEnabled).deep.eq([false, false]);
  });

  it('should not show the modal dialog', async () => {
    expect(await page.modalDialog.isVisible()).false;
  });

  describe('when I enable a first repository', () => {
    before(async () => {
      const repos = await page.repositoryList.all();
      await repos[0].flipSwitch();
    });

    it('should show the modal dialog', async () => {
      expect(await page.modalDialog.isVisible()).true;
      expect(await page.modalDialog.title()).eq('hello-test');
    });

    it('should show the api key', async () => {
      const apiKey = await page.modalDialog.apiKey();
      expect(apiKey).matches(API_KEY_REGEX);
    });

    it('should show an explanation "About your key"', async () => {
      const card = await page.modalDialog.accordion.getCard('About your key');
      expect(await card.isBodyVisible()).true;
    });

    it('should hide "About your key" explanation when activated again', async () => {
      const card = await page.modalDialog.accordion.activateCard('About your key');
      expect(await card.isBodyVisible()).false;
    });

  });
});
