import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import Configuration from './Configuration.js';

const tokenOptions = Object.freeze({
  algorithm: 'HS512',
  audience: 'stryker',
  expiresIn: '30m',
  issuer: 'stryker',
} as const);

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  #jwtSecret: string;

  constructor(configuration: Configuration) {
    this.#jwtSecret = configuration.jwtSecret;
  }

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.#jwtSecret,
      signOptions: {
        algorithm: tokenOptions.algorithm,
        audience: tokenOptions.audience,
        issuer: tokenOptions.issuer,
        expiresIn: tokenOptions.expiresIn,
      },
    };
  }
}
