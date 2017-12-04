import { Controller, Get, Req, PathParams } from 'ts-express-decorators';
import { Repository } from 'stryker-dashboard-website-contract';
import RepositoryService from '../services/RepositoryService';

@Controller('/organizations')
export default class OrganizationsController {

    constructor(private repositoryService: RepositoryService) {

    }

    @Get('/:name/repositories')
    public get( @PathParams('name') login: string, @Req() req: Express.Request): Promise<Repository[]> {
        return this.repositoryService.getAllForOrganization(req.user, login)
    }
}