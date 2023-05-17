import { BlobServiceAsPromised } from '../services/BlobServiceAsPromised.js';
import { BlobService, Constants } from 'azure-storage';
import { encodeKey, isStorageError } from '../utils.js';
import * as schema from 'mutation-testing-report-schema';
import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { OptimisticConcurrencyError } from '../errors/index.js';

const additionalErrorCodes = Object.freeze({
  BLOB_HAS_BEEN_MODIFIED: 'BlobHasBeenModified',
});

/**
 * The report json part of a mutation testing report is stored in blob storage
 */
export class MutationTestingResultMapper {
  private static readonly CONTAINER_NAME = 'mutation-testing-report';

  constructor(
    private readonly blobService: BlobServiceAsPromised = new BlobServiceAsPromised()
  ) {}

  public createStorageIfNotExists(): Promise<BlobService.ContainerResult> {
    return this.blobService.createContainerIfNotExists(
      MutationTestingResultMapper.CONTAINER_NAME,
      {}
    );
  }

  public async insertOrReplace(
    id: ReportIdentifier,
    result: schema.MutationTestResult | null
  ) {
    try {
      await this.blobService.createBlockBlobFromText(
        MutationTestingResultMapper.CONTAINER_NAME,
        this.toBlobName(id),
        JSON.stringify(result),
        {
          contentSettings: {
            contentType: 'application/json',
            contentEncoding: 'utf8',
          },
        }
      );
    } catch (err) {
      if (
        isStorageError(err) &&
        err.code === additionalErrorCodes.BLOB_HAS_BEEN_MODIFIED
      ) {
        throw new OptimisticConcurrencyError(
          `Blob "${JSON.stringify(id)}" was modified by another process`
        );
      } else {
        throw err; // Oops
      }
    }
  }

  public async findOne(
    identifier: ReportIdentifier
  ): Promise<schema.MutationTestResult | null> {
    const blobName = this.toBlobName(identifier);
    try {
      const result: schema.MutationTestResult = JSON.parse(
        await this.blobService.blobToText(
          MutationTestingResultMapper.CONTAINER_NAME,
          blobName
        )
      );
      return result;
    } catch (error) {
      if (
        isStorageError(error) &&
        error.code === Constants.BlobErrorCodeStrings.BLOB_NOT_FOUND
      ) {
        return null;
      } else {
        // Oops
        throw error;
      }
    }
  }

  private toBlobName({
    projectName,
    version,
    moduleName,
    realTime,
  }: ReportIdentifier) {
    const slug = [
      projectName,
      version,
      moduleName,
      realTime ? 'real-time' : realTime,
    ]
      .filter(Boolean)
      .join('/');
    return encodeKey(slug);
  }
}
