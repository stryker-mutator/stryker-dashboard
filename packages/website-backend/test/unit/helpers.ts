import { Response } from 'express';
import { ServerResponse } from 'http';
import sinon from 'sinon';

/**
 * Create a express Response stub from a ServerResponse class instance.
 * Probably missing methods compared to the real Response instance, feel free to add them as needed :)
 */
export function createResponseStub(): sinon.SinonStubbedInstance<Response> {
  const stub = sinon.createStubInstance(ServerResponse) as sinon.SinonStubbedInstance<Response>;
  stub.flush = sinon.stub();
  return stub;
}
