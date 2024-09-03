import { test, expect, Page } from '@playwright/test';
import { RepositoriesPage } from '../po/repositories/repositories-page.po.js';

// Example: 0527de29-6436-4564-9c5f-34f417ec68c0
const API_KEY_REGEX = /^[0-9a-z]{8}-(?:[0-9a-z]{4}-){3}[0-9a-z]{12}$/;

test.describe.serial('Repositories page', () => {
  let repositoriesPage: RepositoriesPage;
  let page: Page;

  const copyText: () => Promise<string> = async () => await page.evaluate('navigator.clipboard.readText()');

  const enableRepository = async () => {
    await page.waitForSelector('sme-list#disabled-repositories');
    const toggleRepository = repositoriesPage.disabledRepositories.first();
    await toggleRepository.locator('sme-button > button').click();
  };

  const disableRepository = async () => {
    await page.waitForSelector('sme-list#enabled-repositories');
    const toggleRepository = repositoriesPage.enabledRepositories.first();
    await toggleRepository.locator('sme-button > button').click();
  };

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    repositoriesPage = new RepositoriesPage(await context.newPage());
    page = repositoriesPage.page;
    await repositoriesPage.logOn();
    await repositoriesPage.navigate();
    await page.waitForSelector('sme-notify');
  });

  test.afterAll(async () => {
    await repositoriesPage.logOff();
    await repositoriesPage.close();
  });

  test('should show an information box when no repositories are enabled', async () => {
    await expect(page.locator('sme-spatious-layout')).toContainText(
      'There are no enabled repositories. You can enable them below.',
    );
  });

  test.describe('when clicking on repositories', () => {
    test('should have the correct count of repositories', async () => {
      await page.waitForSelector('sme-list#disabled-repositories');
      expect(await repositoriesPage.disabledRepositories.count()).toBe(2);
      expect(await page.locator('sme-notify').count()).toBe(1);
    });

    test('should enable and disable repository', async () => {
      await enableRepository();

      await page.waitForTimeout(500);
      await page.locator('sme-copy-text#copy-key button').click();
      const text = await copyText();

      expect(text).toMatch(API_KEY_REGEX);
      await page.locator('sme-modal div.mt-auto sme-button > button').click();

      let enabledRepositories = repositoriesPage.enabledRepositories;
      expect(await enabledRepositories.first().isHidden()).toBe(false); // first one was enabled
      expect(await enabledRepositories.last().isHidden()).toBe(true);

      let disabledRepositories = repositoriesPage.disabledRepositories;
      expect(await disabledRepositories.first().isHidden()).toBe(true);
      expect(await disabledRepositories.last().isHidden()).toBe(false);

      await disableRepository();
      await page.waitForTimeout(500);

      enabledRepositories = repositoriesPage.enabledRepositories;
      expect(await enabledRepositories.first().isHidden()).toBe(true); // first one was enabled
      expect(await enabledRepositories.last().isHidden()).toBe(true);

      disabledRepositories = repositoriesPage.disabledRepositories;
      expect(await disabledRepositories.first().isHidden()).toBe(false);
      expect(await disabledRepositories.last().isHidden()).toBe(false);
    });
  });

  test.describe('when clicking on the repository', () => {
    test.beforeAll(async () => {
      await enableRepository();
      await page.locator('sme-modal div.mt-auto sme-button > button').click();
      await repositoriesPage.enabledRepositories.first().click();
      await page.locator('sme-modal sme-collapsible#badge-collapsible').click();
    });

    test.afterAll(async () => {
      await page.locator('sme-modal div.mt-auto sme-button > button').click();
      await disableRepository();
    });

    test('should open modal and copy mutation badge', async () => {
      await page.locator('sme-modal sme-badge-configurator sme-button > button').click();

      const copiedText = await copyText();
      expect(copiedText).toContain('style=flat');
    });

    test('should copy mutation badge with differing style', async () => {
      await page.locator('sme-modal sme-badge-configurator').getByLabel('plastic').click();
      await page.locator('sme-modal').getByText('Copy markdown').click();

      const copiedText = await copyText();
      expect(copiedText).toContain('style=plastic');
    });
  });
});
