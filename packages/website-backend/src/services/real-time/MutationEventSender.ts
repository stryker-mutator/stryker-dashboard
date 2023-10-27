import { MutantResult } from 'mutation-testing-report-schema';
import { SseClient } from './SseClient.js';

export class MutationEventSender {
  #client: SseClient;

  constructor(client: SseClient) {
    this.#client = client;
  }

  public sendMutantTested(mutant: Partial<MutantResult>): void {
    this.#client.send('mutant-tested', mutant);
  }

  public sendFinished(): void {
    this.#client.send('finished', {});
  }
}
