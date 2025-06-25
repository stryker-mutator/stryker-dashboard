import { expect } from 'chai';
import sinon from 'sinon';

import type { Response } from '../../../client/HttpClient.js';
import HttpClient from '../../../client/HttpClient.js';

describe('HttpClient', () => {
  let sut: HttpClient;
  let fetchStub: sinon.SinonStubbedMember<typeof fetch>;

  beforeEach(() => {
    // For some reason we have to call globalThis.fetch before stubbing it. Since node 20.12.0
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    globalThis.fetch;
    fetchStub = sinon.stub(globalThis, 'fetch');
    sut = new HttpClient();
  });

  it('should do the request on `fetchJson`', async () => {
    // Arrange
    const response = new globalThis.Response('{"foo":"bar"}', {
      headers: { foo: 'baz', 'Content-Type': 'application/json' },
    });
    fetchStub.resolves(response);

    // Act
    const actualFooBar = await sut.fetchJson<{ foo: string }>('some url');

    // Assert
    const expectedResponse: Response<{ foo: string }> = {
      body: { foo: 'bar' },
      headers: new Headers({ 'content-type': 'application/json', foo: 'baz' }),
    };
    expect(actualFooBar.body).deep.eq(expectedResponse.body);
    expectedResponse.headers.forEach((value, key) => {
      expect(actualFooBar.headers.get(key)).deep.eq(value);
    });
  });
});
