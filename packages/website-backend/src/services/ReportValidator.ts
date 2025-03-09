import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { MutantResult } from 'mutation-testing-report-schema';
import { Pool, pool } from 'workerpool';

import { ValidateMutants, ValidateReport } from './ValidatorWorker.js';

@Injectable()
export class ReportValidator implements OnApplicationShutdown {
  #pool: Pool;

  constructor() {
    this.#pool = pool(import.meta.dirname + '/ValidatorWorker.js');
  }

  async onApplicationShutdown() {
    await this.#pool.terminate();
  }

  public async findErrors(report: object): Promise<undefined | string> {
    return this.#pool.exec<ValidateReport>('validateReport', [report]).timeout(120_000);
  }

  public async validateMutants(mutants: Partial<MutantResult>[] | null): Promise<undefined | string> {
    return this.#pool.exec<ValidateMutants>('validateMutants', [mutants]).timeout(120_000);
  }
}
