import 'source-map-support/register.js';
import { AzureFunction } from '@azure/functions';
import { ShieldMapper } from './ShieldMapper.js';
import { createMutationTestingReportMapper } from '@stryker-mutator/dashboard-data-access';
import { handler } from './handler.js';

const httpTrigger: AzureFunction = handler(
  new ShieldMapper(createMutationTestingReportMapper()),
);
export default httpTrigger;
