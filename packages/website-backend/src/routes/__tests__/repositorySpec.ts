import * as express from 'express';
import * as supertest from 'supertest';

const retrieveRepositories = jest.fn(() => Promise.resolve());

jest.mock('../../github', () => ( { retrieveRepositories } ));

import { User } from '../../model';

const user: User = { accessToken: 'foo', displayName: 'Foo', id: 42, username: 'foo' };
const authenticate = (req, res, next) => {
    req.user = user;
    next();
};

import { RepositoryRoutes } from '../repository';

const app = express();
const routes = express.Router();
RepositoryRoutes.create(routes);
app.use(authenticate);
app.use('/', routes);

const request = supertest(app);

describe('Repository API routes', () => {
    describe('GET /api/repository', () => {
        afterEach(() => {
            retrieveRepositories.mockReset();
        });

        it('should invoke GitHub API to retrieve repository', () => {
            const response = request.get('/api/repository');

            // Assert
            return response.expect((res, err) => {
                expect(retrieveRepositories).toHaveBeenCalled();
                expect(retrieveRepositories.mock.calls[0][0]).toBe(user);
            });
        });

        it('should return projects', () => {
            // Arrange
            const projects = [];
            retrieveRepositories.mockImplementation(() => Promise.resolve(projects));

            // Act
            const response = request.get('/api/repository');

            // Assert
            return response
                .expect(200)
                .expect(projects);
        });
    });
});