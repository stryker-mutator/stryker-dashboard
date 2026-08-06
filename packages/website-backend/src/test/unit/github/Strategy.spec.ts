import { expect } from 'chai';
import sinon from 'sinon';

import GithubAgent from '../../../github/GithubAgent.js';
import { GithubStrategy } from '../../../github/Strategy.js';
import { githubFactory } from '../../helpers/producers.js';
import { config } from '../../helpers/TestServer.js';

describe(GithubStrategy.name, () => {
  let agentMock: sinon.SinonStubbedInstance<GithubAgent>;
  let sut: GithubStrategy;

  beforeEach(() => {
    agentMock = sinon.createStubInstance(GithubAgent);
    sut = new GithubStrategy(config, agentMock);
  });

  describe('validate', () => {
    it('should resolve the GitHub profile with the access token', async () => {
      // Arrange
      agentMock.getCurrentUser.resolves(githubFactory.user({ id: 42, login: 'foobar', name: 'Foo Bar' }));

      // Act
      const actual = await sut.validate({ access_token: 'the-access-token' } as never);

      // Assert
      expect(actual.accessToken).eq('the-access-token');
      expect(actual.displayName).eq('Foo Bar');
      expect(actual.id).eq('42');
      expect(actual.username).eq('foobar');
      sinon.assert.calledWithExactly(agentMock.getCurrentUser, 'the-access-token');
    });

    it('should allow a GitHub user without a display name', async () => {
      // Arrange
      agentMock.getCurrentUser.resolves(githubFactory.user({ name: null }));

      // Act
      const actual = await sut.validate({ access_token: 'the-access-token' } as never);

      // Assert
      expect(actual.displayName).eq(null);
    });
  });
});
