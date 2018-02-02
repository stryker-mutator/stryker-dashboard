import { Service } from 'ts-express-decorators';
import { ProjectMapper, MutationScoreMapper } from 'stryker-dashboard-data-access';

@Service()
export default class DataAccess {

    public readonly repositoryMapper: ProjectMapper;
    public readonly mutationScoreMapper: MutationScoreMapper;

    constructor() {
        this.repositoryMapper = new ProjectMapper();
        this.mutationScoreMapper = new MutationScoreMapper();
        this.repositoryMapper.createTableIfNotExists();
        this.mutationScoreMapper.createTableIfNotExists();
    }
}