const sha512 = require('js-sha512');
import { MutationScoreMapper, ProjectMapper, MutationScore } from 'stryker-dashboard-data-access';

export async function run(context: any, req: any) {
    let statusCode = 400;
    let responseBody;

    context.res = {
        status: statusCode,
        body: responseBody
    };

    if (typeof req.body == 'object') {
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
                    branch: req.body.branch ? req.body.branch : '',
                    score: req.body.mutationScore
                };
                
                const scoreRepo = new MutationScoreMapper();
                await scoreRepo.insertOrMergeEntity(mutationScore);

                statusCode = 201;

                context.res = {
                    status: statusCode,
                    body: responseBody
                };
            } else {
                statusCode = 403;

                context.res = {
                    status: statusCode,
                    body: responseBody
                };
            }
        }
        catch (error) {
            console.log(error);

            statusCode = 500;

            context.res = {
                status: statusCode,
                body: responseBody
            };
        }
    }
}

function checkApiKey(context: any, projectRepo: ProjectMapper, hash: string, slug: string): Promise<boolean> {
    const lastDelimiter = slug.lastIndexOf('/');

    const projectPromise =  projectRepo.selectSingleEntity(slug.substr(0, lastDelimiter), slug.substr(lastDelimiter + 1));
    if(projectPromise) {
        return projectPromise.then(project => project.apiKeyHash === hash);
    }

    return Promise.resolve(false);
}