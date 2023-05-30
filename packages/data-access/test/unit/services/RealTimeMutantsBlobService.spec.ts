import sinon from 'sinon';
import { BlobServiceAsPromised } from '../../../src/services/BlobServiceAsPromised.js';
import { expect } from 'chai';
import { RealTimeMutantsBlobService } from '../../../src/services/RealTimeMutantsBlobService.js';
import { MutantStatus } from 'mutation-testing-report-schema/api';
import { ReportIdentifier } from '@stryker-mutator/dashboard-common';

describe(RealTimeMutantsBlobService.name, () => {
  const id: ReportIdentifier = {
    projectName: 'abc',
    version: 'main',
    moduleName: undefined,
    realTime: true,
  };

  let blobMock: sinon.SinonStubbedInstance<BlobServiceAsPromised>;
  let sut: RealTimeMutantsBlobService;

  beforeEach(() => {
    blobMock = {
      blobToText: sinon.stub(),
      createBlockBlobFromText: sinon.stub(),
      createContainerIfNotExists: sinon.stub(),
      createAppendBlobFromText: sinon.stub(),
      appendBlockFromText: sinon.stub(),
      deleteBlobIfExists: sinon.stub(),
    };
    sut = new RealTimeMutantsBlobService(blobMock);
  });

  describe('createStorageIfNotExists', () => {
    it('should create a container', async () => {
      await sut.createStorageIfNotExists();

      expect(blobMock.createContainerIfNotExists.calledOnce).to.be.true;
      expect(blobMock.createContainerIfNotExists).calledWith(
        'mutants-tested-batch',
        {}
      );
    });
  });

  describe('createBlob', () => {
    it('should create an append blob', async () => {
      await sut.createBlob(id);

      expect(blobMock.createAppendBlobFromText.calledOnce).to.be.true;
      expect(blobMock.createAppendBlobFromText).calledWith(
        'mutants-tested-batch',
        'abc;main;real-time',
        ''
      );
    });
  });

  describe('appendToblob', () => {
    it('should append to the append block correctly', async () => {
      const mutants = [
        { id: '1', status: MutantStatus.Killed },
        { id: '2', status: MutantStatus.Survived },
      ];
      await sut.appendToBlob(id, mutants);

      expect(blobMock.appendBlockFromText.calledOnce).to.be.true;
      expect(blobMock.appendBlockFromText).calledWith(
        'mutants-tested-batch',
        'abc;main;real-time',
        '{"id":"1","status":"Killed"}\n{"id":"2","status":"Survived"}\n'
      );
    });
  });

  describe('getEvents', () => {
    it('should get the events correctly', async () => {
      blobMock.blobToText.returns(
        Promise.resolve(
          '{"id":"1","status":"Killed"}\n{"id":"2","status":"Survived"}\n'
        )
      );

      const events = await sut.getEvents(id);
      expect(events.length).to.eq(2);
      expect(events[0]).to.deep.include({
        id: '1',
        status: MutantStatus.Killed,
      });
      expect(events[1]).to.deep.include({
        id: '2',
        status: MutantStatus.Survived,
      });
    });

    it('should return an empty array if the blob is empty', async () => {
      blobMock.blobToText.returns(Promise.resolve(''));

      const events = await sut.getEvents(id);
      expect(events.length).to.eq(0);
    });
  });

  describe('delete', () => {
    it('should delete the blob', () => {
      const identifier = {
        moduleName: 'core',
        projectName: 'project',
        version: 'version',
      };

      sut.delete(identifier);

      expect(blobMock.deleteBlobIfExists.calledOnce).to.be.true;
      expect(blobMock.deleteBlobIfExists).calledWith(
        'mutants-tested-batch',
        'project;version;core'
      );
    });
  });
});
