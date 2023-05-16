import { createServer } from 'http';
import { MutationEventServer } from './MutationEventServer.js';
import { SseServer } from './SseServer.js';
import { Service } from '@tsed/di';

@Service()
export default class MutationtEventServerOrchestrator {
  #mutationEventServers = new Map<string, MutationEventServer>();

  getSseInstanceForProject(projectPath: string): MutationEventServer {
    if (!this.#mutationEventServers.has(projectPath)) {
      return this.#createMutationEventServer(projectPath);
    }

    return this.#mutationEventServers.get(projectPath)!;
  }

  #createMutationEventServer(projectPath: string): MutationEventServer {
    const server = new MutationEventServer(new SseServer(createServer()));
    this.#mutationEventServers.set(projectPath, server);
    return server;
  }

  public get servers() {
    return this.#mutationEventServers.size;
  }
}
