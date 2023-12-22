import HttpClient, { Response } from '../../../src/client/HttpClient.js';
import utils from '../../../src/utils/utils.js';
import { expect } from 'chai';
import sinon from 'sinon';
import fetch, { Response as NodeFetchResponse, Headers } from 'node-fetch';

describe('HttpClient', () => {
  let sut: HttpClient;
  let fetchStub: sinon.SinonStubbedMember<typeof fetch>;

  beforeEach(() => {
    fetchStub = sinon.stub(utils, 'fetch');
    sut = new HttpClient();
  });

  it('should do the request on `fetchJson`', async () => {
    // Arrange
    const response = new NodeFetchResponse('{"foo":"bar"}', {
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
