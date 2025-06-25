import type { ValidateFunction } from 'ajv';
import { Ajv } from 'ajv';
import _addFormats from 'ajv-formats';
import type { MutantResult, MutationTestResult } from 'mutation-testing-report-schema';
import { schema } from 'mutation-testing-report-schema';
import workerpool from 'workerpool';

// https://github.com/ajv-validator/ajv-formats/issues/85#issuecomment-2262652443
const addFormats = _addFormats as unknown as typeof _addFormats.default;

// ----------------
// Schema validation is CPU-intensive on large reports. To prevent blocking the main thread, we offload the validation to a worker pool.
// This file is the worker script that runs in the worker pool.
// ----------------

function initSchemaValidator() {
  const ajv = new Ajv();
  addFormats(ajv);

  const mutantSchema = {
    ...schema.properties.files.additionalProperties.properties.mutants,
    definitions: schema.definitions,
  };
  mutantSchema.items.required = ['id', 'status'];

  return {
    fullSchemaValidate: ajv.compile<MutationTestResult>(schema),
    mutantSchemaValidate: ajv.compile<Partial<MutantResult>[]>(mutantSchema),
    errorsText: ajv.errorsText.bind(ajv),
  };
}
const { fullSchemaValidate, mutantSchemaValidate, errorsText } = initSchemaValidator();

function validate<T>(data: unknown, validator: ValidateFunction<T>): undefined | string {
  try {
    if (!validator(data)) {
      return errorsText(validator.errors);
    } else {
      return;
    }
  } catch (err) {
    console.error('AJV validation error', err);
    return;
  }
}

function validateReport(report: object): undefined | string {
  return validate(report, fullSchemaValidate);
}
export type ValidateReport = typeof validateReport;

function validateMutants(mutants: Partial<MutantResult>[] | null): undefined | string {
  return validate(mutants, mutantSchemaValidate);
}
export type ValidateMutants = typeof validateMutants;

// Register the functions in the workerpool
workerpool.worker({
  validateReport,
  validateMutants,
});
