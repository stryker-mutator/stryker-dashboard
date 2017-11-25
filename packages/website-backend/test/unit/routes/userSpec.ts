import * as express from 'express';
import * as supertest from 'supertest';
import { User } from '../../../src/model';
import { UserRoutes } from '../../../src/routes/user';

describe('User API routes', () => {

    let request: supertest.SuperTest<supertest.Test>;
    let user: Readonly<User>;

    beforeEach(() => {
        user =  Object.freeze({ accessToken: 'foo', displayName: 'Foo', id: 42, username: 'foo' });
        const app = express();
        const routes = express.Router();
        UserRoutes.create(routes);
        app.use((req, res, next) => {
            req.user = user;
            next();
        });
        app.use('/', routes);
        request = supertest(app);
    });

    describe('GET /api/user', () => {
        it('should return information about the logged in user', () => {
            // Act
            const response = request.get('/api/user');
            const { displayName, username } = user;
            const copy = { displayName, username };

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