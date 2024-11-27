import { expect } from 'chai';

import utils from '../../../src/utils/utils.js';

describe('utils', () => {
  describe(utils.generateApiKey.name, () => {
    it('should generate a random UUID', () => {
      const result = utils.generateApiKey();
      expect(result).matches(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/);
    });

    it('should generate a different UUID each time', () => {
      const result1 = utils.generateApiKey();
      const result2 = utils.generateApiKey();
      expect(result1).not.eq(result2);
    });
  });

  describe(utils.generateHashValue.name, () => {
    it('should generate the same hash for the same input', () => {
      const result = utils.generateHashValue('6eb108e0-439a-4ed6-abf4-bed07411d970');
      expect(result).eq('75af68c90547024e9b2ee9ae0e01d6ccad69846e3f457f1b4462654ad2dc71c8');
    });

    it('should generate a different hash value for different input', () => {
      const result1 = utils.generateHashValue('test1');
      const result2 = utils.generateHashValue('test2');
      expect(result1).not.eq(result2);
    });
  });
});
