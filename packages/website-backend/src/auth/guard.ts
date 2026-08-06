import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Slug } from '@stryker-mutator/dashboard-common';
import type { Request } from 'express';
import { AuthorizationResponseError, ClientError, ResponseBodyError } from 'openid-client';

import { ApiKeyValidator } from '../services/ApiKeyValidator.js';
import { parseSlug } from '../utils/utils.js';

const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

/**
 * Verify GitHub OAuth2 flow
 */
@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {
  /**
   * Rejects an authorization response that openid-client cannot read at all, before passport gets to it.
   */
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.method === 'POST' && !request.is(FORM_CONTENT_TYPE)) {
      throw new UnauthorizedException(`The authorization response must be posted as "${FORM_CONTENT_TYPE}"`);
    }
    return super.canActivate(context) as Promise<boolean>;
  }

  /**
   * Returns 401 for any openid-client errors
   */
  override handleRequest<TUser>(
    err: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    if (
      err instanceof ClientError ||
      err instanceof AuthorizationResponseError ||
      err instanceof ResponseBodyError ||
      err instanceof TypeError
    ) {
      throw new UnauthorizedException(err.message);
    }
    return super.handleRequest(err, user, info, context, status);
  }
}

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
