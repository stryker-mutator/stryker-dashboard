import { EventEmitter } from 'events';
import type { Response } from 'express';
import type { MutantResult } from 'mutation-testing-report-schema';

export class MutationEventSender extends EventEmitter {
  #response: Response;

  constructor(res: Response, cors: string) {
    super();

    this.#response = res;
    this.#response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': cors,
    });
    this.#response.on('close', () => this.#destroy());
  }

  public sendMutantTested(mutant: Partial<MutantResult>): void {
    this.#send('mutant-tested', mutant);
  }

  public sendFinished(): void {
    this.#send('finished', {});
  }

  #send<T>(event: string, payload: T): void {
    this.#response.write(`event: ${event}\n`);
    this.#response.write(`data: ${JSON.stringify(payload)}\n\n`);
    this.#response.flush();
  }

  #destroy() {
    this.#response.destroy();
    this.emit('destroyed');
  }
}
