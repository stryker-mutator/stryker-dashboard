import { InvalidSlugError } from './InvalidSlugError';

export function encodeKey(inputWithSlashes: string) {
  return inputWithSlashes.replace(/\//g, ';');
}

export function decodeKey(inputWithSemiColons: string) {
  return inputWithSemiColons.replace(/;/g, '/');
}

export function determineProjectAndVersion(slug: string | undefined): { projectName: string; version: string; } {
  if (slug) {
    while (slug.endsWith('/')) {
      slug = slug.substr(0, slug.length - 1);
    }
    while (slug.startsWith('/')) {
      slug = slug.substr(1);
    }
    const split = slug.lastIndexOf('/');
    if (!slug || slug.lastIndexOf('/') === -1) {
      throw new InvalidSlugError(`Missing version for slug "${slug}"`);
    } else {
      return {
        projectName: slug.substr(0, split),
        version: slug.substr(split + 1)
      };
    }
  } else {
    throw new InvalidSlugError(`Missing repositorySlug`);
  }
}
