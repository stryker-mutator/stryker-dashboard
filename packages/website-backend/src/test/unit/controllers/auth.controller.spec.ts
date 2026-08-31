import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import type { AuthenticateResponse } from '@stryker-mutator/dashboard-contract';
import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';

import { AppModule } from '../../../app.module.js';
import { configureApp } from '../../../configure-app.js';
import AuthController from '../../../controllers/auth.controller.js';
import Configuration from '../../../services/Configuration.js';
import DataAccess from '../../../services/DataAccess.js';
import { config, DataAccessMock, readToken } from '../../helpers/TestServer.js';

describe(AuthController.name, () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    sinon.useFakeTimers({ toFake: ['Date'] });
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Configuration)
      .useValue(config)
      .overrideProvider(DataAccess)
      .useValue(new DataAccessMock())
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  function stubGithub() {
    const fetchStub = sinon.stub(globalThis, 'fetch');
    fetchStub.withArgs('https://github.com/login/oauth/access_token').resolves(
      Response.json({
        access_token: 'gho_access_token',
        token_type: 'bearer',
        scope: 'user:email,read:org',
      }),
    );
    fetchStub.withArgs('https://api.github.com/user').resolves(
      Response.json({
        id: 42,
        login: 'dummy',
        name: 'Dummy User',
        avatar_url: 'https://github.com/dummy.jpg',
        url: 'https://api.github.com/users/dummy',
      }),
    );
  }

  /** The dashboard is served over https, behind a TLS terminating proxy. */
  const HTTPS_PROXY_HEADER = ['X-Forwarded-Proto', 'https'] as const;

  function authorizationRequest() {
    return request(app.getHttpServer())
      .get('/api/auth/github')
      .set(...HTTPS_PROXY_HEADER)
      .expect(302);
  }

  async function beginAuthorization() {
    stubGithub();
    const response = await authorizationRequest();
    return {
      cookie: response.headers['set-cookie'],
      state: new URL(response.headers.location).searchParams.get('state')!,
    };
  }

  describe('GET /auth/github', () => {
    it('should redirect to the GitHub authorization endpoint', async () => {
      // Act
      const response = await authorizationRequest();

      // Assert
      const location = new URL(response.headers.location);
      expect(location.origin + location.pathname).eq('https://github.com/login/oauth/authorize');
      expect(location.searchParams.get('client_id')).eq(config.githubClientId);
      expect(location.searchParams.get('redirect_uri')).eq(new URL('/auth/github/callback', config.baseUrl).href);
      expect(location.searchParams.get('response_type')).eq('code');
      expect(location.searchParams.get('scope')).eq('user:email read:org');
      expect(location.searchParams.get('state')).not.eq(null);
    });

    it('should remember the authorization request state in a cookie', async () => {
      // Act
      const response = await authorizationRequest();

      // Assert
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies.some((cookie) => cookie.startsWith('stryker-dashboard-oauth='))).true;
      expect(cookies.some((cookie) => cookie.includes('httponly') && cookie.includes('samesite=strict'))).true;
    });

    it('should mark the state cookie as secure when the dashboard is served over https', async () => {
      // Act
      const response = await authorizationRequest();

      // Assert
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies).lengthOf.greaterThan(0);
      expect(cookies.every((cookie) => cookie.includes('secure'))).true;
    });
  });

  /** Posts the authorization response the way the frontend does, as a form. */
  function exchange(authorizationResponse: Record<string, string>) {
    return request(app.getHttpServer())
      .post('/api/auth/github')
      .set(...HTTPS_PROXY_HEADER)
      .type('form')
      .send(new URLSearchParams(authorizationResponse).toString());
  }

  describe('POST /auth/github', () => {
    it('should exchange the authorization code for a JWT', async () => {
      // Arrange
      const { cookie, state } = await beginAuthorization();

      // Act
      const actual = await exchange({ code: 'the-authorization-code', state }).set('Cookie', cookie).expect(201);

      // Assert
      const { jwt } = actual.body as AuthenticateResponse;
      expect(jwt).not.contain('gho_access_token');
      expect(await readToken(jwt)).contains({
        accessToken: 'gho_access_token',
        displayName: 'Dummy User',
        id: '42',
        username: 'dummy',
      });
    });

    it('should accept the issuer GitHub identifies itself with', async () => {
      // Arrange
      const { cookie, state } = await beginAuthorization();

      // Act & Assert
      await exchange({ code: 'the-authorization-code', state, iss: 'https://github.com/login/oauth' })
        .set('Cookie', cookie)
        .expect(201);
    });

    it('should reject an authorization response from another issuer', async () => {
      // Arrange
      const { cookie, state } = await beginAuthorization();

      // Act & Assert
      await exchange({ code: 'the-authorization-code', state, iss: 'https://github.example.org/login/oauth' })
        .set('Cookie', cookie)
        .expect(401);
    });

    it('should reject an authorization response without the state cookie', async () => {
      // Arrange
      const { state } = await beginAuthorization();

      // Act & Assert
      await exchange({ code: 'the-authorization-code', state }).expect(401);
    });

    it('should reject an authorization response with a mismatching state', async () => {
      // Arrange
      const { cookie } = await beginAuthorization();

      // Act & Assert
      await exchange({ code: 'the-authorization-code', state: 'not-the-expected-state' })
        .set('Cookie', cookie)
        .expect(401);
    });

    it('should reject an authorization response that is not form encoded', async () => {
      // Arrange
      const { cookie, state } = await beginAuthorization();

      // Act & Assert
      await request(app.getHttpServer())
        .post('/api/auth/github')
        .set(...HTTPS_PROXY_HEADER)
        .set('Cookie', cookie)
        .send({ code: 'the-authorization-code', state })
        .expect(401);
    });
  });
});
