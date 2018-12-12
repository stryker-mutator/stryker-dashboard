import Configuration from '../../../src/services/Configuration';
import { expect } from 'chai';
import * as utils from '../../../src/utils';
import sinon = require('sinon');

describe('Configuration', () => {
    let requiredEnvVarStub: sinon.SinonStub;
    let optionalEnvVarStub: sinon.SinonStub;

    beforeEach(() => {
        requiredEnvVarStub = sinon.stub(utils, 'requiredEnvVar');
        optionalEnvVarStub = sinon.stub(utils, 'optionalEnvVar');
    });

    it('should read correct environment variables on load', () => {
        requiredEnvVarStub.withArgs('GH_BASIC_CLIENT_ID').returns('gh client id');
        requiredEnvVarStub.withArgs('GH_BASIC_SECRET_ID').returns('gh secret');
        optionalEnvVarStub.withArgs('STRYKER_DASHBOARD_BASE_URL', '').returns('stryker-dashboard base url');
        requiredEnvVarStub.withArgs('JWT_SECRET').returns('jwt secret');
        const sut = new Configuration();

        expect(sut.baseUrl).eq('stryker-dashboard base url');
        expect(sut.githubClientId).eq('gh client id');
        expect(sut.githubSecret).eq('gh secret');
        expect(sut.jwtSecret).eq('jwt secret');
    });
});