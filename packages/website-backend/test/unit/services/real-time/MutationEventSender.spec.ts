import sinon from 'sinon';

import { MutationEventSender } from '../../../../src/services/real-time/MutationEventSender.js';
import { Response } from 'express';
import { MutantResult } from 'mutation-testing-report-schema';
import { createResponseStub } from '../../helpers.js';

describe(MutationEventSender.name, () => {
  let responseMock: sinon.SinonStubbedInstance<Response>;
  let cors: string;
  let sut: MutationEventSender;

  beforeEach(() => {
    responseMock = createResponseStub();
    cors = 'my-cors';
    sut = new MutationEventSender(responseMock, cors);
  });

  it('should respond immediately with the correct HTTP SSE response', () => {
    sinon.assert.calledOnce(responseMock.on);
    sinon.assert.calledOnceWithExactly(responseMock.writeHead, 200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': cors,
    });
  });

  it('should write correctly when sending a mutant-tested event', () => {
    const mutant: Partial<MutantResult> = {
      id: '1',
      status: 'Pending',
    };

    sut.sendMutantTested(mutant);

    sinon.assert.calledTwice(responseMock.write);
    sinon.assert.calledWith(responseMock.write, 'event: mutant-tested\n');
    sinon.assert.calledWith(
      responseMock.write,
      'data: {"id":"1","status":"Pending"}\n\n',
    );
  });

  it('should write correctly when sending a finished event', () => {
    sut.sendFinished();

    sinon.assert.calledTwice(responseMock.write);
    sinon.assert.calledWith(responseMock.write, 'event: finished\n');
    sinon.assert.calledWith(responseMock.write, 'data: {}\n\n');
  });

  it('should call the destroy method when a connection closes', () => {
    const spy = sinon.spy();

    sut.on('destroyed', () => {
      spy('stryker was here!');
    });

    responseMock.on.firstCall.args[1]();
    sinon.assert.calledOnce(responseMock.destroy);
    sinon.assert.calledOnce(spy);
  });
});
