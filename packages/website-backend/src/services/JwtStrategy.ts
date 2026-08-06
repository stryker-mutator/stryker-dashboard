import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import type passport from 'passport';

import type { Authentication } from '../github/models.js';
import { AuthTokenService } from './AuthTokenService.js';

const BEARER_TOKEN = /^Bearer (.+)$/i;

type Verified = (error: unknown, user?: Authentication | false) => void;
type Verify = (claims: Authentication, verified: Verified) => void;
type Created = passport.StrategyCreated<AuthTokenStrategy, AuthTokenStrategy & passport.StrategyCreatedStatic>;

/**
 * Reads the encrypted JWT (JWE) from the `Authorization` header.
 *
 * @note The fields are not `#private`, passport invokes `authenticate` on an object that inherits
 * from this strategy and private fields aren't reachable through the prototype chain.
 */
class AuthTokenStrategy {
  readonly name = 'jwt';
  readonly tokens: AuthTokenService;
  readonly verify: Verify;

  constructor(tokens: AuthTokenService, verify: Verify) {
    this.tokens = tokens;
    this.verify = verify;
  }

  /**
   * [Passport method] Authenticate the request.
   */
  async authenticate(this: Created, req: Request): Promise<void> {
    const token = BEARER_TOKEN.exec(req.headers.authorization ?? '')?.[1];
    if (!token) {
      this.fail('Provide a bearer token', 401);
      return;
    }

    let claims: Authentication;
    try {
      claims = await this.tokens.read<Authentication>(token);
    } catch {
      this.fail('Invalid bearer token', 401);
      return;
    }

    this.verify(claims, (error, user) => {
      if (error) {
        this.error(error instanceof Error ? error : new Error('Could not verify the bearer token'));
      } else if (user) {
        this.success(user);
      } else {
        this.fail('Invalid bearer token', 401);
      }
    });
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(AuthTokenStrategy, 'jwt') {
  constructor(tokens: AuthTokenService) {
    super(tokens);
  }

  validate(claims: Authentication): Authentication {
    return {
      accessToken: claims.accessToken,
      displayName: claims.displayName,
      id: claims.id,
      username: claims.username,
    };
  }
}
