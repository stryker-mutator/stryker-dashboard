import * as express from 'express';
import * as supertest from 'supertest';
import { User } from '../../../src/model';
import { RepositoryRoutes } from '../../../src/routes/repository';
import { expect } from 'chai';
import { SuperTest, Test } from 'supertest';
import * as github from '../../../src/github';

describe('Repository API routes', () => {

    let retrieveRepositories: sinon.SinonStub;
    let request: SuperTest<Test>;
    let user: User;

    beforeEach(() => {
        user = { accessToken: 'foo', displayName: 'Foo', id: 42, username: 'foo' };
        const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            req.user = user;
            next();
        };
        retrieveRepositories = sandbox.stub(github, 'retrieveRepositories');
        const app = express();
        const routes = express.Router();
        RepositoryRoutes.create(routes);
        app.use(authenticate);
        app.use('/', routes);

        request = supertest(app);
    });

    describe('GET /api/repository', () => {

        it('should invoke GitHub API to retrieve repository', () => {
            retrieveRepositories.resolves();
            const response = request.get('/api/repository');
            
            // Assert
            return response.expect(() => {
                expect(retrieveRepositories).calledWith(user);
            });
        });

        it('should return projects', () => {
            // Arrange
            const projects: never[] = [];
            retrieveRepositories.resolves(projects);

            // Act
            const response = request.get('/api/repository');

            // Assert
            return response
                .expect(200)
                .expect(projects);
        });
    });
});