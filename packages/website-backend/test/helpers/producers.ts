import * as github from '../../src/github/models';
import * as dal from 'stryker-dashboard-data-access';
import * as contract from 'stryker-dashboard-website-contract';

function factoryMethod<T>(defaultsFactory: () => T) {
    return (overrides?: Partial<T>) => Object.assign({}, defaultsFactory(), overrides);
}

const githubLogin = factoryMethod<github.Login>(() => ({
    login: 'foobar_login',
    avatar_url: 'https://github.com/foobar.jpg',
    url: 'https://github.com/users/foobar'
}));

export const githubFactory = {
    authentication: factoryMethod<github.Authentication>(() => ({
        accessToken: '23123415fdDSf',
        displayName: 'Foobar display',
        id: 23134,
        username: 'foobar'
    })),
    login: githubLogin,
    repository: factoryMethod<github.Repository>(() => ({
        id: 42,
        description: 'foobar repository',
        full_name: 'Foo Bar Name',
        name: 'foobar',
        owner: githubLogin(),
        url: 'https://github.com/foo/foobar'
    }))
}

export const contractFactory = {
    repository: factoryMethod<contract.Repository>(() => ({
        slug: 'github.com/organization/name',
        owner: 'organization',
        name: 'name',
        enabled: true
    })),
    login: factoryMethod<contract.Login>(() => ({
        name: 'foobar name',
        avatarUrl: 'foobar avatarUrl'
    }))
};

export const dalFactory = {
    repository: factoryMethod<dal.Project>(() => ({
        owner: 'foobar owner',
        apiKeyHash: '1sad2ejW*Y2913',
        enabled: true,
        name: 'foobar name'
    }))
};