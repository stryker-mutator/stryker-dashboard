import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { BlobServiceAsPromised } from './BlobServiceAsPromised.js';
import { toBlobName } from '../utils.js';
import { MutantResult } from 'mutation-testing-report-schema';

// To make resource delete themselves automatically, this should be managed from within Azure:
// https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview?tabs=azure-portal
export class RealTimeMutantsBlobService {
  private static readonly CONTAINER_NAME = 'real-time-mutant-results';

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

  public async createReport(id: ReportIdentifier) {
    await this.#blobService.createAppendBlobFromText(
      RealTimeMutantsBlobService.CONTAINER_NAME,
      toBlobName(id),
      ''
    );
  }

  public async appendToReport(
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

  public async getReport(
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

  public async delete(id: ReportIdentifier): Promise<void> {
    const blobName = toBlobName(id);
    this.#blobService.deleteBlobIfExists(
      RealTimeMutantsBlobService.CONTAINER_NAME,
      blobName
    );
  }
}
