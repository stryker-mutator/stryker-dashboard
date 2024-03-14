import { Project } from '../../../src/index.js';
import { expect } from 'chai';

describe(Project.name, () => {
  it('should retrieve the `name` when `createRowKey` is called', () => {
    expect(
      Project.createRowKey({
        name: 'fooName',
      }),
    ).eq('fooName');
  });

  it('should retrieve the `owner` when `createPartitionKey` is called', () => {
    expect(
      Project.createPartitionKey({
        owner: 'ownerBar',
      }),
    ).eq('ownerBar');
  });

  it('should set the name and owner when `identify` is called', () => {
    const entity: Partial<Project> = {};
    Project.identify(entity, 'github.com/stryker-mutator', 'stryker');
    expect(entity.owner).eq('github.com/stryker-mutator');
    expect(entity.name).eq('stryker');
  });

  it('should map correct persisted fields', () => {
    expect(Project.persistedFields).deep.eq(['enabled', 'apiKeyHash']);
  });

  it('should have tableName "Project"', () => {
    expect(Project.tableName).eq('Project');
  });
});
