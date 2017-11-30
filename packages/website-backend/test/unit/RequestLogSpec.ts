import { RequestLog } from '../../src/RequestLog';
import { expect } from 'chai';

const http = require('node-mocks-http');

const noop = () => { };
describe('RequestLog', () => {
    const response = http.createResponse();
    let sut: RequestLog;
    let logStub: sinon.SinonStub;

    beforeEach(() => {
        logStub = sandbox.stub();
        sut = new RequestLog(logStub as any);
    });

    it('should log the request method', () => {
        // Arrange
        const request = http.createRequest({
            method: 'GET',
        });

        // Act
        sut.middleware()(request, response, noop);

        // Assert
        expect(logStub).calledWithMatch(/GET/);
    });

    it('should log the requested path', () => {
        // Arrange
        const request = http.createRequest({
            method: 'GET',
            path: '/demo',
        });

        // Act
        sut.middleware()(request, response, noop);

        // Assert
        expect(logStub).calledWithMatch(/\/demo/);
    });

    it('should log the query params', () => {
        // Arrange
        const request = http.createRequest({
            method: 'GET',
            path: '/demo',
            query: { foo: 'bar', baz: 'whatever' }
        });

        // Act
        sut.middleware()(request, response, noop);

        // Assert
        expect(logStub).calledWithMatch(/\/demo\?/);
        expect(logStub).calledWithMatch(/foo=bar/);
        expect(logStub).calledWithMatch(/baz=whatever/);
    });

    it('should log the response status code', () => {
        // Arrange
        const request = http.createRequest({
            method: 'GET',
        });

        // Act
        sut.middleware()(request, response, noop);

        // Assert
        expect(logStub).calledWithMatch(/200/);
    });

    it('should invoke the request handling', () => {
        // Arrange
        const next = sandbox.stub();

        // Act
        sut.middleware()(http.createRequest({}), response, next);

        // Assert
        expect(next).called;
    });
});
