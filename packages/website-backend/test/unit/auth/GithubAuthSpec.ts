import { expect } from 'chai';
import * as passport from 'passport';
import cookieParser = require('cookie-parser');
import * as supertest from 'supertest';
import GithubAuth from '../../../src/auth/GithubAuth';
import * as security from '../../../src/middleware/securityMiddleware';
import testServer from '../../helpers/TestServer';

describe('GitHubAuth', () => {

    let createTokenStub: sinon.SinonStub;
    let request: supertest.SuperTest<supertest.Test>;
    let logoutStub: sinon.SinonStub;
    let authenticateStub: sinon.SinonStub;
    let authenticateMiddleware: sinon.SinonStub;

    beforeEach(async () => {
        createTokenStub = sandbox.stub(security, 'createToken');
        authenticateStub = sandbox.stub(passport, 'authenticate');
        authenticateMiddleware = sandbox.stub();
        logoutStub = sandbox.stub();
        authenticateStub.returns(authenticateMiddleware);
        const passThroughMiddleware = (req: any, res: any, next: any) => {
            req.user = { username: 'dummy' };
            req.logout = logoutStub;
            next();
        };
        authenticateMiddleware.callsFake(passThroughMiddleware);
        request = await testServer(GithubAuth, undefined, passThroughMiddleware, cookieParser());
    });

    describe('GET /logout', () => {
        it('should redirect to /', () => {
            // Arrange
            const token = 'foo-bar-baz';
            createTokenStub.resolves(token)

            // Act
            const response = request.get('/github/logout')
                .set('Cookie', 'jwt=jfdskl');

            // Assert
            return response
                .expect(302)
                .expect('location', '/');
        });

        it('should delete the \'jwt\' cookie', () => {
            // Act
            const response = request.get('/github/logout')
                .set('Cookie', 'jwt=jfdskl');

            // Assert
            return response
                .expect(302)
                .expect('set-cookie', /jwt/)
                .expect('set-cookie', /Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
        });

        it('should end the session', async () => {
            // Act
            const response = request.get('/github/logout')
                .set('Cookie', 'jwt=jfdskl');

            // Assert
            await response;
            expect(logoutStub).called;
        });
    });

    describe('GET /auth/github/callback', () => {
        it('should set a \'jwt\' cookie', async () => {
            // Arrange
            const token = 'foo-bar-baz';
            createTokenStub.resolves(token);

            // Act
            const response = request.get('/github/callback?code=foo');

            // Assert
            await response
                .expect(302)
                .expect('set-cookie', /jwt/)
                .expect('set-cookie', new RegExp(token));
            expect(authenticateMiddleware).called;
        });

        it('should redirect to /', () => {
            // Arrange
            const token = 'foo-bar-baz';
            createTokenStub.resolves(token);

            // Act
            const response = request.get('/github/callback?code=foo');

            // Assert
            return response
                .expect(302)
                .expect('location', '/');
        });
    });
});
