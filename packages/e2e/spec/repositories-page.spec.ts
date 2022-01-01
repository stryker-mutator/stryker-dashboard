import { test } from "@playwright/test";
import { RepositoriesPage } from "../po/repositories/repositories-page.po";
import {
  enableRepository,
  getUserRepositories,
} from "../actions/report.action";
import { expect } from "chai";
import { RepositorySwitchPageObject } from "../po/repositories/repository-switch.po";
import { Repository } from "@stryker-mutator/dashboard-contract/src";
import { RepositoryModalDialogPageObject } from "../po/repositories/repository-modal-dialog.po";
import { ApiKeyGeneratorPageObject } from "../po/repositories/api-key-generator.po";
import { OwnerSelectorPageObject } from "../po/repositories/owner-selector.po";

// Example: 0527de29-6436-4564-9c5f-34f417ec68c0
const API_KEY_REGEX = /^[0-9a-z]{8}-(?:[0-9a-z]{4}-){3}[0-9a-z]{12}$/;

test.describe.serial("Repositories page", () => {
  let page: RepositoriesPage;

  test.beforeAll(async ({ browser }) => {
    page = new RepositoriesPage(await browser.newPage());
    await page.logOn();
    await page.navigate();
  });

  test.afterAll(async () => {
    await page.logOff();
    await page.close();
  });

  test("should list all my repos", async () => {
    const repositoryList = await page.repositoryList();
    const repoNames = await repositoryList.allRepositoryNames();
    expect(repoNames).deep.eq([
      "github.com/strykermutator-test-account/hello-test",
      "github.com/strykermutator-test-account/hello-world",
    ]);
  });

  test("should all be disabled", async () => {
    const repositoryList = await page.repositoryList();
    const repos = await repositoryList.all();
    const areChecked = await Promise.all(repos.map((repo) => repo.isChecked()));
    expect(areChecked).deep.eq([false, false]);
  });

  test("should not show the modal dialog", async () => {
    expect(await page.modalDialog()).eq(null);
  });

  test.describe("owner selector", () => {
    let ownerSelector: OwnerSelectorPageObject;

    test.beforeAll(async () => {
      ownerSelector = await page.ownerSelector();
    });

    test("should show the username and organization", async () => {
      expect(await ownerSelector.optionValues()).deep.eq([
        "strykermutator-test-account",
        "stryker-mutator-test-organization",
      ]);
    });

    test.describe("when selecting an organization", () => {
      test.beforeAll(async () => {
        await ownerSelector.select("stryker-mutator-test-organization");
        await page.waitForAngular();
      });

      test.afterAll(async () => {
        await ownerSelector.select("strykermutator-test-account");
        await page.waitForAngular();
      });

      test("should show the repo's belonging to that organization", async () => {
        const repositoryList = await page.repositoryList();
        const repoNames = await repositoryList.allRepositoryNames();
        expect(repoNames).deep.eq([
          "github.com/stryker-mutator-test-organization/hello-org",
        ]);
      });
    });
  });

  test.describe("when enabling a repository", () => {
    let modalDialog: RepositoryModalDialogPageObject;

    test.beforeAll(async () => {
      const repositoryList = await page.repositoryList();
      const repos = await repositoryList.all();
      await repos[0].flipSwitch();
      await page.waitForAngular();
      modalDialog = (await page.modalDialog())!;
    });

    test.afterAll(async () => {
      if (await modalDialog.isVisible()) {
        await modalDialog.close();
      }
    });

    test("should show the modal dialog", async () => {
      expect(await modalDialog.isVisible()).true;
      expect(await modalDialog.title()).eq("hello-test");
    });

    test("should show the api key", async () => {
      const apiKeyGenerator = await modalDialog.apiKeyGenerator();
      const apiKey = await apiKeyGenerator.apiKey();
      expect(apiKey).matches(API_KEY_REGEX);
    });

    test('should show an explanation "About your key"', async () => {
      const accordion = await modalDialog.accordion();
      const card = await accordion.getCard("About your key");
      expect(await card.isBodyVisible()).true;
    });

    test('should hide "About your key" explanation when activated again', async () => {
      const accordion = await modalDialog.accordion();
      const card = await accordion.activateCard("About your key");
      expect(await card.isBodyVisible()).false;
    });
  });

  test.describe("when a repository is enabled", () => {
    let repositoryPageObject: RepositorySwitchPageObject;
    let repository: Repository;
    test.beforeAll(async ({ request }) => {
      const allRepositories = await getUserRepositories(request);
      repository = allRepositories[1];
      await enableRepository(repository.slug, request);
      await page.navigate();
      const repositoryList = await page.repositoryList();
      repositoryPageObject = (await repositoryList.all())[1];
    });

    test("should show the mutation score badge for that repo", async () => {
      const badge = await repositoryPageObject.mutationScoreBadge();
      await badge.waitForLink();
      expect(await badge.imgSrc()).contains(
        encodeURIComponent(repository.slug)
      );
      expect(await badge.linkHref()).contains(`reports/${repository.slug}`);
    });

    test.describe("and displayed", () => {
      let generator: ApiKeyGeneratorPageObject;

      test.beforeAll(async () => {
        await repositoryPageObject.display();
        const modalDialog = await page.modalDialog();
        generator = await modalDialog!.apiKeyGenerator();
      });
      test("should hide the API key", async () => {
        expect(await generator.apiKey()).contains("•••••••••••••••••••");
      });

      test('should generate a new api key if "Generate new" is clicked', async () => {
        await generator.generateNew();
        await page.waitForAngular();
        expect(await generator.apiKey()).match(API_KEY_REGEX);
      });
    });
  });
});
