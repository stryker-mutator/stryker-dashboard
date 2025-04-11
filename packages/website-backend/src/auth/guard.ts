import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Slug } from '@stryker-mutator/dashboard-common';
import type { Request } from 'express';

import { ApiKeyValidator } from '../services/ApiKeyValidator.js';
import { parseSlug } from '../utils/utils.js';

/**
 * Verify GitHub OAuth2 flow
 */
@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {}

/**
 * Verify a JWT token, returns 401 if the token is invalid or missing
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

const API_KEY_HEADER = 'X-Api-Key';
/**
 * Verify the API key for the given path. Path must have a param :slug
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  #apiKeyValidator: ApiKeyValidator;

  constructor(apiKeyValidator: ApiKeyValidator) {
    this.#apiKeyValidator = apiKeyValidator;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authorizationHeader = this.#extractTokenFromHeader(request);
    if (!authorizationHeader) {
      throw new UnauthorizedException(`Provide an "${API_KEY_HEADER}" header`);
    }

    const { project } = this.#extractSlugFromRequest(request);
    await this.#apiKeyValidator.validateApiKey(authorizationHeader, project);

    return true;
  }

  #extractSlugFromRequest(request: Request): Slug {
    const slugArr = request.params.slug as unknown as undefined | string[];
    return parseSlug(slugArr?.join('/') ?? '');
  }

  #extractTokenFromHeader(request: Request) {
    return request.headers['x-api-key'] as string | undefined;
  }
}

/**
 * Combines the JwtAuthGuard and the ApiKeyGuard. If the ApiKeyGuard fails, the JwtAuthGuard is tried.
 *
 * @note Do not use this if you need `request.user` as it is not set by the ApiKeyGuard
 */
@Injectable()
export class JwtOrApiKeyGuard implements CanActivate {
  #jwtAuthGuard: JwtAuthGuard;
  #apiKeyGuard: ApiKeyGuard;

  constructor(jwtAuthGuard: JwtAuthGuard, apiKeyGuard: ApiKeyGuard) {
    this.#jwtAuthGuard = jwtAuthGuard;
    this.#apiKeyGuard = apiKeyGuard;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      try {
        return await this.#apiKeyGuard.canActivate(context);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return (await this.#jwtAuthGuard.canActivate(context)) as boolean;
      }
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException(`Provide a valid "${API_KEY_HEADER}" or JWT authorization header`);
      } else {
        throw e;
      }
    }
  }
}
