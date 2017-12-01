const sha512 = require('js-sha512');
import { MutationScoreMapper, MutationScore } from 'stryker-dashboard-data-access';
import * as https from 'https';

export async function run(context: any, req: any) {
    const statusCode = 200;
    const scoreRepo = new MutationScoreMapper();

    let rowKey = context.bindingData.repo;

    if (context.bindingData.branch) {
        rowKey += `/${context.bindingData.branch}`;
    }

    const mutationScore = await scoreRepo.selectSingleEntity(`${context.bindingData.provider}/${context.bindingData.owner}`, rowKey);
    const scoreColor = determineColor(mutationScore.score);

    // Retrieve badge
    const badge = await retrieveBadge(scoreColor, mutationScore.score);

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

enum Color {
    Red = 'red',
    Orange = 'orange',
    Green = 'green'
}

function retrieveBadge(color: Color, score: number) {
    const url = `https://img.shields.io/badge/mutation%20score-${score}-${color}.svg`;

    // get
    return getContent(url).then(content => {
        return content;
    });
}

function getContent(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let request = https.get(url, (response) => {
            let body: string[] = [];
            response.on('data', (chunk: string) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });

        request.on('error', (err) => reject(err))
    })
};
