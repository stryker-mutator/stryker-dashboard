import { Injectable } from '@nestjs/common';

import util from '../utils/utils.js';

@Injectable()
export default class Configuration {
  public readonly cors: string;
  public readonly githubClientId: string;
  public readonly githubSecret: string;
  public readonly baseUrl: string;
  public readonly jwtSecret: string;
  public readonly isDevelopment: boolean;

  constructor() {
    this.githubClientId = util.requiredEnvVar('GH_BASIC_CLIENT_ID');
    this.githubSecret = util.requiredEnvVar('GH_BASIC_SECRET_ID');
    this.isDevelopment = util.optionalEnvVar('NODE_ENV', 'production') === 'development';
    this.baseUrl = util.requiredEnvVar('STRYKER_DASHBOARD_BASE_URL');
    this.jwtSecret = util.requiredEnvVar('JWT_SECRET');

    this.cors = util.requiredEnvVar('STRYKER_DASHBOARD_BASE_URL');
  }
}
