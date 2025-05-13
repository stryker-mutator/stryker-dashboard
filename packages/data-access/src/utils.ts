import { isRestError } from '@azure/core-rest-pipeline';
import type { ReportIdentifier } from '@stryker-mutator/dashboard-common';

export function encodeKey(inputWithSlashes: string) {
  return inputWithSlashes.replace(/\//g, ';');
}

export function decodeKey(inputWithSemiColons: string) {
  return inputWithSemiColons.replace(/;/g, '/');
}

export function hasErrorCode(err: unknown, code: string): boolean {
  if (!isRestError(err)) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const details = err.details as any;
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof details === 'object' && details !== null && (details.errorCode === code || details.odataError?.code === code)
  );
}

export function toBlobName({ projectName, version, moduleName, realTime }: ReportIdentifier) {
  const slug = [projectName, version, moduleName, realTime ? 'real-time' : realTime].filter(Boolean).join('/');
  return encodeKey(slug);
}
