"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const ShieldMapper_1 = require("./ShieldMapper");
const stryker_dashboard_data_access_1 = require("stryker-dashboard-data-access");
const mapper = new ShieldMapper_1.ShieldMapper(new stryker_dashboard_data_access_1.MutationScoreMapper());
const httpTrigger = async (context, req) => {
    context.log(`HTTP trigger function processed a request: ${JSON.stringify(req.params, null, 2)}.`);
    const { provider, owner, repo, branch } = req.params;
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
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map