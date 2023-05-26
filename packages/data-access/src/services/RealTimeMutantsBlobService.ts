import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { BlobServiceAsPromised } from './BlobServiceAsPromised.js';
import { toBlobName } from '../utils.js';
import { MutantResult } from 'mutation-testing-report-schema';

// To make resource delete themselves automatically, this should be managed from within Azure:
// https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview?tabs=azure-portal
export class RealTimeMutantsBlobService {
  private static readonly CONTAINER_NAME = 'mutants-tested-batch';

  #blobService: BlobServiceAsPromised;

  constructor(blobService = new BlobServiceAsPromised()) {
    this.#blobService = blobService;
  }

  public async createStorageIfNotExists() {
    await this.#blobService.createContainerIfNotExists(
      RealTimeMutantsBlobService.CONTAINER_NAME,
      {}
    );
  }

  public async createBlob(id: ReportIdentifier) {
    await this.#blobService.createAppendBlobFromText(
      RealTimeMutantsBlobService.CONTAINER_NAME,
      toBlobName(id),
      ''
    );
  }

  public async appendToBlob(
    id: ReportIdentifier,
    mutants: Array<Partial<MutantResult>>
  ) {
    const blobName = toBlobName(id);
    const data = mutants
      .map((mutant) => `${JSON.stringify(mutant)}\n`)
      .join('');

    await this.#blobService.appendBlockFromText(
      RealTimeMutantsBlobService.CONTAINER_NAME,
      blobName,
      data
    );
  }

  public async getEvents(
    id: ReportIdentifier
  ): Promise<Array<Partial<MutantResult>>> {
    const data = await this.#blobService.blobToText(
      RealTimeMutantsBlobService.CONTAINER_NAME,
      toBlobName(id)
    );

    if (data === '') {
      return [];
    }

    return data
      .split('\n')
      .slice(0, -1)
      .map((mutant) => JSON.parse(mutant));
  }
}
