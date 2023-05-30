import sinon from 'sinon';
import { MutationTestingResultMapper } from '../../../src/mappers/MutationTestingResultMapper.js';
import { BlobServiceAsPromised } from '../../../src/services/BlobServiceAsPromised.js';
import { expect } from 'chai';
import { createMutationTestResult } from '../../helpers/mock.js';
import { StorageError } from '../../helpers/StorageError.js';
import { OptimisticConcurrencyError } from '../../../src/index.js';
import { Constants } from 'azure-storage';

describe(MutationTestingResultMapper.name, () => {
  let sut: MutationTestingResultMapper;
  let blobMock: sinon.SinonStubbedInstance<BlobServiceAsPromised>;

  beforeEach(() => {
    blobMock = {
      blobToText: sinon.stub(),
      createBlockBlobFromText: sinon.stub(),
      createContainerIfNotExists: sinon.stub(),
      createAppendBlobFromText: sinon.stub(),
      appendBlockFromText: sinon.stub(),
      deleteBlobIfExists: sinon.stub(),
    };
    sut = new MutationTestingResultMapper(blobMock);
  });

  it('should create container when createStorageIfNotExists is called', async () => {
    await sut.createStorageIfNotExists();
    expect(blobMock.createContainerIfNotExists).called;
  });

  describe('insertOrReplace', () => {
    it('should create the blob from text using application/json content type', async () => {
      const result = createMutationTestResult();
      await sut.insertOrReplace(
        { moduleName: 'core', projectName: 'project', version: 'version' },
        result
      );
      expect(blobMock.createBlockBlobFromText).calledWith(
        'mutation-testing-report',
        'project;version;core',
        JSON.stringify(result),
        {
          contentSettings: {
            contentType: 'application/json',
            contentEncoding: 'utf8',
          },
        }
      );
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
        result
      );
      expect(blobMock.createBlockBlobFromText).calledWith(
        'mutation-testing-report',
        'project;version;core;real-time',
        JSON.stringify(result),
        {
          contentSettings: {
            contentType: 'application/json',
            contentEncoding: 'utf8',
          },
        }
      );
    });

    it('should throw OptimisticConcurrencyError "BlobHasBeenModified" is thrown', async () => {
      blobMock.createBlockBlobFromText.rejects(
        new StorageError('BlobHasBeenModified')
      );
      await expect(
        sut.insertOrReplace(
          { moduleName: 'core', projectName: 'project', version: 'version' },
          null
        )
      ).rejectedWith(OptimisticConcurrencyError);
    });
  });

  describe('findOne', () => {
    it('should return the result', async () => {
      const expected = createMutationTestResult();
      blobMock.blobToText.resolves(JSON.stringify(expected));
      const actual = await sut.findOne({
        moduleName: 'core',
        projectName: 'project',
        version: 'version',
      });
      expect(blobMock.blobToText).calledWith(
        'mutation-testing-report',
        'project;version;core'
      );
      expect(actual).deep.eq(expected);
    });

    it('should return null when "BlobNotFound" is thrown', async () => {
      blobMock.blobToText.rejects(
        new StorageError(Constants.BlobErrorCodeStrings.BLOB_NOT_FOUND)
      );
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

      expect(blobMock.deleteBlobIfExists.calledOnce).to.be.true;
      expect(blobMock.deleteBlobIfExists).calledWith(
        'mutation-testing-report',
        'project;version;core'
      );
    });
  });
});
