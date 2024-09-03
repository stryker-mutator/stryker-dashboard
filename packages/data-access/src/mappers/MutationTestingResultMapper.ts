import { hasErrorCode, toBlobName } from '../utils.js';
import * as schema from 'mutation-testing-report-schema';
import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { OptimisticConcurrencyError } from '../errors/index.js';
import { BlobServiceClient, ContainerClient, ContainerCreateIfNotExistsResponse } from '@azure/storage-blob';
import { createBlobServiceClient } from '../services/BlobServiceClient.js';

const errCodes = Object.freeze({
  BLOB_HAS_BEEN_MODIFIED: 'BlobHasBeenModified',
  BLOB_NOT_FOUND: 'BlobNotFound',
});

/**
 * The report json part of a mutation testing report is stored in blob storage
 */
export class MutationTestingResultMapper {
  private static readonly CONTAINER_NAME = 'mutation-testing-report';

  #containerClient: ContainerClient;

  constructor(blobService: BlobServiceClient = createBlobServiceClient()) {
    this.#containerClient = blobService.getContainerClient(MutationTestingResultMapper.CONTAINER_NAME);
  }

  public createStorageIfNotExists(): Promise<ContainerCreateIfNotExistsResponse> {
    return this.#containerClient.createIfNotExists({});
  }

  public async insertOrReplace(id: ReportIdentifier, result: schema.MutationTestResult | null) {
    try {
      await this.#containerClient
        .getBlockBlobClient(toBlobName(id))
        .uploadData(Buffer.from(JSON.stringify(result), 'utf-8'), {
          blobHTTPHeaders: {
            blobContentType: 'application/json',
            blobContentEncoding: 'utf8',
          },
        });
    } catch (err) {
      if (hasErrorCode(err, errCodes.BLOB_HAS_BEEN_MODIFIED)) {
        throw new OptimisticConcurrencyError(`Blob "${JSON.stringify(id)}" was modified by another process`);
      } else {
        throw err; // Oops
      }
    }
  }

  public async findOne(identifier: ReportIdentifier): Promise<schema.MutationTestResult | null> {
    const blobName = toBlobName(identifier);
    try {
      const result = JSON.parse(
        (await this.#containerClient.getBlockBlobClient(blobName).downloadToBuffer()).toString('utf-8'),
      ) as schema.MutationTestResult;
      return result;
    } catch (error) {
      if (hasErrorCode(error, errCodes.BLOB_NOT_FOUND)) {
        return null;
      } else {
        // Oops
        throw error;
      }
    }
  }

  public async delete(id: ReportIdentifier): Promise<void> {
    const blobName = toBlobName(id);
    await this.#containerClient.getBlockBlobClient(blobName).deleteIfExists();
  }
}
