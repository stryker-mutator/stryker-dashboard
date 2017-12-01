import { Controller, Get, PathParams, Req } from 'ts-express-decorators';
import GithubAgent from '../github/GithubAgent';
import { Login } from 'stryker-dashboard-website-contract';

@Controller('/users')
export default class UsersController {

    @Get('/:name')
    public get(@PathParams('name') name: string, @Req() request: Express.Request): Promise<Login> {
        return new GithubAgent(request.user.accessToken).getUser(name).then(login => ({
            name: login.login,
            avatarUrl: login.avatar_url
        }));;
    }
}