import { Controller, Get, PathParams, Req } from 'ts-express-decorators';
import GithubAgent from '../github/GithubAgent';
import { Login } from '../model';

@Controller('/users')
export default class UsersController {

    @Get('/:login')
    public get(@PathParams('login') login: string, @Req() request: Express.Request): Promise<Login> {
        return new GithubAgent(request.user.accessToken).getUser(login);
    }
}