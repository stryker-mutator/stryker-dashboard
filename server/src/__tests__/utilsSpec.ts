import * as express from 'express';

const debug = jest.fn();
jest.mock('debug', () => (() => debug));

const http = require('node-mocks-http');

import { requestLog } from '../utils';

describe('Utility methods', () => {
    describe('requestLog()', () => {
        const response = http.createResponse();
    
        afterEach(() => debug.mockReset());
    
        it('should log the request method', () => {
            // Arrange
            const request = http.createRequest({
                method: 'GET',
            });
    
            // Act
            requestLog(request, response, jest.fn());
    
            // Assert
            expect(debug.mock.calls[0][0]).toMatch(/GET/);
        });
    
        it('should log the requested path', () => {
            // Arrange
            const request = http.createRequest({
                method: 'GET',
                path: '/demo',
            });
    
            // Act
            requestLog(request, response, jest.fn());
    
            // Assert
            expect(debug.mock.calls[0][0]).toMatch(/\/demo/);
        });
    
        it('should log the query params', () => {
            // Arrange
            const request = http.createRequest({
                method: 'GET',
                path: '/demo',
                query: { foo: 'bar', baz: 'whatever' }
            });
    
            // Act
            requestLog(request, response, jest.fn());
    
            // Assert
            expect(debug.mock.calls[0][0]).toMatch(/\/demo\?/);
            expect(debug.mock.calls[0][0]).toMatch(/foo=bar/);
            expect(debug.mock.calls[0][0]).toMatch(/baz=whatever/);
        });
    
        it('should log the response status code', () => {
            // Arrange
            const request = http.createRequest({
                method: 'GET',
            });
    
            // Act
            requestLog(request, response, jest.fn());
    
            // Assert
            expect(debug.mock.calls[0][0]).toMatch(/-> 200/);
        });
    
        it('should invoke the request handling', () => {
            // Arrange
            const next = jest.fn();
    
            // Act
            requestLog(http.createRequest({}), response, next);
    
            // Assert
            expect(next).toHaveBeenCalled();
        });
    });
});
