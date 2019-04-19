import Project from './models/Project';
import Mapper from './Mapper';
import TableServiceAsPromised from './TableServiceAsPromised';

export default class ProjectMapper extends Mapper<Project> {
  constructor(tableService: TableServiceAsPromised = new TableServiceAsPromised()) {
    super('Project', 'owner', 'name', tableService);
  }
}
