import { retrieveRepositories } from '../../src/github';
import * as utils from '../../src/utils';
import { expect } from 'chai';

describe('retrieveRepositories()', () => {

    const user = Object.freeze({ accessToken: 'fbz', displayName: 'Foo', id: 42, username: 'foo' });
    let requestStub: sinon.SinonStub;

    beforeEach(() => {
        requestStub = sandbox.stub(utils, 'request');
    });

    it('should GET https://api.github.com/user/repos', async () => {
        // Act
        const retrieveRepos = retrieveRepositories(user);
        requestStub.callArgOnWith(1, undefined, undefined, { body: '[]', headers: {} });
        await retrieveRepos;

        // Arrange
        expect(requestStub).calledWithMatch({ url: 'https://api.github.com/user/repos' });
    });

    it('should add an Authorization header', async () => {
        // Act
        const retrieveRepos = retrieveRepositories(user);
        requestStub.callArgOnWith(1, undefined, undefined, { body: '[]', headers: {} });
        await retrieveRepos;

        // Arrange
        expect(requestStub).calledWithMatch({ headers: { Authorization: `token ${user.accessToken}` } });
    });

    it('should add an User-Agent header', async () => {
        // See https://developer.github.com/v3/#user-agent-required

        // Act
        const retrieveRepos = retrieveRepositories(user);
        requestStub.callArgOnWith(1, undefined, undefined, { body: '[]', headers: {} });
        await retrieveRepos;

        // Arrange
        expect(requestStub).calledWithMatch({ headers: { ['User-Agent']: 'Stryker Badge API' } });
    });

    it('should return the response body from GitHub', async () => {
        // Arrange
        const retrieveRepos = retrieveRepositories(user);
        requestStub.callArgOnWith(1, undefined, undefined, {
            body: JSON.stringify([
                { id: 1296269, full_name: 'octocat/Hello-World', },
                { id: 1296270, full_name: 'octocat/Hello-Universe', }
            ]), headers: {}
        });
        // Act
        const result = await retrieveRepos;

        // Arrange
        expect(result).deep.eq([
            { id: 1296269, fullName: 'octocat/Hello-World', },
            { id: 1296270, fullName: 'octocat/Hello-Universe', }
        ]);
    });

    describe('when the request failed', () => {
        it('should throw an error', () => {
            // Arrange
            const message = 'Oh noes, an error!';
            requestStub.throws(new Error(message));

            return expect(retrieveRepositories(user)).rejectedWith(message);
        });
    });

    describe('when a next page of results is available', () => {
        beforeEach(() => {
            const page1 = [{ id: 1296269, full_name: 'octocat/Hello-World', }];
            const page2 = [{ id: 1296270, full_name: 'octocat/Hello-Universe', }];
            requestStub.callsFake((options, callback) => {
                if (options.url.indexOf('page') === -1) {
                    const link = '<https://api.github.com/user/repos?page=2>; rel="next", ' +
                        '<https://api.github.com/user/repos?page=2>; rel="last"';
                    callback(undefined, { body: JSON.stringify(page1), headers: { link } });
                } else {
                    callback(undefined, { body: JSON.stringify(page2), headers: {} });
                }
            });
        });

        it('should fetch the next page', async () => {
            // Act
            await retrieveRepositories(user);

            // Arrange
            expect(requestStub).calledWithMatch({ url: 'https://api.github.com/user/repos' });
            expect(requestStub).calledWithMatch({ url: 'https://api.github.com/user/repos?page=2' });
        });

        it('should return combined results', async () => {
            // Act
            const result = await retrieveRepositories(user);

            // Arrange
            expect(result).deep.eq([
                { id: 1296269, fullName: 'octocat/Hello-World', },
                { id: 1296270, fullName: 'octocat/Hello-Universe', }
            ]);
        });
    });

});