import { expect } from 'chai';

import MutationEventResponseOrchestrator from '../../../../src/services/real-time/MutationEventResponseOrchestrator.js';
import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import { ConfigurationStub } from '../../../helpers/TestServer.js';

describe(MutationEventResponseOrchestrator.name, () => {
  let id: ReportIdentifier;
  let orchestrator: MutationEventResponseOrchestrator;

  beforeEach(() => {
    id = {
      projectName: 'abc',
      version: 'v1',
      moduleName: 'logger',
      realTime: true,
    };
    orchestrator = new MutationEventResponseOrchestrator(
      new ConfigurationStub()
    );
  });

  it('should have no handlers on initialization', () => {
    expect(orchestrator.handlers).to.be.eq(0);
  });

  it('should create handler when there is not one avaiable', () => {
    orchestrator.createOrGetResponseHandler(id);

    expect(orchestrator.handlers).to.be.eq(1);
  });

  it('should create multiple handlers when ids do not match', () => {
    orchestrator.createOrGetResponseHandler(id);
    orchestrator.createOrGetResponseHandler({ ...id, projectName: 'def' });

    expect(orchestrator.handlers).to.be.eq(2);
  });

  it('should not create new handlers when there is already one present', () => {
    orchestrator.createOrGetResponseHandler(id);
    orchestrator.createOrGetResponseHandler(id);
    orchestrator.createOrGetResponseHandler(id);

    expect(orchestrator.handlers).to.be.eq(1);
  });

  it('should remove handler with the given id', () => {
    orchestrator.createOrGetResponseHandler(id);
    orchestrator.createOrGetResponseHandler({ ...id, projectName: 'def' });
    orchestrator.removeResponseHandlers(id);

    expect(orchestrator.handlers).to.be.eq(1);
  });
});
