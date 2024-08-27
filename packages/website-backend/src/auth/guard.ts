import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
