import { constructApiUri, Report } from "@stryker-mutator/dashboard-common";
import { MutationTestResult } from "mutation-testing-report-schema";

import { authService } from "./auth.service";
import { locationService } from "./location.service";

export class ReportService {
  async getReport(slug: string, moduleName?: string, realTime?: string): Promise<MutationTestResult | undefined> {
    const uri = constructApiUri(locationService.getLocation().origin, slug, { module: moduleName, realTime: realTime });
    const response = await fetch(`${uri}`, {
      headers: {
        Authorization: `Bearer ${authService.currentBearerToken}`
      }
    });
    if (response.status === 404 || response.status === 500) {
      return undefined;
    }

    return await response.json();
  }
}

export const reportService = new ReportService();
