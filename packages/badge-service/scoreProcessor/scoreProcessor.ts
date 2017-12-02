const sha512 = require('js-sha512');
import { MutationScoreMapper, ProjectMapper, MutationScore } from 'stryker-dashboard-data-access';

export async function run(context: any, req: any) {
    let statusCode = 400;
    let responseBody = "Invalid request object";

    context.res = {
        status: statusCode,
        body: responseBody
    };

    if (typeof req.body != 'undefined' && typeof req.body == 'object') {
        if(!req.body.apiKey || !req.body.repositorySlug || !req.body.mutationScore)
        {
            return;
        }
        const hash = sha512.sha512_256(req.body.apiKey);
        const slug = req.body.repositorySlug;

        const projectRepo = new ProjectMapper();

        try {
            if (await checkApiKey(context, projectRepo, hash, slug)) {

                let mutationScore: MutationScore = {
                    slug,
                    branch: req.body.branch,
                    score: req.body.mutationScore
                };
                
                const scoreRepo = new MutationScoreMapper();
                await scoreRepo.insertOrMergeEntity(mutationScore);

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
}

function checkApiKey(context: any, projectRepo: ProjectMapper, hash: string, slug: string): Promise<boolean> {
    context.log('Checking API Key');
    const lastDelimiter = slug.lastIndexOf('/');

    return projectRepo.selectSingleEntity(slug.substr(0, lastDelimiter), slug.substr(lastDelimiter + 1)).then(project => project.apiKeyHash === hash);
}