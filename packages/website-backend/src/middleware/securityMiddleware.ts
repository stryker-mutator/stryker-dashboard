import debug from 'debug';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy } from 'passport-github2';
import express from 'express';

import Configuration from '../services/Configuration.js';
import { Authentication } from '../github/models.js';
import { Middleware, Req, Res, Next, MiddlewareMethods } from '@tsed/common';

export const githubStrategy = (config: Configuration): Strategy => {
  const options = {
    callbackURL: `${config.baseUrl}/auth/github/callback`,
    clientID: config.githubClientId,
    clientSecret: config.githubSecret,
  };
  const callback = (
    accessToken: string,
    _refreshToken: string,
    profile: passport.Profile,
    done: (error: any, user?: any) => void
  ) => {
    debug('auth')('Processing incoming OAuth 2 tokens');
    const user = {
      accessToken,
      displayName: profile.displayName,
      id: profile.id,
      username: profile.username,
    };
    return done(null, user);
  };
  return new Strategy(options, callback);
};

@Middleware()
export class GithubSecurityMiddleware implements MiddlewareMethods {
  private readonly requestHandler: ReturnType<typeof expressjwt>;
  constructor(configuration: Configuration) {
    this.requestHandler = expressjwt({
      getToken(req) {
        const authHeader = req.header('authorization');
        if (authHeader) {
          const [scheme, value] = authHeader.split(' ');
          if (scheme === 'Bearer') {
            return value;
          }
        }
        return;
      },
      algorithms: [tokenOptions.algorithm],
      secret: configuration.jwtSecret,
      requestProperty: 'user',
    });
  }

  public use(
    @Req() request: express.Request,
    @Res() response: express.Response,
    @Next() next: express.NextFunction
  ) {
    this.requestHandler(request, response, next);
  }
}

const tokenOptions = Object.freeze({
  algorithm: 'HS512',
  audience: 'stryker',
  expiresIn: '30m',
  issuer: 'stryker',
} as const);
export const createToken = (
  user: Authentication,
  jwtSecret: string
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(user, jwtSecret, tokenOptions, (err, encoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(encoded!);
      }
    });
  });
};

export function passportAuthenticateGithub(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  return passport.authenticate('github', { session: false })(req, res, next);
}
