import { expect } from 'chai';
import { encodeKey, decodeKey } from '../../src/utils';

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
});
