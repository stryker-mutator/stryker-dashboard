import { MutationEventSender } from './MutationEventSender.js';
import { MutantResult } from 'mutation-testing-report-schema';
import Configuration from '../Configuration.js';
import type { Response } from 'express';

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
