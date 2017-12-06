import { Controller, Get, Req } from 'ts-express-decorators';
import GithubAgent from '../github/GithubAgent';
import * as contract from 'stryker-dashboard-website-contract';
import * as github from '../github/models';
import GithubRepositoryService from '../services/GithubRepositoryService';

function toContract(githubLogin: github.Login): contract.Login {
    return {
        name: githubLogin.login,
        avatarUrl: githubLogin.avatar_url
    }
};

function allToContract(githubLogins: github.Login[]): contract.Login[] {
    return githubLogins.map(toContract);
}

@Controller('/user')
export default class UserController {

    constructor(private repoService: GithubRepositoryService) { }

    @Get('/')
    public get( @Req() request: Express.Request): Promise<contract.Login> {
        return new GithubAgent(request.user.accessToken)
            .getCurrentUser()
            .then(toContract);;
    }

    @Get('/repositories')
    public getRepositories( @Req() request: Express.Request): Promise<contract.Repository[]> {
        return this.repoService.getAllForUser(request.user);
    }

    @Get('/organizations')
    public getOrganizations( @Req() req: Express.Request): Promise<contract.Login[]> {
        const agent = new GithubAgent(req.user.accessToken);
        return agent.getMyOrganizations()
            .then(allToContract);
    }
}