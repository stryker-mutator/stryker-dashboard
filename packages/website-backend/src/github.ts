import * as debug from 'debug';
import { request } from './utils';
import { Repository, User } from './model'
import { FullResponse } from 'request-promise-native';

const log = debug('GitHub API');
const map = (input: any[]): Repository[] => {
    return input.map((item) => ({ id: item.id, fullName: item.full_name }));
}

const nextLinkTest = /<(.*?)>; rel="next"/;

const get = (accessToken: string, url: string): Promise<FullResponse> => {
    const options = {
        headers: {
            'Authorization': `token ${accessToken}`,
            'User-Agent': 'Stryker Badge API',
        },
        url,
    };
    log(`Performing HTTP GET "${url}" for ${accessToken}`);
    // Don't use return request(...) directly, as it returns a string
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(response)
            }
        });
    });
}

export const retrieveRepositories = (user: User): Promise<Repository[]> => {
    const { accessToken, username } = user;

    log(`Retrieving first page of GitHub repositories for user '${username}'`);
    const processResponse = (response: FullResponse): Promise<Repository[]> => {
        log(`Response: ${typeof response} ${response}`);
        const result = map(JSON.parse(response.body));

        // Status: 200 OK
        // Link: <https://api.github.com/resource?page=2>; rel="next",
        //       <https://api.github.com/resource?page=5>; rel="last"
        const link = (response.headers['link'] as string);
        const nextLink = nextLinkTest.exec(link);
        if (nextLink) {
            log(`Retrieving next page of GitHub repositories for user '${username}'`);
            return get(accessToken, nextLink[1])
                .then(processResponse)
                .then(nextBatch => [...result, ...nextBatch]);
        } else {
            return Promise.resolve(result);
        }
    };

    return get(accessToken, 'https://api.github.com/user/repos')
        .then(processResponse);
};
