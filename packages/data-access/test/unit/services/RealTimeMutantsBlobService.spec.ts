import { AppendBlobClient, BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import type { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { expect } from 'chai';
import type { MutantResult } from 'mutation-testing-report-schema/api';
import sinon from 'sinon';

import { RealTimeMutantsBlobService } from '../../../src/services/RealTimeMutantsBlobService.js';

describe(RealTimeMutantsBlobService.name, () => {
  const id: ReportIdentifier = {
    projectName: 'abc',
    version: 'main',
    moduleName: undefined,
    realTime: true,
  };

  let containerClient: sinon.SinonStubbedInstance<ContainerClient>;
  let appendClient: sinon.SinonStubbedInstance<AppendBlobClient>;
  let sut: RealTimeMutantsBlobService;

  beforeEach(() => {
    const blobServiceClientStub = sinon.createStubInstance(BlobServiceClient);
    containerClient = sinon.createStubInstance(ContainerClient);
    appendClient = sinon.createStubInstance(AppendBlobClient);

    blobServiceClientStub.getContainerClient.returns(containerClient);
    containerClient.getAppendBlobClient.returns(appendClient);

    sut = new RealTimeMutantsBlobService(blobServiceClientStub);
    sinon.assert.calledWith(blobServiceClientStub.getContainerClient, 'real-time-mutant-results');
  });

  describe('createStorageIfNotExists', () => {
    it('should create a container', async () => {
      await sut.createStorageIfNotExists();

      expect(containerClient.createIfNotExists.calledOnce).to.be.true;
      sinon.assert.calledWith(containerClient.createIfNotExists, {});
    });
  });

  describe('createReport', () => {
    it('should create an append blob', async () => {
      await sut.createReport(id);

      sinon.assert.calledOnceWithExactly(containerClient.getAppendBlobClient, 'abc;main;real-time');
      sinon.assert.called(appendClient.create);
    });
  });

  describe('appendToReport', () => {
    it('should append to the append block correctly', async () => {
      const mutants: Partial<MutantResult>[] = [
        { id: '1', status: 'Killed' },
        { id: '2', status: 'Survived' },
      ];
      await sut.appendToReport(id, mutants);

      sinon.assert.calledWith(containerClient.getAppendBlobClient, 'abc;main;real-time');
      sinon.assert.calledWith(
        appendClient.appendBlock,
        '{"id":"1","status":"Killed"}\n{"id":"2","status":"Survived"}\n',
      );
    });
  });

  describe('getReport', () => {
    it('should get the events correctly', async () => {
      appendClient.downloadToBuffer.resolves(
        Buffer.from('{"id":"1","status":"Killed"}\n{"id":"2","status":"Survived"}\n', 'utf-8'),
      );

      const events = await sut.getReport(id);

      sinon.assert.calledWith(containerClient.getAppendBlobClient, 'abc;main;real-time');
      expect(events.length).to.eq(2);
      expect(events[0]).to.deep.include({
        id: '1',
        status: 'Killed',
      });
      expect(events[1]).to.deep.include({
        id: '2',
        status: 'Survived',
      });
    });

    it('should return an empty array if the blob is empty', async () => {
      appendClient.downloadToBuffer.resolves(Buffer.from('', 'utf-8'));

      const events = await sut.getReport(id);
      expect(events.length).to.eq(0);
    });
  });

  describe('delete', () => {
    it('should delete the blob', async () => {
      const identifier = {
        moduleName: 'core',
        projectName: 'project',
        version: 'version',
      };

      await sut.delete(identifier);

      sinon.assert.calledWith(containerClient.getAppendBlobClient, 'project;version;core');
      expect(appendClient.deleteIfExists.calledOnce).to.be.true;
    });
  });
});
