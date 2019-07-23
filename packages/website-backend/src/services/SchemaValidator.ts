import Ajv from 'ajv';
import { schema } from 'mutation-testing-report-schema';
import { Service } from '@tsed/di';

const SCHEMA_NAME = 'http://stryker-mutator.io/report.schema.json';

@Service()
export class ReportValidator {
  private readonly schemaValidator: Ajv.Ajv;
  constructor() {
    this.schemaValidator = new Ajv();
    this.schemaValidator.addSchema(schema, SCHEMA_NAME);
  }

  public findErrors(report: object): undefined | string {
    // Cast the result to a boolean, as the validation should happen synchronously. Weird API of Ajv...
    if (!this.schemaValidator.validate(SCHEMA_NAME, report)) {
      return this.schemaValidator.errorsText(this.schemaValidator.errors);
    } else {
      return undefined;
    }
  }
}
