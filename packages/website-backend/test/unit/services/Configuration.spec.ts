import Configuration from '../../../src/services/Configuration.js';
import { expect } from 'chai';
import utils from '../../../src/utils.js';
import sinon from 'sinon';

describe('Configuration', () => {
  let requiredEnvVarStub: sinon.SinonStub<[string], string>;

  beforeEach(() => {
    requiredEnvVarStub = sinon.stub(utils, 'requiredEnvVar');
  });

  it('should read correct environment variables on load', () => {
    requiredEnvVarStub.withArgs('GH_BASIC_CLIENT_ID').returns('gh client id');
    requiredEnvVarStub.withArgs('GH_BASIC_SECRET_ID').returns('gh secret');
    requiredEnvVarStub
      .withArgs('STRYKER_DASHBOARD_BASE_URL')
      .returns('stryker-dashboard base url');
    requiredEnvVarStub.withArgs('JWT_SECRET').returns('jwt secret');
    const sut = new Configuration();

    expect(sut.baseUrl).eq('stryker-dashboard base url');
    expect(sut.githubClientId).eq('gh client id');
    expect(sut.githubSecret).eq('gh secret');
    expect(sut.jwtSecret).eq('jwt secret');
  });
});
