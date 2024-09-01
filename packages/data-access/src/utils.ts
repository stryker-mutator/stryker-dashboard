import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { RestError } from '@azure/storage-blob';

export function encodeKey(inputWithSlashes: string) {
  return inputWithSlashes.replace(/\//g, ';');
}

export function decodeKey(inputWithSemiColons: string) {
  return inputWithSemiColons.replace(/;/g, '/');
}

export function isStorageError(maybeStorageError: unknown): maybeStorageError is RestError {
  return maybeStorageError instanceof RestError;
}

export function hasErrorCode(err: unknown, code: string): boolean {
  if (!isStorageError(err)) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const details = err.details as any;
  return (
    typeof details === 'object' && details !== null && (details.errorCode === code || details.odataError?.code === code)
  );
}

export function toBlobName({ projectName, version, moduleName, realTime }: ReportIdentifier) {
  const slug = [projectName, version, moduleName, realTime ? 'real-time' : realTime].filter(Boolean).join('/');
  return encodeKey(slug);
}
