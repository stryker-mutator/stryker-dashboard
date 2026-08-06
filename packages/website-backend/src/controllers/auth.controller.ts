import { Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { GithubAuthGuard } from '../auth/guard.js';
import { AuthTokenService } from '../services/AuthTokenService.js';

@Controller('/auth')
export default class AuthController {
  #logger = new Logger(AuthController.name);
  #tokens: AuthTokenService;

  constructor(tokens: AuthTokenService) {
    this.#tokens = tokens;
  }

  @Get('/github')
  @UseGuards(GithubAuthGuard)
  public get() {
    // This route will redirect to the GitHub auth, using the AuthGuard, no implementation needed
  }

  @Post('/github')
  @UseGuards(GithubAuthGuard)
  public async post(@Req() request: Request) {
    const jwt = await this.#tokens.create({ ...request.user! });
    this.#logger.log(`Generated JWT for user ${request.user!.username}`);
    return { jwt };
  }
}
