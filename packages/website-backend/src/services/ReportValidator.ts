/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { Ajv } from 'ajv';
import _addFormats from 'ajv-formats';
import { MutantResult, schema } from 'mutation-testing-report-schema';
// https://github.com/ajv-validator/ajv-formats/issues/85#issuecomment-2262652443
const addFormats = _addFormats as unknown as typeof _addFormats.default;

const SCHEMA_NAME = 'http://stryker-mutator.io/report.schema.json';

@Injectable()
export class ReportValidator {
  readonly #schemaValidator: Ajv;
  readonly #mutantsValidator: Ajv;

  constructor() {
    this.#schemaValidator = new Ajv();
    this.#schemaValidator.addSchema(schema, SCHEMA_NAME);

    const mutantSchema = {
      ...schema.properties.files.additionalProperties.properties.mutants,
      definitions: schema.definitions,
    };
    mutantSchema.items.required = ['id', 'status'];
    this.#mutantsValidator = new Ajv();
    this.#mutantsValidator.addSchema(mutantSchema, SCHEMA_NAME);

    addFormats(this.#schemaValidator);
    addFormats(this.#mutantsValidator);
  }

  public findErrors(report: object): undefined | string {
    try {
      // Cast the result to a boolean, as the validation should happen synchronously. Weird API of Ajv...
      if (!this.#schemaValidator.validate(SCHEMA_NAME, report)) {
        return this.#schemaValidator.errorsText(this.#schemaValidator.errors);
      } else {
        return;
      }
    } catch (err) {
      console.error('AJV validation error', err);
      return;
    }
  }

  public validateMutants(mutants: Partial<MutantResult>[] | null): undefined | string {
    try {
      // Cast the result to a boolean, as the validation should happen synchronously. Weird API of Ajv...
      if (!this.#mutantsValidator.validate(SCHEMA_NAME, mutants)) {
        return this.#mutantsValidator.errorsText(this.#mutantsValidator.errors);
      } else {
        return;
      }
    } catch (err) {
      console.error('AJV validation error', err);
      return;
    }
  }
}
