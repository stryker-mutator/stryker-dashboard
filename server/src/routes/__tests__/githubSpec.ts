import * as express from 'express';
import * as supertest from 'supertest';

const createToken = jest.fn();
jest.mock('../../security', () => ({ createToken }));

const authenticate = (req, res, next) => {
    req.user = { username: 'dummy' };
    next();
};
jest.mock('passport', () => ({
    authenticate: () => authenticate,
}));

import { requestLog } from '../../utils';
import { GitHubRoutes } from '../github';

const app = express();
const routes = express.Router();
GitHubRoutes.create(routes);
app.use('/', routes);
app.use(requestLog);

const request = supertest(app);

describe('GitHub routes', () => {
    beforeEach(() => {
        
    });

    describe('\'/auth/github\'', () => {
    });
    
    describe('GET /auth/github/callback', () => {
        it('should set a \'jwt\' cookie', () => {
            // Arrange
            const token = 'foo-bar-baz';
            createToken.mockImplementation((user: any) => {
                return Promise.resolve(token);
            });

            // Act
            const response = request
                .get('/auth/github/callback?code=foo')
                .accept('text/htm');

            // Assert
            return response
                .expect(302)
                .expect('set-cookie', /jwt/)
                .expect('set-cookie', new RegExp(token))
                .then((res) => {
                    // console.log(`Response: ${JSON.stringify(res.text)}`);
                });
        })
    });
});
