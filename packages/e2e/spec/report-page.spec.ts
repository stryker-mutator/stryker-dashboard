import { test } from "@playwright/test";
import { ReportPage } from "../po/reports/report-page.po";
import { expect } from "chai";
import {
  uploadReport,
  simpleReport,
  scoreOnlyReport,
} from "../actions/report.action";
import { MutantStatus } from "mutation-testing-report-schema";

test.describe("Report page", () => {
  let page: ReportPage;

  test.beforeEach(({ page: p }) => {
    page = new ReportPage(p);
  });

  test.describe("when report does not exist", () => {
    test.beforeEach(async () => {
      await page.navigate("a/b/c", "d");
    });

    test("should show an error message", async () => {
      expect(await page.errorMessage()).eq("Report does not exist");
    });
  });

  test.describe("when a full report exists", async () => {
    test.beforeEach(async ({ request }) => {
      await uploadReport(
        simpleReport(
          "github.com/stryker-mutator-test-organization/hello-org",
          "master"
        ),
        request
      );
      await page.navigate(
        "github.com/stryker-mutator-test-organization/hello-org",
        "master"
      );
    });

    test("should show the mutation-test-report-app with bound data", async () => {
      
      const app = (await page.mutationTestReportApp())!;
      const actualTitle = await app.title();
      const mutationScore = await app.mutationScore();
      expect(actualTitle).eq(
        "All files - hello-org/master - Stryker Dashboard"
      );
      expect(mutationScore).eq(33.33);
    });

    test.describe(
      "and afterwards it is overridden with a score-only report",
      async () => {
        test.beforeEach(async ({ request }) => {
          await uploadReport(
            scoreOnlyReport(
              "github.com/stryker-mutator-test-organization/hello-org",
              "master",
              42
            ),
            request
          );
          await page.navigate(
            "github.com/stryker-mutator-test-organization/hello-org",
            "master"
          );
        });

        test("should show the mutation score only", async () => {
          await page.waitForAngular();
          expect(await page.warningMessage()).eq(
            "No html report stored for github.com/stryker-mutator-test-organization/hello-org/master"
          );
          expect(await page.mutationTestReportApp()).eq(null);
          expect(await page.mutationScoreText()).eq("Mutation score: 42");
        });
      }
    );
  });

  test.describe("when multiple reports with module names are updated for one project", () => {
    test.beforeEach(async ({ request }) => {
      await Promise.all([
        uploadReport(
          simpleReport(
            "github.com/stryker-mutator-test-organization/hello-org",
            "feat/modules",
            "one",
            [MutantStatus.Killed, MutantStatus.Killed, MutantStatus.Killed]
          ),
          request
        ),
        uploadReport(
          simpleReport(
            "github.com/stryker-mutator-test-organization/hello-org",
            "feat/modules",
            "two",
            [
              MutantStatus.Survived,
              MutantStatus.Survived,
              MutantStatus.Survived,
            ]
          ),
          request
        ),
        uploadReport(
          simpleReport(
            "github.com/stryker-mutator-test-organization/hello-org",
            "feat/modules",
            "three",
            [MutantStatus.Killed, MutantStatus.Timeout, MutantStatus.NoCoverage]
          ),
          request
        ),
      ]);
      await page.navigate(
        "github.com/stryker-mutator-test-organization/hello-org",
        "feat/modules"
      );
    });

    test("should show the aggregated report for the project", async () => {
      const app = (await page.mutationTestReportApp())!;
      const actualTitle = await app.title();
      const mutationScore = await app.mutationScore();
      const fileNames = await app.fileNames();
      expect(actualTitle).eq(
        "All files - hello-org/feat/modules - Stryker Dashboard"
      );
      expect(mutationScore).eq(55.56);
      expect(fileNames).deep.eq([
        "one/test.js",
        "three/test.js",
        "two/test.js",
      ]);
    });
  });
});
