import { Controller, Req, Post, Res } from '@tsed/common';
import * as express from 'express';
import { BadRequest } from 'ts-httpexceptions';
import { generateHashValue } from '../utils';
import { MutationScore, ProjectMapper, MutationScoreMapper } from 'stryker-dashboard-data-access';
import DataAccess from '../services/DataAccess';

interface Report {
    apiKey: string;
    repositorySlug: string;
    mutationScore: number;
    branch: string;
}

@Controller('/reports')
export default class ReportsController {

    private repositoryMapper: ProjectMapper;
    private mutationScoreMapper: MutationScoreMapper;

    constructor(dataAccess: DataAccess) {
        this.repositoryMapper = dataAccess.repositoryMapper;
        this.mutationScoreMapper = dataAccess.mutationScoreMapper;
    }

    @Post('')
    public async addNew( @Req() request: express.Request, @Res() response: express.Response) {
        this.verifyRequiredProperties(request);
        const report = request.body as Report;
        const hash = generateHashValue(report.apiKey);
        if (await this.checkApiKey(hash, report.repositorySlug)) {
            const mutationScore: MutationScore = {
                branch: report.branch || '',
                score: report.mutationScore,
                slug: report.repositorySlug
            };

            await this.mutationScoreMapper.insertOrMergeEntity(mutationScore);
            response.statusCode = 201;
            return '';
        } else {
            return null;
        }
    }

    private verifyRequiredProperties(request: express.Request) {
        ['apiKey', 'repositorySlug', 'mutationScore'].forEach(prop => {
            if (!request.body[prop]) {
                throw new BadRequest(`Missing required property ${prop}`);
            }
        });
    }

    private checkApiKey(hash: string, slug: string): Promise<boolean> {
        const lastDelimiter = slug.lastIndexOf('/');
        if (lastDelimiter === -1) {
            return Promise.resolve(false);
        } else {
            const projectPromise = this.repositoryMapper.select(slug.substr(0, lastDelimiter), slug.substr(lastDelimiter + 1));
            return projectPromise.then(repo => {
                return repo !== null && repo.apiKeyHash === hash;
            });
        }
    }
}
