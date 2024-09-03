import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import Configuration from './Configuration.js';
import { Authentication } from '../github/models.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configuration: Configuration) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration.jwtSecret,
    });
  }

  validate(payload: Authentication) {
    return {
      accessToken: payload.accessToken,
      displayName: payload.displayName,
      id: payload.id,
      username: payload.username,
    };
  }
}
