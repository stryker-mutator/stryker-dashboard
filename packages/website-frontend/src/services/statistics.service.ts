import type { ReportStatisticsDto } from '@stryker-mutator/dashboard-common';
import { constructApiUri } from '@stryker-mutator/dashboard-common';

import { authService } from './auth.service';
import { locationService } from './location.service';

export class StatisticsService {
  async getStatistics(slug: string): Promise<ReportStatisticsDto[] | undefined> {
    const uri = constructApiUri(locationService.getLocation().origin, slug, {
      module: undefined,
      realTime: undefined,
    },
    'statistics');

    const response = await fetch(uri, {
      headers: { Authorization: `Bearer ${authService.currentBearerToken}` },
    });
    if (response.status === 404 || response.status === 500) {
      return undefined;
    }

    return response.json() as Promise<ReportStatisticsDto[]>;
  }
}

export const statisticsService = new StatisticsService();
