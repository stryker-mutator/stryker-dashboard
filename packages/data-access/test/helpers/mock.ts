import sinon from 'sinon';
import { Mapper } from '../../src/index.js';
import {
  MutantStatus,
  FileResultDictionary,
  MutationTestResult,
  FileResult,
} from 'mutation-testing-report-schema/api';

export function createTableMapperMock<
  A,
  B extends keyof A,
  C extends keyof A
>(): sinon.SinonStubbedInstance<Mapper<A, B, C>> {
  return {
    createStorageIfNotExists: sinon.stub(),
    findOne: sinon.stub(),
    insertOrMerge: sinon.stub(),
    findAll: sinon.stub(),
    replace: sinon.stub(),
    insert: sinon.stub(),
  };
}

export function createMutationTestResult(
  files: FileResultDictionary = createFileResultDictionary(createFileResult())
): MutationTestResult {
  return {
    files,
    schemaVersion: '1',
    thresholds: {
      high: 80,
      low: 70,
    },
  };
}

export function createFileResult(
  mutantStates = [MutantStatus.Killed, MutantStatus.Survived]
): FileResult {
  return {
    language: 'javascript',
    source: '+',
    mutants: mutantStates.map((status, index) => ({
      id: index.toString(),
      location: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } },
      mutatorName: 'BinaryMutator',
      replacement: '-',
      status,
    })),
  };
}

export function createFileResultDictionary(fileResult: FileResult) {
  return {
    'a.js': fileResult,
  };
}
