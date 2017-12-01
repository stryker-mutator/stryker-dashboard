const sha512 = require('js-sha512');
import azure = require('azure-storage');
import { retrieveSingleEntity, insertEntity } from '../Shared/common';
import { ApiKeyEntity, MutationScoreEntity } from '../Shared/models';

export async function run(context: any, req: any) {
    let statusCode = 400;
    let responseBody = "Invalid request object";

    context.log('Initializing Azure Storage Table Service')

    if (typeof req.body != 'undefined' && typeof req.body == 'object') {
        const hash = sha512.sha512_256(req.body.api_key);

        const slug = req.body.repository_slug;

        // Initialize Table Service
        const connectionString = process.env.WEBSITE_CONTENTAZUREFILECONNECTIONSTRING as string;
        const tableService = azure.createTableService(connectionString);

        try {
            if (await checkApiKey(context, tableService, hash, slug)) {

                const maxDate = new Date(8640000000000000);

                var mutationScore: MutationScoreEntity = {
                    partitionKey: hash,
                    rowKey: new Date(maxDate.getTime() - Date.now()).getTime().toString(),
                    branch: req.body.branch,
                    mutationScore: req.body.mutation_score,
                    reportData: JSON.stringify(req.body.report_data)
                };

                await insertEntity(tableService, mutationScore);

                statusCode = 201;
                responseBody = 'succesfully created report'

                context.res = {
                    status: statusCode,
                    body: responseBody
                };
            } else {
                statusCode = 403;
                responseBody = 'access denied'

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
};

function checkApiKey(context: any, tableService: azure.TableService, hash: string, slug: string): Promise<boolean> {
    context.log('Checking API Key');

    return retrieveSingleEntity<ApiKeyEntity>(tableService, 'keys', 'RowKey', hash).then(
        result => {
            if (result.repoSlug._ == slug) {
                context.log('Validated');

                return true;
            }
            else {
                return false;
            }
        });
}