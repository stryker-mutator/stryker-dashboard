import { Controller, Get, Req } from 'ts-express-decorators';
import GithubAgent from '../github/GithubAgent';
import { Login } from 'stryker-dashboard-website-contract';
import { Organization } from '../github/models';

function toLogin(org: Organization): Login {
    return {
        avatarUrl: org.avatar_url,
        name: org.login
    };
}

@Controller('/organizations')
export default class OrganizationsController {

    @Get('/')
    public get( @Req() req: Express.Request): Promise<Login[]> {
        return new GithubAgent(req.user.accessToken).retrieveOrganizations()
            .then(organizations => organizations.map(toLogin));
    }
}