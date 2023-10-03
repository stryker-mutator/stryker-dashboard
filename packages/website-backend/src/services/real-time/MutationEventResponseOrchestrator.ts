import { MutationEventResponseHandler as MutationEventResponseHandler } from './MutationEventResponseHandler.js';
import { Service } from '@tsed/di';
import { ReportIdentifier } from '@stryker-mutator/dashboard-common';
import Configuration from '../Configuration.js';

@Service()
export default class MutationEventResponseOrchestrator {
  #responseHandlers = new Map<string, MutationEventResponseHandler>();
  #config: Configuration;

  constructor(config: Configuration) {
    this.#config = config;
  }

  createOrGetResponseHandler(
    identifier: ReportIdentifier
  ): MutationEventResponseHandler {
    const id = this.#toId(identifier);
    if (!this.#responseHandlers.has(id)) {
      return this.#createResponseHandler(id);
    }

    return this.#responseHandlers.get(id)!;
  }

  removeResponseHandler(identifier: ReportIdentifier) {
    const id = this.#toId(identifier);
    this.#responseHandlers.delete(id);
  }

  #toId(identifier: ReportIdentifier) {
    let id = `${identifier.projectName};${identifier.version}`;
    if (identifier.moduleName) {
      id = `${id};${identifier.moduleName}`;
    }
    if (identifier.realTime) {
      id = `${id};real-time`;
    }
    return id;
  }

  #createResponseHandler(id: string): MutationEventResponseHandler {
    const server = new MutationEventResponseHandler(this.#config);
    this.#responseHandlers.set(id, server);
    return server;
  }

  public get handlers() {
    return this.#responseHandlers.size;
  }
}
