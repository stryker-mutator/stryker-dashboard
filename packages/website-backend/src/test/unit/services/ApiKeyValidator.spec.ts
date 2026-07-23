import { Project } from '@stryker-mutator/dashboard-data-access';
import { expect } from 'chai';
import sinon from 'sinon';

import { ApiKeyValidator } from '../../../services/ApiKeyValidator.js';
import utils from '../../../utils/utils.js';
import { DataAccessMock } from '../../helpers/TestServer.js';

describe(ApiKeyValidator.name, () => {
  const apiKey = 'the-api-key';
  const projectName = 'github.com/testOrg/testName';
  let sut: ApiKeyValidator;
  let dataAccess: DataAccessMock;

  beforeEach(() => {
    dataAccess = new DataAccessMock();
    sut = new ApiKeyValidator(dataAccess);
  });

  function arrangeProjectWithApiKey(storedApiKey: string) {
    const project = new Project();
    project.apiKeyHash = utils.generateHashValue(storedApiKey);
    dataAccess.repositoryMapper.findOne.resolves({ model: project, etag: 'etag' });
  }

  it('should resolve when the api key matches the stored hash', async () => {
    arrangeProjectWithApiKey(apiKey);

    await sut.validateApiKey(apiKey, projectName);

    sinon.assert.calledWith(dataAccess.repositoryMapper.findOne, { owner: 'github.com/testOrg', name: 'testName' });
  });

  it('should reject with 401 when the api key does not match the stored hash', async () => {
    arrangeProjectWithApiKey('a-different-key');

    await expect(sut.validateApiKey(apiKey, projectName)).to.be.rejectedWith('Invalid API key');
  });

  it('should reject with 401 when the project does not exist', async () => {
    dataAccess.repositoryMapper.findOne.resolves(undefined);

    await expect(sut.validateApiKey(apiKey, projectName)).to.be.rejectedWith('Invalid API key');
  });

  it('should reject with 401 rather than throw when the stored hash has an unexpected length', async () => {
    const project = new Project();
    project.apiKeyHash = 'abcd'; // shorter than a real hash
    dataAccess.repositoryMapper.findOne.resolves({ model: project, etag: 'etag' });

    await expect(sut.validateApiKey(apiKey, projectName)).to.be.rejectedWith('Invalid API key');
  });

  it('should reject with 400 when the project name has no owner separator', async () => {
    await expect(sut.validateApiKey(apiKey, 'nameWithoutSlash')).to.be.rejectedWith(
      'Repository "nameWithoutSlash" is invalid',
    );
  });
});
