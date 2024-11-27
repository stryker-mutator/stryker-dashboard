import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

import Configuration from '../services/Configuration.js';
import type { Authentication } from './models.js';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  #logger = new Logger(GithubStrategy.name);
  constructor(config: Configuration) {
    super({
      callbackURL: `${config.baseUrl}/auth/github/callback`,
      clientID: config.githubClientId,
      clientSecret: config.githubSecret,
      scope: ['user:email', 'read:org'],
    });
  }

  validate(accessToken: string, _refreshToken: string, profile: Profile): Authentication {
    this.#logger.debug('Processing incoming OAuth 2 tokens');
    return {
      accessToken,
      displayName: profile.displayName,
      id: profile.id,
      username: profile.username!,
    };
  }
}
