import type { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import type { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import type { MutantResult } from 'mutation-testing-report-schema';

import { toBlobName } from '../utils.js';
import { createBlobServiceClient } from './BlobServiceClient.js';

// To make resource delete themselves automatically, this should be managed from within Azure:
// https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview?tabs=azure-portal
export class RealTimeMutantsBlobService {
  private static readonly CONTAINER_NAME = 'real-time-mutant-results';

  #containerClient: ContainerClient;

  constructor(blobService: BlobServiceClient = createBlobServiceClient()) {
    this.#containerClient = blobService.getContainerClient(RealTimeMutantsBlobService.CONTAINER_NAME);
  }

  public async createStorageIfNotExists() {
    await this.#containerClient.createIfNotExists({});
  }

  public async createReport(id: ReportIdentifier) {
    await this.#containerClient.getAppendBlobClient(toBlobName(id)).create();
  }

  public async appendToReport(id: ReportIdentifier, mutants: Partial<MutantResult>[]) {
    const blobName = toBlobName(id);
    const data = mutants.map((mutant) => `${JSON.stringify(mutant)}\n`).join('');

    await this.#containerClient.getAppendBlobClient(blobName).appendBlock(data, data.length);
  }

  public async getReport(id: ReportIdentifier): Promise<Partial<MutantResult>[]> {
    const data = await this.#containerClient.getAppendBlobClient(toBlobName(id)).downloadToBuffer();

    return (
      data
        .toString('utf-8')
        .split('\n')
        // Since every line has a newline it will produce an empty string in the list.
        // Remove it, so nothing breaks.
        .filter((row) => row !== '')
        .map((mutant) => JSON.parse(mutant) as Partial<MutantResult>)
    );
  }

  public async delete(id: ReportIdentifier): Promise<void> {
    const blobName = toBlobName(id);
    await this.#containerClient.getAppendBlobClient(blobName).deleteIfExists();
  }
}
