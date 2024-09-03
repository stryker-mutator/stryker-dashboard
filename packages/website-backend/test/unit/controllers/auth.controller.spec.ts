import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import * as github from '../../../src/github/models.js';
import { githubFactory } from '../../helpers/producers.js';
import { DataAccessMock, config, createToken } from '../../helpers/TestServer.js';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module.js';
import { INestApplication } from '@nestjs/common';
import Configuration from '../../../src/services/Configuration.js';
import AuthController from '../../../src/controllers/auth.controller.js';
import DataAccess from '../../../src/services/DataAccess.js';
import { Strategy } from 'passport-github2';
import { App } from 'supertest/types.js';

describe(AuthController.name, () => {
  let app: INestApplication<App>;
  let user: github.Authentication;

  beforeEach(async () => {
    user = githubFactory.authentication({ username: 'dummy' });
    sinon.stub(Strategy.prototype, 'authenticate').callsFake(function (this: Strategy) {
      this.success(user);
    });
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
      const onGoingRequest = request(app.getHttpServer()).post('/api/auth/github?code=foo');

      // Assert
      const response = await onGoingRequest.expect(201);
      expect(response.body).deep.eq({ jwt: token });
    });
  });
});
