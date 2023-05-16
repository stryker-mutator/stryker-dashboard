import { expect } from 'chai';

import MutationtEventServerOrchestrator from '../../../../src/services/real-time/MutationtEventServerOrchestrator.js';

describe(MutationtEventServerOrchestrator.name, () => {
  let orchestrator: MutationtEventServerOrchestrator;

  beforeEach(() => {
    orchestrator = new MutationtEventServerOrchestrator();
  });

  it('should have no servers on initialization', () => {
    expect(orchestrator.servers).to.be.eq(0);
  });

  it('should create servers when there is not one avaiable', () => {
    orchestrator.getSseInstanceForProject('my-project');

    expect(orchestrator.servers).to.be.eq(1);
  });

  it('should not create new servers when there is already one present', () => {
    orchestrator.getSseInstanceForProject('my-project');
    orchestrator.getSseInstanceForProject('my-project');
    orchestrator.getSseInstanceForProject('my-project');

    expect(orchestrator.servers).to.be.eq(1);
  });
});
