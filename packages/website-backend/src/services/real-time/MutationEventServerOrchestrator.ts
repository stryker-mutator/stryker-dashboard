import { createServer } from 'http';
import { MutationEventServer } from './MutationEventServer.js';
import { SseServer } from './SseServer.js';
import { Service } from '@tsed/di';
import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import Configuration from '../Configuration.js';

@Service()
export default class MutationEventServerOrchestrator {
  #mutationEventServers = new Map<string, MutationEventServer>();
  #configuration: Configuration;

  constructor(configuration: Configuration) {
    this.#configuration = configuration;
  }

  getSseInstanceForProject(identifier: ReportIdentifier): MutationEventServer {
    const id = this.#toId(identifier);
    if (!this.#mutationEventServers.has(id)) {
      return this.#createMutationEventServer(id);
    }

    return this.#mutationEventServers.get(id)!;
  }

  #toId(identifier: ReportIdentifier) {
    return Object.values(identifier).join(';');
  }

  #createMutationEventServer(id: string): MutationEventServer {
    const server = new MutationEventServer(
      new SseServer(createServer(), this.#configuration.cors)
    );
    this.#mutationEventServers.set(id, server);
    return server;
  }

  public get servers() {
    return this.#mutationEventServers.size;
  }
}
