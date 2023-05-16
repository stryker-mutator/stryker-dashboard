import { SseServer } from './SseServer.js';
import { SseClient } from './SseClient.js';
import { MutationEventSender } from './MutationEventSender.js';
import { ServerResponse } from 'http';
import { MutantResult } from 'mutation-testing-report-schema';

export class MutationEventServer {
  #mutationEventSenders = new Set<MutationEventSender>();
  #sseServer: SseServer;

  constructor(sseServer: SseServer) {
    this.#sseServer = sseServer;
    this.#sseServer.on('client-connected', (client) =>
      this.#handleClientConnected(client)
    );
    this.#sseServer.on('client-disconnected', (client) =>
      this.#handleClientDisconnected(client)
    );
  }

  public start(): void {
    this.#sseServer.start();
  }

  public attach(res: ServerResponse) {
    this.#sseServer.attach(res);
  }

  public sendMutantTested(mutant: Partial<MutantResult>): void {
    this.#mutationEventSenders.forEach((sender) => {
      sender.sendMutantTested(mutant);
    });
  }

  public sendFinished(): void {
    this.#mutationEventSenders.forEach((sender) => {
      sender.sendFinished();
    });
  }

  public get port(): number {
    const port = this.#sseServer.port;
    if (port === undefined) {
      throw new Error('Server has not been started yet...');
    }
    return port;
  }

  #handleClientConnected(client: SseClient) {
    this.#mutationEventSenders.add(new MutationEventSender(client));
  }

  #handleClientDisconnected(client: SseClient) {
    this.#mutationEventSenders.delete(new MutationEventSender(client));
  }
}
