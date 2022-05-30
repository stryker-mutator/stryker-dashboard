import util from '../utils.js';
import { BadRequest, Unauthorized } from 'ts-httpexceptions';
import DataAccess from './DataAccess.js';
import { Service } from '@tsed/di';
import { ProjectMapper } from '@stryker-mutator/dashboard-data-access';

@Service()
export class ApiKeyValidator {
  private readonly projectMapper: ProjectMapper;
  constructor({ repositoryMapper }: DataAccess) {
    this.projectMapper = repositoryMapper;
  }

  public async validateApiKey(
    apiKey: string,
    projectName: string
  ): Promise<void> {
    const lastDelimiter = projectName.lastIndexOf('/');
    const hash = util.generateHashValue(apiKey);
    if (lastDelimiter === -1) {
      throw new BadRequest(`Repository "${projectName}" is invalid`);
    } else {
      const projectPromise = this.projectMapper.findOne({
        owner: projectName.substr(0, lastDelimiter),
        name: projectName.substr(lastDelimiter + 1),
      });
      const repo = await projectPromise;
      if (repo === null || repo.model.apiKeyHash !== hash) {
        throw new Unauthorized('Invalid API key');
      }
    }
  }
}
