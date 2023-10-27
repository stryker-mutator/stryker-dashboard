import { expect } from 'chai';
import { encodeKey, decodeKey, toBlobName } from '../../src/utils.js';

describe('utils', () => {
  describe(encodeKey.name, () => {
    it('should return input if not contains a slash', () => {
      expect(encodeKey('input;output')).eq('input;output');
    });
    it('should return input if not contains a slash', () => {
      expect(encodeKey('input/middle/output')).eq('input;middle;output');
    });
  });

  describe(decodeKey.name, () => {
    it('should return input if not contains a semicolon', () => {
      expect(decodeKey('input/output')).eq('input/output');
    });
    it('should return input if not contains a slash', () => {
      expect(decodeKey('input;middle;output')).eq('input/middle/output');
    });
  });

  describe(toBlobName.name, () => {
    it('should return the correct blob name', () => {
      expect(
        toBlobName({
          projectName: 'abc',
          version: 'main',
          moduleName: 'def',
          realTime: true,
        })
      ).to.eq('abc;main;def;real-time');
    });

    it('should not include module if it is undefined', () => {
      expect(
        toBlobName({
          projectName: 'abc',
          version: 'main',
          moduleName: undefined,
          realTime: true,
        })
      ).to.eq('abc;main;real-time');
    });

    it('should not include real-time if it is undefined', () => {
      expect(
        toBlobName({
          projectName: 'abc',
          version: 'main',
          moduleName: 'def',
          realTime: undefined,
        })
      );
    });
  });
});
