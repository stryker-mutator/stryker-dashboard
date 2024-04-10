import { BlobService, createBlobService } from 'azure-storage';
import { promisify } from 'util';

export class BlobServiceAsPromised {
  public createContainerIfNotExists: (
    container: string,
    options: BlobService.CreateContainerOptions,
  ) => Promise<BlobService.ContainerResult>;
  public createBlockBlobFromText: (
    container: string,
    blob: string,
    text: string | Buffer,
    options: BlobService.CreateBlobRequestOptions,
  ) => Promise<BlobService.BlobResult>;
  public blobToText: (container: string, blob: string) => Promise<string>;
  public createAppendBlobFromText: (
    container: string,
    blob: string,
    text: string | Buffer,
  ) => Promise<BlobService.BlobResult>;
  public appendBlockFromText: (
    container: string,
    blob: string,
    text: string | Buffer,
  ) => Promise<BlobService.BlobResult>;
  public deleteBlobIfExists: (container: string, blob: string) => Promise<unknown>;

  constructor(blobService = createBlobService()) {
    this.createContainerIfNotExists = promisify<
      string,
      BlobService.CreateContainerOptions,
      BlobService.ContainerResult
    >(blobService.createContainerIfNotExists).bind(blobService);
    this.createBlockBlobFromText = promisify(blobService.createBlockBlobFromText).bind(blobService);
    this.blobToText = promisify(blobService.getBlobToText).bind(blobService);
    this.createAppendBlobFromText = promisify(blobService.createAppendBlobFromText).bind(
      blobService,
    );
    this.appendBlockFromText = promisify(blobService.appendBlockFromText).bind(blobService);
    this.deleteBlobIfExists = promisify(blobService.deleteBlobIfExists).bind(blobService);
  }
}
