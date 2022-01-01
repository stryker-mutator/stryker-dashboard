import { test } from "@playwright/test";
import { ReportPage } from "../po/reports/report-page.po";
import { expect } from "chai";
import { simpleReport, scoreOnlyReport } from "../actions/report.action";
import { MutantStatus } from "mutation-testing-report-schema";
import { ReportClient } from "../po/reports/report-client.po";

test.describe("Report page", () => {
  let page: ReportPage;
  let client: ReportClient;

  test.beforeEach(({ page: p, request }) => {
    page = new ReportPage(p);
    client = new ReportClient(request);
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
    test.beforeEach(async () => {
      await client.uploadReport(
        simpleReport(
          "github.com/stryker-mutator-test-organization/hello-org",
          "master"
        )
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
        test.beforeEach(async () => {
          await client.uploadReport(
            scoreOnlyReport(
              "github.com/stryker-mutator-test-organization/hello-org",
              "master",
              42
            )
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

  test.describe(
    "when multiple reports with module names are updated for one project",
    () => {
      test.beforeEach(async () => {
        await Promise.all([
          client.uploadReport(
            simpleReport(
              "github.com/stryker-mutator-test-organization/hello-org",
              "feat/modules",
              "one",
              [MutantStatus.Killed, MutantStatus.Killed, MutantStatus.Killed]
            )
          ),
          client.uploadReport(
            simpleReport(
              "github.com/stryker-mutator-test-organization/hello-org",
              "feat/modules",
              "two",
              [
                MutantStatus.Survived,
                MutantStatus.Survived,
                MutantStatus.Survived,
              ]
            )
          ),
          client.uploadReport(
            simpleReport(
              "github.com/stryker-mutator-test-organization/hello-org",
              "feat/modules",
              "three",
              [
                MutantStatus.Killed,
                MutantStatus.Timeout,
                MutantStatus.NoCoverage,
              ]
            )
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
    }
  );
});
