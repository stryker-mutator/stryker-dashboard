import HttpClient, { Response } from '../../../src/client/HttpClient';
import { HttpClient as InnerHttpClient, HttpClientResponse } from 'typed-rest-client/HttpClient';
import * as InnerHttpClientModule from 'typed-rest-client/HttpClient';
import { Mock, createMock } from '../../helpers/mock';
import { expect } from 'chai';


describe('HttpClient', () => {

    let sut: HttpClient;
    let innerHttpClientMock: Mock<InnerHttpClient>;

    beforeEach(() => {
        innerHttpClientMock = createMock(InnerHttpClient);
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
            headers: { foo: 'baz' },
            body: { foo: 'bar' }
        };
        expect(actualFooBar).deep.eq(expectedResponse);
    });

    it('should add a User Agent header', async () => {
        // See https://developer.github.com/v3/#user-agent-required
        sandbox.stub(InnerHttpClientModule, 'HttpClient');
        new HttpClient([]);
        expect(InnerHttpClientModule.HttpClient).calledWith('Stryker Dashboard API');
    });
});