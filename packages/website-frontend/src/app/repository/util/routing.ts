import { Repository } from '@stryker-mutator/dashboard-contract';

export function absoluteUrl(relative: string) {
  return new URL(relative, location.toString()).toString();
}

export function reportUrl(repository: Repository): string {
  return absoluteUrl(`/reports/${repository.slug}/${repository.defaultBranch}`);
}
