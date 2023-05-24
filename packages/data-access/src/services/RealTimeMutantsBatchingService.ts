import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { BlobServiceAsPromised } from './BlobServiceAsPromised.js';
import { toBlobName } from '../utils.js';
import { MutantResult } from 'mutation-testing-report-schema';

// To make resource delete themselves automatically, this should be managed from within Azure:
// https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview?tabs=azure-portal
export class RealTimeMutantsBatchingService {
  private static readonly CONTAINER_NAME = 'mutants-tested-batch';

  constructor(private readonly blobService = new BlobServiceAsPromised()) {}

  public async createStorageIfNotExists() {
    await this.blobService.createContainerIfNotExists(
      RealTimeMutantsBatchingService.CONTAINER_NAME,
      {}
    );
  }

  public async createBlob(id: ReportIdentifier) {
    await this.blobService.createAppendBlobFromText(
      RealTimeMutantsBatchingService.CONTAINER_NAME,
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

    await this.blobService.appendBlockFromText(
      RealTimeMutantsBatchingService.CONTAINER_NAME,
      blobName,
      data
    );
  }

  public async getEvents(id: ReportIdentifier) {
    const data = await this.blobService.blobToText(
      RealTimeMutantsBatchingService.CONTAINER_NAME,
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
