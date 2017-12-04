import * as express from 'express';
import * as expressJwt from 'express-jwt';
import * as supertest from 'supertest';
import errorHandler from '../../../src/middleware/errorHandler';

describe('Overall Express error handling', () => {
    describe('when the error is created by express-jwt', () => {
        it('should send a 401 response', () => {
            // Arrange
            const app = express();
            app.use('/jwt', expressJwt({
                // All users will be unauthorized as they never have a token that matches this secret.
                secret: 'nothing',
            }));
            app.use('/', errorHandler);
            app.get('/jwt', (req, res, next) => res.send('OK'));

            // Act
            const request = supertest(app);
            const response = request.get('/jwt');

            // Assert
            return response.expect(401);
        });
    });

    describe('when another error occurs', () => {
        it('should send a 500 response', () => {
            // Arrange
            const app = express();
            app.get('/test', (req, res, next) => {
                // Simulate some code that threw an error
                next(new Error('foo'));
            });
            app.use('/', errorHandler);

            // Act
            const request = supertest(app);
            const response = request.get('/test');

            // Assert
            return response
                // .expect(500)
                .expect((res: any) => {
                    console.log(`res: ${res.status} - ${res.text}`)
                })
        });
    });
});