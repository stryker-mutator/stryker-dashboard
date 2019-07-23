import { expect } from 'chai';
import GithubAgent from '../../../src/github/GithubAgent';
import HttpClient, { Response } from '../../../src/client/HttpClient';
import * as github from '../../../src/github/models';
import { githubFactory } from '../../helpers/producers';
import sinon = require('sinon');

describe('GithubClient', () => {
  let httpClientMock: sinon.SinonStubbedInstance<HttpClient>;
  let sut: GithubAgent;

  beforeEach(() => {
    httpClientMock = sinon.createStubInstance(HttpClient);
    sut = new GithubAgent(httpClientMock as any);
  });

  describe('getOrganizationRepositories', () => {

    it('should GET `/orgs/foobar/repos` and return a plain response', async () => {
      // Arrange
      const expectedResponse: Response<string[]> = { body: ['repo1', 'repo2'], headers: {} };
      httpClientMock.get.resolves(expectedResponse);

      // Act
      const actualRepos = await sut.getOrganizationRepositories('foobar');

      // Assert
      expect(actualRepos).eq(expectedResponse.body);
      expect(httpClientMock.get).calledWith('https://api.github.com/orgs/foobar/repos?type=member');
    });

    it('should call multiple times if there is a next link', async () => {
      // Arrange
      const response1: Response<string[]> = {
        body: ['repo1', 'repo2'],
        headers: {
          link: `<https://api.github.com/resource?page=2>; rel="next", <https://api.github.com/resource?page=4>; rel="last"`
        }
      };
      const response2: Response<string[]> = {
        body: ['repo3', 'repo4'], headers: {
          link: ` <https://api.github.com/resource?page=3>; rel="next", <https://api.github.com/resource?page=3>; rel="last"`
        }
      };
      const response3: Response<string[]> = {
        body: ['repo5'], headers: {
          link: `<https://api.github.com/resource?page=3>; rel="last"`
        }
      };
      httpClientMock.get.withArgs('https://api.github.com/orgs/foobar/repos?type=member').resolves(response1);
      httpClientMock.get.withArgs('https://api.github.com/resource?page=2').resolves(response2);
      httpClientMock.get.withArgs('https://api.github.com/resource?page=3').resolves(response3);

      // Act
      const actualRepos = await sut.getOrganizationRepositories('foobar');

      // Assert
      expect(actualRepos).deep.eq(['repo1', 'repo2', 'repo3', 'repo4', 'repo5']);
      expect(httpClientMock.get).callCount(3);
    });

    it('should throw an error if http client rejected', () => {
      // Arrange
      const message = 'Oh noes, an error!';
      httpClientMock.get.rejects(new Error(message));

      return expect(sut.getOrganizationRepositories('something')).rejectedWith(message);
    });
  });

  describe('getCurrentUser', () => {

    it('should HTTP GET `/user` and forward the response', async () => {
      const response: Response<github.Login> = {
        body: githubFactory.login({ login: 'foobar' }),
        headers: {}
      };
      httpClientMock.get.resolves(response);
      const actual = await sut.getCurrentUser();
      expect(actual).eq(response.body);
      expect(httpClientMock.get).calledWith('https://api.github.com/user');
    });
  });

  describe('getMyOrganizations', () => {
    it('should HTTP GET `/user/orgs` and forward the response', async () => {
      const response: Response<github.Login[]> = {
        body: [githubFactory.login({ login: 'foobar.org' })],
        headers: {}
      };
      httpClientMock.get.resolves(response);
      const actual = await sut.getMyOrganizations();
      expect(actual).eq(response.body);
      expect(httpClientMock.get).calledWith('https://api.github.com/user/orgs');
    });
  });

  describe('getOrganizationRepositories', () => {
    it('should HTTP GET `/orgs/:org/repos?type=member` and forward the response', async () => {
      const response: Response<github.Repository[]> = {
        body: [githubFactory.repository()],
        headers: {}
      };
      httpClientMock.get.resolves(response);
      const actual = await sut.getOrganizationRepositories('foobar.org');
      expect(actual).eq(response.body);
      expect(httpClientMock.get).calledWith('https://api.github.com/orgs/foobar.org/repos?type=member');
    });
  });

  describe('getMyRepositories', () => {
    it('should HTTP GET `/user/repos?type=owner` and forward the response', async () => {
      const response: Response<github.Repository[]> = {
        body: [githubFactory.repository()],
        headers: {}
      };
      httpClientMock.get.resolves(response);
      const actual = await sut.getMyRepositories();
      expect(actual).eq(response.body);
      expect(httpClientMock.get).calledWith('https://api.github.com/user/repos?type=owner');
    });
  });

});
