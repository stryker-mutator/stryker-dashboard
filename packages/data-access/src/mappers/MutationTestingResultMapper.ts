import { BlobServiceAsPromised } from '../services/BlobServiceAsPromised';
import { BlobService, Constants } from 'azure-storage';
import { encodeKey, isStorageError } from '../utils';
import * as schema from 'mutation-testing-report-schema';
import { ReportIdentifier } from '@stryker-mutator/dashboard-common';

/**
 * The report json part of a mutation testing report is stored in blob storage
 */
export class MutationTestingResultMapper {

  private static readonly CONTAINER_NAME = 'mutation-testing-report';

  constructor(private readonly blobService: BlobServiceAsPromised = new BlobServiceAsPromised()) {
  }

  public createStorageIfNotExists(): Promise<BlobService.ContainerResult> {
    return this.blobService.createContainerIfNotExists(MutationTestingResultMapper.CONTAINER_NAME, {});
  }

  public insertOrMerge(id: ReportIdentifier, result: schema.MutationTestResult | null) {
    return this.blobService.createBlockBlobFromText('mutation-testing-report',
      this.toBlobName(id),
      JSON.stringify(result), { contentSettings: { contentType: 'application/json', contentEncoding: 'utf8' } });
  }

  public async findOne(identifier: ReportIdentifier): Promise<schema.MutationTestResult | null> {
    const blobName = this.toBlobName(identifier);
    try {
      const result: schema.MutationTestResult = JSON.parse(await this.blobService.blobToText(MutationTestingResultMapper.CONTAINER_NAME, blobName));
      return result;
    } catch (error) {
      if (isStorageError(error) && error.code === Constants.BlobErrorCodeStrings.BLOB_NOT_FOUND) {
        return null;
      } else {
        // Oops
        throw error;
      }
    }
  }

  private toBlobName({ projectName, version, moduleName }:  ReportIdentifier) {
    const slug = [projectName, version, moduleName].filter(Boolean).join('/');
    return encodeKey(slug);
  }
}
