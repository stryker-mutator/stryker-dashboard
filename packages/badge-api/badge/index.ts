import 'source-map-support/register';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { ShieldMapper } from './ShieldMapper';
import { MutationScoreMapper } from 'stryker-dashboard-data-access';

const mapper = new ShieldMapper(new MutationScoreMapper());

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  context.log(`HTTP trigger function processed a request: ${JSON.stringify(req.params, null, 2)}.`);
  const {
    provider,
    owner,
    repo,
    branch
  } = req.params;

  if (provider && owner && repo) {
    context.res = {
      body: await mapper.shieldFor(provider, owner, repo, branch)
    };
  }
  else {
    context.res = {
      status: 400,
      body: `Missing a required path parameter: ${provider ? owner ? repo ? '' : 'repo' : 'owner' : 'provider'}`
    };
  }
};

export default httpTrigger;
