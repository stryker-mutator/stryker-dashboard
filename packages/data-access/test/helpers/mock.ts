import sinon = require('sinon');
import { Mapper } from '../../src';

export function createTableMapperMock<A, B extends keyof A, C extends keyof A>(): sinon.SinonStubbedInstance<Mapper<A, B, C>> {
  return {
    createStorageIfNotExists: sinon.stub(),
    findOne: sinon.stub(),
    insertOrMerge: sinon.stub(),
    findAll: sinon.stub(),
    replace: sinon.stub(),
    insert: sinon.stub()
  };
}
