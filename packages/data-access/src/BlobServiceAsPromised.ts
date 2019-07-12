import { BlobService } from 'azure-storage';
import { promisify } from 'util';

export class BlobServiceAsPromised {

  public createContainerIfNotExists: (container: string, options: BlobService.CreateContainerOptions) => Promise<BlobService.ContainerResult>;
  public createBlockBlobFromText: (container: string, blob: string, text: string | Buffer, options: BlobService.CreateBlobRequestOptions) => Promise<BlobService.BlobResult>;
  public blobToText: (container: string, blob: string) => Promise<string>;

  constructor(blobService: BlobService) {
    this.createContainerIfNotExists = promisify<string, BlobService.CreateContainerOptions, BlobService.ContainerResult>(blobService.createContainerIfNotExists).bind(blobService);
    this.createBlockBlobFromText = promisify(blobService.createBlockBlobFromText).bind(blobService);
    this.blobToText = promisify(blobService.getBlobToText).bind(blobService);
  }
}
