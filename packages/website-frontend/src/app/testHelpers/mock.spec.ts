import { Repository } from '@stryker-mutator/dashboard-contract';

interface Constructor<T extends Object> {
  prototype: T;
  name: string;
}

export type JasmineMock<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] & jasmine.Spy : T[K];
} & T;

export function mock<T extends Object>(Clazz: Constructor<T>): JasmineMock<T> {
  const methods = Object.getOwnPropertyNames(Clazz.prototype).filter(
    (method) => method !== 'constructor'
  );
  return jasmine.createSpyObj(Clazz.name, methods);
}

export function createRepository(overrides?: Partial<Repository>): Repository {
  return {
    enabled: true,
    name: 'repo1',
    origin: 'http://github.com/repo1',
    owner: 'owner1',
    slug: 'owner1/repo1',
    defaultBranch: 'master',
    ...overrides,
  };
}
