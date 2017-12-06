import { assert, expect } from "chai";
import * as sinon from 'sinon';
import * as chai from "chai";
import * as sinonchai from "sinon-chai";
import * as dataAccessModule from "stryker-dashboard-data-access";
import { Mock } from '../testHelpers/mock';
import { MutationScoreMapper, MutationScore } from "stryker-dashboard-data-access";
import { run } from "../badgeGenerator/badgeGenerator";
import * as badgeGenerator from "../badgeGenerator/badgeGenerator";
import * as httpHelpers from "../helpers/httpHelpers";

chai.use(sinonchai);

describe('Generating a badge', () => {

    let sandbox: sinon.SinonSandbox;
    let mutationScoreMapperMock: Mock<MutationScoreMapper>;
    let context: any;
    let req: any;
    let mutationScore: MutationScore;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mutationScoreMapperMock = sinon.createStubInstance(MutationScoreMapper);
        sandbox.stub(dataAccessModule, 'MutationScoreMapper').returns(mutationScoreMapperMock);

        mutationScore = new MutationScore();
        mutationScore.branch = 'master';
        mutationScore.slug = 'github/stryker-mutator/stryker';
        mutationScore.score = 97.8;

        let mutationScoreNoBranch = new MutationScore();
        mutationScoreNoBranch.slug = 'github/stryker-mutator/stryker';
        mutationScoreNoBranch.score = 79;

        mutationScoreMapperMock.selectSingleEntity.withArgs('github/stryker-mutator', 'stryker/master')
            .resolves(mutationScore);
        mutationScoreMapperMock.selectSingleEntity.withArgs('github/stryker-mutator', 'stryker')
            .resolves(mutationScoreNoBranch);

        context = {
            log: () => { },
            bindingData: {
                provider: 'github',
                owner: 'stryker-mutator',
                repo: 'stryker',
                branch: 'master'
            }
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should return a http 400 error when slug can not be found', async () => {
        // Arrange
        context.bindingData.owner = 'owner-does-not-exist';

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(400);
    }),
        it('Should return a http 400 error when the combination of slug & branch can not be found', async () => {
            // Arrange
            context.bindingData.branch = 'dev';

            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(400);
        }),
        it('Should return a http 500 error when storage can not be reached', async () => {
            // Arrange
            mutationScoreMapperMock.selectSingleEntity.reset();
            mutationScoreMapperMock.selectSingleEntity.throws("error");

            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(500);
        }),
        it('Should return a http 500 error when shields.io returns an empty result', async () => {
            // Arrange
            sandbox.stub(httpHelpers, 'getContent').resolves(undefined);

            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(500);
        }),
        it('Should return a http 500 error when shields.io can not be reached', async () => {
            // Arrange
            const content = 'this really is an image string';
            sandbox.stub(httpHelpers, 'getContent').throws('cannot reach it');

            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(500);
        }),
        it('Should call shields.io with the correct parameters without branch', async () => {
            // Arrange
            sandbox.stub(httpHelpers, 'getContent').resolves('your image');
            delete context.bindingData.branch;

            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(200);
            expect(httpHelpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-79-orange.svg');
        }),
        it('Should call shields.io with the correct parameters', async () => {
            // Arrange
            sandbox.stub(httpHelpers, 'getContent').resolves('your image');

            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(200);
            expect(httpHelpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-97.8-green.svg');
        }),
        it('Should return correct cache headers', async () => {
            // Arrange
            sandbox.stub(httpHelpers, 'getContent').resolves('your image');

            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(200);
            expect(context.res.headers).to.deep.equal({
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            });
        }),
        it('Should return a green shield with a score >= 80', async () => {
            // Arrange
            sandbox.stub(httpHelpers, 'getContent').resolves('green');
            mutationScore.score= 80;
            
            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(200);
            expect(httpHelpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-80-green.svg');
        }),
        it('Should return an orange shield with a 60 <= score < 80', async () => {
            // Arrange
            sandbox.stub(httpHelpers, 'getContent').resolves('orange');
            mutationScore.score= 79.9;
            
            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(200);
            expect(httpHelpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-79.9-orange.svg');
        }),
        it('Should return an orange shield with a score = 60', async () => {
            // Arrange
            sandbox.stub(httpHelpers, 'getContent').resolves('orange');
            mutationScore.score= 60;
            
            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(200);
            expect(httpHelpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-60-orange.svg');
        }),
        it('Should return a red shield with a score < 60', async () => {
            // Arrange
            sandbox.stub(httpHelpers, 'getContent').resolves('red');
            mutationScore.score= 59.9;

            // Act
            await run(context, req);

            // Assert
            expect(context.res.status).to.equal(200);
            expect(httpHelpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-59.9-red.svg');
        });
});    