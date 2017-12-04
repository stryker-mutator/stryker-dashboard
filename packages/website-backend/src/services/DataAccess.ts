import { Service } from 'ts-express-decorators';
import { ProjectMapper } from 'stryker-dashboard-data-access';

@Service()
export default class DataAccess {

    public readonly repositoryMapper: ProjectMapper;

    constructor() {
        this.repositoryMapper = new ProjectMapper();
        this.repositoryMapper.createTableIfNotExists();
    }
}