import sinon from 'sinon';

import { MutationEventSender } from '../../../../src/services/real-time/MutationEventSender.js';
import { SseClient } from '../../../../src/services/real-time/SseClient.js';
import { MutantResult, MutantStatus } from 'mutation-testing-report-schema';

describe(MutationEventSender.name, () => {
  let clientMock: sinon.SinonStubbedInstance<SseClient>;
  let sut: MutationEventSender;

  beforeEach(() => {
    clientMock = sinon.createStubInstance(SseClient);
    sut = new MutationEventSender(clientMock);
  });

  it('should send mutant-tested correctly', () => {
    const mutant: Partial<MutantResult> = {
      id: '1',
      status: MutantStatus.Pending,
    };

    sut.sendMutantTested(mutant);

    sinon.assert.calledOnceWithExactly(clientMock.send, 'mutant-tested', {
      id: '1',
      status: MutantStatus.Pending,
    });
  });

  it('should send finished correctly', () => {
    sut.sendFinished();

    sinon.assert.calledOnceWithExactly(clientMock.send, 'finished', {});
  });
});
