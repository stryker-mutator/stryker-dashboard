import { expect } from 'chai';

import MutationtEventServerOrchestrator from '../../../../src/services/real-time/MutationtEventServerOrchestrator.js';
import { ReportIdentifier } from '@stryker-mutator/dashboard-common';

describe(MutationtEventServerOrchestrator.name, () => {
  let id: ReportIdentifier;
  let orchestrator: MutationtEventServerOrchestrator;

  beforeEach(() => {
    id = {
      projectName: 'abc',
      version: 'v1',
      moduleName: 'logger',
      realTime: true,
    };
    orchestrator = new MutationtEventServerOrchestrator();
  });

  it('should have no servers on initialization', () => {
    expect(orchestrator.servers).to.be.eq(0);
  });

  it('should create servers when there is not one avaiable', () => {
    orchestrator.getSseInstanceForProject(id);

    expect(orchestrator.servers).to.be.eq(1);
  });

  it('should not create new servers when there is already one present', () => {
    orchestrator.getSseInstanceForProject(id);
    orchestrator.getSseInstanceForProject(id);
    orchestrator.getSseInstanceForProject(id);

    expect(orchestrator.servers).to.be.eq(1);
  });
});
