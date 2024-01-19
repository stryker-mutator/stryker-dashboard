import { expect } from 'chai';
import GithubAgent from '../../../src/github/GithubAgent.js';
import HttpClient, { Response } from '../../../src/client/HttpClient.js';
import * as github from '../../../src/github/models.js';
import { githubFactory } from '../../helpers/producers.js';
import sinon from 'sinon';

describe('GithubClient', () => {
  let httpClientMock: sinon.SinonStubbedInstance<HttpClient>;
  let sut: GithubAgent;
  let user: github.Authentication;
  let expectedHeaders: Record<string, string>;

  beforeEach(() => {
    httpClientMock = sinon.createStubInstance(HttpClient);
    sut = new GithubAgent(httpClientMock as any);
    user = githubFactory.authentication({ accessToken: '1234' });
    expectedHeaders = { Authorization: 'Bearer 1234' };
  });

  describe('getOrganizationRepositories', () => {
    it('should GET `/orgs/foobar/repos` and return a plain response', async () => {
      // Arrange
      const expectedResponse: Response<string[]> = {
        body: ['repo1', 'repo2'],
        headers: new Headers({}),
      };
      httpClientMock.fetchJson.resolves(expectedResponse);

      // Act
      const actualRepos = await sut.getOrganizationRepositories(user, 'foobar');

      // Assert
      expect(actualRepos).eq(expectedResponse.body);
      expect(httpClientMock.fetchJson).calledWith(
        'https://api.github.com/orgs/foobar/repos?type=member',
        { headers: expectedHeaders }
      );
    });

    it('should call multiple times if there is a next link', async () => {
      // Arrange
      const response1: Response<string[]> = {
        body: ['repo1', 'repo2'],
        headers: new Headers({
          link: `<https://api.github.com/resource?page=2>; rel="next", <https://api.github.com/resource?page=4>; rel="last"`,
        }),
      };
      const response2: Response<string[]> = {
        body: ['repo3', 'repo4'],
        headers: new Headers({
          link: ` <https://api.github.com/resource?page=3>; rel="next", <https://api.github.com/resource?page=3>; rel="last"`,
        }),
      };
      const response3: Response<string[]> = {
        body: ['repo5'],
        headers: new Headers({
          link: `<https://api.github.com/resource?page=3>; rel="last"`,
        }),
      };
      httpClientMock.fetchJson
        .withArgs('https://api.github.com/orgs/foobar/repos?type=member')
        .resolves(response1);
      httpClientMock.fetchJson
        .withArgs('https://api.github.com/resource?page=2')
        .resolves(response2);
      httpClientMock.fetchJson
        .withArgs('https://api.github.com/resource?page=3')
        .resolves(response3);

      // Act
      const actualRepos = await sut.getOrganizationRepositories(user, 'foobar');

      // Assert
      expect(actualRepos).deep.eq([
        'repo1',
        'repo2',
        'repo3',
        'repo4',
        'repo5',
      ]);
      expect(httpClientMock.fetchJson).callCount(3);
    });

    it('should throw an error if http client rejected', () => {
      // Arrange
      const message = 'Oh noes, an error!';
      httpClientMock.fetchJson.rejects(new Error(message));

      return expect(
        sut.getOrganizationRepositories(user, 'something')
      ).rejectedWith(message);
    });
  });

  describe('getCurrentUser', () => {
    it('should HTTP GET `/user` and forward the response', async () => {
      const response: Response<github.Login> = {
        body: githubFactory.login({ login: 'foobar' }),
        headers: new Headers({}),
      };
      httpClientMock.fetchJson.resolves(response);
      const actual = await sut.getCurrentUser(user);
      expect(actual).eq(response.body);
      expect(httpClientMock.fetchJson).calledWith(
        'https://api.github.com/user',
        { headers: expectedHeaders }
      );
    });
  });

  describe('getMyOrganizations', () => {
    it('should HTTP GET `/user/orgs` and forward the response', async () => {
      const response: Response<github.Login[]> = {
        body: [githubFactory.login({ login: 'foobar.org' })],
        headers: new Headers({}),
      };
      httpClientMock.fetchJson.resolves(response);
      const actual = await sut.getMyOrganizations(user);
      expect(actual).eq(response.body);
      expect(httpClientMock.fetchJson).calledWith(
        'https://api.github.com/user/orgs',
        { headers: expectedHeaders }
      );
    });
  });

  describe('getOrganizationRepositories', () => {
    it('should HTTP GET `/orgs/:org/repos?type=member` and forward the response', async () => {
      const response: Response<github.Repository[]> = {
        body: [githubFactory.repository()],
        headers: new Headers({}),
      };
      httpClientMock.fetchJson.resolves(response);
      const actual = await sut.getOrganizationRepositories(user, 'foobar.org');
      expect(actual).eq(response.body);
      expect(httpClientMock.fetchJson).calledWith(
        'https://api.github.com/orgs/foobar.org/repos?type=member',
        { headers: expectedHeaders }
      );
    });
  });

  describe('getMyRepositories', () => {
    it('should HTTP GET `/user/repos?type=owner` and forward the response', async () => {
      const response: Response<github.Repository[]> = {
        body: [githubFactory.repository()],
        headers: new Headers({}),
      };
      httpClientMock.fetchJson.resolves(response);
      const actual = await sut.getMyRepositories(user);
      expect(actual).eq(response.body);
      expect(httpClientMock.fetchJson).calledWith(
        'https://api.github.com/user/repos?type=owner',
        { headers: expectedHeaders }
      );
    });
  });
});
