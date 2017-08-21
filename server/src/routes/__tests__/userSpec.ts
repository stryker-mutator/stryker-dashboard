import * as express from 'express';
import * as supertest from 'supertest';

import { User } from '../../model';

const user: User = { accessToken: 'foo', displayName: 'Foo', id: 42, username: 'foo' };
const authenticate = (req, res, next) => {
    req.user = user;
    next();
};
jest.mock('passport', () => ({
    authenticate: () => authenticate,
}));

import { UserRoutes } from '../user';

const app = express();
const routes = express.Router();
UserRoutes.create(routes);
app.use('/', routes);

const request = supertest(app);

describe('User API routes', () => {
    describe('GET /api/user', () => {
        it('should return information about the logged in user', () => {
            // Act
            const response = request.get('/api/user');
            const copy = { ...user };
            delete copy.accessToken

            // Assert
            return response
                .expect(200)
                .expect(JSON.stringify(copy))
                .then((res) => {
                    // console.log(`Response: ${JSON.stringify(res.text)}`);
                });
        });
    });
});