import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as client from 'openid-client';
import { Strategy, type StrategyOptions } from 'openid-client/passport';

import Configuration from '../services/Configuration.js';
import GithubAgent, { GITHUB_BACKEND } from './GithubAgent.js';
import type { Authentication } from './models.js';

const GITHUB_SERVER_METADATA: client.ServerMetadata = Object.freeze({
  issuer: 'https://github.com/login/oauth',
  authorization_endpoint: 'https://github.com/login/oauth/authorize',
  token_endpoint: 'https://github.com/login/oauth/access_token',
  userinfo_endpoint: `${GITHUB_BACKEND}/user`,
});

const SCOPE = 'user:email read:org';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  #logger = new Logger(GithubStrategy.name);
  #agent: GithubAgent;

  constructor(config: Configuration, agent: GithubAgent) {
    super({
      config: new client.Configuration(GITHUB_SERVER_METADATA, config.githubClientId, config.githubSecret),
      callbackURL: `${config.baseUrl}/auth/github/callback`,
      scope: SCOPE,
    } satisfies StrategyOptions);
    this.#agent = agent;
  }

  /**
   * GitHub doesn't hand out an id token, so the user's profile is resolved from the GitHub API.
   */
  async validate(tokens: client.TokenEndpointResponse): Promise<Authentication> {
    this.#logger.debug(`Processing GitHub authentication response`);
    const accessToken = tokens.access_token;
    const user = await this.#agent.getCurrentUser(accessToken);
    return {
      accessToken,
      displayName: user.name,
      id: `${user.id}`,
      username: user.login,
    };
  }
}
