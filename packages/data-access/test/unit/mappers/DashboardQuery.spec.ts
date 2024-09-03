import { DashboardQuery } from '../../../src/index.js';
import { expect } from 'chai';
import { FooModel } from './TableStorageMapper.spec.js';

describe(DashboardQuery.name, () => {
  it('should be able to construct an empty query', () => {
    expect(DashboardQuery.create(FooModel).build()).deep.eq({});
  });

  it('should be able to construct a PartitionKey query', () => {
    expect(DashboardQuery.create(FooModel).wherePartitionKeyEquals({ partitionId: 'bar' }).build()).deep.eq({
      filter: `PartitionKey eq 'bar'`,
    });
  });

  it('should escape PartitionKey values', () => {
    expect(DashboardQuery.create(FooModel).wherePartitionKeyEquals({ partitionId: 'foo/bar' }).build()).deep.eq({
      filter: `PartitionKey eq 'foo;bar'`,
    });
  });

  it('should be able to construct a RowKey not equals query', () => {
    expect(DashboardQuery.create(FooModel).whereRowKeyNotEquals({ rowId: 'foo' }).build()).deep.eq({
      filter: `RowKey ne 'foo'`,
    });
  });

  it('should escape RowKey values', () => {
    expect(DashboardQuery.create(FooModel).whereRowKeyNotEquals({ rowId: 'foo/bar' }).build()).deep.eq({
      filter: `RowKey ne 'foo;bar'`,
    });
  });

  it('should be able to construct a query with multiple where condition', () => {
    expect(
      DashboardQuery.create(FooModel)
        .wherePartitionKeyEquals({ partitionId: 'part' })
        .whereRowKeyNotEquals({ rowId: 'row' })
        .build(),
    ).deep.eq({ filter: `PartitionKey eq 'part' and RowKey ne 'row'` });
  });
});
