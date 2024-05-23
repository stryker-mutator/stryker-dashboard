import { expect } from 'chai';
import { TableService, TableQuery } from 'azure-storage';
import TableServiceAsPromised from '../../../src/services/TableServiceAsPromised.js';
import sinon from 'sinon';

describe(TableServiceAsPromised.name, () => {
  let sut: TableServiceAsPromised;
  let tableServiceMock: sinon.SinonStubbedInstance<TableService>;

  beforeEach(() => {
    tableServiceMock = sinon.createStubInstance(TableService);
    sut = new TableServiceAsPromised(tableServiceMock as any);
  });

  describe('createTableIfNotExists', () => {
    it('should pass through the call to azure', async () => {
      const result = sut.createTableIfNotExists('someTable');
      tableServiceMock.createTableIfNotExists.callArg(1);
      await result;
      expect(result).instanceof(Promise);
      expect(tableServiceMock.createTableIfNotExists).calledWith('someTable');
      expect(tableServiceMock.createTableIfNotExists).calledOn(tableServiceMock);
    });
  });

  describe('insertOrMergeEntity', () => {
    it('should pass through the call to azure', async () => {
      const result = sut.insertOrMergeEntity('foobar', {
        foo: 'foo',
        bar: 'bar',
        enabled: true,
      });
      tableServiceMock.insertOrMergeEntity.callArg(2);
      await result;
      expect(result).instanceof(Promise);
      expect(tableServiceMock.insertOrMergeEntity).calledWith('foobar', {
        foo: 'foo',
        bar: 'bar',
        enabled: true,
      });
      expect(tableServiceMock.insertOrMergeEntity).calledOn(tableServiceMock);
    });
  });

  describe('queryEntities', () => {
    it('should pass through the call to azure', async () => {
      const expectedQuery = new TableQuery().where('a = 3');
      const result = sut.queryEntities('foobar', expectedQuery, undefined);
      tableServiceMock.queryEntities.callArgOn(3, sut, undefined, ['result ']);
      const actual = await result;
      expect(result).instanceof(Promise);
      expect(tableServiceMock.queryEntities).calledWith('foobar', expectedQuery);
      expect(tableServiceMock.queryEntities).calledOn(tableServiceMock);
      expect(actual).deep.eq(['result ']);
    });
  });
});
