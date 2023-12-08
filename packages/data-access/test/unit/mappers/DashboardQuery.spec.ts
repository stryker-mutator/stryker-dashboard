import { DashboardQuery } from '../../../src/index.js';
import { expect } from 'chai';
import { FooModel } from './TableStorageMapper.spec.js';
import { TableQuery } from 'azure-storage';

describe.only(DashboardQuery.name, () => {
  it('should be able to construct an empty query', () => {
    expect(DashboardQuery.create(FooModel).build()).eq('');
  });

  it('should be able to construct a PartitionKey query', () => {
    expect(
      DashboardQuery.create(FooModel)
        .wherePartitionKeyEquals({ partitionId: 'bar' })
        .build()
    ).eq('PartitionKey eq \'bar\'');
  });

  it('should escape PartitionKey values', () => {
    expect(
      DashboardQuery.create(FooModel)
        .wherePartitionKeyEquals({ partitionId: 'foo/bar' })
        .build()
    ).eq('PartitionKey eq \'foo;bar\'');
  });

  it('should be able to construct a RowKey not equals query', () => {
    expect(
      DashboardQuery.create(FooModel)
        .whereRowKeyNotEquals({ rowId: 'foo' })
        .build()
    ).eq('not(RowKey eq \'foo\')');
  });

  it('should escape RowKey values', () => {
    expect(
      DashboardQuery.create(FooModel)
        .whereRowKeyNotEquals({ rowId: 'foo/bar' })
        .build()
    ).eq('not(RowKey eq \'foo;bar\')');
  });

  it('should be able to construct a query with multiple where condition', () => {
    expect(
      DashboardQuery.create(FooModel)
        .wherePartitionKeyEquals({ partitionId: 'part' })
        .whereRowKeyNotEquals({ rowId: 'row' })
        .build()
    ).eq('PartitionKey eq \'part\' and not(RowKey eq \'row\')');
  });
});
