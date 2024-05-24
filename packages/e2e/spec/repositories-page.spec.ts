import { test, expect, Page, Locator } from '@playwright/test';
import { RepositoriesPage } from '../po/repositories/repositories-page.po.js';

// Example: 0527de29-6436-4564-9c5f-34f417ec68c0
const API_KEY_REGEX = /^[0-9a-z]{8}-(?:[0-9a-z]{4}-){3}[0-9a-z]{12}$/;

test.describe.serial('Repositories page', () => {
  let repositoriesPage: RepositoriesPage;
  let page: Page;
  let toggleModal: Locator;

  const copyText: () => Promise<string> = async () =>
    await page.evaluate('navigator.clipboard.readText()');

  const closeToggleDialog = async () => {
    await toggleModal.getByText('Close').click();
  };

  const openToggleDialog = async () => {
    await page.locator('sme-spatious-layout').locator('#toggle-repositories').click();
  };

  const openBadgeDialog = async () => {
    await page.locator('sme-button').getByText('Badge', { exact: true }).click();
  };

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    repositoriesPage = new RepositoriesPage(await context.newPage());
    page = repositoriesPage.page;
    await repositoriesPage.logOn();
    await repositoriesPage.navigate();
    await page.waitForSelector('sme-notify');
    toggleModal = page.locator('sme-modal').first();
  });

  test.afterAll(async () => {
    await repositoriesPage.logOff();
    await repositoriesPage.close();
  });

  test('should show an information box when no repositories are enabled', async () => {
    expect(page.locator('sme-spatious-layout')).toContainText(
      'It appears you do not have any enabled repositories, enable them by clicking on the enable repositories button.',
    );
  });

  test.describe('when opening the toggle dialog', () => {
    test.beforeAll(async () => {
      await openToggleDialog();
    });

    test('should open modal and show all available repositories', async () => {
      expect(toggleModal).toContainText('Toggle repositories');
      expect(await toggleModal.locator('sme-toggle-repository').count()).toBe(2);
    });

    test('should enable repository', async () => {
      const toggleRepository = toggleModal.locator('sme-toggle-repository').first();
      await toggleRepository.locator('sme-toggle-button').click();
      await toggleRepository.getByText('📋').click();
      const text = await copyText();

      await closeToggleDialog();
      const repository = page.locator('sme-repository');

      expect(text).toMatch(API_KEY_REGEX);
      expect(repository).toContainText('hello-test');
    });

    test('should disable repository', async () => {
      await openToggleDialog();

      const toggleRepository = toggleModal.locator('sme-toggle-repository').first();
      await toggleRepository.locator('sme-toggle-button').click();
      await closeToggleDialog();
      await page.waitForSelector('sme-notify');

      const repository = page.locator('sme-repository');
      expect(repository).not.toBeVisible();
    });
  });

  test.describe('when opening the badge dialog', async () => {
    let modal: Locator;

    test.beforeAll(async () => {
      await openToggleDialog();
      const toggleRepository = toggleModal.locator('sme-toggle-repository').first();
      await toggleRepository.locator('sme-toggle-button').click();
      await toggleRepository.getByText('📋').click();
      await closeToggleDialog();

      await openBadgeDialog();
      modal = page.locator('sme-modal').filter({ hasText: 'Configure mutation badge' });
    });

    test('should open modal and copy mutation badge', async () => {
      await modal.getByText('Copy badge').click();

      const copiedText = await copyText();
      expect(copiedText).toContain('style=flat');
      expect(modal).toContainText('Choose from the following styles');
    });

    test('should copy mutation badge with differing style', async () => {
      await modal.locator('sme-badge-configurator').getByLabel('plastic').click();

      await modal.getByText('Copy badge').click();

      const copiedText = await copyText();
      expect(copiedText).toContain('style=plastic');
    });
  });
});
