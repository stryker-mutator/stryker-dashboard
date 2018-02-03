import { MutationScoreMapper, MutationScore } from 'stryker-dashboard-data-access';
import * as httpHelpers from '../helpers/helpers';
import { retrieveUnknownBadge } from '../helpers/helpers';

export = async function run(context: any, req: any) {
    let statusCode = 400;
    context.res = {
        status: statusCode,
    };

    async function setResult(badgePromise: Promise<string | undefined>) {
        let badge = await badgePromise;
        if (!badge) {
            badge = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="154" height="20"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="a"><rect width="154" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#a)"><path fill="#555" d="M0 0h93v20H0z"/><path fill="#9f9f9f" d="M93 0h61v20H93z"/><path fill="url(#b)" d="M0 0h154v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110"><text x="475" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="830">mutation score</text><text x="475" y="140" transform="scale(.1)" textLength="830">mutation score</text><text x="1225" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="510">unknown</text><text x="1225" y="140" transform="scale(.1)" textLength="510">unknown</text></g> </svg>';        }
        
            context.res = {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Content-Type': 'image/svg+xml'
            },
            body: badge
        }
    }

    const scoreRepo = new MutationScoreMapper();

    try {
        const mutationScore = await scoreRepo.select(`${context.bindingData.provider}/${context.bindingData.owner}/${context.bindingData.repo}`, context.bindingData.branch || "");
        if (mutationScore) {
            const score = Math.round(mutationScore.score * 10) / 10;
            const scoreColor = determineColor(score);
            await setResult(retrieveBadge(scoreColor, score.toFixed(1)));
        }
        else {
            await setResult(retrieveUnknownBadge());
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