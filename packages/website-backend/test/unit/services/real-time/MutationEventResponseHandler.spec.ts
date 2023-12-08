import { IncomingMessage, ServerResponse } from 'http';

import sinon from 'sinon';

import { MutationEventResponseHandler } from '../../../../src/services/real-time/MutationEventResponseHandler.js';
import { MutantResult, MutantStatus } from 'mutation-testing-report-schema';
import Configuration from '../../../../src/services/Configuration.js';
import { expect } from 'chai';
import { Socket } from 'net';

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
  let responseMock: sinon.SinonStubbedInstance<ServerResponse>;
  let responseMock2: sinon.SinonStubbedInstance<ServerResponse>;
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
    responseMock = sinon.createStubInstance(ServerResponse);
    responseMock2 = sinon.createStubInstance(ServerResponse);
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
    const response = new ServerResponse(new IncomingMessage(new Socket()));
    sut.add(response);
    expect(sut.senders).to.eq(1);

    response.emit('close');

    expect(sut.senders).to.eq(0);
  });
});
