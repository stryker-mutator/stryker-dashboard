import * as debug from 'debug';
import expressJwt = require('express-jwt');
import jwt = require('jsonwebtoken');
import * as passport from 'passport';
import { Strategy } from 'passport-github2';
import * as express from 'express';

import Configuration from '../services/Configuration';
import { Authentication } from '../github/models';

export const githubStrategy = (): Strategy => {
    const config = new Configuration();
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
    const config = new Configuration();
    const middleware = expressJwt({
        getToken: (request) => {
            return request.cookies.jwt;
        },
        secret: config.jwtSecret
    })
    return middleware.unless({ path: [ '/', '/auth/github', '/auth/github/callback' ] })
}

const options = { algorithm: 'HS512', audience: 'stryker', expiresIn: '30m', issuer: 'stryker' }
export const createToken = (user: Authentication, jwtSecret: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(user, jwtSecret, options, (err, encoded) => {
            if (err) reject(err);
            resolve(encoded);
        });
    });
}


export function passportAuthenticateGithub(req: express.Request, res: express.Response, next: express.NextFunction){
    return passport.authenticate('github')(req, res, next);
}