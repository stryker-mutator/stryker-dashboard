import { spa } from '../../../src/middleware/spa.middleware.js';
import { Request, Response, NextFunction } from 'express';
import * as sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';

describe('spa middleware', () => {
  let sut: (
    req: Pick<Request, 'url' | 'method'>,
    res: Pick<Response, 'send'>,
    next: NextFunction
  ) => void;
  let responseStub: sinon.SinonStubbedInstance<Pick<Response, 'send'>>;
  let nextStub: sinon.SinonStub;
  let readFileStub: sinon.SinonStubbedMember<typeof fs.readFile>;

  beforeEach(() => {
    responseStub = { send: sinon.stub() };
    sut = spa('frontend/index.html');
    nextStub = sinon.stub();
    readFileStub = sinon.stub(fs, 'readFile');
  });

  it('should allow urls starting with /api', () => {
    sut(
      {
        url: '/api/reports/github.com/stryker-mutator/stryker-net/0.5',
        method: 'GET',
      },
      responseStub,
      nextStub
    );
    expect(responseStub.send).not.called;
    expect(nextStub).called;
  });

  it('should allow http POST requests', () => {
    sut(
      {
        url: '/reports/github.com/stryker-mutator/stryker-net/0.5',
        method: 'POST',
      },
      responseStub,
      nextStub
    );
    expect(responseStub.send).not.called;
    expect(nextStub).called;
  });

  it('should send the index.html file when url doesn\'t start with "/api"', () => {
    // Arrange
    readFileStub.callsArgWith(2, undefined, 'frontend-html');

    // Act
    sut(
      {
        url: '/reports/github.com/stryker-mutator/stryker-net/0.5',
        method: 'GET',
      },
      responseStub,
      nextStub
    );

    // Assert
    expect(nextStub).not.called;
    expect(responseStub.send).calledWith('frontend-html');
    expect(readFileStub).calledWith(
      'frontend/index.html',
      'utf-8',
      sinon.match.func
    );
  });

  it("should report error if index.html file doesn't exist", () => {
    // Arrange
    const expectedError = new Error('Expected file not exist error');
    readFileStub.callsArgWith(2, expectedError);

    // Act
    sut(
      {
        url: '/reports/github.com/stryker-mutator/stryker-net/0.5',
        method: 'GET',
      },
      responseStub,
      nextStub
    );

    // Assert
    expect(nextStub).calledWith(expectedError);
    expect(responseStub.send).not.called;
  });
});
