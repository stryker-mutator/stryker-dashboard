import { test } from "@playwright/test";
import { simpleReport, uploadReport } from "../actions/report.action";
import { expect } from "chai";
import { URL } from "url";
import { PutReportResponse } from "@stryker-mutator/dashboard-contract/src";

test.describe("Report api", () => {
  test.describe("HTTP put", () => {
    test("should respond with the correct href", async ({
      request,
      baseURL,
    }) => {
      const response = await uploadReport(
        simpleReport(
          "github.com/stryker-mutator-test-organization/hello-org",
          "feat/report"
        ),
        request
      );

      const expectedResponse: PutReportResponse = {
        href: new URL(
          "/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report",
          baseURL
        ).toString(),
      };
      expect(response).deep.eq(expectedResponse);
    });

    test("should respond the correct href and project href when uploading for a module", async ({
      request,
      baseURL,
    }) => {
      const response = await uploadReport(
        simpleReport(
          "github.com/stryker-mutator-test-organization/hello-org",
          "feat/report",
          "fooModule"
        ),
        request
      );

      const expectedResponse: PutReportResponse = {
        href: new URL(
          "/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report?module=fooModule",
          baseURL
        ).toString(),
        projectHref: new URL(
          "/reports/github.com/stryker-mutator-test-organization/hello-org/feat/report",
          baseURL
        ).toString(),
      };
      expect(response).deep.eq(expectedResponse);
    });
  });
});
