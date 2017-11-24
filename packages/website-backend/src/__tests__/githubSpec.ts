const request = jest.fn((options, callback) => callback(undefined, { body: '[]', headers: {} }) );
jest.mock('request-promise-native', () => ( request ));

import { retrieveRepositories } from '../github';

describe('retrieveRepositories()', () => {
    const user = { accessToken: 'fbz', displayName: 'Foo', id: 42, username: 'foo' };
    const body = JSON.stringify([
        { id: 1296269, full_name: 'octocat/Hello-World', },
        { id: 1296270, full_name: 'octocat/Hello-Universe', }
    ]);

    afterEach(() => {
        request.mockClear();
    });

    it('should GET https://api.github.com/user/repos', async () => {
        // Act
        await retrieveRepositories(user);

        // Arrange
        expect(request.mock.calls[0][0].url).toBe('https://api.github.com/user/repos');
    });
    
    it('should add an Authorization header', async () => {
        // Act
        await retrieveRepositories(user);

        // Arrange
        expect(request.mock.calls[0][0].headers['Authorization']).toBe(`token ${user.accessToken}`);
    });

    it('should add an User-Agent header', async () => {
        // See https://developer.github.com/v3/#user-agent-required
        
        // Act
        await retrieveRepositories(user);
        
        // Arrange
        expect(request.mock.calls[0][0].headers['User-Agent']).toBeDefined();
    });
    
    it('should return the response body from GitHub', async () => {
        // Arrange
        request.mockImplementation((options, callback) => callback(undefined, { body, headers: {} }) );

        // Act
        const result = await retrieveRepositories(user);

        // Arrange
        expect(result).toEqual([
            { id: 1296269, fullName: 'octocat/Hello-World', },
            { id: 1296270, fullName: 'octocat/Hello-Universe', }
        ]);
    });

    describe('when the request failed', () => {
        it('should throw an error', async () => {
            // Arrange
            const message = 'Oh noes, an error!';
            request.mockImplementation((options, callback) => callback(new Error(message), undefined) );

            // Act
            await expect(retrieveRepositories(user)).rejects.toEqual(new Error(message));
        });
    });
    
    describe('when a next page of results is available', () => {
        beforeEach(() => {
            const page1 = [ { id: 1296269, full_name: 'octocat/Hello-World', } ];
            const page2 = [ { id: 1296270, full_name: 'octocat/Hello-Universe', } ];
            request.mockImplementation((options, callback) => {
                if (options.url.indexOf('page') === -1) {
                    const link = '<https://api.github.com/user/repos?page=2>; rel="next", ' +
                                 '<https://api.github.com/user/repos?page=2>; rel="last"';
                    callback(undefined, { body: JSON.stringify(page1), headers: { link } });
                } else {
                    callback(undefined, { body: JSON.stringify(page2), headers: { } });
                }
            });
        });

        it('should fetch the next page', async () => {
            // Act
            const result = await retrieveRepositories(user);
    
            // Arrange
            expect(request.mock.calls[0][0].url).toBe('https://api.github.com/user/repos');
            expect(request.mock.calls[1][0].url).toBe('https://api.github.com/user/repos?page=2');
        });

        it('should return combined results', async () => {
            // Act
            const result = await retrieveRepositories(user);
    
            // Arrange
            expect(result).toEqual([
                { id: 1296269, fullName: 'octocat/Hello-World', },
                { id: 1296270, fullName: 'octocat/Hello-Universe', }
            ]);
        });
    });

});