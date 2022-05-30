import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { schema } from 'mutation-testing-report-schema';
import { Service } from '@tsed/di';

const SCHEMA_NAME = 'http://stryker-mutator.io/report.schema.json';

@Service()
export class ReportValidator {
  private readonly schemaValidator: Ajv;
  constructor() {
    this.schemaValidator = new Ajv();
    addFormats(this.schemaValidator);
    this.schemaValidator.addSchema(schema, SCHEMA_NAME);
  }

  public findErrors(report: object): undefined | string {
    try {
      // Cast the result to a boolean, as the validation should happen synchronously. Weird API of Ajv...
      if (!this.schemaValidator.validate(SCHEMA_NAME, report)) {
        return this.schemaValidator.errorsText(this.schemaValidator.errors);
      } else {
        return;
      }
    } catch (err) {
      console.error('AJV validation error', err);
      return;
    }
  }
}
