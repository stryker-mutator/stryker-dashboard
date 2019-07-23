import { BlobServiceAsPromised, ErrorCodes } from '../storage/BlobServiceAsPromised';
import { BlobService, StorageError } from 'azure-storage';
import MutationTestingReport from '../models/MutationTestingReport';
import { encodeKey } from '../utils';
import * as schema from 'mutation-testing-report-schema/dist/src/api/index';

/**
 * The report json part of a mutation testing report is stored in blob storage
 */
export class MutationTestingReportBlobMapper {

  private static readonly CONTAINER_NAME = 'mutation-testing-report';

  constructor(private readonly blobService: BlobServiceAsPromised = new BlobServiceAsPromised()) {
  }

  public createStorageIfNotExists(): Promise<BlobService.ContainerResult> {
    return this.blobService.createContainerIfNotExists(MutationTestingReportBlobMapper.CONTAINER_NAME, {});
  }

  public insertOrMergeEntity(report: MutationTestingReport) {
    return this.blobService.createBlockBlobFromText('mutation-testing-report',
      this.toBlobName(report),
      JSON.stringify(report.result), { contentSettings: { contentType: 'application/json', contentEncoding: 'utf8' } });
  }

  public async findOne(identifier:  Pick<MutationTestingReport, 'repositorySlug' | 'version' | 'moduleName'>): Promise<schema.MutationTestResult | null> {
    const blobName = this.toBlobName(identifier);
    try {
      const result: schema.MutationTestResult = JSON.parse(await this.blobService.blobToText(MutationTestingReportBlobMapper.CONTAINER_NAME, blobName));
      return result;
    } catch (error) {
      if (this.isStorageError(error) && error.code === ErrorCodes.BlobNotFound) {
        return null;
      } else {
        // Oops
        throw error;
      }
    }
  }

  private isStorageError(maybeStorageError: unknown): maybeStorageError is StorageError {
    return maybeStorageError instanceof Error && (maybeStorageError as StorageError).name === 'StorageError';
  }

  private toBlobName({ repositorySlug, version, moduleName }:  Pick<MutationTestingReport, 'repositorySlug' | 'version' | 'moduleName'>) {
    const slug = [repositorySlug, version, moduleName].filter(Boolean).join('/');
    return encodeKey(slug);
  }
}
