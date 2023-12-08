import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { BlobServiceClient } from '@azure/storage-blob'
import { toBlobName } from '../utils.js';
import { MutantResult } from 'mutation-testing-report-schema';
import { buffer } from 'node:stream/consumers';

// To make resource delete themselves automatically, this should be managed from within Azure:
// https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview?tabs=azure-portal
export class RealTimeMutantsBlobService {
  private static readonly CONTAINER_NAME = 'real-time-mutant-results';

  #blobService: BlobServiceClient;

  constructor(blobService = BlobServiceClient.fromConnectionString(process.env["AZURE_STORAGE_CONNECTION_STRING"]!)) {
    this.#blobService = blobService;
  }

  public async createStorageIfNotExists() {
    await this.#blobService
      .getContainerClient(RealTimeMutantsBlobService.CONTAINER_NAME)
      .createIfNotExists();
  }

  public async createReport(id: ReportIdentifier) {
    await this.#blobService
      .getContainerClient(RealTimeMutantsBlobService.CONTAINER_NAME)
      .getAppendBlobClient(toBlobName(id))
      .createIfNotExists();
  }

  public async appendToReport(
    id: ReportIdentifier,
    mutants: Array<Partial<MutantResult>>
  ) {
    const data = mutants
      .map((mutant) => `${JSON.stringify(mutant)}\n`)
      .join('');

    await this.#blobService
      .getContainerClient(RealTimeMutantsBlobService.CONTAINER_NAME)
      .getAppendBlobClient(toBlobName(id))
      .appendBlock(data, data.length)
  }

  public async getReport(
    id: ReportIdentifier
  ): Promise<Array<Partial<MutantResult>>> {
    const response = await this.#blobService
      .getContainerClient(RealTimeMutantsBlobService.CONTAINER_NAME)
      .getAppendBlobClient(toBlobName(id))
      .download()
    const body = (await buffer(response.readableStreamBody!)).toString();

    if (body === '') {
      return [];
    }

    return body
      .split('\n')
      // Since every line has a newline it will produce an empty string in the list.
      // Remove it, so nothing breaks.
      .filter((row) => row !== '')
      .map((mutant) => JSON.parse(mutant));
  }

  public async delete(id: ReportIdentifier): Promise<void> {
    await this.#blobService
      .getContainerClient(RealTimeMutantsBlobService.CONTAINER_NAME)
      .getBlockBlobClient(toBlobName(id))
      .deleteIfExists();
  }
}
