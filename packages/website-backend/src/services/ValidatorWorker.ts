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

  const baseMutantSchema = schema.properties.files.additionalProperties.properties.mutants;
  const mutantSchema = {
    ...baseMutantSchema,
    items: {
      ...baseMutantSchema.items,
      required: ['id', 'status'],
    },
    definitions: schema.definitions,
  };

  const reportSchema = structuredClone(schema);
  const reportMutantSchema: { uniqueItems?: boolean } =
    reportSchema.properties.files.additionalProperties.properties.mutants;
  delete reportMutantSchema.uniqueItems;
  return {
    fullSchemaValidate: ajv.compile<MutationTestResult>(reportSchema),
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

/**
 * Simpler `uniqueItems` constraint of the schema `files[*].mutants`
 */
function findDuplicateMutantId(report: MutationTestResult): undefined | string {
  for (const [fileName, file] of Object.entries(report.files ?? {})) {
    const ids = new Set<string>();
    for (const { id } of file.mutants) {
      if (ids.has(id)) {
        return `data/files/${fileName.replace(/~/g, '~0').replace(/\//g, '~1')}/mutants must not contain duplicate mutant ids (duplicate id: "${id}")`;
      }
      ids.add(id);
    }
  }
  return;
}

function validateReport(report: object | Uint8Array): undefined | string {
  let parsed: object;
  if (report instanceof Uint8Array) {
    try {
      parsed = JSON.parse(Buffer.from(report.buffer, report.byteOffset, report.byteLength).toString('utf8')) as object;
    } catch (err) {
      return `Invalid JSON: ${(err as Error).message}`;
    }
  } else {
    parsed = report;
  }

  const schemaError = validate(parsed, fullSchemaValidate);
  if (schemaError) {
    return schemaError;
  }
  return findDuplicateMutantId(parsed as MutationTestResult);
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
