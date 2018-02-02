import { expect } from 'chai';
import RepositoriesController from '../../../src/api/RepositoriesController';
import testServer, { RepositoryServiceStub } from '../../helpers/TestServer';
import { SuperTest, Test } from 'supertest';
import { githubFactory } from '../../helpers/producers';
import * as utils from '../../../src/utils';
import * as github from '../../../src/github/models';
import * as bodyParser from 'body-parser';

describe('RepositoriesController', () => {

    let request: SuperTest<Test>;
    let generateHashStub: sinon.SinonStub;
    let generateApiKeyStub: sinon.SinonStub;
    let auth: github.Authentication;

    beforeEach(async () => {
        auth = githubFactory.authentication({ accessToken: 'foobar access token', username: 'user' });
        generateApiKeyStub = sandbox.stub(utils, 'generateApiKey');
        generateHashStub = sandbox.stub(utils, 'generateHashValue');
        request = await testServer(RepositoriesController, auth, bodyParser.json());
    });

    describe('PATCH /github/:owner/:name', () => {

        it('should enable the repository with a new api key if enabled = true', async () => {
            RepositoryServiceStub.update.resolves();
            generateHashStub.returns('hashed api key');
            generateApiKeyStub.returns('foobar-api-key');
            await request.patch('/repositories/github.com/foo/bar')
                .send({ enabled: true })
                .expect(200)
                .expect({ apiKey: 'foobar-api-key' });
            expect(generateHashStub).calledWith('foobar-api-key');
            expect(RepositoryServiceStub.update).calledWith(auth, 'foo', 'bar', true, 'hashed api key');
        });

        it('should disable the repository if enabled = false', async () => {
            RepositoryServiceStub.update.resolves();
            await request.patch('/repositories/github.com/foo/bar')
                .send({ enabled: false })
                .expect(204);
            expect(generateApiKeyStub).not.called;
            expect(RepositoryServiceStub.update).calledWith(auth, 'foo', 'bar', false);
        });

        it('should result in 400 when enabled is not present', async () => {
            await request.patch('/repositories/github.com/foo/bar')
                .send({ enabledIsMissing: true })
                .expect(400)
                .expect('PATCH is only allowed for the `enabled` property');
        });
    });

});