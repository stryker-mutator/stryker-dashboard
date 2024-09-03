import debug from 'debug';
import { Repository, Login } from './models.js';
import HttpClient from '../client/HttpClient.js';
import * as github from '../github/models.js';
import { Injectable } from '@nestjs/common';

const GITHUB_BACKEND = 'https://api.github.com';

@Injectable()
export default class GithubAgent {
  private readonly log = debug(GithubAgent.name);

  constructor(private readonly client: HttpClient) {}

  public getCurrentUser(user: github.Authentication): Promise<Login> {
    return this.get<Login>(user, `${GITHUB_BACKEND}/user`);
  }

  public async getMyOrganizations(user: github.Authentication): Promise<Login[]> {
    const logins = await this.get<Login[]>(user, `${GITHUB_BACKEND}/user/orgs`);
    return logins;
  }

  public async getOrganizations(user: github.Authentication, loginName: string): Promise<Login[]> {
    const logins = await this.get<Login[]>(user, `${GITHUB_BACKEND}/users/${loginName}/orgs`);
    return logins;
  }

  public getOrganizationRepositories(user: github.Authentication, organizationLogin: string): Promise<Repository[]> {
    return this.get<Repository[]>(user, `${GITHUB_BACKEND}/orgs/${organizationLogin}/repos?type=member`);
  }

  public getMyRepositories(user: github.Authentication): Promise<Repository[]> {
    return this.get<Repository[]>(user, `${GITHUB_BACKEND}/user/repos?type=owner`);
  }

  public async userHasPushAccess(user: github.Authentication, owner: string, name: string): Promise<boolean> {
    // https://developer.github.com/v3/repos/#get
    const repo = await this.get<Repository>(user, `${GITHUB_BACKEND}/repos/${owner}/${name}`);
    return repo.permissions && repo.permissions.push;
  }

  private async get<T>(user: github.Authentication, url: string): Promise<T> {
    const response = await this.client.fetchJson<T>(url, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    // Status: 200 OK
    // Link: <https://api.github.com/resource?page=2>; rel="next",
    //       <https://api.github.com/resource?page=5>; rel="last"
    const link = response.headers.get('link') as string;
    const nextLinkTest = /<(.*?)>; rel="next"/;
    const nextLink = nextLinkTest.exec(link);
    if (nextLink && Array.isArray(response.body)) {
      this.log(`Retrieving next page: ${nextLink[1]}`);
      const next = await this.get<T>(user, nextLink[1]);
      return (response.body as unknown[]).concat(next) as T;
    } else {
      return Promise.resolve(response.body);
    }
  }
}
