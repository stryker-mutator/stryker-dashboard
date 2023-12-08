import { toBlobName } from '../utils.js';
import * as schema from 'mutation-testing-report-schema';
import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { BlobServiceClient } from '@azure/storage-blob'
import { buffer } from 'node:stream/consumers';

/**
 * The report json part of a mutation testing report is stored in blob storage
 */
export class MutationTestingResultMapper {
  private static readonly CONTAINER_NAME = 'mutation-testing-report';

  #blobService: BlobServiceClient;

  constructor(blobService = BlobServiceClient.fromConnectionString(process.env["AZURE_STORAGE_CONNECTION_STRING"]!)) {
    this.#blobService = blobService;
  }

  public async createStorageIfNotExists() {
    await this.#blobService
      .getContainerClient(MutationTestingResultMapper.CONTAINER_NAME)
      .createIfNotExists();
  }

  public async insertOrReplace(
    identifier: ReportIdentifier,
    result: schema.MutationTestResult | null
  ) {
    try {
      const data = JSON.stringify(result);
      await this.#blobService
        .getContainerClient(MutationTestingResultMapper.CONTAINER_NAME)
        .getBlockBlobClient(toBlobName(identifier))
        .upload(data, data.length);

    } catch (err) {
      throw err;
    }
  }

  public async findOne(
    identifier: ReportIdentifier
  ): Promise<schema.MutationTestResult | null> {
    try {
      const response = await this.#blobService
        .getContainerClient(MutationTestingResultMapper.CONTAINER_NAME)
        .getBlockBlobClient(toBlobName(identifier))
        .download();
      const body = (await buffer(response.readableStreamBody!)).toString();

      return JSON.parse(body);
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: ReportIdentifier) {
    await this.#blobService
      .getContainerClient(MutationTestingResultMapper.CONTAINER_NAME)
      .getBlockBlobClient(toBlobName(id))
      .deleteIfExists();
  }
}
