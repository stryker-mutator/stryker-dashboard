import { test, expect } from '@playwright/test';
import { RepositoriesPage } from '../po/repositories/repositories-page.po.js';
import type { RepositorySwitchPageObject } from '../po/repositories/repository-switch.po.js';
import type { Repository } from '@stryker-mutator/dashboard-contract';
import { ReportClient } from '../po/reports/report-client.po.js';
import { createContainsRegExp } from '../po/helpers.js';

// Example: 0527de29-6436-4564-9c5f-34f417ec68c0
const API_KEY_REGEX = /^[0-9a-z]{8}-(?:[0-9a-z]{4}-){3}[0-9a-z]{12}$/;

test.describe.serial('Repositories page', () => {
  let page: RepositoriesPage;
  let client: ReportClient;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    client = new ReportClient(context.request);
    page = new RepositoriesPage(await context.newPage());
    await page.logOn();
    await page.navigate();
  });

  test.afterAll(async () => {
    await page.logOff();
    await page.close();
  });

  test('should list all my repos', async () => {
    await expect(page.repositoryList.repositoryNamesLocator).toHaveText([
      'github.com/strykermutator-test-account/hello-test',
      'github.com/strykermutator-test-account/hello-world',
    ]);
  });

  test('should all be unchecked', async () => {
    const repos = await page.repositoryList.all(2);
    for (const repo of repos) {
      await expect(repo.checkbox).not.toBeChecked();
    }
  });

  test('should not show the modal dialog', async () => {
    await expect(page.modalDialog.host).not.toExist();
  });

  test.describe('owner selector', () => {
    test('should show the username and organization', async () => {
      await expect(page.ownerSelector.options()).toHaveCount(2);
      await expect(page.ownerSelector.options().nth(0)).toHaveAttribute(
        'value',
        'strykermutator-test-account'
      );
      await expect(page.ownerSelector.options().nth(1)).toHaveAttribute(
        'value',
        'stryker-mutator-test-organization'
      );
    });

    test.describe('when selecting an organization', () => {
      test.beforeAll(async () => {
        await page.ownerSelector.select('stryker-mutator-test-organization');
      });

      test.afterAll(async () => {
        await page.ownerSelector.select('strykermutator-test-account');
      });

      test("should show the repo's belonging to that organization", async () => {
        await expect(page.repositoryList.repositoryNamesLocator).toContainText(
          'github.com/stryker-mutator-test-organization/hello-org'
        );
      });
    });
  });

  test.describe('when enabling a repository', () => {
    test.beforeAll(async () => {
      const repos = await page.repositoryList.all(2);
      await repos[0].flipSwitch();
    });

    test.afterAll(async () => {
      if (await page.modalDialog.isVisible()) {
        await page.modalDialog.close();
      }
    });

    test('should show the modal dialog', async () => {
      await expect(page.modalDialog.host).toBeVisible();
      await expect(page.modalDialog.title).toHaveText('hello-test');
    });

    test('should show the api key', async () => {
      await expect(page.modalDialog.apiKeyGenerator.apiKey).toHaveText(
        API_KEY_REGEX
      );
    });

    test('should show an explanation "About your key"', async () => {
      const card = page.modalDialog.accordion.getCard('About your key');
      await expect(card.body).toBeVisible();
    });

    test('should hide "About your key" explanation when activated again', async () => {
      const card = page.modalDialog.accordion.getCard('About your key');
      await card.activate();
      await expect(card.body).not.toBeVisible();
    });
  });

  test.describe('when a repository is enabled', () => {
    let repositoryPageObject: RepositorySwitchPageObject;
    let repository: Repository;
    test.beforeAll(async () => {
      const allRepositories = await client.getUserRepositories();
      repository = allRepositories[1];
      await client.enableRepository(repository.slug);
      await page.navigate();
      repositoryPageObject = page.repositoryList.repository(repository.name);
    });

    test('should show the mutation score badge for that repo', async () => {
      await expect(repositoryPageObject.mutationScoreBadge.img).toHaveAttribute(
        'src',
        createContainsRegExp(encodeURIComponent(repository.slug))
      );
      await expect(
        repositoryPageObject.mutationScoreBadge.link
      ).toHaveAttribute(
        'href',
        createContainsRegExp(`reports/${repository.slug}`)
      );
    });

    test.describe('and displayed', () => {
      test.beforeAll(async () => {
        await repositoryPageObject.display();
      });
      test('should hide the API key', async () => {
        await expect(page.modalDialog.apiKeyGenerator.apiKey).toContainText(
          '•••••••••••••••••••'
        );
      });

      test('should generate a new api key if "Generate new" is clicked', async () => {
        await page.modalDialog.apiKeyGenerator.generateNew();
        await expect(page.modalDialog.apiKeyGenerator.apiKey).toHaveText(
          API_KEY_REGEX
        );
      });
    });
  });
});
