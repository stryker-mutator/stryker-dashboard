import * as debug from 'debug';
import expressJwt = require('express-jwt');
import jwt = require('jsonwebtoken');
import * as passport from 'passport';
import { Strategy } from 'passport-github2';

import configuration from './configuration';
import { User } from './model'

export const githubStrategy = (): Strategy => {
    const config = configuration();
    const options = {
        callbackURL: `${config.baseUrl}/auth/github/callback`,
        clientID: config.githubClientId,
        clientSecret: config.githubSecret,
    };
    const callback = (accessToken: string, refreshToken: string, profile: passport.Profile, done: Function) => {
        debug('auth')('Processing incoming OAuth 2 tokens');
        const user = {
            accessToken: accessToken,
            displayName: profile.displayName,
            id: profile.id,
            username: profile.username,
        };
        return done(null, user);
    };
    return new Strategy(options, callback);
}

// Configure JWT middleware to persist user details in browser.
export const securityMiddleware = () => {
    const config = configuration();
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
    const config = configuration();
    return new Promise<string>((resolve, reject) => {
        jwt.sign(user, config.jwtSecret, options, (err, encoded) => {
            if (err) reject(err);
            resolve(encoded);
        });
    });
}
