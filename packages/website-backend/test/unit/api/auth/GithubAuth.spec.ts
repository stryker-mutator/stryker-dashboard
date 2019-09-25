import { expect } from 'chai';
import passport from 'passport'; import cookieParser = require('cookie-parser');
import supertest from 'supertest';
import GithubAuth from '../../../../src/api/auth/GithubAuth';
import * as security from '../../../../src/middleware/securityMiddleware';
import testServer from '../../../helpers/TestServer';
import * as sinon from 'sinon';

describe('GitHubAuth', () => {

  let createTokenStub: sinon.SinonStub;
  let request: supertest.SuperTest<supertest.Test>;
  let logoutStub: sinon.SinonStub;
  let authenticateStub: sinon.SinonStub;
  let authenticateMiddleware: sinon.SinonStub;

  beforeEach(async () => {
    createTokenStub = sinon.stub(security, 'createToken');
    authenticateStub = sinon.stub(passport, 'authenticate');
    authenticateMiddleware = sinon.stub();
    logoutStub = sinon.stub();
    authenticateStub.returns(authenticateMiddleware);
    const passThroughMiddleware = (req: any, _res: any, next: any) => {
      req.user = { username: 'dummy' };
      req.logout = logoutStub;
      next();
    };
    authenticateMiddleware.callsFake(passThroughMiddleware);
    request = await testServer(GithubAuth, passThroughMiddleware, cookieParser());
  });

  describe('GET /logout', () => {
    it('should respond with 204', () => {
      // Arrange
      const token = 'foo-bar-baz';
      createTokenStub.resolves(token);

      // Act
      const response = request.get('/auth/github/logout')
        .set('Cookie', 'jwt=jfdskl');

      // Assert
      return response
        .expect(204);
    });

    it('should delete the \'jwt\' cookie', () => {
      // Act
      const response = request.get('/auth/github/logout')
        .set('Cookie', 'jwt=jfdskl');

      // Assert
      return response
        .expect('set-cookie', /jwt/)
        .expect('set-cookie', /Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
    });

    it('should end the session', async () => {
      // Act
      const response = request.get('/auth/github/logout')
        .set('Cookie', 'jwt=jfdskl');

      // Assert
      await response;
      expect(logoutStub).called;
    });
  });

  describe('POST /auth/github', () => {
    it('should set a \'jwt\' cookie', async () => {
      // Arrange
      const token = 'foo-bar-baz';
      createTokenStub.resolves(token);

      // Act
      const onGoingRequest = request.post('/auth/github?code=foo');

      // Assert
      const response = await onGoingRequest.expect(200);
      expect(response.body).deep.eq({ jwt: token });
    });
  });
});
