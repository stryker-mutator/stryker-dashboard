import { Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { GithubAuthGuard } from '../auth/guard.js';

@Controller('/auth')
export default class AuthController {
  #logger = new Logger(AuthController.name);
  #jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.#jwtService = jwtService;
  }

  @Get('/github')
  @UseGuards(GithubAuthGuard)
  public get() {
    // This route will redirect to the GitHub auth, using the AuthGuard, no implementation needed
  }

  @Post('/github')
  @UseGuards(GithubAuthGuard)
  public post(@Req() request: Request) {
    const jwt = this.#jwtService.sign(request.user!, {});
    this.#logger.log(`Generated JWT for user ${request.user!.username}`);
    return {
      jwt,
    };
  }
}
