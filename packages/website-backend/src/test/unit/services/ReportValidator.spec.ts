import { expect } from 'chai';
import type { MutantResult } from 'mutation-testing-report-schema/api';

import { ReportValidator } from '../../../services/ReportValidator.js';

describe(ReportValidator.name, () => {
  let sut: ReportValidator;

  beforeEach(() => {
    sut = new ReportValidator();
  });

  afterEach(async () => {
    await sut.onApplicationShutdown();
  });

  describe('validateMutants', () => {
    it('should validate partial mutants correctly', async () => {
      const payload: Partial<MutantResult>[] = [
        { id: '1', status: 'Killed' },
        { id: '2', status: 'Survived' },
      ];

      const errors = await sut.validateMutants(payload);

      expect(errors).to.be.undefined;
    });

    it('should error when required properties are missing', async () => {
      const payload = [{}, {}];

      const errors = await sut.validateMutants(payload);

      expect(errors).to.be.eq("data/0 must have required property 'id'");
    });

    it('should error when not all mutants have all required properties', async () => {
      const payload: Partial<MutantResult>[] = [
        { id: '1', status: 'Killed' },
        { id: '2', status: 'Survived' },
        { id: '3' },
      ];

      const errors = await sut.validateMutants(payload);

      expect(errors).to.be.eq("data/2 must have required property 'status'");
    });
  });
});
