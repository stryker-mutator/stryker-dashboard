import debug from 'debug';
import expressJwt = require('express-jwt');
import jwt = require('jsonwebtoken');
import passport from 'passport';
import { Strategy } from 'passport-github2';
import express from 'express';

import Configuration from '../services/Configuration';
import { Authentication } from '../github/models';
import { Middleware, IMiddleware, Req, Res, Next } from '@tsed/common';

export const githubStrategy = (): Strategy => {
  const config = new Configuration();
  const options = {
    callbackURL: `${config.baseUrl}/auth/github/callback`,
    clientID: config.githubClientId,
    clientSecret: config.githubSecret
  };
  const callback = (accessToken: string, _refreshToken: string, profile: passport.Profile, done: (error: any, user?: any) => void) => {
    debug('auth')('Processing incoming OAuth 2 tokens');
    const user = {
      accessToken,
      displayName: profile.displayName,
      id: profile.id,
      username: profile.username
    };
    return done(null, user);
  };
  return new Strategy(options, callback);
};

@Middleware()
export class GithubSecurityMiddleware implements IMiddleware {

  private readonly requestHandler: expressJwt.RequestHandler;
  constructor(configuration: Configuration) {
    this.requestHandler = expressJwt({
      getToken(request) {
        return request.cookies.jwt;
      },
      secret: configuration.jwtSecret
    });
  }

  public use(@Req() request: express.Request, @Res() response: express.Response, @Next() next: express.NextFunction ) {
    this.requestHandler(request, response, next);
  }
}

const tokenOptions = { algorithm: 'HS512', audience: 'stryker', expiresIn: '30m', issuer: 'stryker' };
export const createToken = (user: Authentication, jwtSecret: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(user, jwtSecret, tokenOptions, (err, encoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(encoded);
      }
    });
  });
};

export function passportAuthenticateGithub(req: express.Request, res: express.Response, next: express.NextFunction) {
  return passport.authenticate('github')(req, res, next);
}
