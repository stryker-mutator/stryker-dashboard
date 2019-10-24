import { generateHashValue } from '../utils';
import { BadRequest, Unauthorized } from 'ts-httpexceptions';
import DataAccess from './DataAccess';
import { Service } from '@tsed/di';
import { ProjectMapper } from '@stryker-mutator/dashboard-data-access';

@Service()
export class ApiKeyValidator {

  private readonly repositoryMapper: ProjectMapper;
  constructor({ repositoryMapper }: DataAccess) {
    this.repositoryMapper = repositoryMapper;
  }

  public async validateApiKey(apiKey: string, projectName: string): Promise<void> {
    const lastDelimiter = projectName.lastIndexOf('/');
    const hash = generateHashValue(apiKey);
    if (lastDelimiter === -1) {
      throw new BadRequest(`Repository "${projectName}" is invalid`);
    } else {
      const projectPromise = this.repositoryMapper.findOne({
        owner: projectName.substr(0, lastDelimiter),
        name: projectName.substr(lastDelimiter + 1)
      });
      const repo = await projectPromise;
      if (repo === null || repo.apiKeyHash !== hash) {
        throw new Unauthorized('Invalid API key');
      }
    }
  }
}
