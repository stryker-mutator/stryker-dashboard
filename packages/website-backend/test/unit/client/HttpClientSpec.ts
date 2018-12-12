import HttpClient, { Response } from '../../../src/client/HttpClient';
import { HttpClient as InnerHttpClient, HttpClientResponse } from 'typed-rest-client/HttpClient';
import * as InnerHttpClientModule from 'typed-rest-client/HttpClient';
import { expect } from 'chai';
import sinon = require('sinon');

describe('HttpClient', () => {

    let sut: HttpClient;
    let innerHttpClientMock: sinon.SinonStubbedInstance<InnerHttpClient>;

    beforeEach(() => {
        innerHttpClientMock = sinon.createStubInstance(InnerHttpClient);
        sut = new HttpClient(innerHttpClientMock as any);
    });

    it('should do the request on `get`', async () => {
        // Arrange
        const message: any = {
            headers: { foo: 'baz' },
            statusCode: 200
        };
        const response: HttpClientResponse = {
            readBody() {
                return Promise.resolve('{ "foo": "bar" }');
            },
            message
        };
        innerHttpClientMock.get.resolves(response);

        // Act
        const actualFooBar = await sut.get<{ foo: string }>('some url');

        // Assert
        const expectedResponse: Response<{ foo: string }> = {
            body: { foo: 'bar' },
            headers: { foo: 'baz' }
        };
        expect(actualFooBar).deep.eq(expectedResponse);
    });

    it('should add a User Agent header', async () => {
        // See https://developer.github.com/v3/#user-agent-required
        sinon.stub(InnerHttpClientModule, 'HttpClient');
        new HttpClient([]);
        expect(InnerHttpClientModule.HttpClient).calledWith('Stryker Dashboard API');
    });
});