export class InvalidSlugError extends Error {
}

const NR_OF_PROJECT_NAME_PARTS = 3;

/**
 * Represents a slug, meaning a project and version concatenated in a url.
 * For example "github.com/stryker-mutator/stryker/master"
 * Or "github.com/stryker-mutator/stryker/feat/allow/slashes"
 */
export class Slug {

  constructor(public readonly project: string, public readonly version: string) {
  }

  /**
   * Parses a raw slug into project and version.
   * Will assume that the project is in the form "gitProvider/owner/name", so 3 parts
   * Whenever we support gitlab we should probably move this to data-access and query
   * the database to see what the actual name is.
   * @param rawSlug the project name and version concatenated with a slash
   */
  public static parse(rawSlug: string) {
    rawSlug = sanitize(rawSlug);
    if (rawSlug) {
      const parts = rawSlug.split('/');
      if (parts.length < (NR_OF_PROJECT_NAME_PARTS + 1)) {
        throw new InvalidSlugError(`Missing version in "${rawSlug}"`);
      } else {
        return new Slug(parts.slice(0, NR_OF_PROJECT_NAME_PARTS).join('/'), parts.slice(NR_OF_PROJECT_NAME_PARTS).join('/'));
      }
    } else {
      throw new InvalidSlugError(`Missing slug`);
    }
  }
}

function sanitize(rawSlug: string) {
  while (rawSlug.endsWith('/')) {
    rawSlug = rawSlug.substr(0, rawSlug.length - 1);
  }
  while (rawSlug.startsWith('/')) {
    rawSlug = rawSlug.substr(1);
  }
  return rawSlug;
}

