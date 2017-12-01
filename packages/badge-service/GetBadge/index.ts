import { pascalToCamelCase, retrieveSingleEntity, retrieveHash, retrieveMutationScore, retrieveBadge } from '../Shared/common';
import { MutationScoreEntity, Color } from '../Shared/models';
const sha512 = require('js-sha512');
import azure = require('azure-storage');

export async function run(context: any, req: any) {
    const statusCode = 200;

    // Initialize Table Service
    const connectionString = process.env.WEBSITE_CONTENTAZUREFILECONNECTIONSTRING as string;
    const tableService = azure.createTableService(connectionString);

    const hash = await retrieveHash(tableService, req.query.slug);

    const mutationScore = await retrieveMutationScore(tableService, hash);

    const scoreColor = determineColor(mutationScore);

    // Retrieve badge
    const badge = await retrieveBadge(scoreColor, mutationScore);

    context.res = {
        status: statusCode,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
        },
        body: badge
    };
}

function determineColor(score: number): Color {
    if (score < 60)
        return Color.Red;
    else if (score < 80 && score >= 60)
        return Color.Orange;
    else
        return Color.Green;
}