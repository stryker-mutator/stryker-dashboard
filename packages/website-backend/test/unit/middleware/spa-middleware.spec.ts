import { spa } from '../../../src/middleware/spaMiddleware';
import { Request, Response, NextFunction } from 'express';
import * as sinon from 'sinon';
import { expect } from 'chai';

describe('spa middleware', () => {
  let sut: (req: Pick<Request, 'url' | 'method'>, res: Pick<Response, 'send'>, next: NextFunction) => void;
  let responseStub: sinon.SinonStubbedInstance<Pick<Response, 'send'>>;
  let nextStub: sinon.SinonStub;

  beforeEach(() => {
    responseStub = { send: sinon.stub()};
    sut = spa('frontend-html');
    nextStub = sinon.stub();
  });

  it('should allow urls starting with /api', () => {
    sut({ url: '/api/reports/github.com/stryker-mutator/stryker-net/0.5', method: 'GET' }, responseStub, nextStub);
    expect(responseStub.send).not.called;
    expect(nextStub).called;
  });

  it('should allow http POST requests', () => {
    sut({ url: '/reports/github.com/stryker-mutator/stryker-net/0.5', method: 'POST' }, responseStub, nextStub);
    expect(responseStub.send).not.called;
    expect(nextStub).called;
  });

  it('should send the index.html file when url doesn\'t start with "/api"', () => {
    sut({ url: '/reports/github.com/stryker-mutator/stryker-net/0.5', method: 'GET' }, responseStub, nextStub);
    expect(nextStub).not.called;
    expect(responseStub.send).calledWith('frontend-html');
  });

});
