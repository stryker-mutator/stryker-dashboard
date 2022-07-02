import { expect } from 'chai';
import passport from 'passport';
import supertest from 'supertest';
import * as sinon from 'sinon';
import { PlatformTest } from '@tsed/common';
import Server from '../../../../src/Server.js';
import { createToken } from '../../../helpers/TestServer.js';
import { githubFactory } from '../../../helpers/producers.js';
import * as github from '../../../../src/github/models.js';

describe('GitHubAuth', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let logoutStub: sinon.SinonStub;
  let authenticateStub: sinon.SinonStubbedMember<typeof passport.authenticate>;
  let authenticateMiddleware: sinon.SinonStub;
  let user: github.Authentication;

  beforeEach(async () => {
    authenticateStub = sinon.stub(passport, 'authenticate');
    authenticateMiddleware = sinon.stub();
    logoutStub = sinon.stub();
    authenticateStub.returns(authenticateMiddleware);
    user = githubFactory.authentication({ username: 'dummy' });
    const passThroughMiddleware = (req: any, _res: any, next: any) => {
      req.user = user;
      req.logout = logoutStub;
      next();
    };
    authenticateMiddleware.callsFake(passThroughMiddleware);
    await PlatformTest.bootstrap(Server)();
    request = supertest(PlatformTest.callback());
  });

  describe('POST /auth/github', () => {
    it("should respond with the 'jwt' token", async () => {
      // Arrange
      const token = await createToken(user);

      // Act
      const onGoingRequest = request.post('/api/auth/github?code=foo');

      // Assert
      const response = await onGoingRequest.expect(200);
      expect(response.body).deep.eq({ jwt: token });
    });
  });
});
