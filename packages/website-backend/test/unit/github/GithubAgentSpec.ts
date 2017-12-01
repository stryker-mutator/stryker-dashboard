import { expect } from 'chai';
import GithubAgent from '../../../src/github/GithubAgent';
import HttpClient, { Response } from '../../../src/client/HttpClient';
import { Mock, createMock } from '../../helpers/mock';

describe('GithubClient', () => {
    let httpClientMock: Mock<HttpClient>;
    let sut: GithubAgent;

    beforeEach(() => {
        httpClientMock = createMock(HttpClient);
        sut = new GithubAgent(httpClientMock as any);
    });

    describe('retrieveRepositories', () => {

        it('should GET `/users/foobar/repos` and return a plain response', async () => {
            // Arrange
            const expectedResponse: Response<string[]> = { body: ['repo1', 'repo2'], headers: {} };
            httpClientMock.get.resolves(expectedResponse);

            // Act
            const actualRepos = await sut.retrieveRepositories('foobar');

            // Assert
            expect(actualRepos).eq(expectedResponse.body);
            expect(httpClientMock.get).calledWith('https://api.github.com/users/foobar/repos');
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
            httpClientMock.get.withArgs('https://api.github.com/users/foobar/repos').resolves(response1);
            httpClientMock.get.withArgs('https://api.github.com/resource?page=2').resolves(response2);
            httpClientMock.get.withArgs('https://api.github.com/resource?page=3').resolves(response3);

            // Act
            const actualRepos = await sut.retrieveRepositories('foobar');

            // Assert
            expect(actualRepos).deep.eq(['repo1', 'repo2', 'repo3', 'repo4', 'repo5']);
            expect(httpClientMock.get).callCount(3);
        });
    });

    describe('when the request failed', () => {
        it('should throw an error', () => {
            // Arrange
            const message = 'Oh noes, an error!';
            httpClientMock.get.rejects(new Error(message));

            return expect(sut.retrieveRepositories('something')).rejectedWith(message);
        });
    });

});