import { Injectable, Logger } from '@nestjs/common';
import { AuthTokenCodec } from '@stryker-mutator/dashboard-common/crypto';

import Configuration from './Configuration.js';

/**
 * Creates and reads the encrypted JWTs (JWE) handed out to the frontend.
 */
@Injectable()
export class AuthTokenService extends AuthTokenCodec {
  constructor(config: Configuration) {
    new Logger(AuthTokenService.name).debug('Initializing AuthTokenService');
    super(config.jwtSecret);
  }
}
