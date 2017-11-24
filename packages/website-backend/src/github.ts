import * as request from 'request-promise-native';
import * as debug from 'debug';

import { Repository, User } from './model'

const log = debug('GitHub API');
const map = (input: any[]): Repository[] => {
    return input.map((item) => ({ id: item.id, fullName: item.full_name }));
}

const nextLinkTest = /<(.*?)>; rel="next"/;

const get = (accessToken: string, url: string): Promise<request.FullResponse> => {
    const options = {
        headers: {
            'Authorization': `token ${accessToken}`,
            'User-Agent': 'Stryker Badge API',
        },
        url,
    };
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
    const processResponse = async (response: request.FullResponse): Promise<Repository[]> => {
        const result = map(JSON.parse(response.body));

        // Status: 200 OK
        // Link: <https://api.github.com/resource?page=2>; rel="next",
        //       <https://api.github.com/resource?page=5>; rel="last"
        const link = (response.headers['link'] as string);
        const nextLink = nextLinkTest.exec(link);
        if (nextLink) {
            log(`Retrieving next page of GitHub repositories for user '${username}'`);
            const nextBatch = await get(accessToken, nextLink[1]).then(processResponse);
            return Promise.resolve([ ...result, ...nextBatch ]);
        } else {
            return Promise.resolve(result);
        }
    };
    
    return get(accessToken, 'https://api.github.com/user/repos').then(processResponse);
};
