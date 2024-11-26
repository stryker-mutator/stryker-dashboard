import type { Response } from 'express';
import type { MutantResult } from 'mutation-testing-report-schema';

import type Configuration from '../Configuration.js';
import { MutationEventSender } from './MutationEventSender.js';

export class MutationEventResponseHandler {
  #config: Configuration;
  #mutationEventSenders = new Set<MutationEventSender>();

  constructor(config: Configuration) {
    this.#config = config;
  }

  public add(res: Response) {
    const eventSender = new MutationEventSender(res, this.#config.cors);
    eventSender.on('destroyed', () => {
      this.#remove(eventSender);
    });

    this.#mutationEventSenders.add(eventSender);
  }

  #remove(eventSender: MutationEventSender) {
    this.#mutationEventSenders.delete(eventSender);
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

  public get senders() {
    return this.#mutationEventSenders.size;
  }
}
