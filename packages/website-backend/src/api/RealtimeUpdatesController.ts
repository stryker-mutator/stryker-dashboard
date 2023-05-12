import { BodyParams, Get, Post, Req, Res, Response } from '@tsed/common';
import { Controller } from '@tsed/di';
import { Request } from 'express';
import { instance } from '../services/real-time/MutationtEventServerOrchestrator.js';
import { MutantResult } from '@stryker-mutator/api/core';
import { Slug } from '@stryker-mutator/dashboard-common';

@Controller('/real-time')
// TODO: we should validate on the POST endpoint
// @UseBefore(GithubSecurityMiddleware)
export default class RealtimeUpdatesController {
  @Get('/*')
  public getSseEndpointForProject(@Req() req: Request, @Res() res: Response) {
    const { project } = Slug.parse(req.path);
    const server = instance.getSseInstanceForProject(project);
    server.attach(res);
  }

  @Post('/*')
  public UpdateBatch(
    @Req() req: Request,
    @BodyParams() result: Array<Partial<MutantResult>>
  ) {
    const { project } = Slug.parse(req.path);
    const server = instance.getSseInstanceForProject(project);

    result.forEach((mutant) => {
      server.sendMutantTested(mutant);
    });
  }
}
