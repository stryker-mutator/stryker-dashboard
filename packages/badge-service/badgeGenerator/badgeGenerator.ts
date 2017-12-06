const sha512 = require('js-sha512');
import { MutationScoreMapper, MutationScore } from 'stryker-dashboard-data-access';
import * as httpHelpers from '../helpers/httpHelpers';

export async function run(context: any, req: any) {
    let statusCode = 400;
    context.res = {
        status: statusCode,
    };

    const scoreRepo = new MutationScoreMapper();

    let rowKey = context.bindingData.repo;

    if (context.bindingData.branch) {
        rowKey += `/${context.bindingData.branch}`;
    }

    try {
        const mutationScore = await scoreRepo.selectSingleEntity(`${context.bindingData.provider}/${context.bindingData.owner}`, rowKey);
        if (mutationScore) {
            const scoreColor = determineColor(mutationScore.score);

            // Retrieve badge
            const badge = await retrieveBadge(scoreColor, mutationScore.score);

            if(!badge) {
                throw 'no valid image found';
            }

            statusCode = 200;

            context.res = {
                status: statusCode,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                },
                body: badge
            };
        }
    }
    catch (exception) {
        statusCode = 500;

        context.res = {
            status: statusCode,
        };
    }
}

function determineColor(score: number): Color {
    if (score < 60)
        return Color.Red;
    else if (score < 80 && score >= 60)
        return Color.Orange;
    else
        return Color.Green;
}

enum Color {
    Red = 'red',
    Orange = 'orange',
    Green = 'green'
}

function retrieveBadge(color: Color, score: number) {
    const url = `https://img.shields.io/badge/mutation%20score-${score}-${color}.svg`;

    // get
    return httpHelpers.getContent(url).then(content => {
        return content;
    });
}