import type { HttpHandler } from '@azure/functions';
import { app } from '@azure/functions';
import { createMutationTestingReportMapper } from '@stryker-mutator/dashboard-data-access';

import { handler } from './handler.js';
import { ShieldMapper } from './ShieldMapper.js';

const httpTrigger: HttpHandler = handler(new ShieldMapper(createMutationTestingReportMapper()));

app.http('badge', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: '{*slug}',
  handler: httpTrigger,
});

export default httpTrigger;
