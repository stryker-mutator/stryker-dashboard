import { assert, expect } from "chai";
import * as sinon from "sinon";
import { Project, ProjectMapper, MutationScoreMapper, MutationScore } from "stryker-dashboard-data-access";
import * as dataAccessModule from "stryker-dashboard-data-access";
import * as chai from "chai";
import * as sinonchai from "sinon-chai";
import { run } from "./scoreProcessor";

chai.use(sinonchai);

type Mock<T> = {
  [K in keyof T]: sinon.SinonStub;
};

describe('Posting a Score', () => {
  let sandbox: sinon.SinonSandbox;
  let projectMapperStub: Mock<ProjectMapper>;
  let mutationScoreMapperMock: Mock<MutationScoreMapper>;
  let context: any;
  let req: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    projectMapperStub = sinon.createStubInstance(ProjectMapper);
    mutationScoreMapperMock = sinon.createStubInstance(MutationScoreMapper);

    sandbox.stub(dataAccessModule, 'ProjectMapper').returns(projectMapperStub);
    sandbox.stub(dataAccessModule, 'MutationScoreMapper').returns(mutationScoreMapperMock);

    const project = new Project();
    project.apiKeyHash = '05fb610008ccb620142a795f198e85d3984e61c997e7f8074d871cabb8309ec1';
    project.owner = 'github/stryker-mutator';
    project.name = 'stryker';

    projectMapperStub.selectSingleEntity.resolves(project);

    context = {
      log: () => { }
    };

    req = {
      body: {
        apiKey: 'this is my api key',
        repositorySlug: 'github/stryker-mutator/stryker',
        branch: 'master',
        mutationScore: 97.8
      }
    };

  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should not accept an empty request.", async () => {
    // arrange
    const req: any = {};

    // act
    await run(context, req);

    // assert
    expect(context.res.status).to.equal(400);
  }),
    it('should fail when no slug is provided.', async () => {
      // Arrange
      req.body.repositorySlug = undefined;

      // Act
      await run(context, req);

      // Assert
      expect(context.res.status).to.equal(400);
    }),
    it('should fail when no score is provided.', async () => {
      // Arrange
      req.body.mutationScore = undefined;

      // Act
      await run(context, req);

      // Assert
      expect(context.res.status).to.equal(400);
    }),
    it('should fail when no API key is provided.', async () => {
      // Arrange
      req.body.apiKey = undefined;

      // Act
      await run(context, req);

      // Assert
      expect(context.res.status).to.equal(400);
    }),
    it('should save the mutation score.', async () => {
      // arrange
      const expectedMutationScore = new MutationScore();
      expectedMutationScore.branch = 'master';
      expectedMutationScore.slug = 'github/stryker-mutator/stryker';
      expectedMutationScore.score = 97.8;

      mutationScoreMapperMock.insertOrMergeEntity.resolves();

      // act
      await run(context, req);

      // assert
      expect(mutationScoreMapperMock.insertOrMergeEntity).calledWith(expectedMutationScore);
      expect(context.res.status).to.equal(201);
    }),
    it('should throw a permission denied when an invalid API key is used', async () => {
      // Arrange
      req.body.apiKey = 'this is an invalid API key';

      // Act
      await run(context, req);

      // Assert
      expect(context.res.status).to.equal(403);
    })
});