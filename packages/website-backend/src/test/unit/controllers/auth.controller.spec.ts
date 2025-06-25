import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import { Strategy } from 'passport-github2';
import sinon from 'sinon';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../../../app.module.js';
import AuthController from '../../../controllers/auth.controller.js';
import type * as github from '../../../github/models.js';
import Configuration from '../../../services/Configuration.js';
import DataAccess from '../../../services/DataAccess.js';
import { githubFactory } from '../../helpers/producers.js';
import { config, createToken, DataAccessMock } from '../../helpers/TestServer.js';

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

  afterEach(async () => {
    await app.close();
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
