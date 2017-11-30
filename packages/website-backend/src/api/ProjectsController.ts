import { Controller, Get, PathParams, Req } from 'ts-express-decorators';
import { Repository } from '../model';
import GithubAgent from '../github/GithubAgent';

@Controller('/projects')
export default class ProjectsController {

    @Get('/:login')
    public get(@PathParams('login') login: string, @Req() request: Express.Request): Promise<Repository[]> {
        return new GithubAgent(request.user.accessToken).retrieveRepositories(login)
    }
}