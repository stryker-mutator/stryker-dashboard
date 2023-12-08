import { expect } from 'chai';
import { ReportValidator } from '../../../src/services/ReportValidator.js';
import { MutantResult } from 'mutation-testing-report-schema/api';

describe(ReportValidator.name, () => {
  let sut: ReportValidator;

  beforeEach(() => {
    sut = new ReportValidator();
  });

  describe('validateMutants', () => {
    it('should validate partial mutants correctly', () => {
      const payload: Partial<MutantResult>[] = [
        { id: '1', status: 'Killed' },
        { id: '2', status: 'Survived' },
      ];

      const errors = sut.validateMutants(payload);

      expect(errors).to.be.undefined;
    });

    it('should error when required properties are missing', () => {
      const payload = [{}, {}];

      const errors = sut.validateMutants(payload);

      expect(errors).to.be.eq("data/0 must have required property 'id'");
    });

    it('should error when not all mutants have all required properties', () => {
      const payload: Partial<MutantResult>[] = [
        { id: '1', status: 'Killed' },
        { id: '2', status: 'Survived' },
        { id: '3' },
      ];

      const errors = sut.validateMutants(payload);

      expect(errors).to.be.eq("data/2 must have required property 'status'");
    });
  });
});
