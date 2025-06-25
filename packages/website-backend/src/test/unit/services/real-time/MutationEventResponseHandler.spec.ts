import { expect } from 'chai';
import type { Response } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import type { MutantResult } from 'mutation-testing-report-schema';
import { Socket } from 'net';
import sinon from 'sinon';

import type Configuration from '../../../../services/Configuration.js';
import { MutationEventResponseHandler } from '../../../../services/real-time/MutationEventResponseHandler.js';
import { createResponseStub } from '../../helpers.js';

describe(MutationEventResponseHandler.name, () => {
  const data: Partial<MutantResult> = {
    id: '1',
    status: 'Killed',
    location: {
      start: { line: 1, column: 2 },
      end: { line: 1, column: 2 },
    },
    mutatorName: 'block statement',
  };
  let config: Configuration;
  let responseMock: sinon.SinonStubbedInstance<Response>;
  let responseMock2: sinon.SinonStubbedInstance<Response>;
  let sut: MutationEventResponseHandler;

  beforeEach(() => {
    config = {
      baseUrl: '',
      cors: '',
      githubClientId: '',
      githubSecret: '',
      isDevelopment: true,
      jwtSecret: '',
    };
    responseMock = createResponseStub();
    responseMock2 = createResponseStub();
    sut = new MutationEventResponseHandler(config);
  });

  it('should send mutant-tested event', () => {
    sut.add(responseMock);
    sut.sendMutantTested(data);

    sinon.assert.calledTwice(responseMock.write);
  });

  it('should send mutant-tested event multiple times', () => {
    sut.add(responseMock);
    sut.add(responseMock2);
    sut.sendMutantTested(data);

    sinon.assert.calledTwice(responseMock.write);
    sinon.assert.calledTwice(responseMock2.write);
  });

  it('should send finished multiple times', () => {
    sut.add(responseMock);
    sut.add(responseMock2);
    sut.sendFinished();

    sinon.assert.calledTwice(responseMock.write);
    sinon.assert.calledTwice(responseMock2.write);
  });

  it('should remove response from set when connection closes', () => {
    const response = new ServerResponse(new IncomingMessage(new Socket())) as Response;
    sut.add(response);
    expect(sut.senders).to.eq(1);

    response.emit('close');

    expect(sut.senders).to.eq(0);
  });
});
