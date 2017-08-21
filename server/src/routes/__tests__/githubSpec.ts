import cookieParser = require('cookie-parser');
import * as express from 'express';
import * as supertest from 'supertest';

const createToken = jest.fn();
jest.mock('../../security', () => ({ createToken }));

const logout = jest.fn();
const authenticate = (req, res, next) => {
    req.user = { username: 'dummy' };
    req.logout = logout;
    next();
};
jest.mock('passport', () => ({
    authenticate: () => authenticate,
}));

import { GitHubRoutes } from '../github';

const app = express();
const routes = express.Router();
GitHubRoutes.create(routes);
app.use(cookieParser());
app.use('/', routes);

const request = supertest(app);

describe('GitHub routes', () => {
    describe('GET /logout', () => {
        it('should redirect to /', () => {
            // Arrange
            const token = 'foo-bar-baz';
            createToken.mockImplementation((user: any) => {
                return Promise.resolve(token);
            });

            // Act
            const response = request.get('/logout')
                .set('Cookie', 'jwt=jfdskl');

            // Assert
            return response
                .expect(302)
                .expect('location', '/')
                .then((res) => {
                    // console.log(`Response: ${JSON.stringify(res.text)}`);
                });
        });

        it('should delete the \'jwt\' cookie', () => {
            // Act
            const response = request.get('/logout')
                .set('Cookie', 'jwt=jfdskl');

            // Assert
            return response
                .expect(302)
                .expect('set-cookie', /jwt/)
                .expect('set-cookie', /Expires=Thu, 01 Jan 1970 00:00:00 GMT/)
                .then((res) => {
                    // console.log(`Response: ${JSON.stringify(res.text)}`);
                });
        });
        
        it('should end the session', () => {
            // Act
            const response = request.get('/logout')
                .set('Cookie', 'jwt=jfdskl');

            // Assert
            return response
                .then((res) => {
                    expect(logout).toHaveBeenCalled();
                });
        });
    });
    
    describe('GET /auth/github/callback', () => {
        it('should set a \'jwt\' cookie', () => {
            // Arrange
            const token = 'foo-bar-baz';
            createToken.mockImplementation((user: any) => {
                return Promise.resolve(token);
            });

            // Act
            const response = request.get('/auth/github/callback?code=foo');

            // Assert
            return response
                .expect(302)
                .expect('set-cookie', /jwt/)
                .expect('set-cookie', new RegExp(token))
                .then((res) => {
                    // console.log(`Response: ${JSON.stringify(res.text)}`);
                });
        });

        it('should redirect to /', () => {
            // Arrange
            const token = 'foo-bar-baz';
            createToken.mockImplementation((user: any) => {
                return Promise.resolve(token);
            });

            // Act
            const response = request.get('/auth/github/callback?code=foo');

            // Assert
            return response
                .expect(302)
                .expect('location', '/')
                .then((res) => {
                    // console.log(`Response: ${JSON.stringify(res.text)}`);
                });
        });
    });
});
