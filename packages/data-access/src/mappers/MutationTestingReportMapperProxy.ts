import { MutationTestingReportBlobMapper } from './MutationTestingReportBlobMapper';
import MutationTestingReport from '../models/MutationTestingReport';
import TableStorageMapper from './TableStorageMapper';
import { MutationTestingReportMapper } from './contexts';

/**
 * Combines both the part in table storage as well as the part in blob storage to one api to store the entire report
 */
export class MutationTestingReportMapperProxy implements MutationTestingReportMapper {

  constructor(private readonly blobMapper = new MutationTestingReportBlobMapper(),
              private readonly tableMapper = new TableStorageMapper<MutationTestingReport, 'projectName' | 'version', 'moduleName'>(MutationTestingReport)) { }

  public async insertOrMergeEntity(report: MutationTestingReport): Promise<void> {
    await Promise.all([this.blobMapper.insertOrMergeEntity(report), this.tableMapper.insertOrMergeEntity(report)]);
  }

  public async createStorageIfNotExists() {
    await Promise.all([this.blobMapper.createStorageIfNotExists(), this.tableMapper.createStorageIfNotExists()]);
  }

  public async findOne(identifier: Pick<MutationTestingReport, 'projectName' | 'version' | 'moduleName'>): Promise<MutationTestingReport | null> {
    const [reportEntity, reportBlob] = await Promise.all([this.tableMapper.findOne(identifier), this.blobMapper.findOne(identifier)]);
    if (reportEntity) {
      return {
        ...reportEntity,
        result: reportBlob
      };
    } else {
      return null;
    }
  }

  public async findAll(identifier: Pick<MutationTestingReport, 'projectName' | 'version'>): Promise<MutationTestingReport[]> {
    const reports = await this.tableMapper.findAll(identifier);
    await Promise.all(reports.map(async report => {
      report.result = await this.blobMapper.findOne(report);
    }));
    return reports;
  }
}
