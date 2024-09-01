import sinon from 'sinon';
import { MutationTestingResultMapper } from '../../../src/mappers/MutationTestingResultMapper.js';
import { expect } from 'chai';
import { createMutationTestResult } from '../../helpers/mock.js';
import { StorageError } from '../../helpers/StorageError.js';
import { OptimisticConcurrencyError } from '../../../src/index.js';
import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';

describe(MutationTestingResultMapper.name, () => {
  let sut: MutationTestingResultMapper;
  let blobServiceMock: sinon.SinonStubbedInstance<BlobServiceClient>;
  let containerMock: sinon.SinonStubbedInstance<ContainerClient>;
  let blockBlobClient: sinon.SinonStubbedInstance<BlockBlobClient>;

  beforeEach(() => {
    blobServiceMock = sinon.createStubInstance(BlobServiceClient);
    containerMock = sinon.createStubInstance(ContainerClient);
    blockBlobClient = sinon.createStubInstance(BlockBlobClient);
    blobServiceMock.getContainerClient.returns(containerMock);
    containerMock.getBlockBlobClient.returns(blockBlobClient);
    sut = new MutationTestingResultMapper(blobServiceMock);
  });

  it('should create container when createStorageIfNotExists is called', async () => {
    await sut.createStorageIfNotExists();
    sinon.assert.called(containerMock.createIfNotExists);
  });

  describe('insertOrReplace', () => {
    it('should create the blob from text using application/json content type', async () => {
      const result = createMutationTestResult();
      await sut.insertOrReplace({ moduleName: 'core', projectName: 'project', version: 'version' }, result);
      sinon.assert.calledWith(containerMock.getBlockBlobClient, 'project;version;core');
      sinon.assert.calledWith(blockBlobClient.uploadData, Buffer.from(JSON.stringify(result), 'utf-8'), {
        blobHTTPHeaders: {
          blobContentType: 'application/json',
          blobContentEncoding: 'utf8',
        },
      });
    });

    it('should encode real-time when given as option', async () => {
      const result = createMutationTestResult();
      await sut.insertOrReplace(
        {
          moduleName: 'core',
          projectName: 'project',
          version: 'version',
          realTime: true,
        },
        result,
      );
      sinon.assert.calledWith(containerMock.getBlockBlobClient, 'project;version;core;real-time');
      sinon.assert.calledWith(blockBlobClient.uploadData, Buffer.from(JSON.stringify(result), 'utf-8'), {
        blobHTTPHeaders: {
          blobContentType: 'application/json',
          blobContentEncoding: 'utf8',
        },
      });
    });

    it('should throw OptimisticConcurrencyError "BlobHasBeenModified" is thrown', async () => {
      blockBlobClient.uploadData.rejects(new StorageError('BlobHasBeenModified'));

      await expect(
        sut.insertOrReplace({ moduleName: 'core', projectName: 'project', version: 'version' }, null),
      ).rejectedWith(OptimisticConcurrencyError);
    });
  });

  describe('findOne', () => {
    it('should return the result', async () => {
      const expected = createMutationTestResult();
      const buffer = Buffer.from(JSON.stringify(expected), 'utf-8');
      blockBlobClient.downloadToBuffer.resolves(buffer);
      const actual = await sut.findOne({
        moduleName: 'core',
        projectName: 'project',
        version: 'version',
      });
      sinon.assert.calledWith(containerMock.getBlockBlobClient, 'project;version;core');
      expect(actual).deep.eq(expected);
    });

    it('should return null when "BlobNotFound" is thrown', async () => {
      blockBlobClient.downloadToBuffer.rejects(new StorageError('BlobNotFound'));
      const actual = await sut.findOne({
        moduleName: 'core',
        projectName: 'project',
        version: 'version',
      });
      expect(actual).null;
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

      sinon.assert.calledWith(containerMock.getBlockBlobClient, 'project;version;core');
      sinon.assert.calledOnce(blockBlobClient.deleteIfExists);
    });
  });
});
