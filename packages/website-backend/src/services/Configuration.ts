import { Service } from '@tsed/common';
import { requiredEnvVar, optionalEnvVar } from '../utils';

@Service()
export default class Configuration {

  public readonly githubClientId: string;
  public readonly githubSecret: string;
  public readonly baseUrl: string;
  public readonly jwtSecret: string;
  public readonly isDevelopment: boolean;

  constructor() {
    this.githubClientId = requiredEnvVar('GH_BASIC_CLIENT_ID');
    this.githubSecret = requiredEnvVar('GH_BASIC_SECRET_ID');
    this.isDevelopment = optionalEnvVar('NODE_ENV', 'production') === 'development',
    this.baseUrl = requiredEnvVar('STRYKER_DASHBOARD_BASE_URL');
    this.jwtSecret = requiredEnvVar('JWT_SECRET');
  }
}
