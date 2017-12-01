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
const sha512 = require('js-sha512');
const azure = require("azure-storage");
const common_1 = require("../Shared/common");
function run(context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        let statusCode = 400;
        let responseBody = "Invalid request object";
        context.log('Initializing Azure Storage Table Service');
        if (typeof req.body != 'undefined' && typeof req.body == 'object') {
            const hash = sha512.sha512_256(req.body.api_key);
            const slug = req.body.repository_slug;
            // Initialize Table Service
            const connectionString = process.env.WEBSITE_CONTENTAZUREFILECONNECTIONSTRING;
            const tableService = azure.createTableService(connectionString);
            try {
                if (yield checkApiKey(context, tableService, hash, slug)) {
                    const maxDate = new Date(8640000000000000);
                    var mutationScore = {
                        partitionKey: hash,
                        rowKey: new Date(maxDate.getTime() - Date.now()).getTime().toString(),
                        branch: req.body.branch,
                        mutationScore: req.body.mutation_score,
                        reportData: JSON.stringify(req.body.report_data)
                    };
                    yield common_1.insertEntity(tableService, mutationScore);
                    statusCode = 201;
                    responseBody = 'succesfully created report';
                    context.res = {
                        status: statusCode,
                        body: responseBody
                    };
                }
                else {
                    statusCode = 403;
                    responseBody = 'access denied';
                    context.res = {
                        status: statusCode,
                        body: responseBody
                    };
                }
            }
            catch (error) {
                console.log(error);
                statusCode = 500;
                responseBody = 'somewhere, something went horribly wrong';
                context.res = {
                    status: statusCode,
                    body: responseBody
                };
            }
        }
    });
}
exports.run = run;
;
function checkApiKey(context, tableService, hash, slug) {
    context.log('Checking API Key');
    return common_1.retrieveSingleEntity(tableService, 'keys', 'RowKey', hash).then(result => {
        if (result.repoSlug._ == slug) {
            context.log('Validated');
            return true;
        }
        else {
            return false;
        }
    });
}
//# sourceMappingURL=index.js.map