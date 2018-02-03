import { assert, expect } from "chai";
import * as sinon from 'sinon';
import * as chai from "chai";
import * as sinonchai from "sinon-chai";
import * as dataAccessModule from "stryker-dashboard-data-access";
import { Mock } from '../testHelpers/mock';
import { MutationScoreMapper, MutationScore } from "stryker-dashboard-data-access";
import run = require("../badgeGenerator/badgeGenerator");
import * as helpers from "../helpers/helpers";
import * as fs from 'mz/fs';
import * as path from 'path';

chai.use(sinonchai);

describe('Generating a badge', () => {

    let sandbox: sinon.SinonSandbox;
    let mutationScoreMapperMock: Mock<MutationScoreMapper>;
    let context: any;
    let req: any;
    let getContentStub: sinon.SinonStub;
    let mutationScore: MutationScore;
    let logErrorStub: sinon.SinonStub;
    const unknownBadge = fs.readFileSync(path.resolve(__dirname, '..', 'mutation-score-unknown-lightgrey.svg'), 'utf8');

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mutationScoreMapperMock = sinon.createStubInstance(MutationScoreMapper);
        sandbox.stub(dataAccessModule, 'MutationScoreMapper').returns(mutationScoreMapperMock);

        mutationScore = new MutationScore();
        mutationScore.branch = 'master';
        mutationScore.slug = 'github.com/stryker-mutator/stryker';
        mutationScore.score = 97.8;
        getContentStub = sandbox.stub(helpers, 'getContent');
        logErrorStub = sandbox.stub(helpers, 'logError');

        let mutationScoreNoBranch = new MutationScore();
        mutationScoreNoBranch.slug = 'github/stryker-mutator/stryker';
        mutationScoreNoBranch.score = 79.01;

        mutationScoreMapperMock.select.withArgs('github.com/stryker-mutator/stryker', 'master')
            .resolves(mutationScore);
        mutationScoreMapperMock.select.withArgs('github.com/stryker-mutator/stryker', '')
            .resolves(mutationScoreNoBranch);

        context = {
            log: () => { },
            bindingData: {
                provider: 'github.com',
                owner: 'stryker-mutator',
                repo: 'stryker',
                branch: 'master'
            }
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should return the unknown badge when owner does not exist', async () => {
        // Arrange
        context.bindingData.owner = 'owner-does-not-exist';

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(context.res.body).to.equal(unknownBadge);
    });
    it('Should return the unknown badge when the branch does not exist', async () => {
        // Arrange
        context.bindingData.branch = 'dev';

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(context.res.body).to.equal(unknownBadge);
    });
    it('Should return the unknown badge when storage can not be reached', async () => {
        // Arrange
        const error = new Error('an error');
        mutationScoreMapperMock.select.reset();
        mutationScoreMapperMock.select.throws(error);

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(context.res.body).to.equal(unknownBadge);
        expect(logErrorStub).calledWith(error);
    });
    it('Should return the unknown badge when shields.io returns an empty result', async () => {
        // Arrange
        getContentStub.resolves(undefined);

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(context.res.body).to.equal(unknownBadge);
    });
    it('Should return  the unknown badge when shields.io can not be reached', async () => {
        // Arrange
        const content = 'this really is an image string';
        getContentStub.throws('cannot reach it');
        
        // Act
        await run(context, req);
        
        // Assert
        expect(context.res.status).to.equal(200);
        expect(context.res.body).to.equal(unknownBadge);
    });
    it('Should call shields.io with the correct parameters without branch', async () => {
        // Arrange
        getContentStub.resolves('your image');
        delete context.bindingData.branch;

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(helpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-79.0-orange.svg');
    });
    it('Should call shields.io with the correct parameters', async () => {
        // Arrange
        getContentStub.resolves('your image');

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(helpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-97.8-green.svg');
    });
    it('Should return correct cache headers', async () => {
        // Arrange
        getContentStub.resolves('your image');

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(context.res.headers).to.deep.equal({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Content-Type': 'image/svg+xml'
        });
    });
    it('Should return a green shield with a score >= 80 (rounded to 1 precision)', async () => {
        // Arrange
        getContentStub.resolves('green');
        mutationScore.score = 79.95;

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(helpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-80.0-green.svg');
    });
    it('Should return an orange shield with a 60 <= score < 80 (rounded to 1 precision)', async () => {
        // Arrange
        getContentStub.resolves('orange');
        mutationScore.score = 79.9465;

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(helpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-79.9-orange.svg');
    });
    it('Should return an orange shield with a score = 60 (rounded to 1 precision)', async () => {
        // Arrange
        getContentStub.resolves('orange');
        mutationScore.score = 59.95;

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(helpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-60.0-orange.svg');
    });
    it('Should return a red shield with a score < 60', async () => {
        // Arrange
        getContentStub.resolves('red');
        mutationScore.score = 59.9;

        // Act
        await run(context, req);

        // Assert
        expect(context.res.status).to.equal(200);
        expect(helpers.getContent).calledWith('https://img.shields.io/badge/mutation%20score-59.9-red.svg');
    });
});    