import { Service } from "ts-express-decorators";
import { ProjectMapper } from 'stryker-dashboard-data-access';

@Service()
export default class DataAccess {

    public readonly projectMapper: ProjectMapper;

    constructor() {
        this.projectMapper = new ProjectMapper();
        this.projectMapper.createTableIfNotExists();
    }
}