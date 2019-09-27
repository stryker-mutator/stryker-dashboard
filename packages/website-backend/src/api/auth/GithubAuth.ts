import { Controller, Get, Use, Post } from '@tsed/common';
import passport from 'passport'; import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { createToken, passportAuthenticateGithub } from '../../middleware/securityMiddleware';
import * as utils from '../../utils';
import Configuration from '../../services/Configuration';
import { AuthenticateResponse } from '@stryker-mutator/dashboard-contract';

@Controller('/auth/github')
export default class GithubAuth {

  private readonly log = utils.debug(GithubAuth.name);

  constructor(private readonly config: Configuration) {
  }

  @Get('/')
  public get(request: express.Request, response: express.Response, next: express.NextFunction): void {
    passport.authenticate('github', { scope: ['user:email', 'read:org', 'repo:status'] })(request, response, next);
  }

  @Post('/')
  @Use(passportAuthenticateGithub)
  public async callback(req: Request): Promise<AuthenticateResponse> {
    const jwt = await createToken(req.user, this.config.jwtSecret);
    this.log(`Generated JWT for user ${req.user.username}`);
    return {
      jwt
    };
  }

  @Get('/logout')
  public logout(req: Request, res: Response, next: NextFunction) {
    const cookies = req.cookies || {};
    for (const cookie in cookies) {
      if (!cookies.hasOwnProperty(cookie)) {
        continue;
      }
      res.cookie(cookie, '', { expires: new Date(0) });
    }
    req.logout();
    res.statusCode = 204;
    res.end();
  }
}
