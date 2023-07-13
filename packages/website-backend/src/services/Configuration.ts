import { Service } from '@tsed/common';
import util from '../utils.js';

@Service()
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
    (this.isDevelopment =
      util.optionalEnvVar('NODE_ENV', 'production') === 'development'),
      (this.baseUrl = util.requiredEnvVar('STRYKER_DASHBOARD_BASE_URL'));
    this.jwtSecret = util.requiredEnvVar('JWT_SECRET');

    if (this.isDevelopment) {
      this.cors = '*';
    } else {
      this.cors = util.requiredEnvVar('STRYKER_DASHBOARD_CORS');
    }
  }
}
