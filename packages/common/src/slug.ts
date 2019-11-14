export class InvalidSlugError extends Error {
}

export class Slug {

  constructor(public readonly project: string, public readonly version: string) {
  }

  public static parse(rawSlug: string) {
    if (rawSlug) {
      while (rawSlug.endsWith('/')) {
        rawSlug = rawSlug.substr(0, rawSlug.length - 1);
      }
      while (rawSlug.startsWith('/')) {
        rawSlug = rawSlug.substr(1);
      }
      const split = rawSlug.lastIndexOf('/');
      if (!rawSlug || rawSlug.lastIndexOf('/') === -1) {
        throw new InvalidSlugError(`Missing version in "${rawSlug}"`);
      } else {
        return new Slug(rawSlug.substr(0, split), rawSlug.substr(split + 1));
      }
    } else {
      throw new InvalidSlugError(`Missing slug`);
    }
  }
}
