import { Controller, Get, Use, Post } from '@tsed/common';
import passport from 'passport';
import express from 'express';
import { Request } from 'express';
import { AuthenticateResponse } from '@stryker-mutator/dashboard-contract';
import {
  createToken,
  passportAuthenticateGithub,
} from '../../middleware/securityMiddleware.js';
import Configuration from '../../services/Configuration.js';
import debug from 'debug';

@Controller('/auth/github')
export default class GithubAuth {
  private readonly log = debug(GithubAuth.name);

  constructor(private readonly config: Configuration) {}

  @Get('/')
  public get(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): void {
    passport.authenticate('github', { scope: ['user:email', 'read:org'] })(
      request,
      response,
      next
    );
  }

  @Post('/')
  @Use(passportAuthenticateGithub)
  public async callback(req: Request): Promise<AuthenticateResponse> {
    const jwt = await createToken(req.user!, this.config.jwtSecret);
    this.log(`Generated JWT for user ${req.user!.username}`);
    return {
      jwt,
    };
  }
}
