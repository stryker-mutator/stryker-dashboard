import { Controller, Get, Req } from 'ts-express-decorators';
import GithubAgent from '../github/GithubAgent';
import { Login } from '../model';

@Controller('/organizations')
export default class OrganizationsController {

    @Get('/')
    public get( @Req() req: Express.Request): Promise<Login[]> {
        return new GithubAgent(req.user.accessToken).retrieveOrganizations();
    }
}