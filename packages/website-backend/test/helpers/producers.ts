import { Repository, Login, Authentication } from '../../src/github/models';
import { Project as ProjectEntity } from 'stryker-dashboard-data-access';


function factoryMethod<T>(defaultsFactory: () => T) {
    return (overrides?: Partial<T>) => Object.assign({}, defaultsFactory(), overrides);
}

export const authentication = factoryMethod<Authentication>(() => ({
    accessToken: '23123415fdDSf',
    displayName: 'Foobar display',
    id: 23134,
    username: 'foobar'
}));

export const login = factoryMethod<Login>(() => ({
    login: 'foobar_login',
    avatar_url: 'https://github.com/foobar.jpg',
    url: 'https://github.com/users/foobar'
}));

export const repository = factoryMethod<Repository>(() => ({
    id: 42,
    description: 'foobar repository',
    full_name: 'Foo Bar Name',
    name: 'foobar',
    owner: login(),
    url: 'https://github.com/foo/foobar'
}));

export const projectEntity = factoryMethod<ProjectEntity>(() => ({
    owner: 'foobar owner',
    apiKeyHash: '1sad2ejW*Y2913',
    enabled: true,
    name: 'foobar name'
}));