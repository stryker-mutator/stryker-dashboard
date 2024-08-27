import * as github from '../../src/github/models.js';
import * as dal from '@stryker-mutator/dashboard-data-access';
import * as contract from '@stryker-mutator/dashboard-contract';

function factoryMethod<T>(defaultsFactory: () => T) {
  return (overrides?: Partial<T>) => Object.assign({}, defaultsFactory(), overrides);
}

const githubLogin = factoryMethod<github.Login>(() => ({
  avatar_url: 'https://github.com/foobar.jpg',
  login: 'foobar_login',
  url: 'https://github.com/users/foobar',
}));

export const githubFactory = {
  authentication: factoryMethod<github.Authentication>(() => ({
    accessToken: '23123415fdDSf',
    displayName: 'Foobar display',
    id: '23134',
    username: 'foobar',
  })),
  login: githubLogin,
  repository(overrides?: Partial<github.Repository>): github.Repository {
    return {
      description: 'foobar repository',
      full_name: 'Foo Bar Name',
      id: 42,
      name: 'foobar',
      owner: githubLogin(),
      permissions: {
        admin: false,
        pull: false,
        push: false,
      },
      url: 'https://github.com/foo/foobar',
      default_branch: 'master',
      ...overrides,
    };
  },
};

export const contractFactory = {
  login: factoryMethod<contract.Login>(() => ({
    avatarUrl: 'foobar avatarUrl',
    name: 'foobar name',
  })),
  repository: factoryMethod<contract.Repository>(() => ({
    enabled: true,
    name: 'name',
    origin: 'github',
    owner: 'organization',
    slug: 'github.com/organization/name',
    defaultBranch: 'master',
  })),
};

export const dalFactory = {
  repository: factoryMethod<dal.Project>(() => ({
    apiKeyHash: '1sad2ejW*Y2913',
    enabled: true,
    name: 'foobar name',
    owner: 'foobar owner',
  })),
};
