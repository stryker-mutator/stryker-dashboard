import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import util from '../utils/utils.js';
import DataAccess from './DataAccess.js';
import { ProjectMapper } from '@stryker-mutator/dashboard-data-access';

@Injectable()
export class ApiKeyValidator {
  private readonly projectMapper: ProjectMapper;
  constructor({ repositoryMapper }: DataAccess) {
    this.projectMapper = repositoryMapper;
  }

  public async validateApiKey(apiKey: string, projectName: string): Promise<void> {
    const lastDelimiter = projectName.lastIndexOf('/');
    const hash = util.generateHashValue(apiKey);
    if (lastDelimiter === -1) {
      throw new HttpException(`Repository "${projectName}" is invalid`, HttpStatus.BAD_REQUEST);
    } else {
      const projectPromise = this.projectMapper.findOne({
        owner: projectName.substr(0, lastDelimiter),
        name: projectName.substr(lastDelimiter + 1),
      });
      const repo = await projectPromise;
      if (repo === null || repo.model.apiKeyHash !== hash) {
        throw new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}
