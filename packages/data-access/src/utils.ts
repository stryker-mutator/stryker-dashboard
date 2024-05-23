import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { StorageError } from 'azure-storage';

export function encodeKey(inputWithSlashes: string) {
  return inputWithSlashes.replace(/\//g, ';');
}

export function decodeKey(inputWithSemiColons: string) {
  return inputWithSemiColons.replace(/;/g, '/');
}

export function isStorageError(maybeStorageError: unknown): maybeStorageError is StorageError {
  return (
    maybeStorageError instanceof Error &&
    (maybeStorageError as StorageError).name === 'StorageError'
  );
}

export function toBlobName({ projectName, version, moduleName, realTime }: ReportIdentifier) {
  const slug = [projectName, version, moduleName, realTime ? 'real-time' : realTime]
    .filter(Boolean)
    .join('/');
  return encodeKey(slug);
}
