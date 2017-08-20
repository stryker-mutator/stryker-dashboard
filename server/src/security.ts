import expressJwt = require('express-jwt');
import jwt = require('jsonwebtoken');

import config from './configuration';
import { User } from './model'

// Configure JWT middleware to persist user details in browser.
export const middleware = () => {
    const middleware = expressJwt({
        getToken: (request) => {
            return request.cookies.jwt;
        },
        secret: config.jwtSecret
    })
    return middleware.unless({ path: [ '/', '/auth/github', '/auth/github/callback' ] })
}

const options = { algorithm: 'HS512', audience: 'stryker', expiresIn: '30m', issuer: 'stryker' }
export const createToken = (user: User): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(user, config.jwtSecret, options, (err, encoded) => {
            if (err) reject(err);
            resolve(encoded);
        });
    });
}
