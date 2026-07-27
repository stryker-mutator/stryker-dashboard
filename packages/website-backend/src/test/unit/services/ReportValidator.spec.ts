import { expect } from 'chai';
import type { MutantResult } from 'mutation-testing-report-schema/api';

import { ReportValidator } from '../../../services/ReportValidator.js';
import { createMutationTestResult } from '../../helpers/mutants.js';

describe(ReportValidator.name, () => {
  let sut: ReportValidator;

  beforeEach(() => {
    sut = new ReportValidator();
  });

  afterEach(async () => {
    await sut.onApplicationShutdown();
  });

  describe('findErrors', () => {
    it('should accept a valid report', async () => {
      expect(await sut.findErrors(createMutationTestResult())).to.be.undefined;
    });

    it('should accept a valid report handed over as raw bytes', async () => {
      const raw = Buffer.from(JSON.stringify(createMutationTestResult()), 'utf8');

      expect(await sut.findErrors(raw)).to.be.undefined;
    });

    it('should report schema errors for a report handed over as raw bytes', async () => {
      const raw = Buffer.from(JSON.stringify({ schemaVersion: '1', files: {} }), 'utf8');

      expect(await sut.findErrors(raw)).to.be.eq("data must have required property 'thresholds'");
    });

    it('should report unparsable raw bytes rather than throwing', async () => {
      const errors = await sut.findErrors(Buffer.from('{not json', 'utf8'));

      expect(errors).to.include('Invalid JSON');
    });

    it('should reject a report with duplicate mutant ids in one file', async () => {
      const report = createMutationTestResult(['Killed', 'Survived']);
      report.files['a.js'].mutants[1].id = report.files['a.js'].mutants[0].id;

      const errors = await sut.findErrors(report);

      expect(errors).to.be.eq('data/files/a.js/mutants must not contain duplicate mutant ids (duplicate id: "0")');
    });

    it('should allow the same mutant id in different files', async () => {
      const report = createMutationTestResult(['Killed']);
      report.files['b.js'] = structuredClone(report.files['a.js']);

      expect(await sut.findErrors(report)).to.be.undefined;
    });
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
