import { expect } from 'chai';
import { BlobService } from 'azure-storage';
import { BlobServiceAsPromised } from '../../../src/services/BlobServiceAsPromised.js';
import sinon from 'sinon';

describe(BlobServiceAsPromised.name, () => {
  let sut: BlobServiceAsPromised;
  let blobServiceMock: sinon.SinonStubbedInstance<BlobService>;

  beforeEach(() => {
    blobServiceMock = sinon.createStubInstance(BlobService);
    sut = new BlobServiceAsPromised(blobServiceMock as any);
  });

  describe('createTableIfNotExists', () => {
    it('should pass through the call to azure', async () => {
      const result = sut.createContainerIfNotExists('some-blob-storage', {
        publicAccessLevel: 'container',
      });
      blobServiceMock.createContainerIfNotExists.callArg(2);
      await result;
      expect(result).instanceof(Promise);
      expect(blobServiceMock.createContainerIfNotExists).calledWith(
        'some-blob-storage',
        { publicAccessLevel: 'container' }
      );
      expect(blobServiceMock.createContainerIfNotExists).calledOn(
        blobServiceMock
      );
    });
  });

  describe('createBlockBlobFromText', () => {
    it('should pass through the call to azure', async () => {
      const result = sut.createBlockBlobFromText('foo', 'bar', 'baz', {
        contentSettings: { contentEncoding: 'utf8' },
      });
      blobServiceMock.createBlockBlobFromText.callArg(4);
      await result;
      expect(result).instanceof(Promise);
      expect(blobServiceMock.createBlockBlobFromText).calledWith(
        'foo',
        'bar',
        'baz',
        { contentSettings: { contentEncoding: 'utf8' } }
      );
      expect(blobServiceMock.createBlockBlobFromText).calledOn(blobServiceMock);
    });
  });
});
