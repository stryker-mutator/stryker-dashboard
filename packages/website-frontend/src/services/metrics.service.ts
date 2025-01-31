import { constructApiUri } from '@stryker-mutator/dashboard-common';
import type { Metrics } from 'mutation-testing-metrics';

import { authService } from './auth.service';
import { locationService } from './location.service';

export class MetricsService {
  async getMetrics(slug: string): Promise<Metrics[] | undefined> {
    let uri = constructApiUri(locationService.getLocation().origin, slug, {
      module: undefined,
      realTime: undefined,
    });

    uri = uri.replace('reports', 'metrics');
    console.log(uri);

    const response = await fetch(`${uri}`, {
      headers: { Authorization: `Bearer ${authService.currentBearerToken}` },
    });
    if (response.status === 404 || response.status === 500) {
      return undefined;
    }

    return response.json() as Promise<Metrics[]>;
  }
}

export const metricsService = new MetricsService();
