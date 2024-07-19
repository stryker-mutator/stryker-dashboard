import { Repository } from '@stryker-mutator/dashboard-contract';

const shieldsBaseUrl = 'https://img.shields.io';

export type BadgeStyle = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge';
export const allBadgeStyles: readonly BadgeStyle[] = Object.freeze([
  'flat',
  'flat-square',
  'plastic',
  'for-the-badge',
]);

export function badgeSrc(repo: Repository, style: BadgeStyle = 'flat'): string {
  const badgeApiUrl = `https://badge-api.stryker-mutator.io/${repo.slug}/${repo.defaultBranch}`;
  return `${shieldsBaseUrl}/endpoint?style=${style}&url=${encodeURIComponent(
    badgeApiUrl
  )}`;
}

export function badgeExampleSrc(
  score: number,
  color: string,
  style: BadgeStyle
) {
  return `${shieldsBaseUrl}/badge/mutation%20score-${score}%25-${color}?style=${style}`;
}
