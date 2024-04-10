import { NextFunction, Request, Response } from 'express';
import Configuration from '../services/Configuration.js';
import { Controller, Get, Logger, Next, Post, Req, Res } from '@nestjs/common';
import passport from 'passport';
import { createToken } from '../middleware/security.middleware.js';

@Controller('/auth')
export default class AuthController {
  #logger = new Logger(AuthController.name);
  #config: Configuration;

  constructor(config: Configuration) {
    this.#config = config;
  }

  @Get('/github')
  public get(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {
    passport.authenticate('github', { scope: ['user:email', 'read:org'] })(request, response, next);
  }

  @Post('/github')
  public async post(@Req() request: Request) {
    const jwt = await createToken(request.user!, this.#config.jwtSecret);
    this.#logger.log(`Generated JWT for user ${request.user!.username}`);
    return {
      jwt,
    };
  }
}
