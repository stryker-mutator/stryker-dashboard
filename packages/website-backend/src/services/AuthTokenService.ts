import { Injectable } from '@nestjs/common';
import { AuthTokenCodec } from '@stryker-mutator/dashboard-common/crypto';

import Configuration from './Configuration.js';

/**
 * Creates and reads the encrypted JWTs (JWE) handed out to the frontend.
 */
@Injectable()
export class AuthTokenService extends AuthTokenCodec {
  constructor(config: Configuration) {
    super(config.jwtSecret);
  }
}
