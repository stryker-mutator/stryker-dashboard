import 'source-map-support/register';
import { AzureFunction } from '@azure/functions';
import { ShieldMapper } from './ShieldMapper';
import { createMutationTestingReportMapperWithoutReportJson } from '@stryker-mutator/dashboard-data-access';
import { handler } from './handler';

const httpTrigger: AzureFunction = handler(new ShieldMapper(createMutationTestingReportMapperWithoutReportJson()));
export default httpTrigger;
