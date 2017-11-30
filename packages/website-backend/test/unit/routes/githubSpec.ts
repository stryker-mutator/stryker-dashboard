import cookieParser = require('cookie-parser');
import * as express from 'express';
import * as supertest from 'supertest';
import { GitHubRoutes } from '../../../src/routes/github';
import * as security from '../../../src/security';
import { expect } from 'chai';
import * as passport from 'passport';
import * as configuration from '../../../src/configuration';
import { config } from '../../helpers/producers';

describe('GitHub routes', () => {

    let createTokenStub: sinon.SinonStub;
    let request: supertest.SuperTest<supertest.Test>;
    let logoutStub: sinon.SinonStub;
    let authenticateStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox.stub(configuration, 'default').returns(config());
        
        createTokenStub = sandbox.stub(security, 'createToken');
        const app = express();
        const routes = express.Router();
        authenticateStub = sandbox.stub(passport, 'authenticate');
        logoutStub = sandbox.stub();
        const authenticate = (req: any, res: any, next: any) => {
            req.user = { username: 'dummy' };
            req.logout = logoutStub;
            next();
        };
        authenticateStub.returns(authenticate);
        GitHubRoutes.create(routes);
        app.use(cookieParser());
        app.use(authenticate);
        app.use('/', routes);
        request = supertest(app);
    });

    describe('GET /logout', () => {
        it('should redirect to /', () => {
            // Arrange
            const token = 'foo-bar-baz';
            createTokenStub.resolves(token)

            // Act
            const response = request.get('/logout')
                .set('Cookie', 'jwt=jfdskl');

            // Assert
            return response
                .expect(302)
                .expect('location', '/');
        });

        it('should delete the \'jwt\' cookie', () => {
            // Act
            const response = request.get('/logout')
                .set('Cookie', 'jwt=jfdskl');

            // Assert
            return response
                .expect(302)
                .expect('set-cookie', /jwt/)
                .expect('set-cookie', /Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
        });

        it('should end the session', async () => {
            // Act
            const response = request.get('/logout')
                .set('Cookie', 'jwt=jfdskl');

            // Assert
            await response;
            expect(logoutStub).called;
        });
    });

    describe('GET /auth/github/callback', () => {
        it('should set a \'jwt\' cookie', () => {
            // Arrange
            const token = 'foo-bar-baz';
            createTokenStub.resolves(token);

            // Act
            const response = request.get('/auth/github/callback?code=foo');

            // Assert
            return response
                .expect(302)
                .expect('set-cookie', /jwt/)
                .expect('set-cookie', new RegExp(token));
        });

        it('should redirect to /', () => {
            // Arrange
            const token = 'foo-bar-baz';
            createTokenStub.resolves(token);

            // Act
            const response = request.get('/auth/github/callback?code=foo');

            // Assert
            return response
                .expect(302)
                .expect('location', '/');
        });
    });
});
