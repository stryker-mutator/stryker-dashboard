"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../Shared/common");
const models_1 = require("../Shared/models");
const sha512 = require('js-sha512');
const azure = require("azure-storage");
function run(context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const statusCode = 200;
        // Initialize Table Service
        const connectionString = process.env.WEBSITE_CONTENTAZUREFILECONNECTIONSTRING;
        const tableService = azure.createTableService(connectionString);
        const hash = yield common_1.retrieveHash(tableService, req.query.slug);
        const mutationScore = yield common_1.retrieveMutationScore(tableService, hash);
        const scoreColor = determineColor(mutationScore);
        // Retrieve badge
        const badge = yield common_1.retrieveBadge(scoreColor, mutationScore);
        context.res = {
            status: statusCode,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            },
            body: badge
        };
    });
}
exports.run = run;
function determineColor(score) {
    if (score < 60)
        return models_1.Color.Red;
    else if (score < 80 && score >= 60)
        return models_1.Color.Orange;
    else
        return models_1.Color.Green;
}
//# sourceMappingURL=index.js.map