import { expect } from 'chai';
import passport from 'passport';
import request from 'supertest';
import * as sinon from 'sinon';
import * as github from '../../../src/github/models.js';
import { githubFactory } from '../../helpers/producers.js';
import { DataAccessMock, config, createToken } from '../../helpers/TestServer.js';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module.js';
import { INestApplication } from '@nestjs/common';
import Configuration from '../../../src/services/Configuration.js';
import AuthController from '../../../src/controllers/auth.controller.js';
import DataAccess from '../../../src/services/DataAccess.js';

describe(AuthController.name, () => {
  let app: INestApplication;
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

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Configuration)
      .useValue(config)
      .overrideProvider(DataAccess)
      .useValue(new DataAccessMock())
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();
  });

  describe('POST /auth/github', () => {
    it("should respond with the 'jwt' token", async () => {
      // Arrange
      const token = await createToken(user);

      // Act
      const onGoingRequest = request(app.getHttpServer()).post(
        '/api/auth/github?code=foo'
      );

      // Assert
      const response = await onGoingRequest.expect(201);
      expect(response.body).deep.eq({ jwt: token });
    });
  });
});
