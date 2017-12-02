import { assert, expect } from "chai";
import * as sinon from "sinon";
import ScoreProcessor from "./ScoreProcessor";
import { Project } from "stryker-dashboard-data-access";
import ProjectMapper from "../../data-access/src/ProjectMapper";
import MutationScoreMapper from "../../data-access/src/MutationScoreMapper";

describe('postScoreFunction', () => {
  it("Should validate incoming request data", () => {
    // arrange
    const context : any = {};
    const req : any = { };

    // act
    new ScoreProcessor().process(context, req, sinon.createStubInstance(ProjectMapper), sinon.createStubInstance(MutationScoreMapper));

    // assert
    expect(context.res.status).to.equal(400); 
  }),
  it('Should save score', () => {
    // arrange
    const sandbox = sinon.createSandbox();
    let projectMapperStub : sinon.SinonStub = sinon.createStubInstance(ProjectMapper);

    const context : any = {};
    const req : any = { body: {
      apiKey: 'this is my api key',
      repositorySlug: 'github/stryker-mutator/stryker'
    }};

    const project = new Project();
    project.apiKeyHash = '05fb610008ccb620142a795f198e85d3984e61c997e7f8074d871cabb8309ec1';
    project.owner = 'github/stryker-mutator';
    project.name = 'stryker';

    sandbox.stub(ProjectMapper, "prototype");

    // act
    new ScoreProcessor().process(context, req);

    // assert

    expect(context.res.status).to.equal(201);         
  });
});