import 'source-map-support/register.js';
import { HttpHandler, app } from '@azure/functions';
import { ShieldMapper } from './ShieldMapper.js';
import { createMutationTestingReportMapper } from '@stryker-mutator/dashboard-data-access';
import { handler } from './handler.js';

const httpTrigger: HttpHandler = handler(new ShieldMapper(createMutationTestingReportMapper()));

app.http('badge', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: '{*slug}',
  handler: httpTrigger,
});

export default httpTrigger;
