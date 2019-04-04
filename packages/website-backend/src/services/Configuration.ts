import { Service } from '@tsed/common';
import { requiredEnvVar, optionalEnvVar } from '../utils';

@Service()
export default class Configuration {

  readonly githubClientId: string;
  readonly githubSecret: string;
  readonly baseUrl: string;
  readonly jwtSecret: string;
  readonly isDevelopment: boolean;

  constructor() {
    this.githubClientId = requiredEnvVar('GH_BASIC_CLIENT_ID');
    this.githubSecret = requiredEnvVar('GH_BASIC_SECRET_ID');
    this.isDevelopment = optionalEnvVar('NODE_ENV', 'production') === 'development',
      this.baseUrl = optionalEnvVar('STRYKER_DASHBOARD_BASE_URL', '');
    this.jwtSecret = requiredEnvVar('JWT_SECRET');
  }
}