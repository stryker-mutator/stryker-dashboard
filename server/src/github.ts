import * as request from 'request-promise-native';

import { Repository, User } from './model'

const map = (input: any[]): Repository[] => {
    return input.map((item) => ({ id: item.id, fullName: item.full_name }));
}

export const retrieveRepositories = (user: User): Promise<Repository[]> => {
    const { accessToken } = user;
    const options = {
        headers: {
            'Authorization': `token ${accessToken}`,
            'User-Agent': 'Stryker Badge API',
        },
        url: 'https://api.github.com/user/repos',
    };
    return request(options).then(JSON.parse).then(map)
};
