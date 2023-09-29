import { MutationEventSender } from './MutationEventSender.js';
import { MutantResult } from 'mutation-testing-report-schema';
import Configuration from '../Configuration.js';
import { ServerResponse } from 'http';

export class MutationEventResponseHandler {
  #config: Configuration;
  #mutationEventSenders = new Set<MutationEventSender>();

  constructor(config: Configuration) {
    this.#config = config;
  }

  public add(res: ServerResponse) {
    this.#mutationEventSenders.add(
      new MutationEventSender(res, this.#config.cors)
    );
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
}
