import { InvalidSlugError, Slug } from '@stryker-mutator/dashboard-common';
import { NotFound } from 'ts-httpexceptions';

export function parseSlug(slug: string) {
  try {
    return Slug.parse(slug);
  } catch (error) {
    if (error instanceof InvalidSlugError) {
      throw new NotFound(`Report "${slug}" does not exist`);
    } else {
      throw error;
    }
  }
}
