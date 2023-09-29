import { MutantResult } from 'mutation-testing-report-schema';
import { ServerResponse } from 'http';

export class MutationEventSender {
  #response: ServerResponse;

  constructor(res: ServerResponse, cors: string) {
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
  }

  #destroy() {
    this.#response.destroy();
  }
}
