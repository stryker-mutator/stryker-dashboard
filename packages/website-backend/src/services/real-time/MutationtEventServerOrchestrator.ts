import { createServer } from 'http';
import { MutationEventServer } from './mutation-event-server.js';
import { SseServer } from './sse-server.js';

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
}

const instance = new MutationtEventServerOrchestrator();

export { instance };
