import { Repository, Login } from './models';
import * as utils from '../utils';
import { BearerCredentialHandler } from 'typed-rest-client/handlers/bearertoken';
import HttpClient from '../client/HttpClient';

const GITHUB_BACKEND = 'https://api.github.com';

export default class GithubAgent {

    private readonly log = utils.debug(GithubAgent.name);
    private client: HttpClient;

    constructor(tokenOrClient: HttpClient | string) {
        if (typeof tokenOrClient === 'string') {
            this.client = new HttpClient([new BearerCredentialHandler(tokenOrClient)]);
        } else {
            this.client = tokenOrClient;
        }
    }
    public getCurrentUser(): Promise<Login> {
        return this.get<Login>(`${GITHUB_BACKEND}/user`);
    }

    public getMyOrganizations(): Promise<Login[]> {
        return this.get<Login[]>(`${GITHUB_BACKEND}/user/orgs`);
    }

    public getOrganizationRepositories(organizationLogin: string): Promise<Repository[]> {
        return this.get<Repository[]>(`${GITHUB_BACKEND}/orgs/${organizationLogin}/repos?type=member`);
    }

    public getMyRepositories(): Promise<Repository[]> {
        return this.get<Repository[]>(`${GITHUB_BACKEND}/user/repos?type=owner`);
    }

    public async userHasPushAccess(owner: string, name: string, login: string): Promise<boolean> {
        // https://developer.github.com/v3/repos/#get
        const repo = await this.get<Repository>(`${GITHUB_BACKEND}/repos/${owner}/${name}`);
        return repo.permissions && repo.permissions.push;
    }

    private async get<T>(url: string): Promise<T> {
        const response = await this.client.get<T>(url);

        // Status: 200 OK
        // Link: <https://api.github.com/resource?page=2>; rel="next",
        //       <https://api.github.com/resource?page=5>; rel="last"
        const link = response.headers.link as string;
        const nextLinkTest = /<(.*?)>; rel="next"/;
        const nextLink = nextLinkTest.exec(link);
        if (nextLink && Array.isArray(response.body)) {
            this.log(`Retrieving next page: ${nextLink[1]}`);
            const next = await this.get<T>(nextLink[1]);
            return (response.body as any).concat(next);
        } else {
            return Promise.resolve(response.body);
        }
    }
}