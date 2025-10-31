import type { MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';
import { constructApiUri } from '@stryker-mutator/dashboard-common';
import type { MutationTestResult } from 'mutation-testing-report-schema';

import { authService } from './auth.service.ts';
import { locationService } from './location.service.ts';

export class ReportService {
  async getReport(
    slug: string,
    moduleName?: string,
    realTime?: string,
  ): Promise<MutationTestResult | MutationScoreOnlyResult | undefined> {
    const uri = constructApiUri(locationService.getLocation().origin, slug, {
      module: moduleName,
      realTime: realTime,
    });
    const response = await fetch(`${uri}`, {
      headers: {
        Authorization: `Bearer ${authService.currentBearerToken}`,
      },
    });
    if (response.status === 404 || response.status === 500) {
      return undefined;
    }

    return response.json() as Promise<MutationTestResult | MutationScoreOnlyResult>;
  }
}

export const reportService = new ReportService();
