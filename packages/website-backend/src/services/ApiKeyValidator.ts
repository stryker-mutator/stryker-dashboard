import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { ProjectMapper } from '@stryker-mutator/dashboard-data-access';
import { timingSafeEqual } from 'crypto';

import util from '../utils/utils.js';
import DataAccess from './DataAccess.js';

@Injectable()
export class ApiKeyValidator {
  readonly #projectMapper: ProjectMapper;
  constructor({ repositoryMapper }: DataAccess) {
    this.#projectMapper = repositoryMapper;
  }

  public async validateApiKey(apiKey: string, projectName: string): Promise<void> {
    const lastDelimiter = projectName.lastIndexOf('/');
    const hash = util.generateHashValue(apiKey);
    if (lastDelimiter === -1) {
      throw new HttpException(`Repository "${projectName}" is invalid`, HttpStatus.BAD_REQUEST);
    } else {
      const repo = await this.#projectMapper.findOne({
        owner: projectName.substring(0, lastDelimiter),
        name: projectName.substring(lastDelimiter + 1),
      });
      const storedHash = repo?.model.apiKeyHash;
      if (!storedHash || !hashesEqual(storedHash, hash)) {
        throw new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}

/**
 * Compare two hashes in a timing safe manner using `crypto.timingSafeEqual`
 */
function hashesEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, 'hex');
  const bufferB = Buffer.from(b, 'hex');
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}
