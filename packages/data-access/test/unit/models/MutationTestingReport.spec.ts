import { MutationTestingReport } from '../../../src/index.js';
import { expect } from 'chai';

describe(MutationTestingReport.name, () => {
  it('should retrieve the `moduleName` when `createRowKey` is called', () => {
    expect(
      MutationTestingReport.createRowKey({
        moduleName: 'fooModule',
      }),
    ).eq('fooModule');
  });

  it('should retrieve the `repositorySlug`/`version` when `createPartitionKey` is called', () => {
    expect(
      MutationTestingReport.createPartitionKey({
        version: 'fooVersion',
        projectName: 'barSlug',
      }),
    ).eq('barSlug/fooVersion');
  });

  it('should set the repositorySlug, version and module when `identify` is called', () => {
    const entity: Partial<MutationTestingReport> = {};
    MutationTestingReport.identify(entity, 'foo/partition/key', 'moduleBar');
    expect(entity.moduleName).eq('moduleBar');
    expect(entity.projectName).eq('foo/partition');
    expect(entity.version).eq('key');
  });

  it('should map correct persisted fields', () => {
    expect(MutationTestingReport.persistedFields).deep.eq(['mutationScore']);
  });

  it('should have tableName "MutationTestingReport"', () => {
    expect(MutationTestingReport.tableName).eq('MutationTestingReport');
  });
});
