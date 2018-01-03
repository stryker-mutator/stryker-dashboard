const sha512 = require('js-sha512');
import { MutationScoreMapper, MutationScore } from 'stryker-dashboard-data-access';
import * as httpHelpers from '../helpers/helpers';
import { retrieveUnknownBadge } from '../helpers/helpers';

export async function run(context: any, req: any) {
    let statusCode = 400;
    context.res = {
        status: statusCode,
    };

    async function setResult(badgePromise: Promise<string | undefined>) {
        let badge = await badgePromise;
        if (!badge) {
            badge = await retrieveUnknownBadge();
        }
        context.res = {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            },
            body: badge
        }
    }

    const scoreRepo = new MutationScoreMapper();

    let rowKey = context.bindingData.repo;

    if (context.bindingData.branch) {
        rowKey += `/${context.bindingData.branch}`;
    }

    try {
        const mutationScore = await scoreRepo.select(`${context.bindingData.provider}/${context.bindingData.owner}`, rowKey);
        if (mutationScore) {
            const score = Math.round(mutationScore.score * 10) / 10;
            const scoreColor = determineColor(score);
            await setResult(retrieveBadge(scoreColor, score.toFixed(1)));
        }
    }
    catch (error) {
        httpHelpers.logError(error);
        await setResult(retrieveUnknownBadge());
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
    Grey = 'lightgrey',
    Red = 'red',
    Orange = 'orange',
    Green = 'green'
}

function retrieveBadge(color: Color, score: string): Promise<string | undefined> {
    const url = `https://img.shields.io/badge/mutation%20score-${score}-${color}.svg`;
    return httpHelpers.getContent(url);
}