import { expect } from 'chai';
import { Slug, InvalidSlugError } from '../../src/slug';

describe(Slug.name, () => {

  describe('parse', () => {
    it('should parse project name and version correctly', () => {
      expect(Slug.parse('a/b/c/dds%20ds')).deep.eq(new Slug('a/b/c', 'dds%20ds'));
    });

    it('should remove trailing and leading slashes', () => {
      expect(Slug.parse('//a/b/c/d///')).deep.eq(new Slug('a/b/c', 'd'));
    });

    it('should allow a version with slashes', () => {
      expect(Slug.parse('github.com/stryker-mutator/stryker/feat/support/slashes'))
        .deep.eq(new Slug('github.com/stryker-mutator/stryker', 'feat/support/slashes'));
    });

    it('should throw an error if the version is missing', () => {
      expect(() => Slug.parse('a-project-without-version'))
        .throws(InvalidSlugError)
        .property('message', 'Missing version in "a-project-without-version"');
    });

    it('should throw an error if the slug is empty', () => {
      expect(() => Slug.parse(''))
        .throws(InvalidSlugError)
        .property('message', 'Missing slug');
    });
  });
});
